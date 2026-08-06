"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ContactDialog } from "@/components/public/contact-dialog";
import type { PublicSiteSettings } from "@/features/catalog/types";
import { localizedPath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

type Message = {
  role: "user" | "assistant";
  content: string;
  references?: Array<{
    id: string;
    name: string;
    priceMinor: number;
    currency: string;
    stockStatus: string;
    url: string;
  }>;
};
export type AssistantWidgetProps = {
  locale: Locale;
  dictionary: Dictionary;
  settings: PublicSiteSettings;
  onClose: () => void;
};

export function AssistantWidget({
  locale,
  dictionary,
  settings,
  onClose,
}: AssistantWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: dictionary.assistant.welcome },
  ]);
  const [question, setQuestion] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) onClose();
      if (event.key === "Tab" && dialog.current) {
        const nodes = Array.from(
          dialog.current.querySelectorAll<HTMLElement>(
            "button:not([disabled]), a[href], textarea:not([disabled])",
          ),
        );
        const first = nodes[0],
          last = nodes.at(-1);
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
    document.addEventListener("keydown", close);
    dialog.current?.querySelector<HTMLElement>("button")?.focus();
    return () => document.removeEventListener("keydown", close);
  }, [onClose, pending]);
  function close() {
    if (pending) return;
    onClose();
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || pending) return;
    const history = messages
      .slice(-6)
      .map(({ role, content }) => ({ role, content }));
    setMessages((current) => [...current, { role: "user", content: trimmed }]);
    setQuestion("");
    setPending(true);
    setError(false);
    controller.current = new AbortController();
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, question: trimmed, history }),
        signal: controller.current.signal,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) throw new Error("assistant");
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer,
          references: data.references,
        },
      ]);
    } catch {
      setError(true);
    } finally {
      setPending(false);
      controller.current = null;
    }
  }
  function askQuickQuestion(question: string) {
    setQuestion(question);
    requestAnimationFrame(() =>
      dialog.current?.querySelector<HTMLTextAreaElement>("textarea")?.focus(),
    );
  }
  return (
    <>
      <div
        className="fixed inset-0 z-60 flex items-end justify-center bg-black/40 p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] sm:items-center"
        role="presentation"
      >
        <section
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={dictionary.assistant.title}
          className="flex max-h-[min(88dvh,640px)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-2xl"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-bold">{dictionary.assistant.title}</h2>
            <button
              type="button"
              onClick={close}
              aria-label={dictionary.assistant.close}
              className="icon-button shrink-0"
            >
              ×
            </button>
          </div>
          <p className="mt-2 text-xs text-stone-600">
            {dictionary.assistant.disclaimer}
          </p>
          <div
            className="mt-3 min-h-24 flex-1 space-y-3 overflow-y-auto"
            aria-live="polite"
          >
            {messages.length === 1 && messages[0]?.role === "assistant" ? (
              <div className="flex flex-wrap gap-2">
                {dictionary.assistant.quickQuestions.map((quick) => (
                  <button
                    className="min-h-11 rounded-full border px-3 py-2 text-left text-xs font-medium"
                    key={quick}
                    onClick={() => askQuickQuestion(quick)}
                    type="button"
                  >
                    {quick}
                  </button>
                ))}
              </div>
            ) : null}
            {messages.map((message, index) => (
              <div
                key={index}
                className={message.role === "user" ? "text-right" : "text-left"}
              >
                <p className="inline-block rounded-xl bg-stone-100 px-3 py-2 text-sm">
                  {message.content}
                </p>
                {message.references?.map((reference) => (
                  <Link
                    key={reference.id}
                    href={reference.url}
                    className="mt-2 block rounded-lg border p-2 text-sm font-medium hover:bg-stone-50"
                  >
                    {reference.name}
                    <span className="ml-2 text-stone-600">
                      {(reference.priceMinor / 100).toLocaleString(
                        locale === "ru" ? "ru-RU" : "ro-RO",
                      )}{" "}
                      {reference.currency}
                    </span>
                  </Link>
                ))}
              </div>
            ))}
            {pending ? (
              <p className="text-sm text-stone-600">
                {dictionary.assistant.loading}
              </p>
            ) : null}
            {error ? (
              <p className="text-sm text-red-700">
                {dictionary.assistant.unavailable}
              </p>
            ) : null}
          </div>
          <form className="mt-3 flex gap-2" onSubmit={submit}>
            <textarea
              aria-label={dictionary.assistant.placeholder}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              maxLength={600}
              rows={2}
              placeholder={dictionary.assistant.placeholder}
              className="min-w-0 flex-1 rounded border p-2 text-sm"
            />
            <button type="submit" disabled={pending} className="button-primary">
              {dictionary.assistant.send}
            </button>
          </form>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                controller.current?.abort();
              }}
              className="underline"
            >
              {dictionary.assistant.cancel}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setMessages([
                  {
                    role: "assistant",
                    content: dictionary.assistant.welcome,
                  },
                ]);
                setError(false);
              }}
              className="underline"
            >
              {dictionary.assistant.clear}
            </button>
            <Link className="underline" href={localizedPath(locale, "catalog")}>
              {dictionary.assistant.catalog}
            </Link>
            <button
              className="underline"
              onClick={() => setContactOpen(true)}
              type="button"
            >
              {dictionary.assistant.leaveRequest}
            </button>
          </div>
        </section>
      </div>
      {contactOpen ? (
        <ContactDialog
          dictionary={dictionary}
          locale={locale}
          settings={settings}
          source="home_contact"
          onClose={() => setContactOpen(false)}
        />
      ) : null}
    </>
  );
}
