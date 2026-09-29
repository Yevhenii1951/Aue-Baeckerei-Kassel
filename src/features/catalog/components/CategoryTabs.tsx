import { useTranslations } from "next-intl";
import type { ProductCategory } from "@/features/catalog/types";

type CategoryTabsProps = {
  categories: ProductCategory[];
  selected: ProductCategory | "all";
  onSelect: (category: ProductCategory | "all") => void;
};

export function CategoryTabs({
  categories,
  selected,
  onSelect,
}: CategoryTabsProps): React.ReactElement {
  const t = useTranslations("catalog");

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        type="button"
        onClick={() => onSelect("all")}
        className={tabClass(selected === "all")}
      >
        {t("all")}
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={tabClass(selected === category)}
        >
          {t(`categories.${category}`)}
        </button>
      ))}
    </div>
  );
}

function tabClass(active: boolean): string {
  return [
    "min-h-11 shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold",
    active
      ? "border-brand bg-brand text-cream"
      : "border-brand-deep/10 bg-paper text-ink/72",
  ].join(" ");
}
