import { DecisionStory } from '../shared/DecisionStories';

// Border prototyping controls
export interface BorderSettings {
  colors: [string, string, string];
  speed: number;
  glow: number;
}

export const defaultBorderSettings: BorderSettings = {
  colors: ['#A6E5E7', '#64D2D7', '#9A36B2'],
  speed: 3,
  glow: 0.6,
};

export const colorPresets: { name: string; colors: [string, string, string] }[] =
  [
    { name: 'Default', colors: ['#A6E5E7', '#64D2D7', '#9A36B2'] },
    { name: 'Rainbow', colors: ['#FFB600', '#FF5C0B', '#9A36B2'] },
  ];

export const speedPresets: { name: string; value: number }[] = [
  { name: 'Slow', value: 5 },
  { name: 'Medium', value: 3 },
  { name: 'Fast', value: 1.5 },
];

export const glowPresets: { name: string; value: number }[] = [
  { name: 'Subtle', value: 0.3 },
  { name: 'Medium', value: 0.6 },
  { name: 'Strong', value: 0.9 },
];

interface AISuggestionsRecommendation {
  title: string;
  description: string;
}

export interface AISuggestionsContent {
  // Left panel content
  projectName: string;
  headline: string;
  body: string;
  decisionStories: DecisionStory[];

  // Right panel content
  questionText: string;
  beforeText: string;
  afterText: string;
  recommendations: AISuggestionsRecommendation[];
}

export const aiSuggestionsContent: AISuggestionsContent = {
  // Left panel content
  projectName: 'AI Suggest Improvements',
  headline: 'AI suggestions to help managers write better feedback',
  body: "We saw AI assistance as a natural fit for making feedback better, but didn't want AI to take over critical thinking. Working with People Scientists, I designed suggestions around principles of good feedback so managers learned over time rather than offloading to an LLM. After launch, 80% of managers improved their feedback after using it.",
  decisionStories: [
    {
      id: 'improve-button-placement',
      title: 'Where should the AI trigger live?',
      story:
        'I explored several triggers: a Grammarly-style floating circle, a dedicated option in the toolbar menu, and automatic review as the user typed. The floating circle was discarded due to accessibility concerns and conflicting with tools like Grammarly. Auto-review was too costly. An explicit button in the editor toolbar felt most natural and made it easy to extend to other text editors inside Culture Amp.',
      highlightSection: 1,
    },
    {
      id: 'designing-feel-of-ai',
      title: 'How did I give AI personality?',
      story:
        'We initially tried a flat colour well with a border to match our design system, but we needed to differentiate AI content from regular content. I designed a loading animation alongside our "Sparkle" icon to add visual flair, tuning the gradient colours, rotation speed and border strength in code. Getting these details right made the final interaction feel refined.',
      highlightSection: 2,
    },
    {
      id: 'suggest-not-rewrite',
      title: 'Why suggest instead of rewrite?',
      story:
        "This was early on in the advent of LLMs. There was pressure to show dramatic AI capability with full rewrites, but we were concerned about managers offloading critical thinking. Working with Culture Amp's People Scientists, we identified 4 aspects of good feedback and designed the feature around these suggestions. We gave up the wow factor of AI-written feedback in exchange for a tool that actually built skill over time.",
      highlightSection: 3,
    },
  ],

  // Right panel content
  questionText: 'How has this person progressed over this review period?',
  beforeText:
    "Alex Johnson has made some progress, but it's not really enough. They still have a long way to go. Their performance hasn't improved much, and they haven't met their goals in a meaningful way. They should try to be better next review period.",
  afterText:
    "Alex Johnson completed 2 of their 5 quarterly goals this period. The three outstanding goals — improving test coverage, reducing incident response time, and completing the onboarding documentation — didn't see meaningful progress. To improve next quarter, I'd suggest Alex break each goal into smaller milestones with clear deadlines and schedule regular check-ins to stay on track.",
  recommendations: [
    {
      title: 'Be specific:',
      description:
        "The feedback is too general and lacks specific context. It mentions 'progress' and 'goals' but doesn't provide any examples or details about what those goals were, what actions were taken, or what the specific outcomes were.",
    },
    {
      title: 'Suggest actions:',
      description:
        'The feedback is vague and does not provide specific, actionable steps for improvement. It states that Alex should "try to be better" but doesn\'t offer concrete suggestions on how to achieve that.',
    },
  ],
};
