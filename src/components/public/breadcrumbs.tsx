import Link from "next/link";
import { localizedPath, type Locale } from "@/i18n/config";
export function Breadcrumbs({
  locale,
  home,
  items,
}: {
  locale: Locale;
  home: string;
  items: string[];
}) {
  return (
    <nav aria-label={home}>
      <ol className="flex flex-wrap gap-2 text-sm text-stone-600">
        <li>
          <Link className="hover:underline" href={localizedPath(locale)}>
            {home}
          </Link>
        </li>
        {items.map((item) => (
          <li className="flex gap-2" key={item}>
            <span aria-hidden="true">/</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
