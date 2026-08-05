import { Suspense } from "react";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LanguageSwitcherFallback } from "@/components/i18n/language-switcher-fallback";
import { Logo } from "@/components/layout/logo";
import { PageContainer } from "@/components/layout/page-container";
import { PrimaryNav } from "@/components/layout/primary-nav";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

export function SiteHeader({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <header className="border-b border-stone-200 bg-white">
      <PageContainer className="flex min-h-20 items-center gap-3 py-3">
        <Logo locale={locale} />
        <div className="ml-auto flex items-center gap-2">
          <PrimaryNav locale={locale} dictionary={dictionary} />
          <a
            className="hidden min-h-11 items-center rounded-lg bg-[var(--brand)] px-4 font-bold text-black hover:bg-[var(--brand-strong)] sm:inline-flex"
            href={siteConfig.phoneHref}
          >
            {dictionary.actions.call}
          </a>
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
      </PageContainer>
      <PageContainer className="lg:hidden">
        <details className="border-t border-stone-200">
          <summary className="flex min-h-12 cursor-pointer items-center font-bold">
            {dictionary.navigationLabel}
          </summary>
          <PrimaryNav locale={locale} dictionary={dictionary} mobile />
        </details>
      </PageContainer>
    </header>
  );
}
