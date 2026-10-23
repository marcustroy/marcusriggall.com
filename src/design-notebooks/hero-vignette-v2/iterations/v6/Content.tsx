import Image from 'next/image'
import { heroContent, introContent } from '@/components/vignettes/hero/content'
import type { V6State } from './definition'

const heroStatements = {
  direct: "Design should close the gap between what software promises and what people actually experience. I close it by prototyping in code.",
  reframe: "Most software has a gap between what it can do and what people get out of it. I\u2019ve spent my career closing that gap through design.",
  closing: "The gap between what software can do and what people actually experience is a design problem. I close it by building, not just drawing.",
}

const groundingLines = {
  evidence: "At Culture Amp, that\u2019s meant leading design across AI features, platform strategy, and multilingual expansion\u2014shipping work that changed product direction, not just pixels.",
  method: "I prototype directly in code to prove ideas before they ship, lead through craft, and build high-trust teams that hold a high bar.",
  scope: "That work has shaped product direction across AI, platform strategy, and internationalisation at Culture Amp.",
}

export function Content({ state }: { state: V6State }) {
  const maxWidth =
    state.contentWidth === 'narrow' ? '900px' :
    state.contentWidth === 'wide' ? '1400px' : '1120px'

  const statementFontSize = state.statementSize === 'large' ? 38 : 32
  const statementMaxWidth = state.statementSize === 'large' ? 820 : 740

  return (
    <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ maxWidth, margin: '0 auto', padding: '80px 48px 72px' }}>

        {/* Hero statement — declarative, no hedge */}
        <p style={{
          fontSize: statementFontSize,
          fontWeight: 500,
          lineHeight: 1.32,
          letterSpacing: '-0.025em',
          color: '#111',
          maxWidth: statementMaxWidth,
          margin: 0,
          fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
        }}>
          {heroStatements[state.statementVariant]}
        </p>

        {/* Grounding line — evidence, separated from statement */}
        {state.showGroundingLine && (
          <p style={{
            fontSize: 16,
            fontWeight: 400,
            lineHeight: 1.6,
            letterSpacing: '-0.01em',
            color: '#555',
            maxWidth: 580,
            margin: '32px 0 0 0',
            fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
          }}>
            {groundingLines[state.groundingVariant]}
          </p>
        )}

        {/* Byline — quiet attribution, more breathing room */}
        <div style={{ marginTop: 44 }}>
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
                marginTop: 3,
              }}>
                <span style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: '#999',
                  letterSpacing: '-0.01em',
                  fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
                }}>
                  {introContent.role}
                </span>
                <a
                  href={heroContent.companies[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ opacity: 0.45, display: 'flex', alignItems: 'center' }}
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
