import Image from 'next/image'
import { heroContent, introContent } from '@/components/vignettes/hero/content'
import type { V3State } from './definition'

const evidenceChips = [
  'AI features',
  'Platform strategy',
  'Multilingual expansion',
  'Prototyping in code',
]

const evidenceLine = "I\u2019ve shaped product direction for AI features, platform strategy, and multilingual expansion\u2014prototyping in code and leading through craft."

export function Content({ state }: { state: V3State }) {
  const maxWidth =
    state.contentWidth === 'narrow' ? '900px' :
    state.contentWidth === 'wide' ? '1400px' : '1120px'

  const leadLine = introContent.lines[0]

  return (
    <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ maxWidth, margin: '0 auto', padding: '80px 48px 72px' }}>
        {/* Header: photo + name + role — tighter to statement */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 28,
        }}>
          {state.showPhoto && (
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              <Image
                src="/avatars/headshot.jpg"
                alt={heroContent.name}
                width={56}
                height={56}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
          <div>
            <h1 style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              margin: 0,
              color: '#111',
              fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
            }}>
              {heroContent.name}
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 3,
            }}>
              <span style={{
                fontSize: 15,
                fontWeight: 400,
                color: '#666',
                letterSpacing: '-0.01em',
                fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
              }}>
                {introContent.role}
              </span>
              <a
                href={heroContent.companies[0].url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ opacity: 0.6, display: 'flex', alignItems: 'center' }}
              >
                <Image
                  src={heroContent.companies[0].logo}
                  alt={heroContent.companies[0].name}
                  width={103}
                  height={15}
                  style={{ height: 13, width: 'auto' }}
                />
              </a>
            </div>
          </div>
        </div>

        {/* Hero statement */}
        <p style={{
          fontSize: 32,
          fontWeight: 500,
          lineHeight: 1.35,
          letterSpacing: '-0.025em',
          color: '#111',
          maxWidth: 720,
          margin: 0,
          fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
        }}>
          {leadLine}
        </p>

        {/* Evidence — concrete scope signals */}
        {state.showEvidence && state.bioMode === 'lead-plus-evidence' && (
          <div style={{ marginTop: 24, maxWidth: 640 }}>
            {state.evidenceStyle === 'chips' ? (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {evidenceChips.map((chip, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#555',
                      letterSpacing: '-0.01em',
                      padding: '5px 12px',
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
                fontSize: 16,
                fontWeight: 400,
                lineHeight: 1.6,
                color: '#666',
                letterSpacing: '-0.01em',
                margin: 0,
                fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
              }}>
                {evidenceLine}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
