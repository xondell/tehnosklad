import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  getCategoryBySlug,
  getProductBySlug,
  getPublicSiteSettings,
} from "@/features/catalog/data";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale } from "@/i18n/config";

// The public shell is request-rendered; catalog queries have locale-aware
// five-minute data-cache entries below the UI boundary.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Tehnosklad — бытовая техника в Комрате",
    template: "%s | Tehnosklad",
  },
  description: "Магазин бытовой техники Tehnosklad в Комрате.",
};

async function alternateHrefFor(locale: "ru" | "ro", pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length !== 3 || segments[0] !== locale) return undefined;
  const targetLocale = locale === "ru" ? "ro" : "ru";
  let slug: string;
  try {
    slug = decodeURIComponent(segments[2]!);
  } catch {
    return undefined;
  }
  if (segments[1] === "category") {
    const category = await getCategoryBySlug(locale, slug);
    return category
      ? `/${targetLocale}/category/${category.alternateSlug}`
      : undefined;
  }
  if (segments[1] === "product") {
    const product = await getProductBySlug(locale, slug);
    return product
      ? `/${targetLocale}/product/${product.alternateSlug}`
      : undefined;
  }
  return undefined;
}

export default async function PublicLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const pathname =
    (await headers()).get("x-tehnosklad-pathname") ?? `/${locale}`;
  const [settings, alternateHref] = await Promise.all([
    getPublicSiteSettings(locale),
    alternateHrefFor(locale, pathname),
  ]);

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col">
        <a className="skip-link" href="#main-content">
          {dictionary.skipToContent}
        </a>
        <SiteHeader
          locale={locale}
          dictionary={dictionary}
          settings={settings}
          alternateHref={alternateHref}
        />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter
          locale={locale}
          dictionary={dictionary}
          settings={settings}
          alternateHref={alternateHref}
        />
      </body>
    </html>
  );
}
