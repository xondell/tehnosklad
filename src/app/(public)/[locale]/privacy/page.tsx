import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale } from "@/i18n/config";
import { buildLocalizedMetadata } from "@/features/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const other = locale === "ru" ? "ro" : "ru";
  return buildLocalizedMetadata({
    locale,
    title: d.footer.privacy,
    description: d.legal.privacyIntro,
    currentPath: `/${locale}/privacy`,
    alternatePath: `/${other}/privacy`,
    index: false,
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  return (
    <PageContainer className="max-w-3xl py-10 sm:py-14">
      <h1 className="text-4xl font-black">{d.footer.privacy}</h1>
      <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-stone-700">
        {d.legal.draft}
      </p>
      <p className="mt-6 text-stone-700">{d.legal.privacyIntro}</p>
      <div className="mt-8 space-y-6">
        {d.legal.privacySections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-black">{section.title}</h2>
            <p className="mt-2 text-stone-700">{section.text}</p>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
