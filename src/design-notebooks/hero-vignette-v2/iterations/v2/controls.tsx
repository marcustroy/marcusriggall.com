import type { V2State } from './definition'

export function FineTuning({
  state,
  onChange,
}: {
  state: V2State
  onChange: (patch: Partial<V2State>) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'var(--nb-font-sans)', fontSize: 13 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={state.showPhoto}
          onChange={(e) => onChange({ showPhoto: e.target.checked })}
        />
        Show photo
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={state.showApproaches}
          onChange={(e) => onChange({ showApproaches: e.target.checked })}
        />
        Show approaches
      </label>
      <div>
        <div style={{ marginBottom: 4, color: 'var(--nb-text-dim)' }}>Bio mode</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['full', 'compressed', 'lead-only'] as const).map((m) => (
            <button
              key={m}
              onClick={() => onChange({ bioMode: m })}
              style={{
                padding: '3px 10px',
                borderRadius: 6,
                border: '1px solid var(--nb-border)',
                background: state.bioMode === m ? 'var(--nb-accent)' : 'transparent',
                color: state.bioMode === m ? '#fff' : 'var(--nb-text)',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div style={{ marginBottom: 4, color: 'var(--nb-text-dim)' }}>Container width</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['narrow', 'default', 'wide'] as const).map((w) => (
            <button
              key={w}
              onClick={() => onChange({ contentWidth: w })}
              style={{
                padding: '3px 10px',
                borderRadius: 6,
                border: '1px solid var(--nb-border)',
                background: state.contentWidth === w ? 'var(--nb-accent)' : 'transparent',
                color: state.contentWidth === w ? '#fff' : 'var(--nb-text)',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
