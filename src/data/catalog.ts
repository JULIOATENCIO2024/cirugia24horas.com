// Catálogo de especialidades y procedimientos. El slug ES es el del WordPress actual (ya posicionado, no se cambia);
// el slug EN sigue la búsqueda internacional "[procedure] cost / abroad". `guide` = id del paquete de 20 artículos;
// `gi` = artículo de ese paquete que describe el procedimiento (0 = "qué es"; en bariátrica, el artículo propio).

export type Specialty = { id: string; es: string; en: string; slugEn: string; introEs: string; introEn: string };

export const specialties: Specialty[] = [
  { id: 'cirugia-general', es: 'Cirugía general', en: 'General surgery', slugEn: 'general-surgery',
    introEs: 'Vesícula, apéndice y hernias por laparoscopía, con cinco alternativas de clínica y precio en Lima.',
    introEn: 'Gallbladder, appendix and hernia surgery by laparoscopy, with five clinic and price options in Lima.' },
  { id: 'bariatrica', es: 'Cirugía bariátrica', en: 'Bariatric surgery', slugEn: 'bariatric-surgery',
    introEs: 'Manga gástrica y balón gástrico con evaluación, plan nutricional y seguimiento.',
    introEn: 'Gastric sleeve and gastric balloon with evaluation, nutrition plan and follow-up.' },
  { id: 'gastroenterologia', es: 'Gastroenterología', en: 'Gastroenterology', slugEn: 'gastroenterology',
    introEs: 'CPRE para cálculos en la vía biliar, con equipos especializados.',
    introEn: 'ERCP for bile duct stones, with specialized teams.' },
  { id: 'urologia', es: 'Urología', en: 'Urology', slugEn: 'urology',
    introEs: 'Cálculos renales, próstata, vasectomía, varicocele e hidrocele con urólogos colegiados.',
    introEn: 'Kidney stones, prostate, vasectomy, varicocele and hydrocele with licensed urologists.' },
  { id: 'ginecologia', es: 'Ginecología', en: 'Gynecology', slugEn: 'gynecology',
    introEs: 'Histerectomía, miomas, prolapso, embarazo ectópico y legrado.',
    introEn: 'Hysterectomy, fibroids, prolapse, ectopic pregnancy and D&C.' },
  { id: 'traumatologia', es: 'Traumatología y columna', en: 'Orthopedics and spine', slugEn: 'orthopedics',
    introEs: 'Prótesis de rodilla y cadera, fracturas, artroscopia, túnel carpiano y hernia discal.',
    introEn: 'Knee and hip replacement, fractures, arthroscopy, carpal tunnel and herniated disc.' },
  { id: 'cabeza-cuello', es: 'Cabeza y cuello', en: 'Head and neck', slugEn: 'head-and-neck',
    introEs: 'Cirugía de tiroides con evaluación especializada.',
    introEn: 'Thyroid surgery with specialized evaluation.' },
  { id: 'cirugia-vascular', es: 'Cirugía vascular', en: 'Vascular surgery', slugEn: 'vascular-surgery',
    introEs: 'Cirugía de várices en ambas piernas.',
    introEn: 'Varicose vein surgery for both legs.' },
  { id: 'cirugia-plastica', es: 'Cirugía plástica y estética', en: 'Plastic and cosmetic surgery', slugEn: 'plastic-surgery',
    introEs: 'Aumento de mamas, rinoplastia, lipoescultura y ginecomastia.',
    introEn: 'Breast augmentation, rhinoplasty, liposculpture and gynecomastia.' },
];

export type Faq = { q: string; a: string };

export type Procedure = {
  id: string; // = slug ES del WordPress
  specialty: string;
  es: string;
  en: string;
  slugEn: string;
  keywordEn: string;
  guide?: string;
  gi?: number;
  /** Nombre corto para el title cuando el completo no cabe en 60 caracteres. */
  shortEs?: string;
  /** Solo para los procedimientos sin paquete de guías (vasectomía, varicocele, hidrocele). */
  own?: { es: { about: string; how: string }; en: { about: string; how: string; faqs: Faq[] } };
};

const P = (id: string, specialty: string, es: string, en: string, slugEn: string, keywordEn: string, guide?: string, gi = 0): Procedure =>
  ({ id, specialty, es, en, slugEn, keywordEn, guide, gi });

