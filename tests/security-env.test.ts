import { afterEach, describe, expect, it, vi } from "vitest";

import { hasActiveAdminRole } from "@/features/admin/auth/role";
import { safeAdminRedirectTarget } from "@/features/admin/auth/redirect";
import { parseCatalogDataSource } from "@/lib/env/catalog";
import {
  getOptionalSupabasePublicEnvironment,
  getSupabasePublicEnvironment,
} from "@/lib/env/public";
import { EnvironmentConfigurationError } from "@/lib/env/shared";

describe("admin security helpers", () => {
  it("requires both an active profile and the exact admin role", () => {
    expect(hasActiveAdminRole({ is_active: true }, { role: "admin" })).toBe(
      true,
    );
    expect(hasActiveAdminRole({ is_active: false }, { role: "admin" })).toBe(
      false,
    );
    expect(
      hasActiveAdminRole({ is_active: true }, { role: "authenticated" }),
    ).toBe(false);
    expect(hasActiveAdminRole(null, { role: "admin" })).toBe(false);
  });

  it("allows only local admin redirect targets", () => {
    expect(safeAdminRedirectTarget("/admin/products?draft=1")).toBe(
      "/admin/products?draft=1",
    );
    for (const unsafe of [
      "https://evil.test/admin",
      "//evil.test/admin",
      "/catalog",
      "/administrator",
      "/admin%2F..%2Fcatalog",
      "/admin/login",
    ]) {
      expect(safeAdminRedirectTarget(unsafe)).toBe("/admin");
    }
  });
});

describe("catalog source environment", () => {
  it("defaults to demo only in development and test", () => {
    expect(parseCatalogDataSource(undefined, "development")).toBe("demo");
    expect(parseCatalogDataSource(undefined, "test")).toBe("demo");
    expect(() => parseCatalogDataSource(undefined, "production")).toThrow(
      EnvironmentConfigurationError,
    );
  });

  it("requires a recognized explicit source", () => {
    expect(parseCatalogDataSource("supabase", "production")).toBe("supabase");
    expect(() => parseCatalogDataSource("demo", "production")).toThrow(
      EnvironmentConfigurationError,
    );
    expect(() => parseCatalogDataSource("fallback", "test")).toThrow(
      EnvironmentConfigurationError,
    );
  });
});

describe("Supabase public environment", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("permits a completely absent optional config", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    expect(getOptionalSupabasePublicEnvironment()).toBeNull();
    expect(() => getSupabasePublicEnvironment()).toThrow(
      EnvironmentConfigurationError,
    );
  });

  it("rejects partial or invalid Supabase config", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    expect(() => getOptionalSupabasePublicEnvironment()).toThrow(
      EnvironmentConfigurationError,
    );
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "not-a-url");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable");
    expect(() => getSupabasePublicEnvironment()).toThrow(
      EnvironmentConfigurationError,
    );
  });
});
