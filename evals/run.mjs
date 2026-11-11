// Runs the skills headlessly. Finished runs are skipped, so an interrupted round can be resumed.
// usage: node run.mjs [--round round-1] [--runs 3] [--audit-runs 2] [--concurrency 3] [--only id] [--model claude-opus-5-5]
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';
import { HERE, ROOT, claude, flag, pool, readJSON, scenarios, writeJSON } from './lib.mjs';

const runs = Number(flag('runs', 3)), auditRuns = Number(flag('audit-runs', 2)), size = Number(flag('concurrency', 3));
const model = flag('model', 'claude-opus-5-5'), only = flag('only');
const WORK_TOOLS = 'Read,Write,Edit,Glob,Grep,Skill,Bash'; // Bash is limited to node (lib.mjs), for the screenshot self-check
const NOBODY = '\n\nNobody is available to answer questions in this session, so make your own assumptions and state them. Do all work in the current directory.';
const BUILD_NOTE = NOBODY + ' Write the finished page to index.html, with all CSS and JavaScript inline. You have no way to download images.';

const copyFixture = (id, dest) => {
  mkdirSync(dest, { recursive: true });
  cpSync(join(HERE, 'fixtures', id, 'index.html'), join(dest, 'index.html'));
};
const hashes = dir => Object.fromEntries(readdirSync(dir, { recursive: true }).map(String).filter(f => statSync(join(dir, f)).isFile())
  .map(f => [f.replaceAll('\\', '/'), createHash('sha256').update(readFileSync(join(dir, f))).digest('hex')]));

const jobs = [];
for (const b of scenarios.builds) for (const cond of ['with', 'without']) for (let n = 1; n <= runs; n++) {
  const prompt = (cond === 'with' ? `/second-coat:fresh-coat ${b.prompt}` : b.prompt) + BUILD_NOTE;
  jobs.push({ kind: 'build', id: b.id, name: `${cond}-${n}`, prompt, plugin: cond === 'with' });
}
for (const a of scenarios.audits) {
  copyFixture(a.id, join(ROOT, 'fixture', a.id, 'original-1', 'work'));
  for (let n = 1; n <= auditRuns; n++) jobs.push({ kind: 'audit', id: a.id, name: `with-${n}`, fixture: a.id, plugin: true,
    prompt: `/second-coat:second-coat audit .${NOBODY}` });
  if (a.refresh) jobs.push({ kind: 'refresh', id: a.id, name: 'with-1', fixture: a.id, plugin: true,
    prompt: `/second-coat:second-coat refresh .${NOBODY} Keep the page in index.html.` });
}
for (const t of scenarios.triggers) jobs.push({ kind: 'trigger', id: t.id, name: 'with-1', prompt: t.prompt, expect: t.expect, plugin: true, tools: 'Skill,Read,Glob', maxTurns: 2, budget: 2 });
for (const t of scenarios.asks) jobs.push({ kind: 'asks', id: t.id, name: 'with-1', prompt: t.prompt, plugin: true, maxTurns: 6, budget: 4 });

const todo = jobs.filter(j => (!only || j.id === only) && !existsSync(join(ROOT, j.kind, j.id, j.name, 'result.json')));
console.log(`${todo.length} of ${jobs.length} runs to do, in ${ROOT}`);
let spent = 0, finished = 0;
await pool(todo, size, async job => {
  const dir = join(ROOT, job.kind, job.id, job.name), work = join(dir, 'work');
  mkdirSync(work, { recursive: true });
  if (job.fixture) copyFixture(job.fixture, work);
  const before = job.fixture ? hashes(work) : null;
  let r;
  for (let attempt = 1; attempt <= 2; attempt++) { // a killed run has no exit code; retry it from a clean folder
    r = await claude({ prompt: job.prompt, cwd: work, tools: job.tools || WORK_TOOLS, plugin: job.plugin, model, budget: job.budget, maxTurns: job.maxTurns, timeoutMs: 20 * 60e3 });
    if (r.code !== null) break;
    rmSync(work, { recursive: true, force: true }); mkdirSync(work, { recursive: true });
    if (job.fixture) copyFixture(job.fixture, work);
  }
  if (r.code === null) { console.log(`FAILED after 2 attempts: ${relative(ROOT, dir)}`); return; } // no result.json, so a rerun picks it up
  writeFileSync(join(dir, 'final.txt'), r.text);
  writeFileSync(join(dir, 'events.jsonl'), r.events.map(e => JSON.stringify(e)).join('\n'));
  const after = hashes(work);
  const skillCalls = r.toolUses.filter(t => t.name === 'Skill').map(t => t.input.skill || t.input.name || '');
  const readRefs = r.toolUses.filter(t => t.name === 'Read' && /references[\\/]/.test(t.input.file_path || '')).map(t => t.input.file_path.split(/[\\/]/).pop());
  const out = { kind: job.kind, id: job.id, name: job.name, code: r.code, err: r.err, terminal: r.terminal, costUsd: r.costUsd, durationMs: r.durationMs, turns: r.turns,
    skillsAvailable: r.skills, skillCalls, readRefs, files: Object.keys(after), expect: job.expect,
    changed: before ? [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(f => before[f] !== after[f]) : undefined };
  writeJSON(join(dir, 'result.json'), out);
  spent += r.costUsd; finished++;
  console.log(`[${finished}/${todo.length}] ${relative(ROOT, dir)} code=${r.code} ${r.terminal} $${r.costUsd.toFixed(2)} total=$${spent.toFixed(2)}`);
});
console.log(`done, $${spent.toFixed(2)} this session`);
