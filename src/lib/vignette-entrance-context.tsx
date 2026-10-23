'use client';

import { createContext, useContext, ReactNode } from 'react';
import { timing, timingReduced } from './animations';
import { useReducedMotion } from './useReducedMotion';

interface VignetteEntranceContextValue {
  /** Delay before panel content should start animating (in seconds) */
  entranceDelay: number;
  /** Stagger value for sequential items (in seconds) */
  stagger: number;
  /** Whether reduced motion is preferred */
  reducedMotion: boolean;
}

const VignetteEntranceContext = createContext<VignetteEntranceContextValue>({
  entranceDelay: 0,
  stagger: 0.1,
  reducedMotion: false,
});

interface VignetteEntranceProviderProps {
  children: ReactNode;
  /** Override the default entrance delay */
  delay?: number;
}

export function VignetteEntranceProvider({
  children,
  delay
}: VignetteEntranceProviderProps) {
  const reducedMotion = useReducedMotion();
  const t = reducedMotion ? timingReduced : timing;

  const value: VignetteEntranceContextValue = {
    entranceDelay: delay ?? t.entrance.cards,
    stagger: t.stagger.normal,
    reducedMotion,
  };

  return (
    <VignetteEntranceContext.Provider value={value}>
      {children}
    </VignetteEntranceContext.Provider>
  );
}

/**
 * Hook to get entrance timing for panel content
 *
 * Usage in panels:
 * ```tsx
 * const { entranceDelay, stagger } = useVignetteEntrance();
 *
 * <motion.div
 *   transition={{ delay: entranceDelay + index * stagger }}
 * />
 * ```
 */
export function useVignetteEntrance() {
  return useContext(VignetteEntranceContext);
}