export const procedures: Procedure[] = [
  P('vesicula', 'cirugia-general', 'Cirugía de vesícula', 'Gallbladder surgery', 'gallbladder-surgery', 'gallbladder surgery cost', 'vesicula'),
  P('apendice', 'cirugia-general', 'Cirugía de apéndice', 'Appendectomy', 'appendectomy', 'appendectomy cost', 'apendice'),
  P('cirugia-de-hernia-inguinal', 'cirugia-general', 'Cirugía de hernia inguinal laparoscópica', 'Laparoscopic inguinal hernia surgery', 'inguinal-hernia-surgery', 'inguinal hernia surgery cost', 'hernia-inguinal'),
  P('cirugia-de-hernia-inguinal-convencional-con-corte', 'cirugia-general', 'Cirugía de hernia inguinal convencional (con corte)', 'Open inguinal hernia repair', 'open-inguinal-hernia-repair', 'open hernia repair cost', 'hernia-inguinal', 10),
  P('cirugia-de-hernia-umbilical', 'cirugia-general', 'Cirugía de hernia umbilical', 'Umbilical hernia surgery', 'umbilical-hernia-surgery', 'umbilical hernia surgery cost', 'hernia-umbilical'),
  P('cirugia-laparoscopica-de-hernia-hiatal', 'cirugia-general', 'Cirugía laparoscópica de hernia hiatal', 'Laparoscopic hiatal hernia surgery', 'hiatal-hernia-surgery', 'hiatal hernia surgery cost', 'hernia-hiatal'),
  P('cirugia-de-diastasis-de-rectos', 'cirugia-general', 'Cirugía de diástasis de rectos', 'Diastasis recti surgery', 'diastasis-recti-surgery', 'diastasis recti surgery cost', 'diastasis-de-rectos'),
  P('cirugia-de-quiste-hidatidico-hepatico', 'cirugia-general', 'Cirugía de quiste hidatídico hepático', 'Hydatid liver cyst surgery', 'hydatid-liver-cyst-surgery', 'hydatid cyst surgery cost', 'quiste-hidatidico-hepatico'),
  P('manga-gastrica', 'bariatrica', 'Manga gástrica', 'Gastric sleeve', 'gastric-sleeve', 'gastric sleeve surgery cost', 'bariatrica', 10),
  P('balon-gastrico', 'bariatrica', 'Balón gástrico', 'Gastric balloon', 'gastric-balloon', 'gastric balloon cost', 'bariatrica', 12),
  P('cpre', 'gastroenterologia', 'CPRE', 'ERCP', 'ercp', 'ercp procedure cost', 'cpre'),
  P('calculos-renales', 'urologia', 'Cirugía de cálculos renales', 'Kidney stone surgery', 'kidney-stone-surgery', 'kidney stone surgery cost', 'calculos-renales'),
  P('prostata', 'urologia', 'Cirugía de próstata', 'Prostate surgery', 'prostate-surgery', 'prostate surgery cost', 'prostata'),
  {
    ...P('vasectomia', 'urologia', 'Vasectomía', 'Vasectomy', 'vasectomy', 'vasectomy cost'),
    own: {
      es: {
        about: 'La vasectomía es un procedimiento anticonceptivo masculino en el que se cortan o bloquean los conductos deferentes, que transportan los espermatozoides. El semen deja de contener espermatozoides capaces de producir un embarazo.',
        how: 'Suele ser ambulatoria y de corta duración, muchas veces con anestesia local; el paciente vuelve a casa el mismo día. No es efectiva de inmediato: se usa otro método anticonceptivo hasta que un análisis de semen confirme que ya no hay espermatozoides.',
      },
      en: {
        about: 'A vasectomy is a male contraceptive procedure in which the vas deferens, the tubes that carry sperm, are cut or blocked. Semen then no longer contains sperm able to cause a pregnancy.',
        how: 'It is usually an outpatient procedure of short duration, often under local anesthesia, and you go home the same day. It does not work right away: you use another contraceptive method until a semen analysis confirms there is no sperm.',
        faqs: [
          { q: 'What is a vasectomy?', a: 'A male contraceptive procedure in which the tubes that carry sperm (vas deferens) are cut or blocked, so semen no longer contains sperm able to cause a pregnancy.' },
          { q: 'Is a vasectomy a complicated surgery?', a: 'No. It is usually a short outpatient procedure with a low risk of complications. It is often done under local anesthesia and you can go home the same day.' },
          { q: 'Does a vasectomy affect sexual desire or erections?', a: 'It should not affect desire, erections or ejaculation. The difference is that, once a semen test confirms it, the fluid no longer carries sperm.' },
          { q: 'Does a vasectomy work right away?', a: 'No. Some sperm can remain in the tubes, so you need another contraceptive method until your doctor confirms with a semen analysis that no sperm is left.' },
          { q: 'How long is recovery after a vasectomy?', a: 'Many patients return to light activity within a few days. Avoid intense exercise, heavy lifting and sex until the specialist authorizes it.' },
        ],
      },
    },
  },
  {
    ...P('cirugia-de-varicocele', 'urologia', 'Cirugía de varicocele', 'Varicocele surgery', 'varicocele-surgery', 'varicocele surgery cost'),
    own: {
      es: {
        about: 'El varicocele es la dilatación de las venas dentro del escroto, parecida a las várices de las piernas. Puede no dar síntomas o causar dolor, pesadez y, en algunos casos, afectar la fertilidad.',
        how: 'La cirugía (varicocelectomía) se indica si hay dolor persistente, alteraciones de la fertilidad o del crecimiento testicular. La recuperación depende de la técnica; muchas personas retoman sus actividades de forma progresiva en algunas semanas.',
      },
      en: {
        about: 'A varicocele is an enlargement of the veins inside the scrotum, similar to varicose veins in the legs. It may cause no symptoms, or pain, heaviness and in some cases fertility problems.',
        how: 'Surgery (varicocelectomy) is considered for persistent pain, fertility problems or testicular growth issues. Recovery depends on the technique; many people gradually return to their activities within a few weeks.',
        faqs: [
          { q: 'What is a varicocele?', a: 'An enlargement of the veins inside the scrotum, similar to varicose veins in the legs. It may cause no symptoms or discomfort in the testicular area.' },
          { q: 'What symptoms can a varicocele cause?', a: 'Mild testicular pain, heaviness, swelling or discomfort that increases when standing or with effort. Sometimes it causes no symptoms and is found during a check-up.' },
          { q: 'Can a varicocele affect fertility?', a: 'Yes. It can affect sperm production or quality and is a common cause of male infertility. If you want children, the specialist may order a semen analysis and other tests.' },
          { q: 'When is varicocele surgery recommended?', a: 'Not every varicocele needs surgery. It may be advised for persistent pain, fertility problems, testicular growth issues or semen changes. A urologist decides after the evaluation.' },
          { q: 'What is recovery like after varicocele surgery?', a: 'It varies with the technique. Many people return to activities gradually and recover fully within a few weeks.' },
        ],
      },
    },
  },
  {
    ...P('hidrocele', 'urologia', 'Cirugía de hidrocele', 'Hydrocele surgery', 'hydrocele-surgery', 'hydrocele surgery cost'),
    own: {
      es: {
        about: 'El hidrocele es la acumulación de líquido alrededor del testículo, que produce hinchazón en el escroto. Suele no doler, pero puede causar pesadez o molestias al caminar o sentarse.',
        how: 'En adultos, si el hidrocele persiste, crece o causa molestias, el especialista puede indicar su reparación quirúrgica, que en muchos casos es ambulatoria. Después se indica reposo relativo, cuidado de la herida y evitar esfuerzos hasta el alta.',
      },
      en: {
        about: 'A hydrocele is a buildup of fluid around the testicle that causes swelling of the scrotum. It is usually painless but may cause heaviness or discomfort when walking or sitting.',
        how: 'In adults, if the hydrocele persists, grows or causes discomfort, the specialist may recommend surgical repair, often as an outpatient procedure. Afterwards: relative rest, wound care and no strenuous effort until you are cleared.',
        faqs: [
          { q: 'What is a hydrocele?', a: 'A buildup of fluid around the testicle that causes swelling of the scrotum. It can occur in babies, children or adults.' },
          { q: 'What symptoms does a hydrocele cause?', a: 'Mainly an enlarged scrotum, usually painless. It can cause heaviness or discomfort when walking, sitting or exercising.' },
          { q: 'Does a hydrocele go away on its own?', a: 'In babies, many resolve during the first year of life. In adults, a persistent, large or uncomfortable hydrocele may need evaluation and treatment.' },
          { q: 'When is hydrocele surgery recommended?', a: 'When it does not go away, grows, causes discomfort, interferes with daily life or comes with another condition such as an inguinal hernia. A specialist decides after the evaluation.' },
          { q: 'What is recovery like after surgery?', a: 'Repair is often outpatient. Afterwards you rest, may use scrotal support if advised, care for the wound and avoid physical effort until cleared.' },
        ],
      },
    },
  },
  P('cirugia-de-embarazo-ectopico', 'ginecologia', 'Cirugía de embarazo ectópico', 'Ectopic pregnancy surgery', 'ectopic-pregnancy-surgery', 'ectopic pregnancy surgery cost', 'embarazo-ectopico'),
  P('legrado-ginecologico', 'ginecologia', 'Legrado ginecológico', 'D&C (dilation and curettage)', 'd-and-c', 'd and c procedure cost', 'legrado'),
  P('cirugia-de-prolapso-uterino', 'ginecologia', 'Cirugía de prolapso uterino', 'Uterine prolapse surgery', 'uterine-prolapse-surgery', 'uterine prolapse surgery cost', 'prolapso-uterino'),
  P('histerectomia', 'ginecologia', 'Histerectomía', 'Hysterectomy', 'hysterectomy', 'hysterectomy cost', 'histerectomia'),
  P('clinica-de-miomas-uterinos', 'ginecologia', 'Cirugía de miomas uterinos', 'Uterine fibroid surgery', 'fibroid-surgery', 'fibroid removal surgery cost', 'miomas-uterinos'),
  P('protesis-de-rodilla', 'traumatologia', 'Prótesis de rodilla', 'Knee replacement', 'knee-replacement', 'knee replacement cost', 'protesis-de-rodilla'),
  P('protesis-de-cadera', 'traumatologia', 'Prótesis de cadera', 'Hip replacement', 'hip-replacement', 'hip replacement cost', 'protesis-de-cadera'),
  P('cirugia-de-fracturas', 'traumatologia', 'Cirugía de fracturas', 'Fracture surgery', 'fracture-surgery', 'fracture surgery cost', 'fracturas'),
  P('cirugia-de-artroscopia', 'traumatologia', 'Cirugía de artroscopia', 'Arthroscopy', 'arthroscopy', 'arthroscopic surgery cost', 'artroscopia'),
  P('cirugia-de-tunel-del-carpio', 'traumatologia', 'Cirugía de túnel carpiano', 'Carpal tunnel surgery', 'carpal-tunnel-surgery', 'carpal tunnel surgery cost', 'tunel-carpiano'),
  P('hernia-discal', 'traumatologia', 'Cirugía de hernia discal', 'Herniated disc surgery', 'herniated-disc-surgery', 'herniated disc surgery cost', 'hernia-discal'),
  P('cirugia-de-tiroides', 'cabeza-cuello', 'Cirugía de tiroides', 'Thyroid surgery', 'thyroid-surgery', 'thyroidectomy cost', 'tiroides'),
  P('cirugia-de-varices-bilateral', 'cirugia-vascular', 'Cirugía de várices bilateral', 'Varicose vein surgery', 'varicose-vein-surgery', 'varicose vein surgery cost', 'varices'),
  P('cirugia-de-aumento-de-mamas', 'cirugia-plastica', 'Aumento de mamas', 'Breast augmentation', 'breast-augmentation', 'breast augmentation cost', 'aumento-de-mamas'),
  P('rinoplastia', 'cirugia-plastica', 'Rinoplastia', 'Rhinoplasty', 'rhinoplasty', 'rhinoplasty cost', 'rinoplastia'),
  P('lipoescultura', 'cirugia-plastica', 'Lipoescultura', 'Liposculpture', 'liposculpture', 'liposculpture cost', 'lipoescultura'),
  P('tratamiento-de-ginecomastia', 'cirugia-plastica', 'Cirugía de ginecomastia', 'Gynecomastia surgery', 'gynecomastia-surgery', 'gynecomastia surgery cost', 'ginecomastia'),
];

