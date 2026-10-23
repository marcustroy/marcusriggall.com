'use client';

import { MotionConfig } from 'framer-motion';

// Honour prefers-reduced-motion for every framer-motion animation on the site.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
