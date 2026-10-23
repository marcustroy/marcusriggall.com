'use client'

import '@/design-notebooks/hero-vignette-v2/index.css'
import '@/design-notebooks/_harness/notebook.css'
import NotebookApp from '@/design-notebooks/_harness/NotebookApp'
import { ITERATIONS, PROJECT } from '@/design-notebooks/hero-vignette-v2/iterations'

export default function HeroVignetteV2Notebook() {
  return <NotebookApp iterations={ITERATIONS} project={PROJECT} />
}
