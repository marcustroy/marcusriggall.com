'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface PrototypePreviewProps {
  isVisible: boolean;
  prototypeName: string;
  onReset: () => void;
  isComplete: boolean;
}

const FEED_ITEMS = [
  { initials: 'SC', name: 'Sarah', action: 'shared feedback on Q4 goals' },
  { initials: 'MJ', name: 'Marcus', action: 'completed self-review' },
  { initials: 'PP', name: 'Priya', action: 'updated team objectives' },
];

// Mini avatar component matching HomeConnectPanel style
function MiniAvatar({ initials }: { initials: string }) {
  return (
    <div className="w-5 h-5 rounded-full bg-[#FFF0E8] flex items-center justify-center shrink-0">
      <span className="text-[8px] font-semibold text-[#2F2438]">{initials}</span>
    </div>
  );
}

export default function PrototypePreview({
  isVisible,
  prototypeName,
  onReset,
  isComplete,
}: PrototypePreviewProps) {
  const reducedMotion = useReducedMotion();

  if (!isVisible) return null;

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0.1 : 0.5,
        ease: 'easeOut' as const,
        staggerChildren: reducedMotion ? 0 : 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0.1 : 0.3, ease: 'easeOut' as const },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: reducedMotion ? 0.1 : 0.3,
        ease: 'easeOut' as const,
        delay: reducedMotion ? 0 : 0.2 + i * 0.1,
      },
    }),
  };

  return (
    <motion.div
      className="relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Label */}
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-caption text-muted-foreground">Preview</p>
      </div>

      {/* Preview container */}
      <div className="relative rounded-xl overflow-hidden border border-black/10 shadow-sm">
        {/* Inner preview - Culture Amp style */}
        <div className="relative bg-background-subtle rounded-[10px] overflow-hidden">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-black/5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            <span className="text-[11px] text-gray-500 font-mono ml-2">
              sandbox.cultureamp.net/{prototypeName.toLowerCase().replace(/\s+/g, '-')}
            </span>
          </div>

          {/* App content - Culture Amp style interface */}
          <div className="min-h-[140px]">
            {/* Purple header */}
            <motion.div
              className="bg-[#5F3361] px-3 py-2.5"
              variants={headerVariants}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <img
                  src="/logos/cultureamp.svg"
                  alt="Culture Amp"
                  className="h-3 brightness-0 invert"
                />
              </div>
              <p className="text-white text-sm font-semibold leading-tight">
                Team Pulse
              </p>
            </motion.div>

            {/* Light content area */}
            <div className="p-3 space-y-2">
              {/* Recent divider */}
              <motion.div
                className="flex items-center gap-2"
                variants={headerVariants}
              >
                <span className="text-[10px] font-semibold text-primary/70">Recent</span>
                <div className="flex-1 h-px bg-black/10 rounded-full" />
              </motion.div>

              {/* Feed cards */}
              <div className="space-y-1.5">
                {FEED_ITEMS.map((item, index) => (
                  <motion.div
                    key={item.initials}
                    className="bg-background-elevated rounded-[5px] shadow-sm px-2.5 py-2 flex items-center gap-2"
                    custom={index}
                    variants={cardVariants}
                  >
                    <MiniAvatar initials={item.initials} />
                    <p className="text-[10px] text-primary leading-tight flex-1 min-w-0">
                      <span className="font-semibold">{item.name}</span>{' '}
                      <span className="text-primary/70">{item.action}</span>
                    </p>
                    <svg
                      width="6"
                      height="6"
                      viewBox="0 0 10 10"
                      fill="none"
                      className="shrink-0 text-primary/30"
                    >
                      <path
                        d="M3 1L7 5L3 9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Completion footer */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="mt-2 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span className="text-body-sm text-primary">
              {prototypeName} deployed to sandbox
            </span>
          </div>
          <button
            onClick={onReset}
            className="text-caption text-muted-foreground hover:text-primary transition-colors"
          >
            Try again
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
