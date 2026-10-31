'use client';

import { useTheme } from '@/lib/theme';

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <circle cx="8" cy="8" r="2.75" />
      <path d="M8 1.5v1.4M8 13.1v1.4M1.5 8h1.4M13.1 8h1.4M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.2 9.6A5.5 5.5 0 016.4 2.8a5.5 5.5 0 106.8 6.8z" />
    </svg>
  );
}

// A sun / moon switch: the knob slides under whichever theme is active.
export default function ThemeToggle({ onTint = false }: { onTint?: boolean }) {
  const { theme, setTheme } = useTheme();
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      data-theme-toggle
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      className={`relative ml-1.5 flex h-8 w-[60px] shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 ${
        onTint ? 'bg-hover-tint' : 'bg-hover'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute left-0.5 top-0.5 h-7 w-7 rounded-full bg-background shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.3,0.64,1)] motion-reduce:transition-none ${
          dark ? 'translate-x-7' : 'translate-x-0'
        }`}
      />
      <span className={`relative z-10 flex h-7 w-7 items-center justify-center transition-[color,transform] duration-500 ease-[cubic-bezier(0.34,1.3,0.64,1)] motion-reduce:transition-none ${dark ? 'rotate-90 scale-90 text-secondary' : 'text-primary'}`}>
        <SunIcon />
      </span>
      <span className={`relative z-10 flex h-7 w-7 items-center justify-center transition-[color,transform] duration-500 ease-[cubic-bezier(0.34,1.3,0.64,1)] motion-reduce:transition-none ${dark ? 'text-primary' : '-rotate-90 scale-90 text-secondary'}`}>
        <MoonIcon />
      </span>
    </button>
  );
}
