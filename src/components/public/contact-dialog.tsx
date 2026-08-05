"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CopyPhoneButton } from "@/components/public/copy-phone-button";
import type { PublicSiteSettings } from "@/features/catalog/types";
import type { Dictionary } from "@/i18n/types";

type Errors = { name?: string; phone?: string; consent?: string };
export function validateLead(
  values: { name: string; phone: string; consent: boolean },
  dictionary: Dictionary,
): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = dictionary.contactModal.required;
  if (!values.phone.trim() || values.phone.replace(/\D/g, "").length < 7)
    errors.phone = dictionary.contactModal.phoneError;
  if (!values.consent) errors.consent = dictionary.contactModal.consentError;
  return errors;
}
export function ContactDialog({
  dictionary,
  productName,
  settings,
  onClose,
}: {
  dictionary: Dictionary;
  productName?: string;
  settings: PublicSiteSettings;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [tab, setTab] = useState<"now" | "request">("now");
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState(false);
  useEffect(() => {
    closeRef.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled])",
          ),
        );
        const first = focusable[0];
        const last = focusable.at(-1);
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
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [onClose]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = validateLead(
      {
        name: String(data.get("name") ?? ""),
        phone: String(data.get("phone") ?? ""),
        consent: data.get("consent") === "on",
      },
      dictionary,
    );
    setErrors(next);
    setNotice(Object.keys(next).length === 0);
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-3 sm:items-center"
      role="presentation"
    >
      <div
        aria-labelledby="contact-dialog-title"
        aria-modal="true"
        ref={dialogRef}
        className="max-h-[calc(100vh-1.5rem)] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
        role="dialog"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 id="contact-dialog-title" className="text-2xl font-black">
            {dictionary.contactModal.title}
          </h2>
          <button
            ref={closeRef}
            aria-label={dictionary.actions.close}
            className="icon-button"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="mt-5 grid grid-cols-2 rounded-xl bg-stone-100 p-1">
          <button
            className={`min-h-11 rounded-lg font-bold ${tab === "now" ? "bg-white shadow-sm" : ""}`}
            type="button"
            onClick={() => setTab("now")}
          >
            {dictionary.contactModal.now}
          </button>
          <button
            className={`min-h-11 rounded-lg font-bold ${tab === "request" ? "bg-white shadow-sm" : ""}`}
            type="button"
            onClick={() => setTab("request")}
          >
            {dictionary.contactModal.request}
          </button>
        </div>
        {tab === "now" ? (
          <div className="space-y-5 py-6">
            <div>
              <p className="text-sm font-bold text-stone-500">
                {dictionary.contactModal.phoneTitle}
              </p>
              <a
                className="mt-1 block text-2xl font-black hover:underline"
                href={settings.phoneHref}
              >
                {settings.phoneDisplay}
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              <a className="button-primary" href={settings.phoneHref}>
                {dictionary.actions.call}
              </a>
              <CopyPhoneButton
                copy={dictionary.actions.copy}
                copied={dictionary.actions.copied}
                phone={settings.phoneDisplay}
              />
            </div>
            <div className="rounded-xl bg-stone-100 p-4">
              <p className="font-bold">{dictionary.contactModal.hoursTitle}</p>
              <p className="mt-1 text-stone-600">
                {settings.openDays}: {settings.openTime}
              </p>
              <p className="text-stone-600">{settings.closedDay}</p>
            </div>
          </div>
        ) : (
          <form className="space-y-4 py-6" onSubmit={submit}>
            <p className="text-sm text-stone-600">
              {productName ? productName : dictionary.contactModal.formTitle}
            </p>
            <label className="field-label">
              {dictionary.contactModal.name}
              <input
                aria-invalid={Boolean(errors.name)}
                className="field"
                name="name"
              />
              {errors.name ? (
                <span className="field-error">{errors.name}</span>
              ) : null}
            </label>
            <label className="field-label">
              {dictionary.contactModal.phone}
              <input
                aria-invalid={Boolean(errors.phone)}
                className="field"
                inputMode="tel"
                name="phone"
                type="tel"
              />
              {errors.phone ? (
                <span className="field-error">{errors.phone}</span>
              ) : null}
            </label>
            <label className="field-label">
              {dictionary.contactModal.telegram}
              <input className="field" name="telegram" />
            </label>
            <label className="field-label">
              {dictionary.contactModal.comment}
              <textarea className="field min-h-24" name="comment" />
            </label>
            <label className="flex gap-3 text-sm">
              <input
                aria-invalid={Boolean(errors.consent)}
                className="mt-1 size-4"
                name="consent"
                type="checkbox"
              />
              <span>
                {dictionary.contactModal.consent}
                {errors.consent ? (
                  <span className="field-error block">{errors.consent}</span>
                ) : null}
              </span>
            </label>
            <button className="button-primary w-full" type="submit">
              {dictionary.contactModal.submit}
            </button>
            {notice ? (
              <p
                aria-live="polite"
                className="rounded-lg bg-amber-50 p-3 text-sm text-stone-700"
              >
                {dictionary.contactModal.unavailable}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
}