const shorts: Record<string, string> = {
  'cirugia-de-hernia-inguinal': 'Hernia inguinal laparoscópica',
  'cirugia-de-hernia-inguinal-convencional-con-corte': 'Hernia inguinal con corte',
  'cirugia-laparoscopica-de-hernia-hiatal': 'Hernia hiatal laparoscópica',
  'cirugia-de-quiste-hidatidico-hepatico': 'Quiste hidatídico hepático',
};
for (const p of procedures) if (shorts[p.id]) p.shortEs = shorts[p.id];

export const procById = (id: string) => procedures.find((p) => p.id === id)!;
export const specById = (id: string) => specialties.find((s) => s.id === id)!;

/** Base EN del slug de cada paquete de guías (los slugs EN = base + sufijo del arquetipo). */
export const guideBaseEn: Record<string, string> = {
  apendice: 'appendectomy', artroscopia: 'arthroscopy', 'aumento-de-mamas': 'breast-augmentation', bariatrica: 'bariatric-surgery',
  'calculos-renales': 'kidney-stone-surgery', cpre: 'ercp', 'diastasis-de-rectos': 'diastasis-recti-surgery',
  'embarazo-ectopico': 'ectopic-pregnancy-surgery', fracturas: 'fracture-surgery', ginecomastia: 'gynecomastia-surgery',
  'hernia-discal': 'herniated-disc-surgery', 'hernia-hiatal': 'hiatal-hernia-surgery', 'hernia-inguinal': 'inguinal-hernia-surgery',
  'hernia-umbilical': 'umbilical-hernia-surgery', histerectomia: 'hysterectomy', legrado: 'd-and-c', lipoescultura: 'liposculpture',
  'miomas-uterinos': 'fibroid-surgery', 'prolapso-uterino': 'uterine-prolapse-surgery', prostata: 'prostate-surgery',
  'protesis-de-cadera': 'hip-replacement', 'protesis-de-rodilla': 'knee-replacement', 'quiste-hidatidico-hepatico': 'hydatid-liver-cyst-surgery',
  rinoplastia: 'rhinoplasty', tiroides: 'thyroid-surgery', 'tunel-carpiano': 'carpal-tunnel-surgery', varices: 'varicose-vein-surgery',
  vesicula: 'gallbladder-surgery',
};

