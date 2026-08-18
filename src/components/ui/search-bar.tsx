import { localizedPath, type Locale } from "@/i18n/config";

export function SearchBar({
  locale,
  placeholder,
  defaultValue = "",
  className = "",
}: {
  locale: Locale;
  placeholder: string;
  defaultValue?: string;
  className?: string;
}) {
  return (
    <form
      action={localizedPath(locale, "catalog")}
      className={`search-bar ${className}`}
      role="search"
    >
      <input
        className="search-bar__input"
        defaultValue={defaultValue}
        name="q"
        placeholder={placeholder}
        type="search"
      />
      <button
        aria-label={placeholder}
        className="search-bar__submit"
        type="submit"
      >
        <svg
          aria-hidden="true"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      </button>
    </form>
  );
}
