// Sitemaps por idioma (BUILD §5): /sitemap-es.xml y /sitemap-en.xml, con xhtml:link hreflang entre pares.
import type { APIRoute } from 'astro';
import { site, doctors, clinics } from '../data/site';
import { procedures, specialties, guides, blogPosts, url, pages } from '../lib/data';

type Entry = { es?: string; en?: string };
function entries(): Entry[] {
  const out: Entry[] = Object.values(pages).map((p) => ({ es: p.es, en: p.en }));
  out.push(...procedures.map((p) => ({ es: url.proc(p, 'es'), en: url.proc(p, 'en') })));
  out.push(...specialties.map((s) => ({ es: url.spec(s.id, 'es'), en: url.spec(s.id, 'en') })));
  out.push(...clinics.filter((c) => c.main).map((c) => ({ es: url.clinic(c.id, 'es'), en: url.clinic(c.id, 'en') })));
  out.push(...doctors.filter((d) => d.confirmed).map((d) => ({ es: url.doctor(d.slug, 'es'), en: url.doctor(d.slug, 'en') })));
  out.push(...guides.filter((g) => g.lang === 'es').map((g) => ({ es: url.guide(g, 'es'), en: url.guide({ slug: g.pair }, 'en') })));
  out.push({ es: '/blog/' }, ...blogPosts.map((b) => ({ es: b.url })));
  return out;
}
export function getStaticPaths() { return [{ params: { lang: 'es' } }, { params: { lang: 'en' } }]; }
export const GET: APIRoute = ({ params }) => {
  const lang = params.lang as 'es' | 'en';
  const abs = (p: string) => new URL(p, site.url).href;
  const rows = entries().filter((e) => e[lang]).map((e) => {
    const alt = e.es && e.en ? [['es', e.es], ['en', e.en], ['x-default', e.en]].map(([l, h]) => `<xhtml:link rel="alternate" hreflang="${l}" href="${abs(h)}"/>`).join('') : '';
    return `<url><loc>${abs(e[lang]!)}</loc><lastmod>${site.fx.date}</lastmod>${alt}</url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${rows.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
