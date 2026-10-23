'use client'

import SiteHeaderBar from '@/components/SiteHeaderBar'
import Footer from '@/components/Footer'
import { useState, useEffect } from 'react'
import { Check, Copy } from 'lucide-react'
import BrowserFrame from './BrowserFrame'
import DemoApp from './demo/DemoApp'
import AgentOverlay from './demo/AgentOverlay'
import { useDemoStore } from './demo/demoStore'
import { promptText } from './prompt'

const installCommand = 'npx skills add idamadam/skills --skill states'

export default function StateExplorerPage({
  highlightedPrompt,
  highlightedCode,
  highlightedInstallCommand,
}: {
  highlightedPrompt: string
  highlightedCode: string
  highlightedInstallCommand: string
}) {
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [copiedInstallCommand, setCopiedInstallCommand] = useState(false)
  const [hasEverCopied, setHasEverCopied] = useState(false)
  const autoPlay = useDemoStore((s) => s.autoPlay)

  useEffect(() => {
    const timer = setTimeout(() => autoPlay(), 1000)
    return () => clearTimeout(timer)
  }, [autoPlay])

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(promptText)
    setCopiedPrompt(true)
    setHasEverCopied(true)
    setTimeout(() => setCopiedPrompt(false), 2000)
  }

  const handleCopyInstallCommand = async () => {
    await navigator.clipboard.writeText(installCommand)
    setCopiedInstallCommand(true)
    setTimeout(() => setCopiedInstallCommand(false), 2000)
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="border-b border-border/50 px-6 lg:px-10 2xl:px-16">
        <SiteHeaderBar />
      </header>
      <section className="relative py-16 lg:py-24 px-6 lg:px-10 2xl:px-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-[minmax(0,460px)_1fr] gap-10 lg:gap-14 items-start">
            {/* Left: copy + install */}
            <div className="lg:sticky lg:top-20 min-w-0">
              <h1 className="type-page-heading">
                Reach any prototype state in one click
              </h1>

              <p className="type-lede mt-4 max-w-[420px]">
                A prompt that figures out which states your prototype has, then builds you a panel to flip between them. Works with Claude Code, Cursor, Codex, Figma Make, or any other coding agent.
              </p>

              <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 relative">
                <button
                  onClick={handleCopyPrompt}
                  className="absolute top-1 right-1 z-10 inline-flex items-center gap-1 px-3 py-2 rounded-md text-xs font-medium text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors cursor-pointer"
                >
                  {copiedPrompt ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedPrompt ? 'Copied!' : 'Copy prompt'}</span>
                </button>
                <div
                  className="max-h-[200px] overflow-y-auto overflow-x-hidden px-4 py-3 text-[13px] leading-5"
                  style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
                  dangerouslySetInnerHTML={{ __html: highlightedPrompt }}
                />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 rounded-b-xl bg-gradient-to-t from-neutral-50 to-transparent" />
              </div>
              <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-950 relative">
                <button
                  onClick={handleCopyInstallCommand}
                  aria-label={copiedInstallCommand ? 'Command copied' : 'Copy install command'}
                  title={copiedInstallCommand ? 'Copied' : 'Copy command'}
                  className="absolute top-2 right-2 z-10 inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  {copiedInstallCommand ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <p className="px-4 pt-3 pb-1 text-xs text-neutral-300">
                  Also available as a skill
                </p>
                <div
                  className="px-4 pb-3 text-[13px] leading-5 overflow-x-auto text-neutral-100"
                  style={{ overflowWrap: 'break-word', wordBreak: 'break-all' }}
                  dangerouslySetInnerHTML={{ __html: highlightedInstallCommand }}
                />
              </div>
              <p
                className={`pt-4 text-sm transition-all duration-500 delay-400 ${
                  hasEverCopied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'
                }`}
              >
                Did it work?{' '}
                <a
                  href="https://www.linkedin.com/in/idamadam/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#0A66C2' }}
                  className="underline hover:opacity-70 transition-opacity"
                >
                  DM me on LinkedIn
                </a>
              </p>

            </div>

            {/* Right: interactive demo */}
            <div className="demo-theme min-w-0">
              <div className="relative overflow-hidden rounded-2xl">
                <BrowserFrame url="localhost:5174">
                  <DemoApp highlightedCode={highlightedCode} />
                </BrowserFrame>
                <AgentOverlay />
              </div>
              <p className="type-fine pt-4 text-center">
                Click any preset to change the prototype.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
