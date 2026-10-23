'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroContent from './HeroContent';
import IntroPanel from './IntroPanel';
import ApproachCards from './ApproachCards';
import { timing, timingReduced } from '@/lib/animations';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useIntroSequence } from '@/lib/intro-sequence-context';

// Hook to detect mobile viewport
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    setIsMobile(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

export default function HeroVignette() {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const t = reducedMotion ? timingReduced : timing;
  const [isSplash, setIsSplash] = useState(false);
  const { setSplashComplete, setStage, isComplete } = useIntroSequence();

  // Snap to final state if intro was skipped (via scroll)
  useEffect(() => {
    if (isComplete && isSplash) {
      setIsSplash(false);
    }
  }, [isComplete, isSplash]);

  // Transition from splash to normal layout
  useEffect(() => {
    if (reducedMotion) {
      setSplashComplete();
      setStage('complete');
      return;
    }

    // Don't set timers if already complete (skipped)
    if (isComplete) return;

    // End splash state
    const splashTimer = setTimeout(() => {
      setIsSplash(false);
    }, t.splash.duration * 1000);

    // Signal splash complete (position transition done)
    const transitionTimer = setTimeout(() => {
      setSplashComplete();
    }, (t.splash.duration + t.splash.transition) * 1000);

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(transitionTimer);
    };
  }, [reducedMotion, t, setSplashComplete, setStage, isComplete]);

  return (
    <motion.section
      className="w-full px-6 lg:px-10 2xl:px-16 pt-24 pb-8 lg:pt-32 lg:pb-8"
      initial={false}
      animate={{
        minHeight: isSplash ? '100vh' : 'auto',
      }}
      transition={{
        duration: 0.3,
        delay: isSplash ? 0 : t.splash.transition + 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <motion.div
        className="max-w-[1200px] w-full mx-auto"
        style={{ willChange: 'transform' }}
        initial={false}
        animate={{
          y: isSplash && !isMobile ? 'calc(50vh - 14rem)' : 0,
        }}
        transition={{
          duration: t.splash.transition,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <article id="hero" className="flex flex-col gap-8 lg:gap-10">
          <HeroContent />
          <IntroPanel />
        </article>
      </motion.div>
    </motion.section>
  );
}
