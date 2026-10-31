'use client';

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { ProjectPreview } from './Preview';
import MrMonogram from './MrMonogram';

export type TransitionMode = 'ripple' | 'expand' | 'shutters' | 'title' | 'zoom';

export const TRANSITION_MODES: { id: TransitionMode; label: string; hint: string }[] = [
  { id: 'ripple', label: 'Ripple', hint: 'Colour floods out from where you click' },
  { id: 'expand', label: 'Expand', hint: 'The project row grows to fill the screen' },
  { id: 'shutters', label: 'Shutters', hint: 'Colour panels drop in one after another' },
  { id: 'title', label: 'Title', hint: 'The project name runs across the screen' },
  { id: 'zoom', label: 'Zoom', hint: 'You fly into the project’s UI' },
];

interface Destination {
  id: string;
  href: string;
  title: string;
  tint: string;
  accent?: string;
}

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Overlay extends Destination {
  mode: TransitionMode;
  x: number;
  y: number;
  /** The row or card that was selected. */
  row: Box;
  /** The project's UI inside it, when there is one. */
  preview: Box | null;
}

const ProjectTransitionContext = createContext<{
  go: (event: React.MouseEvent, destination: Destination) => void;
  mode: TransitionMode;
  setMode: (mode: TransitionMode) => void;
  /** False while a transition cover is still hiding the page; true once it starts to fade, or when there is none. */
  revealed: boolean;
}>({ go: () => {}, mode: 'expand', setMode: () => {}, revealed: true });

export const useProjectTransition = () => useContext(ProjectTransitionContext);
/** For a page that brings its content in as a transition cover fades away. */
export const useRevealed = () => useContext(ProjectTransitionContext).revealed;

const isMode = (value: string | null): value is TransitionMode => TRANSITION_MODES.some((m) => m.id === value);

const EASE = [0.7, 0, 0.2, 1] as const;
// A long, even ease-in-out: no snap at the start and a soft landing.
const EXPAND = [0.65, 0, 0.35, 1] as const;

const toBox = (rect: DOMRect): Box => ({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });

// Selecting a project covers the screen with its colour, using whichever transition is chosen. The cover
// stays up while the case study loads, then goes away to reveal the page, whose top band is the same colour.
export function ProjectTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [mode, setModeState] = useState<TransitionMode>('expand');
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [coverDone, setCoverDone] = useState(false);
  const pushed = useRef(false);
  const startPath = useRef(pathname);

  // Expand is the transition in use. Add ?transition=ripple (or shutters, title, zoom) to the address to try
  // one of the others; the choice is not remembered between visits.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const requested = new URLSearchParams(window.location.search).get('transition');
      if (isMode(requested)) setModeState(requested);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const setMode = useCallback((next: TransitionMode) => setModeState(next), []);

  const go = useCallback(
    (event: React.MouseEvent, destination: Destination) => {
      // Let the browser handle new-tab clicks and the like.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      if (reducedMotion) {
        router.push(destination.href);
        return;
      }
      const link = event.currentTarget as HTMLElement;
      // The whole coloured row (which can reach past its link), so the cover starts exactly over it.
      const rowEl = link.closest<HTMLElement>('[data-project-row]') ?? link;
      const row = toBox(rowEl.getBoundingClientRect());
      const previewEl = link.querySelector<HTMLElement>('[data-project-preview]');
      const previewBox = previewEl ? toBox(previewEl.getBoundingClientRect()) : null;
      const preview = previewBox && previewBox.width > 0 && previewBox.height > 0 ? previewBox : null;
      const effective: TransitionMode = mode === 'zoom' && !preview ? 'ripple' : mode;
      pushed.current = false;
      startPath.current = pathname;
      setLeaving(false);
      setCoverDone(false);
      // Warm the next page up while the cover is still arriving.
      router.prefetch(destination.href);
      if (effective === 'expand') {
        // The page starts loading part-way through, so the cover and the load overlap.
        window.setTimeout(() => {
          if (pushed.current) return;
          pushed.current = true;
          router.push(destination.href);
        }, 380);
      }
      setOverlay({
        ...destination,
        // Without a visible UI to fly into, zoom falls back to a ripple.
        mode: effective,
        x: event.clientX || row.left + row.width / 2,
        y: event.clientY || row.top + row.height / 2,
        row,
        preview,
      });
    },
    [mode, pathname, reducedMotion, router]
  );

  // Every page change lands at the top of the new page, straight away: the site scrolls smoothly, which would
  // otherwise leave a new page scrolled part-way for a moment (and its sticky header flashing in).
  const lastPath = useRef(pathname);
  useLayoutEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  // Once the screen is covered and the new page is in place, let the cover go.
  useEffect(() => {
    if (!overlay || !coverDone || pathname === startPath.current) return;
    const timer = window.setTimeout(() => setLeaving(true), 300);
    return () => window.clearTimeout(timer);
  }, [overlay, coverDone, pathname]);

  // The page is changed once the screen is covered (Expand starts earlier, so only marks the cover as done).
  const covered = useCallback(() => {
    setCoverDone(true);
    if (!overlay || pushed.current) return;
    pushed.current = true;
    router.push(overlay.href);
  }, [overlay, router]);

  return (
    <ProjectTransitionContext.Provider value={{ go, mode, setMode, revealed: !overlay || leaving }}>
      {children}
      <AnimatePresence
        onExitComplete={() => {
          setOverlay(null);
          setLeaving(false);
          setCoverDone(false);
        }}
      >
        {overlay && !leaving && <Cover key={`${overlay.mode}-${overlay.id}`} overlay={overlay} onCovered={covered} />}
      </AnimatePresence>
    </ProjectTransitionContext.Provider>
  );
}

