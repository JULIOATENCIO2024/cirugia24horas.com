// Convierte los .js de guías (formato guidePages) del paquete del cliente a JSON por servicio.
// Uso: node scripts/guides-to-json.mjs "<carpeta guides>"
import fs from 'node:fs';
import path from 'node:path';
const dir = process.argv[2];
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('-es.js'))) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  const name = src.match(/const\s+(\w+)\s*=/)[1];
  const arr = new Function(src.replace(/export\s+/g, '') + `;return ${name};`)();
  const id = f.replace(/-es\.js$/, '');
  fs.writeFileSync(`src/data/guides-es/${id}.json`, JSON.stringify(arr, null, 1));
  console.log(id, arr.length);
}
