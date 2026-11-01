import type { Metadata } from 'next'
import CaseStudyPage from '@/components/case-study/CaseStudyPage'
import { caseStudies } from '@/components/case-study/content'
import PcqPanel from '@/components/vignettes/pcq/PcqPanel'

const content = caseStudies['performance-culture-quadrant']

export const metadata: Metadata = {
  title: `${content.projectName} — Marcus Riggall`,
  description: content.headline,
  openGraph: {
    title: `${content.projectName} — Marcus Riggall`,
    description: content.headline,
    type: 'website',
  },
}

// The stepped walkthrough (components/vignettes/pcq/walkthrough) is no longer shown here; this description
// pulls its four steps into one paragraph.
const description =
  'The Performance Culture Quadrant maps Workplace Engagement and Performance Confidence into culture states, backed by Culture Amp People Science, enabling organisations to see where they sit, how they compare to benchmarks and identify groups in need of support. The Insights Explorer allows leaders to dig into the data behind the favorable score, while Coach helps leaders explore survey themes, understand their results and decide on the next best action.'

export default function Page() {
  return (
    <CaseStudyPage content={content}>
      <div className="max-w-[1000px]">
        <div className="theme-light">
          <PcqPanel sideBySide />
        </div>
        <p className="type-body mt-6 max-w-[760px] text-secondary">{description}</p>
      </div>
    </CaseStudyPage>
  )
}
