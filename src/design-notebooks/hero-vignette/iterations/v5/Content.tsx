import { useState, useRef, useCallback } from 'react'
import type { V5State } from './definition'

const CARD_COLOR = '#6B7280'
const accentBorder = 'rgba(107, 114, 128, 0.18)'
const accentGlow = 'rgba(107, 114, 128, 0.12)'
const gradientFrom = '#F4F5F7'
const gradientTo = '#FFFFFF'

const approaches = [
  {
    number: '01',
    metric: '6,000+',
    qualifier: 'companies using AI features I shipped',
    heading: 'I don\u2019t stop at the user problem',
    body: 'Breadth across tech, data, and business uncovers what others miss.',
  },
  {
    number: '02',
    metric: '30+',
    qualifier: 'production interactions prototyped in code',
    heading: 'I design in the material of software',
    body: 'Prototyping in code means I feel how ideas work and speak engineers\u2019 language.',
  },
  {
    number: '03',
    metric: '3\u21928',
    qualifier: 'designers grown across 4 squads',
    heading: 'I build trust so people challenge my thinking',
    body: 'Psychological safety lets teams push back and arrive at better answers.',
  },
]

const signalChips = [
  'AI Product Design',
  'Design Engineering',
  'Design Leadership',
  'Enterprise SaaS',
]

type CardTilt = { x: number; y: number }

function TiltCard({ card }: { card: typeof approaches[number] }) {
  const [tilt, setTilt] = useState<CardTilt>({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const rafRef = useRef<number | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setTilt({ x: x * 15, y: -y * 15 })
    })
  }, [])

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }, [])

  const gradAngle = Math.round(tilt.x * 4 + 130)
  const sheenX = 50 + tilt.x * 3.3
  const sheenY = 50 - tilt.y * 3.3

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '800px',
        cursor: 'default',
      }}
    >
      <div
        style={{
          backgroundImage: `linear-gradient(170deg, ${gradientFrom} 0%, ${gradientTo} 50%)`,
          border: `1px solid ${accentBorder}`,
          borderRadius: 16,
          padding: '22px 22px 24px',
          transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transition: isHovered
            ? 'transform 0.1s ease-out, box-shadow 0.25s ease'
            : 'transform 0.5s ease-out, box-shadow 0.25s ease',
          transformStyle: 'preserve-3d' as const,
          willChange: 'transform',
          boxShadow: isHovered
            ? `0 20px 40px -8px rgba(0,0,0,0.1), 0 8px 16px -4px rgba(0,0,0,0.06), 0 0 0 1px ${accentBorder}, 0 0 24px ${accentGlow}`
            : `0 2px 8px -2px rgba(0,0,0,0.06), 0 0 0 1px ${accentBorder}`,
          position: 'relative' as const,
          overflow: 'hidden',
        }}
      >
        {/* Content layer */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Number + accent line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
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

          {/* Large display metric */}
          <div style={{
            fontSize: 30,
            fontWeight: 700,
            color: '#1a1a1a',
            lineHeight: 1.1,
            margin: '0 0 4px',
            letterSpacing: '-0.01em',
          }}>
            {card.metric}
          </div>

          {/* Metric qualifier */}
          <p style={{
            fontSize: 13,
            fontWeight: 500,
            color: '#6B7280',
            margin: '0 0 16px',
            lineHeight: 1.4,
          }}>
            {card.qualifier}
          </p>

          {/* Heading */}
          <h3 style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#111',
            margin: '0 0 5px',
            lineHeight: 1.35,
          }}>
            {card.heading}
          </h3>

          {/* Condensed body */}
          <p style={{
            fontSize: 13,
            lineHeight: 1.55,
            color: '#666',
            margin: 0,
          }}>
            {card.body}
          </p>
        </div>

        {/* Holographic sheen overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 16,
            pointerEvents: 'none' as const,
            backgroundImage: `linear-gradient(${gradAngle}deg, rgba(255,64,64,0.06) 0%, rgba(255,204,0,0.06) 14%, rgba(48,209,88,0.06) 28%, rgba(41,121,255,0.06) 42%, rgba(156,39,176,0.06) 57%, rgba(255,64,129,0.06) 71%, rgba(255,64,64,0.06) 85%, rgba(255,204,0,0.06) 100%)`,
            backgroundSize: '200% 200%',
            backgroundPosition: `${sheenX}% ${sheenY}%`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
            zIndex: 1,
          }}
        />

        {/* Light spot overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 16,
            pointerEvents: 'none' as const,
            backgroundImage: `radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 25%, transparent 55%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
            zIndex: 3,
          }}
        />
      </div>
    </div>
  )
}

export function Content({ state }: { state: V5State }) {
  const isStacked = state.layout === 'stacked'
  const [ctaHovered, setCtaHovered] = useState(false)

  return (
    <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', padding: '40px 40px 36px' }}>
      {/* Profile header */}
      <div style={{
        display: 'flex',
        flexDirection: isStacked ? 'column' : 'row',
        alignItems: isStacked ? 'center' : 'flex-start',
        gap: isStacked ? 20 : 32,
        marginBottom: 28,
      }}>
        {/* Profile photo -- 120px */}
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
          {/* Name -- large serif display */}
          <h1 style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 48,
            fontWeight: 400,
            margin: 0,
            color: '#111',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
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

          {/* Condensed headline */}
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

      {/* Approach cards -- 3D tilt hover, holographic sheen, evidence-first metrics */}
      {state.showCards && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 28,
        }}>
          {approaches.map((card) => (
            <TiltCard key={card.number} card={card} />
          ))}
        </div>
      )}

      {/* CTA button */}
      {state.showCTA && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 4,
          paddingBottom: 4,
        }}>
          <button
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#fff',
              background: ctaHovered ? '#333' : '#1a1a1a',
              border: 'none',
              borderRadius: 8,
              padding: '12px 28px',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            <span>See my work</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M8 3v10M4 9l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
