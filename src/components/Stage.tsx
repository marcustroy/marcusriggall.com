'use client';

import { motion } from 'framer-motion';

// Each preview sits on a softly tinted backdrop in its project's colour.
export const STAGE_TINTS: Record<string, string> = {
  'heatmap-comparisons': '#FDEAEE',
  'culture-quadrant': '#DDF2F4',
  'sensitive-comments': '#E9EEDF',
  prototyping: '#E8E9EE',
};

// Every panel sits on white so the tint never shows through transparent chrome.
// Panels made of loose parts (no card of their own) also get padding, so they
// read as one surface under the shadow.
const UNFRAMED_PANELS = new Set(['prototyping']);

// The table-based previews need the room, so their frames are tighter.
const TIGHT_STAGES = new Set(['heatmap-comparisons', 'sensitive-comments']);
export const stagePadding = (id: string) => (TIGHT_STAGES.has(id) ? 'p-6' : 'p-10');

export function Stage({ id, className = '', children }: { id: string; className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      className={`relative rounded-2xl ${className}`}
      initial={false}
      animate={{ backgroundColor: STAGE_TINTS[id] ?? '#ECEDF0' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Soft top light so the tint reads as a lit surface, not a flat fill */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(120%_80%_at_50%_0%,rgba(255,255,255,0.65),transparent_65%)]"
      />
      <div
        className={`relative shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_16px_-8px_rgba(0,0,0,0.08),0_32px_64px_-24px_rgba(0,0,0,0.22)] ${
          UNFRAMED_PANELS.has(id) ? 'rounded-xl bg-white p-6' : 'rounded-lg bg-white'
        }`}
      >
        {children}
      </div>
    </motion.div>
  );
}
