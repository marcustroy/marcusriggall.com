import type { DecisionStory } from '../shared/DecisionStories';

export interface PrototypeItem {
  id: number;
  name: string;
  thumbnail: string;
}

export interface DesignerItem {
  id: number;
  name: string;
  initials: string;
  avatarColor: string;
  role: 'Designer' | 'Product manager';
}

export interface PrototypingContent {
  // Left panel content
  projectName: string;
  headline: string;
  body: string;

  // Decision stories
  decisionStories: DecisionStory[];

  // Right panel content
  sandboxTitle: string;
  prototypes: PrototypeItem[];
  designers: DesignerItem[];
  adoptionStats: {
    designers: number;
    prototypes: number;
  };
}

export const prototypingContent: PrototypingContent = {
  // Left panel content
  projectName: 'Design Sandbox',
  headline: 'Maintained and improved an internal repository to make AI prototyping faster and easier',
  body: 'Designers had no way to deploy or share AI prototypes. As part of a small team of designers, I helped maintain and improve the infrastructure and the onboarding so anyone could start with a single slash command. 15 designers and PMs adopted it. I used the Design Sandbox to prototype the Performance Culture Quadrant experience with real survey data, and the executive demos that followed resulted in a major release being funded.',

  // Decision stories
  decisionStories: [
    {
      id: 'build-it-yourself',
      title: 'Why did we build this?',
      story:
        'Designers were building a lot of AI prototypes and needed a way to deploy and share them. Beyond solving that, the aim was to build a discipline of prototyping across the design team. There wasn\'t dedicated engineering for this, so a small group of designers maintained the infrastructure themselves. Making it easy for other designers and product managers to get started meant prototyping could become a shared practice, not just something one person did.',
      highlightSection: 1,
      hideDividerBelow: true,
    },
    {
      id: 'onboarding',
      title: 'How did we make it easy to adopt?',
      story:
        'We designed custom slash commands like /add-user and /add-prototype that scaffolded everything for you. Designers didn\'t need to learn how the system worked or touch any infrastructure. They could just run a command and start prototyping. Lowering that barrier was key to getting the whole team on board.',
      highlightSection: 2,
    },
  ],

  // Right panel content
  sandboxTitle: 'Culture Amp Design Sandbox',
  prototypes: [
    { id: 1, name: 'Performance AI', thumbnail: '#d9d9d9' },
    { id: 2, name: 'Skills Coach', thumbnail: '#d9d9d9' },
    { id: 3, name: 'Goals Assistant', thumbnail: '#d9d9d9' },
    { id: 4, name: 'Feedback Helper', thumbnail: '#d9d9d9' },
    { id: 5, name: 'Review Writer', thumbnail: '#d9d9d9' },
    { id: 6, name: '1-on-1 Prep', thumbnail: '#d9d9d9' },
  ],
  designers: [
    { id: 1, name: 'Nadia Okafor', initials: 'NO', avatarColor: '#EC4899', role: 'Designer' },
    { id: 2, name: 'Liam Harper', initials: 'LH', avatarColor: '#6366F1', role: 'Product manager' },
    { id: 3, name: 'Mei Tanaka', initials: 'MT', avatarColor: '#10B981', role: 'Designer' },
    { id: 4, name: 'Rafael Costa', initials: 'RC', avatarColor: '#F59E0B', role: 'Product manager' },
    { id: 5, name: 'Zara Hussain', initials: 'ZH', avatarColor: '#8B5CF6', role: 'Designer' },
    { id: 6, name: 'Owen Gallagher', initials: 'OG', avatarColor: '#14B8A6', role: 'Product manager' },
  ],
  adoptionStats: {
    designers: 15,
    prototypes: 30,
  },
};
