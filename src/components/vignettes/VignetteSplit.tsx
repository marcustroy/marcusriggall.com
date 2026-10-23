'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { timing, timingReduced } from '@/lib/animations';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { VignetteEntranceProvider } from '@/lib/vignette-entrance-context';

interface VignetteSplitProps {
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  variant?: 'default' | 'hero';
  /** Disable entrance animations (useful if parent handles it) */
  animateEntrance?: boolean;
  /** Force stacked layout (useful for compact containers) */
  compact?: boolean;
}

export default function VignetteSplit({
  title,
  actions,
  children,
  variant = 'default',
  animateEntrance = true,
  compact = false,
}: VignetteSplitProps) {
  const reducedMotion = useReducedMotion();
  const t = reducedMotion ? timingReduced : timing;

  const hasTitle = Boolean(title);
  const textStackClass = hasTitle ? 'space-y-6' : 'space-y-4';

  const titleClass = variant === 'hero' ? 'type-display' : 'type-body font-display';

  // Grid classes - refined spacing for premium feel
  // Text column widths harmonized with IntroPanel (544px at 2xl)
  const gridClass = compact
    ? 'grid grid-cols-1 gap-6'
    : 'grid grid-cols-1 xl:grid-cols-[500px_1fr] 2xl:grid-cols-[544px_1fr] gap-6 xl:gap-12 xl:items-start';

  // Animation variants for text column (appears first)
  const textVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: t.duration.slow,
        delay: t.entrance.text,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  // Animation variants for panel column (appears after text)
  const panelVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: t.duration.slow,
        delay: t.entrance.panel,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  // When animations are disabled, render static
  if (!animateEntrance) {
    return (
      <div className={gridClass}>
        <div className={textStackClass}>
          {title && <div className={titleClass}>{title}</div>}
          {actions && (
            <div className="flex justify-center xl:justify-start pt-1">
              {actions}
            </div>
          )}
        </div>
        <div className="w-full">
          <VignetteEntranceProvider delay={0}>
            {children}
          </VignetteEntranceProvider>
        </div>
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {/* Text column - animates first */}
      <motion.div
        className={textStackClass}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={textVariants}
      >
        {title && <div className={titleClass}>{title}</div>}
        {actions && (
          <div className="flex justify-center xl:justify-start pt-1">
            {actions}
          </div>
        )}
      </motion.div>

      {/* Panel column - animates after text */}
      <motion.div
        className="w-full overflow-visible"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={panelVariants}
      >
        <VignetteEntranceProvider>
          {children}
        </VignetteEntranceProvider>
      </motion.div>
    </div>
  );
}
