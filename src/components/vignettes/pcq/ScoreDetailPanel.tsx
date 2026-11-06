'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { Icon, LoadingParagraph } from '@kaizen/components';
import { useReducedMotion } from '@/lib/useReducedMotion';
import '@/styles/kaizen.css';
import { clamp, seededRandom } from './random';
import PcqTrend from './PcqTrend';

export interface ScoreDetailPoint {
  id: string;
  name: string;
  /** Performance Confidence score, 0-100. */
  x: number;
  /** Workplace Engagement score, 0-100. */
  y: number;
  /** The point's colour and shape on the chart, reused for its trend. */
  color?: string;
  shape?: 'circle' | 'triangle' | 'square';
}

type Metric = 'engagement' | 'confidence';

const METRICS: { id: Metric; label: string }[] = [
  { id: 'engagement', label: 'Workplace Engagement' },
  { id: 'confidence', label: 'Performance Confidence' },
];

const TREND_POINTS = 12;
const TREND_LABELS: { index: number; label: string }[] = [
  { index: 0, label: 'May 2024' },
  { index: 5, label: 'Aug 2025' },
  { index: 11, label: 'Oct 2026' },
];

// Favourable, neutral and unfavourable shares; what is not favourable splits roughly 60/40 into unfavourable and neutral.
function split(favourable: number) {
  const rest = 100 - favourable;
  const unfavourable = Math.round(rest * 0.6);
  return { favourable, neutral: rest - unfavourable, unfavourable };
}

function detailsFor(point: ScoreDetailPoint, metric: Metric, comparison: number) {
  const random = seededRandom(`${point.id}-${metric}`);
  const favourable = Math.round(clamp(metric === 'engagement' ? point.y : point.x, 4, 98));
  const total = 8 + Math.floor(random() * 40);
  const responded = Math.max(1, total - Math.floor(random() * 4));

  // Trend: drifts from an earlier score to today's, with a little noise.
  const start = clamp(favourable + (random() - 0.5) * 36, 4, 96);
  const series = Array.from({ length: TREND_POINTS }, (_, i) => {
    if (i === TREND_POINTS - 1) return split(favourable);
    const progress = i / (TREND_POINTS - 1);
    const value = clamp(Math.round(start + (favourable - start) * progress + (random() - 0.5) * 8), 2, 98);
    return split(value);
  });

  return {
    scores: split(favourable),
    delta: Math.round(favourable - comparison),
    participation: `${Math.round((responded / total) * 100)}% (${responded} of ${total})`,
    series,
  };
}

const SERIES = [
  { key: 'favourable', label: 'Favorable', color: 'var(--color-green-400)' },
  { key: 'neutral', label: 'Neutral', color: 'var(--color-gray-500)' },
  { key: 'unfavourable', label: 'Unfavorable', color: 'var(--color-red-400)' },
] as const;

const CHART = { width: 420, height: 250, left: 46, right: 410, top: 16, bottom: 208 };
const chartX = (i: number) => CHART.left + (i / (TREND_POINTS - 1)) * (CHART.right - CHART.left) - (i === TREND_POINTS - 1 ? 6 : 0) + (i === 0 ? 6 : 0);
const chartY = (value: number) => CHART.bottom - (value / 100) * (CHART.bottom - CHART.top);

