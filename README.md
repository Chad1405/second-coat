# Second Coat

Two skills for building websites with AI that don't look built by AI.

| Skill | Use it when | Command |
|---|---|---|
| **fresh-coat** | You're building a new site or page from scratch | `/fresh-coat a site for my bakery in Leeds` |
| **second-coat** | You have a site and want an audit, inspiration, a refresh or a redesign | `/second-coat audit ./src` |

`second-coat` modes: `audit` (report only, the default), `inspire` (three new directions), `refresh` (keep the layout, replace the look), `redesign` (keep the content, rethink the page).

## Why

AI sites look alike because a model fills every choice nobody made with its training default. The defaults have changed over time:

- **Wave 1:** purple-to-blue gradients, glowing orbs, emoji icons, "Unleash the power of".
- **Wave 2:** dark mode with neon, identical bento cards, tracked-caps eyebrows, invented stats.
- **Wave 3 (now):** cream paper with a serif and terracotta, one italic word in the headline, mono labels, middle dots, em-dashes.

Swapping one list of defaults for another just produces the next wave. These skills make the agent ask a few real questions, decide each design axis from the brief, then check the result against a catalogue of known tells.

## What's inside

```
skills/
  fresh-coat/SKILL.md      build from scratch: ask → direction → story → build → check
  second-coat/SKILL.md     audit / inspire / refresh / redesign an existing site
references/
  ai-tells.md              the catalogue of AI tells, by area, each with its fix
  color.md                 colour meaning, harmonies, 60/30/10, OKLCH, contrast
  typography.md            font choice by voice, modular scales, setting text
  layout-and-ux.md         hierarchy, spacing, golden ratio, Fitts's law, UI principles
  tokens.md                two-tier token architecture and a starter tokens.css
  discovery-and-story.md   discovery questions and landing-page narrative
```

Both skills read the shared `references/` folder, so keep the repo structure intact.

## Install

As a Claude Code plugin:

```bash
claude plugin marketplace add <path-or-git-url-to-this-repo>
```

```bash
claude plugin install second-coat@second-coat
```

Or copy the whole repo into `~/.claude/skills/second-coat/` and point Claude at the skills directly. The SKILL.md files are plain markdown, so other agents (Cursor, Codex, Gemini) can read them too.

## Sources

The guidance is paraphrased and combined from:

- **Figma Resource Library:** [color combinations](https://www.figma.com/resource-library/color-combinations/), [design token architecture](https://www.figma.com/resource-library/design-token-architecture/), [user-centered design questions](https://www.figma.com/resource-library/user-centered-design-questions/), [what is UX design](https://www.figma.com/resource-library/what-is-ux-design/), [golden ratio](https://www.figma.com/resource-library/golden-ratio/), [Fitts's law](https://www.figma.com/resource-library/fitts-law/), [graphic design principles](https://www.figma.com/resource-library/graphic-design-principles/), [design system examples](https://www.figma.com/resource-library/design-system-examples/), [UI design principles](https://www.figma.com/resource-library/ui-design-principles/), [best fonts for websites](https://www.figma.com/resource-library/best-fonts-for-websites/), [storytelling in design](https://www.figma.com/resource-library/storytelling-in-design/).
- **Hallmark** skill: the hard floor, the ask-once step, the anti-template rules, and redesign's "keep the content and wiring" contract.
- **Impeccable** skill ([pbakaus/impeccable](https://github.com/pbakaus/impeccable)): the craft floor, the refuse list, bounded verification passes.
- **Taste** skill ([Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)): the variance / motion / density dials, copy budgets, banned copy patterns, gating effects by business type.
- WCAG 2.2 for contrast and target sizes.

Further Figma reading worth folding in later: [font pairings](https://www.figma.com/resource-library/font-pairings/), [types of color palettes](https://www.figma.com/resource-library/types-of-color-palettes/), [responsive website design](https://www.figma.com/resource-library/responsive-website-design/), [landing page examples](https://www.figma.com/resource-library/landing-page-examples/), [pricing page best practices](https://www.figma.com/resource-library/pricing-page-best-practices/), [web design trends](https://www.figma.com/resource-library/web-design-trends/).
