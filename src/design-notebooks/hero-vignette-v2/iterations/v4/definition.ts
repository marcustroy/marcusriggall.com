import type { IterationDefinition } from '../../types'
import { Content } from './Content'
import { FineTuning } from './controls'

export type V4State = {
  showPhoto: boolean
  headerPosition: 'above' | 'below'
  showScope: boolean
  scopeStyle: 'inline' | 'chips'
  statementSize: 'default' | 'large'
  contentWidth: 'narrow' | 'default' | 'wide'
}

export const v4: IterationDefinition<V4State> = {
  config: {
    label: 'v4',
    summary: 'Flipped hierarchy: led with specific scope, reframed statement as argument not self-description, demoted byline below statement',
    changes: [
      '+ scope signals promoted above statement',
      '+ reframed hero copy as argument',
      '+ byline moved below hero statement',
      '− self-describing adjectives in lead',
      '− evidence line (absorbed into statement)',
      '+ configurable header position',
    ],
  },
  defaultState: {
    showPhoto: true,
    headerPosition: 'below',
    showScope: true,
    scopeStyle: 'chips',
    statementSize: 'default',
    contentWidth: 'default',
  },
  presets: [
    { id: 'default', label: 'Default', hint: 'Scope chips, hero argument, byline below' },
    { id: 'header-above', label: 'Header above', hint: 'Traditional name-first, then scope and statement' },
    { id: 'large-statement', label: 'Large statement', hint: 'Bigger hero text for more visual weight' },
    { id: 'no-scope', label: 'Without scope', hint: 'Just the hero argument and byline' },
    { id: 'narrow', label: 'Narrow container', hint: 'Constrained width for focused reading' },
    { id: 'minimal', label: 'Minimal', hint: 'No photo, no scope, statement and name only' },
  ],
  resolvePreset(id) {
    switch (id) {
      case 'header-above':
        return { showPhoto: true, headerPosition: 'above' as const, showScope: true, scopeStyle: 'chips' as const, statementSize: 'default' as const, contentWidth: 'default' as const }
      case 'large-statement':
        return { showPhoto: true, headerPosition: 'below' as const, showScope: true, scopeStyle: 'chips' as const, statementSize: 'large' as const, contentWidth: 'default' as const }
      case 'no-scope':
        return { showPhoto: true, headerPosition: 'below' as const, showScope: false, scopeStyle: 'chips' as const, statementSize: 'default' as const, contentWidth: 'default' as const }
      case 'narrow':
        return { showPhoto: true, headerPosition: 'below' as const, showScope: true, scopeStyle: 'chips' as const, statementSize: 'default' as const, contentWidth: 'narrow' as const }
      case 'minimal':
        return { showPhoto: false, headerPosition: 'below' as const, showScope: false, scopeStyle: 'chips' as const, statementSize: 'default' as const, contentWidth: 'default' as const }
      default:
        return { showPhoto: true, headerPosition: 'below' as const, showScope: true, scopeStyle: 'chips' as const, statementSize: 'default' as const, contentWidth: 'default' as const }
    }
  },
  Content,
  FineTuning,
}
