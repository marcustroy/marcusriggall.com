'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RichTextEditor from '@/components/demos/RichTextEditor';
import { multilingualContent } from '@/components/vignettes/multilingual/content';
import { useReducedMotion } from '@/lib/useReducedMotion';
import type { DecisionStory } from '../shared/DecisionStories';

interface TranslationManagementPanelProps {
  className?: string;
  initialComplete?: boolean;
  activeStory?: DecisionStory | null;
  showBeforeState?: boolean;
}

type TranslationState = 'idle' | 'translating' | 'streaming' | 'complete';
type ImportState = 'idle' | 'importing' | 'success';

// Dimming style helper for story-driven highlighting
function getDimStyle(isDimmed: boolean) {
  return {
    opacity: isDimmed ? 0.4 : 1,
    transition: 'opacity 0.3s ease-in-out',
  };
}

// Before state: simplified manual form (no auto-translate, no XLSX)
function BeforeStatePanel() {
  return (
    <div className="w-full space-y-6">
      {/* Language dropdown only */}
      <div className="flex flex-col gap-1.5 w-full sm:w-auto">
        <label className="text-body-sm font-semibold text-primary">
          Translated language
        </label>
        <div className="bg-background-elevated border border-border rounded-[6px] h-9 px-sm py-xs flex items-center justify-between gap-2">
          <span className="text-body-sm text-primary whitespace-nowrap">
            Fran&ccedil;ais (French)
          </span>
          <svg className="w-4 h-4 text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Manual text fields */}
      <div className="space-y-6">
        {multilingualContent.translationFields.map((field) => (
          <div key={field.id} className="space-y-3">
            <label className="text-sm font-semibold text-primary">
              {field.label}
            </label>
            <div className="bg-background-elevated border border-border rounded-[6px] px-sm py-2.5 min-h-[60px]">
              <span className="text-body-sm text-tertiary">
                Enter translation manually...
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="inline-flex items-center px-3 py-1 bg-black/5 rounded-full text-xs text-primary">
                English (English US)
              </span>
              <p className="text-sm text-secondary">
                {field.sourceText}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TranslationManagementPanel({
  className = '',
  initialComplete = false,
  activeStory = null,
  showBeforeState = true,
}: TranslationManagementPanelProps) {
  const content = multilingualContent;
  const prefersReducedMotion = useReducedMotion();
  const [translationState, setTranslationState] = useState<TranslationState>(
    initialComplete ? 'complete' : 'idle'
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Word streaming state
  const [streamedTexts, setStreamedTexts] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(false);
  const streamTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Import state
  const [importState, setImportState] = useState<ImportState>('idle');

  // Language transition state
  const [isLanguageTransitioning, setIsLanguageTransitioning] = useState(false);

  // Story-driven highlighting
  const isScopeStory = activeStory?.highlightSection === 1;
  const isSpreadsheetStory = activeStory?.highlightSection === 2;
  const showBefore = isScopeStory && showBeforeState;

  // Don't auto-reset when initialComplete is true
  useEffect(() => {
    if (translationState === 'complete' && !initialComplete) {
      const timer = setTimeout(() => {
        setTranslationState('idle');
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [translationState, initialComplete]);

  // Clean up streaming timeout on unmount
  useEffect(() => {
    return () => {
      if (streamTimeoutRef.current) {
        clearTimeout(streamTimeoutRef.current);
      }
    };
  }, []);

  // Stream words one at a time for all fields in parallel
  const streamWords = useCallback((wordsArrays: string[][], index: number) => {
    const maxLength = Math.max(...wordsArrays.map(arr => arr.length));

    if (index >= maxLength) {
      setShowCursor(false);
      setTranslationState('complete');
      setIsAnimating(false);
      return;
    }

    setStreamedTexts(wordsArrays.map(words => {
      const clampedIndex = Math.min(index, words.length - 1);
      return words.slice(0, clampedIndex + 1).join(' ');
    }));

    streamTimeoutRef.current = setTimeout(() => {
      streamWords(wordsArrays, index + 1);
    }, 100);
  }, []);

  const handleTranslate = () => {
    if (isAnimating) return;

    const selectedLang = content.languages[selectedLanguage];
    setIsAnimating(true);
    setTranslationState('translating');
    setStreamedTexts(content.translationFields.map(() => ''));
    setShowCursor(true);

    setTimeout(() => {
      if (prefersReducedMotion) {
        setStreamedTexts(selectedLang.texts);
        setShowCursor(false);
        setTranslationState('complete');
        setIsAnimating(false);
      } else {
        setTranslationState('streaming');
        streamWords(selectedLang.words, 0);
      }
    }, 300);
  };

  const handleImport = () => {
    if (importState !== 'idle') return;

    setImportState('importing');

    setTimeout(() => {
      setImportState('success');
      setStreamedTexts(content.languages[selectedLanguage].texts);
      setTranslationState('complete');

      setTimeout(() => {
        setImportState('idle');
      }, 3000);
    }, 800);
  };

  const handleLanguageChange = (index: number) => {
    if (index === selectedLanguage) {
      setIsDropdownOpen(false);
      return;
    }

    setIsDropdownOpen(false);

    if (translationState === 'complete' || streamedTexts.length > 0) {
      setIsLanguageTransitioning(true);
      setTimeout(() => {
        setSelectedLanguage(index);
        setStreamedTexts(content.languages[index].texts);
        setTimeout(() => {
          setIsLanguageTransitioning(false);
        }, 200);
      }, 200);
    } else {
      setSelectedLanguage(index);
      if (!initialComplete) {
        setTranslationState('idle');
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showBefore ? (
        <motion.div
          key="before"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={className}
        >
          <BeforeStatePanel />
        </motion.div>
      ) : (
        <motion.div
          key="after"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={`w-full space-y-6 ${className}`}
        >
          {/* Language & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-12">
            {/* Language Dropdown */}
            <div
              className="flex flex-col gap-1.5 w-full sm:w-auto relative"
              style={getDimStyle(isSpreadsheetStory)}
            >
              <label className="text-body-sm font-semibold text-primary">
                Translated language
              </label>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-background-elevated border border-border rounded-[6px] h-9 px-sm py-xs flex items-center justify-between gap-2 hover:border-black/30 transition-colors"
              >
                <span className="text-body-sm text-primary whitespace-nowrap">
                  {content.languages[selectedLanguage].name}
                </span>
                <svg className="w-4 h-4 text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-1 bg-background-elevated border border-border rounded-[6px] shadow-lg z-10 min-w-full"
                  >
                    {content.languages.map((lang, index) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(index)}
                        className={`w-full px-sm py-sm text-left text-body-sm text-primary hover:bg-black/5 transition-colors whitespace-nowrap ${
                          index === selectedLanguage ? 'bg-black/5 font-semibold' : ''
                        } ${index === 0 ? 'rounded-t-[4px]' : ''} ${index === content.languages.length - 1 ? 'rounded-b-[4px]' : ''}`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auto translate button */}
            <div className="relative" style={getDimStyle(isSpreadsheetStory)}>
              <button
                onClick={handleTranslate}
                disabled={isAnimating}
                className="bg-[#0168b3] hover:bg-[#015a99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-body-sm h-9 px-md py-sm rounded-[6px] flex items-center gap-1.5 transition-colors"
              >
                {translationState === 'translating' || translationState === 'streaming' ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389 21.034 21.034 0 01-.554-.6 19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                  </svg>
                )}
                Auto translate
              </button>
            </div>

            {/* XLSX import button - highlighted when spreadsheet story active */}
            <div className="relative">
              <button
                onClick={handleImport}
                disabled={importState !== 'idle'}
                className={`font-medium text-body-sm h-9 px-sm py-sm rounded-[6px] flex items-center gap-1.5 transition-colors ${
                  importState === 'success'
                    ? 'text-green-600 bg-green-50'
                    : 'text-[#0168b3] hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {importState === 'importing' ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Importing...
                  </>
                ) : importState === 'success' ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    3 languages imported
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Import XLSX
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Translation Fields */}
          <div className="space-y-6" style={getDimStyle(isSpreadsheetStory)}>
            {content.translationFields.map((field, fieldIndex) => (
              <div key={field.id} className="space-y-3">
                <label className="text-sm font-semibold text-primary">
                  {field.label}
                </label>

                <motion.div
                  className="space-y-3"
                  animate={{
                    opacity: isLanguageTransitioning ? 0 : 1,
                  }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <RichTextEditor
                    content={(() => {
                      const fieldStreamedText = streamedTexts[fieldIndex] || '';
                      if (translationState === 'idle') return '';
                      if (translationState === 'translating') return showCursor ? '\u258c' : '';
                      if (translationState === 'streaming') {
                        return showCursor ? `${fieldStreamedText} \u258c` : fieldStreamedText;
                      }
                      return fieldStreamedText || content.languages[selectedLanguage].texts[fieldIndex];
                    })()}
                    placeholder="Translation will appear here..."
                  />

                  {/* Source Text Tag */}
                  <div className="flex items-start gap-2">
                    <span className="inline-flex items-center px-3 py-1 bg-black/5 rounded-full text-xs text-primary">
                      English (English US)
                    </span>
                    <p className="text-sm text-secondary">
                      {field.sourceText}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
