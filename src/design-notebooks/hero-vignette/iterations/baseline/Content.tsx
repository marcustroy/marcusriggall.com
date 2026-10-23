import { IntroSequenceProvider } from '@/lib/intro-sequence-context'
import HeroVignette from '@/components/vignettes/hero/HeroVignette'
import type { BaselineState } from './definition'

export function Content({ state }: { state: BaselineState }) {
  const maxWidth =
    state.contentWidth === 'narrow' ? '1024px' :
    state.contentWidth === 'wide' ? '1600px' : '1408px'

  return (
    <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
      <IntroSequenceProvider>
        <div style={{ maxWidth, margin: '0 auto' }}>
          <HeroVignette />
        </div>
      </IntroSequenceProvider>
    </div>
  )
}
