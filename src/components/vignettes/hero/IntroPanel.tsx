'use client';

import { useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { introContent, IntroLink } from './content';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useIntroSequence } from '@/lib/intro-sequence-context';
import { timing, timingReduced, easings } from '@/lib/animations';

// Type for animatable units (word or link)
type AnimatableUnit =
  | { type: 'word'; content: string }
  | { type: 'link'; linkKey: string; link: IntroLink };

// Parse a single line into animatable units (words and links)
function parseLineIntoAnimatableUnits(
  line: string,
  links: Record<string, IntroLink>
): AnimatableUnit[] {
  const units: AnimatableUnit[] = [];
  const regex = /\{\{(\w+)\}\}/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(line)) !== null) {
    // Add words before the link
    if (match.index > lastIndex) {
      const text = line.slice(lastIndex, match.index);
      const words = text.split(/\s+/).filter(Boolean);
      words.forEach((word) => {
        units.push({ type: 'word', content: word });
      });
    }

    // Add the link as a single unit
    const linkKey = match[1];
    const link = links[linkKey];
    if (link) {
      units.push({ type: 'link', linkKey, link });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining words
  if (lastIndex < line.length) {
    const text = line.slice(lastIndex);
    const words = text.split(/\s+/).filter(Boolean);
    words.forEach((word) => {
      units.push({ type: 'word', content: word });
    });
  }

  return units;
}

// Render a single line with inline links (for reduced motion)
function renderLineWithLinks(
  line: string,
  links: Record<string, IntroLink>,
  keyPrefix: string
) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  const regex = /\{\{(\w+)\}\}/g;
  let match;

  while ((match = regex.exec(line)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index));
    }

    // Add the link
    const linkKey = match[1];
    const link = links[linkKey];
    if (link) {
      parts.push(
        <a
          key={`${keyPrefix}-${linkKey}`}
          href={link.url}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noopener noreferrer' : undefined}
          className="underline underline-offset-2 decoration-primary/40 hover:decoration-primary transition-colors duration-200"
        >
          {link.text}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }

  return parts;
}

export default function IntroPanel() {
  const reducedMotion = useReducedMotion();
  const t = reducedMotion ? timingReduced : timing;
  const { setStage, isComplete } = useIntroSequence();

  // Paragraph delay: after name reveal + role fade + small gap
  const paragraphDelay = t.intro.nameReveal + t.intro.stageDelay;

  // Set complete stage after splash ends AND slide-up finishes
  useEffect(() => {
    if (reducedMotion) {
      setStage('complete');
      return;
    }

    // Wait for: splash duration + slide-up transition + small buffer
    const totalDuration = t.splash.duration + t.splash.transition + 0.2;
    const timer = setTimeout(() => {
      setStage('complete');
    }, totalDuration * 1000);

    return () => clearTimeout(timer);
  }, [reducedMotion, setStage, t]);

  if (introContent.lines.length === 0) return null;

  // For reduced motion or scroll-skipped intro, show final state immediately
  if (reducedMotion || isComplete) {
    return (
      <div className="max-w-[544px] lg:max-w-[400px] xl:max-w-[440px]">
        <div className="text-body text-primary tracking-[-0.01em] space-y-4 text-wrap-balance">
          {introContent.lines.map((line, lineIndex) => (
            <p key={lineIndex}>
              {renderLineWithLinks(line, introContent.links, `line-${lineIndex}`)}
            </p>
          ))}
        </div>
      </div>
    );
  }

  // Parse all lines into animatable units
  const lineUnits = introContent.lines.map((line) =>
    parseLineIntoAnimatableUnits(line, introContent.links)
  );

  // Calculate cumulative delay for each line based on word count of previous lines
  const linePauseDuration = 0.3; // Pause between lines
  const getLineDelay = (lineIndex: number) => {
    let delay = paragraphDelay;
    for (let i = 0; i < lineIndex; i++) {
      // Add time for all words in previous lines + pause
      delay += lineUnits[i].length * t.intro.paragraphStagger + linePauseDuration;
    }
    return delay;
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: t.intro.stageDuration,
        ease: easings.decel,
      },
    },
  };

  return (
    <div className="max-w-[544px] lg:max-w-[400px] xl:max-w-[440px]">
      <div className="text-body text-primary tracking-[-0.01em] space-y-4 text-wrap-balance">
        {lineUnits.map((units, lineIndex) => (
          <motion.p
            key={lineIndex}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: t.intro.paragraphStagger,
                  delayChildren: getLineDelay(lineIndex),
                },
              },
            }}
          >
            {units.map((unit, index) => {
              if (unit.type === 'link') {
                return (
                  <motion.a
                    key={`line-${lineIndex}-link-${unit.linkKey}`}
                    href={unit.link.url}
                    target={unit.link.external ? '_blank' : undefined}
                    rel={unit.link.external ? 'noopener noreferrer' : undefined}
                    className="underline underline-offset-2 decoration-primary/40 hover:decoration-primary transition-colors duration-200"
                    variants={wordVariants}
                    style={{ display: 'inline-block' }}
                  >
                    {unit.link.text}
                  </motion.a>
                );
              }

              return (
                <motion.span
                  key={`line-${lineIndex}-word-${index}`}
                  variants={wordVariants}
                  style={{ display: 'inline-block' }}
                >
                  {unit.content}
                  {index < units.length - 1 && '\u00A0'}
                </motion.span>
              );
            })}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
