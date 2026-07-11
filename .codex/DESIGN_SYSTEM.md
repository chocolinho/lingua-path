# LinguaPath Design System

**Status:** Permanent, normative project specification  
**Applies to:** `frontend/`  
**Stack:** React, Vite, Tailwind CSS  
**Last established:** 2026-07-10

This document is the single source of truth for LinguaPath product design. New UI work and UI refactors MUST follow it. When existing implementation differs from this document, migrate deliberately toward this specification without changing API contracts, authentication behavior, routes, or backend capabilities.

The design direction is **professional, encouraging, content-first Soft UI Evolution**: clear surfaces, restrained depth, strong contrast, and subtle motion. It must feel credible as a portfolio product and welcoming to English learners without looking childish.

## 1. Brand identity

- **Product name:** LinguaPath.
- **Promise:** A clear, motivating path to stronger English.
- **Personality:** encouraging, capable, calm, inclusive, practical, and trustworthy.
- **Voice:** plain English, concise instructions, supportive feedback, and specific recovery guidance.
- **Visual metaphor:** an open book and a forward path. Use this metaphor sparingly in brand moments, not as decoration on every screen.
- **Product tone:** celebrate effort and progress without exaggerated gamification.
- **Preferred terminology:** learner, lesson, topic, vocabulary, practice, progress, review, result, level, and learning path.
- **Avoid:** babyish language, mascots that dominate the interface, shame-based streak messaging, excessive exclamation marks, and claims unsupported by backend data.

## 2. Target audience

LinguaPath supports English learners across **CEFR A1 through C2**, including students, independent learners, and working adults.

- A1–A2 learners need simple sentences, clear actions, examples, and low cognitive load.
- B1–B2 learners need efficient practice, visible progress, and contextual vocabulary.
- C1–C2 learners need mature presentation, nuanced content, and powerful review tools.
- Do not assume age, nationality, learning speed, or technical expertise.
- Use plain interface language that remains useful at every proficiency level.
- Never equate CEFR level with intelligence or product access.
- When a real CEFR value is unavailable from the backend, do not invent one. Use neutral language such as “personal learning path.”

## 3. Color system

Use a three-layer token architecture: **primitive → semantic → component**. Raw colors belong only in the primitive token layer. React components MUST consume semantic Tailwind utilities or CSS variables.

### Light primitives and semantic roles

| Role | Token | Value | Use |
|---|---|---:|---|
| Background | `--color-background` | `#F8FAFC` | Application canvas |
| Surface | `--color-surface` | `#FFFFFF` | Cards, panels, headers |
| Subtle surface | `--color-surface-subtle` | `#F1F5F9` | Grouping, inactive controls |
| Primary text | `--color-text` | `#0F172A` | Headings and body copy |
| Muted text | `--color-text-muted` | `#475569` | Supporting copy |
| Border | `--color-border` | `#E2E8F0` | Default separators |
| Strong border | `--color-border-strong` | `#CBD5E1` | Inputs and emphasized boundaries |
| Primary | `--color-primary` | `#0F766E` | Primary actions and progress |
| Primary hover | `--color-primary-hover` | `#115E59` | Hover/pressed emphasis |
| Primary soft | `--color-primary-soft` | `#CCFBF1` | Selected and informational backgrounds |
| Secondary | `--color-secondary` | `#4338CA` | Secondary actions and analytical emphasis |
| Secondary hover | `--color-secondary-hover` | `#3730A3` | Secondary hover/pressed state |
| Secondary soft | `--color-secondary-soft` | `#E0E7FF` | Secondary tinted backgrounds |
| Success | `--color-success` | `#15803D` | Confirmed success |
| Warning | `--color-warning` | `#B45309` | Caution, streak, pending attention |
| Danger | `--color-danger` | `#B91C1C` | Errors and destructive actions |
| Information | `--color-info` | `#0369A1` | Neutral system information |
| Focus | `--color-focus` | `#4338CA` | Keyboard focus outline |

### Dark semantic roles

| Role | Value |
|---|---:|
| Background | `#0B1120` |
| Surface | `#111827` |
| Subtle surface | `#1E293B` |
| Primary text | `#F8FAFC` |
| Muted text | `#CBD5E1` |
| Border | `#334155` |
| Primary | `#5EEAD4` |
| Primary hover | `#99F6E4` |
| Primary soft | `#134E4A` |
| Secondary | `#A5B4FC` |
| Secondary hover | `#C7D2FE` |
| Secondary soft | `#312E81` |

