'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useDemoStore } from './demoStore'
import type { Version, ViewMode, GenerationStatus, MessageCount } from './demoStore'

/* -- Accordion Section -- */

function AccordionSection({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ border: '1px solid var(--demo-border)', backgroundColor: 'var(--demo-bg)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-2.5 py-2 cursor-pointer transition-colors hover:bg-black/[0.02]"
        style={{ color: 'var(--demo-text)' }}
      >
        <span className="text-demo-xs font-semibold">
          {label}
        </span>
        <ChevronDown
          className="w-3 h-3 transition-transform duration-200"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'var(--demo-text-2)',
          }}
        />
      </button>

      <div
        className="overflow-hidden transition-all duration-200"
        style={{
          maxHeight: open ? '200px' : '0px',
          opacity: open ? 1 : 0,
        }}
      >
        <div
          className="px-2.5 pb-2 space-y-2"
          style={{ borderTop: '1px solid var(--demo-border)' }}
        >
          <div className="pt-2 space-y-2">{children}</div>
        </div>
      </div>
    </div>
  )
}

/* -- Segmented Control -- */

function SegmentedControl<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-demo-xxs" style={{ color: 'var(--demo-text-2)' }}>
        {label}
      </span>
      <div
        className="flex rounded-md overflow-hidden"
        style={{ border: '1px solid var(--demo-border)' }}
      >
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => onChange(opt.value)}
            className="px-2 py-0.5 text-demo-micro font-medium transition-colors duration-150 cursor-pointer"
            style={{
              backgroundColor:
                value === opt.value ? 'var(--demo-text)' : 'var(--demo-card)',
              color:
                value === opt.value ? 'var(--demo-card)' : 'var(--demo-text-2)',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* -- Dropdown -- */

function Dropdown<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-demo-xxs" style={{ color: 'var(--demo-text-2)' }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="text-demo-micro font-medium rounded-md px-1.5 py-0.5 cursor-pointer outline-none appearance-none bg-no-repeat"
        style={{
          backgroundColor: 'var(--demo-card)',
          border: '1px solid var(--demo-border)',
          color: 'var(--demo-text)',
          paddingRight: '16px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 4px center',
          backgroundSize: '10px',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

/* -- Stepper -- */

function Stepper({
  label,
  value,
  steps,
  onChange,
}: {
  label: string
  value: number
  steps: number[]
  onChange: (v: number) => void
}) {
  const currentIndex = steps.indexOf(value)
  const canDecrement = currentIndex > 0
  const canIncrement = currentIndex < steps.length - 1

  return (
    <div className="flex items-center justify-between">
      <span className="text-demo-xxs" style={{ color: 'var(--demo-text-2)' }}>
        {label}
      </span>
      <div
        className="flex items-center rounded-md overflow-hidden"
        style={{ border: '1px solid var(--demo-border)' }}
      >
        <button
          onClick={() => canDecrement && onChange(steps[currentIndex - 1])}
          disabled={!canDecrement}
          className="px-1.5 py-0.5 text-demo-xs font-medium transition-colors cursor-pointer"
          style={{
            color: canDecrement ? 'var(--demo-text)' : 'var(--demo-border)',
            backgroundColor: 'var(--demo-card)',
            borderRight: '1px solid var(--demo-border)',
          }}
        >
          -
        </button>
        <span
          className="px-2 py-0.5 text-demo-micro font-semibold tabular-nums text-center"
          style={{
            color: 'var(--demo-text)',
            backgroundColor: 'var(--demo-bg)',
            minWidth: '20px',
          }}
        >
          {value}
        </span>
        <button
          onClick={() => canIncrement && onChange(steps[currentIndex + 1])}
          disabled={!canIncrement}
          className="px-1.5 py-0.5 text-demo-xs font-medium transition-colors cursor-pointer"
          style={{
            color: canIncrement ? 'var(--demo-text)' : 'var(--demo-border)',
            backgroundColor: 'var(--demo-card)',
            borderLeft: '1px solid var(--demo-border)',
          }}
        >
          +
        </button>
      </div>
    </div>
  )
}

/* -- Toggle -- */

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-demo-xxs" style={{ color: 'var(--demo-text-2)' }}>
        {label}
      </span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative rounded-full overflow-hidden transition-colors duration-150 cursor-pointer"
        style={{
          width: 28,
          height: 16,
          backgroundColor: checked ? 'var(--demo-text)' : 'var(--demo-border)',
        }}
      >
        <span
          className="absolute rounded-full transition-transform duration-150"
          style={{
            width: 10,
            height: 10,
            top: 3,
            left: 3,
            backgroundColor: 'var(--demo-card)',
            transform: checked ? 'translateX(12px)' : 'translateX(0)',
          }}
        />
      </button>
    </div>
  )
}

/* -- Main Controls -- */

export default function DemoControls() {
  const version = useDemoStore((s) => s.version)
  const viewMode = useDemoStore((s) => s.viewMode)
  const generationStatus = useDemoStore((s) => s.generationStatus)
  const messageCount = useDemoStore((s) => s.messageCount)

  const setVersion = useDemoStore((s) => s.setVersion)
  const setViewMode = useDemoStore((s) => s.setViewMode)
  const setGenerationStatus = useDemoStore((s) => s.setGenerationStatus)
  const setMessageCount = useDemoStore((s) => s.setMessageCount)

  return (
    <div className="space-y-1.5">
      <AccordionSection label="Preview">
        <SegmentedControl
          label="Version"
          value={version}
          options={[
            { value: 1 as Version, label: 'v1' },
            { value: 2 as Version, label: 'v2' },
          ]}
          onChange={setVersion}
        />
        <Toggle
          label="Code view"
          checked={viewMode === 'code'}
          onChange={(on) => setViewMode(on ? 'code' : 'preview')}
        />
      </AccordionSection>

      <AccordionSection label="Generation">
        <Dropdown
          label="Status"
          value={generationStatus}
          options={[
            { value: 'idle' as GenerationStatus, label: 'Idle' },
            { value: 'generating' as GenerationStatus, label: 'Generating' },
            { value: 'complete' as GenerationStatus, label: 'Complete' },
            { value: 'error' as GenerationStatus, label: 'Error' },
          ]}
          onChange={setGenerationStatus}
        />
        <Stepper
          label="Messages"
          value={messageCount}
          steps={[0, 2, 3, 4]}
          onChange={(v) => setMessageCount(v as MessageCount)}
        />
      </AccordionSection>
    </div>
  )
}
