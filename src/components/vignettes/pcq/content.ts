export type QuadrantId = 'engaged-skepticism' | 'peak-performance' | 'disconnected' | 'strained';

export interface QuadrantInfo {
  id: QuadrantId;
  label: string;
  name: string;
  // Axis ranges the quadrant covers, used when zooming in.
  x: [number, number];
  y: [number, number];
  title: string;
  /** Summary shown in the callout. `{we}` and `{pc}` are replaced with the scores. */
  summary: string;
}

// x = Performance Confidence, y = Workplace Engagement. Both axes split at the threshold.
export const THRESHOLD = 65;

export const quadrants: QuadrantInfo[] = [
  {
    id: 'engaged-skepticism',
    label: 'Engaged skepticism',
    name: 'Engaged Skepticism',
    x: [0, THRESHOLD],
    y: [THRESHOLD, 100],
    title: 'Your organization sits in the Engaged Skepticism quadrant',
    summary:
      "Employees are engaged and connected to their work (Workplace Engagement is {we}), but there's lower confidence in the organization's ability to succeed (Performance Confidence is {pc}).",
  },
  {
    id: 'peak-performance',
    label: 'Peak performance',
    name: 'Peak Performance',
    x: [THRESHOLD, 100],
    y: [THRESHOLD, 100],
    title: 'Your organization sits in the Peak Performance quadrant',
    summary:
      "Employees are engaged and connected to their work (Workplace Engagement is {we}), and there's strong confidence in the organization's ability to succeed (Performance Confidence is {pc}).",
  },
  {
    id: 'disconnected',
    label: 'Disconnected',
    name: 'Disconnected',
    x: [0, THRESHOLD],
    y: [0, THRESHOLD],
    title: 'Your organization sits in the Disconnected quadrant',
    summary:
      "Employees feel less engaged and connected to their work (Workplace Engagement is {we}), and there's lower confidence in the organization's ability to succeed (Performance Confidence is {pc}).",
  },
  {
    id: 'strained',
    label: 'Strained',
    name: 'Strained',
    x: [THRESHOLD, 100],
    y: [0, THRESHOLD],
    title: 'Your organization sits in the Strained quadrant',
    summary:
      "There's solid confidence in the organization's ability to succeed (Performance Confidence is {pc}), but employees feel less engaged and connected to their work (Workplace Engagement is {we}).",
  },
];

export const quadrantById = Object.fromEntries(quadrants.map((q) => [q.id, q])) as Record<QuadrantId, QuadrantInfo>;

export interface Point {
  x: number; // Performance Confidence
  y: number; // Workplace Engagement
}

// Where the organisation's "Overall" result lands for each quadrant, with its scores.
export const overallByQuadrant: Record<QuadrantId, Point> = {
  'engaged-skepticism': { x: 52, y: 71 },
  'peak-performance': { x: 68, y: 72 },
  disconnected: { x: 33, y: 48 },
  strained: { x: 68, y: 64 },
};

export const comparisonPoint: Point = { x: 63.5, y: 70.5 };

export interface DemographicGroup extends Point {
  id: string;
  name: string;
  color: string;
  /** Hidden when privacy protection is on because too few people responded. */
  smallGroup?: boolean;
}

// Kaizen colour tokens.
const c = (token: string) => `var(--color-${token})`;

export const typicalGroups: DemographicGroup[] = [
  { id: 'accounting', name: 'Accounting', x: 12.5, y: 7.5, color: c('green-600') },
  { id: 'brand', name: 'Brand', x: 0.5, y: 55, color: c('yellow-500') },
  { id: 'cloud', name: 'Cloud services', x: 18.5, y: 43, color: c('orange-500') },
  { id: 'company', name: 'Finance', x: 77, y: 61, color: c('red-500'), smallGroup: true },
  { id: 'data-science', name: 'Data Science', x: 62, y: 70, color: c('green-400') },
  { id: 'global', name: 'Sales', x: 0.5, y: 21, color: c('red-600'), smallGroup: true },
  { id: 'hr', name: 'HR & Talent', x: 82, y: 84, color: c('yellow-500') },
  { id: 'infrastructure', name: 'Infrastructure', x: 72, y: 88, color: c('orange-400') },
  { id: 'legal', name: 'Legal', x: 86, y: 46, color: c('blue-300') },
  { id: 'marketing', name: 'Marketing', x: 0.5, y: 7.5, color: c('blue-400'), smallGroup: true },
  { id: 'product', name: 'Product', x: 24, y: 78, color: c('purple-300') },
  { id: 'support', name: 'Support', x: 89, y: 37, color: c('red-300') },
];

