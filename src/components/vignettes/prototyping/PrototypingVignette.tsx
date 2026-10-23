'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import SandboxPanel from './SandboxPanel';
import PrototypingTextPanel from './PrototypingTextPanel';
import VignetteContainer from '@/components/vignettes/VignetteContainer';
import VignetteSplit from '@/components/vignettes/VignetteSplit';
import { fadeInUp } from '@/lib/animations';
import type { DecisionStory } from '../shared/DecisionStories';

export default function PrototypingVignette() {
  const [activeStory, setActiveStory] = useState<DecisionStory | null>(null);

  const handleActiveStoryChange = useCallback(
    (story: DecisionStory | null) => {
      setActiveStory(story);
    },
    []
  );

  return (
    <VignetteContainer id="prototyping" allowOverflow>
      <div className="w-full space-y-10 lg:space-y-12">
        <motion.div {...fadeInUp}>
          <VignetteSplit
            title={
              <PrototypingTextPanel
                onActiveStoryChange={handleActiveStoryChange}
              />
            }
          >
            <div
              className="relative w-full max-w-[680px] mx-auto"
              style={{ overflow: 'visible' }}
            >
              <SandboxPanel activeStory={activeStory} />
            </div>
          </VignetteSplit>
        </motion.div>
      </div>
    </VignetteContainer>
  );
}
