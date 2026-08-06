import { describe, expect, it } from "vitest";

import { isAllowedMutationOrigin } from "@/lib/request-origin-logic";

describe("mutation origin allowlist", () => {
  const production = { siteUrl: "https://tehnosklad.example" };

  it("accepts only the canonical production origin", () => {
    expect(
      isAllowedMutationOrigin("https://tehnosklad.example", production),
    ).toBe(true);
    expect(
      isAllowedMutationOrigin("https://attacker.example", production),
    ).toBe(false);
  });

  it("accepts only the exact Vercel system preview host", () => {
    const preview = {
      ...production,
      vercelEnvironment: "preview",
      vercelUrl: "tehnosklad-git-main-boris-llc.vercel.app",
    };
    expect(
      isAllowedMutationOrigin(
        "https://tehnosklad-git-main-boris-llc.vercel.app",
        preview,
      ),
    ).toBe(true);
    expect(isAllowedMutationOrigin("https://other.vercel.app", preview)).toBe(
      false,
    );
  });
});
