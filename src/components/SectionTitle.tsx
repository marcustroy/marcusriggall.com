'use client';

import { motion } from 'framer-motion';
import { timing, timingReduced } from '@/lib/animations';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface SectionTitleProps {
  children: string;
  disableScrollTrigger?: boolean;
}

export default function SectionTitle({ children, disableScrollTrigger = false }: SectionTitleProps) {
  const reducedMotion = useReducedMotion();
  const t = reducedMotion ? timingReduced : timing;

  const scrollTriggeredProps = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' as const },
  };

  const staticProps = {
    initial: { opacity: 1, y: 0 },
    animate: { opacity: 1, y: 0 },
  };

  const motionProps = disableScrollTrigger ? staticProps : scrollTriggeredProps;

  return (
    <motion.h2
      className="type-h2"
      {...motionProps}
      transition={{
        duration: t.duration.slow,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.h2>
  );
}
