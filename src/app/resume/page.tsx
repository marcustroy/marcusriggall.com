import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@kaizen/components'
import SiteHeaderBar from '@/components/SiteHeaderBar'
import '@/styles/kaizen.css'

export const metadata: Metadata = {
  title: 'Resume — Marcus Riggall',
  description: 'Resume for Marcus Riggall, Lead Product Designer.',
}

const EMAIL = 'marcusriggall@gmail.com'
const PHONE = '0402 922 595'

const experience = [
  {
    dates: '2021 – 2026',
    company: 'Culture Amp',
    role: 'Lead Product Designer',
    summary: 'Joined as a mid-level product designer in 2021, promoted to senior in 2022 and lead in 2024',
    groups: [
      {
        title: 'Work delivered to customers',
        bullets: [
          'Led the design of a two year rebuild of the Engagement reporting experience, moving from a monolith onto new infrastructure. As part of this rebuild we addressed long standing customer feedback tied to multi-million dollars of ARR in feature requests, covering both new functionality and pain points in the previous experience. We provided admin users with greater control over the data that could be shared, which resulted in more employees within an organisation receiving a report.',
          'Designed AI features for the flagship engagement product, including AI comment summaries (2023) and the Performance Culture Quadrant and Insights agents for Coach.',
          'Redesigned the survey welcome screen, resulting in a 9% increase in completion rates.',
          'Led the creation of a roles and permissions framework and strategy for the Engagement module, that expanded to influence the platform wide strategy, in collaboration with various teams and stakeholders across the organisation.',
        ],
      },
      {
        title: 'Design leadership, strategy and process improvement',
        bullets: [
          'Co-built and maintained the Design Sandbox with a small team of designers, so anyone could deploy and share AI prototypes from a single slash command. 15 designers and PMs adopted it.',
          'Prototyped the Performance Culture Quadrant leveraging AI and real survey data in a development environment that I co-built and maintained. The customer and internal testing that followed resulted in the Performance Culture Quadrant being funded by executive stakeholders.',
          'Designed and maintained the Engage domain design system, which fed back into the central Kaizen design system.',
          'Created the template for designers to present their work in product reviews, with director, VP and executive stakeholders, after designers raised concerns with the effort and time investment required.',
          'Provided design leadership across the organisation facilitating cross-domain design critiques, UI/UX working group participation, design system contribution, seconding to teams across the organisation to assist in defining their strategy and vision, and mentoring senior and mid-level designers.',
        ],
      },
    ],
  },
  {
    dates: '2021',
    company: 'A Cloud Guru / Pluralsight',
    role: 'Product Designer',
    bullets: [
      'Led qualitative and quantitative user research to understand customer pain points and needs in the administration, and reporting, of teams by admins of A Cloud Guru.',
      'Facilitated ideation workshops with cross-functional teams for rapid solution generation and alignment between the team and stakeholders.',
      'Worked with senior stakeholders, and multiple teams, to plan and execute the integration of the Linux Academy product into A Cloud Guru. This process involved analysing qualitative and quantitative data, conducting product audits, and working with product managers and engineers to assess integration viability, feasibility, and desirability.',
    ],
  },
  {
    dates: '2018 – 2021',
    company: 'Ento',
    role: 'Product Designer',
    bullets: [
      'Designed, implemented and maintained the design system in collaboration with front-end engineers to ensure a consistent design language which brought consistency to the product, as well as the design and engineering workflow.',
      'Collaboration within a cross functional trio conducting customer research, scoping and ideation, an iterative design process to gather customer feedback, working with engineering partners to understand feasibility and measuring the value delivered to customers via customer feedback and engagement metrics.',
    ],
  },
]

const education = [
  {
    dates: '2012 – 2014',
    company: 'La Trobe University Bendigo',
    role: 'Bachelor of Graphic Design',
  },
]

const references = [
  { name: 'Jazz Feldy', role: 'Design Director, Culture Amp', phone: '0402 520 120' },
  { name: 'Yau Hui Min', role: 'Senior Product Manager, formerly Culture Amp', phone: '0401 922 901' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 py-8 border-t border-border-strong md:grid-cols-[200px_1fr] md:gap-10">
      <h2 className="type-h3 text-primary">{title}</h2>
      <div className="flex flex-col gap-8">{children}</div>
    </section>
  )
}

function BulletList({ bullets }: { bullets: string[] }) {
  return (
    <ul className="mt-3 flex flex-col gap-2 list-disc pl-5 marker:text-secondary">
      {bullets.map((bullet) => (
        <li key={bullet} className="type-body text-primary">
          {bullet}
        </li>
      ))}
    </ul>
  )
}

function Entry({
  dates,
  company,
  role,
  summary,
  bullets,
  groups,
}: {
  dates: string
  company: string
  role: string
  /** Short note on how the role changed, shown as metadata under the role. */
  summary?: string
  bullets?: string[]
  /** Bullets split under sub-headings. */
  groups?: { title: string; bullets: string[] }[]
}) {
  return (
    <div>
      <p className="type-small text-secondary">{dates}</p>
      <h3 className="type-body font-medium text-primary mt-1">{company}</h3>
      <p className="type-body text-primary">{role}</p>
      {summary && <p className="type-small text-secondary mt-1">{summary}</p>}
      {bullets && <BulletList bullets={bullets} />}
      {groups?.map((group) => (
        <div key={group.title} className="mt-6">
          <h4 className="type-body font-medium text-primary">{group.title}</h4>
          <BulletList bullets={group.bullets} />
        </div>
      ))}
    </div>
  )
}

export default function ResumePage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="print:hidden border-b border-border/50 px-6 lg:px-10 2xl:px-16">
        <SiteHeaderBar />
      </header>
      <section className="pt-8 pb-12 lg:pb-20 px-6 lg:px-10 2xl:px-16">
        <div className="max-w-[1200px] mx-auto">
          <nav aria-label="Breadcrumb" className="print:hidden mb-8 lg:mb-12">
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
                Resume
              </li>
            </ol>
          </nav>

          <div className="max-w-[860px]">
            <h1>
              <Image
                src="/avatars/headshot.jpg"
                alt="Marcus Riggall"
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover object-top"
              />
            </h1>
            <p className="type-body text-primary mt-5">{EMAIL}</p>
            <p className="type-body text-primary">{PHONE}</p>
            <div className="mt-4">
              <a
                href="/resume.pdf"
                download="Marcus Riggall - Resume.pdf"
                className="print:hidden inline-flex items-center gap-1.5 type-small font-medium text-primary rounded-lg px-3 py-1 -ml-3 hover:bg-hover transition-colors duration-200"
              >
                Download as PDF
                <span className="kaizen-scope flex">
                  <Icon name="download" isPresentational />
                </span>
              </a>
            </div>

            <div className="mt-10">
              <Section title="Experience">
                {experience.map((item) => (
                  <Entry key={item.company} {...item} />
                ))}
                <p className="type-body text-secondary">
                  Designed homewares, digital marketing assets and client websites between 2015-2018
                </p>
              </Section>
              <Section title="Education">
                {education.map((item) => (
                  <Entry key={item.company} {...item} />
                ))}
              </Section>
              <Section title="References">
                {references.map((ref) => (
                  <div key={ref.name}>
                    <h3 className="type-body font-medium text-primary">{ref.name}</h3>
                    <p className="type-body text-primary">{ref.role}</p>
                    <p className="type-small text-secondary mt-1">{ref.phone}</p>
                  </div>
                ))}
              </Section>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