### Color rules

- Teal is the principal brand and action color; indigo is secondary.
- A screen SHOULD have one visually dominant primary action.
- Status colors MUST include text or an icon; color alone cannot communicate meaning.
- Body text requires at least 4.5:1 contrast. Large text and essential UI graphics require at least 3:1.
- Dark mode is a separately designed theme, not a mechanical inversion.
- Use amber selectively for streaks, premium cues, or caution. Do not let it compete with the primary action.
- Never add page-specific hex values in JSX.

## 4. Typography

- **Primary family:** Atkinson Hyperlegible.
- **Fallbacks:** `ui-sans-serif`, `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`.
- Atkinson Hyperlegible is used for headings, body copy, labels, and data. Do not introduce a second display font without updating this specification.
- Base body size is 16px with line-height 1.5–1.65.

| Role | Mobile | Desktop | Weight | Guidance |
|---|---:|---:|---:|---|
| Display | 36px | 48–56px | 700 | Marketing hero only |
| Page title / H1 | 30px | 36–40px | 700 | One per page |
| Section / H2 | 22–24px | 24–30px | 700 | Major content groups |
| Card / H3 | 18px | 18–20px | 700 | Component titles |
| Body | 16px | 16px | 400–500 | Default reading text |
| Small | 14px | 14px | 500–600 | Supporting text |
| Label | 12–14px | 12–14px | 600–700 | Metadata and control labels |

- Keep long-form lines near 60–75 characters on desktop and 35–60 on mobile.
- Use sentence case. Reserve uppercase for short navigation group labels.
- Use tabular numerals for scores, timers, XP, percentages, and aligned metrics.
- Prefer wrapping over truncation. Truncate only known single-line metadata and preserve access to the full value.

## 5. Spacing scale

Use a 4px base with an 8px rhythm for most layout decisions.

| Token | Value | Typical use |
|---|---:|---|
| `--space-1` | 4px | Fine icon/text adjustment |
| `--space-2` | 8px | Tight control gaps |
| `--space-3` | 12px | Compact internal spacing |
| `--space-4` | 16px | Default component padding |
| `--space-6` | 24px | Card padding and section gaps |
| `--space-8` | 32px | Major content separation |
| `--space-12` | 48px | Page sections |
| `--space-16` | 64px | Marketing sections |

- Mobile page gutters: 16px.
- Tablet page gutters: 24px.
- Desktop page gutters: 32px, inside a centered maximum-width container.
- Related elements use 8–16px gaps; separate groups use 24–32px; major page sections use 32–48px.
- Do not use arbitrary spacing values when a scale value works.

## 6. Border radius

| Token | Value | Use |
|---|---:|---|
| `--radius-sm` | 10px | Tags, compact controls |
| `--radius-md` | 14px | Buttons, inputs, cards |
| `--radius-lg` | 20px | Panels and dialogs |
| `--radius-xl` | 24px | Marketing or feature panels |
| Full | 9999px | Pills, avatars, progress tracks |

- Use one radius family per component hierarchy.
- Avoid novelty shapes and excessive pill styling.
- Nested elements SHOULD use the same or a smaller radius than their container.

## 7. Shadows

| Token | Value | Use |
|---|---|---|
| `--shadow-1` | `0 1px 2px rgb(15 23 42 / 0.05)` | Controls and cards |
| `--shadow-2` | `0 8px 24px rgb(15 23 42 / 0.08)` | Panels and hover elevation |
| `--shadow-3` | `0 20px 48px rgb(15 23 42 / 0.12)` | Dialogs and floating layers |

- Depth must communicate hierarchy, not decoration.
- Dark mode uses borders and surface contrast instead of visible shadows.
- Hover may increase one elevation step without moving layout bounds.
- Do not use colored shadows, 3D offset shadows, or large diffuse glows.

## 8. Component rules

### General

