'use client';

import { useState } from 'react';
import Link from 'next/link';
import { projects } from './projects';
import { ProjectPreview } from './Preview';
import { useProjectTransition } from './ProjectTransition';

// One curve and duration for everything that moves, so a row opens as a single gesture.
const MOTION = 'duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]';

// Option: a typographic index. Pointing at a project colours only its own section, brings the title's
// accent in, and opens the description with the top of its UI, cut off at the bottom of the section.
export default function WorkIndex() {
  const { go } = useProjectTransition();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <ul className="flex flex-col" onMouseLeave={() => setHovered(null)}>
      {projects.map((project, index) => {
        const isActive = hovered === index;
        const dimmed = hovered !== null && !isActive;
        return (
          <li key={project.id} className="relative -mx-3 overflow-hidden md:-mx-8">
            {/* The section's colour sweeps in from the left */}
            <span
              aria-hidden="true"
              className={`absolute inset-0 origin-left transition-transform ${MOTION} ${
                isActive ? 'scale-x-100' : 'scale-x-0'
              }`}
              style={{ backgroundColor: project.tint }}
            />
            <Link
              href={project.href}
              onClick={(event) => go(event, project)}
              onMouseEnter={() => setHovered(index)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
              className="relative z-10 grid grid-cols-1 px-3 pt-6 md:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] md:gap-x-10 md:px-8 md:pt-7"
            >
              <div className="flex min-w-0 items-start gap-4 pb-6 md:gap-8 md:pb-7">
                <span className="type-small mt-2 w-7 shrink-0 text-secondary md:mt-4">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <span
                    className={`block text-[clamp(24px,3vw,36px)] font-medium leading-[1.04] tracking-tight transition-[opacity,color] ${MOTION} ${
                      dimmed ? 'opacity-25' : 'opacity-100'
                    }`}
                    style={{ color: isActive ? project.accent : undefined }}
                  >
                    {project.title}
                  </span>
                  <span className={`type-small mt-2 block text-secondary transition-opacity ${MOTION} ${dimmed ? 'opacity-40' : ''}`}>
                    {project.period}
                  </span>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] ${MOTION} ${
                      isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    } max-md:grid-rows-[1fr] max-md:opacity-100`}
                  >
                    <p className="type-small max-w-[420px] overflow-hidden pt-3">{project.description}</p>
                  </div>
                </div>
              </div>

              {/* The top of the project's UI, flush with the bottom edge of the section */}
              <div
                className={`hidden min-w-0 self-end transition-[grid-template-rows] md:grid ${MOTION} ${
                  isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div
                    className={`transition-[opacity,transform] ${MOTION} ${
                      isActive ? 'translate-y-0 opacity-100 delay-100' : 'translate-y-6 opacity-0'
                    }`}
                  >
                    <div className="aspect-[660/395] overflow-hidden rounded-t-xl border border-b-0 border-[var(--color-gray-400)] bg-white">
                      <ProjectPreview id={project.id} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
