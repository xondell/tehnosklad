import { notFound } from "next/navigation";

import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale } from "@/i18n/config";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);

  return (
    <RoutePlaceholder
      eyebrow={dictionary.routeShell.productTitle}
      title={slug}
      description={dictionary.routeShell.catalogDescription}
    />
  );
}
