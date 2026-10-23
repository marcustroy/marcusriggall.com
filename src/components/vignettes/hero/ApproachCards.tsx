'use client';

import { useState, useRef, useCallback, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useIntroSequence } from '@/lib/intro-sequence-context';
import { easings } from '@/lib/animations';

const CARD_COLOR = '#6B7280'; // neutral gray for all cards

type Approach = {
  heading: string;
  body: string;
  number: string;
  illustration: (color: string, borderColor: string) => ReactNode;
};

const accentMuted = 'rgba(107, 114, 128, 0.07)';
const accentBorder = 'rgba(107, 114, 128, 0.18)';
const accentGlow = 'rgba(107, 114, 128, 0.12)';
const gradientFrom = '#F4F5F7';
const gradientTo = '#FFFFFF';

const approaches: Approach[] = [
  {
    heading: 'I don\u2019t stop at the user problem',
    body: 'I dig into the tech, the data, and the business context. That breadth has helped me expand project scope, challenge assumptions, and find opportunities others miss.',
    number: '01',
    illustration: (color, borderColor) => (
      <LayersIllustration color={color} borderColor={borderColor} />
    ),
  },
  {
    heading: 'I design in the material of software',
    body: 'I prototype in code so I can interact with my ideas and feel how they work. It means I speak engineers\u2019 language and understand constraints early.',
    number: '02',
    illustration: (color, borderColor) => (
      <MaterialIllustration color={color} borderColor={borderColor} />
    ),
  },
  {
    heading: 'I build trust so people challenge my thinking',
    body: 'The best work comes from psychological safety. I invest in relationships so my teams feel comfortable pushing back, sparring openly, and arriving at better answers together.',
    number: '03',
    illustration: (color, borderColor) => (
      <OverlapIllustration color={color} borderColor={borderColor} />
    ),
  },
];

// Card positions for the fanned arrangement (desktop)
// Order: left (-6deg), center (0deg), right (+6deg)
const cardPositions = [
  { rotate: -6, x: 0, y: 8 },
  { rotate: 0, x: 0, y: 0 },
  { rotate: 6, x: 0, y: 8 },
];

// Stagger order: first card leads, then the rest follow
const staggerOrder = [0, 1, 2];

function hexPoints(cx: number, cy: number, r: number, rotDeg: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = ((60 * i + rotDeg) * Math.PI) / 180;
    const x = Math.round((cx + r * Math.cos(angle)) * 100) / 100;
    const y = Math.round((cy + r * Math.sin(angle)) * 100) / 100;
    return `${x},${y}`;
  }).join(' ');
}

function LayersIllustration({
  color,
  borderColor,
}: {
  color: string;
  borderColor: string;
}) {
  const cx = 56;
  const cy = 36;

  return (
    <svg
      width="112"
      height="72"
      viewBox="0 0 112 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer hexagon — widest perspective */}
      <polygon
        points={hexPoints(cx, cy, 32, 0)}
        fill={color}
        fillOpacity="0.04"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.15"
      />
      {/* Middle hexagon — rotated 15° */}
      <polygon
        points={hexPoints(cx, cy, 22, 15)}
        fill={color}
        fillOpacity="0.07"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.3"
      />
      {/* Inner hexagon — rotated 30°, most prominent */}
      <polygon
        points={hexPoints(cx, cy, 13, 30)}
        fill={color}
        fillOpacity="0.12"
        stroke={color}
        strokeWidth="2"
        strokeOpacity="0.5"
      />
    </svg>
  );
}

