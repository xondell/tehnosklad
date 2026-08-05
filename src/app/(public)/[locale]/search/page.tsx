import { redirect } from "next/navigation";
import { isLocale, localizedPath } from "@/i18n/config";
export default async function SearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(localizedPath(isLocale(locale) ? locale : "ru", "catalog"));
}
