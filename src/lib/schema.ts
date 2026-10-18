import { site, doctorBySlug, isFilled, type Lang } from '../data/site';
import type { Faq } from '../data/catalog';

export type Crumb = { name: string; href: string };
const abs = (href: string) => new URL(href, site.url).href;
export const orgId = `${site.url}/#organization`;
export const physicianId = (slug: string) => `${site.url}/doctores/${slug}/#physician`;

export function organization() {
  return {
    '@type': ['MedicalOrganization', 'MedicalBusiness'],
    '@id': orgId,
    name: site.name,
    alternateName: ['Cirugía 24 Horas Perú', 'Cirugia 24 Horas', 'Cirugía 24 Horas — Global Surgery, Peru'],
    url: `${site.url}/`,
    logo: abs('/img/logo.webp'),
    image: abs('/og.jpg'),
    telephone: site.phone,
    email: site.email,
    legalName: site.legalName,
    ...(isFilled(site.ruc) && { taxID: site.ruc }),
    address: { '@type': 'PostalAddress', streetAddress: site.address, addressLocality: site.district, addressRegion: site.city, postalCode: site.postalCode, addressCountry: 'PE' },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: [{ '@type': 'Country', name: 'Peru' }, { '@type': 'Place', name: 'Worldwide' }],
    availableLanguage: ['es', 'en'],
    currenciesAccepted: 'PEN, USD',
    priceRange: 'S/ 2,500 – S/ 16,500',
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '22:00' }],
    contactPoint: [{ '@type': 'ContactPoint', telephone: site.phone, contactType: 'customer service', availableLanguage: ['Spanish', 'English'], areaServed: 'Worldwide' }],
    sameAs: [`https://www.youtube.com/watch?v=${site.youtube.id}`],
  };
}

export function website(lang: Lang) {
  return {
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: `${site.url}/`,
    name: site.name,
    inLanguage: ['es', 'en'],
    publisher: { '@id': orgId },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${site.url}${lang === 'es' ? '/guias/' : '/en/guides/'}?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function physician(slug: string, lang: Lang) {
  const d = doctorBySlug(slug);
  return {
    '@type': 'Physician',
    '@id': physicianId(slug),
    name: d.name,
    image: abs(d.photo),
    url: abs(lang === 'es' ? `/doctores/${slug}/` : `/en/doctors/${slug}/`),
    ...(d.specialty && { medicalSpecialty: d.specialty.en }),
    memberOf: { '@id': orgId },
    ...(d.cmp && {
      identifier: [
        { '@type': 'PropertyValue', propertyID: 'CMP (Colegio Médico del Perú)', value: d.cmp },
        ...(d.rne ? [{ '@type': 'PropertyValue', propertyID: 'RNE', value: d.rne }] : []),
      ],
    }),
  };
}

export function buildSchema(o: {
  path: string;
  lang: Lang;
  title: string;
  description: string;
  type?: string; // MedicalWebPage (por defecto), CollectionPage, AboutPage, ContactPage…
  faqs?: Faq[];
  crumbs?: Crumb[];
  main?: Record<string, unknown>[];
  page?: Record<string, unknown>;
  reviewed?: boolean;
}) {
  const homeName = o.lang === 'es' ? 'Inicio' : 'Home';
  const homeHref = o.lang === 'es' ? '/' : '/en/';
  const graph: Record<string, unknown>[] = [organization(), website(o.lang)];
  const reviewer = o.reviewed !== false ? physician(site.reviewer, o.lang) : null;
  if (reviewer) graph.push(reviewer);
  graph.push({
    '@type': o.type ?? 'MedicalWebPage',
    '@id': `${abs(o.path)}#webpage`,
    url: abs(o.path),
    name: o.title,
    description: o.description,
    inLanguage: o.lang,
    isPartOf: { '@id': `${site.url}/#website` },
    publisher: { '@id': orgId },
    ...(reviewer && (o.type ?? 'MedicalWebPage') === 'MedicalWebPage' && { reviewedBy: { '@id': reviewer['@id'] }, lastReviewed: site.fx.date }),
    ...(o.main?.[0] && { mainEntity: { '@id': o.main[0]['@id'] } }),
    ...o.page,
  });
  if (o.main) graph.push(...o.main);
  if (o.faqs?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${abs(o.path)}#faq`,
      mainEntity: o.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
  }
  if (o.crumbs?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [{ name: homeName, href: homeHref }, ...o.crumbs].map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.href) })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
