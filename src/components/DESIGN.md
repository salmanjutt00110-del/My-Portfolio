# Sébastien Lempens :: Web Engineer :: Portfolio

## Mission
Create implementation-ready, token-driven UI guidance for Sébastien Lempens :: Web Engineer :: Portfolio that is optimized for consistency, accessibility, and fast delivery across documentation site.

## Brand
- Product/brand: Sébastien Lempens :: Web Engineer :: Portfolio
- URL: https://www.sebastien-lempens.com/
- Audience: developers and technical teams
- Product surface: documentation site

## Style Foundations
- Visual style: clean, functional, implementation-oriented
- Main font style: `font.family.primary=radikalthin`, `font.family.stack=radikalthin`, `font.size.base=18px`, `font.weight.base=400`, `font.lineHeight.base=27px`
- Typography scale: `font.size.xs=16px`, `font.size.sm=18px`, `font.size.md=32px`
- Color palette: `color.text.primary=#ffffff`, `color.text.secondary=#f3edf2`, `color.text.tertiary=#e6e6e6`, `color.surface.base=#000000`, `color.surface.muted=#5e3f59`, `color.surface.raised=#272727`, `color.border.muted=rgba(243, 237, 242, 0.8) rgba(243, 237, 242, 0.8) rgba(243, 237, 242, 0.8) rgba(213, 200, 210, 0.8)`
- Spacing scale: `space.1=2px`, `space.2=5px`, `space.3=15px`, `space.4=16px`, `space.5=18px`, `space.6=23.94px`, `space.7=25px`, `space.8=32px`
- Radius/shadow/motion tokens: `radius.xs=3px` | `motion.duration.instant=150ms`, `motion.duration.fast=300ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
Concise, confident, implementation-focused.

## Rules: Do
- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

## Required Output Structure
- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: links (53), buttons (12), cards (2), lists (1).

- Extraction diagnostics: Audience and product surface inference confidence is low; verify generated brand context.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.
