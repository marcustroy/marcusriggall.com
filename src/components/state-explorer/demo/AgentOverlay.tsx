'use client'

import { useEffect, useState } from 'react'
import { useDemoStore } from './demoStore'

const lines = [
  { text: '> running states prompt', delay: 0, dim: true },
  { text: 'Exploring 6 components...', delay: 600 },
  { text: 'Found 4 state dimensions', delay: 1600 },
  { text: 'Wiring presets and controls...', delay: 2600 },
  { text: '\u2713 Done', delay: 3600, green: true },
]

export default function AgentOverlay() {
  const agentPhase = useDemoStore((s) => s.agentPhase)
  const [visibleCount, setVisibleCount] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (agentPhase !== 'running') {
      setVisibleCount(0)
      setFading(false)
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []

    lines.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), line.delay))
    })

    timers.push(setTimeout(() => setFading(true), 4200))

    return () => timers.forEach(clearTimeout)
  }, [agentPhase])

  if (agentPhase !== 'running') return null

  return (
    <div
      className="absolute z-30 bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 transition-opacity duration-700"
      style={{ opacity: fading ? 0 : 1, isolation: 'isolate' }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-lg opacity-50 -z-10"
        style={{
          background:
            'conic-gradient(from var(--gradient-angle), #FFB600, #FF5C0B, #9A36B2, #FF5C0B, #FFB600)',
          filter: 'blur(24px)',
          animation: 'rotateGradient 3s linear infinite',
        }}
      />

      {/* Gradient border */}
      <div
        className="rounded-lg p-[2px] w-full md:w-[260px]"
        style={{
          background:
            'conic-gradient(from var(--gradient-angle), #FFB600, #FF5C0B, #9A36B2, #FF5C0B, #FFB600)',
          animation: 'rotateGradient 3s linear infinite',
        }}
      >
        {/* Inner content */}
        <div className="bg-neutral-900 rounded-[7px] px-4 py-3 md:px-5 md:py-4 shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-neutral-600" />
              <div className="w-2 h-2 rounded-full bg-neutral-600" />
              <div className="w-2 h-2 rounded-full bg-neutral-600" />
            </div>
            <span className="text-demo-sm text-neutral-500 font-mono">coding-agent</span>
          </div>

          <div className="font-mono text-demo-md leading-[1.7] space-y-0.5">
            {lines.slice(0, visibleCount).map((line, i) => (
              <div
                key={i}
                className={
                  line.green
                    ? 'text-neutral-200 font-semibold'
                    : line.dim
                      ? 'text-neutral-500'
                      : 'text-neutral-300'
                }
                style={{ animation: 'fadeSlideIn 0.25s ease-out' }}
              >
                {line.text}
              </div>
            ))}
            {visibleCount > 0 && visibleCount < lines.length && (
              <span className="inline-block w-[6px] h-[13px] bg-neutral-400 animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
