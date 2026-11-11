# Second Coat eval: round-4

Builds run with `claude -p` in isolated folders with no user skills, hooks or MCP servers. "With" runs also load this plugin. Claude Code's built-in skills stay available to both conditions; "without" runs called: artifact-design, run. Agents had no browser or network. Numbers are medians across runs unless stated.
## Pass bars

- **FAIL**: Zero invented business claims in fresh-coat runs (4 found)
- **Pass**: Zero serious WCAG failures in fresh-coat runs (0 elements)
- **FAIL**: At least 80% of planted faults found (n/a)
- **FAIL**: Few false alarms (at least 90% of findings real) (n/a)
- **FAIL**: Looks less AI-made than no skill in blind picks (over 60%) (1/3)
- **FAIL**: Judges would ship it over no skill (over 50%) (0/3)
- **Pass**: No visible placeholders in fresh-coat runs (0 found)
- **Pass**: No two briefs converging on one look (0 collisions)

Skill-run cost: $8.16 at API list prices, judges not included. Human blind picks are not part of this report.


## fresh-coat vs no skill

| Scenario | Condition | Runs | Visible placeholders | Web-font runs | Invented business claims | Invented features | Serious WCAG nodes | Overflow widths | Kinds of AI tell* | Raw colours | Lighthouse perf | Design (1-5) | Human-made (1-5) | Brief met |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| invoicing-terse | with | 0 | n/a | 0/0 | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| invoicing-terse | without | 0 | n/a | 0/0 | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| law-firm-full | with | 0 | n/a | 0/0 | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| law-firm-full | without | 0 | n/a | 0/0 | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| gaming-pinned | with | 3 | 0 | 3/3 | 1 | 13 | 0 | 0 | pinned | 0 | 93 | 4.18 | 4 | 100% |
| gaming-pinned | without | 3 | 0 | 3/3 | 1 | 14 | 0 | 0 | pinned | 25 | 93 | 4.27 | 4 | 100% |

*Tells are not counted for the pinned scenario, because that brief asks for them.

## Blind model comparison (fresh-coat wins)

Less AI-looking 1/3. Would ship 0/3. Better follows the brief 1/3.

- invoicing-terse: less AI-looking 0/0, would ship 0/0, follows the brief 0/0
- law-firm-full: less AI-looking 0/0, would ship 0/0, follows the brief 0/0
- gaming-pinned: less AI-looking 1/3, would ship 0/3, follows the brief 1/3

## Sameness (excluding the pinned brief)

Display fonts with fresh-coat: n/a.
Display fonts without a skill: n/a.
Same font, light/dark and accent across different briefs: none.

## second-coat audits

| Site | Run | Planted found | Findings real | Bug and Tell findings | Stated score | Files changed |
|---|---|---|---|---|---|---|

## second-coat refresh

| Site | Tells before | Tells after | Links kept | Fields kept | IDs kept | Test IDs kept | Headings kept |
|---|---|---|---|---|---|---|---|

## Triggering

