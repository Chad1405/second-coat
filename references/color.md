# Colour

Sources: Figma Resource Library, *Color combinations* and *Design token architecture*, plus WCAG. Paraphrased. Figures tagged [std] are standard practice, not from the Figma article.

## 1. Start from meaning, not from a swatch

Choose the anchor hue from what the brand needs to signal, then check it against the category so you don't land on the same colour as every competitor.

| Hue | Usually signals | Watch out for |
|---|---|---|
| Blue | Trust, finance, professional | The most overused hue on the web. Push it (ink navy, petrol, cobalt) or pick something else |
| Green | Health, nature, growth, money | Mint-green fintech is a cliché |
| Red / orange | Urgency, appetite, action | Overwhelming in large areas; good as a 10% accent |
| Yellow | Optimism, youth, kids | Fails contrast as text on white. Use dark text on it |
| Purple | Luxury, creativity | The Wave 1 AI colour. Needs a strong reason |
| Brown / beige / sand | Warm, earthy, crafted | Cream + terracotta is the current AI "tasteful" default |
| Charcoal / grey / black | Minimal, premium | Tint it; pure grey reads unfinished |

Category palettes that work better than an indigo default:

- Banking and legal: pewter + taupe, or deep ink + paper
- Portfolio, high-end retail: charcoal + cool grey + ivory
- Food and premium lifestyle: dark brown + caramel + cream
- Real estate and architecture: concrete grey + brick red + black
- Travel and wellness: sand + beige + one saturated note (not terracotta by reflex: try sea glass, ochre, olive)
- Sleep and calm: periwinkle into deep blue
- Gaming and nightlife: near-black + one electric accent (one, not two)

## 2. Pick one harmony on purpose

| Harmony | What it is | Use for |
|---|---|---|
| Monochromatic | One hue at several lightnesses | Cohesion, calm, premium. Easiest to get right |
| Analogous | Neighbouring hues | Soft, natural, related |
| Complementary | Opposite hues | Punch: one dominates, the other is the accent |
| Split-complementary | Base + the two neighbours of its complement | Lively but balanced |
| Triadic | Three evenly spaced hues | Playful brands. One leads, two accent |
| Tetradic | Four hues | Hard to balance. Avoid by default |

## 3. Proportion

- **60 / 30 / 10** [std]: about 60% neutral surface, 30% secondary (surfaces, large type, imagery tone), 10% accent.
- Build on a neutral base (paper, stone, sand, near-black) and let one saturated hue do the work.
- Save the brightest, most saturated value for the primary action and the one focal point. Never spend it on decoration.
- Light tints for backgrounds and quiet surfaces; dark shades for text and primary buttons.
- If hues compete, add neutral or pull one hue's saturation or lightness down. Adjust lightness and saturation before changing hue.

## 4. Build the palette in OKLCH

OKLCH keeps perceived lightness consistent across hues, so a ramp looks even and contrast is predictable.

```css
:root {
  /* primitives: the raw ramp for one anchor hue (h = 250 here) */
  --ink-50:  oklch(98% 0.005 250);
  --ink-100: oklch(95% 0.010 250);
  --ink-300: oklch(82% 0.020 250);
  --ink-500: oklch(58% 0.030 250);
  --ink-700: oklch(38% 0.030 250);
  --ink-900: oklch(20% 0.020 250);
  --signal-500: oklch(64% 0.19 35);  /* the one accent */
}
```

- Neutrals carry a trace of the anchor hue (chroma 0.005 to 0.03). Zero-chroma grey looks unfinished next to a brand colour.
- Avoid pure `#000` and `#fff` for text and surfaces. Near-black on off-white reads as designed.
- For dark mode, don't invert. Remap the semantic tokens (see `tokens.md`): surfaces step up in lightness for elevation, accent desaturates slightly, body text sits around 90% lightness, not 100%.

## 5. Contrast and accessibility [std]

- Body text: 4.5:1 minimum against its background.
- Large text (24px+, or 18.66px+ bold), icons, focus rings, input borders: 3:1 minimum.
- Every accent that carries text needs a paired ink token (`--color-accent-ink`) that passes.
- Never encode meaning in hue alone (errors also get an icon or text; links also get an underline or weight).
- Check the palette under protanopia and deuteranopia simulation (Chrome DevTools > Rendering > Emulate vision deficiencies).

## Audit checks

- Count saturated hues outside the brand ramp. More than one or two accents, or accent on more than ~10% of the viewport, is a smell.
- Grep for raw `#hex` / `rgb(` outside the token block.
- Look for the stock signatures: purple-to-blue gradient on white, Tailwind `indigo-500` / `violet-600`, cyan-on-black.
- Run every text/background pair through a contrast checker.
