import { useState, useEffect } from 'react'
import type { V3aState } from './definition'

const tools = [
  {
    name: 'Linear',
    desc: 'Issues, cycles, projects',
    color: '#222326',
    glowColor: 'rgba(34, 35, 38, 0.12)',
    path: 'M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z',
  },
  {
    name: 'Jira',
    desc: 'Boards, sprints, epics',
    color: '#0052CC',
    glowColor: 'rgba(0, 82, 204, 0.15)',
    path: 'M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.001 1.001 0 0 0 23.013 0Z',
  },
  {
    name: 'Asana',
    desc: 'Tasks, timelines, portfolios',
    color: '#F06A6A',
    glowColor: 'rgba(240, 106, 106, 0.15)',
    path: 'M18.78 12.653c-2.882 0-5.22 2.336-5.22 5.22s2.338 5.22 5.22 5.22 5.22-2.34 5.22-5.22-2.336-5.22-5.22-5.22zm-13.56 0c-2.88 0-5.22 2.337-5.22 5.22s2.338 5.22 5.22 5.22 5.22-2.338 5.22-5.22-2.336-5.22-5.22-5.22zm12-6.525c0 2.883-2.337 5.22-5.22 5.22-2.882 0-5.22-2.337-5.22-5.22 0-2.88 2.338-5.22 5.22-5.22 2.883 0 5.22 2.34 5.22 5.22z',
  },
]

export function Content({ state }: { state: V3aState }) {
  const [localSelected, setLocalSelected] = useState<number | null>(state.selected)

  // Sync when preset changes
  useEffect(() => { setLocalSelected(state.selected) }, [state.selected])

  const selected = localSelected

  return (
    <div style={{ padding: 28, fontFamily: 'var(--nb-font-sans)' }}>
      <UserPrompt />

      <ChatResponse />

      <div style={{ height: 16 }} />

      {/* Integration cards */}
      <div style={{ display: 'flex', gap: 10 }}>
        {tools.map((tool, i) => (
          <ToolCard
            key={tool.name}
            tool={tool}
            isSelected={selected === i}
            onClick={() => setLocalSelected(selected === i ? null : i)}
          />
        ))}
      </div>
    </div>
  )
}

function ToolCard({ tool, isSelected, onClick }: { tool: typeof tools[number]; isSelected: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const active = isSelected || hovered

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        padding: '20px 12px 18px',
        borderRadius: 14,
        border: isSelected
          ? `1.5px solid ${tool.color}`
          : hovered
            ? `1px solid ${tool.color}40`
            : '1px solid rgba(0, 0, 0, 0.06)',
        background: isSelected
          ? `linear-gradient(180deg, ${tool.glowColor} 0%, rgba(255,255,255,1) 100%)`
          : hovered
            ? `linear-gradient(180deg, ${tool.glowColor}80 0%, #ffffff 100%)`
            : 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        boxShadow: isSelected
          ? `0 0 0 3px ${tool.glowColor}, 0 8px 24px -4px rgba(0, 0, 0, 0.08)`
          : hovered
            ? `0 4px 16px -2px rgba(0, 0, 0, 0.08)`
            : '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        position: 'relative' as const,
        overflow: 'hidden' as const,
        transition: 'all 0.2s ease',
        transform: hovered && !isSelected ? 'translateY(-2px)' : 'none',
      }}
    >
      {isSelected && (
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: 2,
          background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)`,
          borderRadius: '0 0 2px 2px',
        }} />
      )}

      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: active
          ? `linear-gradient(145deg, ${tool.color}, ${tool.color}dd)`
          : `linear-gradient(145deg, ${tool.color}18, ${tool.color}0a)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: active ? `0 6px 16px -2px ${tool.color}40` : 'none',
        transition: 'all 0.2s ease',
      }}>
        <svg viewBox="0 0 24 24" width={20} height={20} fill={active ? '#fff' : tool.color}>
          <path d={tool.path} />
        </svg>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: 14, fontWeight: 600,
          color: isSelected ? tool.color : '#111827',
          letterSpacing: '-0.02em',
        }}>
          {tool.name}
        </div>
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2, lineHeight: 1.4 }}>
          {tool.desc}
        </div>
      </div>
    </div>
  )
}


function UserPrompt() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{
        background: '#f3f4f6', borderRadius: '16px 16px 4px 16px',
        padding: '10px 16px', fontSize: 14, color: '#374151',
        maxWidth: '85%', lineHeight: 1.5, letterSpacing: '-0.01em',
      }}>
        Clean up my project board and prep for the sprint review
      </div>
    </div>
  )
}

function ChatResponse() {
  return (
    <div style={{ marginTop: 24 }}>
      <Label>Clean up the board</Label>
      <p style={bodyStyle}>Archive 6 completed tasks, move stalled items, group by theme</p>
      <div style={{ height: 12 }} />
      <Label>Prep the sprint review</Label>
      <p style={bodyStyle}>Pick 3–5 highlights, flag blocked items for discussion</p>
    </div>
  )
}

const bodyStyle: React.CSSProperties = {
  margin: '4px 0 0', fontSize: 15, lineHeight: 1.6, color: '#374151', letterSpacing: '-0.01em',
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 14, fontWeight: 600, color: '#1f2937',
      letterSpacing: '-0.01em',
      marginBottom: 2,
    }}>
      {children}
    </div>
  )
}
