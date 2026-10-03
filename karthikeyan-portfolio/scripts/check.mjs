// Zero-dependency site checks: JS syntax, anchors, ids, assets, ARIA refs, SEO tags, placeholders.
// Usage: npm run check
import { readFileSync, existsSync } from "node:fs";
import { Script } from "node:vm";

const html = readFileSync("index.html", "utf8");
const errors = [];
const warnings = [];
const ok = (m) => console.log("  ✓ " + m);

// 1. JavaScript parses
for (const f of ["assets/js/config.js", "assets/js/main.js"]) {
  try { new Script(readFileSync(f, "utf8"), { filename: f }); ok(`${f} parses`); }
  catch (e) { errors.push(`${f}: ${e.message}`); }
}

// 2. Unique ids
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
dupes.length ? errors.push("Duplicate ids: " + [...new Set(dupes)].join(", ")) : ok(`${ids.length} ids, all unique`);

// 3. In-page anchors resolve
const anchors = [...html.matchAll(/href="#([^"]*)"/g)].map((m) => m[1]);
const broken = anchors.filter((a) => a && !ids.includes(a));
broken.length ? errors.push("Broken anchors: " + broken.join(", ")) : ok(`${anchors.length} in-page links resolve`);

// 4. ARIA references resolve
const refs = [...html.matchAll(/aria-(?:controls|labelledby)="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/));
const missingRefs = refs.filter((r) => !ids.includes(r));
missingRefs.length ? errors.push("Missing ARIA targets: " + missingRefs.join(", ")) : ok(`${refs.length} ARIA references resolve`);

// 5. Local assets exist
const local = [...html.matchAll(/(?:href|src)="((?:assets\/)[^"#?]+)"/g)].map((m) => m[1]);
const missing = [...new Set(local)].filter((p) => !existsSync(p));
missing.length ? errors.push("Missing files: " + missing.join(", ")) : ok(`${new Set(local).size} local assets exist`);
const cfgSrc = readFileSync("assets/js/config.js", "utf8");
const resumePath = (cfgSrc.match(/path:\s*"([^"]+)"/) || [])[1];
resumePath && existsSync(resumePath) ? ok("resume file exists") : errors.push("Resume file missing: " + resumePath);

// 6. SEO / social metadata
const required = [
  ["<title>", /<title>[^<]+<\/title>/], ["description", /name="description"/], ["canonical", /rel="canonical"/],
  ["og:title", /og:title/], ["og:description", /og:description/], ["og:image", /og:image"/], ["og:url", /og:url/],
  ["twitter:card", /twitter:card/], ["favicon", /rel="icon"/], ["JSON-LD", /application\/ld\+json/],
  ["lang", /<html lang="en"/], ["viewport", /name="viewport"/], ["single h1", null]
];
for (const [name, re] of required) {
  if (name === "single h1") { const n = (html.match(/<h1[\s>]/g) || []).length; n === 1 ? ok("exactly one <h1>") : errors.push(`Found ${n} <h1>`); continue; }
  re.test(html) ? ok(name) : errors.push("Missing " + name);
}
try {
  JSON.parse(html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1]);
  ok("JSON-LD is valid JSON");
} catch { errors.push("JSON-LD is invalid"); }

// 7. External links opened in new tab carry rel="noopener"
const blank = [...html.matchAll(/<a [^>]*target="_blank"[^>]*>/g)].filter((m) => !/rel="[^"]*noopener/.test(m[0]));
blank.length ? errors.push(`${blank.length} target=_blank links without rel=noopener`) : ok("all new-tab links use rel=noopener");

// 8. Placeholders still to replace (warnings only)
const ph = /your-username|your-profile|example\.com/g;
const inHtml = (html.match(ph) || []).length;
const inCfg = (cfgSrc.match(ph) || []).length;
if (inHtml) warnings.push(`index.html: ${inHtml} placeholder URL(s) (your-username.github.io) to replace`);
if (inCfg) warnings.push(`config.js: ${inCfg} placeholder value(s) (links / siteUrl) to replace`);
if (/company:\s*""/.test(cfgSrc)) warnings.push("config.js: career entries have empty company/dates");

console.log("");
warnings.forEach((w) => console.log("  ! " + w));
if (errors.length) { errors.forEach((e) => console.error("  ✗ " + e)); process.exit(1); }
console.log("\nAll checks passed" + (warnings.length ? ` (${warnings.length} placeholder warning(s))` : "") + ".");
