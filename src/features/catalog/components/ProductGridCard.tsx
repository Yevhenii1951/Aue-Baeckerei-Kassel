import {
  allergenLabels,
  categoryLabels,
  type Product,
} from "@/features/catalog/types";

type ProductGridCardProps = {
  product: Product;
  quantity: number;
  onAdd: (product: Product) => void;
  onPreorder: (product: Product) => void;
};

export function ProductGridCard({
  product,
  quantity,
  onAdd,
  onPreorder,
}: ProductGridCardProps): React.ReactElement {
  return (
    <article className="flex min-h-80 flex-col justify-between rounded-lg border border-brand-deep/10 bg-paper p-5 shadow-dining-soft">
      <div>
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-medium text-sage">
            {categoryLabels[product.category]}
          </p>
          <p className="font-semibold text-brand-dark">
            {formatPrice(product.priceCents)}
          </p>
        </div>
        <h2 className="mt-3 text-xl font-semibold">{product.name}</h2>
        <p className="mt-3 text-sm leading-6 text-ink/70">
          {product.description}
        </p>
      </div>

      <div className="mt-5 grid gap-4">
        <div className="flex flex-wrap gap-2">
          {product.allergens.map((code) => (
            <span
              key={code}
              title={allergenLabels[code]}
              className="rounded-md border border-brand-deep/10 px-2 py-1 text-xs font-semibold text-ink/70"
            >
              {code}
            </span>
          ))}
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-lime-soft px-2 py-1 text-xs font-semibold text-brand-deep"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="min-h-11 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-cream"
          >
            {quantity > 0 ? `Im Warenkorb: ${quantity}` : "In den Warenkorb"}
          </button>
          <button
            type="button"
            onClick={() => onPreorder(product)}
            className="min-h-11 rounded-lg border border-brand-deep/15 px-4 py-2 text-sm font-semibold text-brand-dark"
          >
            {product.preorder ? "Vorbestellen" : "Shop-Artikel"}
          </button>
        </div>
      </div>
    </article>
  );
}

function formatPrice(priceCents: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(priceCents / 100);
}
