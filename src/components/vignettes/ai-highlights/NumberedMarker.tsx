'use client';

import { useState, useEffect, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface NumberedMarkerProps {
  number: number;
  onClick?: (e?: React.MouseEvent) => void;
  isActive?: boolean;
  className?: string;
  hasBeenDiscovered?: boolean;
  onDiscover?: () => void;
}

const NumberedMarker = forwardRef<HTMLButtonElement, NumberedMarkerProps>(
  function NumberedMarker(
    {
      number,
      onClick,
      isActive = false,
      className = '',
      hasBeenDiscovered = false,
      onDiscover,
      ...props
    },
    ref
  ) {
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    // Start subtle animation after delay (user has had time to scan content)
    useEffect(() => {
      if (prefersReducedMotion || hasBeenDiscovered) {
        setShouldAnimate(false);
        return;
      }
      const timer = setTimeout(() => setShouldAnimate(true), 1500);
      return () => clearTimeout(timer);
    }, [prefersReducedMotion, hasBeenDiscovered]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setShouldAnimate(false);
      onDiscover?.();
      onClick?.(e);
    };

    return (
      <motion.button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={`
          flex items-center justify-center
          size-8 rounded-full
          bg-white border border-black/15 hover:border-black/30
          text-primary text-[13px] font-medium
          cursor-pointer
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2
          ${className}
        `}
        {...props}
      >
        {number}
      </motion.button>
    );
  }
);

export default NumberedMarker;