export type DemographicId = 'manager' | 'department' | 'region' | 'performance';

export const demographics: { id: DemographicId; label: string }[] = [
  { id: 'manager', label: 'Manager' },
  { id: 'department', label: 'Department' },
  { id: 'region', label: 'Region' },
  { id: 'performance', label: 'Performance' },
];

const managerGroups: DemographicGroup[] = [
  { id: 'manager-priya', name: 'Priya Nair', x: 81, y: 86, color: c('green-600') },
  { id: 'manager-tom', name: 'Tom Becker', x: 74, y: 69, color: c('yellow-500') },
  { id: 'manager-aiko', name: 'Aiko Tanaka', x: 58, y: 78, color: c('orange-500') },
  { id: 'manager-luis', name: 'Luis Ortega', x: 66, y: 52, color: c('red-500') },
  { id: 'manager-hannah', name: 'Hannah Cole', x: 29, y: 74, color: c('blue-400') },
  { id: 'manager-sam', name: 'Sam Okafor', x: 88, y: 58, color: c('purple-300') },
  { id: 'manager-mia', name: 'Mia Lindqvist', x: 41, y: 38, color: c('green-400') },
  { id: 'manager-daniel', name: 'Daniel Reyes', x: 14, y: 27, color: c('red-300'), smallGroup: true },
];

const regionGroups: DemographicGroup[] = [
  { id: 'region-anz', name: 'Australia & New Zealand', x: 79, y: 80, color: c('green-600') },
  { id: 'region-na', name: 'North America', x: 70, y: 66, color: c('blue-400') },
  { id: 'region-uk', name: 'UK & Ireland', x: 56, y: 74, color: c('yellow-500') },
  { id: 'region-emea', name: 'Europe, Middle East & Africa', x: 63, y: 49, color: c('orange-500') },
  { id: 'region-apac', name: 'Asia Pacific', x: 84, y: 55, color: c('purple-300') },
  { id: 'region-latam', name: 'Latin America', x: 31, y: 42, color: c('red-500'), smallGroup: true },
];

const performanceGroups: DemographicGroup[] = [
  { id: 'performance-top', name: 'Top performers', x: 90, y: 88, color: c('green-600') },
  { id: 'performance-strong', name: 'Strong performers', x: 77, y: 73, color: c('green-400') },
  { id: 'performance-solid', name: 'Solid contributors', x: 62, y: 58, color: c('yellow-500') },
  { id: 'performance-developing', name: 'Developing', x: 46, y: 41, color: c('orange-500') },
  { id: 'performance-support', name: 'Needs support', x: 22, y: 24, color: c('red-500'), smallGroup: true },
];

export const groupsByDemographic: Record<DemographicId, DemographicGroup[]> = {
  manager: managerGroups,
  department: typicalGroups,
  region: regionGroups,
  performance: performanceGroups,
};

// Deterministic spread of groups so the stress test looks the same on every load.
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const stressColors = ['green-400', 'green-600', 'yellow-500', 'orange-400', 'orange-500', 'red-300', 'red-500', 'blue-300', 'blue-400', 'purple-300', 'purple-400'];

