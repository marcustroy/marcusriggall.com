'use client';

import { useState } from 'react';
import type { ScoreDetailPoint } from './ScoreDetailPanel';
import { clamp, seededRandom } from './random';

// The side panel's trend: where a point sat in each survey. The chart zooms in on the area the points cover, so
// dots that would bunch up on the full 0-100 chart spread apart.

const EARLIER_SURVEYS = [
  'Engagement Survey (H1 2024)',
  'Engagement Survey (H2 2024)',
  'Engagement Survey (H1 2025)',
  'Engagement Survey (H2 2025)',
];

interface Entry {
  survey: string;
  x: number;
  y: number;
}

function buildTrend(point: ScoreDetailPoint, latestName: string): Entry[] {
  const random = seededRandom(`${point.id}-pcq-trend`);
  const startX = clamp(point.x + (random() - 0.5) * 34, 8, 92);
  const startY = clamp(point.y + (random() - 0.5) * 34, 8, 92);
  const surveys = [...EARLIER_SURVEYS, latestName];
  return surveys.map((survey, i) => {
    if (i === surveys.length - 1) return { survey, x: point.x, y: point.y };
    const progress = i / (surveys.length - 1);
    return {
      survey,
      x: clamp(startX + (point.x - startX) * progress + (random() - 0.5) * 8, 4, 96),
      y: clamp(startY + (point.y - startY) * progress + (random() - 0.5) * 8, 4, 96),
    };
  });
}

const THRESHOLD = 65;
const W = 320;
const H = 224;
const PLOT = { left: 38, right: 316, top: 12, bottom: 184 };
const DOT_SIZE = 12;
const LINE_COLOR = 'var(--color-gray-400)';

// A marker as SVG: the point's own shape and colour.
function Glyph({
  shape = 'circle',
  cx,
  cy,
  size,
  color,
  ...rest
}: {
  shape?: NonNullable<ScoreDetailPoint['shape']>;
  cx: number;
  cy: number;
  size: number;
  color: string;
} & React.SVGProps<SVGGElement>) {
  const half = size / 2;
  return (
    <g {...rest}>
      {shape === 'triangle' ? (
        <polygon points={`${cx},${cy - half} ${cx + half},${cy + half} ${cx - half},${cy + half}`} fill={color} />
      ) : shape === 'square' ? (
        <rect x={cx - half} y={cy - half} width={size} height={size} rx="2" fill={color} />
      ) : (
        <circle cx={cx} cy={cy} r={half} fill={color} />
      )}
    </g>
  );
}

function HoverCard({ leftPct, topPct, entry }: { leftPct: number; topPct: number; entry: Entry }) {
  return (
    <div
      className="pointer-events-none absolute z-10 w-[190px] rounded-xl bg-[var(--color-white)] px-3 py-2.5 text-[11px] leading-snug shadow-[0_6px_20px_-4px_rgba(0,0,0,0.3)]"
      style={{
        left: `${clamp(leftPct, 30, 70)}%`,
        top: `${topPct}%`,
        transform: 'translate(-50%, calc(-100% - 14px))',
      }}
    >
      <p className="m-0 font-semibold">Report: {entry.survey}</p>
      <p className="m-0 mt-1.5">Performance Confidence: {Math.round(entry.x)}%</p>
      <p className="m-0 mt-1">Workplace Engagement: {Math.round(entry.y)}%</p>
    </div>
  );
}

// The axis range that fits the points with a little room around them (never tighter than 16 points across).
function fitRange(values: number[]): [number, number] {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const middle = (lo + hi) / 2;
  const half = Math.max((hi - lo) / 2 + 6, 8);
  return [clamp(middle - half, 0, 100), clamp(middle + half, 0, 100)];
}

function ticksFor(range: [number, number]) {
  const step = [1, 2, 5, 10, 20].find((s) => (range[1] - range[0]) / s <= 5) ?? 20;
  const list: number[] = [];
  for (let v = Math.ceil(range[0] / step) * step; v <= range[1]; v += step) list.push(v);
  return list;
}

