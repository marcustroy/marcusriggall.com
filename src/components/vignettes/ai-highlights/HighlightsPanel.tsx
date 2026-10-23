'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useIntroSequence } from '@/lib/intro-sequence-context';
import { DecisionStory } from '../shared/DecisionStories';
import {
  aiHighlightsContent,
  storyInteractions,
  HighlightItem,
} from './content';
import {
  WIREFRAME_GRAY,
  getAvatarColor,
  getInitials,
  SourceCard,
  BeforeSummaryItemRow,
  DetailSpan,
  FocusedItem,
  CollapsibleItem,
  LoadingStyles,
  FloatingThumbs,
} from './shared-panel-components';

interface HighlightsPanelProps {
  className?: string;
  activeStory?: DecisionStory | null;
  showBeforeState?: boolean;
}

function SkeletonContent() {
  return (
    <>
      {/* Header Section */}
      <div className="border-b-2 border-border px-6 py-8">
        <p className="text-body-sm font-semibold text-primary mb-3">
          Loading highlights and opportunities
        </p>
        <div className="space-y-3">
          <div className="skeleton-bar h-[15px] w-full rounded-[7px]" />
          <div className="skeleton-bar h-[15px] w-full rounded-[7px]" />
          <div className="skeleton-bar h-[15px] w-[85%] rounded-[7px]" />
        </div>
      </div>

      {/* Skeleton Items */}
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`px-6 py-8 ${index < 2 ? 'border-b-2 border-border' : ''}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-1">
                <div className="skeleton-bar w-5 h-5 rounded-full" />
                <div className="skeleton-bar h-[15px] w-20 sm:w-[85px] rounded-[7px]" />
              </div>
              <div className="skeleton-bar h-[15px] w-full max-w-[240px] rounded-[7px]" />
            </div>
            <div className="flex items-center gap-4 sm:gap-12">
              <div className="flex items-center gap-1">
                <div className="skeleton-bar w-5 h-5 rounded-full" />
                <div className="skeleton-bar h-[15px] w-14 sm:w-[60px] rounded-[7px]" />
              </div>
              <div className="skeleton-bar w-5 h-5 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function LoadingState() {
  return (
    <>
      <LoadingStyles />
      <div className="relative p-[2px] rounded-[7px]">
        <div className="loading-panel-border"></div>
        <div className="loading-panel-content">
          <SkeletonContent />
        </div>
      </div>
    </>
  );
}

interface SolutionStateProps {
  className?: string;
  activeStory?: DecisionStory | null;
  showBeforeState?: boolean;
}

function EmployeeAvatar({
  employee,
  avatarColor,
}: {
  employee: typeof aiHighlightsContent.employee;
  avatarColor: string;
}) {
  if (employee.avatarUrl) {
    return (
      <img
        src={employee.avatarUrl}
        alt=""
        className="w-12 h-12 rounded-full object-cover"
      />
    );
  }

  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold text-white"
      style={{ backgroundColor: avatarColor }}
    >
      {employee.initials}
    </div>
  );
}

function SolutionState({
  className = '',
  activeStory = null,
  showBeforeState = true,
}: SolutionStateProps) {
  const { employee, summary, highlights, opportunities } = aiHighlightsContent;
  const allItems = [...highlights, ...opportunities];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [thumbsClicked, setThumbsClicked] = useState(false);
  const [showStat, setShowStat] = useState(false);
  const [borderAnimating, setBorderAnimating] = useState(false);
  const [burstTrigger, setBurstTrigger] = useState(0);
  const totalSections = allItems.length + 1;
  const [upgradedSections, setUpgradedSections] = useState(0);
  const prevBeforeStateRef = useRef(showBeforeState);
  const reducedMotion = useReducedMotion();

  const highlightedSection = activeStory?.highlightSection ?? null;

  const isReframingStory = activeStory?.id === 'reframing-summary';
  const isRefiningStory = activeStory?.id === 'refining-output';
  const hasToggle = isReframingStory || isRefiningStory;

  useEffect(() => {
    setThumbsClicked(false);
    setShowStat(false);
    setBorderAnimating(false);
    setBurstTrigger(0);
    setUpgradedSections(showBeforeState ? 0 : totalSections);
    prevBeforeStateRef.current = showBeforeState;

    if (activeStory?.id === 'trust-verification') {
      setExpandedIndex(0);
    } else {
      setExpandedIndex(null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStory]);

  useEffect(() => {
    const isToggleStory = isReframingStory || isRefiningStory;
    const wasBeforeNowAfter =
      prevBeforeStateRef.current === true && showBeforeState === false;

    prevBeforeStateRef.current = showBeforeState;

    if (showBeforeState) {
      setUpgradedSections(0);
      setBorderAnimating(false);
      return;
    }

    if (isToggleStory && wasBeforeNowAfter) {
      if (reducedMotion) {
        setUpgradedSections(totalSections);
        return;
      }

      setBorderAnimating(true);

      const timers: ReturnType<typeof setTimeout>[] = [];

      if (isRefiningStory) {
        setUpgradedSections(1);
        const itemDelay = 400;
        const itemInterval = 900;
        const itemCount = totalSections - 1;
        for (let i = 0; i < itemCount; i++) {
          timers.push(
            setTimeout(
              () => setUpgradedSections(i + 2),
              itemDelay + i * itemInterval
            )
          );
        }
        timers.push(
          setTimeout(() => setBorderAnimating(false),
            itemDelay + (itemCount - 1) * itemInterval + 1500
          )
        );
      } else {
        setUpgradedSections(totalSections);
        timers.push(
          setTimeout(() => setBorderAnimating(false), 1200)
        );
      }

      return () => timers.forEach(clearTimeout);
    }
  }, [showBeforeState, isReframingStory, isRefiningStory, reducedMotion, totalSections]);

  const isFullyBefore = hasToggle && upgradedSections === 0;

  const getBlockStyle = (sectionNumber: number) => {
    const transition = 'opacity 0.3s ease-in-out, background-color 0.3s ease-in-out';

    if (!activeStory || hasToggle) {
      return { opacity: 1, transition };
    }

    if (highlightedSection == null) {
      return { opacity: 0.4, transition };
    }

    if (sectionNumber === highlightedSection) {
      return { opacity: 1, transition };
    }

    return { opacity: 0.4, transition };
  };

  const getFooterStyle = () => {
    const transition =
      'opacity 0.3s ease-in-out, background-color 0.3s ease-in-out';
    if (!activeStory || hasToggle) return { opacity: 1, transition };
    return { opacity: 0.4, transition };
  };

  const reframingBefore = storyInteractions.reframingSummary.before;
  const refiningBefore = storyInteractions.refiningOutput.before;
  const refiningBeforeItems = [
    ...refiningBefore.highlights,
    ...refiningBefore.opportunities,
  ] as HighlightItem[];

  const isHeaderUpgraded = upgradedSections >= 1;
  const isItemUpgraded = (index: number) => upgradedSections >= index + 2;

  const renderContent = () => {
    if (!hasToggle) {
      return (
        <>
          <div
            className="border-b-2 border-border px-6 py-6"
            data-section-id="highlights-section-1"
            style={getBlockStyle(1)}
          >
            <div className="flex items-center gap-3 mb-2">
              <EmployeeAvatar employee={employee} avatarColor={employee.avatarColor} />
              <div>
                <p className="text-h3 font-normal text-primary" style={{ marginBottom: '0px' }}>
                  {employee.name}
                </p>
                <p className="text-body-sm text-primary mb-0">{employee.role}</p>
              </div>
            </div>
            <p className="text-body-sm text-primary mt-0">{summary}</p>
          </div>

          <div data-section-id="highlights-section-2">
            {allItems.map((item, index) => (
              <CollapsibleItem
                key={`default-${index}`}
                item={item}
                sectionIndex={index}
                isExpanded={expandedIndex === index}
                onToggle={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
                blockStyle={getBlockStyle(index + 2)}
              />
            ))}
          </div>

          <div className="px-6 py-4 flex items-center gap-2" style={getFooterStyle()}>
            <span className="text-body-sm text-secondary">Is this helpful?</span>
            <div className="relative">
              <button
                className="p-2 rounded-lg transition-colors hover:bg-black/5"
                aria-label="Thumbs up"
                onClick={() => {}}
              >
                <span
                  className={`material-icons-outlined text-h2 block transition-colors duration-300 ${
                    thumbsClicked ? 'text-emerald-600' : 'text-primary'
                  }`}
                >
                  thumb_up
                </span>
              </button>
              <FloatingThumbs active={false} burstTrigger={burstTrigger} />
            </div>
            <AnimatePresence>
              {showStat && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8, x: -8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="text-body-sm font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full"
                >
                  93% positive
                </motion.span>
              )}
            </AnimatePresence>
            {!thumbsClicked && (
              <button
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                aria-label="Thumbs down"
              >
                <span className="material-icons-outlined text-h2 text-primary">thumb_down</span>
              </button>
            )}
          </div>
        </>
      );
    }

    const headerSummaryText = isReframingStory
      ? isHeaderUpgraded ? summary : reframingBefore.summary
      : summary;
    const headerAvatarColor = isReframingStory
      ? isHeaderUpgraded ? employee.avatarColor : WIREFRAME_GRAY
      : employee.avatarColor;

    return (
      <>
        <div className="border-b-2 border-border px-6 py-6" data-section-id="highlights-section-1">
          <div style={{ opacity: isRefiningStory ? 0.3 : 1, transition: 'opacity 0.3s ease-in-out' }}>
            <div className="flex items-center gap-3 mb-2">
              <EmployeeAvatar employee={employee} avatarColor={headerAvatarColor} />
              <div>
                <p className="text-h3 font-normal text-primary" style={{ marginBottom: '0px' }}>
                  {employee.name}
                </p>
                <p className="text-body-sm text-primary mb-0">{employee.role}</p>
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={headerSummaryText}
                initial={borderAnimating ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-body-sm text-primary mt-0"
              >
                {headerSummaryText}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div data-section-id="highlights-section-2">
        {allItems.map((afterItem, index) => {
          const upgraded = isItemUpgraded(index);

          if (isReframingStory) {
            const beforeItem = reframingBefore.items[index];
            return (
              <AnimatePresence mode="wait" key={`reframing-${index}`}>
                {upgraded ? (
                  <motion.div
                    key={`after-${index}`}
                    initial={borderAnimating ? { opacity: 0 } : false}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <CollapsibleItem
                      item={afterItem}
                      sectionIndex={index}
                      isExpanded={expandedIndex === index}
                      onToggle={() =>
                        setExpandedIndex(expandedIndex === index ? null : index)
                      }
                      blockStyle={{ opacity: 1 }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`before-${index}`}
                    initial={false}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <BeforeSummaryItemRow item={beforeItem} />
                  </motion.div>
                )}
              </AnimatePresence>
            );
          }

          const displayItem = upgraded ? afterItem : refiningBeforeItems[index];
          const afterParts = refiningBefore.afterParts?.[index];
          return (
            <AnimatePresence mode="wait" key={`refining-${index}`}>
              <motion.div
                key={`${upgraded}-${index}`}
                initial={borderAnimating ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FocusedItem
                  item={displayItem}
                  summaryParts={upgraded ? afterParts : undefined}
                  animateExpand={upgraded && borderAnimating}
                />
              </motion.div>
            </AnimatePresence>
          );
        })}
        </div>

        <div
          className="px-6 py-4 flex items-center gap-2"
          style={{
            opacity: isRefiningStory ? 0.3 : isFullyBefore ? 0.4 : 1,
            transition: 'opacity 0.3s ease-in-out',
          }}
        >
          <span className="text-body-sm text-secondary">Is this helpful?</span>
          <button className="p-2 hover:bg-black/5 rounded-lg transition-colors" aria-label="Thumbs up">
            <span className="material-icons-outlined text-h2 text-primary">thumb_up</span>
          </button>
          <button className="p-2 hover:bg-black/5 rounded-lg transition-colors" aria-label="Thumbs down">
            <span className="material-icons-outlined text-h2 text-primary">thumb_down</span>
          </button>
        </div>
      </>
    );
  };

  const showWireframe = isFullyBefore;

  return (
    <div
      className={`relative rounded-[7px] p-[2px] ${className}`}
      style={
        borderAnimating
          ? {}
          : {
              background: showWireframe
                ? 'linear-gradient(135deg, #C4C4C4, #A8A8A8, #C4C4C4)'
                : 'linear-gradient(135deg, var(--ai-gradient-1), var(--ai-gradient-2), var(--ai-gradient-3))',
              transition: 'background 0.3s ease-in-out',
            }
      }
    >
      <LoadingStyles />
      {borderAnimating && <div className="loading-panel-border" />}
      <div className="bg-background-elevated rounded-[5px] overflow-visible relative z-[1]">
        {renderContent()}
      </div>
    </div>
  );
}

export default function HighlightsPanel({
  className = '',
  activeStory = null,
  showBeforeState = true,
}: HighlightsPanelProps) {
  const reducedMotion = useReducedMotion();
  const { isComplete } = useIntroSequence();
  const [showLoading, setShowLoading] = useState(true);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (isComplete && showLoading && !hasStartedRef.current) {
      hasStartedRef.current = true;
      const entranceDelay = reducedMotion ? 0 : 600;
      const loadingDuration = reducedMotion ? 0 : 1500;

      setTimeout(() => {
        setTimeout(() => {
          setShowLoading(false);
        }, loadingDuration);
      }, entranceDelay);
    }
  }, [isComplete, showLoading, reducedMotion]);

  return (
    <div data-section-id="highlights-panel">
    <AnimatePresence mode="wait">
      {showLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
        >
          <LoadingState />
        </motion.div>
      ) : (
        <motion.div
          key="solution"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <SolutionState
            className={className}
            activeStory={activeStory}
            showBeforeState={showBeforeState}
          />
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  );
}
