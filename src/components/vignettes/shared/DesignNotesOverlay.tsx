'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { DesignNote } from '@/components/vignettes/types';
import { MobileDesignNotesSheet } from './MobileDesignNotesSheet';
import { useVignetteStage } from '@/lib/vignette-stage-context';

interface DesignNotesOverlayProps {
  notes: DesignNote[];
  onActiveNoteChange?: (noteId: string | null) => void;
}

export function DesignNotesOverlay({ notes, onActiveNoteChange }: DesignNotesOverlayProps) {
  const { vignetteId } = useVignetteStage();
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);

  const openMobileSheet = (index: number) => {
    setMobileIndex(index);
    setMobileSheetOpen(true);
    onActiveNoteChange?.(notes[index]?.id ?? null);
  };

  const closeMobileSheet = () => {
    setMobileSheetOpen(false);
    onActiveNoteChange?.(null);
  };

  const handleMobileIndexChange = (index: number) => {
    setMobileIndex(index);
    onActiveNoteChange?.(notes[index]?.id ?? null);
  };

  return (
    <>
      {/* Mobile: Button below panel to open notes sheet */}
      <motion.button
        className="lg:hidden mt-4 ml-auto z-20 flex items-center gap-2 px-4 py-2.5
                   bg-neutral-700 text-white text-[0.875rem] font-medium rounded-full shadow-sm
                   hover:bg-neutral-800 transition-colors duration-150"
        onClick={() => openMobileSheet(0)}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <span className="w-5 h-5 rounded-full bg-white text-primary text-[11px] font-medium flex items-center justify-center">
          {notes.length}
        </span>
        Design notes
      </motion.button>

      {/* Mobile bottom sheet */}
      <MobileDesignNotesSheet
        isOpen={mobileSheetOpen}
        onClose={closeMobileSheet}
        notes={notes}
        currentIndex={mobileIndex}
        onIndexChange={handleMobileIndexChange}
        vignetteId={vignetteId}
      />
    </>
  );
}
