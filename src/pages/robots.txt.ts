import type { APIRoute } from 'astro';
import { site } from '../data/site';
// Se permite a buscadores y a los rastreadores de IA (GEO): el objetivo es que citen precios y guías.
export const GET: APIRoute = () => new Response(`User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain' } });
