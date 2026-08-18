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
      className={`inline-flex min-h-11 shrink-0 items-center py-1 transition-opacity hover:opacity-90 ${className}`}
      href={localizedPath(locale)}
      aria-label={locale === "ru" ? "Техносклад" : "Tehnosklad"}
    >
      <svg
        viewBox="0 0 176 22"
        className="h-6 w-auto sm:h-7"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
      >
        <text
          x="0"
          y="18"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="0.04em"
        >
          <tspan fill={inverted ? "#FFFFFF" : "#171717"}>
            {locale === "ru" ? "ТЕХНО" : "TEHNO"}
          </tspan>
          <tspan fill="#F4C400">
            {locale === "ru" ? "СКЛАД" : "SKLAD"}
          </tspan>
        </text>
      </svg>
    </Link>
  );
}


