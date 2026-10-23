'use client';

import { motion } from 'framer-motion';
import DemoCreationFlow from './DemoCreationFlow';
import VibeCodingTextPanel from './VibeCodingTextPanel';
import VignetteContainer from '@/components/vignettes/VignetteContainer';
import VignetteSplit from '@/components/vignettes/VignetteSplit';
import { fadeInUp } from '@/lib/animations';

export default function VibeCodingVignette() {
  return (
    <VignetteContainer id="vibe-coding">
      <motion.div {...fadeInUp}>
        <VignetteSplit title={<VibeCodingTextPanel />}>
          <div className="relative w-full max-w-[680px] mx-auto">
            <DemoCreationFlow />
          </div>
        </VignetteSplit>
      </motion.div>
    </VignetteContainer>
  );
}
