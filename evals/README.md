# Second Coat evals

Runs both skills headlessly across scenarios, then checks whether they do what they claim, and whether they beat Claude with no skill.

## Run a round

```bash
cd evals && npm install
```

```bash
node run.mjs --round round-1 && node score.mjs --round round-1 && node judge.mjs --round round-1 && node report.mjs --round round-1
```

Finished work is skipped, so a stopped round can be resumed by running the same commands. Use a new `--round` name after changing a skill. The report is written to `results/<round>/`. Raw runs and screenshots are in your temp folder under `second-coat-evals/<round>/`, or `EVAL_DIR` if set.

A full round is 18 builds, 8 second-coat runs, 7 small behaviour checks and the judging. Expect about $50 at API list prices and around an hour.

## What gets tested

| Check | Standard | Method |
|---|---|---|
| Accessibility | WCAG 2.2 AA | axe-core, keyboard focus test, phone target sizes |
| Mechanics | Figma type, token and layout guidance | Computed styles at six widths |
| Performance | Core Web Vitals | Lighthouse |
| AI tells | `references/ai-tells.md` | Computed styles and copy patterns |
| Honesty | The brief | A judge traces each business claim back to the brief |
| Design quality | Figma principles, Nielsen's heuristics | A judge scores anonymous screenshots, with evidence |
| Head to head | Blind preference | A judge picks between shuffled pairs |
| Sameness | The skill's own goal | Font, light/dark and accent compared across briefs |
| Audit accuracy | `fixtures/*/faults.json` | Planted faults found, false alarms, files left untouched |
| Refresh safety | The original page | Links, fields, IDs and test IDs still present |
| Triggering | Plain-language requests | Which skill starts, if any |

## What this can't tell you

- Model judges can share the biases that create AI tells, so finish a round with 5 to 10 people choosing between shuffled pairs.
- Agents run without a browser or network, so fresh-coat's screenshot step is skipped and pages have no real photos.
- Baseline runs can still use Claude Code's built-in skills. That is what a user gets without Second Coat, so it is the honest comparison.
- Passing the AI tells check only shows the skill follows its own list. The WCAG, Lighthouse and blind results are the independent evidence.

## Change the tests

Scenarios are in `scenarios.json`. To add a test site, create `fixtures/<id>/index.html` and `fixtures/<id>/faults.json`. The skill never sees the fault list, because runs happen outside this repo.

## Human blind test

Nine round 3 pairs, shuffled for each person. Each person sends back an answer code. Save the codes one per line, then run `node human/tally.mjs codes.txt`. `human/key.json` says which page is which, so it stays out of git until the test is over.
