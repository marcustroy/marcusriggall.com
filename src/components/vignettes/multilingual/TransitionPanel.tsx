'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface TransitionPanelProps {
  onComplete: () => void;
}

type TransitionState = 'scattered' | 'stacking' | 'complete';

const cycleWindows = [
  {
    code: 'fr',
    flag: '🇫🇷',
    language: 'French',
    text: "Comment cette personne a-t-elle performé au cours de cette période d'évaluation?",
  },
  {
    code: 'es',
    flag: '🇪🇸',
    language: 'Spanish',
    text: '¿Cómo se desempeñó esta persona durante este período de evaluación?',
  },
  {
    code: 'dv',
    flag: '🇲🇻',
    language: 'Dhivehi',
    text: 'މި މީހާ މި ރިވިއު ތެރޭގައި ކިހިނެއް ކުރިއަރައިފި؟',
  }
];

// Match problem state positions exactly
const scatteredPositions = [
  { x: '5%', y: '0%', rotate: -2 },
  { x: '32%', y: '25%', rotate: 1 },
  { x: '55%', y: '50%', rotate: -1 },
];

export default function TransitionPanel({ onComplete }: TransitionPanelProps) {
  const reducedMotion = useReducedMotion();
  const [state, setState] = useState<TransitionState>('scattered');

  const scatterDuration = reducedMotion ? 100 : 300;
  const stackDuration = reducedMotion ? 300 : 600;

  useEffect(() => {
    const stackTimer = setTimeout(() => {
      setState('stacking');
    }, scatterDuration);

    return () => clearTimeout(stackTimer);
  }, [scatterDuration]);

  useEffect(() => {
    if (state !== 'stacking') return;

    const completeTimer = setTimeout(() => {
      setState('complete');
      onComplete();
    }, stackDuration);

    return () => clearTimeout(completeTimer);
  }, [state, stackDuration, onComplete]);

  const isStacking = state === 'stacking' || state === 'complete';

  return (
    <div className="w-full">
      <div className="relative h-[300px]">
        {cycleWindows.map((window, index) => {
          const pos = scatteredPositions[index];

          return (
            <motion.div
              key={window.code}
              className="absolute bg-background-elevated rounded-lg border border-border/60 shadow-md overflow-visible"
              style={{
                width: 260,
                zIndex: isStacking ? 3 - index : 3 - index,
              }}
              initial={{
                left: pos.x,
                top: pos.y,
                rotate: pos.rotate,
                scale: 1,
                opacity: 1 - index * 0.08,
              }}
              animate={{
                left: isStacking ? '50%' : pos.x,
                top: isStacking ? `${index * 12}px` : pos.y,
                x: isStacking ? '-50%' : 0,
                rotate: isStacking ? 0 : pos.rotate,
                scale: isStacking ? 1 - index * 0.02 : 1,
                opacity: 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 25,
                delay: reducedMotion ? 0 : index * 0.05,
              }}
            >
              {/* Window chrome - matching problem state */}
              <div className="px-3 py-2 bg-black/5 border-b border-border flex items-center gap-2 rounded-t-lg">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                  <span className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                  <span className="w-2 h-2 rounded-full bg-[#27CA40]" />
                </div>
                <span className="text-sm ml-1">{window.flag}</span>
                <span className="text-caption font-medium text-secondary">
                  {isStacking && index === 0 ? 'Unified Cycle' : `${window.language} Cycle`}
                </span>
                {!isStacking && (
                  <span className="ml-auto text-[10px] font-medium text-tertiary bg-black/5 px-1.5 py-0.5 rounded">
                    #{index + 1}
                  </span>
                )}
              </div>

              <div className="p-3 bg-background-elevated rounded-b-lg">
                <p
                  className="text-body-sm text-primary/80 leading-relaxed line-clamp-2"
                  style={window.code === 'dv' ? { direction: 'rtl' } : undefined}
                >
                  {window.text}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
