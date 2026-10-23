'use client';

import { ReactNode } from 'react';

interface ProblemStateLayoutProps {
  children: ReactNode;  // The ProblemStack content
  button?: ReactNode;   // The CTA button (optional - can be rendered externally)
}

export function ProblemStateLayout({ children, button }: ProblemStateLayoutProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[280px] lg:min-h-[320px] p-4 lg:p-6">
      {/* Stack container */}
      <div className={button ? "w-full mb-12" : "w-full"}>
        {children}
      </div>

      {/* Button - only rendered if provided */}
      {button && (
        <div className="flex justify-center">
          {button}
        </div>
      )}
    </div>
  );
}
