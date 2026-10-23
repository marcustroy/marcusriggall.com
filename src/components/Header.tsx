'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SiteHeaderBar from './SiteHeaderBar';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { trackExternalLinkClicked } from '@/lib/analytics';

export default function Header() {
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  // Watch for when hero name scrolls out of view
  useEffect(() => {
    const heroElement = document.getElementById('hero');
    if (!heroElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show header when hero is NOT intersecting (scrolled past)
        setIsVisible(!entry.isIntersecting);
      },
      {
        // Trigger when the top of hero leaves viewport
        rootMargin: '-80px 0px 0px 0px',
        threshold: 0,
      }
    );

    observer.observe(heroElement);
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-10 2xl:px-16 bg-background/85 backdrop-blur-xl border-b border-border/50"
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -64, opacity: 0 }}
          transition={{
            duration: reducedMotion ? 0.15 : 0.25,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <SiteHeaderBar
            onHome
            onLinkedInClick={() => trackExternalLinkClicked('header-linkedin', 'https://www.linkedin.com/in/marcusriggall')}
            onGitHubClick={() => trackExternalLinkClicked('header-github', 'https://github.com/marcustroy')}
          />
        </motion.header>
      )}
    </AnimatePresence>
  );
}
