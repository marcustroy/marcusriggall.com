'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import SiteHeaderBar from '@/components/SiteHeaderBar'
import VignetteContainer from '@/components/vignettes/VignetteContainer'
import VignetteSplit from '@/components/vignettes/VignetteSplit'
import DecisionStories from '@/components/vignettes/shared/DecisionStories'
import { Stage, stagePadding } from '@/components/Stage'
import { fadeInUp } from '@/lib/animations'
import type { CaseStudyContent } from './content'

interface CaseStudyPageProps {
  content: CaseStudyContent
  /** The interactive UI shown beside the write-up. */
  children: React.ReactNode
}

// Shared layout for work case studies: breadcrumb, write-up on the left, interactive UI on the right.
export default function CaseStudyPage({ content, children }: CaseStudyPageProps) {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="border-b border-border/50 px-6 lg:px-10 2xl:px-16">
        <SiteHeaderBar />
      </header>
      <section className="pt-8 pb-12 lg:pb-20 px-6 lg:px-10 2xl:px-16">
        <div className="max-w-[1200px] mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8 lg:mb-12">
            <ol className="flex items-center gap-2 type-small">
              <li>
                <Link href="/" className="text-secondary hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-secondary">
                /
              </li>
              <li aria-current="page" className="text-primary">
                {content.projectName}
              </li>
            </ol>
          </nav>

          <VignetteContainer id={content.slug} allowOverflow>
            <motion.div {...fadeInUp}>
              <VignetteSplit
                title={
                  <div className="flex flex-col">
                    <h1 className="type-h2 text-primary">{content.headline}</h1>
                    {content.body && <p className="type-body text-primary mt-5">{content.body}</p>}
                    <DecisionStories stories={content.decisionStories} alwaysExpanded />
                  </div>
                }
              >
                <div className="relative w-full min-w-0" style={{ overflow: 'visible' }}>
                  <Stage id={content.stageId} className={stagePadding(content.stageId)}>
                    {children}
                  </Stage>
                </div>
              </VignetteSplit>
            </motion.div>
          </VignetteContainer>
        </div>
      </section>
    </div>
  )
}
