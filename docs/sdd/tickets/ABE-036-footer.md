# ABE-036: Footer with navigation, socials and studio credit

## Kontext

The owner asked for a modern footer: navigation and legal links that mirror
the header IA, social links, and the line "Webentwicklung: Yevgenii Riabokon".
The footer was a single wrapping list plus one sentence.

## AC

- Three columns: brand + note + socials, navigation, legal (Impressum,
  Datenschutz, consent revoke).
- Navigation lists Sortiment, Vorbestellen, Kontakt, Karriere, Partner werden,
  Café and Liefergebiet; every entry comes from `siteNavigation.ts`, so the
  header and the footer cannot drift apart.
- The legal column keeps the consent revoke link (GDPR), and legal pages stay
  reachable from every page.
- Social links are placeholders the owner replaces with the real profiles.
- The bottom bar shows the copyright year and the web-development credit.
- One column on mobile, three from `md`; no horizontal overflow at 390 px.
- `npm run check` and `npm run build` are green.

## Decisions

- lucide-react in the pinned version no longer ships brand glyphs, and drawing
  Instagram/Facebook logos into the repo would mean shipping other people's
  marks. The footer therefore links the platforms by name. If the owner wants
  icons, the glyphs go into `public/` as owned assets with an entry in
  `docs/sdd/assets.md`.
- `siteNavigation.ts` is the single source for the link lists: `NavLabels` for
  the header, `FooterLabels` (adds the café) for the footer.

## Out of scope

- The palette re-theme (ABE-037) and the header/footer styling that depends on
  the new palette.
- Hardening `ConsentRevokeLink`, which still carries a hard-coded German label
  and is only rendered once the map consent was granted. Separate ticket.
