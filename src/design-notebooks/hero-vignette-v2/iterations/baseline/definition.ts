import type { IterationDefinition } from '../../types'
import { Content } from './Content'
import { FineTuning } from './controls'

export type BaselineState = {
  showSplash: boolean
  showApproachCards: boolean
  contentWidth: 'narrow' | 'default' | 'wide'
}

export const baseline: IterationDefinition<BaselineState> = {
  config: {
    label: 'Baseline',
    summary: 'Current hero section — profile, bio, approach cards',
  },
  defaultState: {
    showSplash: false,
    showApproachCards: true,
    contentWidth: 'default',
  },
  presets: [
    { id: 'default', label: 'Default (post-intro)', hint: 'Main landing state after intro animation' },
    { id: 'splash', label: 'Splash state', hint: 'Initial splash screen before content reveals' },
    { id: 'no-cards', label: 'Without cards', hint: 'Hero without approach cards section' },
    { id: 'narrow', label: 'Narrow container', hint: 'Constrained width layout' },
    { id: 'wide', label: 'Wide container', hint: 'Expanded width layout' },
  ],
  resolvePreset(id) {
    switch (id) {
      case 'splash':
        return { showSplash: true, showApproachCards: true, contentWidth: 'default' as const }
      case 'no-cards':
        return { showSplash: false, showApproachCards: false, contentWidth: 'default' as const }
      case 'narrow':
        return { showSplash: false, showApproachCards: true, contentWidth: 'narrow' as const }
      case 'wide':
        return { showSplash: false, showApproachCards: true, contentWidth: 'wide' as const }
      default:
        return { showSplash: false, showApproachCards: true, contentWidth: 'default' as const }
    }
  },
  Content,
  FineTuning,
}
