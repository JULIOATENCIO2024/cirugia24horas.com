import { defineConfig } from 'astro/config';

// cirugia24horas.com — marketplace quirúrgico ES (raíz) + EN (/en/). HTML estático, CSS inline, sin JS de framework.
// Sitemaps por idioma, robots.txt, llms.txt y .htaccess (301) se generan en src/pages y scripts/postbuild.mjs.
export default defineConfig({
  site: 'https://cirugia24horas.com',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always', format: 'directory' },
  compressHTML: true,
});
