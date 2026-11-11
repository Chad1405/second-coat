# Typography

Sources: Figma Resource Library, *Best fonts for websites* and *Golden ratio*, plus standard practice [std]. Paraphrased. The overused list follows the Impeccable hook and this repo's own evals.

Type does most of the work of making a page look designed. The fastest AI tell is a default sans as the display face at a timid scale.

## 1. Choose by role and voice

Pick a **display** face (headings, the voice) and a **body** face (reading, UI). One family with several weights is often enough; add a second only as a deliberate contrast. Three families maximum.

| Voice | Display class | Body class |
|---|---|---|
| Editorial, literary, trust | Old-style or transitional serif with a display cut | Text serif with sturdy serifs, or a humanist sans |
| Precise, product, technical | Grotesk or neo-grotesk with some character (ink traps, squarish curves, narrow widths) | Neutral or humanist sans built for UI |
| Friendly, approachable | Humanist or soft grotesk, rounded terminals | Humanist sans with open counters |
| Geometric, confident | Geometric sans, often wide or extended | Plainer sans with a larger x-height |
| Bold, poster, loud | Condensed or ultra-heavy grotesk, wood-type style | A neutral sans at regular weight |
| Warm, crafted, playful | Slab serif, soft or "wonky" serif | Humanist sans or a friendly slab at text sizes |
| Luxury, fashion | Didone (high contrast, hairline serifs) | A quiet sans, generous tracking at small sizes only |

**No font names here on purpose.** Every named list this repo has shipped became the new default (evals put Besley, then Schibsted Grotesk, on four of six free-choice builds). Choose fresh each time:
1. Pick the class from the subject, not the table row you used last.
2. Browse that class on Google Fonts or Fontshare and shortlist three faces. Look past the first page of popular results.
3. Pick the one whose details echo the subject (its era, its tools, its signage, its paperwork), and say why in one line on the direction card.
4. Check it has the weights, styles and scripts the content needs.

**Overused right now, avoid unless the user pins them:** Space Grotesk, Geist, Fraunces, Instrument Serif, Playfair Display, Plus Jakarta Sans, and Inter or Roboto as a display face.

Rules:
- **Inter, Roboto, Open Sans, Poppins, Lato and system UI are body faces.** Fine for body and UI. As the display face they read as "nobody chose this."
- Display faces (Didones, condensed poster faces, display cuts) only at large sizes, never for body copy.
- For body, favour a large x-height and open counters.
- Contrast pairs work; near-twins don't. A serif display over a sans body, or a grotesk display over a humanist body. Two similar geometric sans look like a mistake.
- Check language coverage (Cyrillic, Greek, Devanagari) if the content needs it.
- Prefer one variable font file over many static weights. Self-host or use Google Fonts / Fontshare with `font-display: swap`.
- Don't rely on fonts that only some systems have (Palatino, Iowan Old Style, Sitka, Bahnschrift, Superclarendon, Segoe UI). They silently fall back on other machines, so the design changes. They can appear later in a fallback stack.

## 2. Pick a scale and commit to it

A modular scale: each step is the previous one multiplied by a fixed ratio.

| Ratio | Name | Steps from 16px | Suits |
|---|---|---|---|
| 1.2 | Minor third | 16, 19, 23, 28, 33, 40 | Dense product UI, dashboards |
| 1.25 | Major third | 16, 20, 25, 31, 39, 49 | General marketing, docs |
| 1.333 | Perfect fourth | 16, 21, 28, 38, 50, 67 | Confident marketing pages |
| 1.5 | Perfect fifth | 16, 24, 36, 54, 81 | Editorial, bold landing pages |
| 1.618 | Golden ratio | 16, 26, 42, 68, 110 | Dramatic display and editorial only |

- Marketing pages usually want a big jump between body and display. A hero headline at 2.5 to 5× body is normal; an h2 under ~40px at desktop width usually reads timid.
- Use `clamp()` so the scale is fluid: `--text-display: clamp(2.75rem, 1.5rem + 5vw, 5.5rem);`
- Consecutive heading sizes should keep a roughly constant ratio. Arbitrary jumps (14, 18, 20, 36) mean no system.

## 3. Setting text [std]

- Body 16 to 18px, line-height 1.5 to 1.65.
- Headings: line-height 1.0 to 1.2, tighter as they grow. Tracking slightly negative on large display (down to about -0.03em), never below -0.04em.
- Measure 45 to 75 characters; `max-width: 65ch` is a good default.
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.
- Headings: one weight and one colour per level. No accented word.
- Labels, captions, nav: body face, one step smaller, sentence case, normal tracking. Not tracked caps, not mono.
- `font-variant-numeric: tabular-nums` for prices, tables and anything that updates.
- More space above a heading than below it (roughly 2:1), so it belongs to what it introduces.

## Audit checks

- List every `font-family` in use. More than two or three families, a display face under ~24px, or a default sans as the display face is a hit.
- Measure body size, line-height and paragraph `max-width` against the ranges above.
- Compute the ratio between h1, h2, h3. Is it constant? Is the h1-to-body jump big enough to create hierarchy?
- Look for tracked-caps labels, one-word italics, gradient or coloured words inside headings.
