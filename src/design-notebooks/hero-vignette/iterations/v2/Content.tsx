import type { V2State } from './definition'

const CARD_COLOR = '#6B7280'
const accentBorder = 'rgba(107, 114, 128, 0.18)'
const gradientFrom = '#F4F5F7'
const gradientTo = '#FFFFFF'

const approaches = [
  {
    number: '01',
    heading: 'I don\u2019t stop at the user problem',
    body: 'I dig into the tech, the data, and the business context. That breadth has helped me expand project scope, challenge assumptions, and find opportunities others miss.',
  },
  {
    number: '02',
    heading: 'I design in the material of software',
    body: 'I prototype in code so I can interact with my ideas and feel how they work. It means I speak engineers\u2019 language and understand constraints early.',
  },
  {
    number: '03',
    heading: 'I build trust so people challenge my thinking',
    body: 'The best work comes from psychological safety. I invest in relationships so my teams feel comfortable pushing back, sparring openly, and arriving at better answers together.',
  },
]

const signalChips = [
  'AI Product Design',
  'Design Engineering',
  'Design Leadership',
  'Platform Strategy',
]

export function Content({ state }: { state: V2State }) {
  const isStacked = state.layout === 'stacked'

  return (
    <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', padding: '48px 40px 40px' }}>
      {/* Profile header */}
      <div style={{
        display: 'flex',
        flexDirection: isStacked ? 'column' : 'row',
        alignItems: isStacked ? 'center' : 'flex-start',
        gap: isStacked ? 24 : 32,
        marginBottom: 32,
      }}>
        {/* Profile photo */}
        <div style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <img
            src="/avatars/headshot.jpg"
            alt="Idam Adam"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Name, role, headline, chips */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          textAlign: isStacked ? 'center' : 'left',
          alignItems: isStacked ? 'center' : 'flex-start',
        }}>
          {/* Name */}
          <h1 style={{
            fontFamily: "'Silkscreen', monospace",
            fontSize: 32,
            fontWeight: 400,
            margin: 0,
            color: '#111',
            lineHeight: 1.1,
          }}>
            Idam Adam
          </h1>

          {/* Role + company */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 18,
            fontWeight: 500,
            color: '#111',
          }}>
            <span>Lead Product Designer at</span>
            <img
              src="/logos/cultureamp.svg"
              alt="Culture Amp"
              style={{ height: 14, width: 'auto', opacity: 0.75 }}
            />
          </div>

          {/* Condensed headline — first bio line only */}
          <p style={{
            fontSize: 17,
            lineHeight: 1.55,
            color: '#444',
            margin: 0,
            maxWidth: 560,
          }}>
            I design intelligent and thoughtful software that makes complex, high-stakes problems feel simple.
          </p>

          {/* Signal chips */}
          {state.showChips && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: 4,
            }}>
              {signalChips.map((chip) => (
                <span
                  key={chip}
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#555',
                    background: '#F3F4F6',
                    border: '1px solid #E5E7EB',
                    borderRadius: 20,
                    padding: '4px 14px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Approach cards — horizontal row, no rotation, no overlap */}
      {state.showCards && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 32,
        }}>
          {approaches.map((card) => (
            <div
              key={card.number}
              style={{
                backgroundImage: `linear-gradient(170deg, ${gradientFrom} 0%, ${gradientTo} 50%)`,
                border: `1px solid ${accentBorder}`,
                borderRadius: 16,
                padding: '24px 24px 28px',
                boxShadow: `0 2px 8px -2px rgba(0,0,0,0.06), 0 0 0 1px ${accentBorder}`,
              }}
            >
              {/* Number + accent line */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                  color: CARD_COLOR,
                }}>
                  {card.number}
                </span>
                <div style={{ flex: 1, height: 1, background: accentBorder }} />
              </div>

              {/* Heading */}
              <h3 style={{
                fontSize: 16,
                fontWeight: 600,
                color: '#111',
                margin: '0 0 8px',
                lineHeight: 1.35,
              }}>
                {card.heading}
              </h3>

              {/* Body */}
              <p style={{
                fontSize: 14,
                lineHeight: 1.65,
                color: '#444',
                margin: 0,
              }}>
                {card.body}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Scroll CTA */}
      {state.showCTA && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 8,
          paddingBottom: 8,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            fontWeight: 500,
            color: '#888',
            cursor: 'pointer',
          }}>
            <span>See my work</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              style={{ opacity: 0.6 }}
            >
              <path
                d="M8 3v10M4 9l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}
