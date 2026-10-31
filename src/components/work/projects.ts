import { STAGE_TINTS } from '../Stage';

export interface Project {
  id: string;
  title: string;
  description: string;
  href: string;
  /** Soft backdrop colour, shared with the project's preview frame and case study band. */
  tint: string;
  /** A stronger colour from the same family, for type and shapes. */
  accent: string;
  period: string;
}

// The home page's work list. Edit the title and description here; every home page layout reads from it.
const base: Omit<Project, 'tint' | 'accent' | 'period'>[] = [
  {
    id: 'culture-quadrant',
    title: 'Performance Culture Quadrant',
    description: 'Connecting Engaging Culture and Performance Confidence to help customers understand their organisations culture and identify the path to Peak Performance',
    href: '/performance-culture-quadrant',
  },
  {
    id: 'heatmap-comparisons',
    title: 'Heatmap Survey Comparisons',
    description: 'Comparisons across surveys help customers understand how results change over time and across teams in a single view',
    href: '/heatmap-survey-comparisons',
  },
  {
    id: 'prototyping',
    title: 'Design Sandbox',
    description: 'Part of the small team of designers who maintained and improved an internal repository to make AI prototyping faster and easier for designers and product managers',
    href: '/design-sandbox',
  },
  {
    id: 'sensitive-comments',
    title: 'Sensitive Comments Management',
    description: 'Leveraging AI to identify sensitive comments to be reviewed and redacted',
    href: '/sensitive-comments-management',
  },
];

const extras: Record<string, { accent: string; period: string }> = {
  'culture-quadrant': { accent: '#2A9D96', period: 'Culture Amp, 2026' },
  'heatmap-comparisons': { accent: '#C93B55', period: 'Culture Amp, 2025' },
  prototyping: { accent: '#8B5CF6', period: 'Culture Amp, 2025-2026' },
  'sensitive-comments': { accent: '#3F9A86', period: 'Culture Amp, 2026' },
};

export const projects: Project[] = base.map((item) => ({
  ...item,
  tint: item.id === 'prototyping' ? '#F1EBFE' : STAGE_TINTS[item.id],
  ...extras[item.id],
}));
