'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { Button, Icon } from '@kaizen/components';
import '@/styles/kaizen.css';
import './heatmap.css';
import { heatmapContent, formatDelta, deltaColor } from './content';

const LABEL_WIDTH = 250;
const COMPACT_WIDTH = 112;
const SUB_WIDTH = 72;
const ROW_HEIGHT = 44;
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
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const transition = reducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 240, damping: 30, mass: 0.9 };
  const fade = reducedMotion ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' as const };

  const isExpanded = (group: string) => expandedGroups.includes(group);
  const allExpanded = expandedGroups.length === heatmapContent.groups.length;
  const anyExpanded = expandedGroups.length > 0;

  const toggleGroup = (group: string) =>
    setExpandedGroups((groups) => (groups.includes(group) ? groups.filter((g) => g !== group) : [...groups, group]));
  const toggleAllGroups = () => setExpandedGroups(allExpanded ? [] : [...heatmapContent.groups]);

  // Row height stays the same whether columns are expanded or collapsed.
  const rowHeight = ROW_HEIGHT;
  // The header area still follows whether any group is open, so it lines up across groups.
  const groupHeaderHeight = anyExpanded ? GROUP_HEADER_HEIGHT : GROUP_HEADER_HEIGHT_COMPACT;
  const subheaderHeight = anyExpanded ? SUBHEADER_HEIGHT * 1.6 : 0;

  // A single cell in the grid. Extra survey columns collapse to zero width.
  const renderGroupCells = (
    cell: { comparisonSurvey: number; thisSurvey: number; delta: number },
    key: string,
    height: number,
    expanded: boolean,
    bold = false
  ) => (
    <motion.div
      key={key}
      className="flex w-full border-t border-[var(--color-gray-300)]"
      initial={false}
      animate={{ height }}
      transition={transition}
    >
      <motion.div
        className="overflow-hidden shrink-0"
        initial={false}
        animate={{ width: expanded ? SUB_WIDTH : 0, opacity: expanded ? 1 : 0 }}
        transition={{ width: transition, opacity: fade }}
      >
        <div className="flex h-full items-center justify-center text-[13px] text-[var(--color-purple-800)]" style={{ width: SUB_WIDTH }}>
          {cell.comparisonSurvey}
        </div>
      </motion.div>
      <motion.div
        className="overflow-hidden shrink-0"
        initial={false}
        animate={{ width: expanded ? SUB_WIDTH : 0, opacity: expanded ? 1 : 0 }}
        transition={{ width: transition, opacity: fade }}
      >
        <div
          className="flex h-full items-center justify-center border-l border-[var(--color-gray-300)] text-[13px] text-[var(--color-purple-800)]"
          style={{ width: SUB_WIDTH }}
        >
          {cell.thisSurvey}
        </div>
      </motion.div>
      <motion.div
        className="flex flex-1 items-center justify-center text-[13px]"
        style={{
          backgroundColor: bold ? 'var(--color-white)' : deltaColor(cell.delta),
          color: 'var(--color-black)',
          borderLeft: expanded ? '1px solid var(--color-gray-300)' : 'none',
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
          <Button
            variant="tertiary"
            size="small"
            className="heatmap-toolbar-button"
            icon={<Icon name="open_in_full" isPresentational />}
          >
            Expand rows
          </Button>
          <Button
            variant="tertiary"
            size="small"
            className="heatmap-toolbar-button"
            icon={<Icon name={allExpanded ? 'close_fullscreen' : 'open_in_full'} isPresentational />}
            onPress={toggleAllGroups}
          >
            {allExpanded ? 'Collapse columns' : 'Expand columns'}
          </Button>
        </div>
        <div className="hidden sm:block">
          <Button
            variant="tertiary"
            size="small"
            className="heatmap-toolbar-button"
            icon={<Icon name="expand_more" isPresentational />}
            iconPosition="end"
          >
            <span className="whitespace-nowrap">
              <span className="font-semibold">Sort by:</span> Department (A-Z)
            </span>
          </Button>
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
              animate={{ height: subheaderHeight }}
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
          {heatmapContent.groups.map((group, groupIndex) => {
            const expanded = isExpanded(group);
            return (
            <motion.div
              key={group}
              className={`shrink-0 ${GROUP_BORDER}`}
              initial={false}
              animate={{ width: expanded ? SUB_WIDTH * 3 : COMPACT_WIDTH }}
              transition={transition}
            >
              {/* Group header: left aligned when compact, centred over its columns when expanded */}
              <motion.div
                className={`relative flex items-center overflow-hidden text-[13px] text-[var(--color-purple-800)] ${
                  expanded ? 'justify-center px-9 text-center' : 'justify-between gap-1 pl-3 pr-1'
                }`}
                initial={false}
                animate={{ height: groupHeaderHeight }}
                transition={transition}
              >
                <span className="leading-tight">{group}</span>
                <div className={expanded ? 'absolute right-1 top-1/2 -translate-y-1/2' : 'shrink-0'}>
                  <Button
                    variant="tertiary"
                    size="small"
                    hasHiddenLabel
                    className="heatmap-toolbar-button"
                    icon={<Icon name={expanded ? 'close_fullscreen' : 'open_in_full'} isPresentational />}
                    onPress={() => toggleGroup(group)}
                    aria-expanded={expanded}
                  >
                    {expanded ? `Collapse ${group} columns` : `Expand ${group} columns`}
                  </Button>
                </div>
              </motion.div>

              {/* Sub-column headers */}
              <motion.div
                className="flex overflow-hidden border-[var(--color-gray-300)]"
                style={{ borderTopWidth: anyExpanded ? 1 : 0 }}
                initial={false}
                animate={{ height: subheaderHeight, opacity: anyExpanded ? 1 : 0 }}
                transition={{ height: transition, opacity: fade }}
              >
                {expanded &&
                  ['Comparison survey', 'This survey', 'Comparison'].map((label, labelIndex) => (
                    <div
                      key={label}
                      className={`flex shrink-0 items-center justify-center px-1 text-center text-[11px] leading-tight text-[var(--color-gray-600)] ${
                        labelIndex > 0 ? 'border-l border-[var(--color-gray-300)]' : ''
                      }`}
                      style={{ width: SUB_WIDTH }}
                    >
                      {label}
                    </div>
                  ))}
              </motion.div>

              {/* Responses row */}
              <div>
                {renderGroupCells(
                  heatmapContent.responses[groupIndex],
                  `${group}-responses`,
                  rowHeight,
                  expanded,
                  true
                )}
              </div>

              {/* Category rows */}
              {heatmapContent.rows.map((row) => (
                <div key={row.label}>
                  {renderGroupCells(row.cells[groupIndex], `${group}-${row.label}`, rowHeight, expanded)}
                </div>
              ))}
            </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
