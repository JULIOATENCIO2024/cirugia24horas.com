// Datos de marca, contacto, medición, clínicas y doctores de cirugia24horas.com.
// Fuentes: BUILD Global (18-oct-2026), clinics.json del paquete, exportación del WordPress actual y fichas
// de doctores ya confirmadas en otras webs de la red AQUINT. Lo marcado "PENDIENTE" está en PENDIENTES.md.

export const site = {
  name: 'Cirugía 24 Horas',
  tagline: { es: 'Cirugía en Perú: rápida de coordinar, especializada y a tu presupuesto', en: 'Surgery in Peru: specialized, timely and affordable' },
  url: 'https://cirugia24horas.com',
  legalName: 'AQUINT Health Group SAC',
  ruc: '', // PENDIENTE
  phone: '+51922728443',
  phoneDisplay: '+51 922 728 443',
  whatsapp: '51922728443',
  email: 'informes@cirugia24horas.com',
  address: 'Av. Javier Prado Este 1510',
  district: 'San Isidro',
  city: 'Lima',
  postalCode: '15036',
  geo: { lat: -12.0897, lng: -77.0169 }, // aproximado de Av. Javier Prado Este 1510 (PENDIENTE confirmar en Maps)
  // Horario publicado en la web actual (BUILD §1). Las urgencias se atienden en Clínica Santa Lucía.
  hours: { es: 'Coordinación: lunes a viernes, 9:00 a 22:00 (hora de Lima, GMT-5)', en: 'Coordination: Monday to Friday, 9 am to 10 pm (Lima time, GMT-5)' },
  ga4Id: 'G-MMXB98W10Y',
  adsId: 'AW-18515905540',
  // Etiquetas de conversión de Ads (PENDIENTE: el cliente debe pasarlas). Vacías = solo se envía el evento GA4.
  adsLabels: { whatsapp: '', call: '', quote: '' } as Record<string, string>,
  youtube: { id: 'LEIAXeFVYjE', title: 'Cirugía 24 Horas · coordinación quirúrgica en Lima' },
  financing: { name: 'Salud Pay', url: 'https://saludpay.com.pe/' },
  /** Tipo de cambio referencial pedido por el cliente el 18-oct-2026: US$ 1 = S/ 3.50. */
  fx: { usd: 3.5, date: '2026-10-18' },
  reviewer: 'dr-julio-atencio-cruz',
};

export const isFilled = (v?: string | null) => !!v && v.trim() !== '';

/** Title SEO: agrega " | Cirugía 24 Horas" solo si el total cabe en 60 caracteres. */
export const fitTitle = (base: string) => (base.length + 21 <= 60 ? `${base} | Cirugía 24 Horas` : base);
/** Meta description: máximo 160 caracteres, cortando en palabra. */
export const fitDesc = (t: string) => (t.length <= 160 ? t : t.slice(0, 157).replace(/\s+\S*$/, '') + '…');

export type Lang = 'es' | 'en';

export const toUsd = (pen: number) => Math.round(pen / site.fx.usd);
const fmt = (n: number) => n.toLocaleString('en-US');
// Espacio no separable: "S/ 2,500" nunca se parte en dos líneas.
export const pen = (n: number) => `S/ ${fmt(n)}`;
export const usd = (n: number) => `US$ ${fmt(toUsd(n))}`;
/** Precio en las dos monedas: en ES primero soles, en EN primero dólares. */
export const both = (n: number, lang: Lang) => (lang === 'es' ? `${pen(n)} (≈ ${usd(n)})` : `${usd(n)} (${pen(n)})`);

