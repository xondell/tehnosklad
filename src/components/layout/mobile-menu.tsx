"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { PrimaryNav } from "@/components/layout/primary-nav";
import type { PublicSiteSettings } from "@/features/catalog/types";
import type { Locale } from "@/i18n/config";
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
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openMenu = () => {
    setOpen(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setActive(true);
      });
    });
  };

  const close = () => {
    setActive(false);
    setTimeout(() => {
      setOpen(false);
      trigger.current?.focus();
    }, 280);
  };

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

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

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const drawerModal =
    open && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[100] flex justify-end lg:hidden overflow-hidden">
            {/* Backdrop: visual darkening over full screen, does NOT close on tap */}
            <div
              className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${
                active ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-hidden="true"
            />
            <aside
              ref={dialog}
              role="dialog"
              aria-modal="true"
              aria-label={dictionary.navigationLabel}
              style={{
                transform: active ? "translateX(0)" : "translateX(100%)",
                transition: "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              className="safe-bottom relative z-10 flex h-dvh w-[min(22rem,92vw)] flex-col overflow-y-auto bg-white p-5 pt-[max(1.25rem,env(safe-area-inset-top))] shadow-2xl will-change-transform"
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
              <a
                className="button-primary mt-5 gap-1.5"
                href={settings.phoneHref}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {dictionary.actions.call}: {settings.phoneDisplay}
              </a>
            </aside>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="flex items-center gap-1.5 lg:hidden">
        <LanguageSwitcher
          currentLocale={locale}
          label={dictionary.languageSwitcherLabel}
          alternateHref={alternateHref}
        />
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
          onClick={openMenu}
        >
          ☰
        </button>
      </div>
      {drawerModal}
    </>
  );
}
