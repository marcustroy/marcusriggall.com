import type { Easing } from 'framer-motion';

export const redlineAnimations = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.4 },
  },

  panelTransform: {
    active: { scale: 0.98 },
    inactive: { scale: 1 },
    transition: { duration: 0.4, ease: 'easeOut' as Easing },
  },

  annotation: (index: number, position: 'left' | 'right') => ({
    container: {
      initial: { opacity: 0, x: position === 'right' ? -20 : 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: position === 'right' ? -20 : 20 },
      transition: { duration: 0.3, delay: index * 0.1, ease: 'easeOut' as Easing },
    },
    connector: {
      initial: { scaleX: 0 },
      animate: { scaleX: 1 },
      transition: { duration: 0.15, delay: index * 0.1 },
    },
    dot: {
      initial: { scale: 0 },
      animate: { scale: [0, 1.3, 1] },
      transition: {
        duration: 0.4,
        delay: index * 0.1 + 0.15,
        ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
      },
    },
  }),
};

// Reduced motion variants
export const redlineAnimationsReduced = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.1 },
  },
  panelTransform: {
    active: { scale: 1 },
    inactive: { scale: 1 },
    transition: { duration: 0 },
  },
  annotation: () => ({
    container: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.1 },
    },
    connector: {
      initial: { scaleX: 1 },
      animate: { scaleX: 1 },
      transition: { duration: 0 },
    },
    dot: {
      initial: { scale: 1 },
      animate: { scale: 1 },
      transition: { duration: 0 },
    },
  }),
};
