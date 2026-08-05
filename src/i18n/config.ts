export const locales = ["ru", "ro"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function localizedPath(locale: Locale, path = ""): string {
  const normalizedPath = path === "/" ? "" : path.replace(/^\//, "");
  return `/${locale}${normalizedPath ? `/${normalizedPath}` : ""}`;
}