const departmentNames = [
  'Accounting',
  'Analytics',
  'Brand',
  'Business Operations',
  'Cloud Services',
  'Communications',
  'Compliance',
  'Corporate Strategy',
  'Customer Success',
  'Data Science',
  'Design',
  'Engineering',
  'Facilities',
  'Finance',
  'Governance',
  'HR & Talent',
  'Infrastructure',
  'Internal Audit',
  'IT Support',
  'Learning & Development',
  'Legal',
  'Marketing',
  'Partnerships',
  'Payroll',
  'People Operations',
  'Procurement',
  'Product',
  'Product Marketing',
  'Project Management Office',
  'Public Relations',
  'Quality Assurance',
  'Recruitment',
  'Research',
  'Risk',
  'Sales',
  'Security',
  'Strategy',
  'Supply Chain',
  'Treasury',
  'UX Research',
];

// Seeded shuffle, so the stress test uses a varied but stable set of department names.
const shuffledDepartments = (() => {
  const random = seeded(1058);
  const names = [...departmentNames];
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [names[i], names[j]] = [names[j], names[i]];
  }
  return names;
})();

export const stressGroups: DemographicGroup[] = (() => {
  const random = seeded(4266);
  return shuffledDepartments.slice(0, 36).map((name, i) => ({
    id: `department-${i}`,
    name,
    x: Math.round(random() * 1000) / 10,
    y: Math.round(random() * 1000) / 10,
    color: c(stressColors[i % stressColors.length]),
    smallGroup: i % 7 === 3,
  }));
})();

export type PresetId = 'real' | 'typical' | 'none' | 'privacy' | 'stress' | 'error';

export const presets: { id: PresetId; label: string }[] = [
  { id: 'real', label: 'Default' },
  { id: 'typical', label: 'Typical demographic' },
  { id: 'none', label: 'No groups' },
  { id: 'privacy', label: 'Privacy protected' },
  { id: 'stress', label: 'Stress test' },
];

export const overallScores: Record<QuadrantId, { we: string; pc: string }> = {
  'engaged-skepticism': { we: '71%', pc: '52%' },
  'peak-performance': { we: '72%', pc: '68%' },
  disconnected: { we: '48% favorable', pc: '33% favorable' },
  strained: { we: '64%', pc: '68%' },
};

export const MIN_RESPONSES = 5;

// What Coach says when asked to explore the key survey themes, per quadrant.
export const coachThemes: Record<QuadrantId, string[]> = {
  'peak-performance': [
    'People feel connected to their work and recommend the company as a place to work.',
    'Confidence in leaders and in the strategy is a clear strength.',
    'Watch for pockets of lower engagement in a few departments.',
  ],
  'engaged-skepticism': [
    'Employees care about their work but doubt the organization can deliver on its goals.',
    'Questions about direction and leadership communication score lowest.',
    'Closing the confidence gap is the fastest route to Peak Performance.',
  ],
  disconnected: [
    'Both engagement and confidence sit below the threshold.',
    'Recognition and growth opportunities are the lowest-scoring areas.',
    'Start with the departments furthest from the threshold to build momentum.',
  ],
  strained: [
    'Employees trust where the organization is heading, but feel stretched day to day.',
    'Workload and manager support are the biggest drags on engagement.',
    'Easing workload pressure should lift engagement fastest.',
  ],
};

export const coachPrompt = 'Explore key survey themes';

export const coachFollowUps = [
  'Good question. The biggest gap between this survey and your H1 2026 comparison is Performance Confidence. I can break that down by department if you like.',
  'I would start with the departments sitting closest to the threshold, since small improvements there move them into the next quadrant.',
  'Happy to help. I can draft a short summary for your leadership team or suggest actions for the lowest-scoring areas.',
];

// The follow-up typed in the case study walkthrough, and Coach's answer to it.
export const coachWalkthroughQuestion = 'Which departments are scoring lower on Engagement and why?';

export const coachWalkthroughAnswer =
  'Three departments are scoring lowest on Engagement: **Accounting (8%)**, **Marketing (8%)** and **Sales (21%)**.\n\nWhat is driving it:\n• Recognition and career growth are the lowest-scoring questions in all three groups.\n• Marketing and Sales report the heaviest workloads, which is pulling down energy and connection to the work.\n• Accounting scores lowest on seeing a motivating future at the company.\n\nI would start with Accounting and Marketing, since they sit furthest from the threshold. I can draft an action plan for either.';
