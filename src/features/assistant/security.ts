import "server-only";
import { createHmac } from "node:crypto";
import { isIP } from "node:net";

export function assistantSubjectHash(headers: Headers, secret: string): string {
  const raw =
    ["x-vercel-forwarded-for", "x-forwarded-for", "x-real-ip"]
      .map((name) => headers.get(name)?.split(",", 1)[0]?.trim())
      .find((value): value is string => Boolean(value && isIP(value))) ??
    "unknown";
  return createHmac("sha256", secret)
    .update(`assistant-ip:${raw}`)
    .digest("hex");
}