/** Sufijo EN de cada uno de los 20 arquetipos (mismo orden que el paquete). */
export const archetypeEn = [
  'what-is-it', 'how-it-is-done', 'cost-peru', 'abroad-peru', 'am-i-a-candidate', 'risks', 'recovery', 'preparation',
  'alternatives', 'results', 'types', 'anesthesia-and-safety', 'faq', 'how-long-does-it-take', 'lima-clinics',
  'minimally-invasive', 'post-op-care', 'warning-signs', 'patient-stories', 'why-peru',
];
/** Bariátrica tiene slugs propios en ES; en EN se fijan uno a uno (mismo orden). */
export const bariatricEn = [
  'what-is-bariatric-surgery', 'types-of-bariatric-surgery', 'bariatric-surgery-cost-peru', 'bariatric-surgery-abroad-peru',
  'bariatric-surgery-am-i-a-candidate', 'bariatric-surgery-risks', 'bariatric-surgery-recovery', 'bariatric-surgery-preparation',
  'sleeve-vs-bypass-vs-balloon', 'bariatric-surgery-results', 'gastric-sleeve-guide', 'gastric-bypass-guide', 'gastric-balloon-guide',
  'bariatric-surgery-anesthesia-and-safety', 'bariatric-surgery-lima-clinics', 'laparoscopic-bariatric-surgery',
  'diet-after-bariatric-surgery', 'bariatric-surgery-warning-signs', 'bariatric-surgery-patient-stories', 'bariatric-surgery-why-peru',
];
/** Arquetipos "money" (precio, extranjeros, Lima por clínica, por qué Perú): llevan la tabla de precios S/ y US$. */
export const moneyArchetypes = new Set([2, 3, 14, 19]);
