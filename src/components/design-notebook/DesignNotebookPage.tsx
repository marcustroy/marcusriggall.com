'use client'

import { useState } from 'react'
import SiteHeaderBar from '@/components/SiteHeaderBar'
import Footer from '@/components/Footer'
import { Check, Copy } from 'lucide-react'

function ClaudeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className} fill="currentColor">
      <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
    </svg>
  )
}
import NotebookApp from '@/design-notebooks/_harness/NotebookApp'
import '@/design-notebooks/_harness/notebook.css'
import { ITERATIONS, PROJECT } from './iterations'

function CopyCommand({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-950 pl-4 pr-2 py-2">
      <code className="flex-1 min-w-0 overflow-x-auto whitespace-nowrap type-code text-neutral-100">
        <span className="text-neutral-500 select-none">$ </span>
        {text}
      </code>
      <button
        onClick={handleCopy}
        aria-label={copied ? 'Command copied' : 'Copy install command'}
        className="flex-shrink-0 p-2 -my-1 rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 active:scale-95 transition-colors cursor-pointer"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  )
}

function InstallBlock() {
  return (
    <div className="space-y-6">
      <div>
        <a
          href="https://github.com/idamadam/skills/releases/download/v0.3.2/design-notebook-v0.3.2.skill"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-lg text-base font-medium transition-all bg-[hsl(15_54.2%_51.2%)] hover:bg-[hsl(15_63.1%_59.6%)] hover:shadow-lg hover:shadow-[hsl(15_54.2%_51.2%)]/25 active:scale-[0.98]"
          style={{ color: '#fff' }}
        >
          <ClaudeIcon className="w-4 h-4" />
          Download skill for Claude.ai
        </a>
        <p className="type-fine mt-3">
          Upload to{' '}
          <a
            href="https://claude.ai/customize/skills"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            Claude.ai
          </a>
          , then run <code className="type-code">/design-notebook</code> ·{' '}
          <a
            href="https://github.com/idamadam/skills/tree/main/plugins/design-notebook/skills/design-notebook"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            View source
          </a>
        </p>
      </div>
      <div>
        <p className="type-small mb-2">Or install for Claude Code, Codex, Cursor &amp; more</p>
        <CopyCommand text="npx skills add idamadam/skills --skill design-notebook" />
      </div>
    </div>
  )
}

export default function DesignNotebookPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="border-b border-border/50 px-6 lg:px-10 2xl:px-16">
        <SiteHeaderBar />
      </header>

      {/* Hero */}
      <section className="py-16 lg:py-24 px-6 lg:px-10 2xl:px-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_440px] gap-10 lg:gap-16 items-end">
            <div className="min-w-0">
              <p className="type-fine mb-4 flex items-center gap-1">
                <span>Design skill by</span>
                <a href="https://www.linkedin.com/in/marcusriggall" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline hover:text-primary transition-colors">
                  Marcus Riggall
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                  </svg>
                </a>
              </p>
              <h1 className="type-page-heading max-w-[620px]">
                You explored 20 directions. Can you explain how you got there?
              </h1>
              <p className="type-lede mt-4 max-w-[520px]">
                Design Notebook is a skill for Claude that tracks your design iterations as a living timeline. Diverge into multiple directions, converge on the best parts, and always know how you got there.
              </p>
            </div>
            <div className="min-w-0">
              <InstallBlock />
            </div>
          </div>

          {/* Live notebook, full width */}
          <div className="mt-14 lg:mt-20">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-12px_rgba(0,0,0,0.12)] [&>div]:!min-h-0">
              <NotebookApp iterations={ITERATIONS} project={PROJECT} defaultFilmstripOpen />
            </div>
            <p className="type-fine pt-4 text-center">
              Click the timeline to see how this design evolved.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
