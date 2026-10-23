'use client';

import { motion, Variants } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { easings } from '@/lib/animations';

interface TextRevealProps {
  text: string;
  mode: 'characters' | 'words';
  staggerDelay?: number;
  duration?: number;
  className?: string;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3';
}

export default function TextReveal({
  text,
  mode,
  staggerDelay = mode === 'characters' ? 0.06 : 0.04,
  duration = 0.4,
  className = '',
  as: Tag = 'span',
}: TextRevealProps) {
  const reducedMotion = useReducedMotion();

  // Create variants with actual values baked in
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: easings.decel,
      },
    },
  };

  if (reducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  if (mode === 'characters') {
    // Split into characters, treating spaces specially
    const characters = text.split('');

    return (
      <Tag className={className} aria-label={text}>
        <motion.span
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'inline' }}
        >
          {characters.map((char, index) => {
            // Spaces render immediately (no animation)
            if (char === ' ') {
              return (
                <span key={index} style={{ whiteSpace: 'pre' }}>
                  {' '}
                </span>
              );
            }

            return (
              <motion.span
                key={index}
                variants={itemVariants}
                style={{ display: 'inline-block' }}
              >
                {char}
              </motion.span>
            );
          })}
        </motion.span>
      </Tag>
    );
  }

  // Word mode - split by spaces
  const words = text.split(' ');

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'inline' }}
      >
        {words.map((word, index) => (
          <span key={index} style={{ display: 'inline' }}>
            <motion.span
              variants={itemVariants}
              style={{ display: 'inline-block' }}
            >
              {word}
            </motion.span>
            {index < words.length - 1 && ' '}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
