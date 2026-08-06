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
      <ul className="flex w-[6.25rem] items-center rounded-xl border border-stone-400 bg-white p-1 shadow-sm">
        {locales.map((locale) => (
          <li key={locale}>
            <Link
              aria-current={locale === currentLocale ? "page" : undefined}
              aria-label={`${label}: ${locale === "ru" ? "Русский" : "Română"}`}
              className={`relative flex size-11 shrink-0 items-center justify-center rounded-lg border text-sm font-black ${
                locale === currentLocale
                  ? "border-stone-950 bg-stone-950 text-white shadow-sm"
                  : "border-transparent bg-white text-stone-950 hover:border-stone-400 hover:bg-amber-100 active:bg-amber-200"
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
