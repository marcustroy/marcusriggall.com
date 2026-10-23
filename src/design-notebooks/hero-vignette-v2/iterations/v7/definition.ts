import type { IterationDefinition } from '../../types'
import { Content } from './Content'
import { FineTuning } from './controls'

export type V7State = {
  showPhoto: boolean
  showGroundingLine: boolean
  statementVariant: 'craft' | 'evidence' | 'builder'
  groundingVariant: 'impact' | 'method' | 'scope'
  showRule: boolean
  contentWidth: 'narrow' | 'default' | 'wide'
}

export const v7: IterationDefinition<V7State> = {
  config: {
    label: 'v7',
    summary: 'Tightened statement to single-sentence construction. Replaced "not just pixels" cliche. Added thin rule for editorial structure. Collapsed 15/14 type levels. Refined weight hierarchy.',
    changes: [
      '+ single-sentence hero statement (no two-beat split)',
      '+ thin rule separating statement from attribution',
      '− "not just pixels" cliche in grounding',
      '+ collapsed byline type to one size (14px)',
      '+ name weight dropped to 500 (defers to statement)',
      '+ grounding line rewritten with sharper evidence',
    ],
  },
  defaultState: {
    showPhoto: true,
    showGroundingLine: true,
    statementVariant: 'craft',
    groundingVariant: 'impact',
    showRule: true,
    contentWidth: 'default',
  },
  presets: [
    { id: 'default', label: 'Default', hint: 'Craft-led statement with impact grounding and rule' },
    { id: 'evidence-led', label: 'Evidence-led', hint: 'Statement foregrounds career track record' },
    { id: 'builder', label: 'Builder voice', hint: 'Emphasises building over drawing' },
    { id: 'no-rule', label: 'Without rule', hint: 'Default without the horizontal rule' },
    { id: 'minimal', label: 'Minimal', hint: 'Statement and byline only, no grounding or rule' },
    { id: 'method-grounding', label: 'Method grounding', hint: 'Grounding line emphasises how, not what' },
  ],
  resolvePreset(id) {
    const base: V7State = {
      showPhoto: true,
      showGroundingLine: true,
      statementVariant: 'craft',
      groundingVariant: 'impact',
      showRule: true,
      contentWidth: 'default',
    }
    switch (id) {
      case 'evidence-led':
        return { ...base, statementVariant: 'evidence' }
      case 'builder':
        return { ...base, statementVariant: 'builder' }
      case 'no-rule':
        return { ...base, showRule: false }
      case 'minimal':
        return { ...base, showGroundingLine: false, showRule: false }
      case 'method-grounding':
        return { ...base, groundingVariant: 'method' }
      default:
        return base
    }
  },
  Content,
  FineTuning,
}
