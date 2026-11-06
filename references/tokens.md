# Design tokens

Source: Figma Resource Library, *Design token architecture* and *Design system examples*. Paraphrased.

Tokens are why a page looks consistent. Without them an AI scatters near-duplicate colours, sizes and gaps through the CSS, and the result looks assembled rather than designed. The Figma article calls out agents hard-coding values as a specific failure.

## Rules

- **Two tiers by default:** primitives (raw values) and semantic tokens (intent). Add a third, component tier only when one intent must render differently per component.
- Page and component CSS references **semantic tokens only**. Primitives are plumbing.
- Name by decision, not value: `--color-surface`, not `--light-grey`.
- One source of truth. Never copy a value into a second place.
- Theme (dark mode, rebrand) by remapping semantic tokens to different primitives, never by editing components.
- No raw `#hex`, `rgb()`, `font-family` or spacing `px` past the token block.
- No two tokens with the same meaning; no one token used for two meanings.
- For a small site, a compact system is enough: a palette, a type scale, a spacing scale, radii, shadows, motion, and four or five core components. Don't over-build.

## Starter `tokens.css`

Replace the values; keep the shape. Every value here is a placeholder to be derived from the direction, not a default to ship.

```css
/* ---------- primitives ---------- */
:root {
  /* palette: one anchor hue + one signal, see color.md */
  --p-ink-50:  oklch(98% 0.006 80);
  --p-ink-100: oklch(94% 0.010 80);
  --p-ink-300: oklch(80% 0.015 80);
  --p-ink-500: oklch(56% 0.020 80);
  --p-ink-700: oklch(36% 0.020 80);
  --p-ink-900: oklch(19% 0.015 80);
  --p-signal-500: oklch(62% 0.17 150);
  --p-signal-700: oklch(45% 0.14 150);

  /* type: see typography.md */
  --p-font-display: "Fraunces", Georgia, serif;
  --p-font-body: "Source Sans 3", system-ui, sans-serif;

  /* spacing: 4px base */
  --p-space-1: 0.25rem; --p-space-2: 0.5rem;  --p-space-3: 0.75rem;
  --p-space-4: 1rem;    --p-space-6: 1.5rem;  --p-space-8: 2rem;
  --p-space-12: 3rem;   --p-space-16: 4rem;   --p-space-24: 6rem;
  --p-space-32: 8rem;   --p-space-40: 10rem;
}

/* ---------- semantic ---------- */
:root {
  --color-bg: var(--p-ink-50);
  --color-surface: var(--p-ink-100);
  --color-text: var(--p-ink-900);
  --color-text-muted: var(--p-ink-700);
  --color-border: var(--p-ink-300);
  --color-action: var(--p-signal-700);
  --color-action-ink: var(--p-ink-50);
  --color-focus: var(--p-signal-500);

  --font-display: var(--p-font-display);
  --font-body: var(--p-font-body);

  --text-body: 1.0625rem;
  --text-small: 0.9375rem;
  --text-title: clamp(1.375rem, 1.1rem + 1vw, 1.75rem);
  --text-section: clamp(2rem, 1.4rem + 2.5vw, 3.25rem);
  --text-display: clamp(2.75rem, 1.5rem + 5vw, 5.5rem);
  --leading-body: 1.6;
  --leading-tight: 1.08;
  --measure: 65ch;

  --space-gap: var(--p-space-6);
  --space-block: var(--p-space-16);
  --space-section: var(--p-space-32);
  --container: 80rem;

  --radius-control: 0.5rem;
  --radius-surface: 0.75rem;
  --shadow-raised: 0 1px 2px oklch(20% 0.02 80 / 0.06), 0 6px 18px oklch(20% 0.02 80 / 0.08);

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-base: 240ms;
}

/* dark mode: remap semantics only */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: var(--p-ink-900);
    --color-surface: oklch(24% 0.015 80);
    --color-text: oklch(92% 0.008 80);
    --color-text-muted: var(--p-ink-300);
    --color-border: oklch(34% 0.02 80);
  }
}
```

## Base rules that prevent common bugs

```css
html, body { overflow-x: clip; }
body {
  background: var(--color-bg); color: var(--color-text);
  font: var(--text-body)/var(--leading-body) var(--font-body);
}
h1, h2, h3 { font-family: var(--font-display); line-height: var(--leading-tight); text-wrap: balance; overflow-wrap: break-word; min-width: 0; }
p { max-width: var(--measure); text-wrap: pretty; }
:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```

## Using an existing system

If the project already has Tailwind, shadcn, CSS variables or a theme file, map onto its names rather than inventing a parallel set. In Tailwind v4, declare the semantic tokens in `@theme`; in v3, extend `theme.colors` etc. with `var(--color-*)` references.

## Audit checks

- Grep for colour and font literals outside the token block: `rg -n "#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(|font-family" --glob "!**/tokens.css"`.
- List all custom properties; look for near-duplicates and primitives used directly in components.
- Count distinct font sizes, spacing values, radii and button styles. Many near-duplicates means no system.
- Check whether dark mode and focus states come from tokens or are patched in ad hoc.
