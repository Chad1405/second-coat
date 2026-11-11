# Layout and UX

Sources: Figma Resource Library, *Graphic design principles*, *UI design principles*, *Fitts's law*, *Golden ratio*, *What is UX design*; *Refactoring UI* (§7). Paraphrased; [std] marks standard figures not from the articles.

## 1. Hierarchy, contrast, emphasis

- Rank the content before styling it. The most important thing gets the biggest, heaviest, highest-contrast treatment; details get smaller and quieter.
- **One focal point per view.** If everything is emphasised, nothing is.
- Create contrast with size, weight, colour, shape or position. Put the strongest contrast on the one key element.
- Squint test: blur a screenshot. You should see exactly one dominant element and groups that read as groups.

## 2. Alignment, proximity, white space

- Snap everything to a grid. Left edges land on a few consistent x positions across the page.
- Left-align text in left-to-right languages. Centre at most one short group per screen; never centre body paragraphs.
- **Inner spacing smaller than outer spacing.** Space within a group is clearly less than space between groups. This is what makes a layout readable.
- Spacing comes from a scale (4 or 8px base: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128). No one-off values.
- Generous space between sections on marketing pages (roughly 96 to 160px at desktop) [std], but **vary it**: identical gaps everywhere is a template tell.

## 3. Balance, proportion, rhythm

- Asymmetric balance (one heavy element offset by several light ones) reads as designed. Perfect symmetry everywhere reads as templated.
- **Golden ratio splits:** 61.8 / 38.2 for content and sidebar or text and image, instead of 50/50. In CSS: `grid-template-columns: 1.618fr 1fr`.
- Put focal elements near the 38% / 62% lines rather than dead centre.
- Derive spacing and type from related ratios so the page feels of a piece.
- Rhythm: vary how sections are built (a full-bleed image, then a tight list, then a wide statement) rather than stacking identical card rows.
- Repetition: reuse a small set of colours, radii, shadows and type styles everywhere. Don't give each section its own style.
- Drop any ratio the moment it hurts readability or usability.

## 4. Reading paths

| Pattern | Use for | Put key content |
|---|---|---|
| F-pattern | Text-heavy pages, articles, search results | Along the top line and the left edge |
| Z-pattern | Sparse landing pages | Top-left (brand), top-right (action), bottom-right (final action) |
| Layer cake | Scannable docs and long pages | In headings that read as a story on their own |

## 5. Fitts's law: size and distance

Time to hit a target grows with distance and shrinks with size. Make important things bigger and closer.

- Minimum touch target 44×44px (Apple) / 48×48dp (Material); WCAG 2.2 AA floor is 24×24px [std].
- Grow hit areas with padding, not by inflating text or icons.
- The primary action is the largest target in its group, without swamping its neighbours.
- Put the next likely action near where the pointer or thumb already is.
- On mobile, keep primary actions in the thumb zone (lower half, centre).
- Corners are for low-priority items. Never park the primary action in a corner.
- Paired actions (Save / Cancel) sit together for comparison with at least ~8px between them [std]. Destructive actions sit apart from common ones.
- Flatten menus: every extra level adds travel time.

## 6. UI principles

- **One primary action per view**, high contrast. Secondary actions muted. Never two competing primaries.
- Group related controls; separate destructive or unrelated ones.
- Progressive disclosure: split long forms into steps, show progress, hide advanced options.
- Every interactive element has visible states: hover, focus, active, disabled, loading, success, error.
- Keep components the same size and behaviour throughout a flow. Every change needs a reason.
- Users stay in control: undo, back, cancel, leave.
- The fewest steps to finish the main task. Count the clicks and fields.
- Consistent patterns, icons and controls on every page and device.

## 7. Making it look finished

From *Refactoring UI* (Wathan and Schoger). Paraphrased. These are the details that separate "assembled" from "designed".

- **Emphasise by de-emphasising.** When the main thing doesn't stand out, make its neighbours quieter instead of making it louder.
- **Hierarchy is weight and colour, not just size.** Use two or three text colours (strong, normal, soft) and two weights before reaching for another font size.
- **Soft text on a coloured background** takes a lighter or darker tint of that background's hue, never plain grey or lowered opacity.
- **Labels are a last resort.** "12 left" beats "Stock: 12". When data explains itself, drop the label; when a label is needed, make it the quiet part.
- **Start with too much space, then take it away.** Cramped is the more common failure, and dense layouts should be a choice.
- **Don't fill the screen because it's there.** Give content the width it needs; a form doesn't need 1200px. Fixed-width parts (a sidebar, a form) stay fixed; only the flexible part grows.
- **Fewer borders.** Separate things with space, a background tint or a shadow first. Not everything needs a card.
- **Three button weights:** primary solid, secondary outlined or muted, tertiary as a plain link. Destructive actions aren't automatically big and red; they get the weight of their place in the hierarchy.
- **Align on baselines** when a row mixes text sizes, not on box centres.
- **Depth from light:** raised things are lighter on top and cast a shadow below. Shadows read better as two layers (a tight dark one and a wide soft one). Overlap an element across two sections to add depth without decoration.
- **Design the empty and edge states:** no data yet, a very long name, one item where you designed for six.

## 8. Responsive [std]

- Design mobile-first; check 320, 375, 768, 1024, 1280, 1440, 1920.
- Cap the container (~1280 to 1440px) and centre it. At 1920 the gutters grow; the measure and grid don't.
- `overflow-x: clip` on `html` and `body`. Never `100vw` widths.
- Grid tracks holding images use `minmax(0, 1fr)`; long headings get `overflow-wrap: break-word; min-width: 0`.
- Use `svh` / `dvh`, not `vh`, for viewport-height sections.
- The hero's headline, one sentence and primary action are visible at 1280×800 without scrolling.

## Audit checks

- Squint test for one focal point per view.
- Inspect a few groups: is the inner gap smaller than the outer gap?
- Count distinct spacing values and radii in the CSS. Many near-duplicates means no system.
- Query `a, button, input, [role=button]` for boxes under 44×44 on mobile.
- Count primary-styled buttons in each viewport. More than one is a hit.
- Resize from 320 to 1920 and watch for horizontal scroll, wrapping buttons, and stretched grids.
- Count borders and boxed cards. If most groups have both a border and a background, separate some with space instead.
- Look for grey or semi-transparent text on coloured surfaces, and "Label: value" pairs that could be a plain phrase.
- Check rows of mixed text sizes for baseline alignment, and content stretched to full width that doesn't need it.
