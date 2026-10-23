'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import SectionTitle from './SectionTitle';
import HighlightsPanel from './vignettes/ai-highlights/HighlightsPanel';
import SuggestionsPanel from './vignettes/ai-suggestions/SuggestionsPanel';
import TranslationManagementPanel from './vignettes/multilingual/TranslationManagementPanel';
import SandboxPanel from './vignettes/prototyping/SandboxPanel';
import BrowserFrame from './state-explorer/BrowserFrame';
import DemoApp from './state-explorer/demo/DemoApp';
import AgentOverlay from './state-explorer/demo/AgentOverlay';
import { useDemoStore } from './state-explorer/demo/demoStore';
import NotebookApp from '@/design-notebooks/_harness/NotebookApp';
import '@/design-notebooks/_harness/notebook.css';
import { ITERATIONS, PROJECT } from './design-notebook/iterations';
import { aiSuggestionsContent, defaultBorderSettings } from './vignettes/ai-suggestions/content';
import type { BorderSettings } from './vignettes/ai-suggestions/content';

interface WorkItem {
  id: string;
  title: string;
  description: string;
  href?: string;
}

const isExternal = (href: string) => /^https?:\/\//.test(href);

// Only off-site links open a new tab; /notebook and /states stay in place.
const linkTargetProps = (href: string) =>
  isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {};

const toolItems: WorkItem[] = [
  {
    id: 'critter',
    title: 'Critter',
    description: 'Browse and compare UI versions from Git. See every design iteration your coding agent makes, side by side.',
    href: 'https://critter.sh',
  },
  {
    id: 'notebook',
    title: 'Design Notebook',
    description: 'Create an interactive timeline of design iterations in Claude.ai. Diverge, pick the best parts and always know you got there.',
    href: '/notebook',
  },
  {
    id: 'states',
    title: 'States',
    description: 'Create a control panel inside your UI to reveal empty states, edge cases, loading states & error conditions.',
    href: '/states',
  },
];

const projectItems: WorkItem[] = [
  {
    id: 'highlights',
    title: 'Highlights and Opportunities',
    description: 'AI summaries to make performance reviews easier.',
  },
  {
    id: 'suggestions',
    title: 'AI Suggest Improvements',
    description: 'AI suggestions to help managers write better feedback.',
  },
  {
    id: 'multilingual',
    title: 'Multilingual Performance Cycles',
    description: 'A simple workflow to run a multilingual performance cycle.',
  },
  {
    id: 'prototyping',
    title: 'Design Sandbox',
    description: 'Built an internal repository to make AI prototyping faster and easier.',
  },
];

function StatesDemo() {
  const autoPlay = useDemoStore((s) => s.autoPlay);

  useEffect(() => {
    const timer = setTimeout(() => autoPlay(), 500);
    return () => clearTimeout(timer);
  }, [autoPlay]);

  return (
    <div className="demo-theme">
      <div className="relative overflow-hidden rounded-lg">
        <BrowserFrame url="localhost:5174">
          <DemoApp highlightedCode="" />
        </BrowserFrame>
        <AgentOverlay />
      </div>
    </div>
  );
}

function CritterDemo() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-neutral-200">
      <video
        src="/critter/walkthrough.mp4"
        className="block w-full h-auto aspect-[1200/760]"
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  );
}

function NotebookDemo() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-neutral-200 [&>div]:!min-h-0">
      <NotebookApp iterations={ITERATIONS} project={PROJECT} defaultFilmstripOpen />
    </div>
  );
}

const workItemOrder = [...toolItems, ...projectItems].map((item) => item.id);

const panelTransition = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 30,
  mass: 0.8,
};

const panelVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction * 14,
  }),
  center: {
    opacity: 1,
    y: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction * -14,
  }),
};

function WorkPanel({ id }: { id: string }) {
  const [borderSettings, setBorderSettings] = useState<BorderSettings>(defaultBorderSettings);
  const handleBorderSettingsChange = useCallback((settings: BorderSettings) => {
    setBorderSettings(settings);
  }, []);

  return (
    <>
      {id === 'critter' && <CritterDemo />}
      {id === 'states' && <StatesDemo />}
      {id === 'notebook' && <NotebookDemo />}
      {id === 'highlights' && (
        <HighlightsPanel activeStory={null} showBeforeState={false} />
      )}
      {id === 'suggestions' && (
        <SuggestionsPanel
          content={aiSuggestionsContent}
          activeStory={null}
          borderSettings={borderSettings}
          onBorderSettingsChange={handleBorderSettingsChange}
        />
      )}
      {id === 'multilingual' && (
        <TranslationManagementPanel initialComplete activeStory={null} showBeforeState={false} />
      )}
      {id === 'prototyping' && (
        <SandboxPanel activeStory={null} />
      )}
    </>
  );
}

