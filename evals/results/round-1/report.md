# Second Coat eval: round-1

Builds run with `claude -p` in isolated folders with no user skills, hooks or MCP servers. "With" runs also load this plugin. Claude Code's built-in skills stay available to both conditions; "without" runs called: artifact-design, run. Agents had no browser or network. Numbers are medians across runs unless stated.
## Pass bars

- **FAIL**: Zero invented business claims in fresh-coat runs (8 found)
- **Pass**: Zero serious WCAG failures in fresh-coat runs (0 elements)
- **Pass**: At least 80% of planted faults found (100%)
- **Pass**: Few false alarms (at least 90% of findings real) (99%)
- **Pass**: Looks less AI-made than no skill in blind picks (over 60%) (7/9)
- **FAIL**: Judges would ship it over no skill (over 50%) (3/9)
- **FAIL**: No visible placeholders in fresh-coat runs (32 found)
- **FAIL**: No two briefs converging on one look (1 collisions)

Skill-run cost: $31.40 at API list prices, judges not included. Human blind picks are not part of this report.


## fresh-coat vs no skill

| Scenario | Condition | Runs | Visible placeholders | Web-font runs | Invented business claims | Invented features | Serious WCAG nodes | Overflow widths | Kinds of AI tell* | Raw colours | Lighthouse perf | Design (1-5) | Human-made (1-5) | Brief met |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| invoicing-terse | with | 3 | 3 | 0/3 | 0 | 20 | 0 | 0 | 0 | 0 | 100 | 4 | 5 | 100% |
| invoicing-terse | without | 3 | 0 | 2/3 | 7 | 18 | 0 | 0 | 4 | 0 | 87 | 4.18 | 5 | 100% |
| law-firm-full | with | 3 | 0 | 0/3 | 2 | 5 | 0 | 0 | 0 | 0 | 100 | 4.09 | 4 | 100% |
| law-firm-full | without | 3 | 0 | 0/3 | 0 | 6 | 0 | 0 | 2 | 1 | 100 | 4.09 | 4 | 100% |
| gaming-pinned | with | 3 | 8 | 3/3 | 0 | 7 | 0 | 1 | pinned | 0 | 85 | 3.91 | 4 | 100% |
| gaming-pinned | without | 3 | 0 | 3/3 | 1 | 14 | 0 | 0 | pinned | 25 | 93 | 4.27 | 4 | 100% |

*Tells are not counted for the pinned scenario, because that brief asks for them.

## Blind model comparison (fresh-coat wins)

Less AI-looking 7/9. Would ship 3/9. Better follows the brief 3/9.

- invoicing-terse: less AI-looking 2/3, would ship 1/3, follows the brief 1/3
- law-firm-full: less AI-looking 2/3, would ship 2/3, follows the brief 2/3
- gaming-pinned: less AI-looking 3/3, would ship 0/3, follows the brief 0/3

## Sameness (excluding the pinned brief)

Display fonts with fresh-coat: Palatino Linotype x2, Sitka Banner x1, Bahnschrift x1, Iowan Old Style x1, Superclarendon x1.
Display fonts without a skill: Iowan Old Style x3, Besley x1, Piazzolla x1, Bahnschrift x1.
Same font, light/dark and accent across different briefs: Palatino Linotype / light / accent 60 x2.

## second-coat audits

| Site | Run | Planted found | Findings real | Bug and Tell findings | Stated score | Files changed |
|---|---|---|---|---|---|---|
| good-site | 1 | none planted | 10/10 | 1 | 22/27 | none |
| good-site | 2 | none planted | 12/12 | 1 | 21/27 | none |
| planted-20 | 1 | 20/20 | 33/33 | 25 | 4/27 | none |
| planted-20 | 2 | 20/20 | 36/36 | 28 | 5/27 | none |
| wave-3 | 1 | 12/12 | 27/28 | 18 | 9/27 | none |
| wave-3 | 2 | 12/12 | 23/23 | 16 | 9/27 | none |

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
