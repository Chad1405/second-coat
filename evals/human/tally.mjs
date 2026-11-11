// Unblinds answer codes from the human blind test. One code per line in a text file.
// usage: node tally.mjs codes.txt   |   node tally.mjs --test
import { readFileSync } from 'node:fs';
import assert from 'node:assert';

const QUESTIONS = ['less_ai_looking', 'would_ship', 'better_follows_brief'];

export function parse(line) {
  const m = line.trim().match(/^R3-([xy]{3}(?:-[xy]{3}){8})$/);
  return m ? m[1].split('-') : null;
}

// Exact two-sided sign test: how surprising is `wins` of `n` if people had no preference?
export function signTest(wins, n) {
  if (!n) return 1;
  let c = 1, tail = 0;
  const k = Math.min(wins, n - wins);
  for (let i = 0; i <= k; i++) { tail += c; c = c * (n - i) / (i + 1); }
  return Math.min(1, 2 * tail / 2 ** n);
}

export function tally(people, pairs) {
  return QUESTIONS.map((question, q) => {
    const byBrief = {};
    let picks = 0, total = 0, peopleFor = 0;
    for (const person of people) {
      let mine = 0;
      person.forEach((answer, i) => {
        const p = pairs[i + 1], isWith = (answer[q] === 'x') === (p.x === 'with');
        (byBrief[p.brief] ??= { picks: 0, total: 0 }).total++;
        byBrief[p.brief].picks += isWith; mine += isWith; picks += isWith; total++;
      });
      if (mine > person.length / 2) peopleFor++;
    }
    return { question, picks, total, peopleFor, people: people.length, p: signTest(peopleFor, people.length), byBrief };
  });
}

if (process.argv[2] === '--test') {
  const pairs = Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => [i, { brief: 'b', x: i % 2 ? 'with' : 'without' }]));
  assert.equal(parse('R3-xxx-xxx-xxx-xxx-xxx-xxx-xxx-xxx'), null);
  // Odd pairs have x = with, even pairs have y = with, so this person always picks the with-skill page.
  const allWith = parse('R3-xxx-yyy-xxx-yyy-xxx-yyy-xxx-yyy-xxx');
  const r = tally([allWith, allWith], pairs)[1];
  assert.deepEqual([r.picks, r.total, r.peopleFor], [18, 18, 2]);
  assert.equal(signTest(5, 5), 0.0625);
  assert.equal(signTest(3, 6), 1);
  console.log('ok');
} else if (process.argv[1].endsWith('tally.mjs')) {
  const { pairs } = JSON.parse(readFileSync(new URL('./key.json', import.meta.url), 'utf8'));
  const lines = readFileSync(process.argv[2], 'utf8').split(/\r?\n/).filter(l => l.trim());
  const bad = lines.filter(l => !parse(l));
  if (bad.length) console.log(`Skipped ${bad.length} malformed code(s):\n${bad.join('\n')}\n`);
  for (const r of tally(lines.flatMap(l => parse(l) ? [parse(l)] : []), pairs)) {
    console.log(`${r.question}: fresh-coat picked in ${r.picks} of ${r.total} pairs; ${r.peopleFor} of ${r.people} people preferred it overall (sign test p=${r.p.toFixed(3)})`);
    for (const [b, v] of Object.entries(r.byBrief)) console.log(`  ${b}: ${v.picks} of ${v.total}`);
  }
}