function PanelRenderer({ activeId, activeIndex }: { activeId: string; activeIndex: number }) {
  const previousIndexRef = useRef(activeIndex);

  const direction =
    activeIndex === previousIndexRef.current
      ? 0
      : activeIndex > previousIndexRef.current
        ? 1
        : -1;

  useEffect(() => {
    previousIndexRef.current = activeIndex;
  }, [activeIndex]);

  return (
    <div className="relative w-full overflow-visible">
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.div
          key={activeId}
          custom={direction}
          variants={panelVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            ...panelTransition,
            opacity: { duration: 0.14, ease: 'easeOut' },
          }}
          className="w-full transform-gpu"
        >
          <WorkPanel id={activeId} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Panels are designed for the ~700px desktop column. On phones they render
// at that width and scale down to fit, so they stay intact and tappable.
const PANEL_DESIGN_WIDTH = 680;

function ScaledPreview({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const update = () => {
      const nextScale = Math.min(1, outer.clientWidth / PANEL_DESIGN_WIDTH);
      setScale(nextScale);
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
        style={{ width: PANEL_DESIGN_WIDTH, transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        {children}
      </div>
    </div>
  );
}

function GroupLabel({ children }: { children: string }) {
  return (
    <div className="type-label">
      {children}
    </div>
  );
}

// Mobile stand-in for the desktop hover: the item crossing the middle of the
// screen becomes active and its preview comes into focus.
// Each preview sits on a softly tinted backdrop in its project's colour.
const STAGE_TINTS: Record<string, string> = {
  critter: '#F2EADB',
  notebook: '#F4E4DA',
  states: '#EAE6F4',
  highlights: '#DFEFEE',
  suggestions: '#E4ECF6',
  multilingual: '#E9EEDF',
  prototyping: '#E8E9EE',
};

// Every panel sits on white so the tint never shows through transparent chrome.
// Panels made of loose parts (no card of their own) also get padding, so they
// read as one surface under the shadow.
const UNFRAMED_PANELS = new Set(['multilingual', 'suggestions', 'prototyping']);

function Stage({ id, className = '', children }: { id: string; className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      className={`relative rounded-2xl ${className}`}
      initial={false}
      animate={{ backgroundColor: STAGE_TINTS[id] ?? '#ECEDF0' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Soft top light so the tint reads as a lit surface, not a flat fill */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(120%_80%_at_50%_0%,rgba(255,255,255,0.65),transparent_65%)]"
      />
      <div
        className={`relative shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_16px_-8px_rgba(0,0,0,0.08),0_32px_64px_-24px_rgba(0,0,0,0.22)] ${
          UNFRAMED_PANELS.has(id) ? 'rounded-xl bg-white p-6' : 'rounded-lg bg-white'
        }`}
      >
        {children}
      </div>
    </motion.div>
  );
}

function MobileItem({
  item,
  isActive,
  onActivate,
}: {
  item: WorkItem;
  isActive: boolean;
  onActivate: (id: string) => void;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isCentered = useInView(itemRef, { margin: '-45% 0px -45% 0px' });
  // Mount each panel shortly before it scrolls into view, then keep it.
  const isNear = useInView(previewRef, { margin: '400px 0px', once: true });

  useEffect(() => {
    if (isCentered) onActivate(item.id);
  }, [isCentered, item.id, onActivate]);

  const text = (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <h3 className="type-h3">{item.title}</h3>
        {item.href && isExternal(item.href) && (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-secondary" aria-hidden="true">
            <path d="M5 3l8 0 0 8M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <p className="type-small">{item.description}</p>
    </div>
  );

  return (
    <div ref={itemRef} className="flex flex-col gap-4">
      {item.href ? (
        <Link href={item.href} {...linkTargetProps(item.href)}>
          {text}
        </Link>
      ) : (
        text
      )}
      <motion.div
        ref={previewRef}
        className="rounded-lg"
        animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1 : 0.97 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {isNear ? (
          <Stage id={item.id} className="p-4">
            <ScaledPreview>
              <WorkPanel id={item.id} />
            </ScaledPreview>
          </Stage>
        ) : (
          <div className="aspect-[4/3] rounded-lg bg-neutral-100" />
        )}
      </motion.div>
    </div>
  );
}

function MobileGroup({
  label,
  items,
  activeId,
  onActivate,
}: {
  label: string;
  items: WorkItem[];
  activeId: string | null;
  onActivate: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <GroupLabel>{label}</GroupLabel>
      <div className="flex flex-col gap-12">
        {items.map((item) => (
          <MobileItem
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            onActivate={onActivate}
          />
        ))}
      </div>
    </div>
  );
}

function DesktopGroup({
  label,
  items,
  activeId,
  onActivate,
}: {
  label: string;
  items: WorkItem[];
  activeId: string | null;
  onActivate: (id: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <div className="px-3 pb-2">
        <GroupLabel>{label}</GroupLabel>
      </div>
      {items.map((item) => {
        const isActive = activeId === item.id;
        const className = 'group text-left py-3 px-3 rounded-lg cursor-pointer transition-colors duration-200 relative block';
        const inner = (
          <>
            <AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="work-active-highlight"
                  className="absolute inset-0 rounded-lg bg-neutral-200/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    ...panelTransition,
                    opacity: { duration: 0.12, ease: 'easeOut' },
                  }}
                  aria-hidden="true"
                />
              )}
            </AnimatePresence>
            <div className="relative z-10 flex items-baseline gap-2">
              <h3 className="type-h3 !m-0">{item.title}</h3>
              {item.href && isExternal(item.href) && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  className={`text-secondary transition-all duration-200 ${
                    isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0'
                  }`}
                  aria-hidden="true"
                >
                  <path d="M5 3l8 0 0 8M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <p className="relative z-10 type-small mt-1">{item.description}</p>
          </>
        );
        return item.href ? (
          <Link
            key={item.id}
            href={item.href}
            {...linkTargetProps(item.href)}
            className={className}
            onMouseEnter={() => onActivate(item.id)}
            onFocus={() => onActivate(item.id)}
          >
            {inner}
          </Link>
        ) : (
          <button
            key={item.id}
            type="button"
            className={className}
            onMouseEnter={() => onActivate(item.id)}
            onFocus={() => onActivate(item.id)}
            onClick={() => onActivate(item.id)}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
}

export default function WorkSection() {
  const [activeId, setActiveId] = useState<string | null>(toolItems[0]?.id ?? null);
  const activeIndex = activeId ? workItemOrder.indexOf(activeId) : 0;
  const [mobileActiveId, setMobileActiveId] = useState<string | null>(toolItems[0]?.id ?? null);

  return (
    <section id="work" className="w-full pb-8 lg:pb-12 px-6 lg:px-10 2xl:px-16 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto pt-8">
        <SectionTitle disableScrollTrigger>Work</SectionTitle>
      </div>
      <motion.div className="max-w-[1200px] mx-auto mt-6" {...fadeInUp}>
        {/* Mobile: stacked list */}
        <div className="lg:hidden flex flex-col gap-16">
          <MobileGroup label="Tools" items={toolItems} activeId={mobileActiveId} onActivate={setMobileActiveId} />
          <MobileGroup label="Culture Amp" items={projectItems} activeId={mobileActiveId} onActivate={setMobileActiveId} />
        </div>

        {/* Desktop: text left, panel right */}
        <div
          className="hidden lg:grid lg:grid-cols-[400px_minmax(0,1fr)] xl:grid-cols-[440px_minmax(0,1fr)] gap-16 items-start"
        >
          {/* Left: text list */}
          <div className="flex flex-col gap-10 -mx-3">
            <DesktopGroup
              label="Tools"
              items={toolItems}
              activeId={activeId}
              onActivate={setActiveId}
            />
            <DesktopGroup
              label="Culture Amp"
              items={projectItems}
              activeId={activeId}
              onActivate={setActiveId}
            />
          </div>

          {/* Right: interactive panel */}
          <div className="sticky top-24">
            {activeId && (
              <Stage id={activeId} className="p-10">
                <PanelRenderer activeId={activeId} activeIndex={activeIndex} />
              </Stage>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
