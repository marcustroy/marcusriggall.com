'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackExternalLinkClicked } from '@/lib/analytics';

// Global styles for animated gradient border
function GradientBorderStyles() {
  return (
    <style jsx global>{`
      @property --gradient-angle {
        syntax: '<angle>';
        initial-value: 0deg;
        inherits: false;
      }

      @keyframes rotateGradient {
        to {
          --gradient-angle: 360deg;
        }
      }

      .mini-suggestion-border {
        position: absolute;
        inset: 0;
        border-radius: 6px;
        background: conic-gradient(
          from var(--gradient-angle),
          var(--ai-gradient-1),
          var(--ai-gradient-2),
          var(--ai-gradient-3),
          var(--ai-gradient-2),
          var(--ai-gradient-1)
        );
        animation: rotateGradient 3s linear infinite;
      }

      .mini-suggestion-content {
        position: relative;
        background: var(--background-elevated);
        width: 100%;
        height: 100%;
        border-radius: 4px;
        z-index: 1;
      }

      @media (prefers-reduced-motion: reduce) {
        .mini-suggestion-border {
          animation: none;
        }
      }
    `}</style>
  );
}

interface Message {
  delay: number;
  text: string;
  type: 'user' | 'assistant' | 'tool' | 'success';
  icon?: string;
}

const DEMO_MESSAGES: Message[] = [
  { delay: 0, text: 'Create a vignette for my portfolio homepage', type: 'user' },
  { delay: 400, text: 'I\'ll create an interactive vignette with staged reveals and design annotations.', type: 'assistant' },
  { delay: 1000, text: 'Writing Vignette.tsx', type: 'tool', icon: '📝' },
  { delay: 1400, text: 'Writing Panel.tsx', type: 'tool', icon: '📝' },
  { delay: 1800, text: 'Writing content.ts', type: 'tool', icon: '✏️' },
  { delay: 2200, text: 'Adding animations', type: 'tool', icon: '✨' },
  { delay: 2600, text: '✓ Vignette created successfully', type: 'success' }
];

const RESULT_DELAY = 3200;

interface DemoCreationFlowProps {
  onComplete?: () => void;
}

