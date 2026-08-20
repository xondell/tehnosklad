"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { locales, type Locale } from "@/i18n/config";

const languageNames: Record<Locale, string> = {
  ru: "RU",
  ro: "RO",
};

const languageFullNames: Record<Locale, string> = {
  ru: "Русский",
  ro: "Română",
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
  const searchParams = useSearchParams();

  return (
    <nav aria-label={label}>
      <ul className="flex h-[1.875rem] lg:h-9 w-fit items-center rounded-full border border-stone-300 bg-white p-0.5 shadow-2xs">
        {locales.map((locale) => {
          const isCurrent = locale === currentLocale;

          return (
            <li key={locale}>
              <Link
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`${label}: ${languageFullNames[locale]}`}
                className={`relative flex h-[1.625rem] lg:h-8 w-[1.625rem] lg:w-9 items-center justify-center rounded-full text-xs font-black transition-colors focus-visible:z-10 ${
                  isCurrent
                    ? "bg-stone-950 text-white shadow-xs"
                    : "bg-transparent text-stone-700 hover:bg-stone-100 hover:text-stone-950"
                }`}
                href={`${
                  !isCurrent && alternateHref
                    ? alternateHref
                    : pathForLocale(pathname, locale)
                }${searchParams.size ? `?${searchParams.toString()}` : ""}`}
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
