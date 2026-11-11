---
name: primer
description: Design a logo, wordmark, symbol or app icon from scratch as clean SVG, then export the favicon, app icons and link-preview image. Use whenever someone asks for a logo, brand mark, wordmark, monogram, app icon or favicon, or says their product needs a brand or identity, including inside a bigger website or app request when no logo exists yet. For building the website itself use fresh-coat; for reviewing an existing site use second-coat.
argument-hint: "<the name, and what it does>"
---

# Primer

The coat before the first coat: the mark everything else carries. Generated logos look alike for the same reason generated sites do: every undecided choice gets the model's default (a sparkle for AI, an initial in a circle, a gradient blob). This skill has the user choose, draws the mark by hand in SVG, and tests it where it will really live: a 16px browser tab, a phone's home screen, a link preview in a chat.

Shared references live in `../../references/`: `logo.md` for logo practice, plus `color.md`, `typography.md` and the Logos section of `ai-tells.md`. Load them where the steps say.

## The floor

1. **Never invent meaning.** No symbolism, history or story the user didn't give. If the name means something, they tell you; then the mark can use it.
2. **Draw it, don't generate it.** Hand-written SVG on a grid: whole numbers, few shapes, no raster images, no filters. The delivered files contain outlines, never live text, so they look the same on every machine.
3. **One colour first.** The mark must work in a single flat colour before any palette, gradient or glow is added.
4. **It survives 16px.** If the mark can't be recognised in a browser tab, simplify it or give it a reduced version for small sizes.
5. **No AI-logo tells as a reflex** (`ai-tells.md`, Logos): sparkles, brains, circuits, connected nodes, initials in a circle, gradient blobs, lightbulbs, rockets, a coloured dot beside the name. If the user asks for one by name, build it properly.

## Flow

### 0. Read first
Look for what already exists: `DESIGN.md`, brand colours and fonts, any old logo, the product itself. Anything the user owns is kept unless they say otherwise. If a logo exists and they want it changed, ask what must survive (colour, a shape, the letterforms people know).

### 1. Ask
In one message:
1. **The name, exactly as it's written** (capitals, spacing, any characters in another script).
2. **What it does and for whom.**
3. **Any meaning or story** behind the name they want the mark to carry.
4. **Where it will live:** browser tab, app store, social avatar, print, merchandise.
5. **Colours or fonts they already own.**

Skip only what the prompt already answers. Infer only when the user says **go ahead** or says nobody is available to answer, and then state your inferences in one line.

### 2. Options board
Load `logo.md` and `color.md`. Show, don't describe: render a board (a visual widget, or `board.html` screenshotted with `../fresh-coat/shot.mjs`) with:
- **Logo types**, each sketched with the real name: wordmark, lettermark, symbol with wordmark, emblem
- **Three or four palettes** as swatches, starting from any colours they own
- **Three letterform directions** set in real fonts, with a line on why each fits

Ask for one pick each (`AskUserQuestion` where it exists). If two picks clash, ask how to combine them.

### 3. Three variations
Build three in `brand/variations/a.svg`, `b.svg`, `c.svg`, each a mark plus wordmark lockup. Each takes a different idea from the subject's own material: the name's meaning, the product's real object, a letterform's own shape. Write two or three candidate ideas per variation and discard any that would suit a different company. Honour every pick; where they left something open, take each variation somewhere different.

Construction (`logo.md`): the mark on a 100 by 100 grid, whole-number coordinates, the fewest shapes that carry the idea, strokes no thinner than 6 units, counters open enough to survive 16px.

### 4. Look and test
Put all three on one `brand/board.html`: each mark at 16, 32, 64 and 256px, the tab icon on a white tab, the lockup on the page's dark and light colours, and each in one flat colour. Screenshot it with `../fresh-coat/shot.mjs` and look:
- At 16px, can you still tell the three apart? Is anything muddy?
- In one colour, does it still work?
- On a white tab, do white or pale parts vanish? If so, the tab icon gets its own dark tile (`logo.md`, Colour).
- On the light background, does a pale accent disappear? Deepen it and turn white parts to ink for a light version.
- Cover the name: is the mark this company's, or anyone's?
- Walk the Logos section of `ai-tells.md`.

Fix the three worst problems, look once more, then show the user the board and ask them to pick one or combine parts ("A's mark with C's lettering").

### 5. Finish
1. **Outline the lettering** so no font is needed: `uv run --with fonttools python <this skill>/outline.py <font.ttf> "<Name>" brand/wordmark.svg`. It prints the path and width. Get the font file from where the user's project already loads it, or Google Fonts' repository (`github.com/google/fonts`, under `ofl/<family>/`).
2. **Write the files** in `brand/`: `logo.svg` (the lockup), `logo-light.svg` (for light backgrounds), `mark.svg`, `mark-mono.svg` (one flat colour), `wordmark.svg`, and `favicon.svg` (the mark, or its reduced version, simplified for 16px, on its own tile if it has white or pale parts).
3. **Export the raster sizes:** `node <this skill>/export.mjs brand/favicon.svg brand/logo.svg brand "<background colour>"` writes `favicon-32.png`, `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png` and `og-image.png` (1200 by 630).
4. **Wire it in** where the project has a page: the head tags from `logo.md`.
5. **Write the rules** into `DESIGN.md` under "Brand": clear space, minimum size, the colours, what never to do with it.

### 6. Hand back
- The chosen variation and what it's built from, in one line
- Every file in `brand/` and where each is used
- **Assumed:** every inference
- **Yours to do:** check the name and mark for trademark conflicts before launch, and register them if the business depends on them. This skill can't check that.
