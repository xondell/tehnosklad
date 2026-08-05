import Link from "next/link";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale, localizedPath } from "@/i18n/config";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);

  return (
    <>
      <section className="bg-stone-100 py-14 sm:py-20">
        <PageContainer>
          <p className="mb-4 font-bold text-stone-600">
            {dictionary.home.eyebrow}
          </p>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            {dictionary.home.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-stone-600 sm:text-xl">
            {dictionary.home.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex min-h-12 items-center rounded-xl bg-[var(--brand)] px-5 font-bold text-black hover:bg-[var(--brand-strong)]"
              href={localizedPath(locale, "catalog")}
            >
              {dictionary.actions.openCatalog}
            </Link>
            <a
              className="inline-flex min-h-12 items-center rounded-xl border-2 border-stone-900 px-5 font-bold hover:bg-stone-900 hover:text-white"
              href={siteConfig.phoneHref}
            >
              {dictionary.actions.call}: {siteConfig.phoneDisplay}
            </a>
          </div>
        </PageContainer>
      </section>
      <PageContainer className="py-10">
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-stone-800">
          {dictionary.home.stageNote}
        </div>
      </PageContainer>
    </>
  );
}
