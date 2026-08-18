import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/config";

export function Logo({
  locale,
  className = "",
  inverted = false,
}: {
  locale: Locale;
  className?: string;
  inverted?: boolean;
}) {
  return (
    <Link
      className={`inline-flex min-h-11 shrink-0 items-center py-1 text-xl font-black tracking-[0.03em] transition-opacity hover:opacity-90 sm:text-2xl sm:tracking-[0.05em] ${className}`}
      href={localizedPath(locale)}
      aria-label={locale === "ru" ? "Техносклад" : "Tehnosklad"}
    >
      <span className={inverted ? "text-white" : "text-black"}>
        {locale === "ru" ? "ТЕХНО" : "TEHNO"}
      </span>
      <span className="text-[var(--brand)]">
        {locale === "ru" ? "СКЛАД" : "SKLAD"}
      </span>
    </Link>
  );
}