- Reuse shared components and `ui-*` foundation classes before creating new variants.
- Components MUST support default, hover, active, focus-visible, disabled, loading, error, and dark states where applicable.
- Use Lucide React icons consistently. Default stroke width is the library default; standard sizes are 16, 20, and 24px.
- Structural icons MUST be SVG icons, never emoji.
- Interactive cards MUST use a semantic link or button, not a click handler on a generic `div`.

### Buttons

- Minimum height: 48px for standard buttons; absolute minimum target: 44×44px.
- Primary: teal background and on-primary text.
- Secondary: indigo background and on-secondary text.
- Outline: surface background, strong border, primary-tinted hover.
- Destructive: red semantic treatment, spatially separated from primary actions.
- Icon placement is consistent: leading for action meaning, trailing for direction.
- Loading buttons are disabled, retain their width, and show visible progress.

### Cards and panels

- Cards group one coherent concept. Do not nest multiple decorative cards without information hierarchy.
- Standard card padding is 16–24px.
- Panels organize a page section and may use 20px radius and `--shadow-2`.
- Interactive cards require clear hover, focus, and selected states.

### Modals and sheets

- Use for focused decisions or secondary tasks, never primary page navigation on desktop.
- Include a title, description when useful, visible close action, Escape dismissal, focus trap, focus restoration, and body scroll lock.
- Backdrop uses the semantic scrim at approximately 40–65% opacity.
- Mobile overflow navigation may use a bottom sheet with safe-area padding.

### Feedback and data states

- Loading longer than 300ms uses a layout-matched skeleton.
- Empty states explain why the area is empty and provide one useful next action.
- Errors state what happened and how to recover; network errors include retry when safe.
- Success messages use `aria-live="polite"` and do not steal focus.

## 9. Form rules

- Every input has a persistent visible `<label>` associated through `htmlFor` and `id`.
- Inputs are at least 48px high and use 16px text on mobile.
- Use correct semantic types and `autocomplete` values.
- Placeholder text is an example or hint, never the only label.
- Complex inputs include concise helper text.
- Validate primarily on blur and on submit, not on every keystroke.
- Place errors directly beneath their field and connect them with `aria-describedby`.
- Invalid controls use `aria-invalid="true"`; error summaries use `role="alert"` when multiple fields fail.
- After a failed submit, focus the first invalid field or the error summary.
- Password fields provide a 44×44px show/hide control with an accessible label.
- Submit controls show loading state and prevent duplicate requests.
- Preserve user-entered values after recoverable errors.
- Required fields are identified in text, not only by color or an unexplained asterisk.

## 10. Navigation rules

- Desktop widths of 1024px and above use a persistent sidebar.
- Mobile and tablet use a top app bar plus bottom navigation.
- Bottom navigation has no more than five top-level items, each with icon and text label.
- Primary destinations are Dashboard, Learn, Quiz, Vocabulary, and More.
- Secondary progress, library, account, premium, payment, and admin destinations belong in grouped navigation or the More sheet.
- The current destination is visibly selected and exposed by semantic link state.
- Logout and destructive account actions are separated from normal navigation.
- Core routes remain deep-linkable; do not replace route navigation with modal-only flows.
- Fixed navigation MUST reserve content space and honor safe-area insets.
- Nav placement and grouping remain stable across authenticated pages.
- Every navigation-heavy layout includes a skip link to the main content.

## 11. Responsive rules

Design mobile-first, then enhance at stable Tailwind breakpoints.

| Test width | Purpose |
|---:|---|
| 375px | Small phone baseline |
| 640px | Large phone / small tablet enhancement |
| 768px | Tablet |
| 1024px | Desktop navigation transition |
| 1280px | Wide dashboard composition |
| 1440px | Large desktop quality check |

- No page-level horizontal scrolling at any supported width.
- Use `min-h-dvh`, not `min-h-screen`, for full-height mobile layouts.
- Grids collapse to one column when content would become cramped.
- Tables become stacked rows/cards or gain a deliberate, labeled scroll region; never silently clip columns.
- Keep essential actions visible; fold secondary analytics and metadata below primary content.
- Test portrait and landscape layouts.
- Fixed UI must respect `env(safe-area-inset-*)`.

## 12. Accessibility rules

WCAG 2.2 AA is the project baseline.

