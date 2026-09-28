export type CafePairing = {
  title: string;
  text: string;
};

export type CafePhotoSlot = {
  title: string;
  text: string;
};

type CafeSectionProps = {
  title: string;
  text: string;
  hours: string;
  pairings: CafePairing[];
  photoSlots: CafePhotoSlot[];
  trustItems: string[];
};

export function CafeSection({
  title,
  text,
  hours,
  pairings,
  photoSlots,
  trustItems,
}: CafeSectionProps): React.ReactElement {
  return (
    <section id="cafe" className="bg-brand-deep text-cream">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <h2 className="font-display text-4xl font-semibold">{title}</h2>
            <p className="mt-5 max-w-xl leading-7 text-cream/75">{text}</p>
            <p className="mt-5 font-semibold text-lime">{hours}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {pairings.map((pairing) => (
              <article
                key={pairing.title}
                className="rounded-lg border border-white/10 bg-white/10 p-5"
              >
                <h3 className="font-semibold">{pairing.title}</h3>
                <p className="mt-3 text-sm leading-6 text-cream/72">
                  {pairing.text}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {photoSlots.map((slot) => (
            <article
              key={slot.title}
              className="min-h-64 rounded-lg border border-lime/25 bg-[linear-gradient(135deg,rgb(255_249_239/0.14),rgb(215_154_67/0.12))] p-5"
            >
              <p className="font-semibold text-lime">{slot.title}</p>
              <p className="mt-3 text-sm leading-6 text-cream/72">{slot.text}</p>
            </article>
          ))}
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-white/10 bg-white/10 px-5 py-4"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
