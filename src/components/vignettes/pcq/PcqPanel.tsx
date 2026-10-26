'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, type Transition } from 'framer-motion';
import { Button, Heading, Icon } from '@kaizen/components';
import { useReducedMotion } from '@/lib/useReducedMotion';
import CoachPanel from './CoachPanel';
import '@/styles/kaizen.css';
import '../heatmap-comparisons/heatmap.css';
import './pcq.css';
import {
  MIN_RESPONSES,
  THRESHOLD,
  comparisonPoint,
  overallByQuadrant,
  overallScores,
  presets,
  quadrantById,
  quadrants,
  stressGroups,
  typicalGroups,
  type DemographicGroup,
  type PresetId,
  type QuadrantId,
} from './content';

// Colours taken from the product recording; Kaizen has no teal token.
const TEAL_BG = '#E8F6F5';
const TEAL_BORDER = '#2A9D96';
const TEAL_TEXT = '#0E5753';
const CHIP_BG = '#DDF2F4';

// One row of legend items by default; expanding shows every item in even columns.
const LEGEND_LIMIT = 3;
const LEGEND_COLUMNS = 3;
const DOT_SIZE = 12;
const GRID_STEPS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
// Grid lines run a little past the plot area on every side, as in the product.
const GRID_OVERHANG = 12;
const gridDash = (direction: 'to bottom' | 'to right') =>
  `repeating-linear-gradient(${direction}, var(--color-gray-300) 0 4px, transparent 4px 8px)`;

interface PlottedPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  kind: 'overall' | 'comparison' | 'group';
}

interface DotProps {
  point: PlottedPoint;
  left: number;
  top: number;
  visible: boolean;
  move: Transition;
  fade: Transition;
  onSelect: () => void;
  onHover: (active: boolean) => void;
}

// A data point. When zooming, points that leave the chart fade out where they were, and points
// that enter fade in where they land, so nothing ever travels in from (or out to) the outside.
function Dot({ point, left, top, visible, move, fade, onSelect, onHover }: DotProps) {
  const [state, setState] = useState({ left, top, visible, snap: false });

  // Adjust state while rendering (React's pattern for deriving state from props).
  if (visible) {
    if (!state.visible || state.left !== left || state.top !== top) {
      setState({ left, top, visible: true, snap: !state.visible });
    }
  } else if (state.visible) {
    setState({ ...state, visible: false, snap: false });
  }

  const shown = state.visible;
  return (
    <motion.button
      type="button"
      aria-label={point.name}
      tabIndex={shown ? 0 : -1}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      className="absolute rounded-full"
      style={{
        width: DOT_SIZE,
        height: DOT_SIZE,
        marginLeft: -DOT_SIZE / 2,
        marginTop: -DOT_SIZE / 2,
        background: point.color,
        zIndex: point.kind === 'group' ? 2 : 3,
        pointerEvents: shown ? 'auto' : 'none',
      }}
      initial={false}
      animate={{
        left: `${state.left}%`,
        top: `${state.top}%`,
        opacity: shown ? 1 : 0,
        scale: shown ? 1 : 0.4,
      }}
      transition={{
        left: state.snap ? { duration: 0 } : move,
        top: state.snap ? { duration: 0 } : move,
        opacity: fade,
        scale: fade,
      }}
    />
  );
}

function quadrantOf(point: { x: number; y: number }): QuadrantId {
  const right = point.x >= THRESHOLD;
  const top = point.y >= THRESHOLD;
  if (top) return right ? 'peak-performance' : 'engaged-skepticism';
  return right ? 'strained' : 'disconnected';
}

function QuadrantLogo() {
  return (
    <svg width="32" height="30" viewBox="0 0 63 59" fill="none" aria-hidden="true">
      <path d="M4 26.5V14.5C4 6.5 10.3 0 18.3 0H30.5V26.5H4Z" fill="#45A5AD" />
      <path d="M36 0H48.5C56.5 0 63 6.5 63 14.5V26.5H36V0Z" fill="#214F55" />
      <path d="M4 32H30.5V59H0C3.2 51.6 4 44.1 4 36V32Z" fill="#45A5AD" />
      <path d="M36 32H63V44.5C63 52.5 56.5 59 48.5 59H36V32Z" fill="#45A5AD" />
    </svg>
  );
}

