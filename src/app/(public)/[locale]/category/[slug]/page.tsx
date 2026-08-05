import { notFound } from "next/navigation";
import { CatalogClient } from "@/components/catalog/catalog-client";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { PageContainer } from "@/components/layout/page-container";
import {
  getCategoryBySlug,
  getCategoryProducts,
  getPublishedCategories,
  getPublicSiteSettings,
} from "@/features/catalog/data";
import { buildCatalogFacets } from "@/features/catalog/facets";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale } from "@/i18n/config";
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const category = await getCategoryBySlug(locale, slug);
  if (!category) notFound();
  const d = getDictionary(locale);
  const [categories, products, settings] = await Promise.all([
    getPublishedCategories(locale),
    getCategoryProducts(locale, category.id),
    getPublicSiteSettings(locale),
  ]);
  return (
    <PageContainer className="py-8 sm:py-12">
      <Breadcrumbs
        locale={locale}
        home={d.common.breadcrumbsHome}
        items={[d.catalog.title, category.name]}
      />
      <h1 className="mt-5 text-4xl font-black">{category.name}</h1>
      <p className="mt-3 text-stone-600">{category.description}</p>
      <div className="mt-8">
        <CatalogClient
          locale={locale}
          dictionary={d}
          initialCategory={category.id}
          lockCategory
          categories={categories}
          products={products}
          facets={buildCatalogFacets(products)}
          settings={settings}
        />
      </div>
    </PageContainer>
  );
}
