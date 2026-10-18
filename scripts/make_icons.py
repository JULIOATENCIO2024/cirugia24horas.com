"""Genera favicon.ico, favicon.png, apple-touch-icon.png y og.jpg (1200×630) a partir del símbolo del logo.
Uso:  python3 -I scripts/make_icons.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / 'public'
logo = Image.open(PUB / 'img' / 'logo.webp').convert('RGBA')
logo = logo.crop(logo.getbbox())


def square(size, pad=0.12, bg=(255, 255, 255, 255)):
    im = Image.new('RGBA', (size, size), bg)
    w = int(size * (1 - 2 * pad))
    lg = logo.resize((w, round(logo.height * w / logo.width)), Image.LANCZOS)
    im.alpha_composite(lg, ((size - lg.width) // 2, (size - lg.height) // 2))
    return im


square(512).save(PUB / 'favicon.png')
square(180, 0.1).convert('RGB').save(PUB / 'apple-touch-icon.png')
square(64, 0.04, (255, 255, 255, 0)).save(PUB / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])


def font(name, size):
    for f in (name, 'segoeuib.ttf', 'arialbd.ttf'):
        try:
            return ImageFont.truetype(f'C:/Windows/Fonts/{f}', size)
        except OSError:
            continue
    return ImageFont.load_default()


og = Image.new('RGB', (1200, 630), (17, 32, 56))
d = ImageDraw.Draw(og)
d.rectangle([0, 600, 1200, 630], fill=(0, 107, 255))
d.rectangle([0, 590, 600, 600], fill=(137, 205, 53))
d.rectangle([600, 590, 1200, 600], fill=(1, 204, 243))
card = square(220, 0.1)
og.paste(card, (80, 90), card)
d.text((340, 110), 'Cirugía 24 Horas', font=font('segoeuib.ttf', 74), fill=(255, 255, 255))
d.text((340, 210), 'Global Surgery · Lima, Peru', font=font('segoeui.ttf', 40), fill=(201, 213, 230))
d.text((80, 380), 'Precios por clínica en S/ y US$', font=font('segoeuib.ttf', 52), fill=(255, 255, 255))
d.text((80, 455), 'Surgery prices by clinic · Free evaluation · ES / EN', font=font('segoeui.ttf', 36), fill=(201, 213, 230))
og.save(PUB / 'og.jpg', quality=88)
print('ok')
