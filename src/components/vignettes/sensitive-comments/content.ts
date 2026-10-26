export type CommentStatus = 'Needs review' | 'Not redacted' | 'Redacted';

export interface SensitiveComment {
  id: number;
  /** The comment as it was written, in its original language. */
  original: string;
  /** English translation, only for comments written in another language. */
  translated?: string;
  date: string; // ISO yyyy-mm-dd
  status: CommentStatus;
  topics: string[];
  keywords: string[];
  sentiment: 'Negative';
}

export const statusOrder: CommentStatus[] = ['Needs review', 'Not redacted', 'Redacted'];

export const sensitiveComments: SensitiveComment[] = [
  {
    id: 1,
    original:
      "La façon dont certains managers traitent les employés ici frise le harcèlement. Ils nous parlent de haut, font des remarques déplacées et s'en tirent impunément car personne aux RH ne semble s'en soucier. On dirait qu'ils se croient intouchables",
    translated:
      "The way some managers treat employees here borders on harassment. They talk down to us, make inappropriate remarks and get away with it because nobody in HR seems to care. It's as if they think they're untouchable.",
    date: '2026-01-01',
    status: 'Needs review',
    topics: ['Insult', 'Harassment', 'Threat', 'Bias'],
    keywords: ['Harassment'],
    sentiment: 'Negative',
  },
  {
    id: 2,
    original:
      "Certains managers pensent qu'il est acceptable d'intimider les employés pour obtenir des résultats, et quiconque tente de s'y opposer est pris pour cible. Il s'agit ni plus ni moins de harcèlement, mais l'entreprise ferme les yeux",
    translated:
      "Some managers think it's acceptable to intimidate employees to get results, and anyone who tries to push back is targeted. It's nothing less than harassment, but the company turns a blind eye.",
    date: '2026-01-05',
    status: 'Needs review',
    topics: ['Insult', 'Harassment'],
    keywords: ['Bully', 'Harassment', 'Intimidate', 'Targeted'],
    sentiment: 'Negative',
  },
  {
    id: 3,
    original:
      "One of the senior managers constantly makes inappropriate comments toward women in the office, and it's disgusting. People have reported it, but he's still here, which makes it clear that leadership protects its own",
    date: '2026-01-08',
    status: 'Redacted',
    topics: ['Insult', 'Harassment'],
    keywords: ['Inappropriate'],
    sentiment: 'Negative',
  },
  {
    id: 4,
    original:
      "There's a supervisor here who singles people out and embarrasses them in front of everyone. It's harassment, and it's happening regularly",
    date: '2026-01-08',
    status: 'Not redacted',
    topics: ['Insult', 'Harassment'],
    keywords: ['Harassment'],
    sentiment: 'Negative',
  },
  {
    id: 5,
    original:
      "I've been directly harassed by a manager who makes personal, inappropriate comments about my appearance. It makes me feel uncomfortable coming to work, but when I reported it, nothing was done",
    date: '2026-01-11',
    status: 'Needs review',
    topics: ['Insult', 'Harassment'],
    keywords: ['Harassed', 'Inappropriate'],
    sentiment: 'Negative',
  },
  {
    id: 6,
    original:
      "The harassment from leadership is blatant. There's a toxic power dynamic here where managers feel entitled to treat us however they want",
    date: '2026-01-11',
    status: 'Redacted',
    topics: ['Insult'],
    keywords: ['Harassment'],
    sentiment: 'Negative',
  },
  {
    id: 7,
    original:
      "I've witnessed managers openly mocking employees in meetings. It's creating a culture of fear and disrespect.",
    date: '2026-01-17',
    status: 'Not redacted',
    topics: ['Insult'],
    keywords: ['Mocking'],
    sentiment: 'Negative',
  },
  {
    id: 8,
    original:
      "There's a manager who constantly makes inappropriate jokes. It makes me and my colleagues very uncomfortable.",
    date: '2026-01-17',
    status: 'Needs review',
    topics: ['Insult'],
    keywords: ['Inappropriate'],
    sentiment: 'Negative',
  },
  {
    id: 9,
    original:
      "I've heard a director use derogatory language towards a team member. It was shocking and unacceptable.",
    date: '2026-01-21',
    status: 'Redacted',
    topics: ['Insult'],
    keywords: ['Derogatory'],
    sentiment: 'Negative',
  },
  {
    id: 10,
    original:
      'Some leaders play favorites and create a hostile environment for those outside their inner circle.',
    date: '2026-01-22',
    status: 'Not redacted',
    topics: ['Insult'],
    keywords: ['Hostile'],
    sentiment: 'Negative',
  },
];

export function formatDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[month - 1]} ${day}, ${year}`;
}
