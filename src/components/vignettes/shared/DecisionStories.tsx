'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import LinkedText from './LinkedText';

export interface DecisionStory {
  id: string;
  title: string;
  story: string;
  highlightSection?: number;
  toggleLabels?: string[];
  /** In always-expanded lists, drop the divider line below this story. */
  hideDividerBelow?: boolean;
}

interface DecisionStoriesProps {
  stories: DecisionStory[];
  onActiveStoryChange?: (story: DecisionStory | null) => void;
  renderStoryExtra?: (story: DecisionStory) => React.ReactNode;
  /** Show every story open, with no toggling or hover highlighting. */
  alwaysExpanded?: boolean;
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4.5 2.5L8 6L4.5 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DecisionStories({
  stories,
  onActiveStoryChange,
  renderStoryExtra,
  alwaysExpanded = false,
}: DecisionStoriesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  if (stories.length === 0) return null;

  if (alwaysExpanded) {
    return (
      <div className="mt-6 divide-y divide-black/8">
        {stories.map((story) => (
          <div key={story.id} className={`py-4 first:pt-0 ${story.hideDividerBelow ? 'border-b-0' : ''}`}>
            {story.title && <h4 className="type-body font-medium text-primary">{story.title}</h4>}
            <p className={`type-body text-primary whitespace-pre-line ${story.title ? 'mt-2' : ''}`}>
              <LinkedText text={story.story} />
            </p>
            {renderStoryExtra?.(story)}
          </div>
        ))}
      </div>
    );
  }

  const handleToggle = (story: DecisionStory) => {
    if (expandedId === story.id) {
      setExpandedId(null);
      onActiveStoryChange?.(null);
    } else {
      setExpandedId(story.id);
      onActiveStoryChange?.(story);
    }
  };

  return (
    <div className="mt-6">
      <div className="divide-y divide-black/8">
        {stories.map((story) => {
          const isExpanded = expandedId === story.id;
          const buttonId = `decision-story-btn-${story.id}`;
          const regionId = `decision-story-region-${story.id}`;

          return (
            <div key={story.id}>
              <button
                id={buttonId}
                onClick={() => handleToggle(story)}
                aria-expanded={isExpanded}
                aria-controls={regionId}
                className="flex items-center justify-between w-full py-3 text-left cursor-pointer group"
              >
                <span className="type-body font-medium text-primary">
                  {story.title}
                </span>
                <ChevronIcon
                  className={`flex-shrink-0 ml-2 text-primary/50 transition-transform duration-200 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    id={regionId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={
                      reducedMotion
                        ? { opacity: 1 }
                        : { height: 0, opacity: 0 }
                    }
                    animate={
                      reducedMotion
                        ? { opacity: 1 }
                        : { height: 'auto', opacity: 1 }
                    }
                    exit={
                      reducedMotion
                        ? { opacity: 0 }
                        : { height: 0, opacity: 0 }
                    }
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="type-body text-primary/80 pb-3">
                      {story.story}
                    </p>
                    {renderStoryExtra?.(story)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
