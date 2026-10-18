// llms.txt (GEO): resumen en Markdown para asistentes de IA, con la tabla de precios "desde" en S/ y US$.
import type { APIRoute } from 'astro';
import { site, pen, usd } from '../data/site';
import { procedures, specialties, minPrice, maxPrice, url, pages } from '../lib/data';

export const GET: APIRoute = () => {
  const abs = (p: string) => `${site.url}${p}`;
  const lines = [
    `# ${site.name}`,
    '',
    `> Surgical coordination marketplace in Lima, Peru (Spanish and English). The same surgical team operates at five partner clinics with different price levels: Clínica Raimondi (low-cost), Clínica Santa Lucía (shortest waiting time), Clínica Gastroenterológica (specialized), Clínica Higuereta (ICU) and Clínica Del Inca (premium). Free initial evaluation, fixed written quote, support for international patients. Prices are published in Peruvian soles; US dollar amounts use US$ 1 = S/ ${site.fx.usd.toFixed(2)} (${site.fx.date}).`,
    '',
    `Contact: WhatsApp ${site.phoneDisplay} · ${site.email} · ${site.address}, ${site.district}, Lima, Peru. Medical reviewer: Dr. Julio Atencio Cruz (CMP 58882, RNE 30813).`,
    '',
    '## Key pages',
    `- [Prices by clinic (EN)](${abs(pages.prices.en)}) · [Precios (ES)](${abs(pages.prices.es)})`,
    `- [International patients](${abs(pages.international.en)}) · [Pacientes internacionales](${abs(pages.international.es)})`,
    `- [How it works](${abs(pages.how.en)}) · [Clinics](${abs(pages.clinics.en)}) · [Doctors](${abs(pages.doctors.en)}) · [Guides](${abs(pages.guides.en)})`,
    '',
  ];
  for (const s of specialties) {
    lines.push(`## ${s.en} / ${s.es}`);
    for (const p of procedures.filter((x) => x.specialty === s.id)) {
      const lo = minPrice(p.id), hi = maxPrice(p.id);
      lines.push(`- [${p.en}](${abs(url.proc(p, 'en'))}) / [${p.es}](${abs(url.proc(p, 'es'))}): from ${usd(lo)} (${pen(lo)}) to ${usd(hi)} (${pen(hi)})`);
    }
    lines.push('');
  }
  lines.push('## Notes', '- Prices are for reference and are confirmed in writing after the medical evaluation.', '- The specialist decides the surgical indication; results are not guaranteed.', '');
  return new Response(lines.join('\n').replace(/ /g, ' '), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
