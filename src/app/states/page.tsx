import type { Metadata } from 'next'
import { codeToHtml } from 'shiki'
import StateExplorerPage from '@/components/state-explorer/StateExplorerPage'
import { promptText } from '@/components/state-explorer/prompt'

const installCommand = `npx skills add idamadam/skills --skill states`

const codeViewSource = `export default function PricingCard() {
  return (
    <div className="flex gap-4">
      <TierCard name="Basic" price={9} />
      <TierCard name="Pro" popular />
      <TierCard name="Team" price={79} />
    </div>
  )
}`

export const metadata: Metadata = {
  title: 'States — Idam Adam',
  description:
    'A prompt that figures out which states your prototype has, then builds you a panel to flip between them. Works with Claude Code, Cursor, Codex, Figma Make, or any other coding agent.',
  openGraph: {
    title: 'States — Reach any prototype state in one click',
    description:
      'A prompt that figures out which states your prototype has, then builds you a panel to flip between them. Works with Claude Code, Cursor, Codex, Figma Make, or any other coding agent.',
    url: 'https://idamadam.com/states',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'States — Reach any prototype state in one click',
    description:
      'A prompt that figures out which states your prototype has, then builds you a panel to flip between them. Works with Claude Code, Cursor, Codex, Figma Make, or any other coding agent.',
  },
}

export default async function Page() {
  const [rawPromptHtml, rawCodeHtml, rawInstallCommandHtml] = await Promise.all([
    codeToHtml(promptText, { lang: 'markdown', theme: 'github-light' }),
    codeToHtml(codeViewSource, { lang: 'tsx', theme: 'github-dark' }),
    codeToHtml(installCommand, { lang: 'bash', theme: 'github-dark' }),
  ])

  // Strip Shiki's default background and inject word-wrap styles
  const highlightedPrompt = rawPromptHtml
    .replace(/background-color:[^;"]+;?/, '')
    .replace(
      /(<pre[^>]*style=")/,
      '$1white-space:pre-wrap;word-break:break-word;overflow-wrap:break-word;padding:0;margin:0;'
    )

  const highlightedCode = rawCodeHtml
    .replace(/background-color:[^;"]+;?/, '')
    .replace(
      /(<pre[^>]*style=")/,
      '$1padding:0;margin:0;'
    )

  const highlightedInstallCommand = rawInstallCommandHtml
    .replace(/background-color:[^;"]+;?/g, '')
    .replace(
      /(<pre[^>]*style=")/,
      '$1white-space:pre-wrap;word-break:break-all;overflow-wrap:break-word;padding:0;margin:0;background:transparent;'
    )
    .replace(
      /(<code[^>]*style=")/,
      '$1background:transparent;'
    )

  return (
    <StateExplorerPage
      highlightedPrompt={highlightedPrompt}
      highlightedCode={highlightedCode}
      highlightedInstallCommand={highlightedInstallCommand}
    />
  )
}
