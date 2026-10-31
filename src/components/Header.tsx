'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SiteHeaderBar from './SiteHeaderBar';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { trackExternalLinkClicked } from '@/lib/analytics';

// The sticky bar is 56px tall (h-14).
const HEADER_HEIGHT = 56;

interface HeaderProps {
  /** The element whose scrolling out of view brings the sticky header in. */
  targetId?: string;
  /** Intersection margin for that element; the home hero is tall, so it triggers a little early. */
  rootMargin?: string;
  /** Where the monogram goes. Leave out to scroll to the top of the page. */
  homeHref?: string;
  /** A tinted band at the top of the page. While the header sits over it, the header takes its colour. */
  bandId?: string;
  bandColor?: string;
}

export default function Header({ targetId = 'hero', rootMargin = '-80px 0px 0px 0px', homeHref, bandId, bandColor }: HeaderProps) {
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [overBand, setOverBand] = useState(false);

  // Over the tinted band the header matches it; below the band it matches the white page.
  useEffect(() => {
    if (!bandId) return;
    const update = () => {
      const band = document.getElementById(bandId);
      setOverBand(!!band && band.getBoundingClientRect().bottom > HEADER_HEIGHT);
    };
    const frame = requestAnimationFrame(update);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [bandId]);

  // Watch for when hero name scrolls out of view
  useEffect(() => {
    const heroElement = document.getElementById(targetId);
    if (!heroElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show header when hero is NOT intersecting (scrolled past)
        setIsVisible(!entry.isIntersecting);
      },
      {
        // Trigger when the top of hero leaves viewport
        rootMargin,
        threshold: 0,
      }
    );

    observer.observe(heroElement);
    return () => observer.disconnect();
  }, [targetId, rootMargin]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          className={`fixed top-0 left-0 right-0 z-50 px-6 lg:px-10 2xl:px-16 border-b transition-colors duration-300 ${
            bandId ? 'border-black/5' : 'bg-background/85 backdrop-blur-xl border-border/50'
          }`}
          style={bandId ? { backgroundColor: overBand && bandColor ? bandColor : '#ffffff' } : undefined}
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
            homeHref={homeHref}
            onLinkedInClick={() => trackExternalLinkClicked('header-linkedin', 'https://www.linkedin.com/in/marcusriggall')}
            onGitHubClick={() => trackExternalLinkClicked('header-github', 'https://github.com/marcustroy')}
          />
        </motion.header>
      )}
    </AnimatePresence>
  );
}