function MaterialIllustration({
  color,
  borderColor,
}: {
  color: string;
  borderColor: string;
}) {
  return (
    <svg
      width="112"
      height="72"
      viewBox="0 0 112 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left angle bracket — opening tag */}
      <path
        d="M24 20 L12 36 L24 52"
        stroke={color}
        strokeWidth="2"
        strokeOpacity="0.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Right angle bracket — closing tag */}
      <path
        d="M88 20 L100 36 L88 52"
        stroke={color}
        strokeWidth="2"
        strokeOpacity="0.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Shape emerging between the brackets — diamond being formed */}
      <rect
        x="42"
        y="22"
        width="28"
        height="28"
        rx="4"
        transform="rotate(45 56 36)"
        stroke={color}
        strokeWidth="2"
        strokeOpacity="0.5"
        fill={color}
        fillOpacity="0.1"
      />

      {/* Cursor line — direct manipulation */}
      <line
        x1="56"
        y1="26"
        x2="56"
        y2="46"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OverlapIllustration({
  color,
  borderColor,
}: {
  color: string;
  borderColor: string;
}) {
  return (
    <svg
      width="112"
      height="72"
      viewBox="0 0 112 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gate — left pillar */}
      <rect
        x="28"
        y="12"
        width="6"
        height="48"
        rx="2"
        fill={color}
        fillOpacity="0.08"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.3"
      />
      {/* Gate — right pillar */}
      <rect
        x="78"
        y="12"
        width="6"
        height="48"
        rx="2"
        fill={color}
        fillOpacity="0.08"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.3"
      />
      {/* Gate — lintel */}
      <rect
        x="28"
        y="10"
        width="56"
        height="6"
        rx="2"
        fill={color}
        fillOpacity="0.06"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.25"
      />

      {/* X inside — productive tension/disagreement within the safe frame */}
      <line
        x1="40"
        y1="22"
        x2="72"
        y2="54"
        stroke={color}
        strokeWidth="2"
        strokeOpacity="0.35"
        strokeLinecap="round"
      />
      <line
        x1="72"
        y1="22"
        x2="40"
        y2="54"
        stroke={color}
        strokeWidth="2"
        strokeOpacity="0.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CardContent({ approach }: { approach: Approach }) {
  return (
    <>
      {/* Number + accent line */}
      <div className="flex items-center gap-3 mb-4">
        <span className="type-label" style={{ color: CARD_COLOR }}>
          {approach.number}
        </span>
        <div
          className="flex-1 h-px"
          style={{ backgroundColor: accentBorder }}
        />
      </div>

      {/* Illustration */}
      <div className="mb-3">
        {approach.illustration(CARD_COLOR, accentBorder)}
      </div>

      {/* Heading */}
      <h3 className="type-body font-display font-medium text-primary">
        {approach.heading}
      </h3>

      {/* Body text */}
      <p className="text-sm text-primary mt-2" style={{ lineHeight: 1.65 }}>{approach.body}</p>
    </>
  );
}

export default function ApproachCards() {
  const reducedMotion = useReducedMotion();
  const { isComplete } = useIntroSequence();
  const [zOrder, setZOrder] = useState<Record<number, number>>({});
  const zCounterRef = useRef(0);
  // Refs for direct DOM manipulation — avoids re-renders on every mousemove
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tiltRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rainbowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const spotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sparkleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleHover = (index: number) => {
    zCounterRef.current += 1;
    setZOrder((prev) => ({ ...prev, [index]: zCounterRef.current }));

    // Show overlays
    const rainbow = rainbowRefs.current[index];
    const spot = spotRefs.current[index];
    const sparkle = sparkleRefs.current[index];
    if (rainbow) rainbow.style.opacity = '0.08';
    if (spot) spot.style.opacity = '1';
    if (sparkle) sparkle.style.opacity = '0.6';

    // Hover shadow
    const tilt = tiltRefs.current[index];
    if (tilt) {
      tilt.style.boxShadow = `0 20px 40px -8px rgba(0,0,0,0.1), 0 8px 16px -4px rgba(0,0,0,0.06), 0 0 0 1px ${accentBorder}, 0 0 24px ${accentGlow}`;
    }
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, index: number) => {
      if (reducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const my = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      const tiltX = my * -15;
      const tiltY = mx * 15;
      const gradAngle = Math.round(mx * 60 + 130);
      const spotX = 50 + mx * 50;
      const spotY = 50 + my * 50;
      const bgPosX = 50 + mx * 50;
      const bgPosY = 50 + my * 50;

      const tilt = tiltRefs.current[index];
      if (tilt) {
        tilt.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        tilt.style.transition = 'transform 0.1s ease-out, box-shadow 0.25s ease';
      }

      const rainbow = rainbowRefs.current[index];
      if (rainbow) {
        rainbow.style.backgroundImage = `repeating-linear-gradient(${gradAngle}deg, #ff4040 0%, #ffcc00 14%, #30d158 28%, #2979ff 42%, #9c27b0 57%, #ff4081 71%, #ff4040 85%, #ffcc00 100%)`;
        rainbow.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
      }

      const spot = spotRefs.current[index];
      if (spot) {
        spot.style.backgroundImage = `radial-gradient(circle at ${spotX}% ${spotY}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 25%, transparent 55%)`;
      }

      const sparkle = sparkleRefs.current[index];
      if (sparkle) {
        sparkle.style.backgroundPosition = `${mx * 3}px ${my * 3}px`;
      }
    },
    [reducedMotion]
  );

  const handleMouseLeave = useCallback(
    (index: number) => {
      const tilt = tiltRefs.current[index];
      if (tilt) {
        tilt.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
        tilt.style.transition = 'transform 0.5s ease-out, box-shadow 0.25s ease';
        tilt.style.boxShadow = `0 8px 24px -4px rgba(0,0,0,0.08), 0 4px 8px -2px rgba(0,0,0,0.04), 0 0 0 1px ${accentBorder}`;
      }

      const rainbow = rainbowRefs.current[index];
      const spot = spotRefs.current[index];
      const sparkle = sparkleRefs.current[index];
      if (rainbow) rainbow.style.opacity = '0';
      if (spot) spot.style.opacity = '0';
      if (sparkle) sparkle.style.opacity = '0';
    },
    []
  );

  const shouldShow = reducedMotion || isComplete;

  return (
    <div className="w-full">
      <h2 className="sr-only">Design approach</h2>

      {/* Desktop: fanned cards centered in the 1fr column */}
      <div className="hidden xl:flex items-start justify-center relative h-[360px] pt-6">
        {approaches.map((approach, index) => {
          const pos = cardPositions[index];
          const order = staggerOrder.indexOf(index);
          const fanOffset = (index - 1) * 100;

          return (
            <motion.div
              key={approach.heading}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="absolute left-1/2 top-0 w-[290px] cursor-default select-none"
              onHoverStart={() => handleHover(index)}
              onHoverEnd={() => handleMouseLeave(index)}
              onMouseMove={(e) => handleMouseMove(e, index)}
              initial={
                reducedMotion
                  ? { opacity: 1, rotate: pos.rotate, x: '-50%', y: pos.y }
                  : { opacity: 0, rotate: 0, x: '-50%', y: 20, scale: 0.95 }
              }
              animate={
                shouldShow
                  ? {
                      opacity: 1,
                      rotate: pos.rotate,
                      x: `calc(-50% + ${fanOffset}px)`,
                      y: pos.y,
                      scale: 1,
                    }
                  : { opacity: 0, rotate: 0, x: '-50%', y: 20, scale: 0.95 }
              }
              whileHover={{
                y: pos.y - 10,
                scale: 1.04,
                transition: { duration: 0.25, ease: easings.decel },
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.5,
                delay: shouldShow && !reducedMotion ? order * 0.15 : 0,
                ease: easings.decel,
              }}
              style={{
                zIndex: zOrder[index] ?? (approaches.length - index),
                transformOrigin: 'bottom center',
              }}
            >
              {/* Inner card with 3D tilt */}
              <div
                ref={(el) => { tiltRefs.current[index] = el; }}
                className="relative rounded-2xl px-7 py-6"
                style={{
                  backgroundImage: `linear-gradient(170deg, ${gradientFrom} 0%, ${gradientTo} 50%)`,
                  border: `1px solid ${accentBorder}`,
                  transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)',
                  transition: 'transform 0.5s ease-out, box-shadow 0.25s ease',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                  boxShadow: `0 8px 24px -4px rgba(0,0,0,0.08), 0 4px 8px -2px rgba(0,0,0,0.04), 0 0 0 1px ${accentBorder}`,
                }}
              >
                <div className="relative z-10">
                  <CardContent approach={approach} />
                </div>

                {/* Foil overlays — only when motion enabled */}
                {!reducedMotion && (
                  <>
                    {/* Rainbow holographic gradient */}
                    <div
                      ref={(el) => { rainbowRefs.current[index] = el; }}
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        backgroundImage: `repeating-linear-gradient(130deg, #ff4040 0%, #ffcc00 14%, #30d158 28%, #2979ff 42%, #9c27b0 57%, #ff4081 71%, #ff4040 85%, #ffcc00 100%)`,
                        backgroundSize: '200% 200%',
                        backgroundPosition: '50% 50%',
                        opacity: 0,
                        transition: 'opacity 0.4s ease',
                      }}
                    />

                    {/* Light reflection spot */}
                    <div
                      ref={(el) => { spotRefs.current[index] = el; }}
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 25%, transparent 55%)`,
                        opacity: 0,
                        transition: 'opacity 0.4s ease',
                      }}
                    />

                    {/* Foil sparkle texture */}
                    <div
                      ref={(el) => { sparkleRefs.current[index] = el; }}
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)`,
                        backgroundSize: '4px 4px',
                        backgroundPosition: '0px 0px',
                        opacity: 0,
                        transition: 'opacity 0.5s ease',
                      }}
                    />
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 xl:hidden">
        {approaches.map((approach, index) => {
          const order = staggerOrder.indexOf(index);

          return (
            <motion.div
              key={approach.heading}
              className="w-full rounded-2xl px-5 py-4"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
              animate={
                shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
              }
              transition={{
                duration: reducedMotion ? 0 : 0.4,
                delay: shouldShow && !reducedMotion ? order * 0.12 : 0,
                ease: easings.decel,
              }}
              style={{
                backgroundImage: `linear-gradient(170deg, ${gradientFrom} 0%, ${gradientTo} 50%)`,
                border: `1px solid ${accentBorder}`,
                boxShadow: `0 2px 8px -2px rgba(0,0,0,0.06), 0 0 0 1px ${accentBorder}`,
              }}
            >
              <CardContent approach={approach} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