- All functionality is keyboard operable with a logical DOM and focus order.
- Focus-visible outlines are at least 3px and must never be removed without an equivalent replacement.
- Touch targets are at least 44×44px with at least 8px separation where practical.
- Use semantic HTML landmarks, headings, lists, buttons, links, labels, and tables.
- Each page has one descriptive H1 and sequential heading levels.
- Icon-only controls require accessible names; decorative icons use `aria-hidden="true"`.
- Meaningful images need concise alt text; decorative images use empty alt text.
- Color is never the sole signal for score, correctness, lock state, or status.
- Progress indicators expose `role="progressbar"`, label, minimum, maximum, and current value.
- Dialogs trap focus, close with Escape, restore trigger focus, and have labelled titles.
- Route changes SHOULD focus the main content or page heading when this does not disrupt an active task.
- Respect browser zoom, text scaling, `prefers-reduced-motion`, and light/dark preferences.
- Test at 200% zoom, keyboard-only, and with a screen-reader-oriented DOM review.

## 13. Animation rules

- Motion is subtle and functional. Default motion intensity is 3/10.
- Fast feedback: 150ms. Normal transitions: 200ms. Complex overlays: no more than 300ms.
- Use the standard easing token `cubic-bezier(0.2, 0, 0, 1)`.
- Prefer opacity and transform; do not animate layout dimensions or positions that cause reflow.
- Progress widths may animate because they communicate state, but must not block reading.
- Never animate more than one or two focal elements at once.
- Avoid decorative parallax, continuous bouncing, confetti loops, and layout-shifting press effects.
- Under `prefers-reduced-motion: reduce`, animations and transitions become effectively immediate.

## 14. Page layout rules

- Authenticated pages use the shared application shell and `.app-page` centered container.
- Maximum content width is approximately 1280px.
- Standard authenticated page padding: 16px mobile, 24px tablet, 32px desktop.
- Page order: H1/context → primary task → supporting content → secondary analytics/actions.
- Use one primary CTA per viewport region.
- Marketing pages may be more spacious but use the same tokens, typography, and interaction rules.
- Page headers include a direct title and one concise explanatory sentence when needed.
- Avoid placing all content inside indistinguishable cards. Use whitespace and headings to establish hierarchy.
- Loading skeletons reserve approximately the final layout size to minimize cumulative layout shift.

## 15. Dashboard guidelines

- The dashboard answers three questions immediately: **What should I do next? How am I progressing? What needs attention?**
- The first viewport prioritizes a continue/start learning action based only on real available data.
- Show level, XP, streak, topics, vocabulary count, and quiz performance only when supported by existing responses.
- Do not invent CEFR levels, weekly activity, recommendations, or streaks.
- Metric cards use concise labels, tabular numbers, and supporting context.
- Learning queue items link directly to existing lesson routes.
- Recent results show topic, correct/total, and score with a useful empty state.
- Charts require a text summary or accessible table alternative. Prefer simple metrics when a chart adds little value.
- Premium promotion is subordinate to learning tasks and appears at most once per dashboard.

## 16. Vocabulary page guidelines

- Prioritize search, comprehension, pronunciation, topic context, progress, and review actions.
- Search is prominent, labelled, debounced where appropriate, and preserves its query during navigation where possible.
- Vocabulary entries present word, part of speech when available, meaning, example, topic, learning status, pronunciation action, and favorite state using only backend-provided fields.
- Pronunciation controls are real buttons with accessible labels such as “Pronounce [word].”
- Filters use existing data and endpoints only; do not imply unsupported CEFR, difficulty, or mastery filters.
- On mobile, vocabulary entries use readable stacked cards. On desktop, a compact list or table is acceptable.
- Long meanings and examples wrap. Do not truncate learning content.
- Loading uses entry skeletons; empty search states repeat the query and suggest clearing filters.
- Pagination or load-more behavior must match the existing service contract.
- Editing and destructive controls are visually secondary and permission-aware.

## 17. Quiz page guidelines

- The quiz interface minimizes distraction and presents one clear task at a time.
- Before starting, show topic, question count, and any real access limitation.
- During a quiz, show meaningful progress such as “Question 3 of 10”; do not show false time pressure.
- Answer options are semantic buttons or radio controls with at least 48px height.
- Selected, correct, and incorrect states use icon/text plus color.
- Prevent accidental duplicate submission and provide loading feedback.
- Keyboard users can reach and select every answer in a logical order.
- Do not reveal correctness before submission unless the existing quiz behavior explicitly requires it.
- Results prioritize score, correct/total, review mistakes, and a clear next action.
- Error recovery preserves in-progress answers whenever feasible and never silently submits partial data.
- Locked or premium content explains the restriction and links only to existing premium routes.

