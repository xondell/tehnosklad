import Link from "next/link";

import { locales, type Locale, localizedPath } from "@/i18n/config";

export function LanguageSwitcherFallback({
  currentLocale,
  label,
  alternateHref,
}: {
  currentLocale: Locale;
  label: string;
  alternateHref?: string;
}) {
  return (
    <nav aria-label={label}>
      <ul className="flex items-center rounded-full border border-stone-200 bg-white p-0.5 shadow-sm">
        {locales.map((locale) => (
          <li key={locale}>
            <Link
              aria-current={locale === currentLocale ? "page" : undefined}
              aria-label={`${label}: ${locale === "ru" ? "Русский" : "Română"}`}
              className={`relative flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
                locale === currentLocale
                  ? "bg-stone-950 text-white shadow-sm"
                  : "bg-transparent text-stone-700 hover:text-black hover:bg-stone-100"
              }`}
              href={
                locale !== currentLocale && alternateHref
                  ? alternateHref
                  : localizedPath(locale)
              }
              hrefLang={locale}
              lang={locale}
            >
              {locale.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
