import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/config";

export function Logo({ locale }: { locale: Locale }) {
  return (
    <Link
      className="inline-flex min-h-11 shrink-0 items-center rounded-lg bg-[var(--brand)] px-2 py-2 text-sm font-black tracking-[0.04em] text-black sm:px-3 sm:text-lg sm:tracking-[0.08em]"
      href={localizedPath(locale)}
      aria-label={locale === "ru" ? "Техносклад" : "Tehnosklad"}
    >
      {locale === "ru" ? "ТЕХНОСКЛАД" : "TEHNOSKLAD"}
    </Link>
  );
}
