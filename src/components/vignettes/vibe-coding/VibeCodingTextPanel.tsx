'use client';

import { vibeCodingContent } from './content';

function ProjectName() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="size-1.5 rounded-full bg-neutral-400" />
      <span className="text-[13px] font-medium tracking-tight text-primary font-[family-name:var(--font-inter)]">
        {vibeCodingContent.projectName}
      </span>
    </div>
  );
}

export default function VibeCodingTextPanel() {
  const { headline, body, notes } = vibeCodingContent;

  return (
    <div className="flex flex-col">
      <ProjectName />

      {/* Headline */}
      <h3 className="type-h2 text-primary">{headline}</h3>

      {/* Body */}
      <p className="type-body text-primary mt-5">{body}</p>

      {/* Narrative notes as bullet points */}
      <ul className="flex flex-col gap-2 mt-6">
        {notes.map((note, index) => (
          <li key={index} className="flex items-start gap-2 py-1 px-2 -mx-2">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-neutral-400 mt-[7px]" />
            <span className="type-body text-primary">{note.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
