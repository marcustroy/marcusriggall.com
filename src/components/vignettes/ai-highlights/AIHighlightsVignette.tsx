'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import HighlightsPanel from './HighlightsPanel';
import HighlightsTextPanel from './HighlightsTextPanel';
import VignetteContainer from '@/components/vignettes/VignetteContainer';
import VignetteSplit from '@/components/vignettes/VignetteSplit';
import { fadeInUp } from '@/lib/animations';
import { DecisionStory } from '../shared/DecisionStories';

export default function AIHighlightsVignette() {
  const [activeStory, setActiveStory] = useState<DecisionStory | null>(null);
  const [showBeforeState, setShowBeforeState] = useState(true);

  const handleActiveStoryChange = useCallback(
    (story: DecisionStory | null) => {
      setActiveStory(story);
      setShowBeforeState(true);
    },
    []
  );

  return (
    <VignetteContainer id="ai-highlights" allowOverflow>
      <div className="w-full space-y-10 lg:space-y-12">
        <motion.div {...fadeInUp}>
          <VignetteSplit
            title={
              <HighlightsTextPanel
                onActiveStoryChange={handleActiveStoryChange}
                showBeforeState={showBeforeState}
                onBeforeAfterToggle={setShowBeforeState}
              />
            }
          >
            <div
              className="relative w-full max-w-[680px] mx-auto"
              style={{ overflow: 'visible' }}
            >
              <HighlightsPanel
                activeStory={activeStory}
                showBeforeState={showBeforeState}
              />
            </div>
          </VignetteSplit>
        </motion.div>
      </div>
    </VignetteContainer>
  );
}
