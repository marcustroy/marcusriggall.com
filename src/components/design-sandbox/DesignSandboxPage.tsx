'use client'

import SiteHeaderBar from '@/components/SiteHeaderBar'
import Link from 'next/link'
import PrototypingVignette from '@/components/vignettes/prototyping/PrototypingVignette'

export default function DesignSandboxPage() {
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
                Design Sandbox
              </li>
            </ol>
          </nav>
          <PrototypingVignette />
        </div>
      </section>
    </div>
  )
}
