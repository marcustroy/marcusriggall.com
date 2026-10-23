import type { IterationDefinition } from '@/design-notebooks/_harness/types'
import { Content } from './Content'

export type V3bState = {
  step: 'choose' | 'permissions' | 'connected'
  toolIndex: number
}

export const v3b: IterationDefinition<V3bState> = {
  config: {
    label: 'v3b — Spotlight',
    summary: 'Focused OAuth-style flow — one tool at a time',
    changes: ['+ permission screen', '+ capability checklist', '+ focused flow'],
  },
  defaultState: {
    step: 'choose',
    toolIndex: 0,
  },
  presets: [
    { id: 'default', label: 'Choose tool', hint: 'Tool picker' },
    { id: 'permissions-linear', label: 'Linear permissions', hint: 'Linear OAuth flow' },
    { id: 'permissions-jira', label: 'Jira permissions', hint: 'Jira OAuth flow' },
    { id: 'permissions-asana', label: 'Asana permissions', hint: 'Asana OAuth flow' },
    { id: 'connected', label: 'Connected', hint: 'Success state' },
  ],
  resolvePreset(id) {
    switch (id) {
      case 'permissions-linear': return { step: 'permissions' as const, toolIndex: 0 }
      case 'permissions-jira': return { step: 'permissions' as const, toolIndex: 1 }
      case 'permissions-asana': return { step: 'permissions' as const, toolIndex: 2 }
      case 'connected': return { step: 'connected' as const, toolIndex: 0 }
      default: return { step: 'choose' as const, toolIndex: 0 }
    }
  },
  Content,
}
