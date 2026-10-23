import type { IterationDefinition } from '../../types'
import { Content } from './Content'
import { FineTuning } from './controls'

export type V3State = {
  showChips: boolean
  showCards: boolean
  showCTA: boolean
  layout: 'stacked' | 'side-by-side'
}

export const v3: IterationDefinition<V3State> = {
  config: {
    label: 'v3',
    summary: 'Restored interactive card hover with condensed text',
    changes: ['+ 3D card hover tilt', '+ holographic card sheen', '\u2212 card body paragraphs', '~ "Enterprise SaaS" chip'],
  },
  defaultState: {
    showChips: true,
    showCards: true,
    showCTA: true,
    layout: 'side-by-side',
  },
  presets: [
    { id: 'default', label: 'Default', hint: 'Full layout with interactive cards and chips' },
    { id: 'without-chips', label: 'Without chips', hint: 'No signal chips beneath headline' },
    { id: 'without-cards', label: 'Without cards', hint: 'No approach cards section' },
    { id: 'stacked', label: 'Stacked layout', hint: 'Profile and bio stacked vertically' },
    { id: 'minimal', label: 'Minimal', hint: 'No cards, no chips — just profile and headline' },
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
