// Model judges. Design judges see anonymous screenshots only; they are never told which build used a skill.
// usage: node judge.mjs [--round round-1] [--concurrency 4] [--model claude-sonnet-5-5]
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { HERE, ROOT, claude, flag, parseJSON, pool, readJSON, runDirs, scenarios, writeJSON } from './lib.mjs';

const model = flag('model', 'claude-sonnet-5-5'), size = Number(flag('concurrency', 4));
const JUDGE_ROOT = join(ROOT, 'judging');
const hash = s => createHash('sha256').update(s).digest('hex').slice(0, 10);
const brief = id => scenarios.builds.find(b => b.id === id);

async function ask(prompt, cwd, tools = 'Read') {
  for (let attempt = 0; attempt < 2; attempt++) {
    const r = await claude({ prompt, cwd, tools, model, budget: 3, timeoutMs: 10 * 60e3 });
    try { return { ...parseJSON(r.text), judgeCostUsd: r.costUsd }; } catch (e) { if (attempt) return { error: e.message, raw: r.text.slice(0, 500), judgeCostUsd: r.costUsd }; }
  }
}

function blindCopy(run, label) {
  const dir = join(JUDGE_ROOT, hash(run.dir + label)); mkdirSync(dir, { recursive: true });
  const from = join(run.dir, 'shots');
  const files = readdirSync(from).filter(f => f.startsWith('part-') || f === 'phone-fold.jpg').sort();
  files.forEach(f => cpSync(join(from, f), join(dir, `${label}-${f}`)));
  return { dir, files: files.map(f => `${label}-${f}`) };
}

const CRITERIA = `Score each from 1 (poor) to 5 (excellent), giving one short piece of visible evidence for each:
focal_point: each view has one dominant element.
hierarchy: importance is clear from size, weight and contrast.
grouping: space inside groups is clearly smaller than space between groups.
alignment: elements sit on a consistent grid with shared edges.
rhythm: sections vary on purpose instead of repeating one template.
colour: a deliberate palette with restrained accent use and legible contrast.
typography: type has a voice and a clear, consistent scale.
story: section order answers a visitor's questions; each section earns its place.
primary_action: one obvious next step that says what happens.
consistency: controls and patterns look and behave alike (Nielsen heuristic 4).
clarity: a first-time visitor could say what this is within five seconds.
human_made: 5 means it looks designed by a person for this client, 1 means it looks like generic AI output.`;

async function designJudge(run) {
  const b = brief(run.id), { dir, files } = blindCopy(run, 'page');
  return ask(`You are a senior web design reviewer. Read these screenshots of one landing page, in order, with the Read tool: ${files.join(', ')}. The part files run top to bottom on desktop; phone-fold is the first phone screen.

The client's brief: """${b.prompt}"""

${CRITERIA}

Also check each required item is present: ${JSON.stringify(b.mustHave)}.

Reply with only JSON: {"scores":{"focal_point":{"score":n,"evidence":"..."}, ...all twelve...},"adherence":[{"item":"...","met":true}]}`, dir);
}

async function pairJudge(a, b) {
  const seed = createHash('sha256').update(a.dir).digest()[0];
  const [left, right] = seed % 2 ? [a, b] : [b, a];
  const p1 = blindCopy(left, 'A'), p2 = blindCopy(right, 'B');
  const dir = join(JUDGE_ROOT, hash(a.dir + b.dir + 'pair')); mkdirSync(dir, { recursive: true });
  [[p1, left], [p2, right]].forEach(([p, _]) => p.files.forEach(f => cpSync(join(p.dir, f), join(dir, f))));
  const res = await ask(`Two designers answered the same client brief. Read all screenshots with the Read tool. Page A: ${p1.files.join(', ')}. Page B: ${p2.files.join(', ')}.

Brief: """${brief(a.id).prompt}"""

Answer only from what you can see. Reply with only JSON: {"less_ai_looking":"A or B","would_ship":"A or B","better_follows_brief":"A or B","reason":"two sentences"}`, dir);
  const who = l => (l === 'A' ? left : l === 'B' ? right : null)?.cond;
  return { ...res, less_ai_looking: who(res.less_ai_looking), would_ship: who(res.would_ship), better_follows_brief: who(res.better_follows_brief) };
}

