import "server-only";

import {
  EnvironmentConfigurationError,
  requireEnvironmentVariables,
  requireValidUrl,
} from "@/lib/env/shared";

export function getSupabaseServiceRoleEnvironment() {
  const environment = requireEnvironmentVariables({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
  return {
    supabaseUrl: requireValidUrl(
      "NEXT_PUBLIC_SUPABASE_URL",
      environment.NEXT_PUBLIC_SUPABASE_URL,
    ),
    supabaseServiceRoleKey: environment.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export function getLeadSecurityEnvironment() {
  const environment = requireEnvironmentVariables({
    LEAD_IP_HASH_SECRET: process.env.LEAD_IP_HASH_SECRET,
  });
  if (environment.LEAD_IP_HASH_SECRET.trim().length < 32) {
    throw new EnvironmentConfigurationError(["LEAD_IP_HASH_SECRET"]);
  }
  return { leadHashSecret: environment.LEAD_IP_HASH_SECRET.trim() };
}

export type TelegramEnvironment = {
  botToken: string;
  chatId: string;
};

export function getOptionalTelegramEnvironment(): TelegramEnvironment | null {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!botToken && !chatId) return null;
  if (
    !botToken ||
    !chatId ||
    !/^\d{5,15}:[A-Za-z0-9_-]{20,}$/.test(botToken) ||
    !/^-?\d+$/.test(chatId)
  ) {
    throw new EnvironmentConfigurationError([
      "TELEGRAM_BOT_TOKEN",
      "TELEGRAM_CHAT_ID",
    ]);
  }
  return { botToken, chatId };
}
