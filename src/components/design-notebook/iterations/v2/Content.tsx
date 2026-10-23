import type { V2State } from './definition'

export function Content({ state }: { state: V2State }) {
  if (state.status === 'loading') {
    return (
      <div style={{ padding: 28, fontFamily: 'var(--nb-font-sans)' }}>
        <UserPrompt />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
          <Bar w="60%" shimmer />
          <Bar w="100%" shimmer />
          <Bar w="80%" shimmer />
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

      <div style={{ marginTop: 24 }}>
        <Label>Clean up the board</Label>
        <p style={bodyStyle}>Archive 6 completed tasks, move stalled items, group by theme</p>

        <div style={{ height: 12 }} />

        <Label>Prep the sprint review</Label>
        <p style={bodyStyle}>Pick 3–5 highlights, flag blocked items for discussion</p>
      </div>

      <div style={{ height: 16 }} />

      <IntegrationBanner popupState={state.popupState} />
    </div>
  )
}

function IntegrationBanner({ popupState }: { popupState: V2State['popupState'] }) {
  if (popupState === 'dismissed') return null

  if (popupState === 'connected') {
    return (
      <div style={{
        padding: '12px 16px', borderRadius: 10,
        background: '#f0fdf4', border: '1px solid #bbf7d0',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <LinearIcon size={18} />
        <span style={{ fontSize: 13, fontWeight: 500, color: '#15803d', flex: 1 }}>Linear connected</span>
        <span style={{ fontSize: 13, color: '#15803d' }}>I can do this for you →</span>
      </div>
    )
  }

  return (
    <div style={{
      padding: '14px 16px', borderRadius: 12,
      background: '#fafafa', border: '1px solid rgba(0, 0, 0, 0.06)',
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 8, letterSpacing: '-0.01em' }}>
        Connect your project board
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <IntegrationChip icon={<LinearIcon size={14} />} label="Linear" />
        <IntegrationChip icon={<JiraIcon size={14} />} label="Jira" />
        <IntegrationChip icon={<AsanaIcon size={14} />} label="Asana" />
      </div>
    </div>
  )
}

function IntegrationChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 10px', borderRadius: 6,
      background: '#fff', border: '1px solid #e5e7eb',
      fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'default',
    }}>
      {icon}
      {label}
    </div>
  )
}

function LinearIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#222326">
      <path d="M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z" />
    </svg>
  )
}

function JiraIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#0052CC">
      <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.001 1.001 0 0 0 23.013 0Z" />
    </svg>
  )
}

function AsanaIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#F06A6A">
      <path d="M18.78 12.653c-2.882 0-5.22 2.336-5.22 5.22s2.338 5.22 5.22 5.22 5.22-2.34 5.22-5.22-2.336-5.22-5.22-5.22zm-13.56 0c-2.88 0-5.22 2.337-5.22 5.22s2.338 5.22 5.22 5.22 5.22-2.338 5.22-5.22-2.336-5.22-5.22-5.22zm12-6.525c0 2.883-2.337 5.22-5.22 5.22-2.882 0-5.22-2.337-5.22-5.22 0-2.88 2.338-5.22 5.22-5.22 2.883 0 5.22 2.34 5.22 5.22z" />
    </svg>
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
