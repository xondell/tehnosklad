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
      <ul className="flex h-[1.875rem] lg:h-9 w-fit items-center rounded-full border border-stone-300 bg-white p-0.5 shadow-2xs">
        {locales.map((locale) => (
          <li key={locale}>
            <Link
              aria-current={locale === currentLocale ? "page" : undefined}
              aria-label={`${label}: ${locale === "ru" ? "Русский" : "Română"}`}
              className={`relative flex h-[1.625rem] lg:h-8 w-[1.625rem] lg:w-9 items-center justify-center rounded-full text-xs font-black ${
                locale === currentLocale
                  ? "bg-stone-950 text-white shadow-xs"
                  : "bg-transparent text-stone-700 hover:bg-stone-100 hover:text-stone-950"
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
