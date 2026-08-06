import type { Locale } from "@/i18n/config";
import type { AssistantReference } from "@/features/assistant/types";
export function fallbackAnswer(
  locale: Locale,
  references: AssistantReference[],
): string {
  if (references.length)
    return locale === "ro"
      ? "Am găsit produse relevante în catalog. Verificați cardurile de mai jos pentru preț și disponibilitate actuală."
      : "Я нашёл подходящие товары в каталоге. Актуальные цену и наличие смотрите в карточках ниже.";
  return locale === "ro"
    ? "Nu am găsit suficiente date exacte în catalog. Încercați o altă formulare, deschideți catalogul sau sunați magazinul."
    : "В каталоге не нашлось точных данных. Попробуйте другой запрос, откройте каталог или позвоните в магазин.";
}
