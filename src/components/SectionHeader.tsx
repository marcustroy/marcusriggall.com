'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { timing, timingReduced } from '@/lib/animations';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface SectionHeaderProps {
  title: string;
  children?: ReactNode;
}

export default function SectionHeader({ title, children }: SectionHeaderProps) {
  const reducedMotion = useReducedMotion();
  const t = reducedMotion ? timingReduced : timing;

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: t.duration.slow,
        delay: t.entrance.text,
        ease: 'easeOut' as const,
      },
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: t.duration.medium,
        delay: t.entrance.panel, // Description follows title
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section className="w-full pb-10 lg:pb-12 px-6 lg:px-12 2xl:px-24">
      <div className="max-w-[1600px] mx-auto border-t border-border pt-10 lg:pt-12 space-y-3">
        <motion.h2
          className="type-h2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={titleVariants}
        >
          {title}
        </motion.h2>
        {children && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={descriptionVariants}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
