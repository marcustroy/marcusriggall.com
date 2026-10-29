import type { DecisionStory } from '@/components/vignettes/shared/DecisionStories'

export interface CaseStudyContent {
  /** URL segment, e.g. "heatmap-survey-comparisons" */
  slug: string
  /** Which tinted frame (see Stage) the interactive UI sits in. */
  stageId: string
  /** Give the interactive UI a wider column, with a narrower write-up beside it. */
  wideUi?: boolean
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
    body: `Engagement used to be the headline measure of a survey, but customers were searching for a more holistic view of their organisation. The Performance Culture Quadrant combines the two outcomes that now matter most, Engaging Culture and Performance Confidence, into one view giving customers a holistic picture of the employee experience in their organization.

I led product design for the release of the Performance Culture Quadrant, partnering with People Science, Product, Product Marketing, Engineering and Data Science to transform people science research into a scaleable and useable experience.

[The Performance Culture Quadrant](https://www.cultureamp.com/platform/engage/performance-culture-quadrant) and [the science behind it](https://www.cultureamp.com/blog/science-behind-pcq)
`,
    decisionStories: [
      {
        id: 'new-way-to-understand-results',
        title: 'A new way to understand results',
        story: `The Performance Culture Diagnostic opens up a new way to understand survey results, and it changes what customers should be looking at
• Traditional engagement is no longer the key outcome. The focus is on Performance Confidence and Engaging Culture to understand employee sentiment in the organisations future and day-to-day experience at work.
• Scores are plotted on a quadrant that allows customers to understand how their organisation is scoring on both outcomes, allowing organisations to identify groups with an outlying experience

The Performance Culture Quadrant is how customers view and analysis the shift from surveying to measure only Engagement, to measuring Engagement and Performance Confidence,`,
      },
      {
        id: 'approach',
        title: 'Approach',
        story: `We introduced the Performance Culture Quadrant in phases to to provide value to customers early.

Initial design concepts were created in Figma to allow for ease of collaboration, but quickly moved to prototyping using Claude Code and the [Design Sandbox](/design-sandbox) to create an experience that used real survey data while providing an experience that felt like using the Culture Amp Product.

Leveraging AI allowed prototypes to be created and iterated on quickly, with building on top of the existing codebase allowing for testing an experience that felt real for participants.`,
      }
    ],
  },
  'sensitive-comments-management': {
    slug: 'sensitive-comments-management',
    stageId: 'sensitive-comments',
    wideUi: true,
    projectName: 'Sensitive Comments Management',
    headline: 'Leveraging AI to identify sensitive comments to be reviewed and redacted',
    body: 'Case study in progress',
    decisionStories: [],
  },
}