export default function DemoCreationFlow({ onComplete }: DemoCreationFlowProps) {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [mobileView, setMobileView] = useState<'chat' | 'preview'>('chat');
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const startDemo = () => {

    // Clear any existing timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    // Reset state
    setVisibleMessages([]);
    setShowResult(false);
    setIsPlaying(true);
    setMobileView('chat');

    // Schedule messages
    DEMO_MESSAGES.forEach((message) => {
      const timeout = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, message]);
      }, message.delay);
      timeoutsRef.current.push(timeout);
    });

    // Schedule result reveal
    const resultTimeout = setTimeout(() => {
      setShowResult(true);
      setIsPlaying(false);
      setHasPlayed(true);

      // Notify parent that demo is complete
      if (onComplete) {
        onComplete();
      }
    }, RESULT_DELAY);
    timeoutsRef.current.push(resultTimeout);
  };

  // Transition mobile view to preview when result is shown
  useEffect(() => {
    if (showResult) {
      setMobileView('preview');
    }
  }, [showResult]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <GradientBorderStyles />
      {/* Mini Prototype Page Layout */}
      <div className="bg-background-elevated border border-border rounded-xl overflow-hidden h-[650px] lg:h-[550px]">

        {/* Mini Header */}
        <div className="h-12 bg-background-elevated border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-tertiary"></div>
            <span className="text-sm font-medium text-secondary">Vignette Demo</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-black/5 rounded-md text-xs text-secondary font-medium">
              Desktop
            </div>
          </div>
        </div>

        {/* Desktop Layout: Side-by-side Command Panel + Preview */}
        <div className="hidden lg:flex lg:flex-row w-full h-[calc(100%-3rem)]">

          {/* Command Panel (Left Side) - mimics real CommandPanel */}
          <div className="w-60 shrink-0 border-r border-border bg-background-subtle/50 flex flex-col">

            {/* Output Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {visibleMessages.length === 0 && !isPlaying && (
                <div className="flex items-center justify-center h-full">
                  <button
                    onClick={startDemo}
                    className="btn-interactive btn-secondary"
                  >
                    Start demo
                  </button>
                </div>
              )}

              {visibleMessages.map((message, index) => (
                <div
                  key={index}
                  className="animate-fadeIn"
                  style={{
                    animation: 'fadeIn 0.3s ease-in-out'
                  }}
                >
                  {message.type === 'user' && (
                    <div className="bg-background-elevated border border-border rounded-lg p-3 shadow-sm">
                      <div className="text-xs text-muted-foreground font-medium mb-1.5">You</div>
                      <div className="text-sm text-primary">{message.text}</div>
                    </div>
                  )}

                  {message.type === 'assistant' && (
                    <div className="bg-background-subtle border border-border rounded-lg p-3">
                      <div className="text-xs text-muted-foreground font-medium mb-1.5">Agent</div>
                      <div className="text-sm text-secondary">{message.text}</div>
                    </div>
                  )}

                  {message.type === 'tool' && (
                    <div className="flex items-center space-x-2 text-sm text-tertiary pl-3">
                      <span className="opacity-60">{message.icon}</span>
                      <span>{message.text}</span>
                    </div>
                  )}

                  {message.type === 'success' && (
                    <div className="bg-background-subtle border border-border rounded-lg p-3">
                      <div className="text-sm text-secondary font-medium">
                        {message.text}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isPlaying && visibleMessages.length > 0 && (
                <div className="flex items-center space-x-2 text-tertiary text-sm pl-3">
                  <div className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse"></div>
                  <span>Generating...</span>
                </div>
              )}
            </div>

            {/* Command Input (Bottom) */}
            <div className="border-t border-border bg-background-elevated p-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-black/5 rounded-lg text-sm text-tertiary">
                <span>Type a command...</span>
              </div>
            </div>
          </div>

          {/* Prototype Preview (Right Side) */}
          <div className="flex-1 w-full bg-black/5 flex flex-col items-center justify-center p-4 gap-4">
            <div
              className={`w-full max-w-[240px] transition-all duration-700 ${
                showResult ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              {showResult ? (
                <div className="border border-border rounded-2xl bg-background-elevated shadow-xl overflow-hidden ring-1 ring-black/5">
                  <div className="p-4">
                    {/* Mini VignetteSplit layout */}
                    <div className="grid grid-cols-[90px_1fr] gap-3 items-start">
                      {/* Left: Title + Description */}
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-semibold text-primary leading-tight">
                          AI coaching grounded in people science
                        </h4>
                        <p className="text-[9px] text-muted-foreground leading-relaxed">
                          Partnered with psychologists to create AI suggestions backed by research.
                        </p>
                        {/* Mini CTA */}
                        <button className="mt-2 px-2 py-1 bg-primary text-white text-[8px] font-medium rounded-md">
                          See solution
                        </button>
                      </div>

                      {/* Right: Mini Panel */}
                      <div className="bg-background-subtle rounded-lg p-2.5 border border-border">
                        {/* Mini text editor area */}
                        <div className="bg-background-elevated rounded border border-border p-2 mb-2">
                          <div className="space-y-1">
                            <div className="h-1.5 bg-black/10 rounded w-full"></div>
                            <div className="h-1.5 bg-black/10 rounded w-4/5"></div>
                            <div className="h-1.5 bg-black/10 rounded w-3/5"></div>
                            <div className="h-1.5 bg-black/10 rounded w-full"></div>
                          </div>
                        </div>
                        {/* Mini suggestion card with gradient border */}
                        <div className="relative p-[1.5px] rounded-[6px]">
                          <div className="mini-suggestion-border" />
                          <div className="mini-suggestion-content p-1.5">
                            <div className="flex items-center gap-1">
                              <span className="text-[7px] text-primary">✦</span>
                              <span className="text-[7px] text-primary font-medium">2 suggested improvements</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-border rounded-xl bg-background-elevated shadow-lg p-8 flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-border border-t-secondary rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm text-muted-foreground">Building prototype...</p>
                  </div>
                </div>
              )}
            </div>
            {showResult && (
              <a
                href="https://studio.up.railway.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-interactive btn-primary animate-fadeIn"
                style={{ animation: 'fadeIn 0.5s ease-in-out' }}
                onClick={() => trackExternalLinkClicked('vibe-coding-waitlist', 'https://studio.up.railway.app/')}
              >
                Join the waitlist
                <span className="material-icons-outlined text-[16px]">arrow_outward</span>
              </a>
            )}
          </div>
        </div>

        {/* Mobile Layout: Transitioning single view */}
        <div className="lg:hidden w-full h-[calc(100%-3rem)]">
          <AnimatePresence mode="wait">
            {mobileView === 'chat' ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full bg-background-subtle/50 flex flex-col"
              >
                {/* Output Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {visibleMessages.length === 0 && !isPlaying && (
                    <div className="flex items-center justify-center h-full">
                      <button
                        onClick={startDemo}
                        className="btn-interactive btn-secondary"
                      >
                        Start demo
                      </button>
                    </div>
                  )}

                  {visibleMessages.map((message, index) => (
                    <div
                      key={index}
                      className="animate-fadeIn"
                      style={{
                        animation: 'fadeIn 0.3s ease-in-out'
                      }}
                    >
                      {message.type === 'user' && (
                        <div className="bg-background-elevated border border-border rounded-lg p-3 shadow-sm">
                          <div className="text-xs text-muted-foreground font-medium mb-1.5">You</div>
                          <div className="text-sm text-primary">{message.text}</div>
                        </div>
                      )}

                      {message.type === 'assistant' && (
                        <div className="bg-background-subtle border border-border rounded-lg p-3">
                          <div className="text-xs text-muted-foreground font-medium mb-1.5">Agent</div>
                          <div className="text-sm text-secondary">{message.text}</div>
                        </div>
                      )}

                      {message.type === 'tool' && (
                        <div className="flex items-center space-x-2 text-sm text-tertiary pl-3">
                          <span className="opacity-60">{message.icon}</span>
                          <span>{message.text}</span>
                        </div>
                      )}

                      {message.type === 'success' && (
                        <div className="bg-background-subtle border border-border rounded-lg p-3">
                          <div className="text-sm text-secondary font-medium">
                            {message.text}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {isPlaying && visibleMessages.length > 0 && (
                    <div className="flex items-center space-x-2 text-tertiary text-sm pl-3">
                      <div className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse"></div>
                      <span>Generating...</span>
                    </div>
                  )}
                </div>

                {/* Command Input (Bottom) */}
                <div className="border-t border-border bg-background-elevated p-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-black/5 rounded-lg text-sm text-tertiary">
                    <span>Type a command...</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full bg-black/5 flex flex-col items-center justify-center p-6 gap-4"
              >
                <div className="w-full max-w-[280px]">
                  <div className="border border-border rounded-2xl bg-background-elevated shadow-xl overflow-hidden ring-1 ring-black/5">
                    <div className="p-5">
                      {/* Mini VignetteSplit layout */}
                      <div className="grid grid-cols-[100px_1fr] gap-4 items-start">
                        {/* Left: Title + Description */}
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-semibold text-primary leading-tight">
                            AI coaching grounded in people science
                          </h4>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">
                            Partnered with psychologists to create AI suggestions backed by research.
                          </p>
                          {/* Mini CTA */}
                          <button className="mt-2 px-2.5 py-1 bg-primary text-white text-[9px] font-medium rounded-md">
                            See solution
                          </button>
                        </div>

                        {/* Right: Mini Panel */}
                        <div className="bg-background-subtle rounded-lg p-3 border border-border">
                          {/* Mini text editor area */}
                          <div className="bg-background-elevated rounded border border-border p-2 mb-2">
                            <div className="space-y-1.5">
                              <div className="h-1.5 bg-black/10 rounded w-full"></div>
                              <div className="h-1.5 bg-black/10 rounded w-4/5"></div>
                              <div className="h-1.5 bg-black/10 rounded w-3/5"></div>
                              <div className="h-1.5 bg-black/10 rounded w-full"></div>
                            </div>
                          </div>
                          {/* Mini suggestion card with gradient border */}
                          <div className="relative p-[1.5px] rounded-[6px]">
                            <div className="mini-suggestion-border" />
                            <div className="mini-suggestion-content p-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[8px] text-primary">✦</span>
                                <span className="text-[8px] text-primary font-medium">2 suggested improvements</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <a
                  href="https://studio.up.railway.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-interactive btn-primary"
                  onClick={() => trackExternalLinkClicked('vibe-coding-waitlist', 'https://studio.up.railway.app/')}
                >
                  Join the waitlist
                  <span className="material-icons-outlined text-[16px]">arrow_outward</span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}