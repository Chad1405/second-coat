// Turns a round's raw results into results/<round>/report.md and report.json.
// usage: node report.mjs [--round round-1]
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { RESULTS, ROOT, ROUND, readJSON, runDirs, scenarios, writeJSON } from './lib.mjs';

const median = a => { const s = a.filter(v => v != null && !Number.isNaN(v)).sort((x, y) => x - y); if (!s.length) return null; const m = s.length >> 1; return s.length % 2 ? s[m] : +((s[m - 1] + s[m]) / 2).toFixed(2); };
const mean = a => { const s = a.filter(v => v != null); return s.length ? +(s.reduce((x, y) => x + y, 0) / s.length).toFixed(2) : null; };
const fmt = v => (v == null ? 'n/a' : v);
const serious = s => Object.values(s?.axe || {}).flat().filter(v => ['critical', 'serious'].includes(v.impact)).reduce((n, v) => n + v.nodes, 0);
const overflowCount = s => Object.values(s?.overflow || {}).filter(Boolean).length;
// How many kinds of tell appear (0 to 14), so one repeated label style can't dominate the count.
const tellCount = s => !s?.tells ? null : [s.tells.accentWord, s.tells.italicWord, s.tells.trackedCaps, s.tells.eyebrows, s.tells.monoLabels, s.tells.purpleGradient,
  s.copy.buzzwords.length, s.copy.filler, s.copy.middleDots, s.copy.arrows, s.copy.emoji, s.copy.learnMore, s.copy.emDashes > 2, s.css.transitionAll].filter(Boolean).length;
const avgDesign = d => { if (!d?.scores) return null; const v = Object.entries(d.scores).filter(([k]) => k !== 'human_made').map(([, x]) => x.score); return mean(v); };
const adherence = d => (d?.adherence?.length ? d.adherence.filter(a => a.met).length / d.adherence.length : null);
const invented = h => h?.claims ? h.claims.filter(c => !c.supported && c.type !== 'feature').length : null;
const placeholders = s => (s?.copy?.placeholders || 0) + (s?.dashedBoxes || 0);
const inventedFeatures = h => h?.claims ? h.claims.filter(c => !c.supported && c.type === 'feature').length : null;

const dirs = runDirs();
const load = r => ({ ...r, result: readJSON(join(r.dir, 'result.json')), score: readJSON(join(r.dir, 'score.json')), design: readJSON(join(r.dir, 'design.json')), honesty: readJSON(join(r.dir, 'honesty.json')), grade: readJSON(join(r.dir, 'audit-grade.json')) });
const builds = dirs.filter(r => r.kind === 'build').map(load);
const by = (id, cond) => builds.filter(b => b.id === id && b.cond === cond && b.score && !b.score.error);
const baselineSkills = builds.filter(b => b.cond === 'without').flatMap(b => b.result?.skillCalls || []);
const L = [`# Second Coat eval: ${ROUND}`, '', `Builds run with \`claude -p\` in isolated folders with no user skills, hooks or MCP servers. "With" runs also load this plugin. Claude Code's built-in skills stay available to both conditions; "without" runs called: ${[...new Set(baselineSkills)].join(', ') || 'none'}. Agents had no network or browser tool. From round 7 they can run node, which fresh-coat uses for its screenshot self-check; the reused round 3 "without" builds had no shell. Numbers are medians across runs unless stated.`, ''];
const summary = { builds: {} };

