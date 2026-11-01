'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, type Transition } from 'framer-motion';
import { Button, Heading, Icon, Menu, MenuItem, MenuPopover, MenuTrigger } from '@kaizen/components';
import { useKaizenPortal } from '@/lib/useKaizenPortal';
import { useReducedMotion } from '@/lib/useReducedMotion';
import CoachPanel, { type CoachAutoEvent } from './CoachPanel';
import ScoreDetailPanel, { type DetailView } from './ScoreDetailPanel';
import '@/styles/kaizen.css';
import '../heatmap-comparisons/heatmap.css';
import './pcq.css';
import {
  MIN_RESPONSES,
  THRESHOLD,
  coachWalkthroughAnswer,
  coachWalkthroughQuestion,
  comparisonPoint,
  overallByQuadrant,
  overallScores,
  presets,
  demographics,
  groupsByDemographic,
  type DemographicId,
  quadrantById,
  quadrants,
  stressGroups,
  type DemographicGroup,
  type PresetId,
  type QuadrantId,
} from './content';

// Colours taken from the product recording; Kaizen has no teal token.
const TEAL_BG = '#E8F6F5';
const TEAL_BORDER = '#2A9D96';
const TEAL_TEXT = '#0E5753';
const CHIP_BG = '#DDF2F4';

// Two rows of legend items by default; expanding shows every item in the same columns.
const LEGEND_COLUMNS = 4;
const LEGEND_LIMIT = LEGEND_COLUMNS * 2;
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
  selected: boolean;
  hovered: boolean;
  move: Transition;
  fade: Transition;
  onSelect: () => void;
  onHover: (active: boolean) => void;
}

// A data point. When zooming, points that leave the chart fade out where they were, and points
// that enter fade in where they land, so nothing ever travels in from (or out to) the outside.
const COACH_WIDTH = 300;
const DETAIL_WIDTH = 360;
// How far the side panel overlaps the chart card.
const PANEL_OVERLAP = 24;

interface CursorState {
  x: number;
  y: number;
  visible: boolean;
  pressed: boolean;
  /** Jump to x, y instead of gliding there. */
  snap?: boolean;
}

// A pointer that plays the walkthrough's scripted clicks.
function ScriptedCursor({ cursor, reducedMotion }: { cursor: CursorState; reducedMotion: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-50"
      initial={false}
      animate={{ x: cursor.x, y: cursor.y, opacity: cursor.visible ? 1 : 0, scale: cursor.pressed ? 0.88 : 1 }}
      transition={{
        x: reducedMotion || cursor.snap ? { duration: 0 } : { duration: 0.9, ease: [0.45, 0, 0.25, 1] },
        y: reducedMotion || cursor.snap ? { duration: 0 } : { duration: 0.9, ease: [0.45, 0, 0.25, 1] },
        opacity: { duration: 0.25 },
        scale: { duration: 0.12 },
      }}
    >
      <svg width="22" height="26" viewBox="0 0 22 26" fill="none" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.35))' }}>
        <path d="M3 2L3 20L8 15.5L11.5 23L14.5 21.7L11.2 14.4L17.5 14.2L3 2Z" fill="black" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

function Dot({ point, left, top, visible, selected, hovered, move, fade, onSelect, onHover }: DotProps) {
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
      // A soft halo in a light tint of the dot's own colour on hover or focus, kept while it is selected.
      className={`absolute rounded-full transition-shadow duration-150 hover:shadow-[0_0_0_7px_var(--dot-halo)] focus-visible:shadow-[0_0_0_7px_var(--dot-halo)] focus-visible:outline-none ${
        selected || hovered ? 'shadow-[0_0_0_7px_var(--dot-halo)]' : ''
      }`}
      style={{
        '--dot-halo': `color-mix(in srgb, ${point.color} 22%, transparent)`,
        width: DOT_SIZE,
        height: DOT_SIZE,
        marginLeft: -DOT_SIZE / 2,
        marginTop: -DOT_SIZE / 2,
        background: point.color,
        zIndex: point.kind === 'group' ? 2 : 3,
        pointerEvents: shown ? 'auto' : 'none',
      } as React.CSSProperties}
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

// Animates its own height as its content changes size, so layout shifts below it ease in.
function AnimatedHeight({ children, reducedMotion }: { children: React.ReactNode; reducedMotion: boolean }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>('auto');

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setHeight(el.getBoundingClientRect().height));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ height }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ overflow: 'hidden' }}
    >
      <div ref={innerRef}>{children}</div>
    </motion.div>
  );
}

