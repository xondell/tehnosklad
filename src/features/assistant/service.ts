import "server-only";
import { randomUUID } from "node:crypto";
import {
  buildAssistantContext,
  referencesForIds,
} from "@/features/assistant/grounding";
import { fallbackAnswer } from "@/features/assistant/fallback";
import {
  DeterministicProvider,
  OpenAiCompatibleProvider,
} from "@/features/assistant/provider";
import type {
  AssistantRequest,
  AssistantResponse,
} from "@/features/assistant/types";
import { getAssistantEnvironment } from "@/lib/env/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service";

function durationBucket(start: number) {
  const elapsed = Date.now() - start;
  return elapsed < 250 ? "lt_250" : elapsed < 1_000 ? "lt_1000" : "gte_1000";
}
export async function answerAssistant(
  request: AssistantRequest,
): Promise<AssistantResponse> {
  const requestId = randomUUID();
  const started = Date.now();
  const grounding = await buildAssistantContext(
    request.locale,
    request.question,
  );
  const environment = getAssistantEnvironment();
  const provider =
    environment.provider === "openai-compatible"
      ? new OpenAiCompatibleProvider(environment)
      : new DeterministicProvider();
  const result = await provider.generateGroundedAnswer({
    locale: request.locale,
    question: request.question,
    context: grounding.context,
  });
  const fallbackUsed = !result.ok;
  const references = result.ok
    ? referencesForIds(grounding.products, request.locale, result.productIds)
    : grounding.references;
  const answer = result.ok
    ? result.answer
    : fallbackAnswer(request.locale, references);
  const telemetry = {
    requestId,
    outcome: result.ok ? "provider_success" : result.code,
    provider: environment.provider,
    duration: durationBucket(started),
    fallbackUsed,
    referenceCount: references.length,
  };
  console.info("Assistant request", telemetry);
  // Best effort only: the assistant remains available if telemetry is down.
  void (async () => {
    const { error } = await createServiceRoleSupabaseClient()
      .from("assistant_logs")
      .insert({
        request_id: requestId,
        locale: request.locale,
        outcome: telemetry.outcome,
        provider: telemetry.provider,
        duration_bucket: telemetry.duration,
        fallback_used: telemetry.fallbackUsed,
        reference_count: telemetry.referenceCount,
      });
    if (error)
      console.error("Assistant telemetry failed", {
        code: "assistant_telemetry_failed",
      });
  })().catch(() =>
    console.error("Assistant telemetry failed", {
      code: "assistant_telemetry_failed",
    }),
  );
  return { requestId, answer, references, fallbackUsed };
}
