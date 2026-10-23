'use client'

import { useEffect, useRef, useState } from 'react'

export type ChatMessage =
  | { type: 'user'; text: string }
  | { type: 'agent'; text: string }
  | { type: 'tool'; text: string; reveals: number }

interface ChatPanelProps {
  messages: ChatMessage[]
  onReveal: (count: number) => void
}

export const CHAT_SCRIPT: ChatMessage[] = [
  {
    type: 'user',
    text: '/design-notebook I want to explore how an AI agent responds to the prompt: "Clean up my project board and prep for the sprint review"',
  },
  { type: 'tool', text: 'Read the design notebook skill', reveals: 0 },
  {
    type: 'agent',
    text: "Setting up a design notebook. I'll start with how this typically looks today — a plain chat response.",
  },
  { type: 'tool', text: 'Created iteration: Baseline', reveals: 1 },
  {
    type: 'user',
    text: "This is just advice though. What if the AI could actually do the work?",
  },
  {
    type: 'agent',
    text: 'Good call. Let me add a way to connect your project board so the agent can act on it.',
  },
  { type: 'tool', text: 'Created iteration: v2', reveals: 2 },
  {
    type: 'user',
    text: 'Can you show me three different ways the connect experience could work?',
  },
  {
    type: 'agent',
    text: "On it. I'll try cards, an OAuth flow, and an inline action plan.",
  },
  { type: 'tool', text: 'Created iterations: v3a, v3b, v3c', reveals: 3 },
  {
    type: 'user',
    text: 'I like parts of each. Can you combine the card picker, the OAuth confirmation, and the action plan into one flow?',
  },
  {
    type: 'agent',
    text: 'On it. I\'ll take the best of each and converge them.',
  },
  { type: 'tool', text: 'Created iteration: v4', reveals: 4 },
]

// Delay in ms before showing the next message, based on what just appeared
function getDelay(msg: ChatMessage): number {
  if (msg.type === 'user') return 1200
  if (msg.type === 'tool') return 800
  return 1400 // agent
}

export default function ChatPanel({ messages, onReveal }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [shownCount, setShownCount] = useState(1) // start with first message visible

  // Animate messages in one by one
  useEffect(() => {
    if (shownCount >= messages.length) return

    const lastShown = messages[shownCount - 1]
    const delay = getDelay(lastShown)

    const timer = setTimeout(() => {
      const nextMsg = messages[shownCount]
      // If this message reveals an iteration, fire it
      if (nextMsg.type === 'tool' && nextMsg.reveals > 0) {
        onReveal(nextMsg.reveals)
      }
      setShownCount(prev => prev + 1)
    }, delay)

    return () => clearTimeout(timer)
  }, [shownCount, messages, onReveal])

  // Auto-scroll as messages appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [shownCount])

  const visible = messages.slice(0, shownCount)

  return (
    <div
      ref={scrollRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: '16px 14px',
        overflowY: 'auto',
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
      }}
    >
      {visible.map((msg, i) => {
        const isNew = i === visible.length - 1 && i > 0
        const animStyle: React.CSSProperties = isNew
          ? { animation: 'chatFadeIn 0.3s ease both' }
          : {}

        if (msg.type === 'user') {
          return (
            <div key={i} style={{ display: 'flex', justifyContent: 'flex-end', ...animStyle }}>
              <div
                style={{
                  background: '#f3f4f6',
                  borderRadius: '14px 14px 4px 14px',
                  padding: '8px 12px',
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: '#374151',
                  maxWidth: '88%',
                  letterSpacing: '-0.01em',
                }}
              >
                {msg.text.startsWith('/') ? (
                  <>
                    <span style={{ fontWeight: 700 }}>{msg.text.split(' ')[0]}</span>
                    {' '}{msg.text.split(' ').slice(1).join(' ')}
                  </>
                ) : msg.text}
              </div>
            </div>
          )
        }

        if (msg.type === 'agent') {
          return (
            <div
              key={i}
              style={{
                fontSize: 13,
                lineHeight: 1.5,
                color: '#374151',
                letterSpacing: '-0.01em',
                ...animStyle,
              }}
            >
              {msg.text}
            </div>
          )
        }

        // Tool call
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 0',
              cursor: 'default',
              ...animStyle,
            }}
          >
            <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 400 }}>
              {msg.text}
            </span>
            <svg
              width={10}
              height={10}
              viewBox="0 0 16 16"
              fill="none"
              style={{ color: '#c4c9d1', marginTop: 1 }}
            >
              <path
                d="M6 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )
      })}

      <style>{`
        @keyframes chatFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
