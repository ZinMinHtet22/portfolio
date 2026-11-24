# DESIGN.md — Portfolio Design System (Zin Min Htet)

**Project context:** Next.js 15 App Router + TypeScript + React 19.2 + Tailwind CSS v4 + Geist. Static export only (`output: "export"`), no server runtime features. Keep routes: `/`, `/about`, `/work`, `/testimonials`, `/resume`, `/contact`, `404`.

This document is the source of truth for visual decisions. Apply consistently across `src/app/globals.css`, Tailwind utility usage, and components in `src/components/**` (especially `src/components/ui/*`).

---

## 1) Brand & tone
- **Voice (visual):** calm, premium, minimal, confident. Generous whitespace, large display type, restrained motion.
- **Primary surface mood:** near-black dark UI with soft white text hierarchy; a single bright accent for emphasis/links.
- **Secondary surface:** a light “sheet” band for contrast sections (tools/stack/services area) with black-on-light text.

---

## 2) Color tokens (CSS variables)

Defined in `src/app/globals.css` under `:root` and exposed via `@theme inline`.

### Dark (default)
| Token | Value | Usage |
|-------|--------|--------|
| `--background` | `#050505` | Page background |
| `--surface` | `#0d0d0d` | Cards, elevated panels on dark |
| `--surface-2` | `#151515` | Secondary surfaces, subtle fills |
| `--border` | `rgba(255,255,255,0.07)` | Hairlines, card borders (`hairline`) |
| `--foreground` | `#ffffff` | Primary text |
| `--muted` | `rgba(255,255,255,0.5)` | Secondary text (use Tailwind `text-white/50`, `text-white/60` where needed to match existing scale) |
| `--accent` | `#0099ff` | Links, highlights, focus accents |
| `--accent-strong` | `#0099ff` | Emphasis (same as accent unless stated) |
| `--accent-subtle` | `#151515` | Subtle accent backgrounds |
| `--sheet` | `#d4d4d4` | Light “sheet” section background |
| `--sheet-foreground` | `#000000` | Text on sheet |

### Selection
- `::selection`: `background: rgba(0,153,255,0.35); color: #fff;`

### Notes
- Prefer Tailwind theme colors: `bg-background`, `text-foreground`, `bg-surface`, `border-border`, `text-accent`, `bg-sheet`, `text-sheet-foreground`, etc.
- Do **not** introduce a second competing palette. If new neutrals are needed, derive from existing `white/*` opacity steps already used in the codebase.

---

## 3) Typography

- **Font family:** Geist Sans via `--font-geist-sans` (`font-sans` in Tailwind). Body uses `system-ui, sans-serif` fallback with `letter-spacing: -0.02em` on `body`.
- **Display class:** `.display` — `font-weight: 500`, `line-height: 1`, `letter-spacing: -0.04em`. Use for hero/display headlines and large section titles where present.
- **Hierarchy (observed):**
  - Hero/display: very large (e.g. `text-[42px]` → `md:text-[65px]` → `xl:text-[82px]` in sections; hero may differ) using `.display`.
  - Section eyebrow: small, muted (`text-sm text-white/40`).
  - Body: `text-base`/`text-lg`, `leading-relaxed`, muted variants `text-white/50` or `text-white/60` depending on context.
- **Wordmark gradient:** `.wordmark-gradient` (animated) reserved for hero/footer wordmark moments; do not overuse.

---

## 4) Spacing & layout

- **Page gutters:** common pattern `px-5 md:px-10`.
- **Section rhythm:** large vertical spacing (commonly `pt-40` between major blocks; adjust only with intent).
- **Containers:** content width is usually controlled by `max-w-*` on headings/text blocks (e.g. `max-w-[900px]`, `max-w-[1100px]`). No global max-width container class is assumed beyond per-section composition.
- **Grid patterns:** responsive grids seen: 2–3 columns for cards/testimonials (`sm:grid-cols-2 lg:grid-cols-3`, `md:grid-cols-3`).

---

## 5) Shape, borders, radius

- **Radius:** rounded corners are prominent. Common values: `rounded-2xl` (tags/small elements), `rounded-3xl` (cards, panels, large surfaces), buttons use `rounded-[20px]`.
- **Borders:** subtle `border border-border` on dark surfaces; “hairline” style via `.hairline` class when needed.
- **Glass-lite:** some dark panels use `bg-white/5` with `backdrop-blur-[5px]` (e.g. testimonial cards) — use sparingly and only where it matches existing patterns.

---

## 6) Motion & interaction

- **Reduced motion:** respect `prefers-reduced-motion` (see globals). Reveal/float/ticker/wordmark animations are disabled or minimized there.
- **Existing patterns (reuse first):** `Reveal`, `RevealWords` (`.reveal-word`, `.reveal-up`), `Parallax` wrapper usage, ticker (`.ticker-track`, `.edge-fade`), wordmark wave, process canvas animations. Prefer extending these over adding new ad-hoc motion systems.
- **Hover:** buttons/cards use subtle transforms (`hover:scale-[1.03]` on primary button) and color transitions (`duration-200`). Keep motion subtle and performant.
- **Do not** stack heavy animated backgrounds or extra text effects on top of the WebGL hero on mobile (performance rule).

---

## 7) Component rules

### Button (`src/components/ui/Button.tsx`)
- Variants: `primary` (white bg, dark text, slight scale on hover), `ghost` (white/5, border white/10, blur).
- Base: `h-12`, `rounded-[20px]`, `px-[18px]`, `text-[15px]`, `font-medium`, `tracking-[-0.03em]`, focus ring offset to background. Use for CTAs consistently.

