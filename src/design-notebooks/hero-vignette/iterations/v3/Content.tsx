import { useState, useRef, useCallback } from 'react'
import type { V3State } from './definition'

const CARD_COLOR = '#6B7280'
const accentBorder = 'rgba(107, 114, 128, 0.18)'
const accentGlow = 'rgba(107, 114, 128, 0.12)'
const gradientFrom = '#F4F5F7'
const gradientTo = '#FFFFFF'

const approaches = [
  {
    number: '01',
    heading: 'I don\u2019t stop at the user problem',
    body: 'Breadth across tech, data, and business uncovers what others miss.',
    illustration: (color: string) => (
      <svg width="112" height="72" viewBox="0 0 112 72" fill="none">
        <polygon
          points={hexPoints(56, 36, 32, 0)}
          fill={color} fillOpacity="0.04"
          stroke={color} strokeWidth="1.5" strokeOpacity="0.15"
        />
        <polygon
          points={hexPoints(56, 36, 22, 15)}
          fill={color} fillOpacity="0.07"
          stroke={color} strokeWidth="1.5" strokeOpacity="0.3"
        />
        <polygon
          points={hexPoints(56, 36, 13, 30)}
          fill={color} fillOpacity="0.12"
          stroke={color} strokeWidth="2" strokeOpacity="0.5"
        />
      </svg>
    ),
  },
  {
    number: '02',
    heading: 'I design in the material of software',
    body: 'Prototyping in code means I feel how ideas work and speak engineers\u2019 language.',
    illustration: (color: string) => (
      <svg width="112" height="72" viewBox="0 0 112 72" fill="none">
        <path d="M24 20 L12 36 L24 52" stroke={color} strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M88 20 L100 36 L88 52" stroke={color} strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="42" y="22" width="28" height="28" rx="4" transform="rotate(45 56 36)" stroke={color} strokeWidth="2" strokeOpacity="0.5" fill={color} fillOpacity="0.1" />
        <line x1="56" y1="26" x2="56" y2="46" stroke={color} strokeWidth="1.5" strokeOpacity="0.25" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '03',
    heading: 'I build trust so people challenge my thinking',
    body: 'Psychological safety lets teams push back and arrive at better answers.',
    illustration: (color: string) => (
      <svg width="112" height="72" viewBox="0 0 112 72" fill="none">
        <rect x="28" y="12" width="6" height="48" rx="2" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.5" strokeOpacity="0.3" />
        <rect x="78" y="12" width="6" height="48" rx="2" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.5" strokeOpacity="0.3" />
        <rect x="28" y="10" width="56" height="6" rx="2" fill={color} fillOpacity="0.06" stroke={color} strokeWidth="1.5" strokeOpacity="0.25" />
        <line x1="40" y1="22" x2="72" y2="54" stroke={color} strokeWidth="2" strokeOpacity="0.35" strokeLinecap="round" />
        <line x1="72" y1="22" x2="40" y2="54" stroke={color} strokeWidth="2" strokeOpacity="0.35" strokeLinecap="round" />
      </svg>
    ),
  },
]

const signalChips = [
  'AI Product Design',
  'Design Engineering',
  'Design Leadership',
  'Enterprise SaaS',
]

function hexPoints(cx: number, cy: number, r: number, rotDeg: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = ((60 * i + rotDeg) * Math.PI) / 180
    const x = Math.round((cx + r * Math.cos(angle)) * 100) / 100
    const y = Math.round((cy + r * Math.sin(angle)) * 100) / 100
    return `${x},${y}`
  }).join(' ')
}

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
          padding: '24px 24px 28px',
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

          {/* Illustration */}
          <div style={{ marginBottom: 12 }}>
            {card.illustration(CARD_COLOR)}
          </div>

          {/* Heading */}
          <h3 style={{
            fontSize: 16,
            fontWeight: 600,
            color: '#111',
            margin: '0 0 6px',
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

export function Content({ state }: { state: V3State }) {
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

      {/* Approach cards -- 3D tilt hover, holographic sheen */}
      {state.showCards && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 32,
        }}>
          {approaches.map((card) => (
            <TiltCard key={card.number} card={card} />
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
