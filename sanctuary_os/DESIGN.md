---
name: Sanctuary OS
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444653'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#757684'
  outline-variant: '#c4c5d5'
  surface-tint: '#3755c3'
  primary: '#00288e'
  on-primary: '#ffffff'
  primary-container: '#1e40af'
  on-primary-container: '#a8b8ff'
  inverse-primary: '#b8c4ff'
  secondary: '#006e2d'
  on-secondary: '#ffffff'
  secondary-container: '#7cf994'
  on-secondary-container: '#007230'
  tertiary: '#453100'
  on-tertiary: '#ffffff'
  tertiary-container: '#614700'
  on-tertiary-container: '#ecb210'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#173bab'
  secondary-fixed: '#7ffc97'
  secondary-fixed-dim: '#62df7d'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005320'
  tertiary-fixed: '#ffdf9f'
  tertiary-fixed-dim: '#f9bd22'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5c4300'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  surface-card: '#FFFFFF'
  text-rich: '#0F0F35'
  glass-stroke: rgba(255, 255, 255, 0.4)
  indigo-wash: '#506CF0'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 20px
---

## Brand & Style

The design system is engineered for a "Christ-centered technology company," blending the rigorous precision of high-end SaaS with a warm, invitational spirit. The brand personality is **Devotional, Sophisticated, and Essential**. It aims to evoke a sense of digital stewardship—where technology serves as a quiet, powerful vessel for ministry and community.

The visual style is **Modern Minimalist with Glassmorphic Accents**. It draws inspiration from the organizational clarity of Notion and the atmospheric calm of Headspace. Every interface element is designed to reduce cognitive load, utilizing generous whitespace and a "content-first" hierarchy. Subtle frosted-glass layers and soft gradients provide a sense of depth and modernity without compromising the "Soft White" purity of the environment.

## Colors

The palette is anchored in **Deep Royal Blue**, representing authority and trust, complemented by **Emerald Green** to symbolize growth and life. **Gold** is used sparingly as a divine accent for high-priority notifications or "premium" achievement states.

The background uses a **Soft White (#FAFAFA)** to prevent eye strain and create a warm, paper-like quality compared to clinical pure white. **Pure White (#FFFFFF)** is reserved exclusively for elevated card surfaces to create a clear "layering" effect. Text should primarily utilize **Rich Navy (#0F0F35)** instead of pure black to maintain a high-end, bespoke feel.

## Typography

This design system utilizes a dual-font strategy. **Geist** provides a technical, precise edge for headings and UI labels, echoing the "Technology Company" aspect. **Inter** handles body copy for maximum legibility and a friendly, democratic feel.

Headlines should be set with tight letter-spacing (-0.01em to -0.02em) to achieve a modern, "Linear-esque" editorial look. High-level display text should use a bold weight to create a strong visual anchor, while body text remains light and airy.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. On desktop, content is constrained to a 1280px central container to ensure readability, while the background and navigation elements can bleed to the edges. A 4px baseline grid ensures vertical rhythm.

- **Desktop:** 12-column grid, 24px gutters, 40px outer margins.
- **Tablet:** 8-column grid, 20px gutters, 32px outer margins.
- **Mobile:** 4-column grid, 16px gutters, 20px outer margins.

Emphasis is placed on "negative space as a feature." Content blocks should be separated by large gaps (64px+) to create a sense of peace and order.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layering and Soft Shadows**. We avoid heavy blacks in our shadows, opting instead for deep navy tints with very high diffusion (blur).

1.  **Level 0 (Background):** Soft White (#FAFAFA), flat.
2.  **Level 1 (Cards/Surface):** White (#FFFFFF) with a `0px 4px 20px rgba(15, 15, 53, 0.05)` shadow.
3.  **Level 2 (Glass Overlays):** Semi-transparent white (80% opacity) with a 12px backdrop blur and a 1px white border (0.4 opacity).
4.  **Level 3 (Popovers/Modals):** White (#FFFFFF) with a `0px 12px 40px rgba(15, 15, 53, 0.12)` shadow.

## Shapes

The shape language is consistently **Rounded**, leaning towards a soft, organic feel that minimizes the harshness of traditional software. 

- **Standard UI elements** (Buttons, Inputs): 0.5rem (8px).
- **Cards and Containers**: 1rem to 1.25rem (16px-20px).
- **Avatars & Selection Chips**: Fully pill-shaped (999px).

## Components

### Buttons
Primary buttons use the Deep Royal Blue with white text. Hover states should introduce a subtle upward translation (-1px) and a slightly intensified shadow rather than just a color change. 

### Input Fields
Inputs use a "ghost" style: a Soft White background with a 1px stroke that only turns Primary Blue on focus. Labels are always positioned above the field in Geist Medium.

### Cards
Cards are the workhorse of the ecosystem. They must have a white background, 20px corner radius, and a 1px border using a very light tint of the primary color (2% opacity) to provide definition against the Soft White background.

### Premium Dashboard Widgets
Widgets utilize subtle linear gradients (e.g., Deep Royal Blue to Indigo Wash at 15% opacity) to highlight key metrics. Glassmorphism is applied to headers within these widgets to create a sophisticated, layered look.

### Chips & Tags
Used for categorization. They should be low-contrast (Secondary Green text on a 10% opacity Green background) to remain helpful but unobtrusive.