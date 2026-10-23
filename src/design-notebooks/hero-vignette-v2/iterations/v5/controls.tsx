import type { V5State } from './definition'

export function FineTuning({
  state,
  onChange,
}: {
  state: V5State
  onChange: (patch: Partial<V5State>) => void
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
      <div>
        <div style={{ marginBottom: 4, color: 'var(--nb-text-dim)' }}>Grounding tone</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['evidence', 'scope', 'method'] as const).map((tone) => (
            <button
              key={tone}
              onClick={() => onChange({ groundingTone: tone })}
              style={{
                padding: '3px 10px',
                borderRadius: 6,
                border: '1px solid var(--nb-border)',
                background: state.groundingTone === tone ? 'var(--nb-accent)' : 'transparent',
                color: state.groundingTone === tone ? '#fff' : 'var(--nb-text)',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div style={{ marginBottom: 4, color: 'var(--nb-text-dim)' }}>Statement size</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['default', 'large'] as const).map((s) => (
            <button
              key={s}
              onClick={() => onChange({ statementSize: s })}
              style={{
                padding: '3px 10px',
                borderRadius: 6,
                border: '1px solid var(--nb-border)',
                background: state.statementSize === s ? 'var(--nb-accent)' : 'transparent',
                color: state.statementSize === s ? '#fff' : 'var(--nb-text)',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              {s}
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
