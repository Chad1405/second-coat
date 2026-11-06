---
name: second-coat
description: Audit, refresh or redesign an existing website so it stops looking AI-generated and follows sound colour, type, layout and UX principles. Use when the user has a site already and wants an audit, a review, fresh inspiration, a restyle, or a redesign. For a brand-new site, use fresh-coat instead.
argument-hint: "[audit | inspire | refresh | redesign] <path or URL>"
---

# Second Coat

Look hard at an existing site, say plainly what reads as AI-made or broken, then fix it at the depth the user wants. The content and wiring belong to the user; the look is what's up for change.

Shared references live in `../../references/` relative to this file. `ai-tells.md` is the checklist; the others explain the fixes.

## Pick the mode

| Mode | What it does | Changes files? |
|---|---|---|
| **audit** (default) | A scored report: what works, what reads as generated, what's broken | No |
| **inspire** | Audit summary + three distinct new directions to choose from | No |
| **refresh** | Keep the layout. Replace the system (colour, type, spacing, radius, motion) and fix every tell | Yes |
| **redesign** | Keep the content and wiring. Rethink the composition, sections and system | Yes |

If the user didn't name one, run **audit**, then ask which to do next. Never jump to a deeper mode than asked; if a refresh can't fix the real problem, say so and recommend the redesign.

## 1. Look

1. Find the target: source files (preferred), a running dev server, or a URL. A URL with no source can only be audited.
2. Read the stack and the system: framework, CSS approach, tokens or variables, fonts, colours, components.
3. If a browser is available, screenshot each key page at 390 and 1440 wide. Look at the screenshots before reading the code, so the code doesn't write the verdict.
4. Note what the site is for: the audience and the one action.

## 2. Audit

Walk `ai-tells.md` section by section, using the audit checks at the end of `color.md`, `typography.md`, `layout-and-ux.md`, `tokens.md` and `discovery-and-story.md`. Quick checks worth running:

- `rg -n "#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(" <src>` for colour literals outside tokens.
- `rg -n "font-family" <src>` to count families.
- `rg -ni "seamless|effortless|unlock|elevate|supercharge|empower|cutting-edge|next-generation|game-chang|revolutioni|world-class|learn more" <src>` for copy tells.
- `rg -n "transition:\s*all|100vw|bg-gradient-to|from-purple|from-indigo|to-blue" <src>`.
- Contrast on every text/background pair; tab through for focus states.

Score each area 0 to 3 (0 broken, 1 generic, 2 decent, 3 distinctive):

| Area | Looks at |
|---|---|
| Story | Five-second test, headings tell a story, one clear action |
| Colour | Anchor and harmony, proportion, contrast, stock palettes |
| Type | Display voice, scale, measure, labels, families |
| Layout | Hierarchy, grid, spacing system, rhythm, template shape |
| Imagery | Real vs stock vs fake, icons, decoration |
| Copy | Specific vs buzzword, invented proof, CTA labels |
| Motion | Purposeful vs scattered, reduced-motion, performance |
| UX and access | Targets, states, focus, forms, responsive |
| System | Tokens, near-duplicate values, consistency |

Report format (in chat, and saved to `second-coat-audit.md` at the project root so a later refresh or redesign can use it):

```markdown
# Second Coat audit · <site> · <date>

**What it's for:** <audience> → <one action>
**Score:** 15 / 27 · Story 2 · Colour 1 · Type 1 · Layout 2 · Imagery 1 · Copy 1 · Motion 2 · UX 3 · System 2
**Verdict:** <one or two sentences, plain>

## Keep
- <at least one thing that works, and why>

## Fix (most visible first)
| # | Severity | Area | Finding | Where | Fix |
|---|---|---|---|---|---|
| 1 | Tell | Colour | Purple-to-blue hero gradient | `app/page.tsx:14` | One anchor hue, solid surface |

## Lightest mode that fixes most of this
<refresh or redesign, and what only a redesign would solve>
```

Severities: **Bug** (broken for someone: contrast, focus, overflow, broken link), **Tell** (a visitor would notice it looks AI-made), **Smell** (a designer would notice). Every finding gets a location and a concrete fix.

**audit stops here.**

## 3. Inspire

After a short audit summary (score, verdict, top five findings), offer **three directions that differ from each other and from the current site**, each as a Direction card (see `../fresh-coat/SKILL.md` §2): dials, colour, type, surface, signature, and one line on what it changes about how the site feels. Base them on the site's real content and audience; at least one should keep the brand colour if there is one. Ask which to take forward (into refresh or redesign).

## 4. Refresh or redesign

**Always keep:**
- Every fact, price, date, name, quote and claim on the site. Existing numbers and testimonials are the user's: keep them and list any that look unverified.
- Every link, route, form, field `name`, `id`, handler, `data-testid`, script and analytics call. Edit markup inside the component that owns it.
- The brand, if it's real: a logo, a named colour or face, a brand file. A framework default (Tailwind indigo, Inter as display, a stock gradient) isn't a brand and can go; say so.
- Legal text, terms and consent wording, verbatim.

**Never, without a file-level plan the user approved:** delete a file, remove a route, replace a component tree, or edit tests to make things pass.

Before editing, in a git project, ask the user to commit or stash so the change is one reviewable diff. Then post a short plan:

```
Mode: refresh · pages: /, /pricing
Keeps: all links, forms, copy; the green brand colour; the pricing table layout
Changes: tokens, type pair, spacing scale, buttons, hero background, 6 copy tells
Files: edit app/globals.css, app/page.tsx · create app/tokens.css · delete none
```

**Refresh:** load `tokens.md`, `color.md`, `typography.md`. Build the token layer (map onto existing variable names where they exist), swap the type and palette, unify spacing and radii, fix every Tell and Bug in place. Copy changes only where a copy tell was found, each listed before and after.

**Redesign:** run the fresh-coat Direction and Story steps (`../fresh-coat/SKILL.md` §2 and §3) using the site's own content as the material, then rebuild page by page, most visited first, shared components and nav before pages. New sections or claims the site never had are suggested to the user, not added.

## 5. Check and hand back

1. Re-walk `ai-tells.md` and re-score. Run the project's own type check, build and tests if they exist; a change that breaks one isn't done.
2. Confirm nothing was lost: compare links, forms and headings before and after.
3. Screenshot the same pages and widths as step 1 if a browser is available, before and after side by side.
4. Hand back:

```
Second Coat · refresh · 2 pages
Score   15/27 → 23/27
Kept    14/14 links · 5/5 form fields · all copy except 6 lines (listed)
Changed tokens, type, spacing, buttons, hero
Yours   2 claims kept as found ("50,000+ teams", the Acme quote): please verify
Next    <the one thing that would most improve it, often real photos or screenshots>
```
