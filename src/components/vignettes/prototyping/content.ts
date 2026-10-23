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
  headline: 'Built an internal repository to make AI prototyping faster and easier',
  body: 'Designers had no way to deploy or share AI prototypes. I built the infrastructure myself and designed onboarding so anyone could start with a single slash command. 15 designers and PMs adopted it, and one team used it to prototype with real survey data for executive demos that got a major release funded.',

  // Decision stories
  decisionStories: [
    {
      id: 'build-it-yourself',
      title: 'Why did you build this?',
      story:
        'I was building a lot of AI prototypes and needed a way to deploy and share them. But beyond solving my own problem, I wanted to build a discipline of prototyping across the design team. There wasn\'t dedicated engineering for this, but I had the skills to build the infrastructure myself. Making it easy for other designers to get started meant prototyping could become a shared practice, not just something one person did.',
      highlightSection: 1,
    },
    {
      id: 'onboarding',
      title: 'How did I make it easy to adopt?',
      story:
        'I designed custom slash commands like /add-designer and /add-prototype that scaffolded everything for you. Designers didn\'t need to learn how the system worked or touch any infrastructure. They could just run a command and start prototyping. Lowering that barrier was key to getting the whole team on board.',
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
    { id: 1, name: 'Sarah Chen', initials: 'SC', avatarColor: '#EC4899' },
    { id: 2, name: 'Marcus Johnson', initials: 'MJ', avatarColor: '#6366F1' },
    { id: 3, name: 'Priya Patel', initials: 'PP', avatarColor: '#10B981' },
    { id: 4, name: 'Alex Kim', initials: 'AK', avatarColor: '#F59E0B' },
    { id: 5, name: 'Jordan Rivera', initials: 'JR', avatarColor: '#8B5CF6' },
    { id: 6, name: 'Taylor Brooks', initials: 'TB', avatarColor: '#14B8A6' },
  ],
  adoptionStats: {
    designers: 15,
    prototypes: 30,
  },
};
