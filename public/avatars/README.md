# Avatar Images

This directory contains avatar images for the portfolio demo components.

## Current Avatars (SVG Placeholders)

Simple SVG placeholders with initials and unique colors:

1. **idam.svg** - Idam's profile avatar (IA, indigo background)
2. **sarah-chen.svg** - Sarah Chen (SC, pink background)
3. **mike-torres.svg** - Mike Torres (MT, green background)
4. **alex-kim.svg** - Alex Kim (AK, amber background)
5. **jordan-lee.svg** - Jordan Lee (JL, purple background)

## Upgrading to Custom Avatars (Optional)

To replace with custom avatars from Nano Banana or similar service:

- **Recommended size**: 96x96px (displayed at 24x24 to 48x48 for retina displays)
- **Format**: PNG or SVG with transparent background
- **File names**: Keep the same filenames (e.g., `idam.svg` or `idam.png`)
- **Style**: Consistent across all avatars
- **Unique**: Each person should have a distinct, recognizable avatar

## Usage

These avatars are used in:
- `src/components/vignettes/ai-highlights/HighlightsPanel.tsx` - Problem and solution states
- `src/components/vignettes/ai-highlights/content.ts` - Referenced in problemCards data
