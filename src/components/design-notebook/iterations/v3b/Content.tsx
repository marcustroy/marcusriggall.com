import { useState, useEffect } from 'react'
import type { V3bState } from './definition'

const toolList = [
  {
    name: 'Linear',
    color: '#222326',
    path: 'M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z',
    permissions: [
      'Read issues, projects, and cycles',
      'Move and archive issues',
      'Update status and labels',
    ],
  },
  {
    name: 'Jira',
    color: '#0052CC',
    path: 'M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.001 1.001 0 0 0 23.013 0Z',
    permissions: [
      'Read boards, sprints, and epics',
      'Transition and archive issues',
      'Update fields and assignees',
    ],
  },
  {
    name: 'Asana',
    color: '#F06A6A',
    path: 'M18.78 12.653c-2.882 0-5.22 2.336-5.22 5.22s2.338 5.22 5.22 5.22 5.22-2.34 5.22-5.22-2.336-5.22-5.22-5.22zm-13.56 0c-2.88 0-5.22 2.337-5.22 5.22s2.338 5.22 5.22 5.22 5.22-2.338 5.22-5.22-2.336-5.22-5.22-5.22zm12-6.525c0 2.883-2.337 5.22-5.22 5.22-2.882 0-5.22-2.337-5.22-5.22 0-2.88 2.338-5.22 5.22-5.22 2.883 0 5.22 2.34 5.22 5.22z',
    permissions: [
      'Read tasks, projects, and portfolios',
      'Move and complete tasks',
      'Update custom fields and tags',
    ],
  },
]

export function Content({ state }: { state: V3bState }) {
  const [localStep, setLocalStep] = useState<V3bState['step']>(state.step)
  const [localTool, setLocalTool] = useState(state.toolIndex)

  useEffect(() => { setLocalStep(state.step); setLocalTool(state.toolIndex) }, [state.step, state.toolIndex])

  const step = localStep
  const tool = toolList[localTool]

  return (
    <div style={{ padding: 28, fontFamily: 'var(--nb-font-sans)' }}>
      <UserPrompt />

      <ChatResponse />

      <div style={{ height: 16 }} />

      {/* === CHOOSE STEP === */}
      {step === 'choose' && (
        <div style={{
          borderRadius: 14, overflow: 'hidden',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
        }}>
          <div style={{
            padding: '14px 18px',
            background: '#fafafa',
            borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', letterSpacing: '-0.02em' }}>
              Connect to act
            </div>
          </div>

          <div style={{ padding: '4px 8px', background: '#fff' }}>
            {toolList.map((t, i) => (
              <div
                key={t.name}
                onClick={() => { setLocalTool(i); setLocalStep('permissions') }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 12px', borderRadius: 10, cursor: 'pointer',
                  background: 'transparent',
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: t.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg viewBox="0 0 24 24" width={14} height={14} fill="#fff"><path d={t.path} /></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#111827', letterSpacing: '-0.01em' }}>{t.name}</div>
                </div>
                <svg width={14} height={14} viewBox="0 0 16 16" fill="none" style={{ color: '#c4c9d1' }}>
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === PERMISSIONS STEP === */}
      {step === 'permissions' && (
        <div style={{
          borderRadius: 14, overflow: 'hidden',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
        }}>
          {/* Header — monochrome with tool icon */}
          <div style={{
            padding: '16px 18px',
            background: '#fafafa',
            borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: tool.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="#fff"><path d={tool.path} /></svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', letterSpacing: '-0.02em' }}>{tool.name}</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 1 }}>Requesting access</div>
            </div>
          </div>

          {/* Permissions list */}
          <div style={{ padding: '4px 18px 6px', background: '#fff' }}>
            {tool.permissions.map((perm) => (
              <div key={perm} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '11px 0', borderBottom: '1px solid #f5f5f5',
              }}>
                <svg width={14} height={14} viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M2 6l3 3 5-5" stroke={tool.color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: 14, color: '#374151', letterSpacing: '-0.01em' }}>{perm}</span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, padding: '14px 18px 18px', background: '#fff' }}>
            <div onClick={() => setLocalStep('choose')} style={{
              flex: 1, padding: '10px 0', borderRadius: 8,
              border: '1px solid #e5e7eb', textAlign: 'center',
              fontSize: 14, fontWeight: 500, color: '#6b7280', cursor: 'pointer',
            }}>Cancel</div>
            <div onClick={() => setLocalStep('connected')} style={{
              flex: 2, padding: '10px 0', borderRadius: 8,
              background: '#111827', textAlign: 'center',
              fontSize: 14, fontWeight: 500, color: '#fff', cursor: 'pointer',
            }}>Authorise</div>
          </div>
        </div>
      )}

      {/* === CONNECTED STEP === */}
      {step === 'connected' && (
        <div style={{
          borderRadius: 14, padding: '16px 18px',
          background: '#fafafa', border: '1px solid rgba(0, 0, 0, 0.06)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: tool.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg viewBox="0 0 24 24" width={14} height={14} fill="#fff"><path d={tool.path} /></svg>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', letterSpacing: '-0.02em' }}>
              {tool.name} connected
            </div>
            <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 1 }}>
              Ready to clean up your board
            </div>
          </div>

          <svg width={16} height={16} viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke={tool.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
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
