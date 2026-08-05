import "server-only";

import { requireEnvironmentVariables } from "@/lib/env/shared";

export function getSupabaseServiceRoleEnvironment() {
  const environment = requireEnvironmentVariables({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
  return {
    supabaseUrl: environment.NEXT_PUBLIC_SUPABASE_URL,
    supabaseServiceRoleKey: environment.SUPABASE_SERVICE_ROLE_KEY,
  };
}
