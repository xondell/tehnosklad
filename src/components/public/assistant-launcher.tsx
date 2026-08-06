"use client";

import { useRef, useState, type ComponentType } from "react";

import type { AssistantWidgetProps } from "@/components/public/assistant-widget";
import type { PublicSiteSettings } from "@/features/catalog/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

export function AssistantLauncher({
  locale,
  dictionary,
  settings,
}: {
  locale: Locale;
  dictionary: Dictionary;
  settings: PublicSiteSettings;
}) {
  const launcher = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [Dialog, setDialog] =
    useState<ComponentType<AssistantWidgetProps> | null>(null);

  function openAssistant() {
    setOpen(true);
    void import("@/components/public/assistant-widget").then(
      ({ AssistantWidget }) => setDialog(() => AssistantWidget),
    );
  }

  return (
    <>
      <button
        ref={launcher}
        type="button"
        className="fixed bottom-20 right-4 z-40 rounded-full bg-yellow-400 px-4 py-3 text-sm font-bold text-stone-950 shadow-lg focus:outline-none focus:ring-2 focus:ring-stone-950 sm:bottom-5"
        aria-expanded={open}
        onClick={openAssistant}
      >
        {dictionary.assistant.open}
      </button>
      {open && Dialog ? (
        <Dialog
          locale={locale}
          dictionary={dictionary}
          settings={settings}
          onClose={() => {
            setOpen(false);
            requestAnimationFrame(() => launcher.current?.focus());
          }}
        />
      ) : null}
    </>
  );
}
