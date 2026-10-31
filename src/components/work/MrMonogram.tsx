'use client';

import { useEffect, useId, useRef } from 'react';
import { animate } from 'framer-motion';

// The MR initials, taken from the monogram artwork (a 91 x 52 outline).
const GLYPH =
  'M69.5557 2.32227C73.889 0.443841 78.2278 -0.459436 81.9248 0.231445C85.7375 0.944073 88.7154 3.33341 90.1475 7.59766L90.3193 8.08887C91.1287 10.5342 91.208 12.796 90.6084 14.8496C89.9713 17.0312 88.6106 18.8293 86.8447 20.293C83.3621 23.1794 78.1047 24.9324 72.708 25.9502C67.486 26.935 61.9323 27.2659 57.2832 27.1787C59.8235 28.6226 62.5266 30.3094 65.29 32.165C72.0701 36.7178 79.3472 42.3617 85.7305 48.0928C86.3673 48.6646 86.4202 49.6443 85.8486 50.2812C85.2767 50.9182 84.2961 50.9713 83.6592 50.3994C77.3843 44.7657 70.2216 39.2115 63.5615 34.7393C57.777 30.855 52.4638 27.851 48.4795 26.2881C48.4168 26.2728 48.3544 26.2571 48.293 26.2412C47.4006 30.3603 46.2438 35.7032 45.2617 40.2363C44.6983 42.837 44.192 45.1712 43.8271 46.8555C43.6529 47.6598 43.5111 48.3162 43.4102 48.7822C43.481 49.0377 43.4962 49.313 43.4404 49.5908C43.2501 50.5381 42.3272 51.1518 41.3799 50.9619C39.6059 50.6058 39.0083 48.89 38.7754 47.8232C38.5042 46.5809 38.4516 44.9927 38.4912 43.2979C38.5705 39.9074 39.0495 35.4184 39.3545 31.1953C39.6676 26.8595 39.8034 22.7627 39.2969 19.7852C39.0427 18.2916 38.6552 17.2706 38.2012 16.6582C37.8126 16.1342 37.3802 15.8986 36.7275 15.8984C36.3828 15.8985 35.8335 16.0819 35.0605 16.8525C34.2973 17.6137 33.4901 18.7791 32.6602 20.3096C31.0042 23.3635 29.451 27.5023 28.0176 31.7549C26.6295 35.8729 25.2774 40.3468 24.1875 43.4893C23.6302 45.096 23.0873 46.5204 22.5664 47.5615C22.31 48.0739 22.0155 48.5829 21.6738 48.9883C21.3972 49.3163 20.747 49.9928 19.7393 49.9932C18.5498 49.9932 17.939 49.1112 17.707 48.623C17.4687 48.1214 17.3603 47.5398 17.2988 47.0312C17.1713 45.9757 17.1784 44.5612 17.2412 43.002C17.3664 39.893 17.7482 35.6319 17.9922 31.5918C18.2422 27.453 18.3556 23.4592 18.002 20.5312C17.823 19.0501 17.5417 18.015 17.2119 17.3984C16.9177 16.8485 16.7546 16.8988 16.7412 16.9014C16.183 16.9014 15.2651 17.3396 14.0312 19.2041C12.8552 20.9815 11.694 23.6091 10.5195 26.8965C8.16843 33.4776 5.95657 42.1234 3.43066 50.7412C3.15885 51.6685 2.18614 52.1993 1.25879 51.9277C0.33146 51.6559 -0.200365 50.6842 0.0712891 49.7568C2.54195 41.3275 4.828 32.4244 7.22363 25.7188C8.42243 22.3632 9.69656 19.4121 11.1123 17.2725C12.4704 15.2202 14.3016 13.4014 16.7412 13.4014C18.4829 13.4017 19.6319 14.5013 20.2988 15.748C20.9369 16.941 21.2808 18.4917 21.4766 20.1123C21.8723 23.389 21.735 27.6687 21.4854 31.8027C21.2423 35.8276 20.9002 39.653 20.7598 42.6807C20.7988 42.5696 20.8411 42.4575 20.8809 42.3428C22.0082 39.0925 23.2163 35.042 24.7012 30.6367C26.1408 26.3657 27.7736 21.9803 29.584 18.6416C30.4871 16.9762 31.4835 15.4773 32.5898 14.374C33.6864 13.2807 35.074 12.3985 36.7275 12.3984C38.5727 12.3986 40.0157 13.229 41.0127 14.5732C41.9441 15.8293 42.4548 17.4804 42.7471 19.1982C43.3334 22.6447 43.1571 27.1344 42.8457 31.4473C42.6601 34.0175 42.4275 36.5194 42.25 38.8086L47.6992 11.8359C47.8688 10.9971 48.6865 10.4548 49.5254 10.624C50.3645 10.7935 50.9077 11.6111 50.7383 12.4502L49.6162 18.0039C55.1951 11.0679 62.597 5.33882 69.5557 2.32227ZM81.3555 3.27832C78.5134 2.74723 74.8402 3.41043 70.7881 5.16699C63.2112 8.4517 54.9258 15.2918 49.5244 23.3477C49.911 23.4325 50.3663 23.5197 50.8936 23.5996C52.4698 23.8384 54.4871 24.0069 56.7783 24.0684C61.3636 24.1913 66.9437 23.8831 72.1338 22.9043C77.3709 21.9166 81.9982 20.2842 84.8672 17.9062C86.2768 16.7378 87.2084 15.4337 87.6328 13.9805C88.0546 12.5359 88.0189 10.7948 87.2373 8.66602C87.2318 8.65096 87.2267 8.63533 87.2217 8.62012C86.1494 5.39248 84.068 3.78536 81.3555 3.27832Z';

