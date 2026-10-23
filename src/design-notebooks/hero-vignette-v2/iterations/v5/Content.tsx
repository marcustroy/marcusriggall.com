import Image from 'next/image'
import { heroContent, introContent } from '@/components/vignettes/hero/content'
import type { V5State } from './definition'

const heroStatement = "I believe design should close the gap between what software can do and what people actually experience."

const groundingLines = {
  evidence: "At Culture Amp, I\u2019ve led that work across AI features, platform strategy, and multilingual expansion\u2014prototyping in code to prove ideas before they ship.",
  scope: "That belief has shaped product direction across AI, platform strategy, and internationalisation at Culture Amp.",
  method: "I close that gap by prototyping directly in code, leading through craft, and building high-trust teams that ship with conviction.",
}

export function Content({ state }: { state: V5State }) {
  const maxWidth =
    state.contentWidth === 'narrow' ? '900px' :
    state.contentWidth === 'wide' ? '1400px' : '1120px'

  const statementFontSize = state.statementSize === 'large' ? 38 : 32
  const statementMaxWidth = state.statementSize === 'large' ? 800 : 720

  return (
    <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ maxWidth, margin: '0 auto', padding: '80px 48px 72px' }}>

        {/* Hero statement — a belief, not a resume line */}
        <p style={{
          fontSize: statementFontSize,
          fontWeight: 500,
          lineHeight: 1.3,
          letterSpacing: '-0.025em',
          color: '#111',
          maxWidth: statementMaxWidth,
          margin: 0,
          fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
        }}>
          {heroStatement}
        </p>

        {/* Grounding line — the "so what" evidence beat */}
        {state.showGroundingLine && (
          <p style={{
            fontSize: 17,
            fontWeight: 400,
            lineHeight: 1.55,
            letterSpacing: '-0.01em',
            color: '#666',
            maxWidth: 600,
            margin: '24px 0 0 0',
            fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
          }}>
            {groundingLines[state.groundingTone]}
          </p>
        )}

        {/* Byline — quiet attribution */}
        <div style={{ marginTop: 36 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}>
            {state.showPhoto && (
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                <Image
                  src="/avatars/headshot.jpg"
                  alt={heroContent.name}
                  width={44}
                  height={44}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}
            <div>
              <div style={{
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                color: '#111',
                fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
              }}>
                {heroContent.name}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 2,
              }}>
                <span style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: '#888',
                  letterSpacing: '-0.01em',
                  fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
                }}>
                  {introContent.role}
                </span>
                <a
                  href={heroContent.companies[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ opacity: 0.5, display: 'flex', alignItems: 'center' }}
                >
                  <Image
                    src={heroContent.companies[0].logo}
                    alt={heroContent.companies[0].name}
                    width={103}
                    height={15}
                    style={{ height: 12, width: 'auto' }}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
