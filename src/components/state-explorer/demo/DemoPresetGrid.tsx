'use client'

import { presets, useDemoStore } from './demoStore'

export default function DemoPresetGrid() {
  const activePreset = useDemoStore((s) => s.activePreset)
  const applyPreset = useDemoStore((s) => s.applyPreset)

  return (
    <div className="grid grid-cols-2 gap-1">
      {presets.map((preset) => {
        const isActive = activePreset === preset.id
        return (
          <button
            key={preset.id}
            onClick={() => applyPreset(preset.id)}
            className="rounded-md border px-2 py-1 text-demo-sm font-medium transition-all duration-150 cursor-pointer hover:bg-neutral-50"
            style={
              isActive
                ? {
                    borderColor: '#000',
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0 0 0 1px #000',
                    color: '#000',
                  }
                : {
                    borderColor: 'var(--demo-border)',
                    backgroundColor: 'var(--demo-card)',
                    color: 'var(--demo-text)',
                  }
            }
          >
            {preset.label}
          </button>
        )
      })}
    </div>
  )
}
