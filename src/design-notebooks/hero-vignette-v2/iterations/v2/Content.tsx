import Image from 'next/image'
import { heroContent, introContent } from '@/components/vignettes/hero/content'
import type { V2State } from './definition'

const approaches = [
  {
    heading: 'I don\u2019t stop at the user problem',
    body: 'I dig into the tech, the data, and the business context to find opportunities others miss.',
  },
  {
    heading: 'I design in the material of software',
    body: 'I prototype in code so I can feel how ideas work and speak engineers\u2019 language.',
  },
  {
    heading: 'I build trust so people challenge my thinking',
    body: 'The best work comes from psychological safety and open sparring.',
  },
]

// Compressed single bio line that captures the essence
const compressedBio = "I design intelligent software that makes complex problems feel simple, prototyping in code to bridge design and engineering. I lead through craft and high-trust environments."

export function Content({ state }: { state: V2State }) {
  const maxWidth =
    state.contentWidth === 'narrow' ? '900px' :
    state.contentWidth === 'wide' ? '1400px' : '1120px'

  const leadLine = introContent.lines[0]
  const supportingLines = introContent.lines.slice(1)

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      <div style={{
        maxWidth,
        margin: '0 auto',
        padding: '80px 48px 64px',
      }}>
        {/* Header: photo + name + role */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 48,
        }}>
          {state.showPhoto && (
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              <Image
                src="/avatars/headshot.jpg"
                alt={heroContent.name}
                width={72}
                height={72}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
          <div>
            <h1 style={{
              fontSize: 24,
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
              marginTop: 4,
            }}>
              <span style={{
                fontSize: 16,
                fontWeight: 400,
                color: '#555',
                letterSpacing: '-0.01em',
                fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
              }}>
                {introContent.role}
              </span>
              <a
                href={heroContent.companies[0].url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ opacity: 0.7, display: 'flex', alignItems: 'center' }}
              >
                <Image
                  src={heroContent.companies[0].logo}
                  alt={heroContent.companies[0].name}
                  width={103}
                  height={15}
                  style={{ height: 14, width: 'auto' }}
                />
              </a>
            </div>
          </div>
        </div>

        {/* Hero statement — the lead line, elevated */}
        <p style={{
          fontSize: 32,
          fontWeight: 500,
          lineHeight: 1.35,
          letterSpacing: '-0.025em',
          color: '#111',
          maxWidth: 720,
          margin: '0 0 32px 0',
          fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
        }}>
          {leadLine}
        </p>

        {/* Supporting bio */}
        {state.bioMode !== 'lead-only' && (
          <div style={{
            maxWidth: 640,
            marginBottom: state.showApproaches ? 56 : 0,
          }}>
            {state.bioMode === 'compressed' ? (
              <p style={{
                fontSize: 17,
                fontWeight: 400,
                lineHeight: 1.65,
                color: '#555',
                letterSpacing: '-0.01em',
                margin: 0,
                fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
              }}>
                {compressedBio}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {supportingLines.map((line, i) => (
                  <p key={i} style={{
                    fontSize: 17,
                    fontWeight: 400,
                    lineHeight: 1.65,
                    color: '#555',
                    letterSpacing: '-0.01em',
                    margin: 0,
                    fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
                  }}>
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Approaches — lightweight text, no cards */}
        {state.showApproaches && (
          <div style={{
            borderTop: '1px solid #e5e5e5',
            paddingTop: 40,
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 40,
            }}>
              {approaches.map((approach, i) => (
                <div key={i}>
                  <h3 style={{
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: 1.4,
                    letterSpacing: '-0.02em',
                    color: '#111',
                    margin: '0 0 8px 0',
                    fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
                  }}>
                    {approach.heading}
                  </h3>
                  <p style={{
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: 1.65,
                    color: '#777',
                    margin: 0,
                    fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
                  }}>
                    {approach.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
