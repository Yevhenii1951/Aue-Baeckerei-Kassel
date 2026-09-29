import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  findLocalSeoPage,
  LOCAL_SEO_PAGES,
} from "@/features/content/localSeoPages";
import { buildPublicMetadata } from "@/features/seo/publicMetadata";
import { parseSupportedLocale } from "@/features/seo/site";

type LocalSeoPageProps = Readonly<{
  params: Promise<{ locale: string; slug: string }>;
}>;

export function generateStaticParams(): Array<{ slug: string }> {
  return LOCAL_SEO_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: LocalSeoPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = findLocalSeoPage(slug);
  if (!page) return {};

  return buildPublicMetadata({
    locale: parseSupportedLocale(locale),
    path: `/${page.slug}`,
    title: page.metaTitle,
    description: page.description,
  });
}

export default async function LocalSeoPage({
  params,
}: LocalSeoPageProps): Promise<React.ReactElement> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const page = findLocalSeoPage(slug);
  if (!page) notFound();

  return (
    <div className="bg-cream">
      <section className="border-b border-brand-deep/10 bg-paper">
        <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-8">
          <h1 className="font-display text-5xl font-semibold">{page.title}</h1>
          <p className="mt-5 text-lg leading-8 text-ink/72">{page.intro}</p>
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
              <dt className="text-sm font-semibold text-brand">{fact.label}</dt>
              <dd className="mt-2 text-sm leading-6 text-ink/75">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-12 font-display text-3xl font-semibold">Was Sie wissen sollten</h2>
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
      </section>
    </div>
  );
}
