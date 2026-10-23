'use client'

import { useState, useEffect, useRef } from 'react'
import { useDemoStore } from './demoStore'
import type { Version, GenerationStatus, ViewMode } from './demoStore'
import DemoPanel from './DemoPanel'
import {
  Sparkles,
  Plus,
  SlidersHorizontal,
  Send,
  FileCode,
  BoxIcon,
} from 'lucide-react'

/* -- Chat messages -- */
const allMessages = [
  { role: 'user' as const, text: 'Build a pricing card for our Basic plan' },
  { role: 'ai' as const, text: "Here's a clean pricing card with features and a CTA.", version: 1 as Version },
  { role: 'user' as const, text: 'Add Pro and Team tiers, mark Pro as most popular' },
  { role: 'ai' as const, text: 'Added two more tiers! Pro is highlighted with a Popular badge.', version: 2 as Version },
]

/* -- Preview: v1 -- */
function PreviewV1() {
  return (
    <div className="flex items-center justify-center h-full">
      <div
        className="w-[120px] rounded-lg p-3 text-center"
        style={{ backgroundColor: 'var(--demo-card)', border: '1px solid var(--demo-border)' }}
      >
        <p className="text-demo-xs font-medium tracking-wide uppercase" style={{ color: 'var(--demo-text-2)' }}>Basic</p>
        <p className="text-demo-lg font-bold mt-1" style={{ color: 'var(--demo-text)' }}>$9<span className="text-demo-xs font-normal" style={{ color: 'var(--demo-text-2)' }}>/mo</span></p>
        <div className="mt-2 pt-2 space-y-0.5" style={{ borderTop: '1px solid var(--demo-border)' }}>
          <p className="text-demo-xxs" style={{ color: 'var(--demo-text-2)' }}>5 projects</p>
          <p className="text-demo-xxs" style={{ color: 'var(--demo-text-2)' }}>1 GB storage</p>
        </div>
        <button
          className="mt-2.5 w-full py-1 rounded text-demo-xs font-medium"
          style={{ backgroundColor: 'var(--demo-bg)', color: 'var(--demo-text)', border: '1px solid var(--demo-border)' }}
        >
          Get started
        </button>
      </div>
    </div>
  )
}

/* -- Preview: v2 -- */
function PreviewV2() {
  const cards = [
    { name: 'Basic', price: '$9', popular: false, features: ['5 projects', '1 GB'] },
    { name: 'Pro', price: '$29', popular: true, features: ['Unlimited', '10 GB'] },
    { name: 'Team', price: '$79', popular: false, features: ['Everything+', '50 GB'] },
  ]
  return (
    <div className="flex items-center justify-center h-full px-3 md:px-6 pt-3 md:py-4 gap-2 md:gap-3">
      {cards.map((c) => (
        <div
          key={c.name}
          className="flex-1 min-w-0 rounded-lg p-2 md:p-2.5 text-center relative"
          style={{
            backgroundColor: c.popular ? 'var(--demo-text)' : 'var(--demo-card)',
            border: c.popular ? 'none' : '1px solid var(--demo-border)',
          }}
        >
          {c.popular && (
            <span
              className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-px rounded-full font-semibold whitespace-nowrap"
              style={{ fontSize: '7px', lineHeight: '12px', backgroundColor: 'var(--demo-card)', color: 'var(--demo-text)' }}
            >
              Popular
            </span>
          )}
          <p className="text-demo-xs font-medium tracking-wide uppercase" style={{ color: c.popular ? 'rgba(255,255,255,0.6)' : 'var(--demo-text-2)' }}>{c.name}</p>
          <p className="text-demo-lg font-bold mt-1" style={{ color: c.popular ? '#fff' : 'var(--demo-text)' }}>{c.price}<span className="text-demo-xs font-normal" style={{ color: c.popular ? 'rgba(255,255,255,0.5)' : 'var(--demo-text-2)' }}>/mo</span></p>
          <div className="mt-1.5 pt-1.5 md:mt-2 md:pt-2 space-y-0.5" style={{ borderTop: c.popular ? '1px solid rgba(255,255,255,0.15)' : '1px solid var(--demo-border)' }}>
            {c.features.map((f) => (
              <p key={f} className="text-demo-xxs" style={{ color: c.popular ? 'rgba(255,255,255,0.6)' : 'var(--demo-text-2)' }}>{f}</p>
            ))}
          </div>
          <button
            className="mt-2 md:mt-2.5 w-full py-0.5 md:py-1 rounded text-demo-xs font-medium"
            style={
              c.popular
                ? { backgroundColor: '#fff', color: 'var(--demo-text)' }
                : { backgroundColor: 'var(--demo-bg)', color: 'var(--demo-text)', border: '1px solid var(--demo-border)' }
            }
          >
            {c.popular ? 'Get Pro' : 'Choose'}
          </button>
        </div>
      ))}
    </div>
  )
}

