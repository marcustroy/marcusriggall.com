import Link from 'next/link';

export function LinkedInIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
    </svg>
  );
}

// Shared bar for every page header: name on the left, LinkedIn on the right.
// On the homepage the name scrolls to top; elsewhere it links home.
export default function SiteHeaderBar({
  onHome = false,
  onLinkedInClick,
}: {
  onHome?: boolean;
  onLinkedInClick?: () => void;
}) {
  const nameClassName = 'font-medium text-primary hover:opacity-70 transition-opacity';

  return (
    <div className="max-w-[1200px] mx-auto h-14 flex items-center justify-between">
      {onHome ? (
        <a href="#" className={nameClassName}>Idam Adam</a>
      ) : (
        <Link href="/" className={nameClassName}>Idam Adam</Link>
      )}
      <a
        href="https://www.linkedin.com/in/idamadam/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="flex items-center p-2 -m-2 text-secondary hover:text-[#0A66C2] transition-colors duration-200"
        onClick={onLinkedInClick}
      >
        <LinkedInIcon />
      </a>
    </div>
  );
}
