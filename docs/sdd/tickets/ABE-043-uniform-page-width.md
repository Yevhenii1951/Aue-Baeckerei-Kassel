# ABE-043: One page width everywhere

## Kontext

The preorder page has been the widest public page all along. The content pages,
the local-SEO pages, the legal pages and the checkout confirmation were built
narrower (4xl, 3xl, 2xl), so the text column jumped between routes.

## AC

- Every public page uses `mx-auto w-full max-w-6xl px-4 sm:px-8`, the
  container `/vorbestellen` already had.
- Company pages, local-SEO pages, Impressum, Datenschutz and the checkout
  confirmation are at 6xl; their title block is `py-12` and the content block
  `py-10`, same as `/vorbestellen`.
- Verified by measuring the rendered markup of all public routes.
- `npm run check` and `npm run build` are green.

## Out of scope

- Admin screens keep their own widths; they are an internal tool, not part of
  the public page rhythm.
- Text measures inside a page (`max-w-2xl` on an intro paragraph) are
  unchanged — that is line length, not the page frame.
