# AI tells

The patterns that make a visitor think "an AI made this." Each one is a default a model reaches for when nobody decided. None is illegal if the brief asks for it by name; all of them are wrong as a reflex.

Use this file two ways:
- **fresh-coat:** read before building, then check the finished page against it.
- **second-coat:** walk it as the audit checklist. Each hit gets a severity: **Tell** (a visitor would notice), **Smell** (a designer would notice), **Bug** (broken for someone).

---

## How the tells have changed

| Era | What gave it away | Status |
|---|---|---|
| **Wave 1** (2023 to early 2024) | Purple-to-blue gradients, glowing orbs, glassmorphism cards, emoji icons, "Unleash the power of", Inter everywhere, everything centred, pill buttons with gradient fills | Mostly gone from good models, still common in templates and one-shot builds |
| **Wave 2** (2024 to 2025) | Dark mode with a neon accent, bento grids of identical cards, eyebrow labels in tracked caps, three-feature rows with icons in rounded tiles, invented stats ("10,000+ teams"), fake logo walls, gradient text on one word | Very common now |
| **Wave 3** (2025 onward) | Cream paper + high-contrast serif + terracotta accent ("tasteful AI"), one italic word in a roman heading, mono "technical" labels, middle-dot meta strings, arrows glued to links, em-dash copy, a mailing-list sign-up as the closer on every page | The current tells. Models learned "don't look like Wave 1" and converged on a new default |

