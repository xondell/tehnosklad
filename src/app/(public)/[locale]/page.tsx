import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/catalog/product-grid";
import { ProductIllustration } from "@/components/catalog/product-illustration";
import { ContactButton } from "@/components/public/contact-button";
import { CopyPhoneButton } from "@/components/public/copy-phone-button";
import { PageContainer } from "@/components/layout/page-container";
import {
  getPopularProducts,
  getPublishedCategories,
  getPublicSiteSettings,
} from "@/features/catalog/data";
import { getCategoryTone } from "@/features/catalog/presentation";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale, localizedPath } from "@/i18n/config";
import { JsonLd } from "@/features/seo/json-ld";
import { buildLocalizedMetadata } from "@/features/seo/metadata";
import { buildHomeSchema } from "@/features/seo/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  return buildLocalizedMetadata({
    locale,
    title:
      locale === "ru"
        ? "Tehnosklad — бытовая техника в Комрате"
        : "Tehnosklad — electrocasnice în Comrat",
    description: d.home.description,
    currentPath: `/${locale}`,
    alternatePath: `/${locale === "ru" ? "ro" : "ru"}`,
    absoluteTitle: true,
  });
}
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const [categories, popular, settings] = await Promise.all([
    getPublishedCategories(locale),
    getPopularProducts(locale, 3),
    getPublicSiteSettings(locale),
  ]);
  return (
    <>
      <JsonLd value={buildHomeSchema(locale, settings)} />
      <section className="border-b border-stone-200 bg-stone-50 py-10 sm:py-16">
        <PageContainer className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-wide text-stone-600">
              {d.home.eyebrow}
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              {d.home.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-stone-600">
              {d.home.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                className="button-primary"
                href={localizedPath(locale, "catalog")}
              >
                {d.actions.openCatalog}
              </Link>
              <a className="button-secondary" href={settings.phoneHref}>
                {d.actions.call}
              </a>
            </div>
            <p className="mt-6 text-sm font-semibold text-stone-600">
              {d.home.contactNote}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <ProductIllustration
              category="fridge"
              tone="yellow"
              label={d.home.title}
              className="h-72 sm:h-96"
            />
            <div className="absolute bottom-7 left-7 rounded-[100vmax] bg-stone-950 px-4 py-3 text-sm font-bold text-white">
              {d.common.city}
            </div>
          </div>
        </PageContainer>
      </section>
      <section className="py-14">
        <PageContainer>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="section-title text-3xl font-bold">{d.home.categoriesTitle}</h2>
              <p className="mt-2 text-stone-600">
                {d.home.categoriesDescription}
              </p>
            </div>
            <Link
              className="font-bold underline"
              href={localizedPath(locale, "catalog")}
            >
              {d.actions.openCatalog}
            </Link>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {categories.map((category) => (
              <Link
                className="group rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                key={category.id}
                href={localizedPath(locale, `category/${category.slug}`)}
              >
                <ProductIllustration
                  category={category.presentationKey}
                  tone={getCategoryTone(category.presentationKey)}
                  label={category.name}
                  className="h-40"
                />
                <h3 className="mt-4 text-xl font-bold">{category.name}</h3>
                <p className="mt-1 text-sm text-stone-600">
                  {category.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </PageContainer>
      </section>
      <section className="bg-stone-50 py-14">
        <PageContainer>
          <h2 className="section-title text-3xl font-bold">{d.home.popularTitle}</h2>
          <p className="mt-2 text-stone-600">{d.home.popularDescription}</p>
          <div className="mt-7">
            <ProductGrid
              products={popular}
              locale={locale}
              dictionary={d}
              settings={settings}
              leadSource="home_product_card"
            />
          </div>
        </PageContainer>
      </section>
      <section className="py-14">
        <PageContainer>
          <h2 className="section-title text-3xl font-bold">{d.home.benefitsTitle}</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.values(d.home.benefits).map((benefit) => (
              <article
                className="rounded-2xl border border-stone-200 p-5"
                key={benefit.title}
              >
                <h3 className="font-bold">{benefit.title}</h3>
                <p className="mt-2 text-sm text-stone-600">{benefit.text}</p>
              </article>
            ))}
          </div>
        </PageContainer>
      </section>
      {/* Контакты магазина — закомментировано по дизайну
      <section className="pb-14">
        <PageContainer>
          <div className="grid gap-6 rounded-3xl bg-stone-950 p-6 text-white sm:p-9 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-3xl font-black">{d.home.contactTitle}</h2>
              <p className="mt-2 max-w-xl text-stone-300">
                {d.home.contactDescription}
              </p>
              <p className="mt-5 font-bold">{settings.address}</p>
              <p>
                {settings.openDays}: {settings.openTime}
              </p>
              <p className="text-stone-300">{settings.closedDay}</p>
            </div>
            <div className="flex flex-wrap content-start gap-2">
              <a className="button-primary" href={settings.phoneHref}>
                {d.actions.call}
              </a>
              <CopyPhoneButton
                copy={d.actions.copy}
                copied={d.actions.copied}
                phone={settings.phoneDisplay}
              />
              <Link
                className="button-secondary"
                href={localizedPath(locale, "contacts")}
              >
                {d.navigation.contacts}
              </Link>
              <ContactButton
                dictionary={d}
                locale={locale}
                label={d.actions.contact}
                source="home_contact"
                settings={settings}
              />
            </div>
          </div>
        </PageContainer>
      </section>
      */}
    </>
  );
}
