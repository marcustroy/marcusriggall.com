'use client';

import { motion } from 'framer-motion';
import SandboxPanel from './SandboxPanel';
import PrototypingTextPanel from './PrototypingTextPanel';
import VignetteContainer from '@/components/vignettes/VignetteContainer';
import VignetteSplit from '@/components/vignettes/VignetteSplit';
import { Stage, stagePadding } from '@/components/Stage';
import { fadeInUp } from '@/lib/animations';

export default function PrototypingVignette() {
  return (
    <VignetteContainer id="prototyping" allowOverflow>
      <div className="w-full space-y-10 lg:space-y-12">
        <motion.div {...fadeInUp}>
          <VignetteSplit
            title={<PrototypingTextPanel />}
          >
            <div
              className="relative w-full max-w-[680px] mx-auto"
              style={{ overflow: 'visible' }}
            >
              <Stage id="prototyping" className={stagePadding('prototyping')}>
                <SandboxPanel activeStory={null} />
              </Stage>
            </div>
          </VignetteSplit>
        </motion.div>
      </div>
    </VignetteContainer>
  );
}
