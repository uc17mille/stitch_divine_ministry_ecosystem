---
name: Sanctuary
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#444653'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#757684'
  outline-variant: '#c4c5d5'
  surface-tint: '#3755c3'
  primary: '#00288e'
  on-primary: '#ffffff'
  primary-container: '#1e40af'
  on-primary-container: '#a8b8ff'
  inverse-primary: '#b8c4ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#611e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#872d00'
  on-tertiary-container: '#ffa583'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#173bab'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#802a00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  mono:
    fontFamily: Geist Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  gutter: 24px
  margin: 32px
---

## Brand & Style
The design system is built on a foundation of "Precision-Crafted Utility." It targets high-performance professionals who demand a focused, low-friction environment. The aesthetic follows an ultra-minimalist, high-craft trajectory—drawing inspiration from the "Linear/Stripe" school of design—where every pixel must justify its existence.

The emotional response is one of calm, controlled authority. By utilizing a "Neutral-First" philosophy, the UI recedes to let user content take center stage, using high-density information architecture and expansive whitespace to create a sense of unlimited digital headroom. The style merges Modern Corporate reliability with the technical sharpness of developer-centric tools.

## Colors
This design system employs a surgical application of color. The palette is dominated by neutrals to maintain a professional, high-craft atmosphere.

- **Primary:** Deep Royal Blue (#1E40AF) is used exclusively for primary actions, active states, and critical indicators. It should be used sparingly to maintain its "high-signal" value.
- **Neutrals:** A scale of Zinc and Slate grays handles the structural hierarchy.
- **Light Mode:** Uses an off-white background (#F9FAFB) with pure white cards to create subtle depth through tonal layering rather than heavy shadows.
- **Dark Mode:** Avoids pure black in favor of an elegant Charcoal/Zinc (#09090B). Surfaces use a slightly lighter zinc (#18181B) to simulate elevation.

## Typography
We utilize **Geist** for its exceptional balance of technical precision and readability. The typographic scale is designed for high-density SaaS interfaces where clarity at small sizes is paramount.

- **Headlines:** Use tighter letter-spacing and heavier weights to create a strong visual anchor.
- **Body:** Standardized at 16px for optimal legibility, with a 14px variant for secondary data-heavy views.
- **Labels:** Utilize medium weights and slightly increased letter-spacing, especially for uppercase variants, to distinguish them from interactive body text.
- **Mono:** Reserved for technical strings, IDs, and tabular data to reinforce the "Precision-Crafted" aesthetic.

## Layout & Spacing
The design system operates on a strict **8px grid**. All dimensions, padding, and margins must be multiples of 8 (or 4 for micro-adjustments).

- **Grid System:** A 12-column fluid grid for desktop with 24px gutters. For application-heavy views (dashboards), use a fixed sidebar (240px - 280px) with a fluid content area.
- **Whitespace:** Emphasize "Generous Breathing Room." Use `xl` (32px) or `2xl` (48px) spacing between major sections to prevent information density from feeling overwhelming.
- **Safe Areas:** Maintain a minimum 32px outer margin on desktop and 16px on mobile.

## Elevation & Depth
Elevation is communicated through a mix of **Tonal Layering** and **Ambient Shadows**.

- **Layers:** Backgrounds are the lowest layer. Surface cards sit one level above. Overlays (Modals/Popovers) sit at the highest level.
- **Shadows:** Avoid heavy, dark dropshadows. Use multi-layered, highly diffused shadows with very low opacity (e.g., `y: 4px, blur: 20px, color: rgba(0,0,0,0.05)`).
- **Glassmorphism:** Use only for transient elements like command palettes, dropdown menus, or sticky headers. Use a `12px` to `20px` backdrop-blur with a `0.5px` white/zinc border to maintain edge definition.
- **Borders:** Every surface must be defined by a thin, 1px neutral border (#E2E8F0 in light mode, #27272A in dark mode) to ensure structure in the absence of heavy shadows.

## Shapes
The shape language is sophisticated and modern, characterized by high-radius corners that soften the technical nature of the typography.

- **Standard Elements:** Buttons, inputs, and small widgets use a `0.5rem` (8px) radius.
- **Containers/Cards:** Use `rounded-lg` (16px) or `rounded-xl` (24px) to create the distinct "modular widget" look.
- **Inner Padding Alignment:** When nesting elements (e.g., a button inside a card), ensure the inner radius is smaller than the outer radius to maintain concentric harmony.

## Components
- **Buttons:** Primary buttons use the Deep Royal Blue with white text. Secondary buttons are "ghost" style with a 1px border. Interactions should be subtle—a slight background darkening on hover.
- **Cards:** White or Zinc-900 background, 1px border, and `rounded-xl` (24px) corners. Use cards to group logical modules of the OS.
- **Command Palette:** The centerpiece of the navigation. Centrally aligned, floating, with a heavy backdrop blur and 24px rounded corners. Search results should use `body-md` with `mono` shortcuts.
- **Input Fields:** Minimalist design with a focus on the active state. The border should transition from neutral gray to Deep Royal Blue with a subtle 2px outer glow (ring) on focus.
- **Chips/Badges:** Small, `rounded-full` (pill) shapes with low-contrast backgrounds and high-contrast text. Use these for status indicators (e.g., "Active," "Pending").
- **Lists:** Clean rows separated by 1px horizontal lines. High-density layouts should use 12px vertical padding, while standard lists use 16px.