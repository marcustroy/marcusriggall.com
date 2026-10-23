'use client'

import { X } from 'lucide-react'
import DemoPresetGrid from './DemoPresetGrid'
import DemoControls from './DemoControls'

interface DemoPanelProps {
  open: boolean
  onClose: () => void
}

export default function DemoPanel({ open, onClose }: DemoPanelProps) {
  return (
    <>
      <style jsx global>{`
        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes rotateGradient {
          to {
            --gradient-angle: 360deg;
          }
        }
      `}</style>

      {/* Outer positioning wrapper */}
      <div
        className="absolute z-50 w-[calc(100%-16px)] sm:w-[260px] transition-all duration-200 origin-top-left"
        style={{
          top: '8px',
          left: '8px',
          isolation: 'isolate',
          opacity: open ? 1 : 0,
          transform: open ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-4px)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-xl opacity-50 -z-10"
          style={{
            background:
              'conic-gradient(from var(--gradient-angle), #FFB600, #FF5C0B, #9A36B2, #FF5C0B, #FFB600)',
            filter: 'blur(24px)',
            animation: 'rotateGradient 3s linear infinite',
          }}
        />

        {/* Gradient border */}
        <div
          className="rounded-xl p-[2px]"
          style={{
            background:
              'conic-gradient(from var(--gradient-angle), #FFB600, #FF5C0B, #9A36B2, #FF5C0B, #FFB600)',
            animation: 'rotateGradient 3s linear infinite',
          }}
        >
          {/* Inner content */}
          <div
            className="rounded-[14px] overflow-hidden shadow-xl flex flex-col"
            style={{
              backgroundColor: 'var(--demo-card)',
              maxHeight: 'min(460px, calc(100vh - 80px))',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-3 py-2.5 border-b flex-shrink-0"
              style={{ borderColor: 'var(--demo-border)' }}
            >
              <span
                className="text-demo-md font-semibold tracking-tight"
                style={{ color: 'var(--demo-text)' }}
              >
                States
              </span>
              <button
                onClick={onClose}
                className="p-0.5 rounded transition-colors cursor-pointer hover:bg-neutral-100"
                style={{ color: 'var(--demo-text-2)' }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1">
              {/* Presets */}
              <div className="px-2.5 pt-2.5 pb-2">
                <DemoPresetGrid />
              </div>

              {/* Fine-tuning controls */}
              <div
                className="px-2.5 pb-2.5 pt-2"
                style={{ borderTop: '1px solid var(--demo-border)' }}
              >
                <DemoControls />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
