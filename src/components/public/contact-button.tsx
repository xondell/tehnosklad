"use client";
import { useRef, useState } from "react";
import { ContactDialog } from "@/components/public/contact-dialog";
import type { Dictionary } from "@/i18n/types";
export function ContactButton({
  dictionary,
  label,
  productName,
}: {
  dictionary: Dictionary;
  label: string;
  productName?: string;
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
          onClose={close}
        />
      ) : null}
    </>
  );
}
