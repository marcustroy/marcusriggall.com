'use client'

import '@/design-notebooks/hero-vignette/index.css'
import '@/design-notebooks/_harness/notebook.css'
import NotebookApp from '@/design-notebooks/_harness/NotebookApp'
import { ITERATIONS, PROJECT } from '@/design-notebooks/hero-vignette/iterations'

export default function HeroVignetteNotebook() {
  return <NotebookApp iterations={ITERATIONS} project={PROJECT} />
}
