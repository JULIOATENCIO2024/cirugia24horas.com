import type { Lang } from '../data/site';

// Textos de interfaz ES/EN. El contenido largo vive en las páginas y en /data.
export const t = {
  es: {
    home: 'Inicio', specialties: 'Especialidades', procedures: 'Procedimientos', prices: 'Precios', clinics: 'Clínicas',
    doctors: 'Doctores', international: 'Pacientes internacionales', how: 'Cómo funciona', guides: 'Guías', blog: 'Blog',
    reviews: 'Opiniones', contact: 'Contacto', menu: 'Menú', switchLang: 'English', switchLabel: 'Read this page in English',
    whatsapp: 'WhatsApp', call: 'Llamar', quote: 'Cotización gratis', from: 'Desde', priceFrom: 'Precio desde',
    clinic: 'Clínica', district: 'Distrito', price: 'Precio', preop: 'Preoperatorios', consult: 'Consulta', room: 'Habitación',
    stay: 'Hospitalización', icu: 'UCI', emergency: 'Emergencia', level: 'Perfil', all: 'Todos los procedimientos',
    fxNote: (r: number, d: string) => `Precios en soles (S/) publicados por cada clínica; el monto en dólares es referencial con un tipo de cambio de S/ ${r.toFixed(2)} por US$ 1 (${d}). El precio final se confirma por escrito tras la evaluación médica.`,
    priceNote: 'Los precios son referenciales y pueden variar según la evaluación médica, la disponibilidad y las condiciones de cada clínica.',
    faq: 'Preguntas frecuentes', related: 'Guías relacionadas', alsoRead: 'También te puede interesar', reviewed: 'Revisado por',
    updated: 'Actualizado', readMore: 'Ver más', seePrice: 'Ver precios por clínica', breadcrumb: 'Ruta',
    disclaimer: 'Información referencial de salud: no reemplaza la consulta médica. La indicación la define el especialista tras evaluarte; no se garantizan resultados. Los precios son referenciales.',
    waProc: (n: string) => `Hola, quiero una cotización para ${n}.`, waGeneric: 'Hola, quiero información para operarme con Cirugía 24 Horas.',
    tldr: 'Respuesta corta', surgeons: 'Cirujanos de la red', financing: 'Financiamiento',
  },
  en: {
    home: 'Home', specialties: 'Specialties', procedures: 'Procedures', prices: 'Prices', clinics: 'Clinics',
    doctors: 'Doctors', international: 'International patients', how: 'How it works', guides: 'Guides', blog: 'Blog (Spanish)',
    reviews: 'Reviews', contact: 'Contact', menu: 'Menu', switchLang: 'Español', switchLabel: 'Leer esta página en español',
    whatsapp: 'WhatsApp', call: 'Call', quote: 'Free quote', from: 'From', priceFrom: 'Cost from',
    clinic: 'Clinic', district: 'District', price: 'Price', preop: 'Pre-op tests', consult: 'Consultation', room: 'Room',
    stay: 'Hospital stay', icu: 'ICU', emergency: 'Emergency', level: 'Profile', all: 'All procedures',
    fxNote: (r: number, d: string) => `Prices are published by each clinic in Peruvian soles (S/). US dollar amounts are for reference at S/ ${r.toFixed(2)} per US$ 1 (${d}). Your final price is confirmed in writing after the medical evaluation.`,
    priceNote: 'Prices are for reference and may vary depending on the medical evaluation, availability and each clinic’s conditions.',
    faq: 'Frequently asked questions', related: 'Related guides', alsoRead: 'You may also like', reviewed: 'Medically reviewed by',
    updated: 'Updated', readMore: 'Read more', seePrice: 'See prices by clinic', breadcrumb: 'Breadcrumb',
    disclaimer: 'Health information for reference only: it does not replace a medical consultation. The specialist decides the indication after evaluating you; results are not guaranteed. Prices are for reference.',
    waProc: (n: string) => `Hello, I would like a quote for ${n} in Peru.`, waGeneric: 'Hello, I would like information about having surgery in Peru with Cirugía 24 Horas.',
    tldr: 'Short answer', surgeons: 'Network surgeons', financing: 'Financing',
  },
} as const;

export const L = (lang: Lang) => t[lang];
