import Image from "next/image";
import Link from "next/link";
import type { CompanyPage as CompanyPageData } from "@/features/content/companyPages";
import { PairingCards } from "./PairingCards";

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

      {page.hero ? (
        <section aria-label={page.hero.name} className="relative isolate">
          <div className="relative h-[46vh] min-h-72 max-h-[34rem] w-full overflow-hidden bg-brand-deep/10">
            <Image
              src={page.hero.src}
              alt={page.hero.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-60"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-paper via-paper/20 to-cream"
            />
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-8">
        <h2 className="font-display text-3xl font-semibold">Auf einen Blick</h2>
        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          {page.facts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-lg border border-brand-deep/10 bg-paper p-5 shadow-card"
            >
              <dt className="text-sm font-semibold text-brand">{fact.label}</dt>
              <dd className="mt-2 text-sm leading-6 text-ink/75">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-12 font-display text-3xl font-semibold">
          {page.pairings || page.photoSlots ? "Passt dazu" : "Was Sie wissen sollten"}
        </h2>
        {page.pairings ? (
          <PairingCards pairings={page.pairings} />
        ) : (
          <div className="mt-5 grid gap-4">
            {page.highlights?.map((highlight) => (
              <article
                key={highlight.title}
                className="rounded-lg border border-brand-deep/10 bg-cream p-5"
              >
                <h3 className="font-semibold">{highlight.title}</h3>
                <p className="mt-2 leading-7 text-ink/72">{highlight.text}</p>
              </article>
            ))}
          </div>
        )}

        {page.photoSlots ? (
          <div className="mt-12">
            <h2 className="font-display text-3xl font-semibold">Die Galerie</h2>
            <p className="mt-3 max-w-2xl leading-7 text-ink/72">
              Drei Motive, die den Charakter des Cafés erzählen: der
              Fensterplatz, eine zweite Perspektive darauf und der Blick in die
              Backstube.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {page.photoSlots.map((slot) => (
                <figure
                  key={slot.title}
                  className="flex flex-col overflow-hidden rounded-lg border border-brand-deep/10 bg-paper shadow-card"
                >
                  <div className="relative aspect-[3/2]">
                    <Image
                      src={slot.image}
                      alt={slot.alt}
                      fill
                      sizes="(min-width: 640px) 20rem, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="flex flex-col gap-2 p-5">
                    <span className="font-semibold">{slot.title}</span>
                    <span className="text-sm leading-6 text-ink/70">
                      {slot.text}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
