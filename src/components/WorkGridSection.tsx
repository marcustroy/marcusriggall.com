'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import HighlightsPanel from './vignettes/ai-highlights/HighlightsPanel';
import SuggestionsPanel from './vignettes/ai-suggestions/SuggestionsPanel';
import TranslationManagementPanel from './vignettes/multilingual/TranslationManagementPanel';
import SandboxPanel from './vignettes/prototyping/SandboxPanel';
import { aiSuggestionsContent, defaultBorderSettings } from './vignettes/ai-suggestions/content';
import type { BorderSettings } from './vignettes/ai-suggestions/content';

function WorkCard({ title, category, children }: { title: string; category: string; children: React.ReactNode }) {
  return (
    <motion.article
      className="rounded-2xl border border-border/60 bg-white overflow-hidden flex flex-col"
      {...fadeInUp}
    >
      <div className="p-5 pb-3">
        <span className="type-label text-tertiary">{category}</span>
        <h3 className="text-[1rem] font-medium text-primary tracking-[-0.01em] mt-1">{title}</h3>
      </div>
      <div className="px-16 pb-16 flex-1">
        <div className="relative w-full overflow-hidden rounded-lg">
          {children}
        </div>
      </div>
    </motion.article>
  );
}

function HighlightsCard() {
  return (
    <WorkCard title="Highlights and Opportunities" category="AI & Intelligence">
      <HighlightsPanel activeStory={null} showBeforeState={false} />
    </WorkCard>
  );
}

function SuggestionsCard() {
  const [borderSettings, setBorderSettings] = useState<BorderSettings>(defaultBorderSettings);
  const handleBorderSettingsChange = useCallback((settings: BorderSettings) => {
    setBorderSettings(settings);
  }, []);

  return (
    <WorkCard title="AI Suggest Improvements" category="AI & Intelligence">
      <SuggestionsPanel
        content={aiSuggestionsContent}
        activeStory={null}
        borderSettings={borderSettings}
        onBorderSettingsChange={handleBorderSettingsChange}
      />
    </WorkCard>
  );
}

function MultilingualCard() {
  return (
    <WorkCard title="Multilingual Performance Cycles" category="Platform & Systems">
      <TranslationManagementPanel initialComplete activeStory={null} showBeforeState={false} />
    </WorkCard>
  );
}

function PrototypingCard() {
  return (
    <WorkCard title="Design Sandbox" category="Platform & Systems">
      <SandboxPanel activeStory={null} />
    </WorkCard>
  );
}

export default function WorkGridSection() {
  return (
    <div className="max-w-[1408px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
      <HighlightsCard />
      <SuggestionsCard />
      <MultilingualCard />
      <PrototypingCard />
    </div>
  );
}