const comparisonPointName = 'PCD Survey (H1 2026)';

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

// Case-study walkthrough steps: 1 chart only, 2 + overall and comparison, 3 + demographics,
// 4 + the score detail panel, 5 + Coach.
export type PcqStage = 1 | 2 | 3 | 4 | 5;

interface PcqPanelProps {
  className?: string;
  /** Reveals the panel in steps for the case study. Leave out to show everything, as on the home page. */
  stage?: PcqStage;
  /** A static showcase for the home page: typical demographic data, without the state explorer or demographic button. */
  showcase?: boolean;
  /** Coach and the score detail open in a column beside the chart, inside one bordered card, instead of floating over it. */
  sideBySide?: boolean;
}

export default function PcqPanel({ className = '', stage, showcase = false, sideBySide = false }: PcqPanelProps) {
  const reducedMotion = useReducedMotion();
  const staged = stage !== undefined;
  const [demographicId, setDemographicId] = useState<DemographicId>('department');
  const menuContainer = useKaizenPortal();
  const [preset, setPreset] = useState<PresetId>(showcase || (staged && stage >= 3) ? 'typical' : 'real');
  const [quadrantId, setQuadrantId] = useState<QuadrantId>('peak-performance');
  const [zoomed, setZoomed] = useState<QuadrantId | null>(null);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [coachOpen, setCoachOpen] = useState(staged && stage >= 5 && reducedMotion);
  // The data point whose detail panel is open (Product, in the walkthrough).
  const [detailId, setDetailId] = useState<string | null>(staged && stage === 4 && reducedMotion ? 'product' : null);
  const [detailView, setDetailView] = useState<DetailView>('detail');
  const [detailHoverRow, setDetailHoverRow] = useState<string | null>(null);
  const [legendExpanded, setLegendExpanded] = useState(false);
  const [syncedStage, setSyncedStage] = useState(stage);
  // Scripted walkthrough: a pointer that selects a data point, then opens Coach and types a question.
  const rootRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState<CursorState>({ x: 0, y: 0, visible: false, pressed: false, snap: true });
  const [coachAuto, setCoachAuto] = useState(false);
  const autoTimers = useRef<number[]>([]);

  // Moving between steps resets the panel to what that step shows (adjusting state while rendering).
  if (stage !== syncedStage) {
    setSyncedStage(stage);
    if (stage !== undefined) {
      setPreset(stage >= 3 ? 'typical' : 'real');
      // Steps 4 and 5 play a script; with reduced motion they start from the finished state.
      setCoachOpen(stage >= 5 && reducedMotion);
      setDetailId(stage === 4 && reducedMotion ? 'product' : null);
      setDetailView(stage === 4 && reducedMotion ? 'comments' : 'detail');
      setDetailHoverRow(null);
      setCoachAuto(false);
      setCursor((c) => ({ ...c, visible: false, pressed: false }));
      setLegendExpanded(false);
      setZoomed(null);
      setExplorerOpen(false);
    }
  }
  const showPoints = !staged || stage >= 2;
  // The case study shows the demographic groups on the chart without the filter button.
  const showDemographicFilter = !staged && !showcase;
  // In the case study the banner only appears with Coach, and the state explorer never does.
  const showBanner = !staged || stage >= 5;
  const showExplorer = !staged && !showcase;
  // The case study and the home page preview use the slim banner, without its description or the title row.
  const slimBanner = staged || showcase;
  // The case study and the home page preview use the slim banner, without its description.
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const titleRowRef = useRef<HTMLDivElement>(null);

  const at = (ms: number, fn: () => void) => {
    autoTimers.current.push(window.setTimeout(fn, ms));
  };
  const clearAuto = () => {
    autoTimers.current.forEach(clearTimeout);
    autoTimers.current = [];
  };
  const cancelAuto = () => {
    if (!autoTimers.current.length && !coachAuto && !cursor.visible) return;
    clearAuto();
    setCoachAuto(false);
    setHoveredId(null);
    setDetailHoverRow(null);
    setCursor((c) => ({ ...c, visible: false, pressed: false }));
  };
  // Glide the pointer to the middle of an element (its tip lands on the point).
  const moveTo = (el: Element | null | undefined) => {
    const root = rootRef.current;
    if (!el || !root) return;
    const box = el.getBoundingClientRect();
    const base = root.getBoundingClientRect();
    setCursor((c) => ({
      ...c,
      x: box.left - base.left + box.width / 2 - 3,
      y: box.top - base.top + box.height / 2 - 2,
      visible: true,
      snap: false,
    }));
  };
  const press = () => {
    setCursor((c) => ({ ...c, pressed: true }));
    at(150, () => setCursor((c) => ({ ...c, pressed: false })));
  };
  const placeCursor = (fx: number, fy: number) => {
    const root = rootRef.current;
    if (!root) return;
    const base = root.getBoundingClientRect();
    setCursor({ x: base.width * fx, y: base.height * fy, visible: false, pressed: false, snap: true });
    at(80, () => setCursor((c) => ({ ...c, visible: true, snap: false })));
  };

  // Step 4: select a data point, then open its AI comment summaries.
  // Step 5: open Coach (the typing and sending is driven by the Coach panel's events).
  useEffect(() => {
    if (reducedMotion || (stage !== 4 && stage !== 5)) return;
    const root = rootRef.current;
    if (!root) return;
    if (stage === 4) {
      const scroller = () => root.querySelector<HTMLElement>('aside .overflow-y-auto');
      // Eased scroll driven by a timer, so it keeps moving even when the browser throttles frames.
      const scrollPanel = (top: number | 'end', animate = true) => {
        const el = scroller();
        if (!el) return;
        const from = el.scrollTop;
        const to = top === 'end' ? el.scrollHeight - el.clientHeight : top;
        if (!animate) {
          el.scrollTop = to;
          return;
        }
        const start = performance.now();
        const interval = window.setInterval(() => {
          const t = Math.min(1, (performance.now() - start) / 900);
          el.scrollTop = from + (to - from) * (t * t * (3 - 2 * t));
          if (t >= 1) clearInterval(interval);
        }, 16);
        autoTimers.current.push(interval);
      };
      placeCursor(0.6, 0.9);
      at(600, () => moveTo(root.querySelector('button[aria-label="Product"]')));
      at(1500, () => setHoveredId('product'));
      at(2000, press);
      at(2150, () => {
        setHoveredId(null);
        setDetailId('product');
        setDetailView('detail');
      });
      // Scroll the panel down to the menu items, then open AI comment summaries.
      at(3000, () => moveTo(root.querySelector('aside')));
      at(3900, () => scrollPanel('end'));
      at(5300, () => moveTo(root.querySelector('[data-row="comments"]')));
      at(6200, () => setDetailHoverRow('comments'));
      at(6700, press);
      at(6850, () => {
        setDetailHoverRow(null);
        setDetailView('comments');
      });
      at(6900, () => scrollPanel(0, false));
      // Scroll down to the negative summary, back up to the positive one, and copy it.
      at(7800, () => scrollPanel('end'));
      // Back up to the positive summary, with its copy icon (and the tooltip above it) in view.
      at(9400, () => {
        const el = scroller();
        const positive = el?.querySelector('section');
        if (!el || !positive) return;
        const top = positive.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop;
        const bottom = top + positive.getBoundingClientRect().height;
        scrollPanel(Math.max(0, bottom - el.clientHeight + 48));
      });
      at(10800, () => moveTo(root.querySelector('[aria-label="Copy summary"]')));
      at(11800, press);
      at(11850, () => root.querySelector<HTMLElement>('[aria-label="Copy summary"]')?.click());
      at(14000, () => setCursor((c) => ({ ...c, visible: false })));
    } else {
      placeCursor(0.55, 0.85);
      at(600, () => {
        const button = [...root.querySelectorAll('button')].find((b) => b.textContent?.includes('Explore with Coach'));
        moveTo(button);
      });
      at(1700, press);
      at(1850, () => {
        setDetailId(null);
        setCoachOpen(true);
        setCoachAuto(true);
      });
      at(2500, () => moveTo(root.querySelector('aside')));
    }
    return clearAuto;
    // The script restarts only when the step changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, reducedMotion]);

  const onCoachAuto = (event: CoachAutoEvent) => {
    const root = rootRef.current;
    if (!root) return;
    if (event === 'intro-done') {
      moveTo(root.querySelector('#coach-reply'));
    } else if (event === 'typed') {
      moveTo(root.querySelector('aside button[type="submit"]'));
      at(1450, press);
    } else {
      at(700, () => {
        setCursor((c) => ({ ...c, visible: false }));
        setCoachAuto(false);
      });
    }
  };

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
  const filterRowVisible = !isError && (showDemographicFilter || !!zoomed);
  const sourceGroups: DemographicGroup[] =
    preset === 'typical' || preset === 'privacy'
      ? groupsByDemographic[demographicId]
      : preset === 'stress'
        ? stressGroups
        : [];
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

  const legendPoints = showPoints ? points.filter(inDomain) : [];
  // The case study shows a single row of the legend.
  const legendLimit = staged ? LEGEND_COLUMNS : LEGEND_LIMIT;
  const legendLimited = !legendExpanded && legendPoints.length > legendLimit;
  const legendShown = legendLimited ? legendPoints.slice(0, legendLimit) : legendPoints;
  const detailPoint = points.find((p) => p.id === detailId && inDomain(p));
  // The tooltip follows the pointer, and goes once a point is selected.
  const hovered = points.find((p) => p.id === hoveredId && p.id !== detailPoint?.id && inDomain(p));
  const sideOpen = coachOpen || !!detailPoint;

  const choosePreset = (id: PresetId) => {
    setPreset(id);
    setLegendExpanded(false);
    setZoomed(null);
  };

  // Picking a demographic plots one point per value of it (each department, region and so on). The privacy
  // and stress states from the explorer keep their own data until a demographic is picked.
  const chooseDemographic = (id: DemographicId) => {
    setDemographicId(id);
    setDetailId(null);
    setDetailView('detail');
    setLegendExpanded(false);
    setZoomed(null);
    if (preset !== 'privacy') setPreset('typical');
  };

  const sideWidth = coachOpen ? COACH_WIDTH : DETAIL_WIDTH;
  // On the home page the chart makes room for the panel. In the case study the panel simply overlays it.
  const shrinks = sideOpen && !staged;
  const overlap = sideBySide ? 0 : PANEL_OVERLAP;
  const cardWidth = shrinks ? `calc(100% - ${sideWidth - overlap}px)` : '100%';
  const springTransition = reducedMotion ? { duration: 0 } : { type: 'spring' as const, stiffness: 220, damping: 30 };

  return (
    <div ref={rootRef} onPointerDownCapture={cancelAuto} className={`kaizen-scope relative w-full ${
        sideBySide ? 'overflow-hidden rounded-xl border border-[var(--color-gray-300)] bg-[var(--color-white)]' : ''
      } ${className}`}
    >
    <div
      // A CSS transition (not Framer) so the width eases as the side panel comes and goes.
      className={`relative min-w-0 rounded-[var(--border-solid-border-radius)] bg-[var(--color-white)] p-5 text-[var(--color-purple-800)] transition-[width,padding] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] motion-reduce:transition-none ${
        // Case study: the same size on every step, short enough to sit in the viewport with room above and below.
        staged ? 'flex h-[min(540px,calc(100vh-280px))] min-h-[440px] flex-col border border-[var(--color-gray-400)]' : ''
      } ${sideBySide ? '!rounded-none' : ''}`}
      style={{ width: cardWidth, paddingRight: shrinks ? 20 + overlap : 20 }}
    >
      {/* Title, with the state explorer at the right */}
      <div ref={titleRowRef} className={`relative flex items-center justify-between gap-3 ${slimBanner ? 'hidden' : ''}`}>
        <div className="flex items-center gap-3">
          <QuadrantLogo />
          <Heading tag="h3" variant="heading-5">
            Performance Culture Quadrant
          </Heading>
        </div>
        <div className={showExplorer ? '' : 'hidden'}>
          <Button
            variant="secondary"
            size="small"
            className="pcq-nowrap pcq-explore-button"
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
              className="absolute right-0 top-full z-40 mt-2 w-[320px] rounded-[7px] bg-[var(--color-white)] p-3 shadow-[var(--shadow-large-box-shadow)]"
            >
              <p className="mb-2 text-[13px] font-semibold">Data states</p>
              <div className="grid grid-cols-2 gap-1.5">
                {presets.map((item) => (
                  <Button
                    key={item.id}
                    size="small"
                    isFullWidth
                    className={`pcq-state-button ${preset === item.id ? 'pcq-state-selected' : ''}`}
                    variant="secondary"
                    aria-pressed={preset === item.id}
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
                    className={`pcq-state-button ${quadrantId === q.id ? 'pcq-state-selected' : ''}`}
                    variant="secondary"
                    aria-pressed={quadrantId === q.id}
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
      {showBanner && <div className={staged ? 'mb-6' : showcase ? 'mb-4' : 'mt-4'}>
        <AnimatePresence mode="wait" initial={false}>
          {isError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fade}
              className="rounded-[7px] border border-[var(--color-red-300)] bg-[var(--color-red-100)] px-4 py-3"
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
              className={`flex items-center justify-between gap-3 rounded-[7px] border px-4 py-3 ${slimBanner ? '' : 'flex-wrap'}`}
              style={{ background: TEAL_BG, borderColor: TEAL_BORDER }}
            >
              <div className={`min-w-0 flex-1 ${slimBanner ? '' : 'basis-[280px]'}`}>
                <p className="text-[13px] font-semibold" style={{ color: TEAL_TEXT }}>
                  {quadrant.title}
                </p>
                {!slimBanner && <p className="mt-1 text-[12px] leading-[1.5]">{summary}</p>}
              </div>
              <Button
                variant="secondary"
                size="small"
                icon={<Icon name="auto_awesome" isPresentational />}
                onPress={() => {
                  setCoachOpen(true);
                  setDetailId(null);
                }}
              >
                Explore with Coach
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>}

      {/* Filters (the state explorer lives in the title row so it stays available in the error state) */}
      <motion.div
        initial={false}
        animate={{ height: filterRowVisible ? 'auto' : 0, opacity: filterRowVisible ? 1 : 0 }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative overflow-hidden"
      >
        <div className="flex flex-wrap items-center gap-2 pb-1 pt-4">
            {!isError && showDemographicFilter && (
              <div className="inline-flex items-center gap-1">
                <MenuTrigger>
                  <Button
                    variant="tertiary"
                    size="small"
                    className="heatmap-toolbar-button"
                    icon={<Icon name="expand_more" isPresentational />}
                    iconPosition="end"
                  >
                    <span className="whitespace-nowrap">
                      <span className="font-semibold">Demographic{demographicActive ? ':' : ''}</span>
                      {demographicActive ? ` ${demographics.find((d) => d.id === demographicId)?.label}` : ''}
                    </span>
                  </Button>
                  <MenuPopover placement="bottom start" UNSTABLE_portalContainer={menuContainer}>
                    <Menu onAction={(key) => chooseDemographic(key as DemographicId)}>
                      {demographics.map((item) => (
                        <MenuItem key={item.id} id={item.id}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </MenuPopover>
                </MenuTrigger>
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
      </motion.div>

      {!isError && (
        <>
          {/* Chart */}
          <div className={`flex ${staged ? 'min-h-0 flex-1 pt-3' : 'mt-5'}`}>
            <div className="flex w-6 shrink-0 items-center justify-center">
              <span className="-rotate-90 whitespace-nowrap text-[11px] text-[var(--color-gray-600)]">
                Workplace Engagement
              </span>
            </div>
            <div className={`min-w-0 flex-1 pl-7 ${staged ? 'flex flex-col' : ''}`}>
              <div className={`relative ${staged ? 'flex min-h-0 flex-1 flex-col' : ''}`}>
                <div className={`relative w-full ${staged ? 'min-h-0 flex-1' : 'h-[300px]'}`}>
                  {/* y ticks, centred on the edges of the plot */}
                  <span className="absolute -left-1 top-0 -translate-x-full -translate-y-1/2 text-[11px] leading-none text-[var(--color-gray-600)]">
                    {domain.y[1]}
                  </span>
                  <span className="absolute -left-1 bottom-0 -translate-x-full translate-y-1/2 text-[11px] leading-none text-[var(--color-gray-600)]">
                    {domain.y[0]}
                  </span>
                  {/* quadrants: hover to highlight, select to zoom in */}
                  {!zoomed && !staged &&
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
                        className={`pointer-events-none absolute z-10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
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
                      visible={showPoints && inDomain(p)}
                      selected={detailPoint?.id === p.id}
                      hovered={hoveredId === p.id}
                      move={move}
                      fade={fade}
                      onSelect={() => {
                        setDetailId(p.id);
                        setDetailView('detail');
                        setCoachOpen(false);
                      }}
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
          {showPoints && <AnimatedHeight reducedMotion={reducedMotion}><div className="pl-6 pt-3">
            <div
              className="grid gap-x-5 gap-y-2"
              style={{ gridTemplateColumns: `repeat(${LEGEND_COLUMNS}, minmax(0, 1fr))` }}
            >
              {legendShown.map((p) => (
                <motion.span
                  key={p.id}
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.4 }}
                  className="inline-flex min-w-0 items-center gap-2 text-[12px] leading-tight"
                >
                  <span className="inline-block h-3 w-3 shrink-0 rounded-full" style={{ background: p.color }} />
                  <span className="min-w-0">{p.name}</span>
                </motion.span>
              ))}
            </div>
            {legendPoints.length > LEGEND_LIMIT && !staged && !showcase && (
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
          </div></AnimatedHeight>}

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

    {/* Side panel: Coach (opened from the banner) or the detail for a selected data point.
        It floats over the chart's right edge, and the chart card slides over to make room. */}
    <AnimatePresence initial={false}>
      {sideOpen && (
        <motion.aside
          key="side"
          aria-label={coachOpen ? 'Coach' : 'Score detail'}
          className={`absolute z-30 overflow-hidden bg-[var(--color-white)] ${
            sideBySide ? 'inset-y-0 border-l border-[var(--color-gray-300)]' : '-bottom-2 -top-2 rounded-[14px] border'
          } ${
            // Flush with the UI's right edge on narrower screens, so the page margin matches the left; from 1280px there is
            // spare room beside the UI (the description sits at the far right), so the panel moves out over it and covers less of the chart
            staged ? 'right-0 min-[1280px]:-right-[72px]' : 'right-0'
          } ${
            sideBySide
              ? ''
              : staged
                ? 'border-[var(--color-gray-400)]'
                : 'border-[var(--color-gray-300)] shadow-[0_18px_44px_-14px_rgba(0,0,0,0.3)]'
          }`}
          initial={{ opacity: 0, x: 48, width: sideWidth }}
          animate={{ opacity: 1, x: 0, width: sideWidth }}
          exit={{ opacity: 0, x: 48 }}
          transition={springTransition}
        >
          {coachOpen ? (
            <CoachPanel
              quadrantId={quadrantId}
              onClose={() => setCoachOpen(false)}
              autoPlay={coachAuto}
              autoQuestion={staged ? coachWalkthroughQuestion : undefined}
              autoReply={coachWalkthroughAnswer}
              onAutoEvent={onCoachAuto}
            />
          ) : (
            detailPoint && (
              <div className="absolute inset-0 overflow-y-auto">
                <ScoreDetailPanel
                  key={detailPoint.id}
                  view={detailView}
                  onViewChange={setDetailView}
                  hoverRow={detailHoverRow}
                  point={detailPoint}
                  comparisonName={comparisonPointName}
                  comparison={comparisonPoint}
                  onClose={() => {
                    setDetailId(null);
                    setDetailView('detail');
                  }}
                />
              </div>
            )
          )}
        </motion.aside>
      )}
    </AnimatePresence>

    <ScriptedCursor cursor={cursor} reducedMotion={reducedMotion} />
    </div>
  );
}
