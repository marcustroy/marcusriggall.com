'use client';

import Link from 'next/link';
import { projects } from './projects';
import { ProjectPreview } from './Preview';
import { useProjectTransition } from './ProjectTransition';

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Option: a 2 x 2 grid. Each card is a colour block with its UI rising from the bottom edge.
export default function WorkGrid() {
  const { go } = useProjectTransition();

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={project.href}
          onClick={(event) => go(event, project)}
          className="group relative flex h-[460px] flex-col overflow-hidden rounded-3xl p-7 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-1.5"
          style={{ backgroundColor: project.tint }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="type-small text-secondary">{project.period}</p>
              <h3 className="type-h3 mt-1">{project.title}</h3>
            </div>
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 group-hover:rotate-[-45deg]"
              aria-hidden="true"
            >
              <Arrow />
            </span>
          </div>
          <p className="type-small mt-3 max-w-[440px]">{project.description}</p>

          <div className="mt-auto origin-bottom translate-y-10 overflow-hidden rounded-xl bg-white shadow-[0_18px_40px_-16px_rgba(0,0,0,0.25)] transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:translate-y-3 group-hover:scale-[1.025]">
            <ProjectPreview id={project.id} />
          </div>
        </Link>
      ))}
    </div>
  );
}
