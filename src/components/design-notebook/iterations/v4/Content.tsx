import { useState, useEffect } from 'react'
import type { V4State } from './definition'

const tools = [
  {
    name: 'Linear',
    color: '#222326',
    glowColor: 'rgba(34, 35, 38, 0.12)',
    path: 'M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z',
    desc: 'Issues, cycles, projects',
    permissions: [
      'Read issues, projects, and cycles',
      'Move and archive issues',
      'Update status and labels',
    ],
  },
  {
    name: 'Jira',
    color: '#0052CC',
    glowColor: 'rgba(0, 82, 204, 0.15)',
    path: 'M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.001 1.001 0 0 0 23.013 0Z',
    desc: 'Boards, sprints, epics',
    permissions: [
      'Read boards, sprints, and epics',
      'Transition and archive issues',
      'Update fields and assignees',
    ],
  },
  {
    name: 'Asana',
    color: '#F06A6A',
    glowColor: 'rgba(240, 106, 106, 0.15)',
    path: 'M18.78 12.653c-2.882 0-5.22 2.336-5.22 5.22s2.338 5.22 5.22 5.22 5.22-2.34 5.22-5.22-2.336-5.22-5.22-5.22zm-13.56 0c-2.88 0-5.22 2.337-5.22 5.22s2.338 5.22 5.22 5.22 5.22-2.338 5.22-5.22-2.336-5.22-5.22-5.22zm12-6.525c0 2.883-2.337 5.22-5.22 5.22-2.882 0-5.22-2.337-5.22-5.22 0-2.88 2.338-5.22 5.22-5.22 2.883 0 5.22 2.34 5.22 5.22z',
    desc: 'Tasks, timelines, portfolios',
    permissions: [
      'Read tasks, projects, and portfolios',
      'Move and complete tasks',
      'Update custom fields and tags',
    ],
  },
]

const actionsByTool: Record<string, string[]> = {
  Linear: [
    'Archive 6 completed tasks',
    'Move 3 items to "Needs Review"',
    'Flag 2 blocked items for discussion',
  ],
  Jira: [
    'Close 6 resolved tickets',
    'Transition 3 items to "In Review"',
    'Flag 2 blocked items for discussion',
  ],
  Asana: [
    'Complete 6 finished tasks',
    'Move 3 tasks to "Needs Review" section',
    'Mark 2 blocked items for discussion',
  ],
}

export function Content({ state }: { state: V4State }) {
  const [step, setStep] = useState<V4State['step']>(state.step)
  const [toolIndex, setToolIndex] = useState(state.toolIndex)

  useEffect(() => { setStep(state.step); setToolIndex(state.toolIndex) }, [state.step, state.toolIndex])

  const tool = tools[toolIndex]

  return (
    <div style={{ padding: 28, fontFamily: 'var(--nb-font-sans)' }}>
      <UserPrompt />

      <ChatResponse />

      <div style={{ height: 20 }} />

      <p style={bodyStyle}>
        Want me to handle this? Connect your board and I&apos;ll take care of it.
      </p>

      <div style={{ height: 14 }} />

      {/* === STEP 1: CARDS === */}
      {step === 'cards' && (
        <div style={{ display: 'flex', gap: 10 }}>
          {tools.map((t, i) => (
            <ToolCard key={t.name} tool={t} onClick={() => { setToolIndex(i); setStep('permissions') }} />
          ))}
        </div>
      )}

      {/* === STEP 2: PERMISSIONS === */}
      {step === 'permissions' && (
        <div style={{
          borderRadius: 14, overflow: 'hidden',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
        }}>
          <div style={{
            padding: '16px 18px',
            background: '#fafafa',
            borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: tool.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="#fff"><path d={tool.path} /></svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', letterSpacing: '-0.02em' }}>{tool.name}</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 1 }}>Requesting access</div>
            </div>
          </div>

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

          <div style={{ display: 'flex', gap: 10, padding: '14px 18px 18px', background: '#fff' }}>
            <div onClick={() => setStep('cards')} style={{
              flex: 1, padding: '10px 0', borderRadius: 8,
              border: '1px solid #e5e7eb', textAlign: 'center',
              fontSize: 14, fontWeight: 500, color: '#6b7280', cursor: 'pointer',
            }}>Cancel</div>
            <div onClick={() => setStep('plan')} style={{
              flex: 2, padding: '10px 0', borderRadius: 8,
              background: '#111827', textAlign: 'center',
              fontSize: 14, fontWeight: 500, color: '#fff', cursor: 'pointer',
            }}>Authorise</div>
          </div>
        </div>
      )}

      {/* === STEP 3: EXECUTION PLAN === */}
      {step === 'plan' && (() => {
        const toolActions = actionsByTool[tool.name] || []
        return (
          <>
            <div style={{
              borderRadius: 14, border: '1px solid rgba(0, 0, 0, 0.06)',
              overflow: 'hidden', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
            }}>
              <div style={{
                padding: '12px 18px', background: '#fafafa',
                borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 5, background: tool.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg viewBox="0 0 24 24" width={10} height={10} fill="#fff"><path d={tool.path} /></svg>
                  </div>
                  <div style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
                    textTransform: 'uppercase' as const, color: '#9ca3af',
                  }}>
                    {tool.name} — Ready
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#c4c9d1', fontWeight: 500 }}>
                  {toolActions.length} actions
                </div>
              </div>

              <div style={{ background: '#fff' }}>
                {toolActions.map((label, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 18px',
                    borderBottom: i < toolActions.length - 1 ? '1px solid #f5f5f5' : 'none',
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 7,
                      background: '#111827',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <svg width={10} height={10} viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 14, color: '#374151', flex: 1, letterSpacing: '-0.01em' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              marginTop: 10, padding: '11px 0', borderRadius: 10,
              background: '#111827', color: '#fff',
              fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em',
              textAlign: 'center', cursor: 'pointer',
            }}>
              Run {toolActions.length} actions
            </div>
          </>
        )
      })()}
    </div>
  )
}

function ToolCard({ tool, onClick }: { tool: typeof tools[number]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        padding: '20px 12px 18px',
        borderRadius: 14,
        border: hovered ? `1px solid ${tool.color}40` : '1px solid rgba(0, 0, 0, 0.06)',
        background: hovered
          ? `linear-gradient(180deg, ${tool.glowColor}80 0%, #ffffff 100%)`
          : 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        boxShadow: hovered
          ? '0 4px 16px -2px rgba(0, 0, 0, 0.08)'
          : '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        overflow: 'hidden' as const,
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: hovered
          ? `linear-gradient(145deg, ${tool.color}, ${tool.color}dd)`
          : `linear-gradient(145deg, ${tool.color}18, ${tool.color}0a)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: hovered ? `0 6px 16px -2px ${tool.color}40` : 'none',
        transition: 'all 0.2s ease',
      }}>
        <svg viewBox="0 0 24 24" width={20} height={20} fill={hovered ? '#fff' : tool.color}>
          <path d={tool.path} />
        </svg>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', letterSpacing: '-0.02em' }}>
          {tool.name}
        </div>
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2, lineHeight: 1.4 }}>
          {tool.desc}
        </div>
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
