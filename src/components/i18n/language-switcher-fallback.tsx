import Link from "next/link";

import { locales, type Locale, localizedPath } from "@/i18n/config";

export function LanguageSwitcherFallback({
  currentLocale,
  label,
}: {
  currentLocale: Locale;
  label: string;
}) {
  return (
    <nav aria-label={label}>
      <ul className="flex items-center rounded-lg border border-stone-300 bg-white p-1">
        {locales.map((locale) => (
          <li key={locale}>
            <Link
              aria-current={locale === currentLocale ? "page" : undefined}
              className={`flex min-h-9 min-w-10 items-center justify-center rounded-md px-2 text-sm font-bold ${
                locale === currentLocale
                  ? "bg-stone-900 text-white"
                  : "hover:bg-stone-100"
              }`}
              href={localizedPath(locale)}
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
