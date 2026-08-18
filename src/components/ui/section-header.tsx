import type { ReactNode } from "react";

export function SectionHeader({
  title,
  description,
  action,
  className = "",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-end justify-between gap-3 ${className}`}
    >
      <div>
        <h2 className="section-title-line">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted-ink)] sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
