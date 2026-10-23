import type { BaselineState } from './definition'

export function FineTuning({
  state,
  onChange,
}: {
  state: BaselineState
  onChange: (patch: Partial<BaselineState>) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'var(--nb-font-sans)', fontSize: 13 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={state.showApproachCards}
          onChange={(e) => onChange({ showApproachCards: e.target.checked })}
        />
        Show approach cards
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={state.showSplash}
          onChange={(e) => onChange({ showSplash: e.target.checked })}
        />
        Splash state
      </label>
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
