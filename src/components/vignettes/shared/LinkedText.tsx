import Link from 'next/link';

const LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)/g;

// Inline styles, because the site's global `a { text-decoration: none; color: inherit }` rule
// would override Tailwind's utility classes. Kaizen blue-500 so links stand out from body text.
const linkStyle: React.CSSProperties = {
  color: 'var(--link)',
  fontWeight: 500,
  textDecoration: 'underline',
  textDecorationThickness: '1.5px',
  textUnderlineOffset: '3px',
};

// Renders text with [label](href) links. Paths starting with "/" are in-site links; anything else
// opens in a new tab.
export default function LinkedText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(LINK_PATTERN)) {
    const [whole, label, href] = match;
    const index = match.index ?? 0;
    if (index > lastIndex) parts.push(text.slice(lastIndex, index));

    const className = 'transition-opacity hover:opacity-70';
    parts.push(
      href.startsWith('/') ? (
        <Link key={index} href={href} className={className} style={linkStyle}>
          {label}
        </Link>
      ) : (
        <a key={index} href={href} target="_blank" rel="noopener noreferrer" className={className} style={linkStyle}>
          {label}
        </a>
      )
    );
    lastIndex = index + whole.length;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return <>{parts}</>;
}
