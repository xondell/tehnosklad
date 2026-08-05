import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale, locales } from "@/i18n/config";

export const metadata: Metadata = {
  title: {
    default: "Tehnosklad — бытовая техника в Комрате",
    template: "%s | Tehnosklad",
  },
  description: "Магазин бытовой техники Tehnosklad в Комрате.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
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

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col">
        <a className="skip-link" href="#main-content">
          {dictionary.skipToContent}
        </a>
        <SiteHeader locale={locale} dictionary={dictionary} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale} dictionary={dictionary} />
      </body>
    </html>
  );
}
