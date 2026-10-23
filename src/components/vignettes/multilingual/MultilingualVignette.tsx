'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import TranslationManagementPanel from './TranslationManagementPanel';
import MultilingualTextPanel from './MultilingualTextPanel';
import VignetteContainer from '@/components/vignettes/VignetteContainer';
import VignetteSplit from '@/components/vignettes/VignetteSplit';
import { fadeInUp } from '@/lib/animations';
import type { DecisionStory } from '../shared/DecisionStories';

export default function MultilingualVignette() {
  const [activeStory, setActiveStory] = useState<DecisionStory | null>(null);
  const [showBeforeState, setShowBeforeState] = useState(true);

  const handleActiveStoryChange = useCallback(
    (story: DecisionStory | null) => {
      setActiveStory(story);
      setShowBeforeState(true);
    },
    []
  );

  const handleBeforeAfterToggle = useCallback((before: boolean) => {
    setShowBeforeState(before);
  }, []);

  return (
    <VignetteContainer id="multilingual" allowOverflow>
      <div className="w-full space-y-10 lg:space-y-12">
        <motion.div {...fadeInUp}>
          <VignetteSplit
            title={
              <MultilingualTextPanel
                onActiveStoryChange={handleActiveStoryChange}
                showBeforeState={showBeforeState}
                onBeforeAfterToggle={handleBeforeAfterToggle}
              />
            }
          >
            <div
              className="relative w-full max-w-[680px] mx-auto"
              style={{ overflow: 'visible' }}
            >
              <TranslationManagementPanel
                initialComplete
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
