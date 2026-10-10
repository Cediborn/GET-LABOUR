/**
 * Single source of truth for company data, navigation and service content.
 * Only verified information (from the company's existing website) is stored here.
 */

export const site = {
  name: 'GET Labour Company Limited',
  shortName: 'GLCL',
  slogan: 'Your Complete Labour Solution.',
  founded: 'July 2013',
  description:
    'GLCL supplies skilled labour, general labour, equipment operators and supervisory support to businesses in Ghana’s maritime, port, logistics and industrial sectors. Based in the Tema Port enclave.',
  email: 'getlabourcompanylimited@gmail.com',
  phones: [
    { display: '+233 30 396 1288', tel: '+233303961288', label: 'Office line' },
    { display: '+233 55 800 7876', tel: '+233558007876', label: 'Mobile line' },
  ],
  address: {
    line: 'Tema Meridian Road, around Tema Community 2',
    city: 'Tema',
    region: 'Greater Accra Region, Ghana',
    context: 'Near the Tema Port enclave',
    mapUrl: 'https://maps.app.goo.gl/DQjTvmnAtJSaEqmM9',
  },
  social: [
    { label: 'X (Twitter)', url: 'https://x.com/glcl62025' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/getlabour-2025i' },
  ],
  url: 'https://cediborn.github.io/LA-MUSA',
} as const;

/** Relative path helper that respects the GitHub Pages base path. */
export const url = (path: string): string => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (path === '/') return `${base}/`;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
};

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Services', href: '/services/' },
  { label: 'Careers', href: '/careers/' },
  { label: 'Contact', href: '/contact/' },
] as const;

export type ServiceSlug =
  | 'skilled-labour'
  | 'general-labour'
  | 'equipment-operators'
  | 'supervision';

export type Service = {
  slug: ServiceSlug;
  navTitle: string;
  title: string;
  short: string;
  intro: string;
  categories: { name: string; detail: string }[];
  operations: string[];
  requestChecklist: string[];
};

export const services: Service[] = [
  {
    slug: 'skilled-labour',
    navTitle: 'Skilled Labour',
    title: 'Skilled Labour',
    short:
      'Experienced trade and operational staff — drivers, clerks and other skilled roles — matched to your requirements after vetting.',
    intro:
      'GLCL provides skilled workers for trade, clerical and operational roles around the port and industrial environment. Workers are matched against the requirements you give us, and each placement is arranged directly with your team so that experience, availability and working arrangements are agreed before work begins.',
    categories: [
      {
        name: 'Drivers & heavy-duty drivers',
        detail: 'Drivers for haulage support, site movement and related duties.',
      },
      {
        name: 'Tally clerks',
        detail: 'Cargo tallying, counting and documentation support on site.',
      },
      {
        name: 'Record clerks',
        detail: 'Record keeping and paperwork support for operational teams.',
      },
      {
        name: 'Delivery clerks',
        detail: 'Delivery documentation, checking and handover support.',
      },
      {
        name: 'Foremen',
        detail: 'Working leaders who organise and guide labour gangs on the ground.',
      },
      {
        name: 'Supervisors',
        detail: 'On-site supervision of allocated workers and day-to-day tasks.',
      },
    ],
    operations: [
      'Container and cargo handling operations',
      'Terminal and yard support tasks',
      'Warehouse and depot operations',
      'Delivery and dispatch support',
      'Documentation and tallying duties on site',
    ],
    requestChecklist: [
      'The role or trade you need filled',
      'The number of workers required',
      'Where and when the work takes place',
      'Any equipment, certification or experience requirements',
      'Shift pattern or expected duration of the work',
    ],
  },
  {
    slug: 'general-labour',
    navTitle: 'General Labour',
    title: 'General Labour',
    short:
      'Dependable gangs for onboard, ashore, transit and topside work — the manpower behind cargo and vessel operations.',
    intro:
      'General labour is the backbone of day-to-day port and vessel work. GLCL supplies gangs and individual workers for onboard, ashore, transit and topside activities, as well as general manpower for sites, warehouses and industrial operations. Gangs are organised with the numbers and supervision your operation requires.',
    categories: [
      {
        name: 'Onboard gangs',
        detail: 'Workers engaged aboard vessels for cargo and hold work.',
      },
      {
        name: 'Ashore gangs',
        detail: 'Shore-side labour supporting cargo handling and terminal activity.',
      },
      {
        name: 'Transit gangs',
        detail: 'Labour for cargo in transit, including loading, discharge and transfer tasks.',
      },
      {
        name: 'Topside men',
        detail: 'Workers for topside duties on vessels as required by the operation.',
      },
      {
        name: 'General manpower',
        detail: 'Flexible labour for warehouses, sites and industrial facilities.',
      },
    ],
    operations: [
      'Vessel cargo work and hold preparation',
      'Loading and discharge support',
      'Cargo transfer and transit handling',
      'Warehouse, depot and site manpower',
      'General clean-up, stacking and manual handling tasks',
    ],
    requestChecklist: [
      'The type of work (onboard, ashore, transit, topside or general)',
      'How many workers you need',
      'Start date and expected duration',
      'Work location and reporting point',
      'Any site safety induction or PPE requirements',
    ],
  },
  {
    slug: 'equipment-operators',
    navTitle: 'Equipment Operators',
    title: 'Equipment Operators',
    short:
      'Forklift, reach stacker and crane operators for terminal, yard and industrial equipment work.',
    intro:
      'GLCL supplies operators for the equipment that keeps cargo moving — forklifts, reach stackers and cranes. When you request an operator, tell us the equipment type, the environment it will be used in and the experience level you need, so the placement can be matched properly.',
    categories: [
      {
        name: 'Forklift operators',
        detail: 'Operators for container and warehouse forklift work.',
      },
      {
        name: 'Reach stacker operators',
        detail: 'Operators for container stacking and yard handling with reach stackers.',
      },
      {
        name: 'Crane operators',
        detail: 'Operators for crane work in port and industrial settings.',
      },
    ],
    operations: [
      'Container stacking and yard handling',
      'Warehouse and depot equipment work',
      'Loading, discharge and transfer support',
      'Industrial site equipment operations',
    ],
    requestChecklist: [
      'The equipment type (forklift, reach stacker or crane)',
      'The environment it will be used in',
      'Any certification or experience level you require',
      'Shift pattern and duration of the assignment',
      'Number of operators needed',
    ],
  },
  {
    slug: 'supervision',
    navTitle: 'Supervision & Support',
    title: 'Supervision & Operational Support',
    short:
      'Supervisors, foremen and clerical support who keep allocated labour organised, accounted for and working safely.',
    intro:
      'Allocated labour works best when it is properly supervised. GLCL provides supervisors, foremen and support personnel who organise gangs, keep records, liaise with your site team and make sure allocated workers are where they are needed. This applies to both short assignments and ongoing arrangements.',
    categories: [
      {
        name: 'Supervisors',
        detail: 'On-site supervision of allocated workers, tasks and shift arrangements.',
      },
      {
        name: 'Foremen',
        detail: 'Working leaders who organise gangs and handle ground-level coordination.',
      },
      {
        name: 'Tally & record clerks',
        detail: 'Counting, tallying and record keeping for cargo operations.',
      },
      {
        name: 'Operational support staff',
        detail: 'Personnel supporting allocation, documentation and day-to-day coordination.',
      },
    ],
    operations: [
      'Gang supervision on vessels and ashore',
      'Headcount, allocation and record keeping',
      'Liaison between client site teams and allocated workers',
      'Tallying and documentation duties',
      'Shift coordination for labour operations',
    ],
    requestChecklist: [
      'The supervisory or support role you need',
      'The size of the team being supervised',
      'Site location and working hours',
      'Duration of the assignment',
      'Any reporting or documentation requirements',
    ],
  },
];

