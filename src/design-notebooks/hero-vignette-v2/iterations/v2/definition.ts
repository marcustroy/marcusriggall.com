import type { IterationDefinition } from '../../types'
import { Content } from './Content'
import { FineTuning } from './controls'

export type V2State = {
  showPhoto: boolean
  showApproaches: boolean
  bioMode: 'full' | 'lead-only' | 'compressed'
  contentWidth: 'narrow' | 'default' | 'wide'
}

export const v2: IterationDefinition<V2State> = {
  config: {
    label: 'v2',
    summary: 'Stripped approach cards, elevated lead bio line as hero statement, replaced card deck with lightweight text approaches',
    changes: [
      '− approach card deck',
      '− abstract SVG illustrations',
      '− holographic foil hover effects',
      '+ elevated hero statement',
      '+ compressed bio paragraphs',
      '+ text-only approach list',
    ],
  },
  defaultState: {
    showPhoto: true,
    showApproaches: true,
    bioMode: 'full',
    contentWidth: 'default',
  },
  presets: [
    { id: 'default', label: 'Default', hint: 'Full hero with elevated statement and approaches' },
    { id: 'lead-only', label: 'Lead line only', hint: 'Just the hero statement, no supporting bio' },
    { id: 'no-approaches', label: 'Without approaches', hint: 'Bio only, no approach section' },
    { id: 'compressed', label: 'Compressed bio', hint: 'Single compressed paragraph instead of three' },
    { id: 'narrow', label: 'Narrow container', hint: 'Constrained width for focused reading' },
    { id: 'no-photo', label: 'Without photo', hint: 'Text-only header, no profile image' },
  ],
  resolvePreset(id) {
    switch (id) {
      case 'lead-only':
        return { showPhoto: true, showApproaches: false, bioMode: 'lead-only' as const, contentWidth: 'default' as const }
      case 'no-approaches':
        return { showPhoto: true, showApproaches: false, bioMode: 'full' as const, contentWidth: 'default' as const }
      case 'compressed':
        return { showPhoto: true, showApproaches: true, bioMode: 'compressed' as const, contentWidth: 'default' as const }
      case 'narrow':
        return { showPhoto: true, showApproaches: true, bioMode: 'full' as const, contentWidth: 'narrow' as const }
      case 'no-photo':
        return { showPhoto: false, showApproaches: true, bioMode: 'full' as const, contentWidth: 'default' as const }
      default:
        return { showPhoto: true, showApproaches: true, bioMode: 'full' as const, contentWidth: 'default' as const }
    }
  },
  Content,
  FineTuning,
}
