'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import {
  FeedbackSource,
  HighlightItem,
  BeforeSummaryItem,
  SummaryPart,
} from './content';

// --- Helpers ---

export const WIREFRAME_GRAY = '#C4C4C4';

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function getAvatarColor(name: string): string {
  const colors: Record<string, string> = {
    'David Park': '#6366F1',
    'Rachel Torres': '#EC4899',
    'James Liu': '#10B981',
    'Priya Sharma': '#F59E0B',
    'Kevin Wright': '#8B5CF6',
  };
  return colors[name] || '#6366F1';
}

// --- SourceCard ---

interface SourceCardProps {
  source: FeedbackSource;
}

function SourceAvatar({
  source,
  className,
  textClassName = 'text-[10px]',
  fallbackColor,
}: {
  source: FeedbackSource;
  className: string;
  textClassName?: string;
  fallbackColor?: string;
}) {
  if (source.avatarUrl) {
    return (
      <img
        src={source.avatarUrl}
        alt=""
        className={`${className} object-cover`}
      />
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center font-bold text-white ${textClassName}`}
      style={{ backgroundColor: fallbackColor ?? getAvatarColor(source.reviewer) }}
    >
      {getInitials(source.reviewer)}
    </div>
  );
}

export function SourceCard({ source }: SourceCardProps) {
  return (
    <div className="pt-5 border-t border-border">
      {/* Mobile: stacked layout */}
      <div className="flex flex-col gap-1 mb-3 sm:hidden">
        <div className="flex items-center gap-2">
          <SourceAvatar source={source} className="w-6 h-6 rounded-full" />
          <span className="text-body-sm font-semibold text-primary">
            {source.reviewer}
          </span>
        </div>
        <div className="flex items-center gap-2 text-caption text-secondary">
          <span>{source.reviewerRole}</span>
        </div>
      </div>
      {/* Desktop: horizontal layout */}
      <div className="hidden sm:flex items-center gap-2 mb-3">
        <SourceAvatar source={source} className="w-6 h-6 rounded-full" />
        <span className="text-body-sm font-semibold text-primary">
          {source.reviewer}
        </span>
        <span className="text-caption text-secondary">
          {source.reviewerRole}
        </span>
      </div>
      <p className="text-body-sm text-primary mb-3">{source.quote}</p>
    </div>
  );
}

// --- BeforeSummaryItemRow ---

export function BeforeSummaryItemRow({ item }: { item: BeforeSummaryItem }) {
  return (
    <div className="border-b-2 border-border">
      <div className="px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <p className="text-body-sm text-primary">{item.summary}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0 px-2 py-2 -mx-2">
            <div className="flex items-center gap-1">
              <div className="flex -space-x-2">
                {item.sources.slice(0, 2).map((source, idx) => (
                  <SourceAvatar
                    key={idx}
                    className="w-5 h-5 rounded-full border-2 border-background-elevated flex items-center justify-center text-[8px] font-bold text-white"
                    textClassName="text-[8px]"
                    fallbackColor={WIREFRAME_GRAY}
                    source={source}
                  />
                ))}
              </div>
              <span className="text-body-sm text-secondary">
                {item.sources.length} sources
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- DetailSpan ---

export function DetailSpan({
  detail,
  animateExpand,
  delayIndex,
}: {
  detail: string;
  animateExpand: boolean;
  delayIndex: number;
}) {
  const highlightDelay = 0.1 + delayIndex * 0.15;
  return (
    <motion.span
      className="rounded-sm"
      style={{ display: 'inline', boxDecorationBreak: 'clone' }}
      initial={
        animateExpand
          ? { backgroundColor: 'rgba(253, 224, 71, 0.45)' }
          : false
      }
      animate={{ backgroundColor: 'rgba(253, 224, 71, 0)' }}
      transition={{
        backgroundColor: {
          duration: 1.4,
          delay: animateExpand ? highlightDelay + 0.4 : 0,
          ease: 'easeOut',
        },
      }}
    >
      {detail}
    </motion.span>
  );
}

// --- FocusedItem ---

export function FocusedItem({
  item,
  summaryParts,
  animateExpand,
}: {
  item: HighlightItem;
  summaryParts?: SummaryPart[];
  animateExpand: boolean;
}) {
  const isHighlight = item.type === 'highlight';
  const label = isHighlight ? 'Highlight' : 'Opportunity';
  const icon = isHighlight ? 'star_outline' : 'lightbulb';
  const iconColor = isHighlight ? '#22594A' : 'rgba(135, 100, 0, 1)';

  const renderSummary = () => {
    if (!summaryParts || !animateExpand) {
      return (
        <p className="text-body-sm text-primary">{item.summary}</p>
      );
    }

    let detailIndex = 0;
    return (
      <p className="text-body-sm text-primary">
        {summaryParts.map((part, i) => {
          if (typeof part === 'string') {
            return <span key={i}>{part}</span>;
          }
          const idx = detailIndex++;
          return (
            <DetailSpan
              key={i}
              detail={part.detail}
              animateExpand={animateExpand}
              delayIndex={idx}
            />
          );
        })}
      </p>
    );
  };

  return (
    <div className="border-b-2 border-border">
      <div className="px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-2">
              <span
                className="material-icons-outlined text-h3"
                style={{ color: iconColor }}
              >
                {icon}
              </span>
              <span className="text-body-sm font-semibold text-primary">
                {label}
              </span>
            </div>
            {renderSummary()}
          </div>

          <div className="flex items-center gap-3 shrink-0 px-2 py-2 -mx-2 opacity-30">
            <div className="flex items-center gap-1">
              <div className="flex -space-x-2">
                {item.sources.slice(0, 2).map((source, idx) => (
                  <SourceAvatar
                    key={idx}
                    className="w-5 h-5 rounded-full border-2 border-background-elevated flex items-center justify-center text-[8px] font-bold text-white"
                    textClassName="text-[8px]"
                    source={source}
                  />
                ))}
              </div>
              <span className="text-body-sm text-secondary">
                {item.sources.length} sources
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CollapsibleItem ---

export function CollapsibleItem({
  item,
  sectionIndex,
  isExpanded,
  onToggle,
  blockStyle,
}: {
  item: HighlightItem;
  sectionIndex: number;
  isExpanded: boolean;
  onToggle: () => void;
  blockStyle: React.CSSProperties;
}) {
  const isHighlight = item.type === 'highlight';
  const label = isHighlight ? 'Highlight' : 'Opportunity';
  const icon = isHighlight ? 'star_outline' : 'lightbulb';
  const iconColor = isHighlight ? '#22594A' : 'rgba(135, 100, 0, 1)';

  return (
    <div
      className="border-b-2 border-border"
      data-section-id={`${item.type}-${sectionIndex}`}
      style={blockStyle}
    >
      <div className="px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-2">
              <span
                className="material-icons-outlined text-h3"
                style={{ color: iconColor }}
              >
                {icon}
              </span>
              <span className="text-body-sm font-semibold text-primary">
                {label}
              </span>
            </div>
            <p className="text-body-sm text-primary">
              {item.summary}
            </p>
          </div>

          <button
            onClick={onToggle}
            className="flex items-center gap-3 shrink-0 hover:bg-black/5 rounded-lg px-2 py-2 -mx-2 transition-colors cursor-pointer"
            aria-label={
              isExpanded ? `Collapse ${item.type}` : `Expand ${item.type}`
            }
            aria-expanded={isExpanded}
          >
            <div className="flex items-center gap-1">
              <div className="flex -space-x-2">
                {item.sources.slice(0, 2).map((source, idx) => (
                  <SourceAvatar
                    key={idx}
                    className="w-5 h-5 rounded-full border-2 border-background-elevated flex items-center justify-center text-[8px] font-bold text-white"
                    textClassName="text-[8px]"
                    source={source}
                  />
                ))}
              </div>
              <span className="text-body-sm text-secondary">
                {item.sources.length} sources
              </span>
            </div>
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="material-icons-outlined text-h3 text-primary block"
            >
              keyboard_arrow_down
            </motion.span>
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-4">
                {item.sources.map((source, idx) => (
                  <SourceCard key={idx} source={source} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- LoadingStyles ---

export function LoadingStyles() {
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

      .loading-panel-border {
        position: absolute;
        inset: 0;
        border-radius: 7px;
        background: conic-gradient(
          from var(--gradient-angle),
          var(--ai-gradient-1),
          var(--ai-gradient-2),
          var(--ai-gradient-3),
          var(--ai-gradient-2),
          var(--ai-gradient-1)
        );
        animation: rotateGradient 3s linear infinite;
        filter: drop-shadow(0 0 20px rgba(166, 229, 231, 0.5));
      }

      .loading-panel-content {
        position: relative;
        background: var(--background-elevated);
        width: 100%;
        height: 100%;
        border-radius: 5px;
        z-index: 1;
      }

      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }

      .skeleton-bar {
        background: linear-gradient(
          90deg,
          rgba(0, 0, 0, 0.06) 25%,
          rgba(0, 0, 0, 0.1) 50%,
          rgba(0, 0, 0, 0.06) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s ease-in-out infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .loading-panel-border {
          animation: none;
          filter: drop-shadow(0 0 20px rgba(166, 229, 231, 0.3));
        }
        .skeleton-bar {
          animation: none;
        }
      }
    `}</style>
  );
}

