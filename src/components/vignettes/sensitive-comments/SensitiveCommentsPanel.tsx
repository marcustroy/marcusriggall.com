'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Icon, LoadingParagraph, Tag, ToggleSwitchField } from '@kaizen/components';
import { useReducedMotion } from '@/lib/useReducedMotion';
import '@/styles/kaizen.css';
import '@/styles/kaizen-fixes.css';
import '../heatmap-comparisons/heatmap.css';
import './sensitive-comments.css';
import {
  formatDate,
  sensitiveComments,
  statusOrder,
  type CommentStatus,
  type SensitiveComment,
} from './content';

type SortKey = 'comment' | 'date' | 'status' | 'topic' | 'keyword' | 'sentiment';
type SortDirection = 'asc' | 'desc';

const columns: { key: SortKey; label: string; width: number }[] = [
  { key: 'comment', label: 'Comment', width: 380 },
  { key: 'date', label: 'Date submitted', width: 120 },
  { key: 'status', label: 'Status', width: 120 },
  { key: 'topic', label: 'Topic', width: 130 },
  { key: 'keyword', label: 'Keyword', width: 140 },
  { key: 'sentiment', label: 'Sentiment', width: 110 },
];

const VISIBLE_TAGS = 2;

// Which Kaizen colour each status tag takes (see sensitive-comments.css).
const statusTone: Record<CommentStatus, string> = {
  'Needs review': 'sc-tag-gray',
  'Not redacted': 'sc-tag-blue',
  Redacted: 'sc-tag-orange',
};
// How long comments show a loading state after the language is switched.
const TRANSLATE_DELAY_MS = 1400;

function sortValue(comment: SensitiveComment, key: SortKey, original: boolean) {
  switch (key) {
    case 'comment':
      return (original ? comment.original : (comment.translated ?? comment.original)).toLowerCase();
    case 'date':
      return comment.date;
    case 'status':
      return statusOrder.indexOf(comment.status);
    case 'topic':
      return comment.topics[0].toLowerCase();
    case 'keyword':
      return comment.keywords[0].toLowerCase();
    case 'sentiment':
      return comment.sentiment;
  }
}

