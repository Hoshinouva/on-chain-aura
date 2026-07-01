---
name: On-Chain Aura
description: What kind of on-chain being are you?
colors:
  primary: "#ffffff"
  neutral-bg: "#0a0a0a"
  neutral-text: "#ededed"
typography:
  display:
    fontFamily: "var(--font-geist-sans), sans-serif"
  body:
    fontFamily: "var(--font-geist-mono), monospace"
rounded:
  md: "8px"
spacing:
  md: "16px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.md}"
    padding: "16px 24px"
---

# Design System: On-Chain Aura

## 1. Overview

**Creative North Star: "The Arcade Oracle"**

The Arcade Oracle merges retro Web3 fun with esoteric magic. The aesthetic is arcane, pixel-inspired, and magical. It strips away technical blockchain complexity to reveal an engaging, mystical experience. The interface should feel like stepping up to a fortune teller's cabinet in a digital arcade. We reject generic SaaS corporate polish, sterile dashboards, and the standard hero-metric boilerplate.

**Key Characteristics:**
- Arcane and mystical over technical.
- Dark, immersive environment.
- High contrast, intentional typography.
- Focused on the "reveal" moment.

## 2. Colors

The palette is rooted in darkness to let the magical elements glow.

### Neutral
- **Deep Obsidian** (#0a0a0a): Primary background. The void where the magic happens.
- **Luminous Ash** (#ededed): Primary text. High contrast against the void for readability.
- **Pure Light** (#ffffff): Used sparingly for interactive elements and high-emphasis moments.

**The Void Rule.** The background must remain Deep Obsidian. Do not tint it blue or purple; let the content provide the color.

## 3. Typography

**Display Font:** Geist Sans (with sans-serif)
**Body Font:** Geist Mono (with monospace)

**Character:** A clash of clean, modern sans for impact and technical monospace for the data layer, rooted in Web3 aesthetics.

### Hierarchy
- **Display** (bold, large): Used for the main "On-Chain Aura" title.
- **Headline** (medium, sub-title): Used for section headers or the result reveal.
- **Body** (regular, mono): Used for input fields, wallet addresses, and secondary instructions.

**The Magic Contrast Rule.** Display headings should feel mystical and large. Data (wallet addresses, raw output) must remain monospace. Do not use monospace for primary emotional messaging.

## 4. Elevation

The system is flat by default, relying on high contrast rather than shadows to define hierarchy.

**The Flat Magic Rule.** Surfaces are flat at rest. Depth is achieved through glowing effects (text-shadow or box-shadow with high spread/blur) on active states, not structural drop-shadows.

## 5. Components

### Buttons
- **Shape:** Softly rounded (8px).
- **Primary:** Pure Light background, Deep Obsidian text. Semantic padding.
- **Hover / Focus:** Should exhibit a magical glow or responsive scale down.

### Inputs / Fields
- **Style:** Dark background, subtle border, rounded corners.
- **Focus:** Border highlight, clear indicator of active state.
- **Content:** Monospace text, aligned left for affordance.

## 6. Do's and Don'ts

### Do:
- **Do** maintain the Deep Obsidian background.
- **Do** left-align input placeholder text for clear affordance.
- **Do** limit font families to 1-2 (Display Sans + Body Mono).
- **Do** ensure interactive elements (buttons) scale on press.

### Don't:
- **Don't** use SaaS generic layouts (cream/blue, sterile dashboards).
- **Don't** center input text—it makes it look like a button.
- **Don't** use gray placeholder text that fails contrast rules against the dark background.
- **Don't** mix more than two typeface styles on a single screen.