'use client';

import { motion, AnimatePresence } from 'framer-motion';
import TerminalPanel from './TerminalPanel';
import PrototypePreview from './PrototypePreview';
import { useSandboxDemo } from './useSandboxDemo';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { prototypingContent } from './content';
import type { DesignerItem } from './content';
import type { DecisionStory } from '../shared/DecisionStories';

interface SandboxPanelProps {
  className?: string;
  activeStory?: DecisionStory | null;
}

// Get dim style for story-driven highlighting
function getDimStyle(activeStory: DecisionStory | null, section: number) {
  if (!activeStory) return {};

  const highlighted = activeStory.highlightSection;

  // Story 1 (build-it-yourself, section 1): sandbox full, terminal dim
  // Story 2 (remix-workflow, section 2): terminal full, sandbox+grid dim
  // Story 3 (impact, section 3): sandbox+grid full, terminal dim

  if (highlighted === 1) {
    // Highlight sandbox container, dim terminal
    return section === 2 ? { opacity: 0.4, transition: 'opacity 0.3s ease-in-out' } : {};
  }
  if (highlighted === 2) {
    // Highlight terminal, dim sandbox+grid
    return section === 2 ? {} : { opacity: 0.4, transition: 'opacity 0.3s ease-in-out' };
  }
  if (highlighted === 3) {
    // Highlight sandbox+grid (people + stats), dim terminal
    return section === 2 ? { opacity: 0.4, transition: 'opacity 0.3s ease-in-out' } : {};
  }

  return {};
}

// Designer card component with refined styling
function DesignerCard({
  designer,
  isNew = false,
}: {
  designer: DesignerItem;
  isNew?: boolean;
}) {
  const reducedMotion = useReducedMotion();

  const cardContent = (
    <div
      className={`
        group relative flex items-center gap-3 rounded-lg p-2.5 sm:p-3
        bg-white/60 backdrop-blur-sm
        border border-black/[0.04]
        shadow-[0_1px_2px_rgba(0,0,0,0.04)]
        hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]
        hover:border-black/[0.08]
        hover:bg-white/80
        transition-all duration-200 ease-out
        ${isNew ? 'ring-2 ring-offset-2 ring-offset-white' : ''}
      `}
      style={isNew ? { '--tw-ring-color': designer.avatarColor } as React.CSSProperties : undefined}
    >
      {/* Avatar — soft tinted background with colored initials */}
      <div className="relative flex-shrink-0">
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-medium"
          style={{
            backgroundColor: `${designer.avatarColor}1f`,
            color: designer.avatarColor,
          }}
        >
          {designer.initials}
        </div>
      </div>

      {/* Name and role */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] sm:text-sm text-neutral-800 font-medium truncate leading-tight !m-0">
          {designer.name}
        </p>
        <p className="text-[11px] text-neutral-400 truncate !m-0">Designer</p>
      </div>

      {/* Hover chevron */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-neutral-300">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );

  if (isNew) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: reducedMotion ? 0.1 : 0.35,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
}

function SolutionState({
  activeStory = null,
}: {
  activeStory?: DecisionStory | null;
}) {
  const demo = useSandboxDemo();
  const content = prototypingContent;

  return (
    <div className="w-full space-y-2">
      {/* Main Sandbox Container */}
      <div
        className="relative rounded-xl overflow-hidden w-full"
        style={{
          backgroundImage: 'linear-gradient(to bottom, #fafafa 0%, #f5f5f5 100%)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: '8px',
          ...getDimStyle(activeStory, 1),
        }}
      >
        {/* App Bar Header */}
        <div
          className="px-3 py-2.5 border-b border-black/[0.06]"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <h3 className="text-[13px] font-semibold text-neutral-800 leading-tight !m-0">
            <span className="text-neutral-400 font-normal">Culture Amp</span>{' '}
            <span>Design Sandbox</span>
          </h3>
        </div>

        {/* Content area */}
        <div className="p-2.5">
          <AnimatePresence mode="wait">
            {demo.showPreview ? (
              <motion.div
                key="prototype-preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PrototypePreview
                  isVisible={demo.showPreview}
                  prototypeName={demo.newPrototype.name}
                  onReset={demo.reset}
                  isComplete={demo.phase === 'prototypeCreated'}
                />
              </motion.div>
            ) : (
              <motion.div
                key="designer-directory"
                className="relative grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {content.designers.map((designer) => (
                  <DesignerCard key={designer.id} designer={designer} />
                ))}

                {/* New designer card - appears after /add-designer */}
                <AnimatePresence>
                  {demo.showNewDesigner && (
                    <DesignerCard
                      key="new-designer"
                      designer={demo.newDesigner}
                      isNew
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Interactive Terminal */}
      <div
        className="relative"
        style={getDimStyle(activeStory, 2)}
      >
        <TerminalPanel
          messages={demo.terminalMessages}
          phase={demo.phase}
          onPromptName={demo.promptForName}
          onSubmitName={demo.submitDesignerName}
          onAddPrototype={demo.startAddPrototype}
          onReset={demo.reset}
          isAnimating={demo.isAnimating}
        />
      </div>

      {/* New designer notification */}
      <AnimatePresence>
        {demo.showNewDesigner && demo.phase === 'designerAdded' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' as const }}
            className="flex items-center justify-between bg-background-subtle rounded-lg px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-body-sm text-primary">
                {demo.newDesigner.name} added to the team
              </span>
            </div>
            <button
              onClick={demo.reset}
              className="text-caption text-muted-foreground hover:text-primary transition-colors"
            >
              Try again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SandboxPanel({
  className = '',
  activeStory = null,
}: SandboxPanelProps) {
  return (
    <div className={className}>
      <SolutionState activeStory={activeStory} />
    </div>
  );
}
