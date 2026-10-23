'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

type IntroStage = 'name' | 'headline' | 'bio' | 'company' | 'complete';

interface IntroSequenceContextValue {
  stage: IntroStage;
  setStage: (stage: IntroStage) => void;
  isComplete: boolean;
  isSplashComplete: boolean;
  setSplashComplete: () => void;
  skipIntro: () => void;
}

const IntroSequenceContext = createContext<IntroSequenceContextValue | null>(null);

const SCROLL_THRESHOLD = 20; // pixels scrolled before triggering skip

export function IntroSequenceProvider({ children }: { children: ReactNode }) {
  const [stage, setStageInternal] = useState<IntroStage>('complete');
  const [isSplashComplete, setIsSplashComplete] = useState(true);

  const setStage = useCallback((newStage: IntroStage) => {
    setStageInternal(newStage);
  }, []);

  const setSplashComplete = useCallback(() => {
    setIsSplashComplete(true);
  }, []);

  const skipIntro = useCallback(() => {
    setIsSplashComplete(true);
    setStageInternal('complete');
  }, []);

  // Listen for scroll to skip intro
  useEffect(() => {
    if (stage === 'complete') return;

    const handleScroll = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        skipIntro();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stage, skipIntro]);

  return (
    <IntroSequenceContext.Provider
      value={{
        stage,
        setStage,
        isComplete: stage === 'complete',
        isSplashComplete,
        setSplashComplete,
        skipIntro,
      }}
    >
      {children}
    </IntroSequenceContext.Provider>
  );
}

export function useIntroSequence() {
  const context = useContext(IntroSequenceContext);
  if (!context) {
    throw new Error('useIntroSequence must be used within IntroSequenceProvider');
  }
  return context;
}
