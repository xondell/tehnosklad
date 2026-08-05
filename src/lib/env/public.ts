import { requireEnvironmentVariables } from "@/lib/env/shared";

export type PublicEnvironment = {
  siteUrl: string;
  supabaseUrl: string;
  supabasePublishableKey: string;
};

export function getPublicEnvironment(): PublicEnvironment {
  const environment = requireEnvironmentVariables({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });

  return {
    siteUrl: environment.NEXT_PUBLIC_SITE_URL,
    supabaseUrl: environment.NEXT_PUBLIC_SUPABASE_URL,
    supabasePublishableKey: environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
}
