'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import type { DesignNote } from '@/components/vignettes/types';
import { trackDesignNoteViewed, type VignetteId } from '@/lib/analytics';

interface MobileDesignNotesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  notes: DesignNote[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  vignetteId: VignetteId;
}

export function MobileDesignNotesSheet({
  isOpen,
  onClose,
  notes,
  currentIndex,
  onIndexChange,
  vignetteId,
}: MobileDesignNotesSheetProps) {
  const currentNote = notes[currentIndex];
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const trackedNotesRef = useRef<Set<string>>(new Set());

  // Track mount state for portal (SSR safety)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Track design note views (only once per note per session)
  useEffect(() => {
    if (isOpen && currentNote && !trackedNotesRef.current.has(currentNote.id)) {
      trackDesignNoteViewed(vignetteId, currentNote.id);
      trackedNotesRef.current.add(currentNote.id);
    }
  }, [isOpen, currentNote, vignetteId]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          if (currentIndex < notes.length - 1) onIndexChange(currentIndex + 1);
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) onIndexChange(currentIndex - 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, notes.length, onClose, onIndexChange]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    // Dismiss if dragged down more than 100px or with high velocity
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  if (!currentNote || !mounted) return null;

  // Use portal to render outside vignette stacking contexts
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - lighter to keep highlighted element visible */}
          <motion.div
            className="fixed inset-0 bg-black/25 z-40 lg:hidden backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed inset-x-0 bottom-0 bg-background-elevated rounded-t-2xl border-t border-border/60 z-50 lg:hidden shadow-xl touch-none"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-9 h-1 bg-neutral-300 rounded-full" />
            </div>

            {/* Progress dots */}
            <div className="px-6 pb-3 flex items-center justify-between">
              <span className="text-[0.8125rem] text-tertiary">
                {currentIndex + 1} of {notes.length}
              </span>
              <div className="flex gap-1.5">
                {notes.map((_, i) => (
                  <button
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                      i === currentIndex ? 'bg-primary' : 'bg-neutral-300'
                    }`}
                    onClick={() => onIndexChange(i)}
                    aria-label={`Go to note ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentNote.id}
                  initial={isDragging ? undefined : { opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={isDragging ? undefined : { opacity: 0, x: -16 }}
                  transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <p className="text-[1rem] text-secondary leading-relaxed">
                    {currentNote.detail}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                className="flex-1 py-3 px-4 rounded-xl border border-border/60 text-secondary text-[0.9375rem] font-medium disabled:opacity-40 transition-colors hover:bg-muted"
                onClick={() => onIndexChange(currentIndex - 1)}
                disabled={currentIndex === 0}
              >
                Previous
              </button>
              <button
                className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-neutral-800 text-white text-[0.9375rem] font-medium transition-colors"
                onClick={() => {
                  if (currentIndex === notes.length - 1) {
                    onClose();
                  } else {
                    onIndexChange(currentIndex + 1);
                  }
                }}
              >
                {currentIndex === notes.length - 1 ? 'Done' : 'Next'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