export default function PcqTrend({ point, latestName }: { point: ScoreDetailPoint; latestName: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const entries = buildTrend(point, latestName);
  const color = point.color ?? 'var(--color-yellow-500)';

  const xRange = fitRange(entries.map((e) => e.x));
  const yRange = fitRange(entries.map((e) => e.y));
  const sx = (x: number) => PLOT.left + ((x - xRange[0]) / (xRange[1] - xRange[0])) * (PLOT.right - PLOT.left);
  const sy = (y: number) => PLOT.bottom - ((y - yRange[0]) / (yRange[1] - yRange[0])) * (PLOT.bottom - PLOT.top);
  const card = hovered === null ? null : entries[hovered];

  return (
    <div className="relative mt-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${point.name} across surveys on the Performance Culture Quadrant`}>
        {ticksFor(xRange).map((tick) => (
          <g key={`x${tick}`}>
            <line x1={sx(tick)} x2={sx(tick)} y1={PLOT.top} y2={PLOT.bottom} stroke="var(--color-gray-300)" strokeWidth="1" strokeDasharray="3 3" />
            <text x={sx(tick)} y={PLOT.bottom + 13} textAnchor="middle" fontSize="10" fill="var(--color-gray-600)">
              {tick}
            </text>
          </g>
        ))}
        {ticksFor(yRange).map((tick) => (
          <g key={`y${tick}`}>
            <line x1={PLOT.left} x2={PLOT.right} y1={sy(tick)} y2={sy(tick)} stroke="var(--color-gray-300)" strokeWidth="1" strokeDasharray="3 3" />
            <text x={PLOT.left - 6} y={sy(tick) + 3.5} textAnchor="end" fontSize="10" fill="var(--color-gray-600)">
              {tick}
            </text>
          </g>
        ))}
        {THRESHOLD >= xRange[0] && THRESHOLD <= xRange[1] && (
          <line x1={sx(THRESHOLD)} x2={sx(THRESHOLD)} y1={PLOT.top} y2={PLOT.bottom} stroke="var(--color-gray-500)" strokeWidth="1" />
        )}
        {THRESHOLD >= yRange[0] && THRESHOLD <= yRange[1] && (
          <line x1={PLOT.left} x2={PLOT.right} y1={sy(THRESHOLD)} y2={sy(THRESHOLD)} stroke="var(--color-gray-500)" strokeWidth="1" />
        )}

        <polyline fill="none" stroke={LINE_COLOR} strokeWidth="1" points={entries.map((e) => `${sx(e.x)},${sy(e.y)}`).join(' ')} />
        {/* One chevron on each stretch of line, pointing the way the trend moves */}
        {entries.slice(1).map((entry, i) => {
          const from = entries[i];
          const x1 = sx(from.x);
          const y1 = sy(from.y);
          const dx = sx(entry.x) - x1;
          const dy = sy(entry.y) - y1;
          if (Math.hypot(dx, dy) < 12) return null;
          return (
            <path
              key={`chevron-${entry.survey}`}
              d="M-2.5 -3.5 L2 0 L-2.5 3.5"
              fill="none"
              stroke={LINE_COLOR}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform={`translate(${x1 + dx / 2} ${y1 + dy / 2}) rotate(${(Math.atan2(dy, dx) * 180) / Math.PI})`}
              style={{ pointerEvents: 'none' }}
            />
          );
        })}
        {entries.map((entry, i) => (
          <Glyph
            key={entry.survey}
            shape={point.shape}
            cx={sx(entry.x)}
            cy={sy(entry.y)}
            size={DOT_SIZE + (hovered === i ? 2 : 0)}
            color={color}
            tabIndex={0}
            aria-label={`${entry.survey}: Performance Confidence ${Math.round(entry.x)}%, Workplace Engagement ${Math.round(entry.y)}%`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            className="cursor-pointer"
          />
        ))}

        <text transform={`translate(12 ${(PLOT.top + PLOT.bottom) / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="var(--color-gray-600)">
          Workplace Engagement
        </text>
        <text x={(PLOT.left + PLOT.right) / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="var(--color-gray-600)">
          Performance Confidence
        </text>
      </svg>

      {card && <HoverCard leftPct={(sx(card.x) / W) * 100} topPct={(sy(card.y) / H) * 100} entry={card} />}
    </div>
  );
}
