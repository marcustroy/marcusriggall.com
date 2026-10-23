# Vignette structure

- `types.ts` holds shared interfaces (stages, design notes, iterations, problem cards).
- Each vignette lives in its own folder with a `content.ts` file next to the component and any vignette-specific types.
- Demo panels take data via props from the vignette rather than importing a global data file.

Example shape:
```
src/components/vignettes/ai-highlights/
  content.ts           # copy/stage data for the vignette
  AIHighlightsVignette.tsx
```
