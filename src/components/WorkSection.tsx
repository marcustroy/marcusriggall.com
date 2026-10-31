'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import SectionTitle from './SectionTitle';
import { Stage, STAGE_PADDING } from './Stage';
import HeatmapPanel from './vignettes/heatmap-comparisons/HeatmapPanel';
import PcqPanel from './vignettes/pcq/PcqPanel';
import SandboxPanel from './vignettes/prototyping/SandboxPanel';
import SensitiveCommentsPanel from './vignettes/sensitive-comments/SensitiveCommentsPanel';

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

// The Tools group is hidden while this list is empty. Add items here (and a panel in WorkPanel) to bring it back.
const toolItems: WorkItem[] = [];

const projectItems: WorkItem[] = [
  {
    id: 'culture-quadrant',
    title: 'Performance Culture Quadrant',
    description: 'Connecting Engaging Culture and Performance Confidence to help customers understand their organisations culture and identify the path to Peak Performance',
    href: '/performance-culture-quadrant',
  },
  {
    id: 'heatmap-comparisons',
    title: 'Heatmap Survey Comparisons',
    description: 'Comparisons across surveys help customers understand how results change over time and across teams in a single view',
    href: '/heatmap-survey-comparisons',
  },
  {
    id: 'prototyping',
    title: 'Design Sandbox',
    description: 'Part of the small team of designers who maintained and improved an internal repository to make AI prototyping faster and easier for designers and product managers',
    href: '/design-sandbox',
  },
  {
    id: 'sensitive-comments',
    title: 'Sensitive Comments Management',
    description: 'Leveraging AI to identify sensitive comments to be reviewed and redacted',
    href: '/sensitive-comments-management',
  },
];

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
  return (
    <>
      {id === 'heatmap-comparisons' && <HeatmapPanel />}
      {id === 'culture-quadrant' && <PcqPanel />}
      {id === 'sensitive-comments' && <SensitiveCommentsPanel />}
      {id === 'prototyping' && <SandboxPanel activeStory={null} />}
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

// Panels are designed for a ~680px column. Narrower than that they render at that
// width and scale down to fit, so they stay intact and tappable. Wider than that
// they simply fill the available width instead of leaving empty space.
const PANEL_DESIGN_WIDTH = 680;

function ScaledPreview({ children }: { children: React.ReactNode }) {
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

function GroupLabel({ children }: { children: string }) {
  return (
    <div className="type-label">
      {children}
    </div>
  );
}

// Mobile stand-in for the desktop hover: the item crossing the middle of the
// screen becomes active and its preview comes into focus.

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
            {/* One highlight that slides between items. It never fades, so it can't disappear mid-move. */}
            {isActive && (
              <motion.div
                layoutId="work-active-highlight"
                className="absolute inset-0 rounded-lg bg-neutral-200/80"
                transition={panelTransition}
                aria-hidden="true"
              />
            )}
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
  const [activeId, setActiveId] = useState<string | null>((toolItems[0] ?? projectItems[0])?.id ?? null);
  const activeIndex = activeId ? workItemOrder.indexOf(activeId) : 0;
  const [mobileActiveId, setMobileActiveId] = useState<string | null>((toolItems[0] ?? projectItems[0])?.id ?? null);

  return (
    <section id="work" className="w-full pb-8 lg:pb-12 px-6 lg:px-10 2xl:px-16 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto pt-8">
        <SectionTitle disableScrollTrigger>Work</SectionTitle>
      </div>
      <motion.div className="max-w-[1200px] mx-auto mt-6" {...fadeInUp}>
        {/* Mobile: stacked list */}
        <div className="lg:hidden flex flex-col gap-16">
          {toolItems.length > 0 && (
            <MobileGroup label="Tools" items={toolItems} activeId={mobileActiveId} onActivate={setMobileActiveId} />
          )}
          <MobileGroup label="Culture Amp" items={projectItems} activeId={mobileActiveId} onActivate={setMobileActiveId} />
        </div>

        {/* Desktop: text left, panel right */}
        <div
          className="hidden lg:grid lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)] gap-12 items-start"
        >
          {/* Left: text list */}
          <div className="flex flex-col gap-10 -mx-3">
            {toolItems.length > 0 && (
              <DesktopGroup
                label="Tools"
                items={toolItems}
                activeId={activeId}
                onActivate={setActiveId}
              />
            )}
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
              <Stage id={activeId} className={STAGE_PADDING}>
                <PanelRenderer activeId={activeId} activeIndex={activeIndex} />
              </Stage>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
