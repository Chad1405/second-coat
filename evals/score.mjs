// Deterministic scoring in headless Chrome: WCAG (axe), layout mechanics, AI tells, Lighthouse, screenshots.
// usage: node score.mjs [--round round-1] [--force yes]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';
import lighthouse from 'lighthouse';
import { CHROME, flag, runDirs, serve, writeJSON } from './lib.mjs';

const axeSource = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const BUZZ = /\b(seamless(ly)?|robust|empower(s|ing)?|supercharge[ds]?|elevate[ds]?|effortless(ly)?|unlock(s|ing)?|unleash|revolutioni[sz]e|next-generation|world-class|best-in-class|industry-leading|cutting-edge|game-chang\w+)\b/gi;
const FILLER = /in today'?s|built for the modern|say goodbye to|where .{2,30} meets/gi;
const EMOJI = /\p{Extended_Pictographic}/gu;

// Runs in the page. Reads computed styles only.
function probe() {
  const all = [...document.body.querySelectorAll('*')];
  const vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const visible = all.filter(vis);
  const ownText = e => [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
  const textEls = visible.filter(e => ownText(e));
  const fam = e => getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '').trim();
  const fs = e => parseFloat(getComputedStyle(e).fontSize);
  const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const rgb = c => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = '#000'; ctx.fillStyle = c; ctx.fillRect(0, 0, 1, 1); return [...ctx.getImageData(0, 0, 1, 1).data]; };
  const hsl = ([r, g, b]) => { r /= 255; g /= 255; b /= 255; const M = Math.max(r, g, b), m = Math.min(r, g, b), d = M - m, l = (M + m) / 2;
    const s = d ? d / (1 - Math.abs(2 * l - 1)) : 0; let h = 0; if (d) h = M === r ? ((g - b) / d) % 6 : M === g ? (b - r) / d + 2 : (r - g) / d + 4; return { h: (h * 60 + 360) % 360, s, l }; };
  const isClear = c => c === 'transparent' || /rgba\(.*, 0\)$/.test(c);
  const STOPS = /(?:rgba?|oklch|oklab|hsla?|color)\([^)]*\)|#[0-9a-f]{3,8}/gi;

  const h1 = document.querySelector('h1');
  const h1Style = h1 && getComputedStyle(h1);
  const accentWord = h1 ? [...h1.querySelectorAll('*')].filter(e => ownText(e)).some(e => { const s = getComputedStyle(e);
    return s.color !== h1Style.color || s.fontStyle !== h1Style.fontStyle || s.webkitBackgroundClip === 'text'; }) : false;
  const italicWord = [...document.querySelectorAll('h1,h2,h3')].some(h => { const s = getComputedStyle(h); return s.fontStyle === 'normal' && [...h.querySelectorAll('em,i,span')].some(e => getComputedStyle(e).fontStyle === 'italic'); });
  const tracked = e => { const s = getComputedStyle(e); return parseFloat(s.letterSpacing) / fs(e) > 0.03; };
  const upper = e => getComputedStyle(e).textTransform === 'uppercase' || (ownText(e).length > 3 && ownText(e) === ownText(e).toUpperCase() && /[A-Z]/.test(ownText(e)));
  const trackedCaps = textEls.filter(e => fs(e) <= 15 && upper(e) && tracked(e)).length;
  const eyebrows = [...document.querySelectorAll('h1,h2')].filter(h => { const p = h.previousElementSibling;
    return p && vis(p) && p.textContent.trim().length <= 48 && p.textContent.trim() && !p.querySelector('h1,h2,h3,img') && fs(p) <= 16 && upper(p); }).length;
  const monoLabels = textEls.filter(e => !e.closest('code,pre,kbd,samp') && /mono|courier|consolas|menlo/i.test(fam(e))).length;
  const gradients = visible.map(e => getComputedStyle(e).backgroundImage).filter(b => b.includes('gradient'));
  const purpleGradient = gradients.some(g => { const hues = (g.match(STOPS) || []).map(c => hsl(rgb(c))).filter(c => c.s > 0.25); return hues.length >= 2 && hues.every(c => c.h >= 210 && c.h <= 330) && Math.max(...hues.map(c => c.h)) >= 250; });

  const headingSize = t => { const e = document.querySelector(t); return e && vis(e) ? fs(e) : null; };
  const paragraphs = visible.filter(e => e.tagName === 'P' && e.textContent.trim().length > 120);
  const bodySize = paragraphs.length ? Math.min(...paragraphs.map(fs)) : fs(document.body);
  const lineHeights = paragraphs.map(e => { const s = getComputedStyle(e); return s.lineHeight === 'normal' ? 1.2 : parseFloat(s.lineHeight) / fs(e); });
  const wideLines = paragraphs.filter(e => e.getBoundingClientRect().width / (fs(e) * 0.5) > 85).length;
  const distinct = (props, skip = '0px') => new Set(visible.flatMap(e => { const s = getComputedStyle(e); return props.map(p => s[p]); }).filter(v => v && v !== skip && v !== 'normal' && v !== 'auto')).size;
  const families = [...new Set(textEls.map(fam))];

  const controls = visible.filter(e => e.matches('a,button,input,select,textarea,[role=button]') && !(e.tagName === 'A' && e.closest('p,li') && e.parentElement.textContent.trim().length > e.textContent.trim().length + 3));
  const sized = controls.map(e => e.getBoundingClientRect());
  const fold = innerHeight;
  const filled = visible.filter(e => e.matches('a,button,[role=button]') && !isClear(getComputedStyle(e).backgroundColor));
  const inFold = filled.filter(e => e.getBoundingClientRect().top < fold && e.getBoundingClientRect().top >= 0);
  const accentEl = [...inFold, ...filled].find(e => hsl(rgb(getComputedStyle(e).backgroundColor)).s > 0.15);
  const accent = accentEl ? hsl(rgb(getComputedStyle(accentEl).backgroundColor)) : null;
  const bg = hsl(rgb(isClear(getComputedStyle(document.body).backgroundColor) ? getComputedStyle(document.documentElement).backgroundColor : getComputedStyle(document.body).backgroundColor));
  const sections = [...document.querySelectorAll('main > section, body > section, main > div, body > header, body > footer, body > main > *')].filter(e => vis(e) && e.getBoundingClientRect().height > 80);

  const q = sel => [...document.querySelectorAll(sel)];
  const inventory = { hrefs: q('a[href]').map(a => a.getAttribute('href')), names: q('[name]').map(e => e.getAttribute('name')).filter(n => !['viewport', 'description'].includes(n)),
    ids: q('[id]').map(e => e.id), testids: q('[data-testid]').map(e => e.dataset.testid), forms: q('form').map(f => f.getAttribute('action') || f.id || ''),
    headings: q('h1,h2,h3').map(h => h.textContent.trim().replace(/\s+/g, ' ')) };
  const cssText = q('style').map(s => s.textContent).join('\n');
  const inlineStyles = q('[style]').map(e => e.getAttribute('style')).join(';');
  const alts = q('img[alt]').map(i => i.alt).filter(Boolean);
  const dashedBoxes = visible.filter(e => { const r = e.getBoundingClientRect(); return getComputedStyle(e).borderTopStyle === 'dashed' && r.width * r.height > 10000; }).length;
  return { webFont: [...document.fonts].some(f => f.status === 'loaded'), dashedBoxes, families, display: h1 ? fam(h1) : null, body: paragraphs[0] ? fam(paragraphs[0]) : fam(document.body), bodySize, lineHeightMin: lineHeights.length ? Math.min(...lineHeights) : null, wideLines,
    sizes: { h1: headingSize('h1'), h2: headingSize('h2'), h3: headingSize('h3') }, distinctSpacing: distinct(['marginTop', 'marginBottom', 'paddingTop', 'paddingBottom', 'paddingLeft', 'rowGap', 'columnGap']),
    distinctFontSizes: new Set(textEls.map(e => getComputedStyle(e).fontSize)).size, distinctRadii: distinct(['borderTopLeftRadius']), distinctShadows: distinct(['boxShadow'], 'none'),
    under24: sized.filter(r => r.width < 24 || r.height < 24).length, under44: sized.filter(r => r.width < 44 || r.height < 44).length, controls: sized.length, primaryInFold: inFold.length,
    tells: { accentWord, italicWord, trackedCaps, eyebrows, monoLabels, purpleGradient, gradientCount: gradients.length },
    look: { bg: bg.l < 0.35 ? 'dark' : 'light', bgHue: Math.round(bg.h / 30) * 30, accentHue: accent ? Math.round(accent.h / 30) * 30 % 360 : null, h1Align: h1Style?.textAlign, heroImage: q('img').some(i => i.getBoundingClientRect().top < fold), sectionCount: sections.length },
    inventory, cssText, inlineStyles, text: document.body.innerText, alts };
}

