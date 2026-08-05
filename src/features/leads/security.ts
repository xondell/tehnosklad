import "server-only";

import { createHmac } from "node:crypto";
import { isIP } from "node:net";

import type { LeadSubmission } from "@/features/leads/types";

function hmac(secret: string, value: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function extractClientAddress(headers: Headers): string {
  for (const name of [
    "x-vercel-forwarded-for",
    "x-forwarded-for",
    "x-real-ip",
  ]) {
    const candidate = headers.get(name)?.split(",", 1)[0]?.trim();
    if (candidate && isIP(candidate)) return candidate;
  }
  return "unknown";
}

export function createLeadSecurityHashes(
  submission: LeadSubmission,
  clientAddress: string,
  secret: string,
) {
  const canonicalPayload = JSON.stringify({
    locale: submission.locale,
    source: submission.source,
    sourcePath: submission.sourcePath,
    name: submission.name,
    phone: submission.phone,
    telegramUsername: submission.telegramUsername,
    comment: submission.comment,
    productId: submission.productId,
    consentVersion: "stage-5-v1",
  });
  return {
    requestHash: hmac(secret, `request:${canonicalPayload}`),
    clientFingerprintHash: hmac(secret, `ip:${clientAddress}`),
    phoneHash: hmac(secret, `phone:${submission.phone}`),
  };
}
