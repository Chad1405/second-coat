// Full-page screenshots of a local HTML page at phone, tablet and desktop width, using the
// Chrome or Edge already installed. No dependencies.
// usage: node shot.mjs <page.html> [outDir] [widths, default 390,768,1280]
// Writes <outDir>/<width>-<n>.png, each covering up to 4 screens, top to bottom.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [page, out = 'shots', widthArg = '390,768,1280'] = process.argv.slice(2);
if (!page || !existsSync(page)) { console.error('usage: node shot.mjs <page.html> [outDir] [widths]'); process.exit(1); }

const browser = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge',
].find(p => p && existsSync(p));
if (!browser) { console.error('No Chrome or Edge found. Set CHROME_PATH.'); process.exit(1); }

const HEIGHT = { 390: 844, 768: 1024 }, PER_IMAGE = 4;
const abs = resolve(page), dir = dirname(abs);
mkdirSync(out, { recursive: true });

const shoot = (file, w, h, png) => execFileSync(browser, ['--headless', '--hide-scrollbars', '--allow-file-access-from-files',
  '--virtual-time-budget=4000', `--window-size=${w},${h}`, `--screenshot=${resolve(png)}`, pathToFileURL(file).href], { stdio: 'pipe' });

// Headless Chrome won't shrink its window below ~500px, so the page is framed: each iframe is one
// real viewport (true media queries and vh), scrolled to its slice of the page.
const frame = (w, h, from, count) => `<!doctype html><body style="margin:0">
<script>for (let i = 0; i < ${count}; i++) { const f = document.createElement('iframe');
f.src = ${JSON.stringify(basename(abs))}; f.style = 'display:block;border:0;width:${w}px;height:${h}px';
f.onload = () => { f.contentDocument.documentElement.style.scrollBehavior = 'auto';
  f.contentWindow.scrollTo({ top: ${h} * (${from} + i), behavior: 'instant' }); }; document.body.append(f); }</script>`;

for (const w of widthArg.split(',').map(Number)) {
  const h = HEIGHT[w] || 800, tmp = join(dir, `_shot-${w}.html`);
  // Measure the page height first (one frame reports it through the title).
  writeFileSync(tmp, `<!doctype html><title>0</title><iframe src=${JSON.stringify(basename(abs))} style="width:${w}px;height:${h}px;border:0"
onload="document.title=this.contentDocument.documentElement.scrollHeight"></iframe>`);
  let screens = 1;
  try {
    const dom = execFileSync(browser, ['--headless', '--allow-file-access-from-files', '--virtual-time-budget=4000', '--dump-dom', pathToFileURL(tmp).href]).toString();
    screens = Math.max(1, Math.ceil(Number(dom.match(/<title>(\d+)<\/title>/)?.[1] || h) / h));
  } catch {}
  for (let from = 0, n = 1; from < screens; from += PER_IMAGE, n++) {
    const count = Math.min(PER_IMAGE, screens - from);
    writeFileSync(tmp, frame(w, h, from, count));
    shoot(tmp, Math.max(w, 500), h * count, join(out, `${w}-${n}.png`));
    console.log(join(out, `${w}-${n}.png`));
  }
  rmSync(tmp, { force: true });
}
