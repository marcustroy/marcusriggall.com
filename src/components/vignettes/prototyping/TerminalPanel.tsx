'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import type { TerminalMessage, DemoPhase } from './useSandboxDemo';

interface TerminalPanelProps {
  messages: TerminalMessage[];
  phase: DemoPhase;
  onPromptName: () => void;
  onSubmitName: (name: string) => void;
  onAddPrototype: () => void;
  onReset: () => void;
  isAnimating: boolean;
  highlightStyle?: React.CSSProperties;
}

// Get tool icon and label based on the tool text
function getToolInfo(text: string): { icon: string; label: string; path: string } {
  if (text.startsWith('npm ') || text.startsWith('vercel ')) {
    return { icon: '⌘', label: 'Bash', path: text };
  }
  if (text.includes('/config.') || text.includes('.json')) {
    return { icon: '◔', label: 'Read', path: text };
  }
  if (text.includes('styles') || text.includes('.css')) {
    return { icon: '✎', label: 'Edit', path: text };
  }
  return { icon: '□', label: 'Write', path: text };
}

function ToolMessage({ message }: { message: TerminalMessage }) {
  const reducedMotion = useReducedMotion();
  const { icon, label, path } = getToolInfo(message.text);
  const isRunning = message.toolStatus === 'running';

  return (
    <motion.div
      className="flex items-center gap-2 py-1"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: reducedMotion ? 0.05 : 0.15 }}
    >
      {/* Status indicator */}
      <div className="w-4 flex justify-center">
        {isRunning ? (
          <motion.span
            className="text-blue-400 text-xs"
            animate={reducedMotion ? {} : { opacity: [1, 0.4, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ●
          </motion.span>
        ) : (
          <span className="text-green-400 text-xs">✓</span>
        )}
      </div>

      {/* Tool badge */}
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1e1e22] text-[10px] text-gray-400 font-medium">
        <span>{icon}</span>
        <span>{label}</span>
      </span>

      {/* Path/command */}
      <span className="text-gray-300 text-[11px] truncate">{path}</span>
    </motion.div>
  );
}

function MessageLine({ message }: { message: TerminalMessage }) {
  const reducedMotion = useReducedMotion();

  const messageVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0.05 : 0.15, ease: 'easeOut' as const },
    },
  };

  if (message.type === 'command') {
    return (
      <motion.div
        className="flex items-start gap-2"
        variants={messageVariants}
        initial="hidden"
        animate="visible"
      >
        <span className="text-[#D4A27F] select-none">&gt;</span>
        <span className="text-gray-100">{message.text}</span>
      </motion.div>
    );
  }

  if (message.type === 'tool') {
    return <ToolMessage message={message} />;
  }

  if (message.type === 'tool-result') {
    return (
      <motion.div
        className="pl-6 text-[11px] text-gray-500"
        variants={messageVariants}
        initial="hidden"
        animate="visible"
      >
        {message.text}
      </motion.div>
    );
  }

  if (message.type === 'success') {
    return (
      <motion.div
        className="flex items-center gap-2 py-1 text-gray-300"
        variants={messageVariants}
        initial="hidden"
        animate="visible"
      >
        <span className="text-green-400">✓</span>
        <span>{message.text.replace(/^✓\s*/, '')}</span>
      </motion.div>
    );
  }

  // Default output (agent thinking/response)
  return (
    <motion.div
      className="text-gray-400 py-1 text-[11px]"
      variants={messageVariants}
      initial="hidden"
      animate="visible"
    >
      {message.text}
    </motion.div>
  );
}

function ActionButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-[12px] px-3.5 py-2 rounded-md bg-[#1f1f23] hover:bg-[#2a2a30] text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono"
    >
      {children}
    </button>
  );
}

function NameInputForm({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="mt-1.5"
    >
      <div className="flex items-center gap-1.5">
        <span className="text-gray-500">--name</span>
        <span className="text-gray-500">&quot;</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoFocus
          className="flex-1 bg-transparent text-gray-100 outline-none placeholder:text-gray-600 min-w-0"
        />
        <span className="text-gray-500">&quot;</span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <button
          type="submit"
          className="text-[11px] px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors font-mono"
        >
          Add me →
        </button>
        <span className="text-[10px] text-gray-600">or press Enter</span>
      </div>
    </motion.form>
  );
}

export default function TerminalPanel({
  messages,
  phase,
  onPromptName,
  onSubmitName,
  onAddPrototype,
  onReset,
  isAnimating,
  highlightStyle,
}: TerminalPanelProps) {
  const showIdleState = phase === 'idle';
  const showNamePrompt = phase === 'promptingName';
  const showCompletionButtons = phase === 'designerAdded' || phase === 'prototypeCreated';
  const showAddDesignerButton = phase === 'prototypeCreated';
  const showAddPrototypeButton = phase === 'designerAdded';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' as const, delay: 0.2 }}
      className="relative bg-[#09090B] rounded-lg w-full shadow-2xl border border-[#1f1f23] overflow-hidden"
      style={highlightStyle}
    >
      {/* TUI Header */}
      <div className="bg-[#111113] px-3 py-1.5 rounded-t-lg border-b border-[#1f1f23] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-caption text-muted-foreground font-mono ml-2">
            claude-code
          </span>
        </div>
        <span className="text-label text-gray-600 font-mono">~/.../sandbox</span>
      </div>

      {/* TUI Content */}
      <div className="p-3 font-mono text-caption leading-relaxed min-h-[100px]">
        <AnimatePresence mode="wait">
          {showIdleState ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-1.5"
            >
              <div className="text-gray-500 mb-2">Try a command:</div>
              <div className="flex flex-wrap gap-2">
                <ActionButton onClick={onPromptName} disabled={isAnimating}>
                  <code>/add-designer</code>
                </ActionButton>
                <ActionButton onClick={onAddPrototype} disabled={isAnimating}>
                  <code>/add-prototype</code>
                </ActionButton>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-1"
            >
              {messages.map((msg) => (
                <MessageLine key={msg.id} message={msg} />
              ))}

              {/* Name input prompt */}
              {showNamePrompt && <NameInputForm onSubmit={onSubmitName} />}

              {/* Action buttons after completion */}
              {showCompletionButtons && !isAnimating && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                  className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-[#1f1f23]"
                >
                  {showAddDesignerButton && (
                    <ActionButton onClick={onPromptName} disabled={isAnimating}>
                      <code>/add-designer</code>
                    </ActionButton>
                  )}
                  {showAddPrototypeButton && (
                    <ActionButton onClick={onAddPrototype} disabled={isAnimating}>
                      <code>/add-prototype</code>
                    </ActionButton>
                  )}
                  <ActionButton onClick={onReset} disabled={isAnimating}>
                    Try again
                  </ActionButton>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
