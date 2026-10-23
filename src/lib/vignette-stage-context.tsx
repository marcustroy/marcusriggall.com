'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { trackVignetteInteracted, type VignetteId } from './analytics';

// 'loading' is used by AI vignettes for auto-play loading animation
export type VignetteStage = 'loading' | 'solution' | 'designNotes';

interface VignetteStageContextValue {
  stage: VignetteStage;
  setStage: (stage: VignetteStage) => void;
  goToSolution: () => void;
  goToDesignNotes: () => void;
  vignetteId: VignetteId;
}

const VignetteStageContext = createContext<VignetteStageContextValue | null>(null);

interface VignetteStageProviderProps {
  children: ReactNode;
  initialStage?: VignetteStage;
  vignetteId: VignetteId;
}

export function VignetteStageProvider({
  children,
  initialStage = 'solution',
  vignetteId,
}: VignetteStageProviderProps) {
  const [stage, setStageInternal] = useState<VignetteStage>(initialStage);

  const setStage = useCallback((newStage: VignetteStage) => {
    setStageInternal(newStage);
  }, []);

  const goToSolution = useCallback(() => {
    setStage('solution');
    trackVignetteInteracted(vignetteId, 'solution');
  }, [setStage, vignetteId]);

  const goToDesignNotes = useCallback(() => {
    setStage('designNotes');
    trackVignetteInteracted(vignetteId, 'designNotes');
  }, [setStage, vignetteId]);

  return (
    <VignetteStageContext.Provider
      value={{
        stage,
        setStage,
        goToSolution,
        goToDesignNotes,
        vignetteId,
      }}
    >
      {children}
    </VignetteStageContext.Provider>
  );
}

export function useVignetteStage() {
  const context = useContext(VignetteStageContext);
  if (!context) {
    throw new Error('useVignetteStage must be used within a VignetteStageProvider');
  }
  return context;
}
