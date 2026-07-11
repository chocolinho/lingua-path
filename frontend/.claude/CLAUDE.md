# CLAUDE.md

Project-specific guidance for frontend work.

## Stack and boundaries

- Use React, Vite, Tailwind CSS 4, React Router, Axios, and Lucide icons.
- Keep all frontend API URLs unchanged and reuse `src/services/*`.
- Preserve JWT storage under `localStorage["token"]` and the Axios bearer interceptor.
- Do not invent backend endpoints or response fields.

## UI foundation

- Treat `src/index.css` as the source of truth for primitive, semantic, and component tokens.
- Use the `ui-*` foundation classes for panels, cards, buttons, inputs, badges, and modals.
- Prefer semantic tokens over raw colors and one-off shadows.
- Maintain WCAG AA contrast, visible focus states, 44px minimum touch targets, and reduced-motion support.
- Build mobile-first and verify 375px, 768px, 1024px, and 1440px layouts.
- Keep the product voice professional, encouraging, and suitable for learners across proficiency levels.

## Component behavior

- Use semantic HTML and visible form labels.
- Associate errors with their fields and announce asynchronous errors with `role="alert"`.
- Dialogs must support focus trapping, Escape, focus restoration, and scroll locking.
- Use Lucide consistently; do not use emoji as structural icons.
