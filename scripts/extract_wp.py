"""Extrae de la exportación del WordPress actual (insumos/cirugia24horas.com) los datos que la web nueva reutiliza:
- src/data/wp-procedures.json: por página de procedimiento, las tarjetas de clínica (precio, preoperatorios, consulta,
  ubicación y condiciones), las preguntas frecuentes y el SEO publicado.
- src/data/wp-posts.json: los 133 artículos del blog (misma URL), con el cuerpo convertido a HTML.

Uso:  python3 -I scripts/extract_wp.py "<carpeta cirugia24horas.com de la exportación>"
"""
import json, re, sys, html, csv
from pathlib import Path

SRC = Path(sys.argv[1])
OUT = Path(__file__).resolve().parent.parent / 'src' / 'data'
NOT_PROC = {'home', 'blog', 'doctores'}


def front(text):
    m = re.match(r'---\n(.*?)\n---\n', text, re.S)
    fm = {}
    for line in m.group(1).splitlines():
        k, _, v = line.partition(': ')
        fm[k] = json.loads(v) if v.startswith('"') else v
    return fm, text[m.end():]


def money(s):
    m = re.search(r'S/\s*([\d,\.]+)', s)
    return int(m.group(1).replace(',', '').split('.')[0]) if m else None


def parse_cards(body):
    """Cada tarjeta empieza con '### <Clínica>' tras la línea 'Clínica' y termina en '[Consultar ahora](...)'."""
    cards = []
    for m in re.finditer(r'\n(Opción[^\n]*)\n\n!\[[^\]]*\]\(([^)]*)\)\n\nClínica\n\n### ([^\n]+)\n\n(.*?)\[Consultar ahora\]', body, re.S):
        label, img, name, block = m.group(1).strip(), m.group(2), m.group(3).strip(), m.group(4)
        lines = [l.strip() for l in block.split('\n') if l.strip()]
        price = money(lines[0]) if lines else None
        tagline = next((l for l in lines[1:] if not l.startswith('**') and l not in ('✓', 'Ver información completa')), '')
        fields = {}
        for l in lines:
            fm = re.match(r'\*\*([^*]+)\*\*(.*)', l)
            if fm:
                fields[fm.group(1).strip()] = fm.group(2).strip()
        cards.append({'label': label, 'name': name, 'img': img, 'price': price, 'tagline': tagline, 'fields': fields})
    if not cards:
        # Formato simple (vasectomía, varicocele, hidrocele): '### <Clínica>' · 'Clínica' · 'S/ \n2500' · '- lema'.
        for m in re.finditer(r'\n### ([^\n]+)\n\nClínica\n\nS/\s*\n?\s*([\d,\.]+)\n\n(?:- ([^\n]+))?', body):
            cards.append({'label': '', 'name': m.group(1).strip(), 'img': '', 'price': int(m.group(2).replace(',', '').split('.')[0]),
                          'tagline': (m.group(3) or '').strip(), 'fields': {}})
    return cards


def parse_faqs(body):
    i = body.find('## Resolvemos tus dudas')
    if i < 0:
        return []
    part = body[i:].split('\n\n')[2:]  # salta el título y el párrafo introductorio
    faqs, q = [], None
    for chunk in part:
        c = chunk.strip()
        if not c or c.startswith('#') or c.startswith('!['):
            continue
        if c.endswith('?') and len(c) < 200:
            q = c
        elif q:
            faqs.append({'q': q, 'a': c})
            q = None
    return faqs


def intro(body):
    m = re.search(r'\n# Tu cirugía[^\n]*\n\n([^\n]+)', body)
    return m.group(1).strip() if m else ''


