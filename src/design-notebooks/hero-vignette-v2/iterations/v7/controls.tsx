import type { V7State } from './definition'

export function FineTuning({
  state,
  onChange,
}: {
  state: V7State
  onChange: (patch: Partial<V7State>) => void
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
          checked={state.showGroundingLine}
          onChange={(e) => onChange({ showGroundingLine: e.target.checked })}
        />
        Show grounding line
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={state.showRule}
          onChange={(e) => onChange({ showRule: e.target.checked })}
        />
        Show rule
      </label>
      <div>
        <div style={{ marginBottom: 4, color: 'var(--nb-text-dim)' }}>Statement variant</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['craft', 'evidence', 'builder'] as const).map((v) => (
            <button
              key={v}
              onClick={() => onChange({ statementVariant: v })}
              style={{
                padding: '3px 10px',
                borderRadius: 6,
                border: '1px solid var(--nb-border)',
                background: state.statementVariant === v ? 'var(--nb-accent)' : 'transparent',
                color: state.statementVariant === v ? '#fff' : 'var(--nb-text)',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div style={{ marginBottom: 4, color: 'var(--nb-text-dim)' }}>Grounding variant</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['impact', 'method', 'scope'] as const).map((v) => (
            <button
              key={v}
              onClick={() => onChange({ groundingVariant: v })}
              style={{
                padding: '3px 10px',
                borderRadius: 6,
                border: '1px solid var(--nb-border)',
                background: state.groundingVariant === v ? 'var(--nb-accent)' : 'transparent',
                color: state.groundingVariant === v ? '#fff' : 'var(--nb-text)',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              {v}
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
