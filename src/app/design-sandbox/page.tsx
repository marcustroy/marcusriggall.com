import type { Metadata } from 'next'
import DesignSandboxPage from '@/components/design-sandbox/DesignSandboxPage'

const description =
  'Part of the small team of designers who maintained and improved an internal repository to make AI prototyping faster and easier for designers and product managers.'

export const metadata: Metadata = {
  title: 'Design Sandbox — Marcus Riggall',
  description,
  openGraph: {
    title: 'Design Sandbox — Marcus Riggall',
    description,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design Sandbox — Marcus Riggall',
    description,
  },
}

export default function Page() {
  return <DesignSandboxPage />
}
