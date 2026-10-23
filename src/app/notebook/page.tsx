import type { Metadata } from 'next'
import DesignNotebookPage from '@/components/design-notebook/DesignNotebookPage'

export const metadata: Metadata = {
  title: 'Design Notebook — Idam Adam',
  description:
    'Design Notebook builds an interactive timeline of your design iterations. Diverge into multiple directions, pick the best parts, and always know how you got here.',
  openGraph: {
    title: 'Design Notebook — Keep the decision trail when designing with AI',
    description:
      'Design Notebook builds an interactive timeline of your design iterations. Diverge into multiple directions, pick the best parts, and always know how you got here.',
    url: 'https://idamadam.com/notebook',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design Notebook — Keep the decision trail when designing with AI',
    description:
      'Design Notebook builds an interactive timeline of your design iterations. Diverge into multiple directions, pick the best parts, and always know how you got here.',
  },
}

export default function Page() {
  return <DesignNotebookPage />
}
