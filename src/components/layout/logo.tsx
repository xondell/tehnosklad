import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/config";

export function Logo({ locale }: { locale: Locale }) {
  return (
    <Link
      className="inline-flex min-h-11 items-center rounded-lg bg-[var(--brand)] px-3 py-2 text-base font-black tracking-[0.08em] text-black sm:text-lg"
      href={localizedPath(locale)}
      aria-label="Tehnosklad"
    >
      ТЕХНОСКЛАД
    </Link>
  );
}