export const waLink = (msg?: string) => `https://wa.me/${site.whatsapp}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;
export const telLink = () => `tel:${site.phone}`;

export type Clinic = {
  id: string;
  name: string;
  level: { es: string; en: string };
  district: string;
  profile: { es: string; en: string };
  fit: { es: string; en: string };
  bullets: { es: string[]; en: string[] };
  photo?: string;
  main: boolean;
};

/** Las 5 sedes de la red (orden: de menor a mayor costo) y las sedes especializadas que aparecen en algunas tablas. */
export const clinics: Clinic[] = [
  {
    id: 'raimondi', name: 'Clínica Raimondi', main: true, district: 'La Victoria', photo: '/img/clinicas/raimondi.webp',
    level: { es: 'Costo accesible', en: 'Low-cost' },
    profile: { es: 'Cirugías esenciales con seguridad clínica al menor costo de la red.', en: 'Essential surgery with clinical safety at the lowest cost in the network.' },
    fit: { es: 'Tu cirugía es de complejidad estándar y priorizas el costo dentro de un entorno seguro.', en: 'Your surgery is of standard complexity and cost is your priority, in a safe setting.' },
    bullets: {
      es: ['Cirujanos certificados con experiencia clínica', 'Quirófanos para procedimientos de baja y media complejidad', 'Hospitalización corta', 'Sin sobrecostos por servicios no clínicos'],
      en: ['Board-certified surgeons with clinical experience', 'Operating rooms for low and medium complexity procedures', 'Short hospital stay', 'No surcharges for non-clinical services'],
    },
  },
  {
    id: 'santa-lucia', name: 'Clínica Santa Lucía', main: true, district: 'San Borja', photo: '/img/clinicas/santa-lucia.webp',
    level: { es: 'Tiempo de respuesta', en: 'Shortest waiting time' },
    profile: { es: 'Coordinación quirúrgica en menos de 24 horas: evaluación y operación el mismo día cuando el caso lo permite.', en: 'Surgical coordination in under 24 hours: evaluation and surgery on the same day when the case allows it.' },
    fit: { es: 'Tienes dolor agudo, una urgencia clínica o no puedes esperar agendas tradicionales.', en: 'You have acute pain, an urgent condition or cannot wait for traditional schedules.' },
    bullets: {
      es: ['Atención de urgencias', 'Sala quirúrgica con disponibilidad continua', 'Equipo médico de respuesta sin demora', 'Coordinación sin listas de espera'],
      en: ['Emergency care', 'Operating room with continuous availability', 'Medical team that responds without delay', 'No waiting lists'],
    },
  },
  {
    id: 'gastroenterologica', name: 'Clínica Gastroenterológica', main: true, district: 'San Isidro', photo: '/img/clinicas/gastroenterologica.webp',
    level: { es: 'Especialización técnica', en: 'Technical specialization' },
    profile: { es: 'Quirófanos con tecnología avanzada y mayor capacidad para procedimientos técnicos complejos.', en: 'Operating rooms with advanced technology for complex technical procedures.' },
    fit: { es: 'Tu cirugía requiere mayor precisión técnica o respaldo tecnológico superior.', en: 'Your surgery needs greater technical precision or advanced technology.' },
    bullets: {
      es: ['Equipamiento quirúrgico de última generación', 'Precisión técnica en procedimientos especializados', 'Atiende varias especialidades quirúrgicas', 'Áreas postquirúrgicas dedicadas'],
      en: ['State-of-the-art surgical equipment', 'Technical precision in specialized procedures', 'Several surgical specialties', 'Dedicated post-operative areas'],
    },
  },
  {
    id: 'higuereta', name: 'Clínica Higuereta', main: true, district: 'Surco', photo: '/img/clinicas/higuereta.webp',
    level: { es: 'UCI y comodidad', en: 'ICU and comfort' },
    profile: { es: 'Respaldo clínico institucional con UCI propia, habitaciones privadas y trayectoria reconocida.', en: 'Institutional backing with its own ICU, private rooms and a recognized track record.' },
    fit: { es: 'Tienes otras enfermedades, eres adulto mayor o tu caso requiere mayor respaldo institucional.', en: 'You have other conditions, are an older adult or your case needs more institutional backing.' },
    bullets: {
      es: ['Unidad de cuidados intensivos', 'Habitación privada con espacio para acompañante', 'Trayectoria clínica reconocida en Lima', 'Atención postquirúrgica más prolongada'],
      en: ['Intensive care unit', 'Private room with space for a companion', 'Recognized clinical track record in Lima', 'Longer post-operative care available'],
    },
  },
  {
    id: 'inca', name: 'Clínica Del Inca', main: true, district: 'Miraflores', photo: '/img/clinicas/inca.webp',
    level: { es: 'Premium', en: 'Premium' },
    profile: { es: 'Infraestructura de gama alta con suites privadas, UCI completa y atención hotelera diferenciada.', en: 'High-end facilities with private suites, a full ICU and hotel-style service.' },
    fit: { es: 'Buscas la mayor comodidad durante tu cirugía y recuperación, o necesitas más privacidad.', en: 'You want maximum comfort during surgery and recovery, or need more privacy.' },
    bullets: {
      es: ['Suites privadas', 'Equipamiento médico de gama alta y torre laparoscópica 4K', 'UCI completa', 'Privacidad y discreción'],
      en: ['Private suites', 'High-end equipment and 4K laparoscopic tower', 'Full ICU', 'Privacy and discretion'],
    },
  },
  ...([
    ['urologica', 'Clínica Urológica', 'Especialidad urológica', 'Urology specialty'],
    ['traumatologica', 'Clínica Traumatológica', 'Especialidad traumatológica', 'Orthopedics specialty'],
    ['plastica', 'Clínica de Cirugía Plástica', 'Especialidad en cirugía plástica', 'Plastic surgery specialty'],
    ['gineco-novoq', 'Clínica Gineco NOVO Q', 'Especialidad ginecológica', 'Gynecology specialty'],
    ['cabeza-cuello', 'Clínica de Cabeza y Cuello', 'Especialidad en cabeza y cuello', 'Head and neck specialty'],
    ['cardiovascular', 'Clínica Cardiovascular', 'Especialidad cardiovascular', 'Cardiovascular specialty'],
    ['c24', 'Cirugía 24 Horas (coordinación directa)', 'Opción directa', 'Direct option'],
  ] as const).map(([id, name, es, en]) => ({
    id, name, main: false, district: 'Lima',
    level: { es, en }, profile: { es, en }, fit: { es: '', en: '' }, bullets: { es: [], en: [] },
  })),
];

/** Nombre de la tarjeta del WordPress → id de clínica. */
export const clinicAlias: Record<string, string> = {
  'Raimondi': 'raimondi', 'Santa Lucía': 'santa-lucia', 'Santa Lucia': 'santa-lucia', 'Gastroenterológica': 'gastroenterologica',
  'Higuereta': 'higuereta', 'Del Inca': 'inca', 'Inca': 'inca', 'Inka': 'inca', 'Urológica': 'urologica',
  'Traumatológica': 'traumatologica', 'Traumatología': 'traumatologica', 'Plástica': 'plastica', 'Clínica Plástica': 'plastica',
  'Gineco NOVO Q': 'gineco-novoq', 'Cabeza y Cuello': 'cabeza-cuello', 'Cardiovascular': 'cardiovascular', 'Cirugía 24 Horas': 'c24',
};
export const clinicById = (id: string) => clinics.find((c) => c.id === id)!;

export type Doctor = {
  slug: string;
  name: string;
  specialty?: { es: string; en: string };
  cmp?: string;
  rne?: string;
  photo: string;
  /** Especialidades (ids de catalog) donde se muestra en las páginas de procedimiento. */
  areas: string[];
  confirmed: boolean;
};

const gen = { es: 'Cirugía general', en: 'General surgery' };
const uro = { es: 'Urología', en: 'Urology' };

// Slugs = los del WordPress (/doctors/<slug>/ → 301 a /doctores/<slug>/). Los no confirmados se muestran sin datos
// de colegiatura y su ficha va con noindex hasta tener CMP/RNE y especialidad.
export const doctors: Doctor[] = [
  { slug: 'dr-julio-atencio-cruz', name: 'Dr. Julio Atencio Cruz', specialty: { es: 'Cirugía general y laparoscópica', en: 'General and laparoscopic surgery' }, cmp: '58882', rne: '30813', photo: '/img/doctores/dr-julio-atencio-cruz.webp', areas: ['cirugia-general', 'gastroenterologia', 'bariatrica', 'cirugia-plastica', 'cabeza-cuello', 'cirugia-vascular', 'ginecologia'], confirmed: true },
  { slug: 'dra-milagros-quinto', name: 'Dra. Milagros Quinto Cobeña', specialty: gen, cmp: '53588', rne: '30074', photo: '/img/doctores/dra-milagros-quinto.webp', areas: ['cirugia-general', 'gastroenterologia'], confirmed: true },
  { slug: 'dr-jorge-mozquera', name: 'Dr. Jorge Mosquera Gutiérrez', specialty: gen, cmp: '26839', rne: '11327', photo: '/img/doctores/dr-jorge-mozquera.webp', areas: ['cirugia-general', 'bariatrica'], confirmed: true },
  { slug: 'dr-alfonzo-pena', name: 'Dr. Javier Peña Crisóstomo', specialty: gen, cmp: '26805', rne: '11247', photo: '/img/doctores/dr-alfonzo-pena.webp', areas: ['cirugia-general'], confirmed: true },
  { slug: 'dr-giomar-farfan', name: 'Dr. Giomar Farfán Daza', specialty: uro, cmp: '54702', rne: '25593', photo: '/img/doctores/dr-giomar-farfan.webp', areas: ['urologia'], confirmed: true },
  { slug: 'dr-miguel-suarez', name: 'Dr. Miguel Suárez Pérez', specialty: uro, cmp: '39180', rne: '17776', photo: '/img/doctores/dr-miguel-suarez.webp', areas: ['urologia'], confirmed: true },
  { slug: 'dr-ronald-arcana', name: 'Dr. Ronald Arcana', specialty: { es: 'Gastroenterología', en: 'Gastroenterology' }, photo: '/img/doctores/dr-ronald-arcana.webp', areas: ['gastroenterologia'], confirmed: false },
  { slug: 'dr-boris-villavicencio', name: 'Dr. Boris Villavicencio', photo: '/img/doctores/dr-boris-villavicencio.webp', areas: [], confirmed: false },
  { slug: 'cesar-alvarez', name: 'Dr. César Álvarez', photo: '/img/doctores/cesar-alvarez.webp', areas: [], confirmed: false },
  { slug: 'dra-diana-escobedo', name: 'Dra. Diana Escobedo', photo: '/img/doctores/dra-diana-escobedo.webp', areas: [], confirmed: false },
];
export const doctorBySlug = (s: string) => doctors.find((d) => d.slug === s)!;
