import Link from "next/link";
import { Suspense } from "react";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LanguageSwitcherFallback } from "@/components/i18n/language-switcher-fallback";
import { Logo } from "@/components/layout/logo";
import { PageContainer } from "@/components/layout/page-container";
import { siteConfig } from "@/config/site";
import type { PublicSiteSettings } from "@/features/catalog/types";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

export function SiteFooter({
  locale,
  dictionary,
  settings,
  alternateHref,
}: {
  locale: Locale;
  dictionary: Dictionary;
  settings: PublicSiteSettings;
  alternateHref?: string;
}) {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-950 text-white">
      <PageContainer className="grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo locale={locale} />
          <p className="text-sm text-stone-300">
            {dictionary.footer.description}
          </p>
          <p className="text-sm text-stone-300">{settings.address}</p>
          <a
            className="inline-flex min-h-11 items-center font-bold"
            href={settings.phoneHref}
          >
            {settings.phoneDisplay}
          </a>
        </div>
        <div>
          <h2 className="mb-3 font-bold">{dictionary.footer.schedule}</h2>
          <p className="text-sm text-stone-300">
            {settings.openDays}: {settings.openTime}
          </p>
          <p className="text-sm text-stone-300">{settings.closedDay}</p>
        </div>
        <div>
          <h2 className="mb-3 font-bold">{dictionary.footer.catalog}</h2>
          <Link
            className="text-sm text-stone-300 hover:text-white"
            href={localizedPath(locale, "catalog")}
          >
            {dictionary.navigation.catalog}
          </Link>
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
                  alternateHref={alternateHref}
                />
              }
            >
              <LanguageSwitcher
                currentLocale={locale}
                label={dictionary.languageSwitcherLabel}
                alternateHref={alternateHref}
              />
            </Suspense>
          </div>
        </div>
      </PageContainer>
      <div className="border-t border-stone-800">
        <PageContainer className="flex flex-col gap-2 py-4 text-sm text-stone-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}.{" "}
            {dictionary.footer.rights}
          </span>
          <span>
            {dictionary.footer.developedBy}{" "}
            <a
              aria-label={dictionary.footer.osmiLinkLabel}
              className="inline-flex min-h-11 items-center font-bold text-stone-200 underline decoration-stone-500 underline-offset-4 hover:text-white"
              href="https://osmi-topaz.vercel.app"
              rel="noopener noreferrer"
              target="_blank"
            >
              OSMI
            </a>
          </span>
        </PageContainer>
      </div>
    </footer>
  );
}
