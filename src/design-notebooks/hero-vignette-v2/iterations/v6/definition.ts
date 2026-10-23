import type { IterationDefinition } from '../../types'
import { Content } from './Content'
import { FineTuning } from './controls'

export type V6State = {
  showPhoto: boolean
  showGroundingLine: boolean
  statementSize: 'default' | 'large'
  contentWidth: 'narrow' | 'default' | 'wide'
  groundingVariant: 'evidence' | 'method' | 'scope'
  statementVariant: 'direct' | 'reframe' | 'closing'
}

export const v6: IterationDefinition<V6State> = {
  config: {
    label: 'v6',
    summary: 'Dropped "I believe" hedge for direct voice. Separated statement from method. Increased vertical rhythm between beats for editorial pacing.',
    changes: [
      '− "I believe" opener (LinkedIn hedge)',
      '+ direct declarative voice',
      '+ statement variants testing specificity',
      '+ increased spacing between beats (32px, 44px)',
      '+ cooler gray palette (#555 grounding, #999 byline)',
      '− compressed em-dash grounding line',
    ],
  },
  defaultState: {
    showPhoto: true,
    showGroundingLine: true,
    statementSize: 'default',
    contentWidth: 'default',
    groundingVariant: 'evidence',
    statementVariant: 'direct',
  },
  presets: [
    { id: 'default', label: 'Default', hint: 'Direct statement with evidence grounding' },
    { id: 'reframe', label: 'Reframe statement', hint: 'Statement as observed problem, not belief' },
    { id: 'closing', label: 'Closing the gap', hint: 'Positions the gap-closing as method' },
    { id: 'method-grounding', label: 'Method grounding', hint: 'Grounding line emphasises prototyping in code' },
    { id: 'no-grounding', label: 'Statement only', hint: 'Just the statement and byline, no grounding' },
    { id: 'large-direct', label: 'Large + direct', hint: 'Bigger statement for more visual weight' },
  ],
  resolvePreset(id) {
    const base: V6State = { showPhoto: true, showGroundingLine: true, statementSize: 'default', contentWidth: 'default', groundingVariant: 'evidence', statementVariant: 'direct' }
    switch (id) {
      case 'reframe':
        return { ...base, statementVariant: 'reframe' }
      case 'closing':
        return { ...base, statementVariant: 'closing' }
      case 'method-grounding':
        return { ...base, groundingVariant: 'method' }
      case 'no-grounding':
        return { ...base, showGroundingLine: false }
      case 'large-direct':
        return { ...base, statementSize: 'large' }
      default:
        return base
    }
  },
  Content,
  FineTuning,
}