function cssChecks(cssText, inline) {
  const declarationsOnly = cssText.replace(/\/\*[\s\S]*?\*\//g, '').replace(/--[\w-]+\s*:[^;}]+[;}]/g, '');
  const colour = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab)\(/gi;
  return { rawColours: (declarationsOnly.match(colour) || []).length + (inline.match(colour) || []).length,
    rawFontFamilies: (declarationsOnly.match(/font-family\s*:(?!\s*(?:var\(|inherit))[^;}]+/gi) || []).length,
    customProperties: new Set(cssText.match(/--[\w-]+(?=\s*:)/g) || []).size, transitionAll: /transition(-property)?\s*:\s*all\b|transition\s*:[^;]*\ball\s/i.test(cssText),
    usesVh100: /\b100vh\b/.test(cssText), uses100vw: /\b100vw\b/.test(cssText), hasMotion: /@keyframes|transition\s*:/i.test(cssText), reducedMotion: /prefers-reduced-motion/i.test(cssText), focusVisible: /:focus-visible/i.test(cssText) };
}

async function focusCheck(page) {
  await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
  let visited = 0, missing = 0;
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab');
    const r = await page.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const s = getComputedStyle(e);
      return (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none'; });
    if (r === null) break;
    visited++; if (!r) missing++;
  }
  return { visited, missing };
}

async function shots(page, url, dir) {
  const out = join(dir, 'shots'); mkdirSync(out, { recursive: true });
  for (const [label, width, height, mobile] of [['desktop', 1440, 900, false], ['phone', 390, 844, true]]) {
    await page.setViewport({ width, height, isMobile: mobile, hasTouch: mobile });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 }).catch(() => {});
    await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); await document.fonts.ready; });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: join(out, `${label}-full.jpg`), type: 'jpeg', quality: 78, fullPage: true });
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    if (label === 'desktop') for (let i = 0, y = 0; y < h && i < 6; i++, y += 1300)
      await page.screenshot({ path: join(out, `part-${i + 1}.jpg`), type: 'jpeg', quality: 72, captureBeyondViewport: true, clip: { x: 0, y, width, height: Math.min(1300, h - y) } });
    else await page.screenshot({ path: join(out, 'phone-fold.jpg'), type: 'jpeg', quality: 72 });
  }
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars'] });
const port = Number(new URL(browser.wsEndpoint()).port);
for (const run of runDirs()) {
  const index = join(run.dir, 'work', 'index.html'), target = join(run.dir, 'score.json');
  if (run.kind === 'audit' || !existsSync(index) || (existsSync(target) && !flag('force'))) continue;
  if (run.kind !== 'fixture' && !existsSync(join(run.dir, 'result.json'))) continue; // never score a killed run
  const site = await serve(join(run.dir, 'work'));
  const page = await browser.newPage();
  const score = { kind: run.kind, id: run.id, name: run.name, overflow: {}, axe: {} };
  try {
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 45000 }).catch(() => {});
    await page.evaluate(async () => { await document.fonts.ready; });
    const p = await page.evaluate(probe);
    const { cssText, inlineStyles, text, alts, ...rest } = p;
    Object.assign(score, rest, { css: cssChecks(cssText, inlineStyles) });
    writeFileSync(join(run.dir, 'text.txt'), `${text}\n\nImage descriptions:\n${alts.join('\n')}`);
    score.copy = { placeholders: (text.match(/\bslot\b\s*:|goes here|to be added|to add before|\badd (?:your|studio|price)\b|\[[^\]\n]{2,40}\]|\bTBC\b|to confirm/gi) || []).length, buzzwords: [...new Set((text.match(BUZZ) || []).map(s => s.toLowerCase()))], filler: (text.match(FILLER) || []).length, emDashes: (text.match(/—/g) || []).length,
      middleDots: (text.match(/ · /g) || []).length, arrows: (text.match(/\w\s*[→↗]/g) || []).length, emoji: (text.match(EMOJI) || []).length, learnMore: (text.match(/learn more|get started|book a demo/gi) || []).length };
    score.focus = await focusCheck(page);
    for (const [width, height] of [[1440, 900], [390, 844]]) {
      await page.setViewport({ width, height });
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 45000 }).catch(() => {});
      await page.evaluate(axeSource);
      const res = await page.evaluate(async () => axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }));
      score.axe[width] = res.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }));
      if (width === 390) { const m = await page.evaluate(() => { const q = [...document.querySelectorAll('a,button,input,select,textarea')].filter(e => e.getBoundingClientRect().width > 0 && !(e.tagName === 'A' && e.closest('p,li') && e.parentElement.textContent.trim().length > e.textContent.trim().length + 3)).map(e => e.getBoundingClientRect()); return { under24: q.filter(r => r.width < 24 || r.height < 24).length, under44: q.filter(r => r.width < 44 || r.height < 44).length, total: q.length }; }); score.phoneTargets = m; }
    }
    for (const width of [320, 390, 768, 1024, 1440, 1920]) {
      await page.setViewport({ width, height: 900 });
      await page.goto(site.url, { waitUntil: 'load', timeout: 45000 }).catch(() => {});
      score.overflow[width] = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 || document.body.scrollWidth > document.documentElement.clientWidth + 1);
    }
    await shots(page, site.url, run.dir);
    const lh = await lighthouse(site.url, { port, output: 'json', logLevel: 'error', onlyCategories: ['performance'] }).catch(e => ({ error: e.message }));
    score.lighthouse = lh.lhr ? { performance: Math.round(lh.lhr.categories.performance.score * 100), lcpMs: Math.round(lh.lhr.audits['largest-contentful-paint'].numericValue), cls: +lh.lhr.audits['cumulative-layout-shift'].numericValue.toFixed(3) } : { error: lh.error || 'failed' };
  } catch (e) { score.error = e.message; }
  writeJSON(target, score);
  await page.close(); site.close();
  console.log(run.kind, run.id, run.name, score.error || 'ok');
}
await browser.close();
