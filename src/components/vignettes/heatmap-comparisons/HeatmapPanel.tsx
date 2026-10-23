'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { Button, FilterButton, Icon } from '@kaizen/components';
import '@/styles/kaizen.css';
import { heatmapContent, formatDelta, deltaColor } from './content';

const LABEL_WIDTH = 160;
const COMPACT_WIDTH = 112;
const SUB_WIDTH = 72;
const ROW_HEIGHT_COMPACT = 44;
const ROW_HEIGHT_EXPANDED = 34;
const SUBHEADER_HEIGHT = 34;
const GROUP_HEADER_HEIGHT = 40;
const GROUP_HEADER_HEIGHT_COMPACT = 52;

const GROUP_BORDER = 'border-l-2 border-[var(--color-gray-500)]';

function Chevron() {
  return <Icon name="expand_more" isPresentational className="shrink-0 !text-[16px] text-[var(--color-purple-800)]" />;
}

interface HeatmapPanelProps {
  className?: string;
}

export default function HeatmapPanel({ className = '' }: HeatmapPanelProps) {
  const reducedMotion = useReducedMotion();
  const [columnsExpanded, setColumnsExpanded] = useState(false);

  const transition = reducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 240, damping: 30, mass: 0.9 };
  const fade = reducedMotion ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' as const };

  const groupWidth = columnsExpanded ? SUB_WIDTH * 3 : COMPACT_WIDTH;
  const subWidth = columnsExpanded ? SUB_WIDTH : 0;
  const rowHeight = columnsExpanded ? ROW_HEIGHT_EXPANDED : ROW_HEIGHT_COMPACT;
  const groupHeaderHeight = columnsExpanded ? GROUP_HEADER_HEIGHT : GROUP_HEADER_HEIGHT_COMPACT;

  // A single cell in the grid. Extra survey columns collapse to zero width.
  const renderGroupCells = (
    cell: { comparisonSurvey: number; thisSurvey: number; delta: number },
    key: string,
    height: number,
    bold = false
  ) => (
    <motion.div key={key} className={`flex w-full`} initial={false} animate={{ height }} transition={transition}>
      <motion.div
        className="overflow-hidden shrink-0"
        initial={false}
        animate={{ width: subWidth, opacity: columnsExpanded ? 1 : 0 }}
        transition={{ width: transition, opacity: fade }}
      >
        <div className="flex h-full items-center justify-center text-[13px] text-[var(--color-purple-800)]" style={{ width: SUB_WIDTH }}>
          {cell.comparisonSurvey}
        </div>
      </motion.div>
      <motion.div
        className="overflow-hidden shrink-0"
        initial={false}
        animate={{ width: subWidth, opacity: columnsExpanded ? 1 : 0 }}
        transition={{ width: transition, opacity: fade }}
      >
        <div className="flex h-full items-center justify-center text-[13px] text-[var(--color-purple-800)]" style={{ width: SUB_WIDTH }}>
          {cell.thisSurvey}
        </div>
      </motion.div>
      <motion.div
        className="flex flex-1 items-center justify-center text-[13px]"
        style={{
          backgroundColor: bold ? 'var(--color-white)' : deltaColor(cell.delta),
          color: 'var(--color-black)',
        }}
      >
        {formatDelta(cell.delta)}
      </motion.div>
    </motion.div>
  );

  return (
    <div className={`kaizen-scope w-full overflow-hidden rounded-[var(--border-solid-border-radius)] border-2 border-[var(--border-solid-border-color)] bg-[var(--color-white)] ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border-solid-border-color)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="tertiary" size="small" icon={<Icon name="open_in_full" isPresentational />}>
            Expand rows
          </Button>
          <Button
            variant="tertiary"
            size="small"
            icon={<Icon name={columnsExpanded ? 'close_fullscreen' : 'open_in_full'} isPresentational />}
            onPress={() => setColumnsExpanded((v) => !v)}
          >
            {columnsExpanded ? 'Collapse columns' : 'Expand columns'}
          </Button>
        </div>
        <div className="hidden sm:block">
          <FilterButton label="Sort by" selectedValue="Department (A-Z)" />
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max">
          {/* Row labels */}
          <div className="sticky left-0 z-10 shrink-0 bg-[var(--color-white)]" style={{ width: LABEL_WIDTH }}>
            <motion.div initial={false} animate={{ height: groupHeaderHeight }} transition={transition} />
            <motion.div
              className="overflow-hidden"
              initial={false}
              animate={{ height: columnsExpanded ? SUBHEADER_HEIGHT * 1.6 : 0 }}
              transition={transition}
            />
            <motion.div
              className="flex items-center border-t border-[var(--color-gray-300)] px-4 text-[13px] text-[var(--color-gray-600)]"
              initial={false}
              animate={{ height: rowHeight }}
              transition={transition}
            >
              Responses
            </motion.div>
            {heatmapContent.rows.map((row) => (
              <motion.div
                key={row.label}
                className="flex items-center gap-2 border-t border-[var(--color-gray-300)] px-3 text-[13px] font-semibold text-[var(--color-purple-800)]"
                initial={false}
                animate={{ height: rowHeight }}
                transition={transition}
              >
                <Chevron />
                <span className="truncate">{row.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Groups */}
          {heatmapContent.groups.map((group, groupIndex) => (
            <motion.div key={group} className={`shrink-0 ${GROUP_BORDER}`} initial={false} animate={{ width: groupWidth }} transition={transition}>
              {/* Group header */}
              <motion.div
                className={`flex items-center justify-between gap-1 overflow-hidden px-3 text-[13px] text-[var(--color-purple-800)]`}
                initial={false}
                animate={{ height: groupHeaderHeight }}
                transition={transition}
              >
                <span className="leading-tight">{group}</span>
                <Icon name="open_in_full" isPresentational className="shrink-0 !text-[14px] text-[var(--color-gray-500)]" />
              </motion.div>

              {/* Sub-column headers */}
              <motion.div
                className={`flex overflow-hidden border-t border-[var(--color-gray-300)]`}
                initial={false}
                animate={{ height: columnsExpanded ? SUBHEADER_HEIGHT * 1.6 : 0, opacity: columnsExpanded ? 1 : 0 }}
                transition={{ height: transition, opacity: fade }}
              >
                {['Comparison survey', 'This survey', 'Comparison'].map((label) => (
                  <div
                    key={label}
                    className="flex shrink-0 items-center justify-center px-1 text-center text-[11px] leading-tight text-[var(--color-gray-600)]"
                    style={{ width: SUB_WIDTH }}
                  >
                    {label}
                  </div>
                ))}
              </motion.div>

              {/* Responses row */}
              <div className="border-t border-[var(--color-gray-300)]">
                {renderGroupCells(
                  heatmapContent.responses[groupIndex],
                  `${group}-responses`,
                  rowHeight,
                  true
                )}
              </div>

              {/* Category rows */}
              {heatmapContent.rows.map((row) => (
                <div key={row.label} className="border-t border-[var(--color-gray-300)]">
                  {renderGroupCells(row.cells[groupIndex], `${group}-${row.label}`, rowHeight)}
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
