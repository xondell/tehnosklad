import type { Locale } from "@/i18n/config";

export type AssistantHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};
export type AssistantReference = {
  id: string;
  name: string;
  category: string;
  priceMinor: number;
  currency: "MDL";
  stockStatus: "in_stock" | "out_of_stock" | "on_order";
  url: string;
};
export type AssistantRequest = {
  locale: Locale;
  question: string;
  history: AssistantHistoryMessage[];
};
export type AssistantResponse = {
  answer: string;
  references: AssistantReference[];
  fallbackUsed: boolean;
  requestId: string;
};
export type ProviderInput = {
  locale: Locale;
  question: string;
  history: AssistantHistoryMessage[];
  context: string;
};
export type ProviderResult =
  | { ok: true; answer: string; productIds: string[] }
  | {
      ok: false;
      code: "unavailable" | "timeout" | "rate_limited" | "malformed";
    };
export interface AssistantProvider {
  generateGroundedAnswer(input: ProviderInput): Promise<ProviderResult>;
}
