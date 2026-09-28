import type { LegalSection } from "../privacySections";

type LegalSectionBlockProps = {
  section: LegalSection;
};

export default function LegalSectionBlock({ section }: LegalSectionBlockProps) {
  const { title, paragraphs, list, closing } = section;

  return (
    <section>
      <h2 className="text-xl font-semibold">{title}</h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-2">
          {paragraph}
        </p>
      ))}
      {list ? (
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {closing ? <p className="mt-2">{closing}</p> : null}
    </section>
  );
}
