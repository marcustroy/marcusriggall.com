'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { Button, Icon, LoadingParagraph, Menu, MenuHeader, MenuPopover, MenuSection, MenuTrigger } from '@kaizen/components';
import { useKaizenPortal } from '@/lib/useKaizenPortal';
import MenuOption from '../shared/MenuOption';
import '@/styles/kaizen.css';
import './heatmap.css';
import { heatmapContent, formatDelta, deltaColor } from './content';

const LABEL_WIDTH = 276;
const COMPACT_WIDTH = 112;
const SUB_WIDTH = 72;
const ROW_HEIGHT = 44;
const SUBHEADER_HEIGHT = 34;
const GROUP_HEADER_HEIGHT = 40;
const GROUP_HEADER_HEIGHT_COMPACT = 52;

const GROUP_BORDER = 'border-l-2 border-[var(--color-gray-500)]';

type SortId = 'responses-desc' | 'responses-asc' | 'score-desc' | 'score-asc' | 'department-asc' | 'department-desc';

const SORT_SECTIONS: { heading: string; options: { id: SortId; label: string }[] }[] = [
  {
    heading: 'Responses',
    options: [
      { id: 'responses-desc', label: 'Most - least' },
      { id: 'responses-asc', label: 'Least - most' },
    ],
  },
  {
    heading: 'Engagement score',
    options: [
      { id: 'score-desc', label: 'Highest - lowest' },
      { id: 'score-asc', label: 'Lowest - highest' },
    ],
  },
  {
    heading: 'Department',
    options: [
      { id: 'department-asc', label: 'A - Z' },
      { id: 'department-desc', label: 'Z - A' },
    ],
  },
];

const SORT_LABELS: Record<SortId, string> = {
  'responses-desc': 'Responses (most-least)',
  'responses-asc': 'Responses (least-most)',
  'score-desc': 'Engagement score (highest-lowest)',
  'score-asc': 'Engagement score (lowest-highest)',
  'department-asc': 'Department (A-Z)',
  'department-desc': 'Department (Z-A)',
};

interface HeatmapPanelProps {
  className?: string;
}

