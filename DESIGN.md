# DESIGN.md — Nourish

## 1. Project Identity
- **Product:** Nourish
- **Tagline:** Calorie & wellness tracker — log food, activity, cycle, and check-ins in one calm dashboard.
- **Stage:** MVP
- **Primary User:** Someone tracking calories and (optionally) menstrual cycle + symptoms together, who wants patterns without a clinical or “diet app” feel.
- **Design Feeling:** Warm, calm, trustworthy

---

## 2. Visual Language

### Inspiration
- Primary: Cronometer / wellness dashboards with a bento-card layout
- Secondary: Linear (spacing + hierarchy), Apple Health (phase/calendar language)
- Avoid: Material Design, Bootstrap, neon fitness apps, Dribbble gradients, dark-mode-first SaaS chrome

### Color System
- Background: `#FFFBF7`
- Surface: `#FFFDF9`
- Surface soft / shell: `#FFFBF7`
- Border: `#EDE4DC`
- Text Primary: `#272018`
- Text Secondary: `#736055`
- Accent / Brand: `#B86B52` (terracotta)
- Accent light: `#E8C9BC`
- Accent pale: `#F5E8E2`
- Destructive: `#B97663` (over-target / warning terracotta)
- Success: `#7D9B8A` (sage — near-target, energy, positive)
- Supporting: sage `#7D9B8A`, sage light `#D4E4DA`, blush `#E8C4B8`, lavender `#C4B5D4` / `#EDE8F2`, pale gold `#E8D5B0`, espresso `#744336`

### Typography
- Display Font: Georgia, "Times New Roman", Palatino (serif — page titles only)
- Body Font: system-ui, -apple-system, BlinkMacSystemFont, sans-serif
- Code Font: none (not a developer product)
- Base Size: 16px
- Scale: 10 / 12 / 13 / 14 / 16 / 18 / 20 / 24 / 28 (page titles ~1.5rem serif)

### Spacing System
- Base unit: 4px
- Padding presets: 8 / 12 / 14 / 16 / 20 / 24 / 28 / 32
- Card radius: 20px
- Card gap: 14–20px
- Content max width: 1120px
- Page padding: 24–32px

---

## 3. Component Standards

### Buttons
- Primary: filled terracotta `#B86B52`, cream text, 1px matching border, 44px min height, pill (`border-radius: 999px`) for CTAs
- Secondary / outline: cream fill, 1px `#EDE4DC` border, dark text, auto width (never stretch full page on web)
- Ghost: pale terracotta fill `#F5E8E2`, terracotta text
- Pill (emphasis): `#D39A86` fill, cream text, soft terracotta shadow
- Disabled: 40% opacity, no pointer events

### Inputs
- Height: 44px (touch-friendly)
- Border: 1px solid `#EDE4DC`
- Focus: terracotta ring, 2px offset (`rgba(184, 107, 82, 0.35)`)
- Error state: terracotta/red border + short error message below

### Cards
- Background: `#FFFDF9`
- Border: 1px solid `#EDE4DC`
- Radius: 20px
- Shadow: none by default; Insights cycle card may use `0 4px 24px rgba(60, 43, 36, 0.07)` — never hard box shadows
- Padding: 14–24px

### Navigation
- Sidebar width: 240px (desktop)
- Nav item: rounded 12px, muted text
- Active state: `#F5E8E2` background, terracotta text, font-weight 600
- Hover: `#F5EFE9` (active hover stays `#F5E8E2`)
- Mobile: stack to single column; no bottom nav

---

## 4. Interaction Principles
- **Transitions:** 150ms ease for micro (hover, focus), 250ms ease-out for layout shifts
- **Hover:** Subtle bg shift — never dramatic color change
- **Loading:** Skeleton screens, not spinners
- **Empty states:** Short, helpful copy — e.g. “Log a few check-ins to see cycle patterns.” Never just “No data”
- **Errors:** Inline, specific, actionable — not toast-only
- **Layout:** Web dashboard, not a stretched phone mock. Bento grids, equal gaps, cards size to content. Charts have a fixed height so they don’t blow up on wide screens.

---

## 5. Current Build State

### Pages Built
- [ ] Landing / Marketing
- [ ] Auth (Login / Signup) — planned via Supabase; not a dedicated UI yet
- [x] Today (home dashboard)
- [x] Log (food, activity, check-in, progress journal, cycle journal)
- [x] Insights (weekly calories, progress, cycle calendar, symptoms, report)
- [x] Profile / calorie settings / cycle settings / weekly pattern
- [x] Progress journal + photos
- [x] Health report
- [x] Day detail + cycle phase detail

### Component Library Status
- Buttons: ✅ Done (`AppButton` primary / secondary / ghost / pill)
- Cards / stats / pills: ✅ Done
- Forms: 🔄 In progress
- Charts (weekly energy, weight trend, cycle calendar): 🔄 In progress — spacing still being tuned for web
- Tables: ❌ Not started (not needed)

### Known Design Debt
- Many components still use inline styles instead of CSS classes / tokens
- Insights page layout has gone through several spacing passes; keep bento grid, don’t stretch cards to match taller neighbors
- Charts can still overscale if `width: 100%` is used without a height cap
- Auth screens and marketing landing are not designed
- Dark mode is out of scope

---

## 6. AI Prompting Rules (for this project)

When generating UI for this project:
- Always use the color tokens defined above (`lib/theme.ts` is the source of truth)
- Light mode first — cream/terracotta/sage. Never dark-mode-first
- Never use Tailwind defaults, Material, or generic blue SaaS palettes
- Prefer composition over complexity — bento cards, not one giant stacked mobile column
- Prefer CSS classes / tokens over new inline styles; match existing patterns if you must use inline
- Components should be copy-pasteable and self-contained
- Always consider empty, loading, and error states
- Web app layout: sidebar 240px + main max 1120px; buttons and charts should not span the full viewport
- Serif only for page titles (Insights, Today greeting). Everything else is system sans
- Cycle phases: menstrual blush, follicular taupe, ovulatory gold, luteal cream — keep icons small
- Look for weekly patterns, not perfect daily numbers — copy should stay calm, never shamey
