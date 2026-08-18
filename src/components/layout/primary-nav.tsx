"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname() || "";

  const homeHref = localizedPath(locale);
  const catalogHref = localizedPath(locale, "catalog");
  const contactsHref = localizedPath(locale, "contacts");

  const links = [
    {
      href: homeHref,
      label: dictionary.navigation.home,
      isActive: pathname === homeHref || pathname === homeHref + "/",
    },
    {
      href: catalogHref,
      label: dictionary.navigation.catalog,
      isActive:
        pathname.startsWith(catalogHref) ||
        pathname.startsWith(localizedPath(locale, "category")) ||
        pathname.startsWith(localizedPath(locale, "product")),
    },
    {
      href: contactsHref,
      label: dictionary.navigation.contacts,
      isActive: pathname.startsWith(contactsHref),
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
              className={`nav-link ${link.isActive ? "nav-link--active" : ""}`}
              href={link.href}
              aria-current={link.isActive ? "page" : undefined}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

