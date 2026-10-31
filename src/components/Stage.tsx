'use client';

import { motion } from 'framer-motion';

// Each preview sits on a softly tinted backdrop in its project's colour.
export const STAGE_TINTS: Record<string, string> = {
  'heatmap-comparisons': 'var(--tint-heatmap-comparisons)',
  'culture-quadrant': 'var(--tint-culture-quadrant)',
  'sensitive-comments': 'var(--tint-sensitive-comments)',
  prototyping: 'var(--tint-prototyping)',
};

// Every panel sits on white so the tint never shows through transparent chrome.
// Panels made of loose parts (no card of their own) also get padding, so they
// read as one surface under the shadow.
const UNFRAMED_PANELS = new Set(['prototyping']);

// Every preview sits the same distance from the edge of its coloured frame.
export const STAGE_PADDING = 'p-6';

const CARD_SHADOW = 'shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_16px_-8px_rgba(0,0,0,0.08),0_32px_64px_-24px_rgba(0,0,0,0.22)]';

export function Stage({
  id,
  className = '',
  frameless = false,
  children,
}: {
  id: string;
  className?: string;
  /** Skip the tinted frame, for a page whose own background already carries the tint. */
  frameless?: boolean;
  children: React.ReactNode;
}) {
  if (frameless) {
    return (
      <div className={`${CARD_SHADOW} ${UNFRAMED_PANELS.has(id) ? 'theme-light rounded-xl bg-white p-6' : 'theme-light rounded-lg bg-white'}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={`relative rounded-2xl ${className}`}
      style={{ backgroundColor: STAGE_TINTS[id] ?? '#ECEDF0' }}
    >
      {/* Soft top light so the tint reads as a lit surface, not a flat fill */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(120%_80%_at_50%_0%,var(--stage-light),transparent_65%)]"
      />
      <div
        className={`relative shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_16px_-8px_rgba(0,0,0,0.08),0_32px_64px_-24px_rgba(0,0,0,0.22)] ${
          UNFRAMED_PANELS.has(id) ? 'theme-light rounded-xl bg-white p-6' : 'theme-light rounded-lg bg-white'
        }`}
      >
        {children}
      </div>
    </motion.div>
  );
}
