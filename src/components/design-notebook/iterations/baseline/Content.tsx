import type { BaselineState } from './definition'

export function Content({ state }: { state: BaselineState }) {
  if (state.status === 'loading') {
    return (
      <div style={{ padding: 28, fontFamily: 'var(--nb-font-sans)' }}>
        <UserPrompt />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
          <Bar w="60%" shimmer />
          <Bar w="100%" shimmer />
          <Bar w="40%" shimmer />
        </div>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div style={{ padding: 28, fontFamily: 'var(--nb-font-sans)' }}>
        <UserPrompt />
        <div style={{
          marginTop: 24, padding: 16, borderRadius: 8,
          background: '#fef2f2', border: '1px solid #fecaca',
        }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#b91c1c' }}>Failed to generate response</div>
          <div style={{ fontSize: 13, color: '#dc2626', marginTop: 4 }}>Connection timed out. Try again.</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: 28, fontFamily: 'var(--nb-font-sans)' }}>
      <UserPrompt />
      <ChatResponse />
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

function Bar({ w, shimmer }: { w: string; shimmer?: boolean }) {
  return (
    <div style={{
      height: 8, width: w, borderRadius: 4, background: '#e5e7eb',
      animation: shimmer ? 'pulse 1.5s ease-in-out infinite' : undefined,
    }} />
  )
}
