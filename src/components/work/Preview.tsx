'use client';

import { useEffect, useRef, useState } from 'react';
import HeatmapPanel from '../vignettes/heatmap-comparisons/HeatmapPanel';
import PcqPanel from '../vignettes/pcq/PcqPanel';
import SandboxPanel from '../vignettes/prototyping/SandboxPanel';
import SensitiveCommentsPanel from '../vignettes/sensitive-comments/SensitiveCommentsPanel';

export function WorkPanel({ id, showcase = false }: { id: string; showcase?: boolean }) {
  return (
    <>
      {id === 'heatmap-comparisons' && <HeatmapPanel />}
      {id === 'culture-quadrant' && <PcqPanel showcase={showcase} />}
      {id === 'sensitive-comments' && <SensitiveCommentsPanel />}
      {id === 'prototyping' && <SandboxPanel activeStory={null} />}
    </>
  );
}

// Panels are designed for a ~680px column. Narrower than that they render at that
// width and scale down to fit, so they stay intact and tappable. Wider than that
// they simply fill the available width instead of leaving empty space.
const PANEL_DESIGN_WIDTH = 680;

export function ScaledPreview({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [outerWidth, setOuterWidth] = useState(PANEL_DESIGN_WIDTH);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const update = () => {
      const nextScale = Math.min(1, outer.clientWidth / PANEL_DESIGN_WIDTH);
      setScale(nextScale);
      setOuterWidth(outer.clientWidth);
      setHeight(inner.offsetHeight * nextScale);
    };
    const observer = new ResizeObserver(update);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={outerRef} className="relative overflow-clip" style={{ height }}>
      <div
        ref={innerRef}
        style={{ width: Math.max(PANEL_DESIGN_WIDTH, outerWidth), transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        {children}
      </div>
    </div>
  );
}


// A live, non-interactive copy of a project's UI, for cards that link to the project.
export function ProjectPreview({ id, showcase = false }: { id: string; showcase?: boolean }) {
  return (
    // The Design Sandbox is a set of loose parts, so like its frame on the home list it gets padding around it.
    <div className={`pointer-events-none select-none ${id === 'prototyping' ? 'p-6' : ''}`} aria-hidden="true" inert>
      <ScaledPreview>
        <WorkPanel id={id} showcase={showcase} />
      </ScaledPreview>
    </div>
  );
}
