# cirugia24horas.com — pendientes antes de publicar

Web armada el 18-oct-2026 a partir del BUILD Global, el paquete de 560 artículos, `clinics.json`, `services-bariatrica.json` y la exportación del WordPress actual (en `../insumos/`).

## Datos que debe confirmar el cliente

| Dato | Estado en la web | Dónde se cambia |
|---|---|---|
| RUC de AQUINT Health Group SAC | No se muestra | `src/data/site.ts` → `ruc` |
| Ubicación de Clínica Higuereta | **Surco** (la home actual dice Surco; las tablas dicen Miraflores) | `src/data/site.ts` → `clinics` |
| Ubicación de Clínica Del Inca | **Miraflores** (según las tablas actuales; `clinics.json` dice "confirmar") | ídem |
| Ubicación de las sedes especializadas (urológica, traumatológica, plástica, Gineco NOVO Q, cabeza y cuello, cardiovascular) | Se muestra "Lima" (el WordPress dice "Por confirmar") | ídem |
| Coordenadas de Av. Javier Prado Este 1510 | Aproximadas | `site.geo` |
| Etiquetas de conversión de Google Ads (AW-18515905540) | Vacías: solo se envían los eventos GA4 | `site.adsLabels` |
| Contenedor GTM-KBTQ5LJD de la web actual | **No se carga** (se usa gtag directo por velocidad). Si tiene píxeles (Meta, TikTok), decidir si se migran | `src/layouts/Base.astro` |
| Libro de Reclamaciones virtual | Se explica cómo pedirlo por correo/WhatsApp; falta el enlace al formulario oficial | `src/components/views/Contact.astro` |
| Condiciones de financiamiento Salud Pay | Solo se menciona con enlace (sin "desde S/ X/mes") | `ProcedurePage.astro` |

## Doctores

- Con CMP/RNE confirmados (tomados de otras webs de la red): Dr. Julio Atencio Cruz (58882/30813), Dra. Milagros Quinto Cobeña (53588/30074), Dr. Jorge Mosquera Gutiérrez (26839/11327), Dr. Javier Peña Crisóstomo (26805/11247), Dr. Giomar Farfán Daza (54702/25593), Dr. Miguel Suárez Pérez (39180/17776).
- **Sin datos** (ficha con `noindex` y sin especialidad hasta tenerlos): Dr. Ronald Arcana, Dr. Boris Villavicencio, Dr. César Álvarez y Dra. Diana Escobedo. Ojo: en otro proyecto el Dr. Arcana figura con el mismo CMP/RNE que el Dr. Suárez (39180/17776), lo que parece un error de copia.
- El WordPress lo llama "Dr. Alfonzo Pena", pero la foto es `Dr_Javier_Pena.webp`. Aquí figura como **Dr. Javier Peña Crisóstomo** (la URL `/doctores/dr-alfonzo-pena/` se mantiene). En otra web el cliente pidió retirarlo (15-oct-2026): confirmar si sigue en esta red.
- Especialidad del Dr. Atencio: se puso "Cirugía general y laparoscópica". Confirmar.

## Precios (tomados tal cual de las tablas del WordPress) que conviene revisar

- **Prótesis de cadera**: Santa Lucía S/ 6,000, frente a Raimondi S/ 11,000 y el resto por encima de S/ 13,000. Parece un error de tipeo.
- **Rinoplastia**: Del Inca S/ 6,000, más barata que la Clínica Plástica (S/ 7,000) y Santa Lucía (S/ 9,000).
- **Vasectomía, varicocele e hidrocele**: tienen exactamente la misma tabla (S/ 2,500 a S/ 6,500).
- **CPRE y cálculos renales**: incluyen una opción "Cirugía 24 Horas (coordinación directa)" de S/ 4,050 sin condiciones detalladas.
- **Bypass gástrico**: no tiene página ni precio en el WordPress; solo aparece en las guías. Falta su tabla para crear `/bypass-gastrico/`.
- El tipo de cambio referencial está fijo en S/ 3.50 por US$ 1 (pedido del 18-oct-2026). Para cambiarlo, editar `site.fx` y volver a compilar.

## Contenido

- Los 560 artículos ES vienen del paquete del cliente (revisión médica: Dr. Atencio). Son **cortos** (unas 80 a 120 palabras de cuerpo); conviene ampliarlos por lotes, empezando por las money pages (precio, extranjeros, Lima por clínica, por qué en Perú).
- Los 560 artículos EN son **traducción automática** fiel del ES: necesitan una revisión médica o editorial en inglés antes de pautar Ads en EE. UU. o el Reino Unido.
- Las 92 imágenes de los artículos del blog ya dan 404 en el WordPress actual: se quitaron en vez de dejarlas rotas.
- Opiniones: no se publicaron reseñas individuales ni AggregateRating. Cargar solo testimonios con consentimiento escrito.
- Página en portugués (/pt/): fase 2 del BUILD, no incluida.

## Despliegue

1. `pnpm install` y luego `pnpm run build` (el postbuild verifica que las 169 URLs del WordPress existan y escribe `dist/.htaccess`).
2. Subir el contenido de `dist/` (incluido `.htaccess`) a `public_html` en SiteGround (ZIP: `../cirugia24horas-siteground.zip`).
3. En Search Console, enviar `https://cirugia24horas.com/sitemap.xml` (índice de `sitemap-es.xml` y `sitemap-en.xml`) y vigilar los 404 y las posiciones durante 30 días.
4. Recién entonces, borrar el WordPress.
