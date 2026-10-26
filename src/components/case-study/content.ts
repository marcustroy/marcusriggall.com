import type { DecisionStory } from '@/components/vignettes/shared/DecisionStories'

export interface CaseStudyContent {
  /** URL segment, e.g. "heatmap-survey-comparisons" */
  slug: string
  /** Which tinted frame (see Stage) the interactive UI sits in. */
  stageId: string
  projectName: string
  headline: string
  body: string
  decisionStories: DecisionStory[]
}

export const caseStudies: Record<string, CaseStudyContent> = {
  'heatmap-survey-comparisons': {
    slug: 'heatmap-survey-comparisons',
    stageId: 'heatmap-comparisons',
    projectName: 'Heatmap Survey Comparisons',
    headline:
      'Comparisons across surveys help customers understand how results change over time, across teams, and against benchmarks in a single view',
    body: '',
    decisionStories: [],
  },
  'performance-culture-quadrant': {
    slug: 'performance-culture-quadrant',
    stageId: 'culture-quadrant',
    projectName: 'Performance Culture Quadrant',
    headline:
      'Connecting engagement and performance confidence to help customers understand their culture and identify the path to Peak Performance',
    body: '',
    decisionStories: [],
  },
  'sensitive-comments-management': {
    slug: 'sensitive-comments-management',
    stageId: 'sensitive-comments',
    projectName: 'Sensitive Comments Management',
    headline: 'Leveraging AI to identify sensitive comments to be reviewed and redacted',
    body: '',
    decisionStories: [],
  },
}
