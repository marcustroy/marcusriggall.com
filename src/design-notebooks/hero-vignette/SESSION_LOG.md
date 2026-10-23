# Hero Vignette — Autonomous Iteration Session Log

**Date**: 2026-03-23
**Method**: Claude Code (Opus 4.6) orchestrating eval + creation subagents in a loop
**Iterations**: 5 rounds (baseline → v6)
**Goal**: Explore hero section design for recruiter appeal
**Human involvement**: Prompt only — all evaluation, iteration, and verification was fully autonomous
**Harness**: [design-notebook skill](https://github.com/idamadam/skills/tree/main/plugins/design-notebook) — a Claude Code skill that scaffolds a design iteration notebook with chrome, presets, state explorer, and decision trail

This session was run **entirely by Claude Code** after a single human prompt. No human reviewed or steered the design between iterations. The main thread orchestrated the loop, spawning subagents for evaluation and creation, and using preview tools to verify each iteration rendered correctly before proceeding.

The design-notebook skill provided the iteration harness — each variation is a self-contained folder with `Content.tsx`, `definition.ts`, and `controls.tsx`, rendered in a vertical canvas with lightweight chrome showing what changed and why. The notebook's append-only `ITERATIONS` array and decision trail gave the autonomous loop a structured place to log each step.

---

## The Prompt

The human's request (paraphrased, then refined into a plan):

> I'm curious to understand how you go about using the preview environment where it is loaded up and how you go about running like 5 iterations yourself using a design notebook.
>
> The workflow is something like: check the current version, then make a couple of changes, then have it be logged, then run an eval on that and then make a couple more iterations.
>
> This is designed to be my portfolio website, I want it to be a good representation of myself to recruiters.
>
> For implementation, I reckon you can be the main thread and then you execute a subagent to create an iteration, then another subagent for eval etc, maybe try 5 runs?

### Agreed Plan

1. Start the preview server, navigate to the design notebook, screenshot the baseline
2. For each of 5 rounds:
   - **Step A — Evaluate** (subagent): Receive latest screenshot + description, assess against recruiter-appeal criteria, suggest one direction for next iteration
   - **Step B — Create** (subagent): Receive eval feedback, copy previous iteration folder, build new Content.tsx / definition.ts / controls.tsx, update index.ts
   - **Step C — Verify** (main thread): Screenshot the rendered result, check for console errors, fix issues if needed, then loop back

The human chose "Explore freely" when asked what aspects to focus on — layout, content, or visual polish.

---

## Setup

Started preview server, navigated to `/design-notebooks/hero-vignette`, screenshotted baseline at multiple scroll positions and viewport sizes (1280x800 desktop, 1280x2400 tall).

---

## Round 1: Baseline → v2

### Eval of Baseline

**Strengths:**
- Strong opening bio line — clear, confident value proposition
- Approach cards are a genuine differentiator (how this designer works, not a generic skills list)
- Role + company immediately legible with Culture Amp logo

**Weaknesses:**
- Bio is 3 paragraphs (~75 words) — too dense for 5-second scanning. Paragraph 3 packs AI, platform strategy, multilingual, leadership, psych safety into one block
- Fanned cards overlap at -6/0/+6 degree rotation — body text on cards 01 and 03 is partially obscured. 2 of 3 cards effectively invisible without hovering
- No CTA or scroll indicator — hero is a dead end

**Direction chosen:** Collapse bio to single headline + signal chips, unfan cards into readable row.

### v2 Created

- Bio → single line ("I design intelligent and thoughtful software...")
- Added 4 signal chips: AI Product Design, Design Engineering, Design Leadership, Platform Strategy
- Cards laid out as flat 3-column grid (no rotation, no overlap)
- Added "See my work ↓" CTA
- All content hardcoded in iteration (self-contained copy)

---

## Round 2: v2 → v3

### Eval of v2

**Strengths:**
- Bio compression was the right call — recruiter will actually read it now
- Signal chips create fast pattern-matching for keyword-scanning recruiters
- Cards are now legible — all three headings visible simultaneously

**Weaknesses:**
- Visual personality dropped significantly — baseline had fanned 3D cards with holographic foil, sparkle textures. v2 is static gray boxes. Looks like a Notion template.
- "Platform Strategy" is the weakest chip — vague filler
- Card body text still too dense for hero at 14px in narrow columns

**Direction chosen:** Restore 3D hover tilt + holographic sheen on cards while keeping flat grid. Condense card body to single sentence. Add back SVG illustrations.

### v3 Created

- TiltCard component with `perspective(800px) rotateX/rotateY` on mousemove
- Holographic rainbow gradient overlay + radial light spot on hover
- SVG illustrations: nested hexagons (card 01), code brackets (card 02), gate/X (card 03)
- Card body condensed to single sentence each
- "Platform Strategy" → "Enterprise SaaS"

---

## Round 3: v3 → v4

### Eval of v3

**Strengths:**
- Profile section hits right info density — photo + name + company + headline + chips in one scan
- Card copy is genuinely differentiating (first-person value props, not capability labels)
- Interaction layer earns its complexity — craft signal without requiring interaction to read

**Weaknesses:**
- SVG illustrations read as placeholders — too abstract, no semantic connection to card content. "Concentric hexagons" doesn't map to "breadth across tech, data, business"
- Name in monospace undersells seniority — reads "developer personal site" not "Lead Product Designer"
- "See my work" CTA visually orphaned — #888 gray at 14px with no container

**Direction chosen:** Replace illustrations with concrete proof-point metrics, upgrade name to serif display, strengthen CTA to proper button.

### v4 Created

- Name: Georgia serif at 48px, fontWeight 400, slight negative letter-spacing
- Profile photo: confirmed at 120px
- Cards: SVG illustrations removed, replaced with proof-point lines:
  - "Shipped AI features used by 6,000+ companies"
  - "Prototyped 30+ production interactions in code"
  - "Grew team from 3 to 8 designers across 4 squads"
- CTA: dark button (#1a1a1a bg, white text, 12px 28px padding, rounded, hover state)

---

## Round 4: v4 → v5

### Eval of v4

**Strengths:**
- Proof points replace illustrations without losing info density — each anchors the heading claim in something verifiable
- Typography upgrade from monospace to Georgia serif is significant improvement — editorial, senior feel
- CTA upgrade from ghost text to solid dark button actually functions as a call to action

**Weaknesses:**
- Proof-point metrics at 12px / #9CA3AF are lowest-contrast element on card — fails WCAG AA (~2.5:1). The differentiating content is the hardest thing to read. Hierarchy is inverted.
- Cards are now entirely text with no visual anchor — three uniformly gray rectangles with similar text layouts
- CTA may sit below fold on 13-inch laptops (1280x720)

**Direction chosen:** Promote metrics to large display numbers (28-32px, bold, dark) as primary card visual anchor. Evidence-first persuasion pattern: big metric → heading → body.

### v5 Created

- Card metrics: 30px, fontWeight 700, #1a1a1a — "6,000+", "30+", "3→8"
- Qualifier text: 13px, #6B7280
- Card heading: 15px (below metric in hierarchy)
- Tighter spacing throughout: top padding 48→40px, margins reduced
- CTA padding reduced to keep above fold

---

## Round 5: v5 → v6

### Eval of v5

**Overall grade: B+**

**Strengths:**
- Evidence as entry point — large bold numbers in first 2 seconds
- Signal chips as "SEO for human attention"
- One-viewport discipline — no scroll needed to decide whether to keep reading

**Weaknesses:**
- "3→8" is ambiguous — arrow notation requires parsing, unlike self-evident "6,000+" and "30+"
- Single bio line may feel thin for Lead-level seniority

**Direction chosen:** Fix "3→8" to just "8" with clearer qualifier. Add subtle LinkedIn icon. Final spacing polish.

### v6 Created (Final)

- Card 03 metric: "3→8" → "8", qualifier: "designers I've built a team of, across 4 squads"
- LinkedIn icon: 18px inline SVG, gray default, darkens on hover, placed next to CTA button
- CTA container updated to flex row with gap for LinkedIn icon
- Minor spacing adjustments

---

## Design Evolution Summary

| Version | Focus | Key Move |
|---------|-------|----------|
| Baseline | Starting point | Full HeroVignette with fanned 3D cards |
| v2 | Readability | Condensed bio + chips, flat card grid |
| v3 | Personality | Restored 3D hover + illustrations |
| v4 | Credibility | Proof metrics, serif name, real CTA button |
| v5 | Impact | Large display metrics as card anchors |
| v6 | Polish | Clearer "8" metric, LinkedIn link |

## Key Decisions

1. **Bio compression** (v2): 3 paragraphs → 1 line. The first paragraph was always the strongest.
2. **Signal chips** (v2): Keyword-scannable pills replace dropped bio content. "Enterprise SaaS" replaced "Platform Strategy" in v3.
3. **Card readability vs craft** (v2→v3): Flat grid for reading, hover effects for personality. Both at once.
4. **Proof points over illustrations** (v4): Abstract SVGs carried no semantic weight. Concrete metrics do.
5. **Evidence-first hierarchy** (v5): Metrics promoted from 12px muted to 30px bold. The hook should be the first thing read.
6. **Metric clarity** (v6): "3→8" requires parsing. "8" is instant.

## Workflow Architecture

- **Main thread**: Orchestrated the loop, managed preview verification, decided when to proceed
- **Eval subagents**: Received screenshots + descriptions, assessed against recruiter-appeal criteria, suggested one direction per round
- **Creation subagents**: Received eval feedback, copied previous iteration, built new Content.tsx/definition.ts/controls.tsx, updated index.ts
- **Preview tools**: Screenshotted each iteration, checked for console errors, resized viewport for full-page captures
