'use client';

import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useVignetteEntrance } from '@/lib/vignette-entrance-context';

interface ProblemStackConfig {
  maxVisible?: number;
  yOffset?: number;
  xOffset?: number;
  scaleStep?: number;
  opacityStep?: number;
  cardWidth?: number;
}

interface ProblemStackProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string;
  config?: ProblemStackConfig;
  className?: string;
  cardClassName?: string;
}

const DEFAULT_CONFIG: Required<ProblemStackConfig> = {
  maxVisible: 5,
  yOffset: 28,
  xOffset: 56,
  scaleStep: 0.015,
  opacityStep: 0.08,
  cardWidth: 260,
};

export function ProblemStack<T>({
  items,
  renderItem,
  keyExtractor,
  config = {},
  className = '',
  cardClassName = '',
}: ProblemStackProps<T>) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const { entranceDelay, stagger } = useVignetteEntrance();
  const [entranceComplete, setEntranceComplete] = useState(false);

  const visibleItems = items.slice(0, mergedConfig.maxVisible);

  // Mark entrance complete after all cards have animated in
  useEffect(() => {
    const totalEntranceTime = (entranceDelay + visibleItems.length * stagger + 0.4) * 1000;
    const timer = setTimeout(() => setEntranceComplete(true), totalEntranceTime);
    return () => clearTimeout(timer);
  }, [entranceDelay, stagger, visibleItems.length]);

  const containerWidth = mergedConfig.cardWidth + (mergedConfig.maxVisible - 1) * mergedConfig.xOffset;
  // Height just needs to cover the y-offset spread; cards overflow naturally
  const containerHeight = (mergedConfig.maxVisible - 1) * mergedConfig.yOffset + 100;

  return (
    <div className={`relative mx-auto ${className}`} style={{ width: containerWidth, height: containerHeight }}>
      {visibleItems.map((item, index) => {
        const depth = mergedConfig.maxVisible - 1 - index;
        const xOffset = depth * mergedConfig.xOffset;
        const yOffset = depth * mergedConfig.yOffset;
        const scale = 1 - depth * mergedConfig.scaleStep;
        const opacity = 1 - depth * mergedConfig.opacityStep;

        return (
          <motion.div
            key={keyExtractor(item)}
            className={`absolute rounded-xl border border-border/60 shadow-sm cursor-default overflow-hidden ${cardClassName || 'bg-background-elevated px-4 py-3'}`}
            style={{
              width: mergedConfig.cardWidth,
              zIndex: mergedConfig.maxVisible - depth,
            }}
            initial={{ opacity: 0, y: yOffset + 16, x: xOffset, scale: scale * 0.95 }}
            animate={{
              opacity: opacity,
              y: yOffset,
              x: xOffset,
              scale: scale,
            }}
            whileHover={{
              scale: 1.015,
              y: yOffset - 6,
              opacity: 1,
              zIndex: 10,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
            }}
            transition={
              entranceComplete
                ? { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }
                : {
                    duration: 0.45,
                    delay: entranceDelay + index * stagger,
                    ease: [0.25, 0.1, 0.25, 1],
                  }
            }
          >
            {renderItem(item, index)}
          </motion.div>
        );
      })}
    </div>
  );
}
