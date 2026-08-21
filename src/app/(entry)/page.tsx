import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { defaultLocale, isLocale, localizedPath } from "@/i18n/config";

export default async function EntryPage() {
  const cookieStore = await cookies();
  const saved = cookieStore.get("ts_locale")?.value;
  const locale = saved && isLocale(saved) ? saved : defaultLocale;
  redirect(localizedPath(locale));
}
