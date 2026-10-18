import wp from '../data/wp-procedures.json';
import posts from '../data/wp-posts.json';
import { procedures, specialties, procById, specById, guideBaseEn, archetypeEn, bariatricEn, type Procedure, type Faq } from '../data/catalog';
import { clinicAlias, clinicById, type Lang } from '../data/site';

// ---------- Guías (20 por servicio, ES + EN) ----------
const esFiles = import.meta.glob('../data/guides-es/*.json', { eager: true, import: 'default' }) as Record<string, any[]>;
const enFiles = import.meta.glob('../data/guides-en/*.json', { eager: true, import: 'default' }) as Record<string, any[]>;
const idOf = (p: string) => p.split('/').pop()!.replace('.json', '');

export type Guide = {
  service: string; // id del paquete
  index: number; // arquetipo 0–19
  lang: Lang;
  slug: string;
  pair: string; // slug del mismo artículo en el otro idioma
  title: string;
  description: string;
  category: string;
  keyword: string;
  intent: string;
  tldr: string;
  bodyHtml: string;
  faqs: Faq[];
};

const enSlug = (service: string, i: number) => (service === 'bariatrica' ? bariatricEn[i] : `${guideBaseEn[service]}-${archetypeEn[i]}`);

export const guides: Guide[] = [];
for (const [path, arr] of Object.entries(esFiles)) {
  const service = idOf(path);
  const en = Object.entries(enFiles).find(([p]) => idOf(p) === service)?.[1] ?? [];
  arr.forEach((g, i) => {
    const se = enSlug(service, i);
    guides.push({ service, index: i, lang: 'es', slug: g.slug, pair: se, title: g.title, description: g.description, category: g.category, keyword: g.keyword, intent: g.intent, tldr: g.tldr, bodyHtml: g.bodyHtml, faqs: g.faqs });
    const e = en[i];
    if (e) guides.push({ service, index: i, lang: 'en', slug: se, pair: g.slug, title: e.title, description: e.description, category: e.category, keyword: e.keyword, intent: e.intent, tldr: e.tldr, bodyHtml: e.bodyHtml, faqs: e.faqs });
  });
}
export const guidesOf = (service: string | undefined, lang: Lang) => guides.filter((g) => g.service === service && g.lang === lang);
export const guideAt = (service: string | undefined, i: number, lang: Lang) => guides.find((g) => g.service === service && g.index === i && g.lang === lang);
/** Procedimiento principal de un paquete de guías (para enlazar la guía con su página de precio). */
export const procOfGuide = (service: string) => procedures.find((p) => p.guide === service && (p.gi ?? 0) === 0) ?? procedures.find((p) => p.guide === service)!;

// ---------- Precios por clínica (de las tarjetas del WordPress) ----------
const dict: Record<string, string> = {
  'Sí': 'Yes', 'No': 'No', 'Compartida': 'Shared', 'Privada': 'Private', 'Suite': 'Suite', 'Orden de llegada': 'First come, first served',
  'Previa cita': 'By appointment', '1 día': '1 day', 'Según evaluación médica.': 'Per medical evaluation', 'Según evaluación': 'Per evaluation',
  'Sí incluye': 'Included', 'No incluye': 'Not included', 'Sí, no incluida en el costo': 'Yes, not included in the price',
  'Sí, tipo I': 'Yes (type I)', 'Sí, tipo II': 'Yes (type II)', 'Sí, tipo II.': 'Yes (type II)', 'Nacionales': 'Peruvian patients',
  'Nacionales e internacionales': 'Peruvian and international', 'Por confirmar': 'To be confirmed',
};
const tr = (v: string | undefined, lang: Lang) => {
  if (!v) return '';
  if (lang === 'es') return v.replace(/\.$/, '');
  const m = v.match(/^No incluye - (S\/ ?[\d,]+)$/);
  if (m) return `Not included (${m[1]})`;
  return dict[v] ?? dict[v.replace(/\.$/, '')] ?? v;
};

