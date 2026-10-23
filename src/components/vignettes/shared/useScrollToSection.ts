'use client';

import { useCallback } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

// Estimated height of the mobile design notes sheet
const MOBILE_SHEET_HEIGHT = 280;

/**
 * Hook for scrolling to a section when a design note is activated on mobile.
 * Only scrolls on mobile (< 1024px viewport) to avoid interfering with desktop popovers.
 * Centers the element in the visible area above the bottom sheet.
 */
export function useScrollToSection() {
  const prefersReducedMotion = useReducedMotion();

  const scrollToSection = useCallback(
    (sectionId: string | null) => {
      // Only run on mobile (< lg breakpoint)
      if (typeof window === 'undefined' || window.innerWidth >= 1024) return;
      if (!sectionId) return;

      const element = document.querySelector(
        `[data-section-id="${sectionId}"]`
      ) as HTMLElement | null;

      if (!element) return;

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate visible area above the sheet
      const visibleAreaHeight = viewportHeight - MOBILE_SHEET_HEIGHT;

      // Center the element in the visible area
      const elementCenter = rect.top + rect.height / 2;
      const targetCenter = visibleAreaHeight / 2;
      const scrollOffset = elementCenter - targetCenter;

      const scrollTarget = window.scrollY + scrollOffset;

      window.scrollTo({
        top: scrollTarget,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    },
    [prefersReducedMotion]
  );

  return { scrollToSection };
}
