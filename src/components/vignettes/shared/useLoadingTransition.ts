'use client';

import { useState, useCallback } from 'react';

interface UseLoadingTransitionOptions {
  duration: number;
  onComplete: () => void;
}

export function useLoadingTransition({ duration, onComplete }: UseLoadingTransitionOptions) {
  const [isLoading, setIsLoading] = useState(false);

  const startTransition = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onComplete();
    }, duration);
  }, [duration, onComplete]);

  return { isLoading, startTransition };
}
