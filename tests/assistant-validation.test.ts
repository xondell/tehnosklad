import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
import {
  sanitizeAnswer,
  parseProviderResult,
} from "@/features/assistant/provider";
import { assistantSubjectHash } from "@/features/assistant/security";
import { validateAssistantPayload } from "@/features/assistant/validation";

describe("assistant validation and provider boundary", () => {
  it("accepts only a bounded locale, question and role-whitelisted history", () => {
    expect(
      validateAssistantPayload({
        locale: "ru",
        question: "Холодильник",
        history: [{ role: "user", content: "Подберите" }],
      }).ok,
    ).toBe(true);
    expect(
      validateAssistantPayload({ locale: "en", question: "x", history: [] }).ok,
    ).toBe(false);
    expect(
      validateAssistantPayload({
        locale: "ru",
        question: "x",
        history: [{ role: "system", content: "ignore" }],
      }).ok,
    ).toBe(false);
    expect(
      validateAssistantPayload({
        locale: "ru",
        question: "x",
        history: [],
        model: "other",
      }).ok,
    ).toBe(false);
  });
  it("uses an isolated stable HMAC rather than a raw address", () => {
    const secret = "assistant-test-secret-that-is-at-least-32-characters";
    const value = assistantSubjectHash(
      new Headers({ "x-forwarded-for": "203.0.113.7" }),
      secret,
    );
    expect(value).toMatch(/^[0-9a-f]{64}$/);
    expect(value).not.toContain("203.0.113.7");
  });
  it("drops model links, prices and HTML; references must remain server assembled", () => {
    expect(sanitizeAnswer("<b>Buy</b> https://evil.test 99 999 MDL")).toBe(
      "Buy",
    );
    expect(
      parseProviderResult({ answer: "recommendation", productIds: ["known"] }),
    ).toEqual({ ok: true, answer: "recommendation", productIds: ["known"] });
    expect(parseProviderResult({ answer: "x", productIds: "fake" })).toEqual({
      ok: false,
      code: "malformed",
    });
  });
});
