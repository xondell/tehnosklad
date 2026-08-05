import { notFound } from "next/navigation";

import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale } from "@/i18n/config";

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);

  return (
    <RoutePlaceholder
      eyebrow="Tehnosklad"
      title={dictionary.routeShell.contactsTitle}
      description={`${siteConfig.address} · ${siteConfig.phoneDisplay}`}
    />
  );
}
