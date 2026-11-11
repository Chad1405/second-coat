# Logos

Sources: Figma Resource Library, *How to design a logo*; standard identity practice [std]. Paraphrased.

## 1. Pick the type for the job

| Type | What it is | Suits |
|---|---|---|
| **Wordmark** | The name, set and drawn as the logo | Short or distinctive names; when the name is the asset |
| **Lettermark** | One to three letters | Long names; small spaces such as app icons |
| **Symbol with wordmark** | A mark that can stand alone, beside the name | Products that need an app icon and a header logo |
| **Emblem** | Name and mark enclosed in one shape | Badges, physical goods, heritage brands; weak at 16px |
| **Abstract mark** | A shape with no literal meaning | Only when the user wants to build meaning into it over time |

A product with an app or a browser tab needs a mark that works without the name, whichever type leads.

## 2. Principles

- **Simple:** the fewest elements that carry the idea. Every shape has a job.
- **Lasting:** built on what the company is, not on this year's look.
- **Its own:** a competitor's brief shouldn't produce the same mark.
- **Relevant:** fits the audience and the trade without clichés from it.
- **Readable:** the name is legible at every size it will appear.
- **Versatile:** a family (lockup, mark, one colour, reduced) rather than one file.
- **Documented:** written rules keep it consistent.
- **Protected:** trademark conflicts are checked before launch. That check is the user's.

## 3. Construction [std]

- Draw the mark on a 100 by 100 grid with whole-number coordinates. Snap curves to the grid where you can.
- Use the fewest paths. Two or three shapes usually beat ten.
- Keep strokes and gaps at 6 units or more. Thinner lines vanish at 16px; filled shapes survive better than outlines.
- Round shapes look smaller than square ones of the same size: let circles and points overshoot the grid slightly (about 2 units).
- Balance the visual weight, not the bounding box. Centre what the eye sees as the middle.
- For the wordmark, tighten spacing slightly at display size, and fix awkward pairs (`AV`, `To`, `ry`) by hand. `outline.py` doesn't apply the font's kerning.
- Reduced version for 16 to 32px: drop detail, thicken strokes, keep only the shape people recognise.

## 4. Colour

- Make it work in one flat colour first: black on white, white on black.
- Then one or two brand colours. Gradients, glows and textures are for large uses only, and the flat version stays the master.
- Check the mark on the product's own backgrounds, light and dark, at the real size.
- **White or pale parts vanish on a light browser tab.** If the mark has any, put the tab and app icon on their own tile in the brand's dark colour (a rounded square, corners about 22% of its size). It then reads the same on every tab and home screen.
- **Pale accents vanish on light backgrounds.** Make a light version of the lockup: deepen the accent until it's at least 3:1 against the light background, and turn anything white into the brand's ink.

## 5. Files and where they go

| File | Use |
|---|---|
| `logo.svg` | Site header, documents, anywhere with room for the name |
| `logo-light.svg` | The same on light backgrounds, with deepened colours |
| `mark.svg` | Avatars, app icon artwork, anywhere square |
| `mark-mono.svg` | One-colour printing, watermarks, overlays |
| `wordmark.svg` | Where the mark would repeat something nearby |
| `favicon.svg` and `favicon-32.png` | Browser tabs |
| `apple-touch-icon.png` (180) | Phone home screens; give it a solid background |
| `icon-192.png`, `icon-512.png` | Installable web apps |
| `og-image.png` (1200 by 630) | Link previews in chats and social posts |

Head tags for a web page (in Next.js, put the files in `src/app` as `icon.svg`, `apple-icon.png` and `opengraph-image.png` instead, and it writes these tags itself):

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:image" content="https://<domain>/og-image.png">
```

## Audit checks

- Show it at 16px in a real tab. Is it recognisable?
- Print it in one colour. Does it still work?
- Cover the name. Could the mark belong to any company in the trade?
- Walk the Logos section of `ai-tells.md`.
- Open the SVG in a text editor. Is there live text, an embedded image or a filter? Outline, redraw or remove.
