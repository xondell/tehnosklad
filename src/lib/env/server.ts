import { requireEnvironmentVariables } from "@/lib/env/shared";

export type ServerEnvironment = {
  supabaseServiceRoleKey: string;
  telegramBotToken: string;
  telegramChatId: string;
  aiProvider: string;
  aiProviderApiKey: string;
};

export function getServerEnvironment(): ServerEnvironment {
  if (typeof window !== "undefined") {
    throw new Error("Server environment cannot be read in the browser.");
  }

  const environment = requireEnvironmentVariables({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
    AI_PROVIDER: process.env.AI_PROVIDER,
    AI_PROVIDER_API_KEY: process.env.AI_PROVIDER_API_KEY,
  });

  return {
    supabaseServiceRoleKey: environment.SUPABASE_SERVICE_ROLE_KEY,
    telegramBotToken: environment.TELEGRAM_BOT_TOKEN,
    telegramChatId: environment.TELEGRAM_CHAT_ID,
    aiProvider: environment.AI_PROVIDER,
    aiProviderApiKey: environment.AI_PROVIDER_API_KEY,
  };
}
