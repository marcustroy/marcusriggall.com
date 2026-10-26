import type { Metadata } from 'next'
import CaseStudyPage from '@/components/case-study/CaseStudyPage'
import { caseStudies } from '@/components/case-study/content'


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
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg border border-neutral-200 p-10 text-center">
        <p className="type-small text-secondary">Sensitive Comments Management preview coming soon</p>
      </div>
    </CaseStudyPage>
  )
}
