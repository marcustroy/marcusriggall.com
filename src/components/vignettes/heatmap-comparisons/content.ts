export interface HeatmapGroupCell {
  comparisonSurvey: number;
  thisSurvey: number;
  delta: number;
}

export interface HeatmapQuestion {
  label: string;
  cells: HeatmapGroupCell[];
}

export interface HeatmapRow {
  label: string;
  cells: HeatmapGroupCell[];
  questions: HeatmapQuestion[];
}

export interface HeatmapContent {
  groups: string[];
  responses: HeatmapGroupCell[];
  rows: HeatmapRow[];
}

const GROUPS = [
  'Customer success',
  'Design',
  'Legal',
  'Sales',
  'Finance',
  'Marketing',
  'People',
  'Product',
  'Operations',
];

// Survey questions revealed when a row is expanded, grouped by the factor they measure.
const CATEGORY_QUESTIONS: Record<string, string[]> = {
  Engagement: [
    'I would recommend this company as a great place to work',
    'I am proud to work for this company',
    'I see myself still working here in two years',
  ],
  'Alignment & Involvement': [
    'I understand how my work contributes to company goals',
    'I have a say in decisions that affect my work',
    'Leaders communicate a clear direction for the company',
  ],
  'Collaboration & Communication': [
    'People across teams work well together',
    'Information is shared openly across the company',
    'My team communicates effectively',
  ],
  Enablement: [
    'I have the tools and resources to do my job well',
    'Our processes help me get work done efficiently',
    'I have the authority to make decisions in my role',
  ],
  'Feedback & Recognition': [
    'I receive regular, useful feedback on my work',
    'My contributions are recognised',
    'Feedback I receive helps me improve',
  ],
  Innovation: [
    'We are encouraged to try new ways of doing things',
    'It is safe to take smart risks here',
    'Good ideas are acted on',
  ],
  Leadership: [
    'I have confidence in the leadership team',
    'Senior leaders act in line with our values',
    'Leaders are open and honest with employees',
  ],
  'Learning & Development': [
    'I have opportunities to learn and grow here',
    'I can see a career path for myself',
    'I get support to develop new skills',
  ],
  Management: [
    'My manager cares about my wellbeing',
    'My manager supports my development',
    'My manager sets clear expectations',
  ],
  'Service & Quality Focus': [
    'We deliver high-quality work for our customers',
    'We act on customer feedback',
    'I take pride in the quality of my work',
  ],
  'Social Connection': [
    'I feel I belong at this company',
    'I have good friends at work',
    'People here treat each other with respect',
  ],
};

const CATEGORIES = Object.keys(CATEGORY_QUESTIONS);

// Seeded so the randomised values are the same on the server and the client.
function createRandom(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = createRandom(20261023);
const randomInt = (min: number, max: number) => Math.floor(random() * (max - min + 1)) + min;

function makeCell(
  comparisonRange: [number, number],
  deltaRange: [number, number],
  [min, max] = [35, 95]
): HeatmapGroupCell {
  const comparisonSurvey = randomInt(...comparisonRange);
  const thisSurvey = Math.min(max, Math.max(min, comparisonSurvey + randomInt(...deltaRange)));
  return { comparisonSurvey, thisSurvey, delta: thisSurvey - comparisonSurvey };
}

const responses = GROUPS.map(() => makeCell([120, 840], [-40, 70], [20, 1000]));
const categoryCells = CATEGORIES.map(() => GROUPS.map(() => makeCell([52, 82], [-27, 10])));

export const heatmapContent: HeatmapContent = {
  groups: GROUPS,
  responses,
  rows: CATEGORIES.map((label, rowIndex) => ({
    label,
    cells: categoryCells[rowIndex],
    questions: CATEGORY_QUESTIONS[label].map((question) => ({
      label: question,
      cells: GROUPS.map(() => makeCell([52, 82], [-27, 10])),
    })),
  })),
};

export function formatDelta(delta: number) {
  if (delta === 0) return '0';
  return delta > 0 ? `+${delta}` : `−${Math.abs(delta)}`;
}

// Kaizen colour tokens: 500 is the darkest shade, 100 the lightest.
// Cell text is always black, so every shade must reach 4.5:1 (WCAG AA) against #000.
// Kaizen red-500 (#c93b55) only reaches 4.24:1, so the darkest red is nudged a little
// towards red-400 (#d75b6d, 5.6:1). The extra margin covers screens and colour pickers
// that render it a little darker than the sRGB value. Green-500 already passes (6.2:1)
// and is unchanged.
const RED_DARKEST = '#d75b6d';
const GREEN_STEPS = [
  { upTo: 2, token: 'green-100' },
  { upTo: 4, token: 'green-200' },
  { upTo: 6, token: 'green-300' },
  { upTo: 8, token: 'green-400' },
  { upTo: Infinity, token: 'green-500' },
];

const RED_STEPS = [
  { upTo: 4, token: 'red-100' },
  { upTo: 9, token: 'red-200' },
  { upTo: 14, token: 'red-300' },
  { upTo: 20, token: 'red-400' },
  { upTo: Infinity, token: 'red-500' },
];

export function deltaToken(delta: number) {
  if (delta === 0) return null;
  const steps = delta > 0 ? GREEN_STEPS : RED_STEPS;
  return steps.find((step) => Math.abs(delta) <= step.upTo)?.token ?? null;
}

// Stronger change, darker shade. Needs the .kaizen-scope tokens.
export function deltaColor(delta: number) {
  const token = deltaToken(delta);
  if (!token) return 'var(--color-white)';
  return token === 'red-500' ? RED_DARKEST : `var(--color-${token})`;
}
