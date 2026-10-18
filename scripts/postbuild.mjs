// Después de `astro build`:
// 1) escribe dist/.htaccess (HTTPS, 301 de las URL que cambian, caché y compresión para SiteGround/Apache);
// 2) verifica que TODAS las URL del WordPress actual (urls.csv de la exportación) existan en dist/ (ninguna en 404).
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const doctors = ['dr-julio-atencio-cruz', 'dr-giomar-farfan', 'dr-miguel-suarez', 'dr-ronald-arcana', 'dr-boris-villavicencio', 'cesar-alvarez', 'dr-jorge-mozquera', 'dra-milagros-quinto', 'dr-alfonzo-pena', 'dra-diana-escobedo'];
const redirects = [
  // Perfiles del WordPress (/doctors/<slug>/) → directorio nuevo en español.
  ...doctors.map((d) => [`/doctors/${d}/`, `/doctores/${d}/`]),
  ['/doctors/', '/doctores/'],
];

const htaccess = `# cirugia24horas.com — generado por scripts/postbuild.mjs
Options -Indexes
DirectoryIndex index.html
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]
# Barra final en todas las URL de contenido (las del WordPress la tenían).
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_URI} !(\\.[a-z0-9]{2,5})$ [NC]
RewriteCond %{REQUEST_URI} !/$
RewriteRule ^(.*)$ /$1/ [R=301,L]
</IfModule>

${redirects.map(([a, b]) => `Redirect 301 ${a} ${b}`).join('\n')}

<IfModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/xml application/javascript application/json image/svg+xml
</IfModule>
<IfModule mod_expires.c>
ExpiresActive On
ExpiresByType image/webp "access plus 1 year"
ExpiresByType image/png "access plus 1 year"
ExpiresByType image/jpeg "access plus 1 year"
ExpiresByType image/x-icon "access plus 1 year"
ExpiresByType font/woff2 "access plus 1 year"
ExpiresByType text/html "access plus 0 seconds"
</IfModule>
<IfModule mod_headers.c>
Header set X-Content-Type-Options "nosniff"
Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
`;
fs.writeFileSync(path.join(dist, '.htaccess'), htaccess);

// Verificación de URLs del WordPress.
const csv = path.resolve('../insumos/cirugia24horas.com/cirugia24horas.com/datos/urls.csv');
if (fs.existsSync(csv)) {
  const urls = fs.readFileSync(csv, 'utf8').split(/\r?\n/).slice(1).filter(Boolean).map((l) => l.split(',')[0]);
  const missing = urls.filter((u) => !fs.existsSync(path.join(dist, u, 'index.html')));
  const redirected = new Set(redirects.map(([a]) => a));
  const really = missing.filter((u) => !redirected.has(u));
  console.log(`postbuild: ${urls.length} URL del WordPress, ${urls.length - really.length} OK, ${really.length} faltantes`);
  if (really.length) { console.log(really.join('\n')); process.exitCode = 1; }
} else {
  console.log('postbuild: no se encontró urls.csv de la exportación; se omite la verificación');
}
