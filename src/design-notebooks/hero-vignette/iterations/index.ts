import type { IterationDefinitionEntry } from '../types'
import { baseline } from './baseline/definition'
import { v2 } from './v2/definition'
import { v3 } from './v3/definition'
import { v4 } from './v4/definition'
import { v5 } from './v5/definition'
import { v6 } from './v6/definition'

export const PROJECT = {
  title: 'Hero Vignette',
  description: ['Iterating on the hero section — profile, bio, and approach cards'],
}

export const ITERATIONS: IterationDefinitionEntry[] = [baseline, v2, v3, v4, v5, v6]
