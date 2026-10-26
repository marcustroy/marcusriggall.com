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

export default function Page() {
  return (
    <CaseStudyPage content={content}>
      <PcqPanel />
    </CaseStudyPage>
  )
}
