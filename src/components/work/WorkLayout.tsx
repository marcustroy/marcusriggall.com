'use client';

import { useEffect, useState } from 'react';

export type WorkLayout = 'list' | 'grid' | 'bands' | 'index' | 'blend';

export const WORK_LAYOUTS: { id: WorkLayout; label: string }[] = [
  { id: 'list', label: 'List' },
  { id: 'grid', label: 'Grid' },
  { id: 'bands', label: 'Bands' },
  { id: 'index', label: 'Index' },
  { id: 'blend', label: 'Blend' },
];

const isLayout = (value: string | null): value is WorkLayout => WORK_LAYOUTS.some((l) => l.id === value);

// Blend is the home page's main view. The other layouts are still built: add ?work=list (or grid, bands,
// index) to the address to see one. The visible LayoutSwitcher is not rendered for now.
export function useWorkLayout(): [WorkLayout, (layout: WorkLayout) => void] {
  const [layout, setLayoutState] = useState<WorkLayout>('blend');

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const requested = new URLSearchParams(window.location.search).get('work');
      if (isLayout(requested)) setLayoutState(requested);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return [layout, setLayoutState];
}

export function LayoutSwitcher({ layout, onChange }: { layout: WorkLayout; onChange: (layout: WorkLayout) => void }) {
  return (
    <div className="flex max-w-full items-center gap-2 overflow-x-auto" role="group" aria-label="Work layout">
      <span className="type-small shrink-0 text-secondary">Layout</span>
      <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-neutral-200/70 p-0.5">
        {WORK_LAYOUTS.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={layout === option.id}
            onClick={() => onChange(option.id)}
            className={`cursor-pointer rounded-full px-3 py-1 text-[13px] font-medium transition-colors duration-200 ${
              layout === option.id ? 'bg-black text-white' : 'text-black/70 hover:bg-white/70'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
