import type { Metadata } from 'next'
import CaseStudyPage from '@/components/case-study/CaseStudyPage'
import { caseStudies } from '@/components/case-study/content'
import SensitiveCommentsPanel from '@/components/vignettes/sensitive-comments/SensitiveCommentsPanel'


const content = caseStudies['sensitive-comments-management']

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
      <SensitiveCommentsPanel />
    </CaseStudyPage>
  )
}
