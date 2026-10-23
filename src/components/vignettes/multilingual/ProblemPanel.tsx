'use client';

import { motion } from 'framer-motion';
import { useVignetteEntrance } from '@/lib/vignette-entrance-context';
import { ProblemStateLayout } from '@/components/vignettes/shared/ProblemStateLayout';

interface CycleWindow {
  code: string;
  flag: string;
  language: string;
  title: string;
  text: string;
}

// Three separate cycles - each language has its own cycle, shown as separate "windows"
const cycleWindows: CycleWindow[] = [
  {
    code: 'fr',
    flag: '🇫🇷',
    language: 'French',
    title: 'Q1 Performance Cycle (French)',
    text: "Comment cette personne a-t-elle performé au cours de cette période d'évaluation?",
  },
  {
    code: 'es',
    flag: '🇪🇸',
    language: 'Spanish',
    title: 'Q1 Performance Cycle (Spanish)',
    text: '¿Cómo se desempeñó esta persona durante este período de evaluación?',
  },
  {
    code: 'dv',
    flag: '🇲🇻',
    language: 'Dhivehi',
    title: 'Q1 Performance Cycle (Dhivehi)',
    text: 'މި މީހާ މި ރިވިއު ތެރޭގައި ކިހިނެއް ކުރިއަރައިފި؟',
  }
];

export default function ProblemPanel() {
  const { entranceDelay, stagger, reducedMotion } = useVignetteEntrance();

  // Staggered positions for desktop - showing the weight of repetition
  const positions = [
    { x: '5%', y: '0%', rotate: -2 },
    { x: '32%', y: '25%', rotate: 1 },
    { x: '55%', y: '50%', rotate: -1 },
  ];

  const renderCycleWindow = (window: CycleWindow, index: number, showCycleNumber = false) => (
    <>
      {/* Window chrome - browser-like header */}
      <div className="px-3 py-2 bg-black/5 border-b border-border flex items-center gap-2">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF5F56]" />
          <span className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
          <span className="w-2 h-2 rounded-full bg-[#27CA40]" />
        </div>
        {/* Flag and language */}
        <span className="text-sm ml-1">{window.flag}</span>
        <span className="text-caption font-medium text-secondary">
          {window.language} Cycle
        </span>
        {/* Cycle number badge */}
        {showCycleNumber && (
          <span className="ml-auto text-[10px] font-medium text-tertiary bg-black/5 px-1.5 py-0.5 rounded">
            #{index + 1}
          </span>
        )}
      </div>

      {/* Window content - translation field */}
      <div className="p-3 bg-background-elevated">
        <p
          className="text-body-sm text-primary/80 leading-relaxed line-clamp-2"
          style={window.code === 'dv' ? { direction: 'rtl' } : undefined}
        >
          {window.text}
        </p>
      </div>
    </>
  );

  return (
    <ProblemStateLayout>
      {/* Mobile: Overlapping windows showing duplication burden */}
      <div className="relative w-full h-[280px] lg:hidden">
        {cycleWindows.map((window, index) => (
          <motion.div
            key={window.code}
            className="absolute w-[88%] max-w-[300px] bg-background-elevated rounded-lg border border-border shadow-sm overflow-hidden"
            style={{
              left: `${index * 5}%`,
              top: `${index * 32}px`,
              zIndex: 3 - index,
            }}
            initial={{ opacity: 0, y: 20, x: -10 }}
            animate={{
              opacity: 1 - index * 0.1,
              y: 0,
              x: 0
            }}
            transition={{
              duration: 0.4,
              delay: reducedMotion ? 0 : entranceDelay + index * stagger,
              ease: 'easeOut' as const,
            }}
          >
            {renderCycleWindow(window, index)}
          </motion.div>
        ))}
        {/* Repetition indicator */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-caption text-tertiary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reducedMotion ? 0 : entranceDelay + 0.6 }}
        >
          <span className="material-icons-outlined text-[14px]">repeat</span>
          <span>Same setup, 3 times</span>
        </motion.div>
      </div>

      {/* Desktop: Diagonal cascade showing repetitive workflow */}
      <div className="hidden lg:block relative w-full h-[300px]">
        {cycleWindows.map((window, index) => {
          const pos = positions[index];
          return (
            <motion.div
              key={window.code}
              className="absolute bg-background-elevated rounded-lg border border-border/60 shadow-md overflow-hidden cursor-default"
              style={{
                width: 260,
                left: pos.x,
                top: pos.y,
                zIndex: 3 - index,
              }}
              initial={{
                opacity: 0,
                scale: 0.95,
                rotate: pos.rotate,
                y: 20
              }}
              animate={{
                opacity: 1 - index * 0.08,
                scale: 1,
                rotate: pos.rotate,
                y: 0
              }}
              whileHover={{
                scale: 1.02,
                rotate: 0,
                zIndex: 10,
                opacity: 1,
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
              }}
              transition={{
                duration: 0.45,
                delay: reducedMotion ? 0 : entranceDelay + index * 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              {renderCycleWindow(window, index, true)}
            </motion.div>
          );
        })}

        {/* Repetition arrows showing the tedious process */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" opacity="0.4" />
            </marker>
          </defs>
          <motion.path
            d="M 200 55 Q 220 80 240 95"
            stroke="var(--muted-foreground)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            fill="none"
            markerEnd="url(#arrowhead)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ delay: reducedMotion ? 0 : entranceDelay + 0.5, duration: 0.5 }}
          />
          <motion.path
            d="M 360 130 Q 380 155 400 170"
            stroke="var(--muted-foreground)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            fill="none"
            markerEnd="url(#arrowhead)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ delay: reducedMotion ? 0 : entranceDelay + 0.65, duration: 0.5 }}
          />
        </svg>

        {/* Workflow burden indicator */}
        <motion.div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-2 text-caption text-tertiary bg-background/80 px-3 py-1.5 rounded-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reducedMotion ? 0 : entranceDelay + 0.85 }}
        >
          <span className="material-icons-outlined text-[14px]">repeat</span>
          <span>Repeat setup for every language</span>
        </motion.div>
      </div>
    </ProblemStateLayout>
  );
}
