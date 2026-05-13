---
name: Apex Narrative
colors:
  surface: '#11131c'
  surface-dim: '#11131c'
  surface-bright: '#373943'
  surface-container-lowest: '#0c0e17'
  surface-container-low: '#191b25'
  surface-container: '#1d1f29'
  surface-container-high: '#282933'
  surface-container-highest: '#32343f'
  on-surface: '#e1e1ef'
  on-surface-variant: '#c3c5d9'
  inverse-surface: '#e1e1ef'
  inverse-on-surface: '#2e303a'
  outline: '#8d90a2'
  outline-variant: '#434656'
  surface-tint: '#b6c4ff'
  primary: '#b6c4ff'
  on-primary: '#002780'
  primary-container: '#0055ff'
  on-primary-container: '#e3e6ff'
  inverse-primary: '#004dea'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#4a4949'
  on-secondary-container: '#bab8b7'
  tertiary: '#c6c6c7'
  on-tertiary: '#2f3131'
  tertiary-container: '#666868'
  on-tertiary-container: '#e7e7e7'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b3'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#11131c'
  on-background: '#e1e1ef'
  surface-variant: '#32343f'
typography:
  display-xl:
    fontFamily: Anton
    fontSize: 96px
    fontWeight: '400'
    lineHeight: 100%
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 110%
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 110%
  headline-md:
    fontFamily: Anton
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 120%
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 160%
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 150%
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 100%
    letterSpacing: 0.1em
  button-text:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 100%
    letterSpacing: 0.05em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

The brand identity sits at the intersection of high-intensity athletic performance and the vibrant, stylized energy of modern anime culture. The aesthetic is "Technical-Cinematic"—combining the precision of professional sports equipment with the bold storytelling of Japanese animation. 

The design style utilizes a mix of **Minimalism** and **High-Contrast / Bold** elements. Large, immersive product imagery serves as the primary visual driver, framed by generous whitespace and structured by a rigorous, technical grid. The emotional response should be one of "Momentum and Quality"—aspirational, fast-paced, and uncompromisingly premium.

## Colors

This design system utilizes a sophisticated **Dark Mode-first** approach to enhance the vibrancy of the "Electric Blue" and "Crimson Red" action elements. 

- **Primary (Electric Blue):** Used for primary CTAs, active states, and high-performance indicators.
- **Accent (Crimson Red):** Reserved for "Limited Drop" alerts, sales indicators, and critical interaction feedback.
- **Deep Charcoal & Off-White:** These form the structural canvas. Deep Charcoal provides the depth needed for premium photography, while Off-White is used for high-readability typography and subtle borders.
- **Functional Grays:** A range of mid-tones is used for secondary UI elements like filters and meta-data to ensure they don't distract from the product visuals.

## Typography

The typography strategy focuses on "Impact vs. Utility." 

**Anton** is the voice of the brand, used for large-scale headlines and product titles. Its condensed, bold nature evokes classic sports posters and anime title cards. **Hanken Grotesk** handles the heavy lifting of product descriptions and interface elements, offering a contemporary, clean look that feels technical. **Geist** is used for micro-copy and functional labels, providing a monospaced-adjacent precision that reinforces the "high-performance" narrative.

- Use **display-xl** exclusively for hero sections and major collection launches.
- **Letter spacing** is increased on labels for better legibility on dark backgrounds and decreased on headlines for a tighter, more aggressive feel.

## Layout & Spacing

This design system employs a **12-column fixed grid** for desktop and a **4-column fluid grid** for mobile. 

The spacing rhythm is built on an 8px base unit, but emphasizes **Generous Whitespace** (Section Gaps of 120px+) to allow the high-quality product photography to breathe. 

- **Product Grids:** Use an asymmetrical layout occasionally to break the monotony, highlighting "Featured Pieces" by spanning 2 columns in a 3-column row.
- **Product Details:** Use a 60/40 split on desktop, with the product imagery taking the larger share.
- **Sidebars:** The filter sidebar should be a slide-out "Drawer" on mobile and a persistent, low-profile column on desktop that collapses to icons to maximize horizontal space for products.

## Elevation & Depth

To maintain a "sleek" and "modern" feel, the system avoids traditional heavy shadows. Instead, it uses **Tonal Layers** and **Low-Contrast Outlines**.

- **Surfaces:** The primary background is the deepest charcoal. Secondary containers (like cards or sidebars) are one shade lighter, creating a "stacked" effect without using shadows.
- **Outlines:** Elements like input fields and inactive product cards use a 1px "Ghost Border" (Off-White at 10% opacity). On hover, these borders transition to the Primary Electric Blue.
- **Glassmorphism:** Navigation bars and filter headers use a subtle backdrop blur (20px) with a semi-transparent Deep Charcoal fill (80% opacity) to maintain context while scrolling.
- **Depth in Motion:** Depth is primarily communicated through scale transitions. On hover, product cards should slightly scale (1.02x) rather than lift with a shadow.

## Shapes

The shape language is **Sharp (0px)**. 

To communicate "precision" and "performance," all buttons, containers, product images, and input fields utilize hard 90-degree angles. This geometric rigidity echoes the lines of modern architecture and the technical drawings found in high-end apparel design. 

A single exception is made for "Badge" elements (e.g., "Sold Out" or "New Drop"), which can use a 100px pill shape to create a visual contrast against the otherwise square UI.

## Components

### Buttons
- **Primary:** Sharp corners, Electric Blue background, white bold uppercase text. No shadow. 
- **Secondary:** Transparent background with an Off-White 1px border. 
- **Interaction:** On hover, the Primary button shifts to Crimson Red; the Secondary button fills with Off-White.

### Product Cards
- Aspect ratio: 4:5 (vertical). 
- Full-bleed imagery with a "zero-bezel" feel. 
- Information (Title, Price, Collection) appears in a clean stack below the image.
- Hover state: Images should trigger a secondary "lifestyle" or "alternate angle" shot transition.

### Multi-Step Checkout
- **Progress Indicator:** A technical, thin-line bar at the top with Geist-font labels.
- **Steps:** Each step is its own clean view to reduce cognitive load. 
- **Summary:** A persistent sidebar on desktop that calculates totals in real-time, using a high-contrast charcoal box.

### Filter Sidebars
- Use thin separators (1px). 
- Accordion style for categories.
- Active filters should appear as "Chips" with a small 'X' for quick removal, utilizing the Electric Blue for the active state.