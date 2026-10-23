export interface NarrativeNote {
  text: string;
}

interface VibeCodingContent {
  projectName: string;
  headline: string;
  body: string;
  notes: NarrativeNote[];
}

export const vibeCodingContent: VibeCodingContent = {
  projectName: 'Personal Exploration',
  headline: 'Building my own web-based prototyping tool',
  body: 'A personal project to make complex prototyping via a coding agent more accessible via a web interface.',

  notes: [
    {
      text: 'Give it an idea, it builds a prototype with versioning and a "scrubber" to help you understand what\'s contained in the prototype.',
    },
    {
      text: 'Figured out how to bring a coding agent CLI into a browser. Designed interactions around that behavior.',
    },
    {
      text: 'This is how I learned to build the Design Sandbox at work. Personal project was the proving ground.',
    },
    {
      text: 'I can design and build. I\'ve developed deep fluency using these tools from this experience.',
    },
  ],
};
