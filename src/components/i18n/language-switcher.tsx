"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { locales, type Locale } from "@/i18n/config";

const languageNames: Record<Locale, string> = {
  ru: "RU",
  ro: "RO",
};

type LanguageSwitcherProps = {
  currentLocale: Locale;
  label: string;
  alternateHref?: string;
};

function pathForLocale(pathname: string, locale: Locale): string {
  const segments = pathname.split("/");

  if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  }

  return `/${locale}`;
}

export function LanguageSwitcher({
  currentLocale,
  label,
  alternateHref,
}: LanguageSwitcherProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={label}>
      <ul className="flex items-center rounded-lg border border-stone-300 bg-white p-1">
        {locales.map((locale) => {
          const isCurrent = locale === currentLocale;

          return (
            <li key={locale}>
              <Link
                aria-current={isCurrent ? "page" : undefined}
                className={`flex min-h-9 min-w-10 items-center justify-center rounded-md px-2 text-sm font-bold ${
                  isCurrent ? "bg-stone-900 text-white" : "hover:bg-stone-100"
                }`}
                href={
                  !isCurrent && alternateHref
                    ? alternateHref
                    : pathForLocale(pathname, locale)
                }
                hrefLang={locale}
                lang={locale}
              >
                {languageNames[locale]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