L.push('## fresh-coat vs no skill', '', '| Scenario | Condition | Runs | Visible placeholders | Web-font runs | Invented business claims | Invented features | Serious WCAG nodes | Overflow widths | Kinds of AI tell* | Raw colours | Lighthouse perf | Design (1-5) | Human-made (1-5) | Brief met |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
for (const s of scenarios.builds) for (const cond of ['with', 'without']) {
  const rs = by(s.id, cond);
  const row = { runs: rs.length, placeholders: median(rs.map(r => placeholders(r.score))), webFontRuns: rs.filter(r => r.score.webFont).length, invented: median(rs.map(r => invented(r.honesty))), features: median(rs.map(r => inventedFeatures(r.honesty))), seriousWcag: median(rs.map(r => serious(r.score))), overflow: median(rs.map(r => overflowCount(r.score))), tells: s.pinned ? null : median(rs.map(r => tellCount(r.score))),
    rawColours: median(rs.map(r => r.score.css?.rawColours)), lighthouse: median(rs.map(r => r.score.lighthouse?.performance)), design: median(rs.map(r => avgDesign(r.design))), humanMade: median(rs.map(r => r.design?.scores?.human_made?.score)), adherence: mean(rs.map(r => adherence(r.design))) };
  (summary.builds[s.id] ??= {})[cond] = row;
  L.push(`| ${s.id} | ${cond} | ${row.runs} | ${fmt(row.placeholders)} | ${row.webFontRuns}/${row.runs} | ${fmt(row.invented)} | ${fmt(row.features)} | ${fmt(row.seriousWcag)} | ${fmt(row.overflow)} | ${s.pinned ? 'pinned' : fmt(row.tells)} | ${fmt(row.rawColours)} | ${fmt(row.lighthouse)} | ${fmt(row.design)} | ${fmt(row.humanMade)} | ${row.adherence == null ? 'n/a' : Math.round(row.adherence * 100) + '%'} |`);
}
L.push('', '*Tells are not counted for the pinned scenario, because that brief asks for them.', '');

const pairs = scenarios.builds.flatMap(s => { const dir = join(ROOT, 'build', s.id); return existsSync(dir) ? readdirSync(dir).filter(f => f.startsWith('pair-')).map(f => ({ id: s.id, ...readJSON(join(dir, f)) })) : []; }).filter(p => !p.error);
const wins = k => `${pairs.filter(p => p[k] === 'with').length}/${pairs.length}`;
summary.pairs = { lessAi: wins('less_ai_looking'), ship: wins('would_ship'), brief: wins('better_follows_brief') };
const scenarioWins = scenarios.builds.map(s => { const ps = pairs.filter(p => p.id === s.id), w = k => ps.filter(p => p[k] === 'with').length; return `- ${s.id}: less AI-looking ${w('less_ai_looking')}/${ps.length}, would ship ${w('would_ship')}/${ps.length}, follows the brief ${w('better_follows_brief')}/${ps.length}`; });
L.push('## Blind model comparison (fresh-coat wins)', '', `Less AI-looking ${summary.pairs.lessAi}. Would ship ${summary.pairs.ship}. Better follows the brief ${summary.pairs.brief}.`, '', ...scenarioWins, '');

const withRuns = builds.filter(b => b.cond === 'with' && b.score?.look), freeRuns = withRuns.filter(b => !scenarios.builds.find(s => s.id === b.id).pinned);
const count = (rs, f) => Object.entries(rs.reduce((m, r) => { const k = f(r); m[k] = (m[k] || 0) + 1; return m; }, {})).sort((a, b) => b[1] - a[1]);
const signature = r => `${r.score.display} / ${r.score.look.bg} / accent ${r.score.look.accentHue}`;
const collisions = count(freeRuns, signature).filter(([k]) => new Set(freeRuns.filter(r => signature(r) === k).map(r => r.id)).size > 1);
const noSkillFree = builds.filter(b => b.cond === 'without' && b.score?.look && !scenarios.builds.find(s => s.id === b.id).pinned);
summary.sameness = { displayFontsWith: count(freeRuns, r => r.score.display), displayFontsWithout: count(noSkillFree, r => r.score.display), crossBriefCollisions: collisions };
L.push('## Sameness (excluding the pinned brief)', '', `Display fonts with fresh-coat: ${summary.sameness.displayFontsWith.map(([k, v]) => `${k} x${v}`).join(', ') || 'n/a'}.`, `Display fonts without a skill: ${summary.sameness.displayFontsWithout.map(([k, v]) => `${k} x${v}`).join(', ') || 'n/a'}.`, `Same font, light/dark and accent across different briefs: ${collisions.map(([k, v]) => `${k} x${v}`).join('; ') || 'none'}.`, '');

const audits = dirs.filter(r => r.kind === 'audit').map(load);
L.push('## second-coat audits', '', '| Site | Run | Planted found | Findings real | Bug and Tell findings | Stated score | Files changed |', '|---|---|---|---|---|---|---|');
summary.audits = [];
for (const a of audits) {
  const g = a.grade || {}, planted = g.planted || [], findings = g.findings || [];
  const row = { id: a.id, run: a.n, found: planted.filter(p => p.found).length, planted: planted.length, real: findings.filter(f => f.real).length, findings: findings.length, major: findings.filter(f => ['Bug', 'Tell'].includes(f.severity)).length, stated: g.total_score_stated || null, changed: (a.result?.changed || []).filter(f => f !== 'second-coat-audit.md') };
  summary.audits.push(row);
  L.push(`| ${row.id} | ${row.run} | ${row.planted ? `${row.found}/${row.planted}` : 'none planted'} | ${row.real}/${row.findings} | ${row.major} | ${fmt(row.stated)} | ${row.changed.join(', ') || 'none'} |`);
}
L.push('');

const refreshes = dirs.filter(r => r.kind === 'refresh').map(load);
L.push('## second-coat refresh', '', '| Site | Tells before | Tells after | Links kept | Fields kept | IDs kept | Test IDs kept | Headings kept |', '|---|---|---|---|---|---|---|---|');
summary.refresh = [];
const kept = (b = [], a = []) => { const left = [...a]; let n = 0; for (const x of b) { const i = left.indexOf(x); if (i >= 0) { left.splice(i, 1); n++; } } return `${n}/${b.length}`; };
for (const r of refreshes) {
  const o = readJSON(join(ROOT, 'fixture', r.id, 'original-1', 'score.json'));
  if (!o || !r.score?.inventory) continue;
  const row = { id: r.id, before: tellCount(o), after: tellCount(r.score), hrefs: kept(o.inventory.hrefs, r.score.inventory.hrefs), names: kept(o.inventory.names, r.score.inventory.names), ids: kept(o.inventory.ids, r.score.inventory.ids), testids: kept(o.inventory.testids, r.score.inventory.testids), headings: kept(o.inventory.headings, r.score.inventory.headings) };
  summary.refresh.push(row);
  L.push(`| ${row.id} | ${row.before} | ${row.after} | ${row.hrefs} | ${row.names} | ${row.ids} | ${row.testids} | ${row.headings} |`);
}
L.push('');

const trig = dirs.filter(r => r.kind === 'trigger'), triggers = [];
const allDirs = existsSync(join(ROOT, 'trigger')) ? readdirSync(join(ROOT, 'trigger')) : [];
for (const id of allDirs) { const r = readJSON(join(ROOT, 'trigger', id, 'with-1', 'result.json')); if (!r) continue; const fired = r.skillCalls.map(s => s.split(':').pop()); triggers.push({ id, expect: r.expect, fired, pass: r.expect === 'none' ? fired.length === 0 : fired.includes(r.expect) }); }
summary.triggers = triggers;
L.push('## Triggering', '', ...triggers.map(t => `- ${t.pass ? 'Pass' : 'FAIL'}: ${t.id}, expected ${t.expect}, fired ${t.fired.join(', ') || 'nothing'}`), '');
const ask = readJSON(join(ROOT, 'asks', 'vague-brief', 'with-1', 'result.json'));
if (ask) { summary.asks = { wroteFile: ask.files.includes('index.html'), turns: ask.turns }; L.push('## Asking before building', '', `On a vague brief with a person present, fresh-coat ${ask.files.includes('index.html') ? 'built without asking first (FAIL)' : 'stopped without building (expected: it should ask its questions)'}.`, ''); }

const skillRuns = builds.filter(b => b.cond === 'with');
const inventedTotal = skillRuns.reduce((n, b) => n + (invented(b.honesty) || 0), 0), seriousTotal = skillRuns.reduce((n, b) => n + serious(b.score), 0);
const plantedAudits = summary.audits.filter(a => a.planted);
const recall = plantedAudits.length ? plantedAudits.reduce((n, a) => n + a.found, 0) / plantedAudits.reduce((n, a) => n + a.planted, 0) : null;
const precision = summary.audits.length ? summary.audits.reduce((n, a) => n + a.real, 0) / Math.max(1, summary.audits.reduce((n, a) => n + a.findings, 0)) : null;
const lessAi = pairs.filter(p => p.less_ai_looking === 'with').length;
const bars = [['Zero invented business claims in fresh-coat runs', inventedTotal === 0, `${inventedTotal} found`], ['Zero serious WCAG failures in fresh-coat runs', seriousTotal === 0, `${seriousTotal} elements`],
  ['At least 80% of planted faults found', recall != null && recall >= 0.8, recall == null ? 'n/a' : `${Math.round(recall * 100)}%`], ['Few false alarms (at least 90% of findings real)', precision != null && precision >= 0.9, precision == null ? 'n/a' : `${Math.round(precision * 100)}%`],
  ['Looks less AI-made than no skill in blind picks (over 60%)', pairs.length > 0 && lessAi / pairs.length > 0.6, summary.pairs.lessAi],
  ['Judges would ship it over no skill (over 50%)', pairs.length > 0 && pairs.filter(p => p.would_ship === 'with').length / pairs.length > 0.5, summary.pairs.ship],
  ['No visible placeholders in fresh-coat runs', skillRuns.every(b => placeholders(b.score) === 0), `${skillRuns.reduce((n, b) => n + placeholders(b.score), 0)} found`], ['No two briefs converging on one look', collisions.length === 0, `${collisions.length} collisions`]];
summary.bars = bars.map(([name, pass, detail]) => ({ name, pass, detail }));
const costs = dirs.map(r => readJSON(join(r.dir, 'result.json'))?.costUsd || 0).reduce((a, b) => a + b, 0);
L.splice(3, 0, '## Pass bars', '', ...bars.map(([n, p, d]) => `- **${p ? 'Pass' : 'FAIL'}**: ${n} (${d})`), '', `Skill-run cost: $${costs.toFixed(2)} at API list prices, judges not included. Human blind picks are not part of this report.`, '');
mkdirSync(RESULTS, { recursive: true });
writeFileSync(join(RESULTS, 'report.md'), L.join('\n'));
writeJSON(join(RESULTS, 'report.json'), summary);
console.log(L.join('\n'));
