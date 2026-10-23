'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VignetteStageProvider, useVignetteStage, VignetteStage } from '@/lib/vignette-stage-context';
import type { VignetteId } from '@/lib/analytics';
import { timing, timingReduced } from '@/lib/animations';
import { useReducedMotion } from '@/lib/useReducedMotion';
import type { StageContent } from './types';

interface VignetteStagedProps {
  children: ReactNode;
  stages?: {
    solution?: StageContent;
    designNotes?: StageContent;
  };
  designNotesPanel?: ReactNode;
  className?: string;
  vignetteId: VignetteId;
  initialStage?: VignetteStage;
}

function VignetteStagedInner({
  children,
  stages,
  designNotesPanel,
  className = ''
}: Omit<VignetteStagedProps, 'vignetteId' | 'initialStage'>) {
  const { stage, goToDesignNotes } = useVignetteStage();
  const [showDesignNotesCta, setShowDesignNotesCta] = useState(false);
  const reducedMotion = useReducedMotion();
  const t = reducedMotion ? timingReduced : timing;

  // Show design notes CTA when in solution stage (with small delay for entrance animation)
  useEffect(() => {
    if (stage === 'solution') {
      const timer = setTimeout(() => {
        setShowDesignNotesCta(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowDesignNotesCta(false);
    }
  }, [stage]);

  const currentStageContent = stages?.[stage as 'solution' | 'designNotes'];

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {stage === 'designNotes' && designNotesPanel ? (
          <motion.div
            key="designNotes"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: t.stage.panelDuration, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-6"
          >
            {/* Iterations header */}
            {currentStageContent?.title && (
              <div className="space-y-2">
                <h3 className="type-body font-display">
                  {currentStageContent.title}
                </h3>
                {currentStageContent.description && (
                  <p className="type-body text-secondary">
                    {currentStageContent.description}
                  </p>
                )}
              </div>
            )}

            {designNotesPanel}
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: t.stage.panelDuration, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-6"
          >
            {children}

            {/* Design notes CTA - appears when in solution stage */}
            <AnimatePresence>
              {showDesignNotesCta && stages?.solution?.cta && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  className="pt-2"
                >
                  <button
                    onClick={goToDesignNotes}
                    className="btn-interactive btn-secondary group inline-flex items-center gap-2"
                  >
                    <span>{stages.solution.cta}</span>
                    <motion.span
                      className="material-icons-outlined text-[18px]"
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.15 }}
                    >
                      arrow_forward
                    </motion.span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VignetteStaged(props: VignetteStagedProps) {
  return (
    <VignetteStageProvider initialStage={props.initialStage ?? 'solution'} vignetteId={props.vignetteId}>
      <VignetteStagedInner {...props} />
    </VignetteStageProvider>
  );
}

// Export hook for child components to access stage
export { useVignetteStage } from '@/lib/vignette-stage-context';
export type { VignetteStage };