function TrendChart({ series }: { series: ReturnType<typeof detailsFor>['series'] }) {
  return (
    <>
      <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} className="mt-3 w-full" role="img" aria-label="Trend in favorable, neutral and unfavorable scores">
        {[0, 25, 50, 75, 100].map((tick) => (
          <g key={tick}>
            <line x1={CHART.left} x2={CHART.right} y1={chartY(tick)} y2={chartY(tick)} stroke="var(--color-gray-300)" strokeWidth="1" />
            <text x={CHART.left - 8} y={chartY(tick) + 4} textAnchor="end" fontSize="11" fill="var(--color-gray-600)">
              {tick}%
            </text>
          </g>
        ))}
        {TREND_LABELS.map(({ index, label }) => (
          <text
            key={label}
            x={chartX(index)}
            y={CHART.bottom + 24}
            textAnchor={index === 0 ? 'start' : index === TREND_POINTS - 1 ? 'end' : 'middle'}
            fontSize="11"
            fill="var(--color-gray-600)"
          >
            {label}
          </text>
        ))}
        {SERIES.map((s) => (
          <g key={s.key}>
            <polyline
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              points={series.map((entry, i) => `${chartX(i)},${chartY(entry[s.key])}`).join(' ')}
            />
            {series.map((entry, i) => (
              <circle key={i} cx={chartX(i)} cy={chartY(entry[s.key])} r="4" fill="white" stroke={s.color} strokeWidth="2" />
            ))}
          </g>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[12px]">
        {SERIES.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full border-2 bg-white" style={{ borderColor: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </>
  );
}

// Placeholder line widths (percent) for the descriptions that are still loading.
const links: { id: string; title: string; lines?: number[]; description?: string }[] = [
  { id: 'comments', title: 'AI comment summaries', description: 'Summarise employee feedback across survey comments uncover insights and areas of focus' },
  { id: 'questions', title: 'Questions', lines: [100, 65] },
  { id: 'focus-areas', title: 'Recommended focus areas', lines: [100, 100, 70] },
  { id: 'spread', title: 'Spread of scores by demographic', lines: [100, 55] },
];

// Gradient border used for AI generated content, as in Coach.
const AI_BORDER = 'linear-gradient(var(--color-white), var(--color-white)) padding-box, linear-gradient(135deg, #D3BDF0 0%, #9BF3E0 100%) border-box';

const sentiment = [
  { id: 'positive', label: 'Positive', percent: 32, count: 6, color: 'var(--color-green-600)' },
  { id: 'neutral', label: 'Neutral', percent: 32, count: 6, color: 'var(--color-gray-600)' },
  { id: 'negative', label: 'Negative', percent: 37, count: 7, color: 'var(--color-red-600)' },
] as const;

const summaries = [
  {
    id: 'positive',
    label: 'Positive',
    color: 'var(--color-green-600)',
    text: "Employees highly value the organisational culture, which emphasizes a healthy work-life balance and the presence of supportive, collaborative colleagues. Staff members also express appreciation for the company's commitment to employee well-being, the provision of attractive perks, and recent improvements in management practices.",
  },
  {
    id: 'neutral',
    label: 'Neutral',
    color: 'var(--color-gray-600)',
    text: 'Employees suggest incorporating cultural considerations during the onboarding process and increasing the internal utilization of digital media products. Additionally, there is a recommendation to implement structured individual development plans to ensure ongoing professional growth and engagement.',
  },
  {
    id: 'negative',
    label: 'Negative',
    color: 'var(--color-red-600)',
    text: 'Employees raise concerns about workload and the pace of change, and say decisions are not always communicated early enough. Some feel that feedback is collected but not consistently acted on, and that career progression is unclear.',
  },
];

function SummaryActions() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    // Only the confirmation is shown; nothing is written to the clipboard.
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const actions = [
    { icon: 'thumb_up', label: 'Helpful' },
    { icon: 'thumb_down', label: 'Not helpful' },
    { icon: 'content_copy', label: 'Copy summary', onClick: copy },
  ];

  return (
    <div className="mt-4 flex items-center gap-5">
      {actions.map((action) => (
        <span key={action.icon} className="relative flex">
          <button
            type="button"
            aria-label={action.label}
            onClick={action.onClick}
            className="flex cursor-pointer rounded-[4px] p-0.5 hover:bg-[var(--color-gray-200)]"
          >
            <Icon name={action.icon} isPresentational />
          </button>
          {action.onClick && copied && (
            <span
              role="status"
              className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-[var(--color-purple-800)] px-2 py-1 text-[11px] text-[var(--color-white)]"
            >
              Copied
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

function CommentSummaries({ onBack, onClose, pointName, metricLabel }: { onBack: () => void; onClose: () => void; pointName: string; metricLabel: string }) {
  return (
    <div className="text-[var(--color-purple-800)]">
      <div className="border-b border-[var(--color-gray-300)] px-5 pb-4 pt-4">
        <div className="flex items-center justify-between">
          <button type="button" onClick={onBack} className="flex cursor-pointer items-center gap-1.5 text-[14px]">
            <Icon name="arrow_back" isPresentational />
            Back
          </button>
          <button type="button" aria-label="Close" onClick={onClose} className="-m-1 flex cursor-pointer p-1">
            <Icon name="close" isPresentational />
          </button>
        </div>
        <h3 className="mt-4 flex items-center gap-2 text-[19px] font-semibold leading-tight">
          <Icon name="auto_awesome" isPresentational className="shrink-0 !text-[20px] text-[var(--color-purple-800)]" />
          AI comment summaries
        </h3>
        <p className="mt-1 text-[13px] text-[var(--color-gray-600)]">
          {pointName} / {metricLabel}
        </p>
      </div>

      <div className="px-5 py-5">
        <h4 className="text-[15px] font-semibold">Sentiment analysis</h4>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1">
          {sentiment.map((item) => (
            <span key={item.id} className="text-[14px] font-semibold" style={{ color: item.color }}>
              {item.label} {item.percent}% ({item.count})
            </span>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-[var(--color-gray-600)]">19 of 19 comments have sentiment tags</p>

        <div className="mt-6 rounded-[10px] border-2 border-transparent" style={{ background: AI_BORDER }}>
          {summaries.map((summary, index) => (
            <section key={summary.id} className={`px-4 py-4 ${index > 0 ? 'border-t border-[var(--color-gray-300)]' : ''}`}>
              <h5 className="text-[14px] font-semibold" style={{ color: summary.color }}>
                {summary.label}
              </h5>
              <p className="mt-2 text-[13px] leading-[1.6]">{summary.text}</p>
              <SummaryActions />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

// The first screen for a selected point: where it has sat across surveys, then its two factors to open.
function Overview({
  point,
  comparisonName,
  comparison,
  onOpen,
  onClose,
}: {
  point: ScoreDetailPoint;
  comparisonName: string;
  comparison: { x: number; y: number };
  onOpen: (metric: Metric) => void;
  onClose: () => void;
}) {
  const factors = [
    { id: 'confidence' as const, label: 'Performance Confidence', tag: 'Index factor' },
    { id: 'engagement' as const, label: 'Workplace Engagement', tag: undefined },
  ].map((factor) => ({
    ...factor,
    ...detailsFor(point, factor.id, factor.id === 'engagement' ? comparison.y : comparison.x),
  }));

  return (
    <div className="text-[var(--color-purple-800)]">
      <div className="flex items-start justify-between gap-3 border-b border-[var(--color-gray-300)] px-5 py-4">
        <h3 className="min-w-0 text-[19px] font-semibold leading-tight">{point.name}</h3>
        <div className="flex shrink-0 items-center gap-4">
          <Icon name="cloud_download" isPresentational />
          <button type="button" aria-label="Close" onClick={onClose} className="-m-1 flex cursor-pointer p-1">
            <Icon name="close" isPresentational />
          </button>
        </div>
      </div>

      <div className="border-b border-[var(--color-gray-300)] px-5 py-5">
        <h4 className="text-[15px] font-semibold">Trend</h4>
        <PcqTrend point={point} latestName={comparisonName} />
      </div>

      <div className="px-5 py-5">
        <h4 className="text-[15px] font-semibold">Key factors</h4>
        <p className="mt-2 text-[13px] leading-snug">
          Track Performance Confidence and Workplace Engagement over time, compare across demographics, and identify where to focus
        </p>
        <div className="-mx-3 mt-4 flex flex-col gap-1">
          {factors.map((factor) => {
            const up = factor.delta >= 0;
            return (
              <button
                key={factor.id}
                type="button"
                data-row={factor.id}
                onClick={() => onOpen(factor.id)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors duration-200 hover:bg-[var(--color-gray-200)]"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-semibold">{factor.label}</span>
                    {factor.tag && (
                      <span className="shrink-0 rounded-full bg-[var(--color-blue-100)] px-2.5 py-0.5 text-[11px] text-[var(--color-blue-600)]">
                        {factor.tag}
                      </span>
                    )}
                  </span>
                  <span className="mt-2.5 flex h-6 w-full overflow-hidden rounded-[4px] text-[12px] font-semibold">
                    <span className="flex items-center justify-end bg-[var(--data-viz-favorable)] pr-1.5" style={{ width: `${factor.scores.favourable}%` }}>
                      {factor.scores.favourable}
                    </span>
                    <span className="bg-[var(--color-gray-300)]" style={{ width: `${factor.scores.neutral}%` }} />
                    <span className="bg-[var(--data-viz-unfavorable)]" style={{ width: `${factor.scores.unfavourable}%` }} />
                  </span>
                  <span className="mt-1.5 block text-[12px]">
                    <span className={`font-semibold ${up ? 'text-[var(--color-green-600)]' : 'text-[var(--color-red-600)]'}`}>
                      {up ? '↑' : '↓'} {Math.abs(factor.delta)}%
                    </span>{' '}
                    {comparisonName}
                  </span>
                </span>
                <span className="flex shrink-0">
                  <Icon name="arrow_forward" isPresentational />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export type DetailView = 'detail' | 'comments';

interface ScoreDetailPanelProps {
  view: DetailView;
  onViewChange: (view: DetailView) => void;
  /** Shows a row's hover state, for the scripted walkthrough. */
  hoverRow?: string | null;
  point: ScoreDetailPoint;
  comparisonName: string;
  comparison: { x: number; y: number };
  onClose: () => void;
}

// Side panel for a selected data point: an overview of its trend and factors, then each factor's detail.
export default function ScoreDetailPanel(props: ScoreDetailPanelProps) {
  // null is the overview; choosing a factor opens its detail.
  const [metric, setMetric] = useState<Metric | null>(null);
  const anchor = useRef<HTMLDivElement>(null);

  // Each screen starts at its top, whatever the one before it was scrolled to.
  useLayoutEffect(() => {
    anchor.current?.parentElement?.scrollTo({ top: 0 });
  }, [metric, props.view]);

  return (
    <div ref={anchor}>
      <ScoreDetailBody {...props} metric={metric} setMetric={setMetric} />
    </div>
  );
}

function ScoreDetailBody({
  view,
  onViewChange,
  hoverRow,
  point,
  comparisonName,
  comparison,
  onClose,
  metric,
  setMetric,
}: ScoreDetailPanelProps & { metric: Metric | null; setMetric: (metric: Metric | null) => void }) {
  const reducedMotion = useReducedMotion();
  const activeMetric = metric ?? 'engagement';
  const metricLabel = METRICS.find((m) => m.id === activeMetric)!.label;
  const { scores, delta, participation, series } = detailsFor(point, activeMetric, activeMetric === 'engagement' ? comparison.y : comparison.x);
  const up = delta >= 0;

  if (view === 'comments') {
    return <CommentSummaries onBack={() => onViewChange('detail')} onClose={onClose} pointName={point.name} metricLabel={metricLabel} />;
  }

  if (metric === null) {
    return <Overview point={point} comparisonName={comparisonName} comparison={comparison} onOpen={setMetric} onClose={onClose} />;
  }

  return (
    <div className="text-[var(--color-purple-800)]">
      <div className="border-b border-[var(--color-gray-300)] px-5 pb-4 pt-4">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => setMetric(null)} className="flex cursor-pointer items-center gap-1.5 text-[14px]">
            <Icon name="arrow_back" isPresentational />
            Back
          </button>
          <button type="button" aria-label="Close" onClick={onClose} className="-m-1 flex cursor-pointer p-1">
            <Icon name="close" isPresentational />
          </button>
        </div>
        <h3 className="mt-4 text-[19px] font-semibold leading-tight">{metricLabel}</h3>
        <p className="mt-1 text-[13px] text-[var(--color-gray-600)]">{point.name}</p>
      </div>

      <div className="border-b border-[var(--color-gray-300)] px-5 py-5">
        <h4 className="text-[15px] font-semibold">Participation rate and favorable score</h4>
        <p className="mt-2 text-[13px]">Participation rate: {participation}</p>
        <div className="mt-3 flex h-6 w-full overflow-hidden rounded-[4px] text-[12px] font-semibold">
          <div className="flex items-center justify-end bg-[var(--data-viz-favorable)] pr-1.5" style={{ width: `${scores.favourable}%` }}>
            {scores.favourable}
          </div>
          <div className="bg-[var(--color-gray-300)]" style={{ width: `${scores.neutral}%` }} />
          <div className="flex items-center justify-center bg-[var(--data-viz-unfavorable)]" style={{ width: `${scores.unfavourable}%` }}>
            {scores.unfavourable}
          </div>
        </div>
        <p className="mt-2 text-[12px]">
          <span className={`font-semibold ${up ? 'text-[var(--color-green-600)]' : 'text-[var(--color-red-600)]'}`}>
            {up ? '↑' : '↓'} {Math.abs(delta)}%
          </span>{' '}
          {comparisonName}
        </p>
      </div>

      <div className="px-5 py-5">
        <h4 className="text-[15px] font-semibold">Trend</h4>
        <TrendChart series={series} />

        <div className="-mx-3 mt-4 flex flex-col gap-1">
          {links.map((link) => {
            const selectable = link.id === 'comments';
            const Row = selectable ? 'button' : 'div';
            return (
              <Row
                key={link.id}
                data-row={link.id}
                {...(selectable ? { type: 'button' as const, onClick: () => onViewChange('comments') } : {})}
                className={`flex w-full rounded-lg px-3 py-2.5 text-left ${
                  selectable
                    ? `cursor-pointer transition-colors duration-200 hover:bg-[var(--color-gray-200)] ${
                        hoverRow === link.id ? 'bg-[var(--color-gray-200)]' : ''
                      }`
                    : 'cursor-default'
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-[15px] font-semibold">
                    {link.id === 'comments' && (
                      <Icon name="auto_awesome" isPresentational className="shrink-0 !text-[16px] text-[var(--color-purple-800)]" />
                    )}
                    {link.title}
                  </span>
                  <span className="mt-1.5 flex items-center gap-3">
                    {link.lines ? (
                      <span className="flex min-w-0 flex-1 flex-col gap-1.5" aria-hidden="true">
                        {link.lines.map((width, index) => (
                          <LoadingParagraph key={index} isAnimated={!reducedMotion} noBottomMargin width={width} />
                        ))}
                      </span>
                    ) : (
                      <span className="min-w-0 flex-1 text-[13px] leading-snug">{link.description}</span>
                    )}
                    <span className="flex shrink-0">
                      <Icon name="arrow_forward" isPresentational />
                    </span>
                  </span>
                </span>
              </Row>
            );
          })}
        </div>
      </div>
    </div>
  );
}
