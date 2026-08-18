import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { Logo } from "@/components/layout/logo";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { PageContainer } from "@/components/layout/page-container";
import { PrimaryNav } from "@/components/layout/primary-nav";
import type { PublicSiteSettings } from "@/features/catalog/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

export function SiteHeader({
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
    <header className="site-header" data-testid="site-header">
      <PageContainer className="flex min-h-16 items-center gap-3 py-2.5 sm:py-3">
        <Logo locale={locale} />
        <div className="ml-5 hidden lg:block xl:ml-8">
          <PrimaryNav locale={locale} dictionary={dictionary} />
        </div>
        <div className="ml-auto flex items-center gap-3.5 sm:gap-4">
          <a
            className="button-primary hidden items-center gap-1.5 whitespace-nowrap text-xs font-bold sm:inline-flex"
            href={settings.phoneHref}
          >
            <svg
              className="size-3.5 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" />
            </svg>
            <span>{dictionary.actions.call}</span>
            <span>{settings.phoneDisplay}</span>
          </a>
          <div className="hidden sm:block">
            <LanguageSwitcher
              currentLocale={locale}
              label={dictionary.languageSwitcherLabel}
              alternateHref={alternateHref}
            />
          </div>
          <MobileMenu
            locale={locale}
            dictionary={dictionary}
            settings={settings}
            alternateHref={alternateHref}
          />
        </div>
      </PageContainer>
    </header>
  );
}
