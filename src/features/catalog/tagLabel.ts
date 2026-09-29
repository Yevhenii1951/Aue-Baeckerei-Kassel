type Translator = ((key: string) => string) & { has: (key: string) => boolean };

// Catalogue tags are German content values, not UI chrome: the catalogue only
// translates the labels it ships. A tag without a translation keeps its German
// value instead of leaking the message key into the page.
export function tagLabel(t: Translator, tag: string): string {
  const key = `tags.${tag}`;

  return t.has(key) ? t(key) : tag;
}