function Label({ overlay, className = '', style }: { overlay: Overlay; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.p
      className={`px-8 font-medium leading-tight tracking-tight text-primary ${className}`}
      style={style}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5, ease: 'easeOut' }}
    >
      {overlay.title}
    </motion.p>
  );
}

function Cover({ overlay, onCovered }: { overlay: Overlay; onCovered: () => void }) {
  const vw = typeof window === 'undefined' ? 1280 : window.innerWidth;
  const vh = typeof window === 'undefined' ? 800 : window.innerHeight;

  // 1. Ripple: a circle of colour grows from the click.
  if (overlay.mode === 'ripple') {
    const radius = Math.hypot(Math.max(overlay.x, vw - overlay.x), Math.max(overlay.y, vh - overlay.y));
    return (
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 z-[100] flex items-center justify-center"
        style={{ backgroundColor: overlay.tint }}
        initial={{ clipPath: `circle(0px at ${overlay.x}px ${overlay.y}px)` }}
        animate={{ clipPath: `circle(${radius}px at ${overlay.x}px ${overlay.y}px)` }}
        exit={{ opacity: 0 }}
        transition={{ clipPath: { duration: 0.8, ease: EASE }, opacity: { duration: 0.5, ease: 'easeOut' } }}
        onAnimationComplete={(definition) => {
          if (typeof definition === 'object' && 'clipPath' in definition) onCovered();
        }}
      >
        <Label overlay={overlay} className="text-center text-[clamp(28px,5vw,64px)]" />
      </motion.div>
    );
  }

  // 2. Expand: the selected row itself grows to fill the screen. Only clip-path animates (it can run off the
  // main thread), on one slow ease-in-out curve, so it stays smooth while the next page loads. The cover is finished once the MR
  // initials have been written across it; the case study page then brings its own content in as it fades.
  if (overlay.mode === 'expand') {
    const { row } = overlay;
    const inset = `inset(${row.top}px ${vw - (row.left + row.width)}px ${vh - (row.top + row.height)}px ${row.left}px)`;
    return (
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 z-[100] overflow-hidden"
        style={{ backgroundColor: overlay.tint }}
        initial={{ clipPath: inset }}
        animate={{ clipPath: 'inset(0px 0px 0px 0px)' }}
        exit={{ opacity: 0 }}
        transition={{ clipPath: { duration: 1.05, ease: EXPAND }, opacity: { duration: 0.8, ease: 'easeInOut' } }}
      >
        {/* The MR initials are written in the project's accent colour once the row has grown over the screen */}
        <div className="absolute inset-0 flex items-center justify-center">
          <MrMonogram
            color={overlay.accent ?? '#1d1d1f'}
            delay={0.45}
            onWritten={onCovered}
            className="w-[min(240px,34vw)]"
          />
        </div>
      </motion.div>
    );
  }

  // 3. Shutters: colour panels drop in one after another, and lift away again.
  if (overlay.mode === 'shutters') {
    const panels = 6;
    return (
      <div aria-hidden="true" className="fixed inset-0 z-[100] flex">
        {Array.from({ length: panels }, (_, i) => (
          <motion.div
            key={i}
            className="h-full flex-1"
            style={{ backgroundColor: overlay.tint, transformOrigin: 'center top' }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0, transformOrigin: 'center bottom', transition: { duration: 0.55, ease: EASE, delay: i * 0.05 } }}
            transition={{ duration: 0.55, ease: EASE, delay: i * 0.07 }}
            onAnimationComplete={() => {
              if (i === panels - 1) onCovered();
            }}
          />
        ))}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Label overlay={overlay} className="text-center text-[clamp(28px,5vw,64px)]" />
        </div>
      </div>
    );
  }

  // 4. Title: the project's name runs across the screen on a rising block of colour.
  if (overlay.mode === 'title') {
    const size = Math.min(vw * 0.2, 280);
    const width = overlay.title.length * size * 0.62;
    return (
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 z-[100] overflow-hidden"
        style={{ backgroundColor: overlay.tint }}
        initial={{ y: '100%' }}
        animate={{ y: '0%' }}
        exit={{ y: '-100%' }}
        transition={{ duration: 0.7, ease: EASE }}
        onAnimationComplete={(definition) => {
          if (typeof definition === 'object' && 'y' in definition && definition.y === '0%') onCovered();
        }}
      >
        <motion.p
          className="absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap font-semibold leading-none tracking-tighter"
          style={{ fontSize: size, color: overlay.accent ?? 'currentColor' }}
          initial={{ x: vw }}
          animate={{ x: -width }}
          transition={{ duration: 2.4, ease: 'linear', delay: 0.2 }}
        >
          {overlay.title}
        </motion.p>
      </motion.div>
    );
  }

  // 5. Zoom: a copy of the project's UI grows from where it sits until it fills the screen.
  const preview = overlay.preview as Box;
  const scale = Math.max(vw / preview.width, vh / preview.height) * 1.15;
  const cx = preview.left + preview.width / 2;
  const cy = preview.top + preview.height / 2;
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ backgroundColor: overlay.tint }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <motion.div
        className="absolute overflow-hidden bg-white"
        style={{ left: preview.left, top: preview.top, width: preview.width, height: preview.height, transformOrigin: `${cx - preview.left}px ${cy - preview.top}px` }}
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale, opacity: [1, 1, 0] }}
        transition={{ duration: 1.1, ease: [0.5, 0, 0.75, 0], opacity: { duration: 1.1, times: [0, 0.75, 1] } }}
        onAnimationComplete={(definition) => {
          if (typeof definition === 'object' && 'scale' in definition) onCovered();
        }}
      >
        <ProjectPreview id={overlay.id} showcase />
      </motion.div>
    </motion.div>
  );
}

// A small floating control for choosing the transition. It is for trying the options and can be removed.
export function TransitionSwitcher() {
  const { mode, setMode } = useProjectTransition();
  return (
    <div
      role="group"
      aria-label="Project transition"
      className="fixed bottom-5 left-1/2 z-40 flex max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-2 overflow-x-auto rounded-full bg-white/90 py-1.5 pl-4 pr-1.5 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.25)] backdrop-blur"
    >
      <span className="type-small shrink-0 text-secondary">Transition</span>
      <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-neutral-200/70 p-0.5">
        {TRANSITION_MODES.map((option) => (
          <button
            key={option.id}
            type="button"
            title={option.hint}
            aria-pressed={mode === option.id}
            onClick={() => setMode(option.id)}
            className={`cursor-pointer rounded-full px-3 py-1 text-[13px] font-medium transition-colors duration-200 ${
              mode === option.id ? 'bg-black text-white' : 'text-black/70 hover:bg-white/70'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