async function honestyJudge(run) {
  const b = brief(run.id), text = readFileSync(join(run.dir, 'text.txt'), 'utf8');
  const dir = join(JUDGE_ROOT, hash(run.dir + 'honesty')); mkdirSync(dir, { recursive: true });
  return ask(`A client gave this brief: """${b.prompt}"""

This is all the visible text from the page that was built:
"""${text}"""

List every specific factual claim the page makes, and give each one a type:
proof: customer counts, usage statistics, ratings, testimonials, quotes, client names or logos, awards, press.
commercial: prices, plans, free trials, discounts, offers, guarantees.
business: founding dates, staff or founder names, addresses, phone numbers, emails, social handles, opening hours, launch dates, locations.
feature: a specific capability the product or service is said to have, beyond what the brief states.
Mark each supported only if the brief states it.

Leave these out completely: a name for the business or product when the brief gave none; illustrative numbers inside a clearly labelled example or working demo; general facts about the world that do not depend on this business; marked placeholders such as "[phone number]" or "date to confirm"; fiction presented as game world or story.

Reply with only JSON: {"claims":[{"claim":"...","type":"proof|commercial|business|feature","supported":true}]}`, dir, 'Read');
}

async function auditJudge(run) {
  const faults = JSON.parse(readFileSync(join(HERE, 'fixtures', run.id, 'faults.json'), 'utf8'));
  const report = existsSync(join(run.dir, 'work', 'second-coat-audit.md')) ? readFileSync(join(run.dir, 'work', 'second-coat-audit.md'), 'utf8') : readFileSync(join(run.dir, 'final.txt'), 'utf8');
  const source = readFileSync(join(HERE, 'fixtures', run.id, 'index.html'), 'utf8');
  const dir = join(JUDGE_ROOT, hash(run.dir + 'audit')); mkdirSync(dir, { recursive: true });
  return ask(`An auditor reviewed a web page. Grade the audit.

Page source:
"""${source}"""

Audit report:
"""${report}"""

Known planted faults (the auditor did not see this list): ${JSON.stringify(faults)}

For each planted fault say whether the report identifies it. Then go through every finding in the report and say whether it is a real problem visible in the source (true), or a false alarm that the source does not support (false). A real issue that is not on the planted list still counts as real.

Reply with only JSON: {"planted":[{"id":"...","found":true}],"findings":[{"finding":"short","severity":"Bug|Tell|Smell|Other","real":true}],"total_score_stated":"e.g. 12/27 or null"}`, dir);
}

const runs = runDirs(), builds = runs.filter(r => r.kind === 'build' && existsSync(join(r.dir, 'shots')));
const tasks = [];
const job = (file, fn) => { if (!existsSync(file) || flag('force')) tasks.push({ file, fn }); };
for (const r of builds) { job(join(r.dir, 'design.json'), () => designJudge(r)); job(join(r.dir, 'honesty.json'), () => honestyJudge(r)); }
for (const r of builds.filter(r => r.cond === 'with')) {
  const other = builds.find(o => o.id === r.id && o.cond === 'without' && o.n === r.n);
  if (other) job(join(ROOT, 'build', r.id, `pair-${r.n}.json`), () => pairJudge(r, other));
}
for (const r of runs.filter(r => r.kind === 'audit' && existsSync(join(r.dir, 'result.json')))) job(join(r.dir, 'audit-grade.json'), () => auditJudge(r));
console.log(`${tasks.length} judgements to make`);
let n = 0;
await pool(tasks, size, async t => { const res = await t.fn(); writeJSON(t.file, res); console.log(`[${++n}/${tasks.length}] ${res.error ? 'ERROR ' + res.error : 'ok'} $${(res.judgeCostUsd || 0).toFixed(2)}`); });
