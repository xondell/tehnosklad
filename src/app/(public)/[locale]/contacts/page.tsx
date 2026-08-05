import { notFound } from "next/navigation";
import { ContactButton } from "@/components/public/contact-button";
import { CopyPhoneButton } from "@/components/public/copy-phone-button";
import { PageContainer } from "@/components/layout/page-container";
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
  const d = getDictionary(locale);
  return (
    <PageContainer className="py-10 sm:py-14">
      <p className="text-sm font-bold uppercase tracking-wide text-stone-500">
        Tehnosklad
      </p>
      <h1 className="mt-2 text-4xl font-black">{d.contacts.title}</h1>
      <p className="mt-3 text-stone-600">{d.contacts.description}</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 p-6">
          <dl className="space-y-5">
            <div>
              <dt className="text-sm font-bold text-stone-500">
                {d.common.address}
              </dt>
              <dd className="mt-1 font-bold">
                {d.common.city}, {d.common.address}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-bold text-stone-500">
                {d.common.phone}
              </dt>
              <dd className="mt-1">
                <a
                  className="text-xl font-black hover:underline"
                  href={siteConfig.phoneHref}
                >
                  {siteConfig.phoneDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-bold text-stone-500">
                {d.common.hours}
              </dt>
              <dd className="mt-1">
                {d.common.openDays}: {siteConfig.hours.openTime}
                <br />
                {d.common.closed}
              </dd>
            </div>
          </dl>
          <div className="mt-7 flex flex-wrap gap-2">
            <a className="button-primary" href={siteConfig.phoneHref}>
              {d.actions.call}
            </a>
            <CopyPhoneButton copy={d.actions.copy} copied={d.actions.copied} />
            <ContactButton dictionary={d} label={d.actions.contact} />
          </div>
        </section>
        <section className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center">
          <div>
            <p className="font-bold">{d.common.mapPlaceholder}</p>
            <a
              className="mt-3 inline-flex font-bold underline"
              href="https://www.openstreetmap.org/search?query=Comrat%20strada%20Victoriei%2097"
              rel="noreferrer"
              target="_blank"
            >
              {d.contacts.mapLink}
            </a>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