### Card (`src/components/ui/Card.tsx`)
- `rounded-3xl`, `border border-border`, `bg-surface`, `p-6`, smooth transitions. Use for content blocks on dark backgrounds unless a section specifies otherwise (e.g. sheet uses different treatment).

### SectionHeading (`src/components/ui/SectionHeading.tsx`)
- Optional eyebrow (`text-white/40`), title via `RevealWords` with `.display`, size `text-[42px] md:text-[56px] xl:text-[72px]`, color muted by default (`text-white/60`) or `muted={false}` for stronger. Optional description in `text-white/50`.
- Use for major section intros to keep rhythm consistent.

### Tag (`src/components/ui/Tag.tsx`)
- `rounded-2xl`, `bg-black/15`, `text-xs`, `text-white/80`, `backdrop-blur-[5px]`. Use for labels/chips.

### ProjectCard / content-driven UI
- Project/testimonial data comes from `content/projects.json` and `content/testimonials.json` via `src/lib/data`. Do not hardcode that data into components.

---

## 8) Layout primitives & patterns
- **Navbar/Footer:** fixed site chrome in `src/app/layout.tsx` composition (`Navbar`, `Footer`, `ContactPanel`).
- **Light “sheet” band:** use `bg-sheet text-sheet-foreground` for contrast blocks (e.g. “My tools / My stack” area) with dark text and adjusted shadows/borders as already done.
- **3D canvases:** `HeroCanvas`, `ProcessCanvas` are client components; preserve them unless a clearly better, faster replacement is validated.

---

## 9) Accessibility & UX
- Maintain visible focus styles (buttons already define focus rings). Keep sufficient contrast (especially text on `sheet`).
- Respect `prefers-reduced-motion`.
- Keep semantic headings and link text descriptive.

---

## 10) Implementation notes (must-follow)
- Tailwind v4 utilities + CSS variables in `globals.css` (`@theme inline`). Prefer theme tokens over ad-hoc hex in JSX when a token exists.
- Do not introduce a second theme system. 
- Static export constraints apply everywhere (no server-only APIs). 
- Use `"use client"` only when required (interactivity, canvas, observers/animations that need it).

---

## 11) ProjectCard v2 (Stitch-derived; spec overrides conflicts)
Source: Stitch project `Portfolio ProjectCard v2`, screen `Portfolio Project Card Component`. Extracted values below; where Stitch output conflicted with the hard card spec, the spec won (see conflicts at end).

### Surface & geometry
- Card surface: `bg-surface` (`#0d0d0d`), `border-radius: 24px` (`rounded-3xl`), `border: 1px solid rgba(255,255,255,0.07)` (`border-border`).
- Card padding: **24px** (`p-6`). Outer content stack gap: **20px** (`gap-5`); image-to-content gap: **24px** (`gap-6`).
- Image frame: `aspect-[16/10]`, `rounded-[20px]`, `border: 1px solid rgba(255,255,255,0.07)`, flat `bg-[#080808]` fallback (no gradient), `overflow-hidden`.

### Typography
- Meta row: **12px** (`text-xs`), `letter-spacing: 0.05em`, `text-white/50`; separator `·` with `mx-1.5`, opacity 40%.
- Status badge: **11px**, `font-medium`, `text-white/70`, `padding: 4px 10px`, `rounded-full`, transparent background, `border: 1px solid rgba(255,255,255,0.10)`. Text exactly `● Live` for `status: "live"`, `Local system` for `status: "local"`. Omit badge entirely when field absent.
- Title: **24px** mobile / **28px** at `sm`, `font-semibold`, `tracking-tight`, `leading-snug`, white.
- Summary: **14px** / **15px** at `sm`, `text-white/50`, `leading-relaxed`, one line only (`truncate`).
- Proof line: **14px**, `font-semibold`, `tracking-tight`, accent `#0099ff` used only here; one short verified-outcome line. Omit when `proofLine` absent.
- Stack chips: **12px** (`text-xs`), `text-white/70`, `padding: 6px 8px`, `rounded-md` (6px), `bg-[#161616]`, `border: 1px solid rgba(255,255,255,0.06)`. Exactly one row, max 4 slots (3 stack names + `+N more` when overflow). Never wrap.
- Footer: `padding-top: 8px`, `border-top: 1px solid rgba(255,255,255,0.06)`, label **14px** `font-medium text-white/80`, arrow translates **2px** (`translate-x-0.5`) on hover, `transition-colors/duration-150`. Whole card is the single `<Link>`; footer is plain text, not a nested link.

### Interaction / accessibility
- Whole card is one link. No nested interactive elements.
- Hover motion is CSS only; under `prefers-reduced-motion` all transforms/transitions are disabled (`motion-reduce:*`).
- GlareHover stays on the image frame only; subtle accent tint, no glow outside the frame.
- Flat surfaces only: **no gradients, no glows, no tilt physics, no animated counters, no fake Live/GitHub buttons**.

### Grid behaviour
- Home Selected Work: equal-size cards (`sm:grid-cols-2 lg:grid-cols-3`).
- `/work` grid: first card (RetailPOS) spans **2 columns on desktop** (`lg:col-span-2`); others normal. Mobile stays single-column.

### Stitch conflicts (spec wins)
- Stitch invented fake proof metrics (`14ms p99 latency`, `1.2M daily operations`) and a fake project — discarded; proofLine comes only from verified project data.
- Stitch rendered the footer as a separate `<a>` inside an `<article>` — replaced by one card-level `<Link>`.
- Stitch used an emerald dot inside the badge — badge kept neutral to reserve accent for the proof line.