The lesson from the table: **avoiding a list is not the same as deciding.** Every wave was a model escaping the last list into the next default. The cure is a direction derived from *this* brand, audience and content (see the skills' direction step), not a different stock look.

---

## Colour

| Tell | Instead |
|---|---|
| Purple-to-blue, purple-to-pink, or cyan-on-dark gradients anywhere, including gradient text | One anchor hue, solid ink. Gradients only as a single-hue ramp with a reason |
| Gradient or coloured text on one "accented" word of a heading | Set the whole heading one way. Emphasis comes from size and placement |
| Framework default palettes used as-is (Tailwind `indigo-500`, `violet-600`, `slate-900`) | Mix the palette for this brand, ideally in OKLCH |
| Pure `#000` text on pure `#fff` | Tint neutrals slightly toward the anchor hue (near-black, warm or cool off-white) |
| Zero-chroma greys on a page that has a brand hue | Neutrals carry a trace of the brand hue |
| Accent colour everywhere (every heading, icon, border, link) | Accent is roughly 10% of the view. It marks the action and little else |
| Glow and wash: aurora blobs, blurred orbs, radial spotlights, coloured zero-offset glow shadows | Flat or textured surface. Depth from lightness steps and real shadows (offset + blur) |
| Dark mode chosen because the category "looks techy" | Pick light or dark from where and when people use it |
| Grey text on a coloured background | Tint secondary text from the surface hue, check contrast |
| Cream paper + serif display + terracotta/clay accent, unprompted | Fine if the brand earns it. As a default, move one axis: accent first, paper second, face last |

## Typography

| Tell | Instead |
|---|---|
| Inter, Roboto, Open Sans, Poppins, Lato or the system font as the *display* face | A display face with a voice that matches the brand (see `typography.md`). Those faces are fine for body |
| One italic word inside an otherwise roman heading | A line break, or the whole heading set one way |
| Eyebrows: small tracked-caps labels above headings ("FEATURES", "WHY US", "TRUSTED BY") | Delete it. The heading does the work. If the heading was figurative, make the plain label the heading |
| Labels, nav links, tags, table heads in ALL CAPS with wide letter-spacing | Body face, a step smaller, sentence case, normal tracking |
| Monospace as a "technical" costume on labels and meta | Mono only for code, data and measurements |
| More than three font families | Display + body, plus one outlier role at most |
| Prose running the full container width | Measure 45 to 75 characters, ~65ch default |
| Body text under 16px, or line-height under 1.4 | 16 to 18px body, 1.5 to 1.65 line-height |
| Every heading the same size step from body (timid scale) | A real scale with obvious jumps (see `typography.md`) |
| Uppercase display heading that wraps with line-height under 1.0 | 1.02 to 1.08 on caps display |

## Layout and composition

| Tell | Instead |
|---|---|
| **The template:** centred hero, three feature cards, testimonial, CTA band, four-column footer | Build the page from what this kind of site actually contains (a restaurant leads with the menu and hours, a band with the dates, a SaaS with the product doing its job) |
| Three equal columns of icon-in-a-rounded-tile + heading + two lines | Vary sizes and spans; inline icons; a list or a table; or one large example instead of three small claims |
| Bento grid of identical rounded cards as the whole page | A bento only when content genuinely varies in weight; otherwise a different structure |
| Card inside a card | One containment layer |
| Every section separated the same way with the same gap | Vary rhythm: some sections tight, some open; change surface in a few places, not every time |
| Everything centred | Left-align most text blocks. Centre at most one group per screen |
| Hero sized `100vh` with a big empty band under the text | Hero fits headline, one sentence, action and visual at 1280×800, using `svh`/`dvh` |
| The "AI nav": wordmark left, links middle, button right, hairline under | Fine if chosen; decide it on purpose, or vary (wordmark centred, nav in a side rail, single action) |
| The "AI footer": four link columns, social icon row, "All rights reserved" | Footer sized to the site. A small site needs one line |
| Section numbers `01 / 02 / 03` with no real sequence | Only number things that are actually ordered |
| Coloured thick `border-left` on cards and callouts | A hairline, a background step, or nothing |
| Hard offset shadows (`4px 4px 0 #000`) on a page that isn't otherwise neo-brutalist | Real shadows or none |
| Container uncapped: at 1920px the grid stretches or gains columns | Cap the container (~1280 to 1440px), centre it, let gutters grow |

## Imagery and decoration

| Tell | Instead |
|---|---|
| Emoji or unicode glyphs as icons | One icon set, one stroke weight (Lucide, Phosphor, Tabler, or custom SVG) |
| Two icon libraries mixed | One |
| Hand-drawn browser chrome (traffic-light dots, URL pill) around a fake screenshot | A real screenshot of the real product, or nothing |
| Fake "product UI" built from styled divs when the real product exists | Screenshot the real thing |
| Abstract 3D blobs, isometric illustrations, generic "people at laptops" stock | The user's photos, real product, real place. If none, strong type at scale beats a filler picture |
| Decorative grid or dot backgrounds with nothing on them | A plain surface, or texture that means something |
| Scroll cues, rotated vertical text, "BETA" pills, version badges with nothing to say | Delete them |
| Rows of identical counting marks (one dot per customer) | Set the number in type |

## Copy

| Tell | Instead |
|---|---|
| Buzzwords: seamless, robust, empower, supercharge, elevate, effortless, unlock, unleash, revolutionize, next-generation, world-class, cutting-edge, game-changing | Say what the product does, in its own nouns and verbs |
| Openers: "In today's fast-paced world", "Built for the modern team", "Say goodbye to" | Start with the claim |
| The rebuttal cadence: "Not just a tool. A platform." repeated | Once at most, preferably never |
| Triplets everywhere: "Fast. Simple. Powerful." | One specific claim with evidence |
| Em-dashes sprinkled through every line | Commas, full stops, colons |
| "Where X meets Y", questions as headlines, colon headings ("Speed: redefined"), exclamation marks | A plain statement of what it is or does |
| Invented capitalised concepts ("the Proof Layer", "Flow Engine") that the product doesn't actually call anything | The product's real names for things |
| Hero copy that runs long: a headline of 12 words, a paragraph of 60 | Headline 2 to 8 words, one supporting sentence of 12 to 30 words |
| Placeholder people and companies: Jane Doe, John Smith, Acme, Nexus | Real names from the user, or leave a clearly marked slot |
| **Invented numbers, testimonials, logos or case studies** | Never. Use the user's real proof, a marked slot, or leave it out |
| Stock secondary buttons: "Learn more", "Get started", "Book a demo" beside every primary | One primary action that names what happens ("See this week's menu", "Start a free trial") |
| Arrows glued to link text: "Learn more →" | A verb that says where it goes |
| Middle-dot meta strings: "Design · Strategy · Growth" | Line breaks, columns or plain commas |
| A section's last line restating its heading; the same fact printed in four places | Say each fact once, where it does work |
| An email sign-up as the closing section of every page | End on what the visitor came to do (book, buy, visit, download) |
| Fake success: a form that shows "Thanks!" with nothing wired behind it | Leave the endpoint empty and visible until it's real |

## Motion and interaction

| Tell | Instead |
|---|---|
| Shaders, particle fields, dark glowing pages on a bakery, clinic or law firm | Effects follow the business: tech, gaming and music can carry them; cafés, shops, services and places get photos and flat colour |
| Every section fading up on scroll, identically | One considered motion moment, or none. Content visible by default |
| The same hover lift and scale on every card | One hover signal per element type; none on non-interactive things |
| Bounce or overshoot easing on UI state | Exponential ease-out, 150 to 300ms |
| `transition: all`; animating `width`, `height`, `top`, `left` | Name the properties; animate `transform` and `opacity` |
| Auto-rotating carousels with no pause | Pause on hover and focus; a visible pause control |
| Content hidden until JavaScript reveals it | Visible by default; only hide under a `.js` class |
| Celebratory toasts for things the user can already see | Silent success |

## Floor (these are bugs, not taste)

- Text contrast under 4.5:1 (body) or 3:1 (large text, icons, focus rings, input borders).
- Interactive element with no visible `:focus-visible` state.
- Animation with no `prefers-reduced-motion` fallback.
- Click targets under 44×44px on touch layouts.
- Horizontal scroll at any width from 320px up (`overflow-x: clip` on `html, body`; never `100vw` widths).
- Button labels or primary nav wrapping onto two lines.
- Images with no `alt`; decorative SVG without `aria-hidden="true"`.
- Hard-coded colours and fonts scattered through the CSS instead of tokens.
