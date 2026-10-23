import type { IterationDefinitionEntry } from '@/design-notebooks/_harness/types'
import { baseline } from './baseline/definition'
import { v2 } from './v2/definition'
import { v3a } from './v3a/definition'
import { v3b } from './v3b/definition'
import { v3c } from './v3c/definition'
import { v4 } from './v4/definition'

export const PROJECT = {
  title: 'Connect AI to work tools',
  description: ['Iterating on how an AI agent communicates its plan before taking action'],
}

export const ITERATIONS: IterationDefinitionEntry[] = [
  baseline,
  v2,
  { group: [v3a, v3b, v3c] },
  v4,
]
