import Image from "next/image";
import type { CompanyPage as CompanyPageData } from "@/features/content/companyPages";

/**
 * Drink plus cake as one card. The description sits on the photo and comes in
 * on hover, so the grid reads as photos first. Touch devices have no hover, so
 * the caption is always visible there (see .pairing-caption in globals.css).
 */
export function PairingCards({
  pairings,
}: {
  pairings: NonNullable<CompanyPageData["pairings"]>;
}): React.ReactElement {
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {pairings.map((pairing) => (
        <article
          key={pairing.title}
          className="group relative overflow-hidden rounded-lg border border-brand-deep/10 bg-paper shadow-card"
        >
          <div className="relative aspect-[4/3]">
            <Image
              src={pairing.drink.src}
              alt={pairing.drink.alt}
              fill
              sizes="(min-width: 640px) 24rem, 100vw"
              className="object-cover"
            />
          </div>

          <div className="pointer-events-none absolute right-3 bottom-3 size-24 overflow-hidden rounded-full border-2 border-paper shadow-card sm:size-28">
            <Image
              src={pairing.cake.src}
              alt={pairing.cake.alt}
              fill
              sizes="7rem"
              className="object-cover"
            />
          </div>

          <div className="pairing-caption absolute inset-0 flex flex-col justify-end bg-brand-deep/75 p-5 text-cream">
            <h3 className="font-display text-2xl font-semibold">
              {pairing.title}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-cream/85">
              {pairing.text}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
