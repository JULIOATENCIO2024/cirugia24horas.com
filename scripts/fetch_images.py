"""Descarga las imágenes del WordPress actual que usa la web nueva y las guarda en WebP en public/img/.
- Logo, fotos de clínicas (tarjetas de precio) y fotos de doctores.
- Imágenes de los 133 artículos del blog (cuerpo + destacada); reescribe sus rutas en src/data/wp-posts.json.
Uso:  python3 -I scripts/fetch_images.py
"""
import json, re, io, urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / 'public' / 'img'
UA = {'User-Agent': 'Mozilla/5.0 (AQUINT-migracion)'}


def fetch(url, dest, max_w=1200):
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists():
        return True
    try:
        data = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()
        im = Image.open(io.BytesIO(data))
        im = im.convert('RGBA') if im.mode in ('P', 'LA', 'RGBA') else im.convert('RGB')
        if im.width > max_w:
            im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
        im.save(dest, 'WEBP', quality=80, method=6)
        return True
    except Exception as e:
        print('  ERROR', url, e)
        return False


def name_of(url):
    stem = url.rstrip('/').split('/')[-1].rsplit('.', 1)[0]
    return re.sub(r'[^a-z0-9-]+', '-', stem.lower()).strip('-')[:80] + '.webp'


fixed = {
    'logo.webp': ('https://cirugia24horas.com/wp-content/uploads/2026/04/Logo_Cirugia_24_Horas_Footer-e1778521909922.webp', 600),
    'equipo/sede-quirofano.webp': ('https://cirugia24horas.com/wp-content/uploads/2026/04/IMG_7385-1-scaled-1-1024x768.jpeg', 1024),
    'equipo/sede-equipo.webp': ('https://cirugia24horas.com/wp-content/uploads/2026/04/IMG_1884-1-1024x683.jpeg', 1024),
    'equipo/sede-lima.webp': ('https://cirugia24horas.com/wp-content/uploads/2026/04/526037608_1554366958876213_3173348464700401919_n.jpg', 1024),
    'clinicas/raimondi.webp': ('https://cirugia24horas.com/wp-content/uploads/2026/05/4fbf2eda-e9c9-4283-bf78-5fe7921ef09a-1-1.jpeg', 800),
    'clinicas/santa-lucia.webp': ('https://cirugia24horas.com/wp-content/uploads/2026/05/PHOTO-2022-12-28-14-16-30_upscayl_4x_ultrasharp-1-scaled.png', 800),
    'clinicas/gastroenterologica.webp': ('https://cirugia24horas.com/wp-content/uploads/2026/05/IMG_0347-1-scaled-1.jpg', 800),
    'clinicas/higuereta.webp': ('https://cirugia24horas.com/wp-content/uploads/2026/05/e7ca906d-8241-47be-b563-f08a47e3bf28.jpeg', 800),
    'clinicas/inca.webp': ('https://cirugia24horas.com/wp-content/uploads/2026/05/1d7235ef-a47f-4def-befe-a365563bd4a6.jpeg', 800),
}
doctors = {
    'dr-julio-atencio-cruz': 'https://cirugia24horas.com/wp-content/uploads/2026/08/Dr_Julio_Atencio_Cruz.webp',
    'dr-giomar-farfan': 'https://cirugia24horas.com/wp-content/uploads/2026/08/Dr_Giomar_Farfan.avif',
    'dr-miguel-suarez': 'https://cirugia24horas.com/wp-content/uploads/2026/08/DR-MIGUEL-SUAREZ.webp',
    'dr-ronald-arcana': 'https://cirugia24horas.com/wp-content/uploads/2026/08/dr-ronald-arcana.webp',
    'dr-boris-villavicencio': 'https://cirugia24horas.com/wp-content/uploads/2026/04/Dr_Boris_Villavicencio.webp',
    'cesar-alvarez': 'https://cirugia24horas.com/wp-content/uploads/2026/04/Dr_Cesar_Alvarez.webp',
    'dr-jorge-mozquera': 'https://cirugia24horas.com/wp-content/uploads/2026/04/Dr_Jorge_Mosquera.webp',
    'dra-milagros-quinto': 'https://cirugia24horas.com/wp-content/uploads/2026/04/Dra_Milagros_Quinto.webp',
    'dr-alfonzo-pena': 'https://cirugia24horas.com/wp-content/uploads/2026/04/Dr_Javier_Pena.webp',
    'dra-diana-escobedo': 'https://cirugia24horas.com/wp-content/uploads/2026/04/DOCTORA-DIANA-ESCOBEDO.webp',
}
for k, u in doctors.items():
    fixed[f'doctores/{k}.webp'] = (u, 480)

for dest, (url, w) in fixed.items():
    print(dest, 'ok' if fetch(url, IMG / dest, w) else 'FALLÓ')

posts_path = ROOT / 'src' / 'data' / 'wp-posts.json'
posts = json.loads(posts_path.read_text(encoding='utf-8'))
ok = bad = 0
for p in posts:
    def repl(m):
        global ok, bad
        url, rest = m.group(1), m.group(2)
        local = f'/img/blog/{name_of(url)}'
        if fetch(url, ROOT / 'public' / local.lstrip('/'), 1000):
            ok += 1
            return f'<img src="{local}"{rest}>'
        bad += 1
        return ''  # la imagen ya da 404 en el WordPress actual: se quita la etiqueta en vez de dejarla rota
    p['html'] = re.sub(r'<img src="(https://cirugia24horas\.com/[^"]+)"([^>]*)>', repl, p['html'])
    p['html'] = re.sub(r'<p>\s*</p>', '', p['html'])
    if p['image'].startswith('https://cirugia24horas.com/'):
        local = f'/img/blog/{name_of(p["image"])}'
        p['image'] = local if fetch(p['image'], ROOT / 'public' / local.lstrip('/'), 1000) else ''
posts_path.write_text(json.dumps(posts, ensure_ascii=False, indent=1), encoding='utf-8')
print('blog imágenes ok', ok, 'fallidas', bad)
