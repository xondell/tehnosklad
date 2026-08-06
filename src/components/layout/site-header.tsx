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
      <PageContainer className="flex min-h-20 items-center gap-3 py-3">
        <Logo locale={locale} />
        <div className="ml-auto flex items-center gap-2">
          <PrimaryNav locale={locale} dictionary={dictionary} />
          <a
            className="button-secondary min-h-11 items-center max-lg:!hidden lg:inline-flex"
            href={`/` + locale + "/catalog"}
          >
            {dictionary.navigation.catalogMenu}
          </a>
          <a
            aria-label={dictionary.navigation.search}
            className="icon-button max-lg:!hidden lg:inline-flex"
            href={`/` + locale + "/catalog"}
          >
            ⌕
          </a>
          <a
            className="hidden text-sm font-bold xl:block"
            href={settings.phoneHref}
          >
            {settings.phoneDisplay}
          </a>
          <a
            className="hidden min-h-11 items-center rounded-lg bg-[var(--brand)] px-4 font-bold text-black hover:bg-[var(--brand-strong)] sm:inline-flex"
            href={settings.phoneHref}
          >
            {dictionary.actions.call}
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
