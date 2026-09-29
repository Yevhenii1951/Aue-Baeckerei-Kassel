import Link from "next/link";
import { Camera } from "lucide-react";
import type { CompanyPage as CompanyPageData } from "@/features/content/companyPages";

/**
 * One renderer for the four content pages. The copy is German on purpose (see
 * companyPages.ts) — only the surrounding chrome is localised, so a page never
 * shows a half-translated offer.
 */
export function CompanyPage({
  page,
  locale,
}: {
  page: CompanyPageData;
  locale: string;
}): React.ReactElement {
  return (
    <div className="bg-cream">
      <section className="border-b border-brand-deep/10 bg-paper">
        <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-8">
          <h1 className="font-display text-5xl font-semibold">{page.title}</h1>
          <p className="mt-5 text-lg leading-8 text-ink/72">{page.intro}</p>
          <p className="mt-4 text-sm leading-6 text-ink/55">{page.notice}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/${locale}${page.cta.href}`} className="btn-amber">
              {page.cta.label}
            </Link>
            <Link
              href={`/${locale}${page.secondaryCta.href}`}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-brand-deep/15 px-6 py-2.5 font-semibold text-brand-dark"
            >
              {page.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-8">
        <h2 className="font-display text-3xl font-semibold">Auf einen Blick</h2>
        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          {page.facts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-lg border border-brand-deep/10 bg-paper p-5 shadow-card"
            >
              <dt className="text-sm font-semibold text-sage">{fact.label}</dt>
              <dd className="mt-2 text-sm leading-6 text-ink/75">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-12 font-display text-3xl font-semibold">
          {page.photoSlots ? "Passt dazu" : "Was Sie wissen sollten"}
        </h2>
        <div className="mt-5 grid gap-4">
          {page.highlights.map((highlight) => (
            <article
              key={highlight.title}
              className="rounded-lg border border-brand-deep/10 bg-cream p-5"
            >
              <h3 className="font-semibold">{highlight.title}</h3>
              <p className="mt-2 leading-7 text-ink/72">{highlight.text}</p>
            </article>
          ))}
        </div>

        {page.photoSlots ? (
          <div className="mt-12">
            <h2 className="font-display text-3xl font-semibold">Die Galerie</h2>
            <p className="mt-3 max-w-2xl leading-7 text-ink/72">
              Drei Motive, die den Charakter des Cafés erzählen. Die Bilder
              folgen, sobald die Aufnahmen vorliegen.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {page.photoSlots.map((slot) => (
                <figure
                  key={slot.title}
                  className="flex flex-col rounded-lg border border-dashed border-brand-deep/25 bg-paper p-5"
                >
                  <span className="grid size-11 place-items-center rounded-full bg-amber/25 text-brand-dark">
                    <Camera className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <figcaption className="mt-4 font-semibold">{slot.title}</figcaption>
                  <p className="mt-2 text-sm leading-6 text-ink/70">{slot.text}</p>
                </figure>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
