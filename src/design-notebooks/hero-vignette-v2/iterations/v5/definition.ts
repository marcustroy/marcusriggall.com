import type { IterationDefinition } from '../../types'
import { Content } from './Content'
import { FineTuning } from './controls'

export type V5State = {
  showPhoto: boolean
  showGroundingLine: boolean
  statementSize: 'default' | 'large'
  contentWidth: 'narrow' | 'default' | 'wide'
  groundingTone: 'evidence' | 'scope' | 'method'
}

export const v5: IterationDefinition<V5State> = {
  config: {
    label: 'v5',
    summary: 'Replaced scope chips and resume-line statement with a genuine argument — a belief about design, grounded by a single evidence line',
    changes: [
      '− scope chips (redundant with statement)',
      '+ belief-led statement replacing scope claim',
      '+ grounding line connecting belief to evidence',
      '− em-dash compound sentence',
      '+ two-beat rhythm: argument, then proof',
    ],
  },
  defaultState: {
    showPhoto: true,
    showGroundingLine: true,
    statementSize: 'default',
    contentWidth: 'default',
    groundingTone: 'evidence',
  },
  presets: [
    { id: 'default', label: 'Default', hint: 'Belief statement with evidence grounding line' },
    { id: 'large-statement', label: 'Large statement', hint: 'Bigger hero text for more visual weight' },
    { id: 'scope-grounding', label: 'Scope grounding', hint: 'Grounding line emphasises breadth of scope' },
    { id: 'method-grounding', label: 'Method grounding', hint: 'Grounding line emphasises prototyping in code' },
    { id: 'no-grounding', label: 'Statement only', hint: 'Just the belief statement and byline' },
    { id: 'narrow', label: 'Narrow container', hint: 'Constrained width for focused reading' },
  ],
  resolvePreset(id) {
    switch (id) {
      case 'large-statement':
        return { showPhoto: true, showGroundingLine: true, statementSize: 'large' as const, contentWidth: 'default' as const, groundingTone: 'evidence' as const }
      case 'scope-grounding':
        return { showPhoto: true, showGroundingLine: true, statementSize: 'default' as const, contentWidth: 'default' as const, groundingTone: 'scope' as const }
      case 'method-grounding':
        return { showPhoto: true, showGroundingLine: true, statementSize: 'default' as const, contentWidth: 'default' as const, groundingTone: 'method' as const }
      case 'no-grounding':
        return { showPhoto: true, showGroundingLine: false, statementSize: 'default' as const, contentWidth: 'default' as const, groundingTone: 'evidence' as const }
      case 'narrow':
        return { showPhoto: true, showGroundingLine: true, statementSize: 'default' as const, contentWidth: 'narrow' as const, groundingTone: 'evidence' as const }
      default:
        return { showPhoto: true, showGroundingLine: true, statementSize: 'default' as const, contentWidth: 'default' as const, groundingTone: 'evidence' as const }
    }
  },
  Content,
  FineTuning,
}