export type PriceRow = {
  clinic: string;
  name: string;
  district: string;
  level: string;
  price: number;
  preop: string;
  preopIncluded: boolean;
  consult: string;
  room: string;
  stay: string;
  icu: string;
  emergency: string;
};

export function priceRows(procId: string, lang: Lang): PriceRow[] {
  const cards = (wp as Record<string, any>)[procId]?.cards ?? [];
  return cards
    .filter((c: any) => c.price)
    .map((c: any) => {
      const id = clinicAlias[c.name] ?? 'c24';
      const cl = clinicById(id);
      const f = c.fields ?? {};
      return {
        clinic: id, name: cl.name, district: cl.main ? cl.district : 'Lima', level: cl.level[lang], price: c.price,
        preop: tr(f['Pre operatorios'], lang), preopIncluded: /^Sí incluye/.test(f['Pre operatorios'] ?? ''),
        consult: tr(f['Consulta'], lang), room: tr(f['Habitación'], lang), stay: tr(f['Hospitalización'], lang),
        icu: tr(f['UCI'], lang), emergency: tr(f['Emergencia'], lang),
      };
    })
    .sort((a: PriceRow, b: PriceRow) => a.price - b.price);
}

export const minPrice = (procId: string) => Math.min(...priceRows(procId, 'es').map((r) => r.price));
export const maxPrice = (procId: string) => Math.max(...priceRows(procId, 'es').map((r) => r.price));
export const wpFaqs = (procId: string): Faq[] => (wp as Record<string, any>)[procId]?.faqs ?? [];
export const wpSeo = (procId: string) => (wp as Record<string, any>)[procId] as { seoTitle: string; metaDescription: string; wpTitle: string };

// ---------- URLs y pares de idioma ----------
export const url = {
  proc: (p: Procedure, lang: Lang) => (lang === 'es' ? `/${p.id}/` : `/en/${p.slugEn}/`),
  spec: (id: string, lang: Lang) => (lang === 'es' ? `/especialidades/${id}/` : `/en/specialties/${specById(id).slugEn}/`),
  guide: (g: { slug: string }, lang: Lang) => (lang === 'es' ? `/guias/${g.slug}/` : `/en/guides/${g.slug}/`),
  clinic: (id: string, lang: Lang) => (lang === 'es' ? `/clinicas/${id}/` : `/en/clinics/${id}/`),
  doctor: (slug: string, lang: Lang) => (lang === 'es' ? `/doctores/${slug}/` : `/en/doctors/${slug}/`),
};

/** Páginas fijas con su par ES ↔ EN. */
export const pages = {
  home: { es: '/', en: '/en/' },
  specialties: { es: '/especialidades/', en: '/en/specialties/' },
  international: { es: '/pacientes-internacionales/', en: '/en/international-patients/' },
  clinics: { es: '/clinicas/', en: '/en/clinics/' },
  doctors: { es: '/doctores/', en: '/en/doctors/' },
  reviews: { es: '/opiniones/', en: '/en/reviews/' },
  prices: { es: '/precios/', en: '/en/prices/' },
  how: { es: '/como-funciona/', en: '/en/how-it-works/' },
  guides: { es: '/guias/', en: '/en/guides/' },
  contact: { es: '/contacto/', en: '/en/contact/' },
  privacy: { es: '/legal/privacidad/', en: '/en/legal/privacy/' },
  terms: { es: '/legal/terminos/', en: '/en/legal/terms/' },
  editorial: { es: '/legal/politica-editorial/', en: '/en/legal/editorial-policy/' },
  disclaimer: { es: '/legal/aviso-medico/', en: '/en/legal/medical-disclaimer/' },
} as const;

export const blogPosts = posts as {
  slug: string; url: string; title: string; seoTitle: string; description: string; date: string; modified: string; categories: string; image: string; html: string;
}[];

export { procedures, specialties, procById, specById };