// The two pen strokes that write the initials, as centrelines that follow the artwork: the m and the
// stem of the r in one stroke, then the r's bowl and its leg in a second. They are used as a mask, only a
// little wider than the artwork's own line, so each stroke reveals nothing beyond itself (a wide mask would
// show the start of the r while the m is still being written).
const STROKES = [
  {
    d: 'M2.4 50 C6 40 10 26 13.5 17.5 C15 14.5 17 13.5 17.8 16 C19.5 24 19.8 40 19.6 47.5 C19.5 50 21 49 22.5 45 C26 36 29 21 33 15.5 C35.5 12.5 37.5 13.5 39 19 C41 28 40.6 40 40.8 49 C41.5 50 42 49 43 45 C45 36 47.5 22 49.4 11.2',
  },
  {
    d: 'M49.6 21 C55 13 62 6 70 3.2 C75 1.5 80 1.4 84 2.8 C89 4.5 90.4 9 89.2 13.5 C87.5 18.5 80 22.8 71 25 C63 26.8 56 26.6 49.5 25.2 C55 27 60 29.5 66 33.5 C73 38 80 44 85.5 49.5',
  },
];

// The pen moves at one steady speed along the whole signature, easing only a little in and out, and lifts
// for a moment between the m and the r (as a length of travel). Easing each stroke separately made it stop
// and start like two animations instead of one hand writing.
const WRITE_DURATION = 2.3;
const PEN_LIFT = 7;
const WRITE_EASE = [0.3, 0.05, 0.45, 1] as const;

interface MrMonogramProps {
  color: string;
  className?: string;
  /** Show the finished initials straight away, with no writing animation. */
  still?: boolean;
  /** Seconds before the first stroke starts. */
  delay?: number;
  /** Called once the last stroke has been drawn. */
  onWritten?: () => void;
}

// Writes the MR initials onto the screen, stroke by stroke.
export default function MrMonogram({ color, className, still = false, delay = 0, onWritten }: MrMonogramProps) {
  const maskId = useId();
  const clipId = useId();
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const written = useRef(onWritten);
  useEffect(() => {
    written.current = onWritten;
  });

  useEffect(() => {
    if (still) return;
    const lengths = paths.current.map((path) => path?.getTotalLength() ?? 0);
    // A stroke's share of the pen's travel, so that every stroke is drawn at the same speed.
    const total = lengths.reduce((sum, length) => sum + length, 0) + PEN_LIFT * (STROKES.length - 1);
    const control = animate(0, 1, {
      duration: WRITE_DURATION,
      delay,
      ease: WRITE_EASE,
      onUpdate: (progress) => {
        let travelled = progress * total;
        paths.current.forEach((path, index) => {
          const drawn = Math.min(1, Math.max(0, travelled / lengths[index]));
          path?.setAttribute('stroke-dashoffset', String(1 - drawn));
          travelled -= lengths[index] + PEN_LIFT;
        });
      },
      onComplete: () => written.current?.(),
    });
    return () => control.stop();
    // The initials are written once, when they appear.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <svg viewBox="0 0 91 52" fill="none" className={className} role="img" aria-label="MR">
      <defs>
        {/* The m's last stroke runs right beside the start of the r, so its mask would also uncover a stub of
            the r (its bowl and the top of its leg) before the pen gets there. This keeps the stroke to the stem. */}
        <clipPath id={clipId}>
          <polygon points="-10,-10 60,-10 60,12 50.9,12 50.1,14.5 48.9,20 48.3,24 48.3,32 60,32 60,60 -10,60" />
        </clipPath>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="-6" y="-6" width="103" height="64">
          {STROKES.map((stroke, index) => (
            <path
              key={index}
              ref={(el) => {
                paths.current[index] = el;
              }}
              d={stroke.d}
              clipPath={index === 0 ? `url(#${clipId})` : undefined}
              stroke="white"
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              pathLength={1}
              strokeDasharray="1 2"
              strokeDashoffset={still ? 0 : 1}
            />
          ))}
        </mask>
      </defs>
      <path d={GLYPH} fill={color} mask={`url(#${maskId})`} />
    </svg>
  );
}
