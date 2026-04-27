# Design Brief: Drawing Social Gallery + Gaming System

**Purpose & Tone**: Editorial gallery platform for sharing, discovering, and playing. Warm, inviting, gallery-inspired aesthetic with playful but sophisticated gamification. Games feel like gallery experiences, not arcade rooms. Cards feel like physical paintings on a wall.

**Color Palette**:
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Primary | `0.65 0.20 40` (warm orange) | `0.70 0.22 40` | Buttons, CTAs, highlights, active states |
| Secondary | `0.95 0.02 70` (soft beige) | `0.20 0.01 250` (deep charcoal) | Backgrounds, secondary surfaces |
| Accent | `0.55 0.15 200` (teal) | `0.60 0.16 200` | Secondary interactions, links, game hints |
| Success | `0.65 0.18 120` (vibrant green) | `0.68 0.18 120` | Achievements, badges, level-ups, streaks |
| Foreground | `0.18 0.02 250` (dark charcoal) | `0.93 0.01 60` (warm off-white) | Text, primary content |
| Background | `0.98 0.01 60` (warm off-white) | `0.12 0.01 250` (near-black) | Base surface |
| Card | `1.0 0 0` (pure white) | `0.15 0.01 250` (dark card) | Drawing showcase, game card surfaces |

**Typography**:
- Display: BricolageGrotesque — contemporary, friendly, quirky; headers, achievement callouts, game titles
- Body: DM Sans — clean, modern, highly readable; body text, descriptions, UI labels, game instructions
- Mono: Geist Mono — scores, leaderboard ranks, technical content

**Shape Language**: 16px rounded corners (1rem) for card warmth. Subtle shadows for gallery elevation. Game badges use 8px corners for modern feel. Clean grid layout with breathing room.

**Structural Zones**:
| Zone | Treatment |
|------|-----------|
| Header/Nav | `bg-secondary` with `border-b border-border` — gallery header bar + gaming stats widget (streak, level) |
| Content (Feed) | `bg-background` — warm canvas for masonry grid (drawings + mini-game cards) |
| Card | `bg-card shadow-elevated` — drawing showcase & game session card with depth |
| Sidebar | `bg-secondary` with `border-r border-border` — navigation + quick-access game links |
| Achievement Popup | `bg-card shadow-elevated` with `border success` — badge reveal with pop animation |
| Leaderboard | `bg-background` editorial grid format with alternating `bg-muted/20` rows |

**Component Patterns**:
- Drawing cards: image-first, hover scale effect, artist info, action buttons (like, save, download, share)
- Game cards: thumbnail icon, game title, "Play Now" CTA, quick stats (personal best, friends playing)
- Achievement badges: icon on `bg-success` circle, label, unlock date, `animate-badge-pop` on reveal
- Streaks widget: current count, flame icon, `text-success`, next goal deadline
- Leaderboard: rank, username, avatar, score, badge indicator
- Buttons: primary (warm orange fill), secondary (outline), success (green for achievements)

**Motion**: Smooth transitions (0.3s cubic-bezier) on hover. Card lift on hover (scale 1.02). Badge pop on unlock (scale 0.5→1.1→1, bounce curve). Fade-in for feed items. Score +N floating text on game actions.

**Gaming Integration**:
- Mini-games appear as native cards in feed (photo challenge, quiz, match game)
- Each game action logs points and contributes to daily/weekly streaks
- Achievement system: unlocked badges display with green highlight and pop animation
- Leaderboard: friends, global, weekly challenge modes
- Gamification never blocks core content — games enhance, not replace, social discovery

**Constraints**: Never use generic blue. Preserve white space. Text always readable (AA+ contrast). Keep game UI focused (no overwhelming particle effects or neon). Success green used sparingly, only for achievements/level-ups.

**Signature Details**: Cards lift on hover with warm subtle glow. Achievement badges pop with momentum and land with satisfaction. Streak counters glow with success green. Game cards have a subtle play icon overlay on hover, drawing eye to interaction.
