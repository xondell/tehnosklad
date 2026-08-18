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
  function cancelAndClose() {
    controller.current?.abort();
    onClose();
  }
  function clearConversation() {
    controller.current?.abort();
    controller.current = null;
    setMessages([]);
    setQuestion("");
    setPending(false);
    setError(false);
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
    const requestController = new AbortController();
    controller.current = requestController;
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, question: trimmed, history }),
        signal: requestController.signal,
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
    } catch (requestError) {
      if (
        requestError instanceof DOMException &&
        requestError.name === "AbortError"
      ) {
        return;
      }
      setError(true);
    } finally {
      if (controller.current === requestController) {
        setPending(false);
        controller.current = null;
      }
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
          className="flex max-h-[min(88dvh,640px)] w-full max-w-md flex-col overflow-hidden rounded-[2rem] bg-white p-5 shadow-2xl"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-black">{dictionary.assistant.title}</h2>
            <button
              type="button"
              onClick={close}
              aria-label={dictionary.assistant.close}
              className="icon-button shrink-0"
            >
              ×
            </button>
          </div>
          <p className="mt-1 text-xs text-stone-500">
            {dictionary.assistant.disclaimer}
          </p>
          <div
            className="mt-4 min-h-24 flex-1 space-y-3 overflow-y-auto"
            aria-live="polite"
          >
            {messages.length === 0 ||
            (messages.length === 1 && messages[0]?.role === "assistant") ? (
              <div className="flex flex-wrap gap-1.5">
                {dictionary.assistant.quickQuestions.map((quick) => (
                  <button
                    className="rounded-full border border-stone-200 bg-stone-50/80 px-3.5 py-2 text-left text-xs font-semibold text-stone-800 transition-colors hover:border-stone-400"
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
                <p className={`inline-block rounded-2xl px-4 py-2.5 text-sm ${message.role === "user" ? "bg-[var(--brand)] text-black" : "bg-stone-100 text-stone-900"}`}>
                  {message.content}
                </p>
                {message.references?.map((reference) => (
                  <Link
                    key={reference.id}
                    href={reference.url}
                    className="mt-2 block rounded-2xl border border-stone-200 bg-white p-3 text-sm font-medium transition-shadow hover:shadow-sm"
                  >
                    {reference.name}
                    <span className="ml-2 font-bold text-stone-900">
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
            <div className="min-w-0 flex-1">
              <textarea
                aria-label={dictionary.assistant.placeholder}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                maxLength={600}
                rows={2}
                placeholder={dictionary.assistant.placeholder}
                className="field min-h-12 w-full resize-none rounded-2xl p-2.5 text-sm"
              />
            </div>
            <button type="submit" disabled={pending} className="button-primary">
              {dictionary.assistant.send}
            </button>
          </form>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <button
              type="button"
              onClick={cancelAndClose}
              className="underline"
            >
              {dictionary.assistant.cancel}
            </button>
            <button
              type="button"
              onClick={clearConversation}
              className="underline"
            >
              {dictionary.assistant.clear}
            </button>
            <Link
              className="underline"
              href={localizedPath(locale, "catalog")}
              onClick={cancelAndClose}
            >
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