// --- Floating Thumbs Animation ---

export interface FloatingThumb {
  id: number;
  startX: number;
  driftX: number;
  riseDistance: number;
  duration: number;
  size: number;
  rotation: number;
  startScale: number;
  endScale: number;
}

let thumbIdCounter = 0;

export function createFloatingThumb(): FloatingThumb {
  const id = thumbIdCounter++;
  const startX = (Math.random() - 0.5) * 40;
  const driftDirection = Math.random() > 0.5 ? 1 : -1;
  const driftX = driftDirection * (20 + Math.random() * 30);
  const riseDistance = 120 + Math.random() * 60;
  const duration = 2.5 + Math.random() * 1.0;
  const size = 14 + Math.random() * 4;
  const rotation = (Math.random() - 0.5) * 50;
  const startScale = 0.6 + Math.random() * 0.3;
  const endScale = 0.6 + Math.random() * 0.2;

  return {
    id,
    startX,
    driftX,
    riseDistance,
    duration,
    size,
    rotation,
    startScale,
    endScale,
  };
}

export function FloatingThumbParticle({
  thumb,
  onComplete,
}: {
  thumb: FloatingThumb;
  onComplete: (id: number) => void;
}) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 0,
        pointerEvents: 'none',
        fontSize: thumb.size,
        lineHeight: 1,
        willChange: 'transform, opacity',
        rotate: thumb.rotation,
      }}
      initial={{
        x: thumb.startX,
        y: 0,
        opacity: 0,
        scale: thumb.startScale,
      }}
      animate={{
        x: thumb.startX + thumb.driftX,
        y: -thumb.riseDistance,
        opacity: [0, 1, 1, 0],
        scale: [thumb.startScale, 1, thumb.endScale + 0.1, thumb.endScale],
      }}
      transition={{
        y: {
          duration: thumb.duration,
          ease: [0.2, 0.6, 0.4, 1],
        },
        x: {
          duration: thumb.duration,
          ease: 'easeInOut',
        },
        opacity: {
          duration: thumb.duration,
          times: [0, 0.1, 0.7, 1],
          ease: 'linear',
        },
        scale: {
          duration: thumb.duration,
          times: [0, 0.15, 0.7, 1],
          ease: 'easeOut',
        },
      }}
      onAnimationComplete={() => onComplete(thumb.id)}
    >
      <span className="material-icons-outlined text-emerald-400" style={{ fontSize: 'inherit' }}>
        thumb_up
      </span>
    </motion.div>
  );
}

export function FloatingThumbs({ active, burstTrigger = 0 }: { active: boolean; burstTrigger?: number }) {
  const [particles, setParticles] = useState<FloatingThumb[]>([]);
  const reducedMotion = useReducedMotion();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  useEffect(() => {
    if (!active || reducedMotion) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setParticles([]);
      return;
    }

    setParticles([createFloatingThumb()]);

    intervalRef.current = setInterval(() => {
      setParticles((prev) => {
        if (prev.length >= 10) return prev;
        return [...prev, createFloatingThumb()];
      });
    }, 350);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [active, reducedMotion]);

  useEffect(() => {
    if (burstTrigger === 0 || !active || reducedMotion) return;
    const burst = Array.from({ length: 3 + Math.floor(Math.random() * 2) }, () => createFloatingThumb());
    setParticles((prev) => [...prev, ...burst]);
  }, [burstTrigger, active, reducedMotion]);

  if (reducedMotion || !active) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '100%',
        width: 0,
        height: 0,
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'visible',
      }}
    >
      <AnimatePresence>
        {particles.map((thumb) => (
          <FloatingThumbParticle
            key={thumb.id}
            thumb={thumb}
            onComplete={removeParticle}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
