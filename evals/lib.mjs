// Shared helpers for the Second Coat evals.
import { spawn } from 'node:child_process';
import { readdirSync, statSync, existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir, homedir } from 'node:os';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO = resolve(HERE, '..');
export const flag = (name, fallback) => {
  const i = process.argv.indexOf('--' + name);
  return i < 0 ? fallback : process.argv[i + 1];
};
export const ROUND = flag('round', 'round-1');
// Runs live outside the repo so an agent can't find the answer keys or the repo's own files.
export const ROOT = join(process.env.EVAL_DIR || join(tmpdir(), 'second-coat-evals'), ROUND);
export const RESULTS = join(HERE, 'results', ROUND);
export const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
export const scenarios = JSON.parse(readFileSync(join(HERE, 'scenarios.json'), 'utf8'));
export const readJSON = (p, fallback) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : fallback);
export const writeJSON = (p, v) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, JSON.stringify(v, null, 2)); };

export function claudeBin() {
  if (process.env.CLAUDE_BIN) return process.env.CLAUDE_BIN;
  const base = join(process.env.APPDATA || homedir(), 'Claude', 'claude-code');
  if (!existsSync(base)) return 'claude';
  const found = readdirSync(base).flatMap(v => readdirSync(join(base, v)).map(h => join(base, v, h, 'claude.exe'))).filter(existsSync);
  return found.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0] || 'claude';
}

// Runs one headless session with only project settings: no user skills, hooks, MCP servers or memory.
export function claude({ prompt, cwd, tools, plugin, model, budget = 12, maxTurns, timeoutMs = 30 * 60e3 }) {
  const args = ['-p', '--setting-sources', 'project', '--strict-mcp-config', '--no-session-persistence',
    '--output-format', 'stream-json', '--verbose', '--model', model, '--max-budget-usd', String(budget),
    '--tools', tools, '--allowedTools', tools.replace(/\bBash\b/, 'Bash(node:*)')];
  if (plugin) args.push('--plugin-dir', REPO);
  if (maxTurns) args.push('--max-turns', String(maxTurns));
  return new Promise(done => {
    const child = spawn(claudeBin(), args, { cwd, stdio: ['pipe', 'pipe', 'pipe'] });
    let out = '', err = '';
    const timer = setTimeout(() => child.kill(), timeoutMs);
    child.stdout.on('data', d => { out += d; });
    child.stderr.on('data', d => { err += d; });
    child.stdin.end(prompt);
    child.on('close', code => {
      clearTimeout(timer);
      const events = out.split('\n').flatMap(l => { try { return l.trim() ? [JSON.parse(l)] : []; } catch { return []; } });
      const result = events.findLast(e => e.type === 'result') || {};
      const init = events.find(e => e.type === 'system' && e.subtype === 'init') || {};
      const toolUses = events.filter(e => e.type === 'assistant').flatMap(e => e.message.content.filter(c => c.type === 'tool_use'));
      done({ code, err: err.slice(-1500), text: result.result || '', costUsd: result.total_cost_usd || 0, durationMs: result.duration_ms || 0,
        turns: result.num_turns || 0, terminal: result.terminal_reason || result.subtype || '', skills: init.skills || [], toolUses, events });
    });
  });
}

export async function pool(items, size, worker) {
  let next = 0;
  await Promise.all(Array.from({ length: size }, async () => {
    while (next < items.length) { const i = next++; await worker(items[i], i); }
  }));
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
export function serve(dir) {
  const root = resolve(dir);
  const server = createServer((req, res) => {
    const path = normalize(join(root, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html')));
    if (!(path === root || path.startsWith(root + sep)) || !existsSync(path) || statSync(path).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream' });
    res.end(readFileSync(path));
  });
  return new Promise(r => server.listen(0, '127.0.0.1', () => r({ url: `http://127.0.0.1:${server.address().port}/`, close: () => server.close() })));
}

// Every run directory holding a page: [{ kind, id, cond, n, dir }]
export function runDirs() {
  const out = [];
  for (const kind of ['build', 'audit', 'refresh', 'fixture']) {
    const k = join(ROOT, kind);
    if (!existsSync(k)) continue;
    for (const id of readdirSync(k)) for (const name of readdirSync(join(k, id))) {
      const dir = join(k, id, name);
      if (!statSync(dir).isDirectory()) continue;
      const [cond, n] = name.split('-');
      out.push({ kind, id, cond, n: Number(n), name, dir });
    }
  }
  return out;
}

export function parseJSON(text) {
  const a = text.indexOf('{'), b = text.lastIndexOf('}');
  if (a < 0 || b <= a) throw new Error('no JSON in judge reply');
  return JSON.parse(text.slice(a, b + 1));
}
