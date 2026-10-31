'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PcqPanel, { type PcqStage } from '../PcqPanel';

// The home page's interactive Performance Culture Quadrant, revealed one step at a time.
// Steps start at PcqPanel stage 2 (overall and comparison points), so the stage is the step index plus 2.
const steps: { caption: string }[] = [
  {
    caption:
      'The PCQ maps two key factors into culture states backed by Culture Amp People Science. Organisations position themselves on the chart based on their overall results and compare to benchmarks.',
  },
  { caption: 'Adding demographics helps identify key groups in need of support' },
  { caption: 'Coach helps leaders explore survey themes, understand their results and decide on the next best action' },
];

const LAST_STEP = steps.length - 1;

function Stepper({ step, onStep }: { step: number; onStep: (s: number) => void }) {
  return (
    <div
      role="group"
      aria-label="Walkthrough steps"
      className="relative mx-auto flex h-[44px] w-full max-w-[400px] items-center justify-between rounded-full bg-white px-[14px]"
    >
      {steps.map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Step ${i + 1} of ${steps.length}`}
          aria-current={i === step ? 'step' : undefined}
          onClick={() => onStep(i)}
          className="relative z-10 flex h-6 w-6 cursor-pointer items-center justify-center"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gray-400)]" />
        </button>
      ))}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute z-20 top-1/2 h-[26px] w-[26px] -translate-y-1/2 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
        initial={false}
        // Dots are 24px buttons inset 14px, so their centres run from 26px to 26px short of the right edge.
        animate={{ left: `calc(13px + (100% - 52px) * ${step / LAST_STEP})` }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      />
    </div>
  );
}

export default function PcqWalkthrough() {
  const [step, setStep] = useState(0);

  return (
    <div className="kaizen-scope relative flex flex-col gap-5">
      <div className="mb-6 overflow-hidden rounded-[var(--border-solid-border-radius,7px)] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_16px_-8px_rgba(0,0,0,0.08),0_32px_64px_-24px_rgba(0,0,0,0.22)]">
        <PcqPanel stage={(step + 2) as PcqStage} />
      </div>
      <p aria-live="polite" className="mx-auto max-w-[460px] text-center text-[15px] leading-snug text-[#1d1d1f]">
        {steps[step].caption}
      </p>
      <Stepper step={step} onStep={setStep} />
    </div>
  );
}
