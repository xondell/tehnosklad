import {
  EnvironmentConfigurationError,
  requireEnvironmentVariables,
  requireValidUrl,
} from "@/lib/env/shared";

export type SupabasePublicEnvironment = {
  supabaseUrl: string;
  supabasePublishableKey: string;
};

export function getOptionalSupabasePublicEnvironment(): SupabasePublicEnvironment | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url && !key) return null;
  if (!url || !key) {
    throw new EnvironmentConfigurationError([
      !url
        ? "NEXT_PUBLIC_SUPABASE_URL"
        : "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    ]);
  }
  return {
    supabaseUrl: requireValidUrl("NEXT_PUBLIC_SUPABASE_URL", url),
    supabasePublishableKey: key,
  };
}

export function getSupabasePublicEnvironment(): SupabasePublicEnvironment {
  const environment = getOptionalSupabasePublicEnvironment();
  if (!environment) {
    throw new EnvironmentConfigurationError([
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    ]);
  }
  return environment;
}

export function getSiteUrl(): string {
  const environment = requireEnvironmentVariables({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });
  return requireValidUrl(
    "NEXT_PUBLIC_SITE_URL",
    environment.NEXT_PUBLIC_SITE_URL,
  );
}
