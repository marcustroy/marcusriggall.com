'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { heroContent, introContent } from './content';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { timing, timingReduced } from '@/lib/animations';
import TextReveal from './TextReveal';

export default function HeroContent() {
  const reducedMotion = useReducedMotion();
  const t = reducedMotion ? timingReduced : timing;

  return (
    <div className="flex flex-col items-start gap-4">
      {/* Profile photo */}
      <div className="shrink-0 w-10 h-10 rounded-full overflow-hidden">
        <Image
          src="/avatars/headshot.jpg"
          alt={heroContent.name}
          width={40}
          height={40}
          className="w-full h-full object-cover"
        />
      </div>

      {/* All text in single column */}
      <div className="flex flex-col gap-1">
        {/* Name with pixel font */}
        <h1 className="type-pixel whitespace-nowrap !m-0">
          <TextReveal
            text={heroContent.name}
            mode="characters"
            staggerDelay={t.intro.nameStagger}
            duration={0.4}
          />
        </h1>

        {/* Tagline */}
        <motion.span
          className="text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: t.intro.stageDuration,
            delay: t.intro.nameReveal,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {introContent.role}
        </motion.span>
      </div>
    </div>
  );
}