export const labourCategories = [
  { value: 'skilled', label: 'Skilled labour', slug: 'skilled-labour' as ServiceSlug },
  { value: 'general', label: 'General / non-skilled labour', slug: 'general-labour' as ServiceSlug },
  { value: 'equipment', label: 'Equipment operators', slug: 'equipment-operators' as ServiceSlug },
  { value: 'supervision', label: 'Supervision & operational support', slug: 'supervision' as ServiceSlug },
  { value: 'other', label: 'Other / not sure yet', slug: null },
];

/** Specific roles from the company's existing request form. */
export const skilledRoles = [
  'Drivers / heavy-duty drivers',
  'Forklift operators',
  'Reach stacker operators',
  'Crane operators',
  'Tally clerks',
  'Record clerks',
  'Delivery clerks',
  'Foremen',
  'Supervisors',
];

export const gangTypes = [
  'Onboard gangs',
  'Ashore gangs',
  'Transit gangs',
  'Topside men',
  'General manpower',
];

export const applyCategories = [
  { value: 'general', label: 'General labour' },
  { value: 'skilled', label: 'Skilled labour' },
  { value: 'equipment', label: 'Equipment operator' },
  { value: 'supervision', label: 'Supervisory / support role' },
];

export const equipmentTypes = ['Forklift', 'Reach stacker', 'Crane', 'Other equipment'];

export const faqs = [
  {
    q: 'What types of labour does GLCL provide?',
    a: 'GLCL provides four main categories: skilled labour, general (non-skilled) labour, equipment operators, and supervisors and operational support personnel. General labour includes onboard, ashore, transit and topside gangs. Equipment operators include forklift, reach stacker and crane operators.',
  },
  {
    q: 'How do I request workers?',
    a: 'Fill in the labour request form on this website with your requirements, or call us on +233 30 396 1288 or +233 55 800 7876. You can also email getlabourcompanylimited@gmail.com. We will discuss availability and arrangements with you directly.',
  },
  {
    q: 'What information should I include in a labour request?',
    a: 'The type of work, how many workers you need, the location, when you need them and for how long. If specific equipment experience, certifications or site safety requirements are involved, include those as well. The more detail you give, the better the match can be.',
  },
  {
    q: 'How can I apply for work with GLCL?',
    a: 'Submit the employment application form on this website with your details, preferred work category and a short summary of your experience. You can also contact us by phone or email. Applying registers your interest — it does not guarantee placement.',
  },
  {
    q: 'Does submitting an application guarantee employment?',
    a: 'No. Placement depends on the company’s operational requirements at the time, client demand and whether your profile suits a specific assignment. Registering your interest keeps your details available for suitable opportunities.',
  },
  {
    q: 'Where is GLCL located?',
    a: 'GLCL is located on Tema Meridian Road, around Tema Community 2 in Tema, Ghana, within the Tema Port enclave.',
  },
  {
    q: 'How can I contact the company?',
    a: 'Call +233 30 396 1288 or +233 55 800 7876, or email getlabourcompanylimited@gmail.com. Contact details are also on the contact page with a map link to the Tema office area.',
  },
];

/**
 * EmailJS configuration — carried over from the company's existing website
 * (getlabour.org/GLCL 2.0/request.html), where these values were already
 * published in client-side code. EmailJS public keys are designed to be public.
 * If delivery fails (for example, if the key is later restricted to another
 * domain), the forms fall back to a pre-filled email to the company address.
 */
export const emailjs = {
  publicKey: 'gv1fYs6lrLGrdHKq2',
  serviceId: 'service_3ntf09m',
  templateId: 'template_0i0g24f',
} as const;
