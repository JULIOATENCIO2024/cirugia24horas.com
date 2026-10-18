// Auditoría SEO de dist/: títulos, descripciones, canonical, hreflang recíproco, JSON-LD válido y enlaces internos rotos.
import fs from 'node:fs';
import path from 'node:path';
const dist = path.resolve('dist');
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); f.isDirectory() ? walk(p) : f.name === 'index.html' && files.push(p); } })(dist);
const pages = new Map();
for (const f of files) {
  const url = '/' + path.relative(dist, path.dirname(f)).split(path.sep).join('/') + '/';
  const h = fs.readFileSync(f, 'utf8');
  const get = (re) => (h.match(re) || [])[1];
  pages.set(url.replace('//', '/'), {
    title: get(/<title>([^<]*)<\/title>/), desc: get(/<meta name="description" content="([^"]*)"/), canon: get(/<link rel="canonical" href="([^"]*)"/),
    robots: get(/<meta name="robots" content="([^"]*)"/),
    alts: [...h.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="https:\/\/cirugia24horas\.com([^"]*)"/g)].map((m) => [m[1], m[2]]),
    ld: [...h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => m[1]),
    links: [...h.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1]),
    h1: (h.match(/<h1/g) || []).length,
  });
}
const issues = {};
const add = (k, v) => (issues[k] ??= []).push(v);
const titles = new Map();
for (const [u, p] of pages) {
  if (p.robots?.startsWith('noindex')) continue;
  if (!p.title) add('sin title', u); else if (p.title.length > 65) add('title > 65', `${u} (${p.title.length}) ${p.title}`);
  if (!p.desc) add('sin description', u); else if (p.desc.length > 165) add('description > 165', `${u} (${p.desc.length})`);
  if (p.canon !== `https://cirugia24horas.com${u}`) add('canonical distinto', `${u} -> ${p.canon}`);
  if (p.h1 !== 1) add('h1 != 1', `${u} (${p.h1})`);
  titles.set(p.title, [...(titles.get(p.title) ?? []), u]);
  for (const j of p.ld) { try { JSON.parse(j); } catch { add('JSON-LD inválido', u); } }
  for (const [l, h] of p.alts) {
    if (!pages.has(h)) add('hreflang a página inexistente', `${u} -> ${h}`);
    else if (l !== 'x-default' && !pages.get(h).alts.some(([, b]) => b === u)) add('hreflang no recíproco', `${u} -> ${h}`);
  }
}
for (const [t, us] of titles) if (us.length > 1) add('title duplicado', `${t}: ${us.join(', ')}`);
const assets = (l) => fs.existsSync(path.join(dist, l));
for (const [u, p] of pages) for (const l of new Set(p.links)) if (!pages.has(l) && !assets(l)) add('enlace interno roto', `${u} -> ${l}`);
console.log('páginas', pages.size);
for (const [k, v] of Object.entries(issues)) { console.log(`\n## ${k}: ${v.length}`); console.log(v.slice(0, 400).join('\n')); }
