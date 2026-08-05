import type { DemoCategory, DemoProduct } from "@/features/catalog/types";

type Props = {
  category: DemoCategory["icon"];
  tone: DemoProduct["imageTone"];
  label: string;
  className?: string;
};
export function ProductIllustration({
  category,
  tone,
  label,
  className = "",
}: Props) {
  return (
    <div
      aria-label={label}
      role="img"
      className={`product-illustration product-illustration--${tone} ${className}`}
    >
      <div className={`appliance appliance--${category}`}>
        <i />
        <b />
        <span />
      </div>
    </div>
  );
}
