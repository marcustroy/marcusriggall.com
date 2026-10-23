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
          checked={state.showChips}
          onChange={(e) => onChange({ showChips: e.target.checked })}
        />
        Show signal chips
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={state.showCards}
          onChange={(e) => onChange({ showCards: e.target.checked })}
        />
        Show approach cards
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={state.showCTA}
          onChange={(e) => onChange({ showCTA: e.target.checked })}
        />
        Show CTA button
      </label>
      <div>
        <div style={{ marginBottom: 4, color: 'var(--nb-text-dim)' }}>Layout</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['side-by-side', 'stacked'] as const).map((l) => (
            <button
              key={l}
              onClick={() => onChange({ layout: l })}
              style={{
                padding: '3px 10px',
                borderRadius: 6,
                border: '1px solid var(--nb-border)',
                background: state.layout === l ? 'var(--nb-accent)' : 'transparent',
                color: state.layout === l ? '#fff' : 'var(--nb-text)',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
