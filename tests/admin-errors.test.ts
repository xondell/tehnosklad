import { describe, expect, it } from "vitest";

import { sanitizeAdminError } from "@/features/admin/errors";

describe("admin error sanitization", () => {
  it("maps known integrity errors to a safe message", () => {
    const error = sanitizeAdminError({
      code: "P0001",
      message: "Published product is missing a required attribute",
      details: "secret SQL details",
    });
    expect(error.code).toBe("missing a required attribute");
    expect(error.message).toContain("обязательные характеристики");
    expect(error.message).not.toContain("secret");
  });

  it("does not expose unknown SQL, tokens or stack traces", () => {
    const error = sanitizeAdminError({
      code: "XX000",
      message: "token=secret select * from private.table",
      stack: "private stack",
    });
    expect(error.code).toBe("operation_failed");
    expect(error.message).toBe(
      "Операция не выполнена. Проверьте данные и повторите попытку.",
    );
  });
});
