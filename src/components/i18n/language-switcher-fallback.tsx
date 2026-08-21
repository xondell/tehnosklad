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
      <ul className="flex h-[1.875rem] w-fit items-center rounded-[100vmax] border border-stone-300 bg-white shadow-sm">
        {locales.map((locale) => (
          <li key={locale}>
            <Link
              aria-current={locale === currentLocale ? "page" : undefined}
              aria-label={`${label}: ${locale === "ru" ? "Русский" : "Română"}`}
              className={`relative flex size-[1.625rem] items-center justify-center rounded-[100vmax] border text-xs font-black ${
                locale === currentLocale
                  ? "border-stone-950 bg-stone-950 text-white shadow-sm"
                  : "border-transparent bg-white text-stone-950"
              }`}
              href={
                locale !== currentLocale && alternateHref
                  ? alternateHref
                  : localizedPath(locale)
              }
              hrefLang={locale}
              lang={locale}
              replace
            >
              {locale.toUpperCase()}
              {locale === currentLocale ? (
                <span
                  aria-hidden="true"
                  className="absolute bottom-1 size-1 rounded-full bg-[var(--brand)]"
                />
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
