import Image from 'next/image'
import { heroContent, introContent } from '@/components/vignettes/hero/content'
import type { V7State } from './definition'

const heroStatements = {
  craft: "I close the gap between what software can do and what people actually get out of it\u2014through design that ships in code, not just mockups.",
  evidence: "I\u2019ve spent a decade closing the gap between what software promises and what people experience, leading design across AI, platform strategy, and internationalisation.",
  builder: "I design by building\u2014prototyping directly in code to close the gap between what software can do and what people actually experience.",
}

const groundingLines = {
  impact: "At Culture Amp, that\u2019s meant leading design across AI features, platform strategy, and multilingual expansion\u2014work that shaped product direction, not just individual screens.",
  method: "I prototype in code to prove ideas before they ship, lead through craft, and build teams where high standards and psychological safety reinforce each other.",
  scope: "That work has shaped product direction across AI, platform strategy, and internationalisation at Culture Amp.",
}

export function Content({ state }: { state: V7State }) {
  const maxWidth =
    state.contentWidth === 'narrow' ? '900px' :
    state.contentWidth === 'wide' ? '1400px' : '1120px'

  return (
    <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ maxWidth, margin: '0 auto', padding: '80px 48px 72px' }}>

        {/* Hero statement — single-sentence, no preamble */}
        <p style={{
          fontSize: 32,
          fontWeight: 500,
          lineHeight: 1.32,
          letterSpacing: '-0.025em',
          color: '#111',
          maxWidth: 760,
          margin: 0,
          fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
        }}>
          {heroStatements[state.statementVariant]}
        </p>

        {/* Grounding line — evidence, tighter language */}
        {state.showGroundingLine && (
          <p style={{
            fontSize: 16,
            fontWeight: 400,
            lineHeight: 1.6,
            letterSpacing: '-0.01em',
            color: '#555',
            maxWidth: 580,
            margin: '36px 0 0 0',
            fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
          }}>
            {groundingLines[state.groundingVariant]}
          </p>
        )}

        {/* Thin rule — editorial separator */}
        {state.showRule && (
          <div style={{
            width: 40,
            height: 1,
            background: '#d4d4d4',
            marginTop: state.showGroundingLine ? 40 : 44,
          }} />
        )}

        {/* Byline — quieter, unified 14px level */}
        <div style={{ marginTop: state.showRule ? 28 : 44 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}>
            {state.showPhoto && (
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                <Image
                  src="/avatars/headshot.jpg"
                  alt={heroContent.name}
                  width={40}
                  height={40}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}
            <div>
              <div style={{
                fontSize: 14,
                fontWeight: 500,
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
                  style={{ opacity: 0.4, display: 'flex', alignItems: 'center' }}
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
