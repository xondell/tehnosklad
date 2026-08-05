import Link from "next/link";
import { Suspense } from "react";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LanguageSwitcherFallback } from "@/components/i18n/language-switcher-fallback";
import { Logo } from "@/components/layout/logo";
import { PageContainer } from "@/components/layout/page-container";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

export function SiteFooter({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-950 text-white">
      <PageContainer className="grid gap-8 py-10 md:grid-cols-3">
        <div className="space-y-4">
          <Logo locale={locale} />
          <p className="text-sm text-stone-300">{siteConfig.address}</p>
          <a
            className="inline-flex min-h-11 items-center font-bold"
            href={siteConfig.phoneHref}
          >
            {siteConfig.phoneDisplay}
          </a>
        </div>
        <div>
          <h2 className="mb-3 font-bold">{dictionary.footer.schedule}</h2>
          <p className="text-sm text-stone-300">
            {siteConfig.hours.openDays}: {siteConfig.hours.openTime}
          </p>
          <p className="text-sm text-stone-300">{siteConfig.hours.closedDay}</p>
        </div>
        <div>
          <h2 className="mb-3 font-bold">{dictionary.footer.legal}</h2>
          <ul className="space-y-2 text-sm text-stone-300">
            <li>
              <Link href={localizedPath(locale, "privacy")}>
                {dictionary.footer.privacy}
              </Link>
            </li>
            <li>
              <Link href={localizedPath(locale, "personal-data")}>
                {dictionary.footer.personalData}
              </Link>
            </li>
          </ul>
          <div className="mt-5 text-black">
            <Suspense
              fallback={
                <LanguageSwitcherFallback
                  currentLocale={locale}
                  label={dictionary.languageSwitcherLabel}
                />
              }
            >
              <LanguageSwitcher
                currentLocale={locale}
                label={dictionary.languageSwitcherLabel}
              />
            </Suspense>
          </div>
        </div>
      </PageContainer>
      <div className="border-t border-stone-800">
        <PageContainer className="py-4 text-sm text-stone-400">
          © {new Date().getFullYear()} {siteConfig.name}.{" "}
          {dictionary.footer.rights}
        </PageContainer>
      </div>
    </footer>
  );
}