## 18. Authentication page guidelines

- Login and registration use a calm split layout on large screens and a focused single column on mobile.
- The form title is the page H1; the brand name is not a competing H1.
- Keep copy professional and suitable for adults as well as younger learners.
- Login requests only the fields required by the existing API.
- Registration mirrors existing backend requirements and does not collect unsupported profile data.
- Preserve JWT authentication and the existing localStorage token handling.
- Provide email/password autocomplete, password visibility, visible labels, inline errors, and disabled loading submit state.
- Authentication errors explain the next step without exposing sensitive backend details.
- Links between login, registration, and landing remain at least 44px high or have an expanded hit area.
- Theme and language preferences remain available without distracting from the primary form.

## 19. Anti-patterns

Do not introduce:

- Raw hex colors or ad hoc shadows/radii inside JSX.
- Emoji as structural or navigation icons.
- Multiple competing primary buttons in one section.
- Hover-only actions or information.
- Tiny icon buttons, unlabeled icons, or invisible focus states.
- Childish mascots, candy-colored overload, or beginner-only language across the product.
- Excessive gradients, glassmorphism, blur, glow, neumorphism, or 3D button offsets.
- Layout-shifting hover/press translations.
- More than five mobile bottom-navigation items.
- Horizontal chip navigation as a substitute for information architecture.
- Blank loading screens, empty panels, or error messages without recovery guidance.
- Fabricated data, routes, endpoints, CEFR levels, recommendations, or product capabilities.
- Direct API calls inside page components when an existing service abstraction exists.
- Changes to JWT/localStorage behavior as part of visual work.
- Duplicated components that differ only by arbitrary Tailwind values.
- `min-h-screen` for full-height mobile pages or fixed UI without safe-area/content offsets.

## 20. Coding conventions for React + Tailwind

### React

- Use functional components and hooks.
- Keep route-level pages responsible for orchestration; extract genuinely repeated or complex UI into components.
- Reuse existing contexts, services, layouts, and components before creating new abstractions.
- Keep API calls in `src/services/`; do not invent endpoints or change API URLs during UI work.
- Preserve React Router routes and use semantic `Link`/`NavLink` navigation.
- Use stable IDs from backend data for React keys; never use array index when item identity exists.
- Derive display data with `useMemo` only when it improves clarity or avoids material repeated work.
- Clean up effects, timers, listeners, body styles, and focus side effects.
- Use portals for modal overlays when stacking or DOM isolation requires them.
- Error, loading, empty, and success states are part of each data-driven component definition.

### Tailwind and tokens

- Use Tailwind mobile-first responsive utilities.
- Prefer semantic utilities such as `bg-brand` and CSS variables such as `var(--color-surface)` over palette-specific page styling.
- Reuse `.ui-panel`, `.ui-panel-accent`, `.ui-card`, `.ui-button`, `.ui-input`, `.ui-badge`, `.ui-alert`, and modal foundation classes.
- New design values follow primitive → semantic → component token layering in `src/index.css`.
- Do not use dynamic string-built Tailwind class names that cannot be statically detected.
- Avoid arbitrary values unless the value is intrinsic to data or layout and no token fits.
- Keep class ordering readable: layout/position → sizing/spacing → border/background → typography/color → state/responsive.
- Use dark mode through semantic tokens first and `dark:` variants only for specific exceptions.
- Maintain reduced-motion behavior globally and avoid component-level overrides that reintroduce motion.

### Quality gate

Before UI work is complete:

1. Run ESLint and the Vite production build.
2. Test 375px, 768px, 1024px, and 1440px widths with no horizontal overflow.
3. Test light and dark themes independently.
4. Test keyboard navigation, focus order, Escape behavior, and 44×44px targets.
5. Check loading, empty, error, success, disabled, and long-content states.
6. Confirm no backend, API URL, service contract, JWT, or localStorage behavior changed unless explicitly requested.
7. Confirm new UI decisions comply with this document; update this specification first when intentionally changing the system.
