"use client";
import { useRef, useState } from "react";
import { ContactDialog } from "@/components/public/contact-dialog";
import type { PublicSiteSettings } from "@/features/catalog/types";
import type { Dictionary } from "@/i18n/types";
export function ContactButton({
  dictionary,
  label,
  productName,
  settings,
}: {
  dictionary: Dictionary;
  label: string;
  productName?: string;
  settings: PublicSiteSettings;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  function close() {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }
  return (
    <>
      <button
        ref={triggerRef}
        className="button-primary"
        type="button"
        onClick={() => setOpen(true)}
      >
        {label}
      </button>
      {open ? (
        <ContactDialog
          dictionary={dictionary}
          productName={productName}
          settings={settings}
          onClose={close}
        />
      ) : null}
    </>
  );
}
