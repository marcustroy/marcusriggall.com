'use client';

import { motion } from 'framer-motion';
import { heroContent, introContent } from './content';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { timing, timingReduced } from '@/lib/animations';
import MrMonogram from '@/components/work/MrMonogram';
import { LinkedInIcon, GitHubIcon, ResumeButton, RESUME_URL, iconButtonClass } from '@/components/SiteHeaderBar';
import { trackExternalLinkClicked } from '@/lib/analytics';
import ThemeToggle from '@/components/ThemeToggle';

const LINKEDIN_URL = 'https://www.linkedin.com/in/marcusriggall';
const GITHUB_URL = 'https://github.com/marcustroy';

export default function HeroContent() {
  const reducedMotion = useReducedMotion();
  const t = reducedMotion ? timingReduced : timing;

  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* The MR initials, written on as they load */}
        <MrMonogram color="var(--primary)" className="w-20 shrink-0" />

        {/* All text in single column */}
        <div className="flex flex-col gap-1">
          {/* Name with pixel font */}
          <h1 className="type-pixel whitespace-nowrap !m-0">
            {heroContent.headline}
          </h1>

          {/* Tagline */}
          {introContent.role && <motion.span
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
          </motion.span>}

          <span className="type-small">Designed & built in Melbourne, Australia</span>
        </div>
        </div>

      {/* Social links */}
      <div className="flex items-center gap-1">
        <ResumeButton onClick={() => trackExternalLinkClicked('hero-resume', RESUME_URL)} />
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className={iconButtonClass()}
          onClick={() => trackExternalLinkClicked('hero-linkedin', LINKEDIN_URL)}
        >
          <LinkedInIcon />
        </a>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className={iconButtonClass()}
          onClick={() => trackExternalLinkClicked('hero-github', GITHUB_URL)}
        >
          <GitHubIcon />
        </a>
        <ThemeToggle />
      </div>
    </div>
  );
}
