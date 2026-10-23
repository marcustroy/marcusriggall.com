import type { IterationDefinition } from '../../types'
import { Content } from './Content'
import { FineTuning } from './controls'

export type V5State = {
  showChips: boolean
  showCards: boolean
  showCTA: boolean
  layout: 'stacked' | 'side-by-side'
}

export const v5: IterationDefinition<V5State> = {
  config: {
    label: 'v5',
    summary: 'Hero metrics as card anchors, evidence-first layout',
    changes: ['+ large display metrics on cards', '+ evidence-first card hierarchy', '\u2212 muted proof points', '~ tighter vertical spacing'],
  },
  defaultState: {
    showChips: true,
    showCards: true,
    showCTA: true,
    layout: 'side-by-side',
  },
  presets: [
    { id: 'default', label: 'Default', hint: 'Full layout with large metric anchors on cards' },
    { id: 'without-chips', label: 'Without chips', hint: 'No signal chips beneath headline' },
    { id: 'without-cards', label: 'Without cards', hint: 'No approach cards section' },
    { id: 'stacked', label: 'Stacked layout', hint: 'Profile and bio stacked vertically' },
    { id: 'minimal', label: 'Minimal', hint: 'No cards, no chips \u2014 just profile and headline' },
  ],
  resolvePreset(id) {
    switch (id) {
      case 'without-chips':
        return { showChips: false, showCards: true, showCTA: true, layout: 'side-by-side' as const }
      case 'without-cards':
        return { showChips: true, showCards: false, showCTA: true, layout: 'side-by-side' as const }
      case 'stacked':
        return { showChips: true, showCards: true, showCTA: true, layout: 'stacked' as const }
      case 'minimal':
        return { showChips: false, showCards: false, showCTA: false, layout: 'side-by-side' as const }
      default:
        return { showChips: true, showCards: true, showCTA: true, layout: 'side-by-side' as const }
    }
  },
  Content,
  FineTuning,
}
