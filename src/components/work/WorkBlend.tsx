'use client';

import { useState } from 'react';
import Link from 'next/link';
import { projects } from './projects';
import { ProjectPreview } from './Preview';
import { useProjectTransition } from './ProjectTransition';

// Option: Index typography and Bands colour together. Big titles in a list; pointing at one wipes its
// colour across the row, then opens it to show the description and UI. One row stays open at a time.
export default function WorkBlend() {
  const { go } = useProjectTransition();
  const [open, setOpen] = useState(0);

  return (
    <div className="flex flex-col">
      {projects.map((project, index) => {
        const isOpen = open === index;
        const dimmed = !isOpen;
        return (
          <div key={project.id} className="relative -mx-3 overflow-hidden md:-mx-8" onMouseEnter={() => setOpen(index)}>
            {/* The colour sweeps in from the left when the row opens, and back out when another one does */}
            <span
              aria-hidden="true"
              className={`absolute inset-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.2,1)] ${
                isOpen ? 'scale-x-100' : 'scale-x-0'
              }`}
              style={{ backgroundColor: project.tint }}
            />
            <Link
              href={project.href}
              onClick={(event) => go(event, project)}
              onFocus={() => setOpen(index)}
              className="relative z-10 block px-3 md:px-8"
            >
              <div className="flex items-baseline gap-4 py-6 md:gap-8 md:py-8">
                <span className="type-small w-7 shrink-0 text-secondary">{String(index + 1).padStart(2, '0')}</span>
                <span
                  className={`min-w-0 text-[clamp(26px,4.4vw,64px)] font-medium leading-[1.02] tracking-tight transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                    dimmed ? 'opacity-30' : 'opacity-100'
                  }`}
                  style={{ color: isOpen ? project.accent : undefined }}
                >
                  {project.title}
                </span>
                <span className="type-small ml-auto hidden shrink-0 text-secondary md:block">{project.period}</span>
              </div>

              {/* Opens once the colour has arrived */}
              <div
                className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    className={`grid gap-6 pb-0 pl-9 transition-opacity duration-500 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-10 md:pl-[60px] ${
                      isOpen ? 'opacity-100 delay-300' : 'opacity-0'
                    }`}
                  >
                    <div className="pb-8">
                      <p className="type-small max-w-[420px]">{project.description}</p>
                      <p className="type-small mt-6 flex items-center gap-2 font-medium" style={{ color: project.accent }}>
                        View case study
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </p>
                    </div>
                    <div className="hidden md:block">
                      {/* Every project shows the same height of its UI (the Design Sandbox's whole UI, with its padding), so open rows match */}
                      <div className="aspect-[660/395] overflow-hidden rounded-t-xl border border-b-0 border-[var(--color-gray-400)] bg-white">
                        <ProjectPreview id={project.id} showcase />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
