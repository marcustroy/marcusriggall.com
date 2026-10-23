export interface FeedbackSource {
  quote: string;
  reviewer: string;
  reviewerRole: string;
  avatarUrl?: string;
}

export interface HighlightItem {
  type: 'highlight' | 'opportunity';
  summary: string;
  sources: FeedbackSource[];
}

import { DecisionStory } from '../shared/DecisionStories';

interface AIHighlightsContent {
  // Left panel content
  projectName: string;
  headline: string;
  body: string;
  keyResult?: string;
  decisionStories: DecisionStory[];

  // Right panel content (fictional employee review)
  employee: {
    name: string;
    role: string;
    initials: string;
    avatarColor: string;
    avatarUrl?: string;
  };
  summary: string;
  highlights: HighlightItem[];
  opportunities: HighlightItem[];
}

export type SummaryPart = string | { detail: string };

export interface BeforeSummaryItem {
  summary: string;
  sources: FeedbackSource[];
}

export interface GenericHighlightItem {
  type: 'highlight' | 'opportunity';
  summary: string;
  sources: FeedbackSource[];
}

export const storyInteractions = {
  reframingSummary: {
    before: {
      summary:
        'Based on feedback from 5 reviewers, here are the key themes identified for Maya Chen.',
      items: [
        {

          summary:
            'Team members noted strong communication and proactive project planning',
          sources: [
            {
              quote:
                'During the Project Phoenix integration phase, Maya clearly articulated technical dependencies to the marketing team before their campaign planning started. This prevented misalignment and ensured marketing\'s launch timelines were realistic.',
              reviewer: 'David Park',
              reviewerRole: 'Staff Engineer',
            },
            {
              quote:
                'Maya flagged a scheduling conflict with the platform team two weeks before it would have blocked us. Because she raised it early, we adjusted the rollout plan and still hit our launch date.',
              reviewer: 'Rachel Torres',
              reviewerRole: 'Engineering Manager',
            },
          ],
        },
        {

          summary:
            'Multiple reviewers highlighted delegation and team development efforts',
          sources: [
            {
              quote:
                'Maya handed me the lead on the auth service redesign and checked in just enough to keep me on track. I grew more as an engineer in that project than anything else this year.',
              reviewer: 'James Liu',
              reviewerRole: 'Software Engineer II',
            },
            {
              quote:
                'Instead of owning the auth rewrite herself, Maya scoped it so Liam could drive the architecture. She reviewed his proposals and gave him room to make decisions. That kind of deliberate delegation is rare.',
              reviewer: 'Priya Sharma',
              reviewerRole: 'Senior Software Engineer',
            },
          ],
        },
        {

          summary:
            'Some feedback suggested improving workload visibility across teams',
          sources: [
            {
              quote:
                'A few times this cycle, other teams didn\'t know Maya\'s team was already stretched. Work kept getting routed to them because nobody had visibility into their capacity. Earlier flag-raising would help.',
              reviewer: 'Kevin Wright',
              reviewerRole: 'Product Manager',
            },
            {
              quote:
                'Maya tends to absorb extra work quietly rather than pushing back or redistributing. Making her team\'s workload more visible in planning would help avoid the crunches we saw around the Phoenix launch.',
              reviewer: 'Rachel Torres',
              reviewerRole: 'Engineering Manager',
            },
          ],
        },
      ] as BeforeSummaryItem[],
    },
  },
  refiningOutput: {
    before: {
      highlights: [
        {
          type: 'highlight' as const,
          summary: 'Demonstrated strong communication skills across teams',
          sources: [
            {
              quote:
                'During the Project Phoenix integration phase, Maya clearly articulated technical dependencies to the marketing team before their campaign planning started. This prevented misalignment and ensured marketing\'s launch timelines were realistic.',
              reviewer: 'David Park',
              reviewerRole: 'Staff Engineer',
            },
            {
              quote:
                'Maya flagged a scheduling conflict with the platform team two weeks before it would have blocked us. Because she raised it early, we adjusted the rollout plan and still hit our launch date.',
              reviewer: 'Rachel Torres',
              reviewerRole: 'Engineering Manager',
            },
          ],
        },
        {
          type: 'highlight' as const,
          summary: 'Showed effective delegation and mentorship abilities',
          sources: [
            {
              quote:
                'Maya handed me the lead on the auth service redesign and checked in just enough to keep me on track. I grew more as an engineer in that project than anything else this year.',
              reviewer: 'James Liu',
              reviewerRole: 'Software Engineer II',
            },
            {
              quote:
                'Instead of owning the auth rewrite herself, Maya scoped it so Liam could drive the architecture. She reviewed his proposals and gave him room to make decisions. That kind of deliberate delegation is rare.',
              reviewer: 'Priya Sharma',
              reviewerRole: 'Senior Software Engineer',
            },
          ],
        },
      ] as GenericHighlightItem[],
      afterParts: [
        [
          'Ensured on-time delivery of ',
          { detail: 'Project Phoenix' },
          ' through ',
          { detail: 'proactive communication' },
        ],
        [
          'Accelerated team growth by ',
          { detail: 'delegating the authentication service redesign' },
        ],
        [
          'Improve workload balance through ',
          { detail: 'increased visibility' },
          ' in ',
          { detail: 'cross-team planning' },
        ],
      ] as SummaryPart[][],
      opportunities: [
        {
          type: 'opportunity' as const,
          summary: 'Could improve workload management and team capacity planning',
          sources: [
            {
              quote:
                'A few times this cycle, other teams didn\'t know Maya\'s team was already stretched. Work kept getting routed to them because nobody had visibility into their capacity. Earlier flag-raising would help.',
              reviewer: 'Kevin Wright',
              reviewerRole: 'Product Manager',
            },
            {
              quote:
                'Maya tends to absorb extra work quietly rather than pushing back or redistributing. Making her team\'s workload more visible in planning would help avoid the crunches we saw around the Phoenix launch.',
              reviewer: 'Rachel Torres',
              reviewerRole: 'Engineering Manager',
            },
          ],
        } as GenericHighlightItem,
      ],
    },
  },
};

