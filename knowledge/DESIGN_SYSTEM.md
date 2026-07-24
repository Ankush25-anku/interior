# Design System

## Theme

Luxury Architectural Theme — Architectural Digest, premium villa design.

Warm, light-dominant, editorial. Dark used sparingly and deliberately, never as
the default mood.

## Colors

| Role | Name | Hex | Tailwind token |
|---|---|---|---|
| Primary Background | Warm Ivory | `#F5F0E8` | `ivory` |
| Secondary Background | Sand Beige | `#D8C7AD` | `sand` |
| Dark Sections | Deep Espresso | `#211B16` | `espresso` |
| Accent | Luxury Gold | `#C9A45C` | `gold` |
| Text | — | `#2A241E` | `ink` |

Rules:

- Warm Ivory is the default page background and the majority of sections.
- Sand Beige alternates with Ivory to keep a light-dominant page from feeling
  monotonous (Services, Testimonials).
- Deep Espresso is reserved for deliberate dark chapters only — Hero's 3D
  scene, the Design Process stepper, and the Footer. Never the default.
- Luxury Gold is the only accent color. No secondary accent (the old "brown"
  tone is retired — use Gold for emphasis, Ink for body copy).
- Never let a background go pure black or pure white. Every dark section is
  Espresso, every light section is Ivory or Sand.

## Typography

Heading font: Playfair Display (a Cormorant Garamond swap is acceptable but
Playfair holds up better across the full type scale, from the Hero display
size down to card titles — legibility was the reason for this whole theme
change, so the heading font must stay readable at every size, not just at
hero scale).

Body font: Manrope.

Heading example:

"Designing Spaces
That Inspire Living"

Font style:

- Architectural
- Editorial
- Confident, not delicate — avoid thin weights below 400 for anything smaller
  than a hero headline.

## Background

Use:

- warm gradients (Ivory/Sand/Espresso only — never flat black)
- subtle noise texture
- soft shadows instead of heavy vignettes
- cinematic overlays on photography must stay warm-toned (espresso/gold
  blends), never a flat black scrim — the image underneath must always stay
  legible as a photograph, not just a dark backdrop.

## Cards

Cards should have:

- rounded corners
- soft border definition against whichever background they sit on (ink/10 on
  light sections, ivory/10 on dark sections)
- hover animation
- 3D tilt

## Buttons

Luxury CTA:

Book Consultation

Effects:

- magnetic hover
- smooth transition
- glow (gold)

## Section Rhythm

Hero (image) → About (Ivory) → Services (Espresso) → Design Process
(Espresso) → Gallery (Ivory) → Before/After (Ivory) → Testimonials (Sand) →
Footer (Espresso).

Espresso sections always run in adjacent pairs or end the page — never
sandwiched by light sections with no transition, so the light/dark rhythm
reads as intentional chapters rather than a random flicker.
