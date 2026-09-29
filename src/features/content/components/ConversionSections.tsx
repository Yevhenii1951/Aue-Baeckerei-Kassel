export type ConversionCard = {
  title: string;
  text: string;
  meta: string;
  cta: string;
};

type ConversionSectionsProps = {
  title: string;
  text: string;
  cards: ConversionCard[];
};

export function ConversionSections({
  title,
  text,
  cards,
}: ConversionSectionsProps): React.ReactElement {
  return (
    <section className="bg-paper">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8">
        <div className="max-w-3xl">
          <h2 className="font-display text-4xl font-semibold">{title}</h2>
          <p className="mt-5 leading-7 text-ink/72">{text}</p>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.title}
              className="flex min-h-72 flex-col justify-between rounded-lg border border-brand-deep/10 bg-cream p-6 shadow-card"
            >
              <div>
                <p className="text-sm font-semibold text-brand">{card.meta}</p>
                <h3 className="mt-3 text-2xl font-semibold">{card.title}</h3>
                <p className="mt-4 leading-7 text-ink/72">{card.text}</p>
              </div>
              <p className="mt-8 font-semibold text-brand-dark">{card.cta}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
