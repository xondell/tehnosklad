"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { PrimaryNav } from "@/components/layout/primary-nav";
import type { PublicSiteSettings } from "@/features/catalog/types";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
export function MobileMenu({
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
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const esc = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "Tab" && dialog.current) {
        const nodes = Array.from(
          dialog.current.querySelectorAll<HTMLElement>(
            "button:not([disabled]), a[href], input:not([disabled])",
          ),
        );
        const first = nodes[0];
        const last = nodes.at(-1);
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", esc);
    dialog.current?.querySelector<HTMLElement>("button")?.focus();
    return () => document.removeEventListener("keydown", esc);
  }, [open]);
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  return (
    <>
      <div className="flex items-center gap-1 lg:hidden">
        <Link
          aria-label={dictionary.navigation.search}
          className="icon-button"
          href={localizedPath(locale, "catalog")}
        >
          ⌕
        </Link>
        <a
          aria-label={dictionary.actions.call}
          className="icon-button"
          href={settings.phoneHref}
        >
          ☎
        </a>
        <button
          ref={trigger}
          aria-expanded={open}
          aria-label={dictionary.actions.menu}
          className="icon-button"
          type="button"
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <aside
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-label={dictionary.navigationLabel}
            className="ml-auto flex h-full w-[min(22rem,90vw)] flex-col bg-white p-5 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <strong>{dictionary.navigationLabel}</strong>
              <button
                aria-label={dictionary.actions.close}
                className="icon-button"
                type="button"
                onClick={close}
              >
                ×
              </button>
            </div>
            <div onClick={close}>
              <PrimaryNav locale={locale} dictionary={dictionary} mobile />
            </div>
            <div className="mt-4 border-t border-stone-200 pt-4">
              <LanguageSwitcher
                currentLocale={locale}
                label={dictionary.languageSwitcherLabel}
                alternateHref={alternateHref}
              />
            </div>
            <a className="button-primary mt-5" href={settings.phoneHref}>
              {dictionary.actions.call}: {settings.phoneDisplay}
            </a>
          </aside>
        </div>
      ) : null}
    </>
  );
}
