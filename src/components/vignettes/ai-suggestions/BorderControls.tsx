import { useEffect, useRef, useState } from 'react';
import { colorPresets, speedPresets, glowPresets } from './content';
import type { BorderSettings } from './content';

interface BorderControlsProps {
  borderSettings: BorderSettings;
  onBorderSettingsChange: (settings: BorderSettings) => void;
  highlighted?: boolean;
}

export default function BorderControls({
  borderSettings,
  onBorderSettingsChange,
}: BorderControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative z-20 inline-flex shrink-0">
      <button
        type="button"
        className={`size-6 flex items-center justify-center rounded-full border bg-white/85 backdrop-blur-sm shadow-sm transition-all duration-150 hover:scale-105 ${
          isOpen
            ? 'border-black/20 opacity-100'
            : 'border-border/70 opacity-70 hover:border-black/20 hover:opacity-100'
        }`}
        aria-label="Show border controls"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span
          className="size-3 rounded-full"
          style={{
            background:
              'conic-gradient(var(--ai-gradient-1), var(--ai-gradient-2), var(--ai-gradient-3), var(--ai-gradient-1))',
          }}
        />
      </button>

      <div
        className={`absolute right-0 bottom-8 w-[244px] rounded-lg border border-border/70 bg-white/95 p-2.5 shadow-[0_12px_36px_rgba(0,0,0,0.10)] backdrop-blur-sm transition-all duration-150 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-1 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] leading-4 text-tertiary">Border style</span>
          <div className="inline-flex rounded-full bg-black/5 p-0.5">
            {colorPresets.map((preset) => {
              const isActive =
                borderSettings.colors[0] === preset.colors[0] &&
                borderSettings.colors[1] === preset.colors[1] &&
                borderSettings.colors[2] === preset.colors[2];
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() =>
                    onBorderSettingsChange({
                      ...borderSettings,
                      colors: preset.colors,
                    })
                  }
                  className={`px-2 py-0.5 rounded-full text-[11px] leading-4 font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[11px] leading-4 text-tertiary">Motion</span>
          <div className="inline-flex rounded-full bg-black/5 p-0.5">
            {speedPresets.map((preset) => {
              const isActive = borderSettings.speed === preset.value;
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() =>
                    onBorderSettingsChange({
                      ...borderSettings,
                      speed: preset.value,
                    })
                  }
                  className={`px-2 py-0.5 rounded-full text-[11px] leading-4 font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[11px] leading-4 text-tertiary">Glow</span>
          <div className="inline-flex rounded-full bg-black/5 p-0.5">
            {glowPresets.map((preset) => {
              const isActive = borderSettings.glow === preset.value;
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() =>
                    onBorderSettingsChange({
                      ...borderSettings,
                      glow: preset.value,
                    })
                  }
                  className={`px-2 py-0.5 rounded-full text-[11px] leading-4 font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
