import type { IterationDefinition } from '../../types'
import { Content } from './Content'
import { FineTuning } from './controls'

export type V3State = {
  showPhoto: boolean
  showEvidence: boolean
  evidenceStyle: 'inline' | 'chips'
  bioMode: 'lead-only' | 'lead-plus-evidence'
  contentWidth: 'narrow' | 'default' | 'wide'
}

export const v3: IterationDefinition<V3State> = {
  config: {
    label: 'v3',
    summary: 'Removed approaches section as furniture, compressed bio to single evidence line, tightened header-to-statement gap',
    changes: [
      '− approach grid (furniture)',
      '− verbose supporting paragraphs',
      '+ single evidence line with concrete scope',
      '+ tighter vertical rhythm',
      '+ evidence chips variant',
    ],
  },
  defaultState: {
    showPhoto: true,
    showEvidence: true,
    evidenceStyle: 'inline',
    bioMode: 'lead-plus-evidence',
    contentWidth: 'default',
  },
  presets: [
    { id: 'default', label: 'Default', hint: 'Hero statement with evidence line' },
    { id: 'lead-only', label: 'Lead only', hint: 'Just the hero statement, nothing else' },
    { id: 'chips', label: 'Evidence chips', hint: 'Scope signals as discrete chips instead of prose' },
    { id: 'no-photo', label: 'Without photo', hint: 'Text-only header, no profile image' },
    { id: 'narrow', label: 'Narrow container', hint: 'Constrained width for focused reading' },
    { id: 'minimal', label: 'Minimal', hint: 'No photo, no evidence, just name and statement' },
  ],
  resolvePreset(id) {
    switch (id) {
      case 'lead-only':
        return { showPhoto: true, showEvidence: false, evidenceStyle: 'inline' as const, bioMode: 'lead-only' as const, contentWidth: 'default' as const }
      case 'chips':
        return { showPhoto: true, showEvidence: true, evidenceStyle: 'chips' as const, bioMode: 'lead-plus-evidence' as const, contentWidth: 'default' as const }
      case 'no-photo':
        return { showPhoto: false, showEvidence: true, evidenceStyle: 'inline' as const, bioMode: 'lead-plus-evidence' as const, contentWidth: 'default' as const }
      case 'narrow':
        return { showPhoto: true, showEvidence: true, evidenceStyle: 'inline' as const, bioMode: 'lead-plus-evidence' as const, contentWidth: 'narrow' as const }
      case 'minimal':
        return { showPhoto: false, showEvidence: false, evidenceStyle: 'inline' as const, bioMode: 'lead-only' as const, contentWidth: 'default' as const }
      default:
        return { showPhoto: true, showEvidence: true, evidenceStyle: 'inline' as const, bioMode: 'lead-plus-evidence' as const, contentWidth: 'default' as const }
    }
  },
  Content,
  FineTuning,
}
