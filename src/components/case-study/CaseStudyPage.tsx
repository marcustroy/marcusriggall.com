'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import SiteHeaderBar from '@/components/SiteHeaderBar'
import VignetteContainer from '@/components/vignettes/VignetteContainer'
import VignetteSplit from '@/components/vignettes/VignetteSplit'
import DecisionStories from '@/components/vignettes/shared/DecisionStories'
import LinkedText from '@/components/vignettes/shared/LinkedText'
import { Stage, STAGE_PADDING, STAGE_TINTS } from '@/components/Stage'
import { fadeInUp } from '@/lib/animations'
import type { CaseStudyContent } from './content'

interface CaseStudyPageProps {
  content: CaseStudyContent
  /** The interactive UI shown beside the write-up. */
  children: React.ReactNode
}

// Shared layout for work case studies: breadcrumb, write-up on the left, interactive UI on the right.
export default function CaseStudyPage({ content, children }: CaseStudyPageProps) {
  const breadcrumb = (
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
  )

  // UI-first layout: a full-width tinted band (nav, headline, UI) above a white write-up.
  if (content.uiAbove) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-white">
        <div style={{ backgroundColor: content.tint ?? STAGE_TINTS[content.stageId] }}>
          <header className="px-6 lg:px-10 2xl:px-16">
            <SiteHeaderBar onTint />
          </header>
          <section className="pt-8 pb-8 lg:pb-10 px-6 lg:px-10 2xl:px-16">
            <div className="max-w-[1200px] mx-auto">
              {breadcrumb}
              <motion.div {...fadeInUp} className="max-w-[760px] mb-8">
                <h1 className="type-h2 text-primary">{content.headline}</h1>
                {content.meta && <p className="type-small text-secondary mt-3">{content.meta}</p>}
              </motion.div>
              <VignetteContainer id={content.slug} allowOverflow>
                {content.unstaged ? (
                  children
                ) : (
                  <Stage id={content.stageId} frameless>
                    {children}
                  </Stage>
                )}
              </VignetteContainer>
            </div>
          </section>
        </div>
        <section className="pt-12 lg:pt-20 pb-12 lg:pb-20 px-6 lg:px-10 2xl:px-16">
          <motion.div {...fadeInUp} className="max-w-[1200px] mx-auto">
            {content.columns ? (
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
                {content.columns.map((column) => (
                  <div key={column.heading} className="min-w-0">
                    <h2 className="type-h3 text-primary">{column.heading}</h2>
                    {column.body && (
                      <p className="type-body text-primary mt-5 whitespace-pre-line">
                        <LinkedText text={column.body} />
                      </p>
                    )}
                    {column.stories && <DecisionStories stories={column.stories} alwaysExpanded />}
                  </div>
                ))}
              </div>
            ) : (
              <>
                {content.body && (
                  <p className="type-body text-primary max-w-[760px] whitespace-pre-line">
                    <LinkedText text={content.body} />
                  </p>
                )}
                {/* Each story gets its own column */}
                <div
                  className={`grid grid-cols-1 gap-10 md:gap-12 ${content.body ? 'mt-10' : ''} ${
                    content.decisionStories.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
                  }`}
                >
                  {content.decisionStories.map((story) => (
                    <div key={story.id} className="min-w-0 [&>div]:!mt-0">
                      <DecisionStories stories={[story]} alwaysExpanded />
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="border-b border-border/50 px-6 lg:px-10 2xl:px-16">
        <SiteHeaderBar />
      </header>
      <section className="pt-8 pb-12 lg:pb-20 px-6 lg:px-10 2xl:px-16">
        <div className="max-w-[1200px] mx-auto">
          {breadcrumb}

          <VignetteContainer id={content.slug} allowOverflow>
            <motion.div {...fadeInUp}>
              <VignetteSplit
                columnsClass={content.wideUi ? 'xl:grid-cols-[360px_1fr] 2xl:grid-cols-[360px_1fr]' : undefined}
                title={
                  <div className="flex flex-col">
                    <h1 className="type-h2 text-primary">{content.headline}</h1>
                    {content.meta && <p className="type-small text-secondary mt-3">{content.meta}</p>}
                    {content.body && (
                      <p className="type-body text-primary mt-5 whitespace-pre-line">
                        <LinkedText text={content.body} />
                      </p>
                    )}
                    <DecisionStories stories={content.decisionStories} alwaysExpanded />
                  </div>
                }
              >
                <div className="relative w-full min-w-0" style={{ overflow: 'visible' }}>
                  {content.unstaged ? (
                    children
                  ) : (
                    <Stage id={content.stageId} className={STAGE_PADDING}>
                      {children}
                    </Stage>
                  )}
                </div>
              </VignetteSplit>
            </motion.div>
          </VignetteContainer>
        </div>
      </section>
    </div>
  )
}
