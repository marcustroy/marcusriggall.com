'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { projects } from './projects';
import { ProjectPreview } from './Preview';
import { useProjectTransition } from './ProjectTransition';

const COLLAPSED = 92;
const EXPANDED = 440;

// Option: full-width colour bands. The one you point at opens to show its description and UI.
export default function WorkBands() {
  const { go } = useProjectTransition();
  const [open, setOpen] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {projects.map((project, index) => {
        const isOpen = open === index;
        return (
          <motion.div
            key={project.id}
            initial={false}
            animate={{ height: isOpen ? EXPANDED : COLLAPSED }}
            transition={{ type: 'spring', stiffness: 220, damping: 30 }}
            className="overflow-hidden rounded-3xl"
            style={{ backgroundColor: project.tint }}
            onMouseEnter={() => setOpen(index)}
          >
            <Link
              href={project.href}
              onClick={(event) => go(event, project)}
              onFocus={() => setOpen(index)}
              className="grid h-full grid-cols-1 gap-6 px-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] md:gap-10"
            >
              <div className="flex min-w-0 flex-col pt-[30px]">
                <div className="flex items-baseline gap-4">
                  <span className="type-small w-6 shrink-0 text-secondary">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="type-h3 min-w-0">{project.title}</h3>
                </div>
                <div
                  className={`pl-10 transition-opacity duration-300 ${isOpen ? 'opacity-100 delay-150' : 'opacity-0'}`}
                >
                  <p className="type-small mt-4 max-w-[420px]">{project.description}</p>
                  <p className="type-small mt-6 flex items-center gap-2 font-medium" style={{ color: project.accent }}>
                    View case study
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </p>
                </div>
              </div>
              <div
                className={`hidden origin-top-left pt-7 transition-all duration-500 md:block ${
                  isOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
              >
                <div className="overflow-hidden rounded-t-xl bg-white shadow-[0_18px_40px_-16px_rgba(0,0,0,0.25)]">
                  <ProjectPreview id={project.id} />
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
