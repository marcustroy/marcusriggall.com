import type { IterationDefinition } from '@/design-notebooks/_harness/types'
import { Content } from './Content'

export type V4State = {
  step: 'cards' | 'permissions' | 'plan'
  toolIndex: number
}

export const v4: IterationDefinition<V4State> = {
  config: {
    label: 'v4',
    summary: 'Converged — cards → OAuth → execution plan',
    changes: ['+ cards from v3a', '+ OAuth from v3b', '+ plan from v3c', '− separate approaches'],
  },
  defaultState: {
    step: 'cards',
    toolIndex: 0,
  },
  presets: [
    { id: 'default', label: 'Cards', hint: 'Choose a tool' },
    { id: 'permissions', label: 'Permissions', hint: 'OAuth confirmation' },
    { id: 'plan', label: 'Execution plan', hint: 'Connected, ready to run' },
  ],
  resolvePreset(id) {
    switch (id) {
      case 'permissions': return { step: 'permissions' as const, toolIndex: 0 }
      case 'plan': return { step: 'plan' as const, toolIndex: 0 }
      default: return { step: 'cards' as const, toolIndex: 0 }
    }
  },
  Content,
}