def md_to_html(md):
    """Conversión mínima suficiente para los artículos exportados (títulos, párrafos, listas, negrita, enlaces, imágenes)."""
    md = re.sub(r'```.*?```', '', md, flags=re.S)
    out, lst = [], None

    def inline(t):
        t = html.escape(t, quote=False)
        t = re.sub(r'!\[([^\]]*)\]\(([^)\s]+)[^)]*\)', r'<img src="\2" alt="\1" loading="lazy">', t)
        t = re.sub(r'\[([^\]]+)\]\(([^)\s]+)[^)]*\)', r'<a href="\2">\1</a>', t)
        t = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', t)
        t = re.sub(r'(?<!\*)\*([^*\n]+)\*(?!\*)', r'<em>\1</em>', t)
        return t

    def close():
        nonlocal lst
        if lst:
            out.append(f'</{lst}>')
            lst = None

    for block in re.split(r'\n\s*\n', md.strip()):
        lines = block.strip().split('\n')
        if not lines[0]:
            continue
        h = re.match(r'(#{1,6})\s+(.*)', lines[0])
        if h and len(lines) == 1:
            close()
            lvl = max(2, len(h.group(1)))
            out.append(f'<h{lvl}>{inline(h.group(2))}</h{lvl}>')
            continue
        if all(re.match(r'\s*([-*]|\d+\.)\s+', l) for l in lines):
            kind = 'ol' if re.match(r'\s*\d+\.', lines[0]) else 'ul'
            if lst != kind:
                close()
                out.append(f'<{kind}>')
                lst = kind
            for l in lines:
                out.append(f'<li>{inline(re.sub(r"^\s*([-*]|\d+\.)\s+", "", l))}</li>')
            continue
        close()
        if block.lstrip().startswith('|'):
            rows = [r for r in lines if not re.match(r'\s*\|[\s:|-]+\|\s*$', r)]
            cells = [[inline(c.strip()) for c in r.strip().strip('|').split('|')] for r in rows]
            if cells:
                head = ''.join(f'<th>{c}</th>' for c in cells[0])
                body_rows = ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in cells[1:])
                out.append(f'<div class="table-wrap"><table><thead><tr>{head}</tr></thead><tbody>{body_rows}</tbody></table></div>')
            continue
        out.append('<p>' + '<br>'.join(inline(l) for l in lines) + '</p>')
    close()
    return '\n'.join(out)


seo = {s['url']: s for s in json.load(open(SRC / 'datos' / 'seo_por_url.json', encoding='utf-8'))}

procs = {}
for f in sorted((SRC / 'contenido' / 'paginas').glob('*.md')):
    if f.stem in NOT_PROC:
        continue
    fm, body = front(f.read_text(encoding='utf-8'))
    procs[f.stem] = {
        'slug': f.stem,
        'wpTitle': fm['titulo'],
        'seoTitle': fm.get('seo_title', ''),
        'metaDescription': fm.get('meta_description', ''),
        'intro': intro(body),
        'cards': parse_cards(body),
        'faqs': parse_faqs(body),
    }

posts = []
for f in sorted((SRC / 'contenido' / 'blog').glob('*.md')):
    fm, body = front(f.read_text(encoding='utf-8'))
    body = re.sub(r'^# .*\n', '', body.strip(), count=1)
    s = seo.get(fm['url'], {})
    posts.append({
        'slug': f.stem, 'url': fm['url'], 'title': fm['titulo'],
        'seoTitle': fm.get('seo_title') or s.get('title', ''),
        'description': fm.get('meta_description') or s.get('description', ''),
        'date': fm.get('fecha', ''), 'modified': fm.get('modificado', ''),
        'categories': fm.get('categorias', ''), 'image': fm.get('imagen_destacada', ''),
        'html': md_to_html(body),
    })

(OUT / 'wp-procedures.json').write_text(json.dumps(procs, ensure_ascii=False, indent=1), encoding='utf-8')
(OUT / 'wp-posts.json').write_text(json.dumps(posts, ensure_ascii=False, indent=1), encoding='utf-8')
for k, p in procs.items():
    print(f"{k:52} cards={len(p['cards'])} faqs={len(p['faqs'])} " + ' '.join(f"{c['name']}={c['price']}" for c in p['cards']))
print('posts', len(posts))
