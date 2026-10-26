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
    body: `The Heatmap gives customers a high-level comparative view of their survey results, but it was the one report that couldn't compare against a previous survey. I designed survey comparisons so customers can see what is changing without leaving the Heatmap.`,
    decisionStories: [
      {
        id: 'customer-problem',
        title: 'Customer problem',
        story: `Customers could compare results to a previous survey in every report except the Heatmap. The Heatmap inherently provides a high-level comparative view, but customers identify change over time.

Our research showed that when customers use the Heatmap, their intent is to build a picture of what is happening and why. They want to answer questions like:
• Is this group changing over time?
• How does their experience compare with the rest of the company?`,
      },
      {
        id: 'strategic-alignment',
        title: 'Strategic alignment',
        story: `The work supported two strategic priorities;

Deliver new, unique and valued workforce insights: giving customers the insights and data they need to drive decision making and action.

Improve the admin experience for enterprises: making the experience more consistent when navigating between reports.

We defined success as:
• A reduction in feedback logged in Pendo
• The percentage of users selecting survey comparison within the first 6 months of release, accounting for lower usage outside of survey season
• An increase in Heatmap CSAT from 60%

The Heatmap is the most used report, and over the 12 months preceding this work, Pendo feedback averaged 8.6 requests per quarter, with each request averaging $62k ARR.`,

      },
    ],
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
