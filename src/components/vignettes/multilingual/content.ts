import type { DecisionStory } from '../shared/DecisionStories';

interface TranslationField {
  id: number;
  label: string;
  sourceText: string;
}

interface LanguageOption {
  code: string;
  name: string;
  texts: string[];
  words: string[][];
}

export interface MultilingualContent {
  // Left panel content
  projectName: string;
  headline: string;
  body: string;

  // Decision stories
  decisionStories: DecisionStory[];

  // Right panel content
  translationFields: TranslationField[];
  languages: LanguageOption[];
}

export const multilingualContent: MultilingualContent = {
  // Left panel content
  projectName: 'Multilingual Performance Cycles',
  headline: 'A simple workflow to run a multilingual performance cycle',
  body: 'Lack of support for multilingual workflows was a top reason for lost deals. Through research with admins, I discovered they were already using machine translation and managing via spreadsheets. I advocated to expand scope beyond a basic form to include both. The result was simpler than existing flows, and customers started requesting it in other areas of the product.',

  // Decision stories
  decisionStories: [
    {
      id: 'scope-expansion',
      title: 'Why expand beyond a basic form?',
      story:
        'The original scope was a basic form with manual text fields for each translation. Through research, I found that admins were already using Google Translate and other tools to translate their content, despite our assumption that they wouldn\'t trust machine translation quality. The org didn\'t see the need for anything more than the basic form. I used the research to demonstrate that admins had already built their own workflows around machine translation and spreadsheets, and advocated to bring both into the product as a package.',
      highlightSection: 1,
      toggleLabels: ['Before', 'After'],
    },
    {
      id: 'spreadsheet-workflow',
      title: 'Why design around spreadsheets?',
      story:
        'Research showed that spreadsheets were how admins actually managed their translations. Rather than build a full in-product translation management tool, I designed around their existing workflow with import and export. The result was simpler than other translation flows in the product, and customers started asking for this workflow in other areas of Culture Amp.',
      highlightSection: 2,
    },
  ],

  // Right panel content
  translationFields: [
    {
      id: 1,
      label: 'Performance review question',
      sourceText: 'How did this person perform during this review period?',
    },
  ],
  languages: [
    {
      code: 'fr',
      name: 'Fran\u00e7ais (French)',
      texts: [
        "Comment cette personne a-t-elle perform\u00e9 au cours de cette p\u00e9riode d'\u00e9valuation?",
      ],
      words: [
        ['Comment', 'cette', 'personne', 'a-t-elle', 'perform\u00e9', 'au', 'cours', 'de', 'cette', 'p\u00e9riode', "d'\u00e9valuation?"],
      ],
    },
    {
      code: 'es',
      name: 'Espa\u00f1ol (Spanish)',
      texts: [
        '\u00bfC\u00f3mo se desempe\u00f1\u00f3 esta persona durante este per\u00edodo de evaluaci\u00f3n?',
      ],
      words: [
        ['\u00bfC\u00f3mo', 'se', 'desempe\u00f1\u00f3', 'esta', 'persona', 'durante', 'este', 'per\u00edodo', 'de', 'evaluaci\u00f3n?'],
      ],
    },
    {
      code: 'dv',
      name: '\u078b\u07a8\u0788\u07ac\u0780\u07a8 (Dhivehi)',
      texts: [
        '\u0789\u07a8 \u0789\u07a9\u0780\u07a7 \u0789\u07a8 \u0783\u07a8\u0788\u07a8\u0787\u07aa \u078e\u07ac\u0783\u07ad\u078e\u07a6\u0787\u07a8 \u0786\u07a8\u0780\u07a8\u0782\u07ac\u0787\u07b0 \u0786\u07aa\u0783\u07a8\u0787\u07a6\u0783\u07a6\u0787\u07a8\u078a\u07a8\u061f',
      ],
      words: [
        ['\u0789\u07a8', '\u0789\u07a9\u0780\u07a7', '\u0789\u07a8', '\u0783\u07a8\u0788\u07a8\u0787\u07aa', '\u078e\u07ac\u0783\u07ad\u078e\u07a6\u0787\u07a8', '\u0786\u07a8\u0780\u07a8\u0782\u07ac\u0787\u07b0', '\u0786\u07aa\u0783\u07a8\u0787\u07a6\u0783\u07a6\u0787\u07a8\u078a\u07a8\u061f'],
      ],
    },
  ],
};
