import { notFound } from "next/navigation";

import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale } from "@/i18n/config";

export default async function PersonalDataPage({
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
      title={dictionary.footer.personalData}
      description={dictionary.home.stageNote}
    />
  );
}
