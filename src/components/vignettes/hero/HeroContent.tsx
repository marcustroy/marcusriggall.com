'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { heroContent, introContent } from './content';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { timing, timingReduced } from '@/lib/animations';
import TextReveal from './TextReveal';
import { LinkedInIcon, GitHubIcon } from '@/components/SiteHeaderBar';
import { trackExternalLinkClicked } from '@/lib/analytics';

const LINKEDIN_URL = 'https://www.linkedin.com/in/marcusriggall';
const GITHUB_URL = 'https://github.com/marcustroy';

export default function HeroContent() {
  const reducedMotion = useReducedMotion();
  const t = reducedMotion ? timingReduced : timing;

  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* Profile photo */}
        <div className="shrink-0 w-20 h-20 rounded-full overflow-hidden">
          <Image
            src="/avatars/headshot.jpg"
            alt={heroContent.name}
            width={80}
            height={80}
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* All text in single column */}
        <div className="flex flex-col gap-1">
          {/* Name with pixel font */}
          <h1 className="type-pixel whitespace-nowrap !m-0">
            <TextReveal
              text={heroContent.headline}
              mode="characters"
              staggerDelay={t.intro.nameStagger}
              duration={0.4}
            />
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
      <div className="flex items-center gap-4">
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="flex items-center p-2 -m-2 text-secondary hover:text-[#0A66C2] transition-colors duration-200"
          onClick={() => trackExternalLinkClicked('hero-linkedin', LINKEDIN_URL)}
        >
          <LinkedInIcon />
        </a>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="flex items-center p-2 -m-2 text-secondary hover:text-primary transition-colors duration-200"
          onClick={() => trackExternalLinkClicked('hero-github', GITHUB_URL)}
        >
          <GitHubIcon />
        </a>
      </div>
    </div>
  );
}