/* -- Skeleton -- */
function SkeletonPreview() {
  return (
    <div className="flex items-center justify-center h-full px-3 md:px-6 md:py-4 gap-2 md:gap-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex-1 min-w-0 rounded-lg p-2 md:p-2.5 space-y-1.5 md:space-y-2"
          style={{ backgroundColor: 'var(--demo-card)', border: '1px solid var(--demo-border)' }}
        >
          <div className="h-2.5 w-10 mx-auto rounded bg-neutral-200 animate-pulse" />
          <div className="h-3.5 w-8 mx-auto rounded bg-neutral-200 animate-pulse" />
          <div className="space-y-1">
            <div className="h-1.5 w-full rounded bg-neutral-100 animate-pulse" />
            <div className="h-1.5 w-3/4 mx-auto rounded bg-neutral-100 animate-pulse" />
          </div>
          <div className="h-3 w-full rounded bg-neutral-200 animate-pulse" />
        </div>
      ))}
    </div>
  )
}

/* -- Code view -- */
function CodeView({ highlightedCode }: { highlightedCode: string }) {
  return (
    <div
      className="h-full m-1.5 rounded p-2 overflow-auto font-mono text-demo-micro leading-[1.7]"
      style={{ backgroundColor: '#24292e' }}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  )
}

/* -- Empty state -- */
function EmptyPreview() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-1">
      <BoxIcon className="w-4 h-4" style={{ color: 'var(--demo-text-2)' }} />
      <p className="text-demo-xxs" style={{ color: 'var(--demo-text-2)' }}>Component appears here</p>
    </div>
  )
}

/* -- Error state -- */
function ErrorPreview() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-1 px-6 text-center">
      <div className="w-4 h-4 rounded-full flex items-center justify-center bg-red-50">
        <span className="text-demo-xxs font-bold text-red-500">!</span>
      </div>
      <p className="text-demo-xs font-semibold" style={{ color: 'var(--demo-text)' }}>Error</p>
      <p className="text-demo-micro" style={{ color: 'var(--demo-text-2)' }}>Auto-fix in progress…</p>
    </div>
  )
}

/* -- Content resolver -- */
const previewByVersion: Record<Version, () => React.JSX.Element> = { 1: PreviewV1, 2: PreviewV2 }

function ContentArea({ status, viewMode, version, highlightedCode }: { status: GenerationStatus; viewMode: ViewMode; version: Version; highlightedCode: string }) {
  if (status === 'idle') return <EmptyPreview />
  if (status === 'generating') return <SkeletonPreview />
  if (status === 'error') return <ErrorPreview />
  if (viewMode === 'code') return <CodeView highlightedCode={highlightedCode} />
  const Preview = previewByVersion[version]
  return <Preview />
}

