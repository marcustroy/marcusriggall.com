'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useIntroSequence } from '@/lib/intro-sequence-context';
import { timing, timingReduced, fadeInUp } from '@/lib/animations';
import SectionTitle from './SectionTitle';
import AIHighlightsVignette from './vignettes/ai-highlights/AIHighlightsVignette';
import AISuggestionsVignette from './vignettes/ai-suggestions/AISuggestionsVignette';
import PrototypingVignette from './vignettes/prototyping/PrototypingVignette';
import MultilingualVignette from './vignettes/multilingual/MultilingualVignette';
import HomeConnectVignette from './vignettes/home-connect/HomeConnectVignette';
import VibeCodingVignette from './vignettes/vibe-coding/VibeCodingVignette';

export default function SelectedWorkSection() {
  const reducedMotion = useReducedMotion();
  const t = reducedMotion ? timingReduced : timing;
  const { isComplete } = useIntroSequence();

  // Always show for reduced motion, otherwise wait for intro
  const shouldShow = reducedMotion || isComplete;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{
        duration: t.duration.slow,
        delay: shouldShow ? 0.5 : 0,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <section id="work" className="w-full pb-12 lg:pb-20 px-6 lg:px-10 2xl:px-16 scroll-mt-20">
        <div className="max-w-[1408px] mx-auto border-t border-border/60 pt-10 lg:pt-14">
          <SectionTitle disableScrollTrigger>Selected work</SectionTitle>
        </div>
        <div className="max-w-[1408px] mx-auto grid grid-cols-1 gap-32 lg:gap-48 items-start mt-8 lg:mt-10">
          <div>
            <motion.span className="type-label block mb-8 lg:mb-10" {...fadeInUp}>AI & Intelligence</motion.span>
            <div className="grid grid-cols-1 gap-32 lg:gap-48">
              <AIHighlightsVignette />
              <AISuggestionsVignette />
            </div>
          </div>
          <div>
            <motion.span className="type-label block mb-8 lg:mb-10" {...fadeInUp}>Platform & Systems</motion.span>
            <div className="grid grid-cols-1 gap-32 lg:gap-48">
              <MultilingualVignette />
              <HomeConnectVignette />
              <PrototypingVignette />
            </div>
          </div>
          <div>
            <motion.span className="type-label block mb-8 lg:mb-10" {...fadeInUp}>Exploration</motion.span>
            <VibeCodingVignette />
          </div>
        </div>
      </section>
    </motion.div>
  );
}
