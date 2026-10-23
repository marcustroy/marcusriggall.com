import Image from 'next/image'
import { heroContent, introContent } from '@/components/vignettes/hero/content'
import type { V4State } from './definition'

const scopeChips = [
  'AI features',
  'Platform strategy',
  'Multilingual expansion',
  'Prototyping in code',
]

const heroStatement = "I\u2019ve shaped product direction across AI, platform, and internationalisation\u2014prototyping in code and leading through craft."

export function Content({ state }: { state: V4State }) {
  const maxWidth =
    state.contentWidth === 'narrow' ? '900px' :
    state.contentWidth === 'wide' ? '1400px' : '1120px'

  const statementFontSize = state.statementSize === 'large' ? 36 : 30
  const statementMaxWidth = state.statementSize === 'large' ? 780 : 700

  const byline = (
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
  )

  return (
    <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ maxWidth, margin: '0 auto', padding: '80px 48px 72px' }}>

        {/* Header above: traditional ordering */}
        {state.headerPosition === 'above' && (
          <div style={{ marginBottom: 32 }}>
            {byline}
          </div>
        )}

        {/* Scope signals — promoted to top */}
        {state.showScope && (
          <div style={{ marginBottom: 20 }}>
            {state.scopeStyle === 'chips' ? (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {scopeChips.map((chip, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#666',
                      letterSpacing: '-0.01em',
                      padding: '4px 12px',
                      borderRadius: 100,
                      border: '1px solid #e0e0e0',
                      fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#888',
                letterSpacing: '0.04em',
                textTransform: 'uppercase' as const,
                margin: 0,
                fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
              }}>
                {scopeChips.join(' / ')}
              </p>
            )}
          </div>
        )}

        {/* Hero statement — reframed as argument, not self-description */}
        <p style={{
          fontSize: statementFontSize,
          fontWeight: 500,
          lineHeight: 1.35,
          letterSpacing: '-0.025em',
          color: '#111',
          maxWidth: statementMaxWidth,
          margin: 0,
          fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
        }}>
          {heroStatement}
        </p>

        {/* Byline below: name as quiet attribution */}
        {state.headerPosition === 'below' && (
          <div style={{ marginTop: 32 }}>
            {byline}
          </div>
        )}

      </div>
    </div>
  )
}