/* -- Main -- */
export default function DemoApp({ highlightedCode }: { highlightedCode: string }) {
  const [explorerOpen, setExplorerOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [userMessage, setUserMessage] = useState<string | null>(null)
  const { generationStatus, version, viewMode, messageCount, agentPhase } = useDemoStore()
  const setGenerating = useDemoStore((s) => s.setGenerating)
  const prevPhase = useRef(agentPhase)
  const messagesRef = useRef<HTMLDivElement>(null)
  const messageRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  useEffect(() => {
    if (prevPhase.current === 'running' && agentPhase === 'done') {
      const t1 = setTimeout(() => setExplorerOpen(true), 400)
      const t2 = setTimeout(() => useDemoStore.getState().applyPreset('past-version'), 900)
      prevPhase.current = agentPhase
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
    prevPhase.current = agentPhase
  }, [agentPhase])

  useEffect(() => {
    const el = messagesRef.current
    if (!el) return
    // Generating/error states: always scroll to bottom
    if (generationStatus === 'generating' || generationStatus === 'error') {
      el.scrollTop = el.scrollHeight
      return
    }
    // When version changes, scroll the relevant AI message into view
    const msgEl = messageRefs.current.get(version)
    if (msgEl) {
      // Keep scrolling constrained to the chat panel. `scrollIntoView` can move the page on mobile.
      const containerRect = el.getBoundingClientRect()
      const messageRect = msgEl.getBoundingClientRect()
      const topDelta = messageRect.top - containerRect.top
      const targetTop = el.scrollTop + topDelta - 8
      el.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
      return
    }
    // Fallback: scroll to bottom for new messages
    el.scrollTop = el.scrollHeight
  }, [messageCount, generationStatus, userMessage, version])

  // Clear custom message when a preset is applied
  const activePreset = useDemoStore((s) => s.activePreset)
  useEffect(() => {
    if (activePreset) setUserMessage(null)
  }, [activePreset])

  const setVersion = useDemoStore((s) => s.setVersion)

  const handleSubmit = () => {
    const text = inputValue.trim()
    if (!text) return
    setUserMessage(text)
    setInputValue('')
    setGenerating()
  }
  const visibleMessages = allMessages.slice(0, messageCount)

  return (
    <div className="demo-container flex flex-col md:flex-row md:h-[520px]" style={{ backgroundColor: 'var(--demo-bg)' }}>
      {/* -- Left: Chat panel -- */}
      <div
        className="w-full md:w-[200px] md:flex-shrink-0 flex flex-col border-b md:border-b-0 md:border-r max-h-[280px] md:max-h-none"
        style={{ backgroundColor: 'var(--demo-card)', borderColor: 'var(--demo-border)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-2.5 py-2 border-b"
          style={{ borderColor: 'var(--demo-border)' }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-black flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-demo-sm font-semibold" style={{ color: 'var(--demo-text)' }}>VibeUI</span>
          </div>
          <div className="flex items-center gap-1">
            {agentPhase === 'done' && (
              <button
                onClick={() => setExplorerOpen((o) => !o)}
                className={`p-1 rounded transition-colors cursor-pointer ${!explorerOpen ? 'pulse-once' : ''}`}
                style={{
                  backgroundColor: explorerOpen ? 'var(--demo-bg)' : undefined,
                  color: explorerOpen ? 'var(--demo-text)' : 'var(--demo-text-2)',
                }}
              >
                <SlidersHorizontal className="w-3 h-3" />
              </button>
            )}
            <button
              className="p-1 rounded transition-colors cursor-pointer"
              style={{ color: 'var(--demo-text-2)' }}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={messagesRef} className="flex-1 overflow-auto px-2.5 py-2 space-y-2">
          {visibleMessages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-demo-xxs text-center" style={{ color: 'var(--demo-text-2)' }}>Start a conversation...</p>
            </div>
          )}
          {visibleMessages.map((msg, i) => {
            const isAi = msg.role === 'ai'
            const msgVersion = isAi ? (msg as typeof allMessages[1]).version : undefined
            const isActive = isAi && msgVersion === version

            return (
              <div
                key={i}
                ref={msgVersion ? (el) => {
                  if (el) messageRefs.current.set(msgVersion, el)
                  else messageRefs.current.delete(msgVersion!)
                } : undefined}
                className="rounded-md px-1.5 py-1 -mx-1.5"
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <p className="text-demo-micro font-semibold" style={{ color: isAi ? 'var(--demo-text-2)' : 'var(--demo-text)' }}>
                    {isAi ? 'VibeUI' : 'You'}
                  </p>
                </div>
                <p className="text-demo-xxs leading-[1.4]" style={{ color: 'var(--demo-text)' }}>
                  {msg.text}
                </p>
                {isAi && msgVersion && (
                  <div
                    className="mt-1 flex items-center gap-1.5 rounded px-1.5 py-1 cursor-pointer transition-colors"
                    style={{
                      border: isActive ? '1.5px solid var(--demo-text)' : '1px solid var(--demo-border)',
                      backgroundColor: isActive ? 'var(--demo-bg)' : 'var(--demo-card)',
                    }}
                    onClick={() => setVersion(msgVersion)}
                  >
                    <FileCode className="w-2.5 h-2.5 flex-shrink-0" style={{ color: isActive ? 'var(--demo-text)' : 'var(--demo-text-2)' }} />
                    <span className="text-demo-micro font-semibold leading-none" style={{ color: 'var(--demo-text)' }}>v{msgVersion}</span>
                  </div>
                )}
              </div>
            )
          })}
          {userMessage && (
            <div className="rounded-md px-1.5 py-1 -mx-1.5">
              <p className="text-demo-micro font-semibold mb-0.5" style={{ color: 'var(--demo-text)' }}>You</p>
              <p className="text-demo-xxs leading-[1.4]" style={{ color: 'var(--demo-text)' }}>{userMessage}</p>
            </div>
          )}
          {generationStatus === 'generating' && (
            <div className="rounded-md px-1.5 py-1 -mx-1.5">
              <p className="text-demo-micro font-semibold mb-0.5" style={{ color: 'var(--demo-text-2)' }}>VibeUI</p>
              <p className="text-demo-xxs font-medium demo-shimmer">Generating…</p>
            </div>
          )}
          {generationStatus === 'error' && (
            <>
              <div className="rounded-md px-1.5 py-1 -mx-1.5">
                <p className="text-demo-micro font-semibold mb-0.5" style={{ color: 'var(--demo-text-2)' }}>VibeUI</p>
                <p className="text-demo-xxs leading-[1.4] text-red-400">Error, attempting to fix.</p>
              </div>
              <div className="rounded-md px-1.5 py-1 -mx-1.5">
                <p className="text-demo-micro font-semibold mb-0.5" style={{ color: 'var(--demo-text-2)' }}>VibeUI</p>
                <p className="text-demo-xxs font-medium demo-shimmer">Auto-fixing…</p>
              </div>
            </>
          )}
        </div>

        {/* Input */}
        <div
          className="px-2 py-2 border-t"
          style={{ borderColor: 'var(--demo-border)' }}
        >
          <form
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg"
            style={{ backgroundColor: 'var(--demo-bg)', border: '1px solid var(--demo-border)' }}
            onSubmit={(e) => { e.preventDefault(); handleSubmit() }}
          >
            <input
              className="flex-1 min-w-0 bg-transparent outline-none text-demo-xxs"
              style={{ color: 'var(--demo-text)' }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder=""
            />
            <button
              type="submit"
              className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
              style={{ backgroundColor: 'var(--demo-text)', color: 'var(--demo-card)' }}
            >
              <Send className="w-2 h-2" />
            </button>
          </form>
        </div>
      </div>

      {/* -- Right: Preview panel -- */}
      <div className="flex-1 relative overflow-hidden flex flex-col min-h-[260px] md:min-h-0">
        <DemoPanel open={explorerOpen} onClose={() => setExplorerOpen(false)} />

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <ContentArea status={generationStatus} viewMode={viewMode} version={version} highlightedCode={highlightedCode} />
        </div>
      </div>
    </div>
  )
}
