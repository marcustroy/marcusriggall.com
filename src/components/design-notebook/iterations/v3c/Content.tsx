import { useState, useEffect } from 'react'
import type { V3cState } from './definition'

const actions = [
  { label: 'Archive 6 completed tasks', tool: 'Linear', color: '#222326', iconPath: 'M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z' },
  { label: 'Move 3 items to "Needs Review"', tool: 'Linear', color: '#222326', iconPath: 'M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z' },
  { label: 'Create sprint review agenda', tool: 'Notion', color: '#111827', iconPath: 'M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L2.926 2.468c-.466.046-.56.28-.374.466l1.907 1.274zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.84-.046.933-.56.933-1.167V6.354c0-.606-.233-.933-.746-.886l-15.177.886c-.56.047-.747.327-.747.934zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.747 0-.933-.234-1.494-.934l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V8.858L8.49 8.72c-.094-.42.14-1.026.793-1.073l3.456-.234 4.764 7.28v-6.44l-1.215-.14c-.093-.513.28-.886.747-.933l3.222-.187zM1.874 1.147l13.728-.933c1.681-.14 2.1-.047 3.13.7l4.297 3.013c.7.513.933.653.933 1.214v16.497c0 1.027-.373 1.634-1.68 1.727l-15.458.934c-.98.046-1.448-.094-1.962-.747l-3.13-4.06c-.56-.747-.793-1.307-.793-1.934V2.787c0-.793.373-1.547 1.635-1.64z' },
  { label: 'Send summary to #design-team', tool: 'Slack', color: '#611f69', iconPath: 'M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z' },
  { label: 'Flag 2 blocked items', tool: 'Linear', color: '#222326', iconPath: 'M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z' },
]

const uniqueTools = [
  { name: 'Linear', color: '#222326' },
  { name: 'Notion', color: '#111827' },
  { name: 'Slack', color: '#611f69' },
]

export function Content({ state }: { state: V3cState }) {
  const [localStep, setLocalStep] = useState<V3cState['step']>(state.step)
  useEffect(() => { setLocalStep(state.step) }, [state.step])
  const connected = localStep === 'connected'

  return (
    <div style={{ padding: 28, fontFamily: 'var(--nb-font-sans)' }}>
      <UserPrompt />

      <p style={{ margin: '24px 0 0', fontSize: 15, lineHeight: 1.65, color: '#374151', letterSpacing: '-0.01em' }}>
        Here&apos;s what I&apos;d do to clean up your board and prep for sprint review:
      </p>

      <div style={{ height: 16 }} />

      {/* Execution plan */}
      <div style={{
        borderRadius: 14, border: '1px solid rgba(0, 0, 0, 0.06)',
        overflow: 'hidden', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
      }}>
        <div style={{
          padding: '12px 18px',
          background: '#fafafa',
          borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
            color: '#9ca3af',
          }}>
            {connected ? 'Ready to execute' : 'Execution plan'}
          </div>
          <div style={{ fontSize: 12, color: '#c4c9d1', fontWeight: 500 }}>
            {actions.length} actions
          </div>
        </div>

        <div style={{ background: '#fff' }}>
          {actions.map((action, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 18px',
              borderBottom: i < actions.length - 1 ? '1px solid #f5f5f5' : 'none',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 7,
                border: connected ? 'none' : '1.5px solid #d4d4d8',
                background: connected ? '#111827' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {connected ? (
                  <svg width={10} height={10} viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#b0b5be' }}>{i + 1}</span>
                )}
              </div>

              <span style={{ fontSize: 14, color: '#374151', flex: 1, letterSpacing: '-0.01em' }}>
                {action.label}
                <span style={{ color: '#9ca3af', fontWeight: 400 }}> in </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, verticalAlign: 'baseline' }}>
                  <svg viewBox="0 0 24 24" width={11} height={11} fill={action.color} style={{ verticalAlign: '-1px' }}>
                    <path d={action.iconPath} />
                  </svg>
                  <span style={{ fontSize: 13, fontWeight: 500, color: action.color }}>{action.tool}</span>
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 12 }} />

      {/* Connect or run footer */}
      {!connected ? (
        <div style={{
          padding: '14px 18px', borderRadius: 12,
          background: '#fafafa', border: '1px solid rgba(0, 0, 0, 0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'default',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', letterSpacing: '-0.01em' }}>
            Connect Linear, Notion &amp; Slack to run this
          </div>
          <div onClick={() => setLocalStep('connected')} style={{
            padding: '8px 18px', borderRadius: 8,
            background: '#111827', color: '#fff',
            fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em',
            cursor: 'pointer',
          }}>
            Connect all
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px', borderRadius: 12,
          background: '#fafafa', border: '1px solid rgba(0, 0, 0, 0.06)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', letterSpacing: '-0.01em' }}>
            All connected
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 18px', borderRadius: 8,
            background: '#111827', color: '#fff',
            fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em',
          }}>
            Run all
            <svg width={12} height={12} viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      )}
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
