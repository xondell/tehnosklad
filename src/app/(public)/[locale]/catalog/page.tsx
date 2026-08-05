import { notFound } from "next/navigation";
import { CatalogClient } from "@/components/catalog/catalog-client";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { PageContainer } from "@/components/layout/page-container";
import {
  getPublishedCategories,
  getPublishedProducts,
  getPublicSiteSettings,
  isDemoCatalog,
} from "@/features/catalog/data";
import { buildCatalogFacets } from "@/features/catalog/facets";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale } from "@/i18n/config";
export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const [categories, products, settings] = await Promise.all([
    getPublishedCategories(locale),
    getPublishedProducts(locale),
    getPublicSiteSettings(locale),
  ]);
  return (
    <PageContainer className="py-8 sm:py-12">
      <Breadcrumbs
        locale={locale}
        home={d.common.breadcrumbsHome}
        items={[d.catalog.title]}
      />
      <h1 className="mt-5 text-4xl font-black">{d.catalog.title}</h1>
      <p className="mt-3 max-w-3xl text-stone-600">{d.catalog.description}</p>
      {isDemoCatalog() ? (
        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-stone-500">
          {d.common.demoNotice}
        </p>
      ) : null}
      <div className="mt-8">
        <CatalogClient
          locale={locale}
          dictionary={d}
          categories={categories}
          products={products}
          facets={buildCatalogFacets(products)}
          settings={settings}
        />
      </div>
    </PageContainer>
  );
}
