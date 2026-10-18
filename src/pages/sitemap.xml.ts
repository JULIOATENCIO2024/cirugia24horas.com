// Índice de sitemaps.
import type { APIRoute } from 'astro';
import { site } from '../data/site';
export const GET: APIRoute = () => new Response(
  `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['es', 'en'].map((l) => `<sitemap><loc>${site.url}/sitemap-${l}.xml</loc><lastmod>${site.fx.date}</lastmod></sitemap>`).join('\n')}\n</sitemapindex>\n`,
  { headers: { 'Content-Type': 'application/xml' } },
);
