# Design Brief: Drawing Social Gallery

**Purpose & Tone**: Editorial gallery platform for sharing and discovering creative artwork. Warm, inviting, gallery-inspired aesthetic with creative energy. Cards feel like physical paintings on a wall, not digital widgets.

**Color Palette**:
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Primary | `0.65 0.20 40` (warm orange) | `0.70 0.22 40` | Buttons, CTAs, highlights, active states |
| Secondary | `0.95 0.02 70` (soft beige) | `0.20 0.01 250` (deep charcoal) | Backgrounds, secondary surfaces |
| Accent | `0.55 0.15 200` (teal) | `0.60 0.16 200` | Secondary interactions, accents, links |
| Foreground | `0.18 0.02 250` (dark charcoal) | `0.93 0.01 60` (warm off-white) | Text, primary content |
| Background | `0.98 0.01 60` (warm off-white) | `0.12 0.01 250` (near-black) | Base surface |
| Card | `1.0 0 0` (pure white) | `0.15 0.01 250` (dark card) | Drawing showcase surfaces |

**Typography**:
- Display: BricolageGrotesque — contemporary, friendly, quirky; headers, titles, navigation
- Body: DM Sans — clean, modern, highly readable; body text, descriptions, UI labels
- Mono: Geist Mono — code, technical content

**Shape Language**: 16px rounded corners (1rem) for card warmth. Subtle shadows for gallery elevation. Clean grid layout with breathing room.

**Structural Zones**:
| Zone | Treatment |
|------|-----------|
| Header/Nav | `bg-secondary` with `border-b border-border` — gallery header bar |
| Content (Feed) | `bg-background` — warm canvas for masonry grid |
| Card | `bg-card shadow-elevated` — drawing showcase with depth |
| Sidebar | `bg-secondary` with `border-r border-border` — navigation column |
| Footer | `bg-secondary` with `border-t border-border` — tags, suggestions |

**Component Patterns**:
- Drawing cards: image-first, with hover scale effect, artist info below, action buttons (like, save, download)
- Search bar: pill-shaped input, primary-colored submit button
- Tags: secondary background, primary text, clickable for filtering
- Buttons: primary (warm orange fill), secondary (outline), destructive (red)
- User avatar: small circular image in header, profile menu on click

**Motion**: Smooth transitions (0.3s cubic-bezier) on hover states. Card lift on hover (subtle scale 1.02). Fade-in for feed items on load.

**Constraints**: Never use generic blue. Preserve white space around cards. Text always readable (AA+ contrast).

**Signature Detail**: Cards have a subtle warm shadow; when you hover over a drawing card, it lifts slightly and gains a warm glow edge, making it feel like you're reaching for a physical painting.
