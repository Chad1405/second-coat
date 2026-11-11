# Second Coat eval: round-7

Builds run with `claude -p` in isolated folders with no user skills, hooks or MCP servers. "With" runs also load this plugin. Claude Code's built-in skills stay available to both conditions; "without" runs called: artifact-design, run. Agents had no network or browser tool. From round 7 they can run node, which fresh-coat uses for its screenshot self-check; the reused round 3 "without" builds had no shell. Numbers are medians across runs unless stated.
## Pass bars

- **FAIL**: Zero invented business claims in fresh-coat runs (5 found)
- **FAIL**: Zero serious WCAG failures in fresh-coat runs (32 elements)
- **Pass**: At least 80% of planted faults found (100%)
- **Pass**: Few false alarms (at least 90% of findings real) (98%)
- **Pass**: Looks less AI-made than no skill in blind picks (over 60%) (6/9)
- **Pass**: Judges would ship it over no skill (over 50%) (6/9)
- **Pass**: No visible placeholders in fresh-coat runs (0 found)
- **Pass**: No two briefs converging on one look (0 collisions)

Skill-run cost: $27.06 at API list prices, judges not included. Human blind picks are not part of this report.


## fresh-coat vs no skill

| Scenario | Condition | Runs | Visible placeholders | Web-font runs | Invented business claims | Invented features | Serious WCAG nodes | Overflow widths | Kinds of AI tell* | Raw colours | Lighthouse perf | Design (1-5) | Human-made (1-5) | Brief met |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| invoicing-terse | with | 3 | 0 | 3/3 | 0 | 19 | 0 | 1 | 0 | 0 | 88 | 4.18 | 5 | 100% |
| invoicing-terse | without | 3 | 0 | 2/3 | 7 | 18 | 0 | 0 | 4 | 0 | 87 | 4.18 | 5 | 100% |
| law-firm-full | with | 3 | 0 | 3/3 | 0 | 5 | 0 | 0 | 1 | 0 | 90 | 4.09 | 4 | 100% |
| law-firm-full | without | 3 | 0 | 0/3 | 0 | 6 | 0 | 0 | 2 | 1 | 100 | 4.09 | 4 | 100% |
| gaming-pinned | with | 3 | 0 | 3/3 | 2 | 14 | 0 | 0 | pinned | 0 | 92 | 4.09 | 4 | 100% |
| gaming-pinned | without | 3 | 0 | 3/3 | 1 | 14 | 0 | 0 | pinned | 25 | 93 | 4.27 | 4 | 100% |

*Tells are not counted for the pinned scenario, because that brief asks for them.

## Blind model comparison (fresh-coat wins)

Less AI-looking 6/9. Would ship 6/9. Better follows the brief 6/9.

- invoicing-terse: less AI-looking 2/3, would ship 2/3, follows the brief 2/3
- law-firm-full: less AI-looking 2/3, would ship 2/3, follows the brief 2/3
- gaming-pinned: less AI-looking 2/3, would ship 2/3, follows the brief 2/3

## Sameness (excluding the pinned brief)

Display fonts with fresh-coat: Commissioner x2, Familjen Grotesk x2, Archivo x1, Atkinson Hyperlegible Next x1.
Display fonts without a skill: Iowan Old Style x3, Besley x1, Piazzolla x1, Bahnschrift x1.
Same font, light/dark and accent across different briefs: none.

## second-coat audits

| Site | Run | Planted found | Findings real | Bug and Tell findings | Stated score | Files changed |
|---|---|---|---|---|---|---|
| good-site | 1 | none planted | 9/10 | 1 | 22/27 | none |
| good-site | 2 | none planted | 9/10 | 0 | 21/27 | none |
| planted-20 | 1 | 20/20 | 29/29 | 20 | 5/27 | none |
| planted-20 | 2 | 20/20 | 27/27 | 22 | 4/27 | none |
| wave-3 | 1 | 12/12 | 26/26 | 15 | 10/27 | none |
| wave-3 | 2 | 12/12 | 22/22 | 15 | 10/27 | none |

## second-coat refresh

| Site | Tells before | Tells after | Links kept | Fields kept | IDs kept | Test IDs kept | Headings kept |
|---|---|---|---|---|---|---|---|
| planted-20 | 11 | 1 | 6/6 | 2/2 | 8/8 | 3/3 | 4/6 |
| wave-3 | 7 | 0 | 3/3 | 1/1 | 6/6 | 2/2 | 3/4 |

## Triggering

- Pass: audit-src, expected second-coat, fired second-coat
- Pass: generic-inspire, expected second-coat, fired second-coat
- Pass: new-cafe, expected fresh-coat, fired fresh-coat
- Pass: new-landing, expected fresh-coat, fired fresh-coat
- Pass: not-design, expected none, fired nothing
- Pass: restyle, expected second-coat, fired second-coat

## Asking before building

On a vague brief with a person present, fresh-coat stopped without building (expected: it should ask its questions).
