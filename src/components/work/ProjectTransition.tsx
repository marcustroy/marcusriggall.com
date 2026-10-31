'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface Destination {
  href: string;
  title: string;
  tint: string;
}

interface Overlay extends Destination {
  x: number;
  y: number;
}

const ProjectTransitionContext = createContext<{
  go: (event: React.MouseEvent, destination: Destination) => void;
}>({ go: () => {} });

export const useProjectTransition = () => useContext(ProjectTransitionContext);

const EASE = [0.7, 0, 0.2, 1] as const;

// Selecting a project floods the screen with its colour from the point that was clicked. The colour
// stays up while the case study loads, then fades away to reveal the page, whose top band is the same colour.
export function ProjectTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [leaving, setLeaving] = useState(false);
  const pushed = useRef(false);
  const startPath = useRef(pathname);

  const go = useCallback(
    (event: React.MouseEvent, destination: Destination) => {
      // Let the browser handle new-tab clicks and the like.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      if (reducedMotion) {
        router.push(destination.href);
        return;
      }
      pushed.current = false;
      startPath.current = pathname;
      setLeaving(false);
      setOverlay({ ...destination, x: event.clientX, y: event.clientY });
    },
    [pathname, reducedMotion, router]
  );

  // Once the new page is in place, let the colour go.
  useEffect(() => {
    if (!overlay || pathname === startPath.current) return;
    const timer = window.setTimeout(() => setLeaving(true), 450);
    return () => window.clearTimeout(timer);
  }, [overlay, pathname]);

  const radius = overlay
    ? Math.hypot(Math.max(overlay.x, window.innerWidth - overlay.x), Math.max(overlay.y, window.innerHeight - overlay.y))
    : 0;

  return (
    <ProjectTransitionContext.Provider value={{ go }}>
      {children}
      <AnimatePresence
        onExitComplete={() => {
          setOverlay(null);
          setLeaving(false);
        }}
      >
        {overlay && !leaving && (
          <motion.div
            key="project-transition"
            aria-hidden="true"
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ backgroundColor: overlay.tint }}
            initial={{ clipPath: `circle(0px at ${overlay.x}px ${overlay.y}px)` }}
            animate={{ clipPath: `circle(${radius}px at ${overlay.x}px ${overlay.y}px)` }}
            exit={{ opacity: 0 }}
            transition={{ clipPath: { duration: 0.8, ease: EASE }, opacity: { duration: 0.5, ease: 'easeOut' } }}
            onAnimationComplete={(definition) => {
              if (pushed.current || typeof definition !== 'object' || !('clipPath' in definition)) return;
              pushed.current = true;
              router.push(overlay.href);
            }}
          >
            <motion.p
              className="px-8 text-center text-[clamp(28px,5vw,64px)] font-medium leading-tight tracking-tight text-primary"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: 'easeOut' }}
            >
              {overlay.title}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </ProjectTransitionContext.Provider>
  );
}
