# cirugia24horas.com

Marketplace quirúrgico global de AQUINT Health Group: 33 procedimientos con precio por clínica en S/ y US$ (US$ 1 = S/ 3.50), ES en la raíz y EN en `/en/`, 560 guías por idioma y los 133 artículos del blog del WordPress con su URL exacta.

## Comandos

```bash
pnpm install
pnpm run build      # astro build + scripts/postbuild.mjs (.htaccess y verificación de URLs del WordPress)
node scripts/audit.mjs   # auditoría SEO de dist/: titles, descriptions, canonical, hreflang, JSON-LD, enlaces rotos
```

## Datos

- `src/data/site.ts`: marca, contacto, GA4/Ads, tipo de cambio, clínicas y doctores.
- `src/data/catalog.ts`: especialidades y procedimientos (slug ES del WordPress, slug EN, guía asociada).
- `src/data/wp-procedures.json` y `wp-posts.json`: extraídos del WordPress con `scripts/extract_wp.py`.
- `src/data/guides-es/*.json` (del paquete del cliente, con `scripts/guides-to-json.mjs`) y `guides-en/*.json` (traducción).
- Imágenes: `scripts/fetch_images.py`; íconos y `og.jpg`: `scripts/make_icons.py`.

Pendientes del cliente: ver `PENDIENTES.md`.