interface PcqPanelProps {
  className?: string;
}

export default function PcqPanel({ className = '' }: PcqPanelProps) {
  const reducedMotion = useReducedMotion();
  const [preset, setPreset] = useState<PresetId>('real');
  const [quadrantId, setQuadrantId] = useState<QuadrantId>('peak-performance');
  const [zoomed, setZoomed] = useState<QuadrantId | null>(null);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const [legendExpanded, setLegendExpanded] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const titleRowRef = useRef<HTMLDivElement>(null);

  // Without a close button, the explorer closes on Escape or a click outside it.
  useEffect(() => {
    if (!explorerOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!titleRowRef.current?.contains(event.target as Node)) setExplorerOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExplorerOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [explorerOpen]);

  const move = reducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 140, damping: 22, mass: 0.9 };
  const fade = reducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' as const };

  const isError = preset === 'error';
  const sourceGroups: DemographicGroup[] =
    preset === 'typical' || preset === 'privacy' ? typicalGroups : preset === 'stress' ? stressGroups : [];
  const privacyOn = preset === 'privacy';
  const groups = privacyOn ? sourceGroups.filter((g) => !g.smallGroup) : sourceGroups;
  const hiddenCount = sourceGroups.length - groups.length;
  const demographicActive = preset !== 'real';

  const quadrant = quadrantById[quadrantId];
  const scores = overallScores[quadrantId];
  const summary = quadrant.summary.replace('{we}', scores.we).replace('{pc}', scores.pc);

  const overall = overallByQuadrant[quadrantId];
  const points: PlottedPoint[] = [
    { id: 'overall', name: 'Overall', ...overall, color: 'var(--color-purple-500)', kind: 'overall' },
    {
      id: 'comparison',
      name: 'Comparison: PCD Survey (H1 2026)',
      ...comparisonPoint,
      color: 'var(--color-blue-500)',
      kind: 'comparison',
    },
    ...groups.map((g) => ({ id: g.id, name: g.name, x: g.x, y: g.y, color: g.color, kind: 'group' as const })),
  ];

  // The visible axis range: the whole chart, or a single zoomed quadrant.
  const domain = zoomed
    ? { x: quadrantById[zoomed].x, y: quadrantById[zoomed].y }
    : { x: [0, 100] as [number, number], y: [0, 100] as [number, number] };
  const toLeft = (x: number) => ((x - domain.x[0]) / (domain.x[1] - domain.x[0])) * 100;
  const toTop = (y: number) => 100 - ((y - domain.y[0]) / (domain.y[1] - domain.y[0])) * 100;
  const inDomain = (p: { x: number; y: number }) =>
    p.x >= domain.x[0] && p.x <= domain.x[1] && p.y >= domain.y[0] && p.y <= domain.y[1];

  const legendPoints = points.filter(inDomain);
  const legendLimited = !legendExpanded && legendPoints.length > LEGEND_LIMIT;
  const legendShown = legendLimited ? legendPoints.slice(0, LEGEND_LIMIT) : legendPoints;
  const hovered = points.find((p) => p.id === hoveredId && inDomain(p));

  const choosePreset = (id: PresetId) => {
    setPreset(id);
    setLegendExpanded(false);
    setZoomed(null);
  };

  return (
    <div className={`kaizen-scope flex w-full items-stretch ${className}`}>
    <div className="relative min-w-0 flex-1 rounded-[var(--border-solid-border-radius)] bg-[var(--color-white)] p-5 text-[var(--color-purple-800)]">
      {/* Title, with the state explorer at the right */}
      <div ref={titleRowRef} className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <QuadrantLogo />
          <Heading tag="h3" variant="heading-5">
            Performance Culture Quadrant
          </Heading>
        </div>
        <div>
          <Button
            variant="secondary"
            size="small"
            className="pcq-nowrap"
            icon={<Icon name="tune" isPresentational />}
            onPress={() => setExplorerOpen((open) => !open)}
            aria-expanded={explorerOpen}
          >
            Explore states
          </Button>
        </div>

        {/* State explorer */}
        <AnimatePresence>
          {explorerOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={fade}
              className="absolute right-0 top-full z-40 mt-2 w-[320px] rounded-[7px] border-2 border-[var(--color-gray-400)] bg-[var(--color-white)] p-3 shadow-[var(--shadow-large-box-shadow)]"
            >
              <p className="mb-2 text-[13px] font-semibold">Data states</p>
              <div className="grid grid-cols-2 gap-1.5">
                {presets.map((item) => (
                  <Button
                    key={item.id}
                    size="small"
                    isFullWidth
                    className="pcq-state-button"
                    variant={preset === item.id ? 'primary' : 'secondary'}
                    onPress={() => choosePreset(item.id)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
              <p className="mb-2 mt-4 border-t border-[var(--color-gray-300)] pt-3 text-[13px] font-semibold">
                Organization quadrant
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {quadrants.map((q) => (
                  <Button
                    key={q.id}
                    size="small"
                    isFullWidth
                    className="pcq-state-button"
                    variant={quadrantId === q.id ? 'primary' : 'secondary'}
                    onPress={() => setQuadrantId(q.id)}
                  >
                    {q.label}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Summary callout, or the error state */}
      <div className="mt-4">
        <AnimatePresence mode="wait" initial={false}>
          {isError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fade}
              className="rounded-[7px] border-2 border-[var(--color-red-300)] bg-[var(--color-red-100)] px-4 py-3"
            >
              <p className="text-[13px] font-semibold">Something went wrong</p>
              <p className="mt-1 text-[12px] leading-[1.5]">
                We couldn&apos;t load the Performance Culture Quadrant. Please try again, or contact{' '}
                <span className="underline">customer support</span>.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={quadrantId}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={fade}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[7px] border-2 px-4 py-3"
              style={{ background: TEAL_BG, borderColor: TEAL_BORDER }}
            >
              <div className="min-w-0 flex-1 basis-[280px]">
                <p className="text-[13px] font-semibold" style={{ color: TEAL_TEXT }}>
                  {quadrant.title}
                </p>
                <p className="mt-1 text-[12px] leading-[1.5]">{summary}</p>
              </div>
              <Button
                variant="secondary"
                size="small"
                icon={<Icon name="auto_awesome" isPresentational />}
                onPress={() => setCoachOpen(true)}
              >
                Explore with Coach
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filters (the state explorer lives in the title row so it stays available in the error state) */}
      <div className={`relative mt-4 flex flex-wrap items-center gap-2 ${isError ? 'hidden' : ''}`}>
            {!isError && (
              <div className="inline-flex items-center gap-1">
                <Button
                  variant="tertiary"
                  size="small"
                  className="heatmap-toolbar-button"
                  icon={<Icon name="expand_more" isPresentational />}
                  iconPosition="end"
                >
                  <span className="whitespace-nowrap">
                    <span className="font-semibold">Demographic{demographicActive ? ':' : ''}</span>
                    {demographicActive ? ' Department' : ''}
                  </span>
                </Button>
                {demographicActive && (
                  <Button
                    variant="tertiary"
                    size="small"
                    hasHiddenLabel
                    className="heatmap-toolbar-button"
                    icon={<Icon name="close" isPresentational />}
                    onPress={() => choosePreset('real')}
                  >
                    Remove demographic filter
                  </Button>
                )}
              </div>
            )}
            {!isError && zoomed && (
              <Button
                variant="tertiary"
                size="small"
                icon={<Icon name="zoom_out" isPresentational />}
                onPress={() => setZoomed(null)}
              >
                Back to full view
              </Button>
            )}
      </div>

      {!isError && (
        <>
          {/* Chart */}
          <div className="mt-5 flex">
            <div className="flex w-6 shrink-0 items-center justify-center">
              <span className="-rotate-90 whitespace-nowrap text-[11px] text-[var(--color-gray-600)]">
                Workplace Engagement
              </span>
            </div>
            <div className="min-w-0 flex-1 pl-7">
              <div className="relative">
                {/* y ticks */}
                <span className="absolute -left-1 top-0 -translate-x-full text-[11px] text-[var(--color-gray-600)]">
                  {domain.y[1]}
                </span>
                <span className="absolute -left-1 bottom-0 -translate-x-full text-[11px] text-[var(--color-gray-600)]">
                  {domain.y[0]}
                </span>

                <div className="relative h-[300px] w-full">
                  {/* quadrants: hover to highlight, select to zoom in */}
                  {!zoomed &&
                    quadrants.map((q) => {
                      const left = q.x[0] === 0;
                      const top = q.y[0] === THRESHOLD;
                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setZoomed(q.id)}
                          aria-label={`Zoom into the ${q.label.toLowerCase()} quadrant`}
                          className="absolute cursor-zoom-in bg-transparent transition-colors duration-150 hover:bg-[var(--color-gray-200)] focus-visible:bg-[var(--color-gray-200)] focus-visible:outline-none"
                          style={{
                            left: `${left ? 0 : toLeft(THRESHOLD)}%`,
                            width: `${left ? toLeft(THRESHOLD) : 100 - toLeft(THRESHOLD)}%`,
                            top: `${top ? 0 : toTop(THRESHOLD)}%`,
                            height: `${top ? toTop(THRESHOLD) : 100 - toTop(THRESHOLD)}%`,
                          }}
                        />
                      );
                    })}

                  {/* dashed grid */}
                  <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                    {GRID_STEPS.map((step) => (
                      <div key={`v-${step}`}>
                        <div
                          className="absolute w-px"
                          style={{
                            left: `${step}%`,
                            top: -GRID_OVERHANG,
                            bottom: -GRID_OVERHANG,
                            backgroundImage: gridDash('to bottom'),
                          }}
                        />
                        <div
                          className="absolute h-px"
                          style={{
                            top: `${step}%`,
                            left: -GRID_OVERHANG,
                            right: -GRID_OVERHANG,
                            backgroundImage: gridDash('to right'),
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* threshold lines */}
                  {!zoomed && (
                    <>
                      <div
                        className="absolute inset-y-0 w-px bg-[var(--color-purple-800)]"
                        style={{ left: `${toLeft(THRESHOLD)}%` }}
                      />
                      <div
                        className="absolute inset-x-0 h-px bg-[var(--color-purple-800)]"
                        style={{ top: `${toTop(THRESHOLD)}%` }}
                      />
                      <span
                        className="absolute -top-4 -translate-x-1/2 text-[11px]"
                        style={{ left: `${toLeft(THRESHOLD)}%` }}
                      >
                        Threshold
                      </span>
                      <span
                        className="absolute -left-1 -translate-x-full -translate-y-1/2 text-[11px] text-[var(--color-gray-600)]"
                        style={{ top: `${toTop(THRESHOLD)}%` }}
                      >
                        {THRESHOLD}
                      </span>
                    </>
                  )}

                  {/* quadrant labels */}
                  {quadrants.map((q) => {
                    if (zoomed && zoomed !== q.id) return null;
                    const left = q.id === 'engaged-skepticism' || q.id === 'disconnected';
                    const top = q.id === 'engaged-skepticism' || q.id === 'peak-performance';
                    return (
                      <span
                        key={q.id}
                        className={`pointer-events-none absolute z-10 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                          left ? 'left-0' : 'right-0'
                        } ${top ? 'top-0' : 'bottom-0'}`}
                        style={{ background: CHIP_BG, color: TEAL_TEXT }}
                      >
                        {q.label}
                      </span>
                    );
                  })}

                  {/* data points */}
                  {points.map((p) => (
                    <Dot
                      key={p.id}
                      point={p}
                      left={toLeft(p.x)}
                      top={toTop(p.y)}
                      visible={inDomain(p)}
                      move={move}
                      fade={fade}
                      onSelect={() => !zoomed && setZoomed(quadrantOf(p))}
                      onHover={(active) => setHoveredId(active ? p.id : null)}
                    />
                  ))}

                  {hovered && (
                    <div
                      className="pointer-events-none absolute z-30 -translate-x-1/2 whitespace-nowrap rounded bg-[var(--color-purple-800)] px-2 py-1 text-[11px] text-[var(--color-white)]"
                      style={{
                        left: `${Math.min(88, Math.max(12, toLeft(hovered.x)))}%`,
                        top: `calc(${toTop(hovered.y)}% - ${DOT_SIZE + 22}px)`,
                      }}
                    >
                      {hovered.name}
                    </div>
                  )}
                </div>

                {/* x ticks */}
                <div className="relative mt-1 h-4 text-[11px] text-[var(--color-gray-600)]">
                  <span className="absolute left-0">{domain.x[0]}</span>
                  {!zoomed && (
                    <span className="absolute -translate-x-1/2" style={{ left: `${toLeft(THRESHOLD)}%` }}>
                      {THRESHOLD}
                    </span>
                  )}
                  <span className="absolute right-0">{domain.x[1]}</span>
                </div>
                <p className="mt-1 text-center text-[11px] text-[var(--color-gray-600)]">Performance Confidence</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 pl-6">
            <div
              className={
                legendExpanded
                  ? 'grid gap-x-5 gap-y-2'
                  : 'flex flex-nowrap items-center gap-x-5 overflow-hidden'
              }
              style={legendExpanded ? { gridTemplateColumns: `repeat(${LEGEND_COLUMNS}, minmax(0, 1fr))` } : undefined}
            >
              {legendShown.map((p) => (
                <span
                  key={p.id}
                  className={`inline-flex items-center gap-2 text-[12px] leading-tight ${
                    legendExpanded ? 'min-w-0' : 'shrink-0 whitespace-nowrap'
                  }`}
                >
                  <span className="inline-block h-3 w-3 shrink-0 rounded-full" style={{ background: p.color }} />
                  <span className={legendExpanded ? 'min-w-0' : ''}>{p.name}</span>
                </span>
              ))}
            </div>
            {legendPoints.length > LEGEND_LIMIT && (
              <div className="mt-2 -ml-2">
                <Button
                  variant="tertiary"
                  size="small"
                  icon={<Icon name={legendExpanded ? 'expand_less' : 'expand_more'} isPresentational />}
                  iconPosition="end"
                  onPress={() => setLegendExpanded((v) => !v)}
                >
                  {legendExpanded ? 'Hide demographic values' : 'View all demographic values'}
                </Button>
              </div>
            )}
          </div>

          {/* Privacy notice */}
          {privacyOn && hiddenCount > 0 && (
            <div className="mt-4 flex items-start gap-2 border-t border-[var(--color-gray-300)] pt-3">
              <Icon name="warning" isFilled isPresentational className="!text-[18px] text-[var(--color-yellow-600)]" />
              <div>
                <p className="text-[12px] font-semibold">Confidentiality protection</p>
                <p className="text-[12px] leading-[1.5]">
                  Some of your selected demographic values are hidden to protect small groups from being identified.
                  Select demographic values with at least <strong>{MIN_RESPONSES}</strong> responses for results to be
                  shown.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>

    {/* Coach side panel, opened from the banner */}
    <AnimatePresence initial={false}>
      {coachOpen && (
        <motion.aside
          key="coach"
          aria-label="Coach"
          className="shrink-0 overflow-hidden border-l border-[var(--color-gray-300)]"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 256, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 30 }}
        >
          <CoachPanel quadrantId={quadrantId} onClose={() => setCoachOpen(false)} />
        </motion.aside>
      )}
    </AnimatePresence>
    </div>
  );
}
