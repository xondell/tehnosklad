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
  console.info("Assistant request", {
    requestId,
    outcome: result.ok ? "provider_success" : result.code,
    provider: environment.provider,
    duration: durationBucket(started),
    fallbackUsed,
    referenceCount: references.length,
  });
  return { requestId, answer, references, fallbackUsed };
}
