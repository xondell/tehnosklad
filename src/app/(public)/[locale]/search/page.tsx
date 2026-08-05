import { notFound } from "next/navigation";

import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale } from "@/i18n/config";

export default async function SearchPage({
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
      title={dictionary.routeShell.searchTitle}
      description={dictionary.routeShell.catalogDescription}
    />
  );
}
