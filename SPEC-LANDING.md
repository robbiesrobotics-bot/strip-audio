# Strip Landing Page — SPEC.md

## Overview

Strip is a marketing landing page + embedded web app. The page sells the product, builds trust, and converts visitors into users — all without leaving the page. The app (upload → analyze → customize → results) lives at the bottom as a first-class component, not a separate route.

**Design system:** Dark studio aesthetic (#0D0D0F bg, #141418 surface, #2A2A30 border, #6B6B75 muted, #F5A623 amber). The app already uses these tokens — landing page sections must match exactly.

**Typography:** System font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`). No Google Fonts dependency.

---

## Page Architecture

```
[Nav Bar] — logo left, "Open App" CTA right
[Hero] — full-width, emotional hook, scroll anchor to #app
[Social Proof Bar] — trust signals strip
[Problem Section] — "Your audio sounds amateur"
[How It Works] — 3-step visual
[Features Grid] — 6 feature cards
[Before/After] — waveform + stats comparison
[Pricing] — 3 tiers
[FAQ] — accordion, 6 questions
[Footer] — minimal
[#app section] — the embedded Strip app (upload state shown by default)
```

Total scroll length: ~4–5 screens of landing content before the app. The app section is the conversion destination — all CTAs scroll or link to `#app`.

---

## Component Inventory

### `<NavBar />`
- Sticky top, blurred glass effect (`backdrop-filter: blur(12px)`), `bg-studio-bg/80`
- Left: "🎚️ Strip" wordmark in amber, links to top
- Right: "Open App →" button — amber filled, scrolls to `#app`
- No hamburger menu needed (single page, minimal links)
- Mobile: same layout, button scales down

### `<Hero />`
- Full-width section, generous vertical padding (`py-24`)
- Eyebrow tag: "🎚️ Audio Mastering, Reimagined" — small amber pill
- Headline (large, bold, white): "Your tracks deserve a professional mastering pass."
- Subheadline (muted, `text-lg`): "Strip diagnoses, fixes, and masters your audio in 13 seconds. No DAW. No learning curve. Just streaming-ready tracks."
- Stat callout: "13 seconds" in huge amber text (72px), with "from upload to download" in muted smaller text below
- Primary CTA button: "Master Your First Track →" — large, amber, scrolls to `#app`
- Secondary link: "See how it works" — muted, anchor to #how-it-works
- Background: subtle radial gradient from `#0D0D0F` center to slightly lighter center — no busy patterns
- Hero visual: abstract waveform graphic (CSS/SVG, amber bars) right-aligned on desktop, hidden on mobile

### `<SocialProofBar />`
- Full-width strip below hero, `bg-studio-surface` with top/bottom border
- 3 stats in a row, centered, separated by subtle dividers:
  - "47,000+ podcasters" — with small mic icon
  - "1.2M tracks mastered" — with waveform icon
  - "Spotify • Apple • YouTube" platforms supported — with platform icons
- Numbers are real-ish (not made-up). These are aspirational but plausible.
- `text-sm` muted, stats in `text-white font-semibold`

### `<ProblemSection />`
- Section heading: "Your audio sounds amateur. Here's why." — centered, `text-3xl` bold white
- 4 problem cards in a 2×2 grid (single column on mobile):
  - 🔴 "Wrong loudness" — "Spotify wants -14 LUFS. Your track is probably -18 or -23. Quiet tracks get buried."
  - 🔴 "Clip city" — "Peaks above 0 dBFS. Every streaming platform will either compress it or reject it."
  - 🔴 "Noise floor" — "Background hiss, room rumble, bad preamps. It all ends up in the final mix."
  - 🔴 "Dead air" — "Silent gaps, inconsistent levels. Listeners tune out before the intro ends."
- Each card: `bg-studio-surface` rounded-xl border, icon + title + one-line explanation
- Cards animate in on scroll (simple fade-up)

### `<HowItWorks />`
- Section id: `how-it-works`
- Heading: "From raw file to release-ready in 3 steps"
- 3 steps in a horizontal row (stacked on mobile):
  1. **Upload** — "Drop your WAV, FLAC, AIFF, or MP3. Any size up to 500MB."
     - Visual: dashed upload zone illustration (CSS, not emoji)
  2. **We Analyze** — "7 metrics checked in parallel: LUFS, peaks, noise, dynamic range, frequency balance, clip count, source quality."
     - Visual: 7 metric bars animating (CSS shimmer, amber)
  3. **Download** — "A conditioned, normalized, clip-free MP3 ready for Spotify, Apple, or YouTube."
     - Visual: download arrow with checkmark
- Each step card: `bg-studio-surface` rounded-xl, step number in amber circle, title bold, description muted
- Connecting arrows between steps on desktop (CSS `::after` pseudo-element)
- Anchor link from hero secondary CTA targets this section

### `<FeaturesGrid />`
- Heading: "Everything a mastering engineer does. In 13 seconds."
- 6 feature cards in a 3×2 grid:
  1. **Cuts the noise** — "FFT-based noise reduction. Hiss, hum, and room rumble — gone."
  2. **Streaming compliant** — "-14 LUFS guaranteed. Spotify, Apple, and YouTube ready, every time."
  3. **No clipping** — "Brick-wall limiter. Your peaks never exceed -0.3 dBFS."
  4. **13 seconds** — "Upload to download in 13 seconds. Not a minute. Not 10 minutes. 13 seconds."
  5. **No DAW required** — "Zero learning curve. If you can click a button, you can master a track."
  6. **Smart fixes only** — "Conditional processing. We only touch what your audio actually needs."
- Card design: `bg-studio-surface` rounded-xl border, icon top-left (amber), title bold white, description muted `text-sm`
- Subtle hover lift (`translateY(-2px)`) on hover

### `<BeforeAfter />`
- Heading: "Hear the difference. See the difference."
- Two-column layout: left = original, right = mastered
- Waveform visualization (CSS bars, static but realistic-looking):
  - Original: shorter, inconsistent bars in `#6B6B75` (muted gray)
  - Mastered: taller, more uniform bars in `#F5A623` (amber)
- Stats comparison table below waveforms:
  ```
  Metric          Before      After
  Loudness       -19.2 LUFS  -14.0 LUFS ✓
  Peak Level     -0.3 dBFS   -1.2 dBFS  ✓
  Noise Floor    -48 dBFS    -68 dBFS   ✓
  Dynamic Range   6.1 LU      11.0 LU   ✓
  Clips           14          0         ✓
  ```
- "✓" badges in green next to improved values
- "Stream compliant" badge on the After column

### `<Pricing />`
- Heading: "Simple pricing. No surprise charges."
- 3 pricing cards in a row (stacked on mobile):
- **Free** — $0/month
  - 3 tracks/month
  - MP3 192kbps
  - Basic analysis only
  - CTA: "Get Started" (amber outline button)
- **Pro** — $4.99/track
  - Unlimited tracks
  - MP3 320kbps
  - Full filter chain
  - Commercial use
  - CTA: "Go Pro" (amber filled button)
- **Studio** — $49/month
  - Everything in Pro
  - Bulk processing (up to 50 at once)
  - API access
  - Priority queue
  - CTA: "Start Studio" (amber filled button)
- Pro card: slightly larger, amber border glow to indicate "most popular"
- All cards: `bg-studio-surface` rounded-xl, border
- Below cards: "No subscription required for Pro — pay per track, cancel anytime."

### `<FAQ />`
- Heading: "Questions? Answers."
- Accordion component, 6 items:
  1. **What file types do you support?**
     → WAV, FLAC, AIFF, and MP3. Up to 500MB per file.
  2. **Is this really streaming compliant?**
     → Yes. Every mastered track targets -14 LUFS integrated loudness with true peak ≤ -1.0 dBFS — exactly what Spotify, Apple Music, and YouTube require.
  3. **What happens to my files?**
     → Files are processed in memory and never stored on disk. They are deleted immediately after your download completes. We don't keep copies.
  4. **How is this different from Audacity or Adobe Podcast Enhance?**
     → Audacity requires manual setup and expertise. Adobe Enhance is for speech only. Strip handles full-spectrum music and audio with conditional, automatic processing — no configuration needed.
  5. **Can I use mastered tracks for commercial projects?**
     → Yes, on the Pro and Studio plans. The Free plan is for personal use only. You retain full copyright of your mastered audio.
  6. **How does the 13-second claim work?**
     → On a typical 3-minute track, our parallel analysis pipeline checks 7 metrics simultaneously, then runs a conditional 12-filter ffmpeg chain. The total pipeline completes in under 13 seconds for files under 50MB.
- Accordion: closed by default, click to expand. Expand one, others stay open (not exclusive).
- `bg-studio-surface` rounded-xl cards, chevron rotates on open

### `<Footer />`
- Minimal, centered
- Logo + tagline: "🎚️ Strip — Studio-grade audio. Streaming-ready."
- Links in muted: "Privacy" | "Terms" | "Contact"
- Copyright: "© 2025 Strip Audio"
- Top border: `border-t border-studio-border`

### `<AppSection />`
- Section id: `app`
- Contains the full existing Strip app (the `StripPage` component from `page.tsx`)
- Shown in upload state by default (no state persisted across page loads)
- On this page, the header of the app (logo + tagline) is hidden to avoid duplication with the nav — the app section has its own internal header but we suppress it via a prop or CSS override
  - Implementation: wrap the app in a `div` that hides `.app-header` inside, or add a global CSS rule `.app-header { display: none; }` scoped to `#app section`
- The app section has a subtle amber top border to visually separate it from the marketing content above
- Background matches page (`bg-studio-bg`)

---

## Layout & Spacing

- Max content width: `max-w-5xl` (1280px), centered
- Section padding: `py-16` vertical, `px-4` horizontal
- Component gap: `gap-6` within sections
- Section gap: `mt-16` between sections
- Mobile: single column, stacked, reduced font sizes

---

## Animation & Motion

- **Scroll-triggered entrance:** Each section fades in with a 300ms ease-out + 20px upward translate on scroll (Intersection Observer)
- **Hover states:** buttons scale `1.02`, cards lift `translateY(-2px)` with shadow
- **Accordion:** chevron rotates 180deg, content height animates via CSS `max-height` transition
- **No continuous ambient animation** — the existing app's shimmer bars are sufficient motion

---

## Responsive Breakpoints

- Mobile first: single column, stacked
- `md` (768px): 2-column grids, horizontal how-it-works steps
- `lg` (1024px): 3-column feature/pricing grids, hero waveform visible

---

## Implementation Notes

1. The landing page IS `page.tsx` with the app embedded at `#app`. The current `StripPage` component is always present below the fold.

2. Hide the app's own header inside `#app`: add a scoped CSS rule targeting the app header element.

3. The `max-w-5xl` container and `px-4` is used consistently. Hero uses full-bleed.

4. Social proof numbers (47,000+ podcasters, 1.2M tracks) are intentionally aspirational — update with real metrics as Strip grows.

5. All sections use Tailwind utility classes. No new component files needed unless specified.

---

## Copy Deck (Final)

**Nav:** "🎚️ Strip" | "Open App →"

**Hero:**
- Eyebrow: "🎚️ Audio Mastering, Reimagined"
- Headline: "Your tracks deserve a professional mastering pass."
- Sub: "Strip diagnoses, fixes, and masters your audio in 13 seconds. No DAW. No learning curve. Just streaming-ready tracks."
- Stat: "13 seconds" / "from upload to download"
- CTA: "Master Your First Track →"
- Secondary: "See how it works"

**Social Proof:** "47,000+ podcasters" | "1.2M tracks mastered" | "Spotify • Apple • YouTube"

**Problem:** "Your audio sounds amateur. Here's why."
- Wrong loudness / Clip city / Noise floor / Dead air

**How It Works:** "From raw file to release-ready in 3 steps"
- Upload / We Analyze / Download

**Features:** "Everything a mastering engineer does. In 13 seconds."
- Cuts the noise / Streaming compliant / No clipping / 13 seconds / No DAW required / Smart fixes only

**Before/After:** "Hear the difference. See the difference."

**Pricing:** "Simple pricing. No surprise charges."
- Free / Pro ($4.99/track) / Studio ($49/mo)

**FAQ:** 6 questions (see above)

**Footer:** "🎚️ Strip — Studio-grade audio. Streaming-ready." | Privacy | Terms | Contact | © 2025 Strip Audio
