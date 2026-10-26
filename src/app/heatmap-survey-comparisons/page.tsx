import type { Metadata } from 'next'
import CaseStudyPage from '@/components/case-study/CaseStudyPage'
import { caseStudies } from '@/components/case-study/content'
import HeatmapPanel from '@/components/vignettes/heatmap-comparisons/HeatmapPanel'

const content = caseStudies['heatmap-survey-comparisons']

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
      <HeatmapPanel />
    </CaseStudyPage>
  )
}