export default function HeatmapPanel({ className = '' }: HeatmapPanelProps) {
  const reducedMotion = useReducedMotion();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  // `sort` is what the menu has chosen; `appliedSort` is the order on screen, which only changes once the
  // loading state has run, so the columns never visibly move to their new places.
  const [sort, setSort] = useState<SortId>('department-asc');
  const [appliedSort, setAppliedSort] = useState<SortId>('department-asc');
  const [loading, setLoading] = useState(false);
  const loadTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(loadTimer.current), []);
  const chooseSort = (next: SortId) => {
    if (next === sort) return;
    clearTimeout(loadTimer.current);
    setSort(next);
    setLoading(true);
    loadTimer.current = setTimeout(() => {
      setAppliedSort(next);
      setLoading(false);
    }, reducedMotion ? 300 : 900);
  };
  const menuContainer = useKaizenPortal();

  const transition = reducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 240, damping: 30, mass: 0.9 };
  const fade = reducedMotion ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' as const };

  // The columns in the chosen order. Each keeps its own index into the data, so only the order changes.
  const engagementRow = heatmapContent.rows.find((row) => row.label === 'Engagement') ?? heatmapContent.rows[0];
  const sortValue = (index: number) =>
    appliedSort.startsWith('responses')
      ? heatmapContent.responses[index].thisSurvey
      : appliedSort.startsWith('score')
        ? engagementRow.cells[index].thisSurvey
        : 0;
  const order = heatmapContent.groups
    .map((group, index) => index)
    .sort((a, b) => {
      if (appliedSort.startsWith('department')) {
        const byName = heatmapContent.groups[a].localeCompare(heatmapContent.groups[b]);
        return appliedSort === 'department-asc' ? byName : -byName;
      }
      const byValue = sortValue(a) - sortValue(b);
      return appliedSort.endsWith('desc') ? -byValue : byValue;
    });

  const isExpanded = (group: string) => expandedGroups.includes(group);
  const anyExpanded = expandedGroups.length > 0;

  const toggleGroup = (group: string) =>
    setExpandedGroups((groups) => (groups.includes(group) ? groups.filter((g) => g !== group) : [...groups, group]));
  // With anything open the button collapses everything; otherwise it expands everything.
  const toggleAllGroups = () => setExpandedGroups(anyExpanded ? [] : [...heatmapContent.groups]);

  const isRowOpen = (row: string) => expandedRows.includes(row);
  const anyRowOpen = expandedRows.length > 0;
  const toggleRow = (row: string) =>
    setExpandedRows((rows) => (rows.includes(row) ? rows.filter((r) => r !== row) : [...rows, row]));
  const toggleAllRows = () => setExpandedRows(anyRowOpen ? [] : heatmapContent.rows.map((row) => row.label));

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
  ) =>
    loading ? (
      // Sorting: the cells show as plain gray-100 blocks until the new order is ready.
      <motion.div
        key={key}
        className="w-full border-t border-[var(--color-gray-300)] bg-[var(--color-gray-100)]"
        initial={false}
        animate={{ height }}
        transition={transition}
      />
    ) : (
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
    <div className={`kaizen-scope w-full overflow-hidden rounded-[var(--border-solid-border-radius)] bg-[var(--color-white)] ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border-solid-border-color)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="tertiary"
            size="small"
            className="heatmap-toolbar-button"
            icon={<Icon name={anyRowOpen ? 'close_fullscreen' : 'open_in_full'} isPresentational />}
            onPress={toggleAllRows}
          >
            {anyRowOpen ? 'Collapse rows' : 'Expand rows'}
          </Button>
          <Button
            variant="tertiary"
            size="small"
            className="heatmap-toolbar-button"
            icon={<Icon name={anyExpanded ? 'close_fullscreen' : 'open_in_full'} isPresentational />}
            onPress={toggleAllGroups}
          >
            {anyExpanded ? 'Collapse columns' : 'Expand columns'}
          </Button>
        </div>
        <div className="hidden sm:block">
          <MenuTrigger>
            <Button
              variant="tertiary"
              size="small"
              className="heatmap-toolbar-button"
              icon={<Icon name="expand_more" isPresentational />}
              iconPosition="end"
            >
              <span className="whitespace-nowrap">
                <span className="font-semibold">Sort by:</span> {SORT_LABELS[sort]}
              </span>
            </Button>
            <MenuPopover placement="bottom end" UNSTABLE_portalContainer={menuContainer}>
              <Menu onAction={(key) => chooseSort(key as SortId)}>
                {SORT_SECTIONS.map((section) => (
                  <MenuSection key={section.heading}>
                    <MenuHeader>{section.heading}</MenuHeader>
                    {section.options.map((option) => (
                      <MenuOption key={option.id} id={option.id} selected={sort === option.id}>
                        {option.label}
                      </MenuOption>
                    ))}
                  </MenuSection>
                ))}
              </Menu>
            </MenuPopover>
          </MenuTrigger>
        </div>
      </div>

      {/* Grid */}
      <div className="max-h-[620px] overflow-auto">
        <div className="flex min-w-max">
          {/* Row labels */}
          <div className="sticky left-0 z-10 shrink-0 bg-[var(--color-white)]" style={{ width: LABEL_WIDTH }}>
            <div className="sticky top-0 z-20 bg-[var(--color-white)]">
              <motion.div initial={false} animate={{ height: groupHeaderHeight }} transition={transition} />
              <motion.div
                className="overflow-hidden"
                initial={false}
                animate={{ height: subheaderHeight }}
                transition={transition}
              />
            </div>
            <motion.div
              className="flex items-center border-t border-[var(--color-gray-300)] px-4 text-[13px] text-[var(--color-gray-600)]"
              initial={false}
              animate={{ height: rowHeight }}
              transition={transition}
            >
              Responses
            </motion.div>
            {heatmapContent.rows.map((row) => {
              const open = isRowOpen(row.label);
              return (
                <div key={row.label}>
                  <motion.div
                    className="flex items-center gap-1 border-t border-[var(--color-gray-300)] pl-2 pr-2 text-[13px] font-semibold text-[var(--color-purple-800)]"
                    initial={false}
                    animate={{ height: rowHeight }}
                    transition={transition}
                  >
                    <Button
                      variant="tertiary"
                      size="small"
                      hasHiddenLabel
                      className="heatmap-toolbar-button shrink-0"
                      icon={<Icon name={open ? 'expand_less' : 'expand_more'} isPresentational />}
                      onPress={() => toggleRow(row.label)}
                      aria-expanded={open}
                    >
                      {open ? `Collapse ${row.label} questions` : `Expand ${row.label} questions`}
                    </Button>
                    <span>{row.label}</span>
                  </motion.div>
                  <motion.div
                    className="overflow-hidden"
                    initial={false}
                    animate={{ height: open ? row.questions.length * rowHeight : 0, opacity: open ? 1 : 0 }}
                    transition={{ height: transition, opacity: fade }}
                  >
                    {row.questions.map((question) => (
                      <div
                        key={question.label}
                        className="flex items-center border-t border-[var(--color-gray-300)] pl-12 pr-3 text-[12px] leading-tight text-[var(--color-purple-800)]"
                        style={{ height: rowHeight }}
                      >
                        <span className="line-clamp-2">{question.label}</span>
                      </div>
                    ))}
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Groups */}
          {order.map((groupIndex) => {
            const group = heatmapContent.groups[groupIndex];
            const expanded = isExpanded(group);
            return (
            <motion.div
              key={group}
              className={`shrink-0 ${GROUP_BORDER}`}
              initial={false}
              animate={{ width: expanded ? SUB_WIDTH * 3 : COMPACT_WIDTH }}
              transition={transition}
            >
              <div className="sticky top-0 z-[5] bg-[var(--color-white)]">
              {/* Group header: left aligned when compact, centred over its columns when expanded */}
              <motion.div
                className={`relative flex items-center overflow-hidden text-[13px] text-[var(--color-purple-800)] ${
                  expanded ? 'justify-center px-9 text-center' : 'justify-between gap-1 pl-3 pr-1'
                }`}
                initial={false}
                animate={{ height: groupHeaderHeight }}
                transition={transition}
              >
                {loading ? (
                  <div className="w-full">
                    <LoadingParagraph isAnimated noBottomMargin width={60} />
                  </div>
                ) : (
                  <span className="leading-tight">{group}</span>
                )}
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
              </div>

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
              {heatmapContent.rows.map((row) => {
                const open = isRowOpen(row.label);
                return (
                  <div key={row.label}>
                    {renderGroupCells(row.cells[groupIndex], `${group}-${row.label}`, rowHeight, expanded)}
                    <motion.div
                      className="overflow-hidden"
                      initial={false}
                      animate={{ height: open ? row.questions.length * rowHeight : 0, opacity: open ? 1 : 0 }}
                      transition={{ height: transition, opacity: fade }}
                    >
                      {row.questions.map((question) =>
                        renderGroupCells(
                          question.cells[groupIndex],
                          `${group}-${row.label}-${question.label}`,
                          rowHeight,
                          expanded
                        )
                      )}
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
