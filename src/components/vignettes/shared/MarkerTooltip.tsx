'use client';

import { ReactNode } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface MarkerTooltipProps {
  number: number;
  text: string;
  children: ReactNode;
  side?: 'left' | 'right';
  isVisible: boolean;
}

/**
 * A viewport-aware tooltip wrapper using Radix UI.
 * Renders tooltip in a portal to escape z-index stacking contexts.
 * Auto-flips when near viewport edges.
 */
export default function MarkerTooltip({
  number,
  text,
  children,
  side = 'left',
  isVisible,
}: MarkerTooltipProps) {
  return (
    <Tooltip.Provider delayDuration={0} skipDelayDuration={0}>
      <Tooltip.Root open={isVisible}>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side={side}
            sideOffset={12}
            collisionPadding={16}
            avoidCollisions={true}
            className="z-[9999] hidden xl:block"
          >
            {/* Card styling matching DesktopMarkerTooltip */}
            <div
              className="relative flex items-start gap-2.5 px-3.5 py-3 bg-white rounded-lg border border-black/[0.04] w-[240px]"
              style={{
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* Number badge - matches the marker style */}
              <div className="flex items-center justify-center flex-shrink-0 size-5 rounded-full bg-neutral-700 text-white text-[10px] font-medium mt-px">
                {number}
              </div>
              {/* Text content */}
              <p
                className="text-[14px] leading-[1.5] tracking-[-0.01em] text-neutral-800 m-0"
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
              >
                {text}
              </p>
            </div>
            {/* Arrow */}
            <Tooltip.Arrow
              className="fill-white"
              style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.04))' }}
              width={12}
              height={6}
            />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
