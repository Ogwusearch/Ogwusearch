# Design System

## Brand hierarchy

- Primary identity: Okpe Emmanuel Ogwu.
- Professional brand: OGWU SEARCH.
- Portfolio descriptor: Software, AI, Electronics and Energy Engineering.

## Visual direction

Use a restrained technical/editorial visual language:

- Clear typography and readable line lengths.
- Consistent spacing and grid alignment.
- Restrained accent colours.
- Strong contrast and visible focus states.
- Responsive layouts for mobile, tablet and desktop.
- Motion only when it improves feedback or comprehension.

## Component layers

- `components/ui/`: low-level reusable controls and primitives.
- `components/layout/`: site-wide structural components.
- `features/*/components/`: components owned by one portfolio feature.

## CSS ownership

- `src/styles/reset.css`: browser normalization.
- `src/styles/variables.css`: design tokens.
- `src/styles/globals.css`: global base styles.
- Feature-specific styling should remain close to the feature when practical.

## Accessibility baseline

- Semantic landmarks and heading hierarchy.
- Keyboard-operable navigation and controls.
- Visible keyboard focus.
- Accessible names for icon-only controls.
- Sufficient text/background contrast.
- Meaningful image alternative text.