// Placeholder lines for a cell while its content reloads, with 4px between lines.
function CellSkeleton({ widths, animated, label }: { widths: number[]; animated: boolean; label?: string }) {
  return (
    <div
      className="flex flex-col gap-1"
      {...(label ? { role: 'status', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {widths.map((width, index) => (
        <LoadingParagraph key={index} isAnimated={animated} noBottomMargin width={width} />
      ))}
    </div>
  );
}

// A column of tags, with the rest collapsed into a "+N" count.
function TagList({ items }: { items: string[] }) {
  const shown = items.slice(0, VISIBLE_TAGS);
  const rest = items.length - shown.length;
  return (
    <div className="flex flex-col items-start gap-1.5">
      {shown.map((item) => (
        <Tag key={item} size="small" inline>
          {item}
        </Tag>
      ))}
      {rest > 0 && (
        <Tag size="small" inline>
          +{rest}
        </Tag>
      )}
    </div>
  );
}

interface SensitiveCommentsPanelProps {
  className?: string;
}

export default function SensitiveCommentsPanel({ className = '' }: SensitiveCommentsPanelProps) {
  const comments = sensitiveComments;
  const [showOriginalLanguage, setShowOriginalLanguage] = useState(true);
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection } | null>(null);
  const [translating, setTranslating] = useState(false);
  const translateTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reducedMotion = useReducedMotion();

  useEffect(() => () => clearTimeout(translateTimer.current), []);

  // Switching language re-translates the comments, which takes a moment.
  const changeLanguage = (original: boolean) => {
    setShowOriginalLanguage(original);
    setTranslating(true);
    clearTimeout(translateTimer.current);
    translateTimer.current = setTimeout(() => setTranslating(false), TRANSLATE_DELAY_MS);
  };

  const rows = useMemo(() => {
    if (!sort) return comments;
    const direction = sort.direction === 'asc' ? 1 : -1;
    return [...comments].sort((a, b) => {
      const left = sortValue(a, sort.key, showOriginalLanguage);
      const right = sortValue(b, sort.key, showOriginalLanguage);
      return left < right ? -direction : left > right ? direction : 0;
    });
  }, [comments, sort, showOriginalLanguage]);

  const toggleSort = (key: SortKey) =>
    setSort((current) =>
      current?.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );

  return (
    <div
      className={`kaizen-scope w-full overflow-hidden rounded-[var(--border-solid-border-radius)] bg-[var(--color-white)] text-[var(--color-purple-800)] ${className}`}
    >
      {/* Toolbar */}
      <div className="flex flex-nowrap items-center justify-between gap-2 overflow-x-auto border-b border-[var(--border-solid-border-color)] px-1 py-2">
        <div className="flex shrink-0 items-center">
          <Button
            variant="tertiary"
            size="small"
            className="heatmap-toolbar-button sc-toolbar-button"
            icon={<Icon name="cloud_download" isPresentational />}
          >
            Export sensitive comments
          </Button>
          <Button
            variant="tertiary"
            size="small"
            className="heatmap-toolbar-button sc-toolbar-button"
            icon={<Icon name="cloud_upload" isPresentational />}
          >
            Import to redact comments
          </Button>
        </div>
        <div className="sc-toggle ml-auto shrink-0 pr-1">
          <ToggleSwitchField
            labelText="Translate comments to their original language"
            labelPosition="start"
            inline
            toggledStatus={showOriginalLanguage ? 'on' : 'off'}
            onToggle={(event) => changeLanguage(event.target.checked)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="sc-table max-h-[560px] overflow-auto">
        <table className="w-full min-w-[1000px] border-collapse text-left text-[12px]">
          <thead className="sticky top-0 z-10 bg-[var(--color-white)]">
            <tr className="border-b border-[var(--color-gray-300)]">
              {columns.map((column) => {
                const active = sort?.key === column.key;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    style={{ width: column.width }}
                    aria-sort={active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                    className="px-3 py-3 font-semibold"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(column.key)}
                      className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded hover:text-[var(--color-blue-500)]"
                    >
                      {column.label}
                      <Icon
                        name={active ? (sort.direction === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'expand_more'}
                        isPresentational
                        className="!text-[16px]"
                      />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((comment) => {
              const text = showOriginalLanguage ? comment.original : (comment.translated ?? comment.original);
              const animated = !reducedMotion;
              return (
                <tr key={comment.id} className="border-b border-[var(--color-gray-300)] align-middle">
                  <td className="px-3 py-3 leading-[1.5]">
                    {translating ? (
                      <CellSkeleton widths={[100, 100, 60]} animated={animated} label="Translating comments" />
                    ) : (
                      text
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {translating ? (
                      <CellSkeleton widths={[85]} animated={animated} />
                    ) : (
                      formatDate(comment.date)
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {translating ? (
                      <CellSkeleton widths={[90]} animated={animated} />
                    ) : (
                      <span className={statusTone[comment.status]}>
                        <Tag size="small" inline>
                          {comment.status}
                        </Tag>
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {translating ? (
                      <CellSkeleton widths={comment.topics.length > 1 ? [80, 60] : [80]} animated={animated} />
                    ) : (
                      <TagList items={comment.topics} />
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {translating ? (
                      <CellSkeleton widths={comment.keywords.length > 1 ? [85, 65] : [85]} animated={animated} />
                    ) : (
                      <TagList items={comment.keywords} />
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {translating ? (
                      <CellSkeleton widths={[75]} animated={animated} />
                    ) : (
                      <Tag size="small" inline variant="sentimentNegative">
                        {comment.sentiment}
                      </Tag>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
