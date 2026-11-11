// Renders a favicon mark and a logo lockup to the PNG sizes browsers, phones and link
// previews use, with the Chrome or Edge already installed. No dependencies.
// usage: node export.mjs <favicon.svg> <logo.svg> <outDir> [background colour, default #ffffff]
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [mark, logo, out, bg = "#ffffff"] = process.argv.slice(2);
if (!mark || !logo || !out || !existsSync(mark) || !existsSync(logo)) {
  console.error("usage: node export.mjs <favicon.svg> <logo.svg> <outDir> [background colour]"); process.exit(1);
}
const browser = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/microsoft-edge",
].find(p => p && existsSync(p));
if (!browser) { console.error("No Chrome or Edge found. Set CHROME_PATH."); process.exit(1); }

// An SVG with only a viewBox has no natural size, so take its proportions from the viewBox.
function load(file) {
  const svg = readFileSync(file, "utf8");
  const vb = svg.match(/viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  if (!vb) { console.error(`${file} has no viewBox.`); process.exit(1); }
  return { src: "data:image/svg+xml;base64," + Buffer.from(svg).toString("base64"), ratio: Number(vb[1]) / Number(vb[2]) };
}
const art = { mark: load(mark), logo: load(logo) };

// fill: how much of the canvas the artwork may take. Phones crop icons, so they get room and a background.
const jobs = [
  { file: "favicon-32.png", w: 32, h: 32, art: "mark", fill: 1, bg: null },
  { file: "apple-touch-icon.png", w: 180, h: 180, art: "mark", fill: 0.7, bg },
  { file: "icon-192.png", w: 192, h: 192, art: "mark", fill: 0.7, bg },
  { file: "icon-512.png", w: 512, h: 512, art: "mark", fill: 0.7, bg },
  { file: "og-image.png", w: 1200, h: 630, art: "logo", fill: 0.56, bg },
];

const page = `<!doctype html><pre id="out"></pre><script>
const art = ${JSON.stringify(art)}, jobs = ${JSON.stringify(jobs)};
(async () => {
  const imgs = {};
  for (const [k, a] of Object.entries(art)) { const i = new Image(); i.src = a.src; await i.decode(); imgs[k] = i; }
  const result = {};
  for (const j of jobs) {
    const c = document.createElement("canvas"); c.width = j.w; c.height = j.h;
    const g = c.getContext("2d");
    if (j.bg) { g.fillStyle = j.bg; g.fillRect(0, 0, j.w, j.h); }
    const r = art[j.art].ratio;
    let dw = j.w * j.fill, dh = dw / r;
    if (dh > j.h * j.fill) { dh = j.h * j.fill; dw = dh * r; }
    g.drawImage(imgs[j.art], (j.w - dw) / 2, (j.h - dh) / 2, dw, dh);
    result[j.file] = c.toDataURL("image/png");
  }
  document.getElementById("out").textContent = JSON.stringify(result);
})();
</script>`;
mkdirSync(out, { recursive: true });
const tmp = resolve(join(out, "_export.html"));
writeFileSync(tmp, page);
let dom;
try {
  dom = execFileSync(browser, ["--headless", "--disable-gpu", "--virtual-time-budget=5000", "--dump-dom", pathToFileURL(tmp).href], { maxBuffer: 64 * 1024 * 1024 }).toString();
} finally { rmSync(tmp, { force: true }); }
const found = dom.match(/<pre id="out">(\{.*?\})<\/pre>/s);
if (!found) { console.error("The browser didn't render the images."); process.exit(1); }
for (const [file, url] of Object.entries(JSON.parse(found[1].replaceAll("&quot;", '"').replaceAll("&amp;", "&")))) {
  const png = Buffer.from(url.split(",")[1], "base64");
  writeFileSync(join(out, file), png);
  console.log(`${join(out, file)}: ${png.readUInt32BE(16)} by ${png.readUInt32BE(20)}`);   // width and height from the PNG header
}
