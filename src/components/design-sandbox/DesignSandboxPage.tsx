'use client'

import CaseStudyPage from '@/components/case-study/CaseStudyPage'
import { caseStudies } from '@/components/case-study/content'
import SandboxPanel from '@/components/vignettes/prototyping/SandboxPanel'

export default function DesignSandboxPage() {
  return (
    <CaseStudyPage content={caseStudies['design-sandbox']}>
      <SandboxPanel activeStory={null} />
    </CaseStudyPage>
  )
}