export const aiHighlightsContent: AIHighlightsContent = {
  // Left panel content
  projectName: 'Highlights and Opportunities',
  headline: 'AI summaries to make performance reviews easier',
  body: "Managers spent hours synthesizing feedback each review cycle. I reframed AI-generated themes into Highlights & Opportunities to match how managers actually evaluate performance, and worked with data science to tune prompts so output cited specific projects instead of generic summaries. The feature launched to a 93% positive feedback rating.",
  keyResult: undefined,
  decisionStories: [
    {
      id: 'reframing-summary',
      title: 'What framing is useful for managers?',
      story:
        "Early iterations of this feature generated and displayed themes. Through my work designing for performance reviews, I knew that managers were looking for what went well and what could be improved. I reframed the summaries around the concept of Highlights & Opportunities to reflect how managers evaluate performance.",
      highlightSection: 1,
      toggleLabels: ['Before', 'After'],
    },
    {
      id: 'refining-output',
      title: 'How did feedback shape the AI output?',
      story:
        "As part of validating this feature, I developed a process to test actual output from the prompt we were developing rather than generic copy. Managers indicated that the theme titles were too generic to help them understand what their direct report did. I worked with data science to tune the prompts so that the output cited specific projects and moments where the behaviour actually occurred.",
      highlightSection: 2,
      toggleLabels: ['Generic', 'Specific'],
    },
    {
      id: 'trust-verification',
      title: 'How do managers verify AI output?',
      story:
        "As part of our research, we identified that managers wanted to verify the themes generated by the AI. In each theme card, I used avatars to emphasize that the feedback came from people and made it easy to see the direct feedback that corresponded to the theme.",
      highlightSection: 2,
    },
  ],

  // Right panel content - fictional employee review
  employee: {
    name: 'Maya Chen',
    role: 'Senior Software Engineer',
    initials: 'MC',
    avatarColor: '#6366F1',
    avatarUrl: '/avatars/maya-chen.png',
  },
  summary:
    'Maya demonstrated strong leadership in ensuring timely project delivery and effectively supported team members\' growth and contributions. To further enhance team effectiveness, there\'s an opportunity to improve workload visibility and distribution across the team.',
  highlights: [
    {
      type: 'highlight',
      summary:
        'Ensured on-time delivery of Project Phoenix through proactive communication',
      sources: [
        {
          quote:
            'During the Project Phoenix integration phase, Maya clearly articulated technical dependencies to the marketing team before their campaign planning started. This prevented misalignment and ensured marketing\'s launch timelines were realistic.',
          reviewer: 'David Park',
          reviewerRole: 'Staff Engineer',
          avatarUrl: '/avatars/david-park.png',
        },
        {
          quote:
            'Maya flagged a scheduling conflict with the platform team two weeks before it would have blocked us. Because she raised it early, we adjusted the rollout plan and still hit our launch date.',
          reviewer: 'Rachel Torres',
          reviewerRole: 'Engineering Manager',
          avatarUrl: '/avatars/rachel-torres.png',
        },
      ],
    },
    {
      type: 'highlight',
      summary:
        'Accelerated team growth by delegating the authentication service redesign',
      sources: [
        {
          quote:
            'Maya handed me the lead on the auth service redesign and checked in just enough to keep me on track. I grew more as an engineer in that project than anything else this year.',
          reviewer: 'James Liu',
          reviewerRole: 'Software Engineer II',
          avatarUrl: '/avatars/james-liu.png',
        },
        {
          quote:
            'Instead of owning the auth rewrite herself, Maya scoped it so Liam could drive the architecture. She reviewed his proposals and gave him room to make decisions. That kind of deliberate delegation is rare.',
          reviewer: 'Priya Sharma',
          reviewerRole: 'Senior Software Engineer',
          avatarUrl: '/avatars/priya-sharma.png',
        },
      ],
    },
  ],
  opportunities: [
    {
      type: 'opportunity',
      summary:
        'Improve workload balance through increased visibility in cross-team planning',
      sources: [
        {
          quote:
            'A few times this cycle, other teams didn\'t know Maya\'s team was already stretched. Work kept getting routed to them because nobody had visibility into their capacity. Earlier flag-raising would help.',
          reviewer: 'Kevin Wright',
          reviewerRole: 'Product Manager',
          avatarUrl: '/avatars/kevin-wright.png',
        },
        {
          quote:
            'Maya tends to absorb extra work quietly rather than pushing back or redistributing. Making her team\'s workload more visible in planning would help avoid the crunches we saw around the Phoenix launch.',
          reviewer: 'Rachel Torres',
          reviewerRole: 'Engineering Manager',
          avatarUrl: '/avatars/rachel-torres.png',
        },
      ],
    },
  ],
};
