import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

type PrimaryNavProps = {
  locale: Locale;
  dictionary: Dictionary;
  mobile?: boolean;
};

export function PrimaryNav({
  locale,
  dictionary,
  mobile = false,
}: PrimaryNavProps) {
  const links = [
    { href: localizedPath(locale), label: dictionary.navigation.home },
    ...(mobile
      ? [
          {
            href: localizedPath(locale, "catalog"),
            label: dictionary.navigation.catalog,
          },
        ]
      : []),
    {
      href: localizedPath(locale, "contacts"),
      label: dictionary.navigation.contacts,
    },
  ];

  return (
    <nav aria-label={dictionary.navigationLabel}>
      <ul
        className={
          mobile
            ? "flex flex-col gap-1 py-3"
            : "hidden items-center gap-1 lg:flex"
        }
      >
        {links.map((link) => (
          <li key={link.href}>
            <Link
              className="flex min-h-11 items-center rounded-lg px-3 font-semibold text-stone-700 hover:bg-stone-100 hover:text-black"
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
