# FinTech UI Audit — Phase 1

Audit date: August 2026  
Scope: `client/src` frontend foundation (no feature page redesign)

## Executive summary

The project already defines a strong token layer in `src/index.css` (brand, semantic colors, loan status variables, shadows, radius). Layout shells in `CustomerLayout` and `AdminLayout` share a consistent content width. However, feature pages frequently bypass tokens with inline Tailwind (`bg-yellow-100`, `rounded-2xl border bg-card`) and duplicate small UI patterns (status badges, form field wrappers).

Phase 1 addresses the **shared foundation only**. Feature pages remain unchanged until Phase 2.

---

## P0 — Foundation gaps

| Issue | Location | Impact |
|-------|----------|--------|
| Font mismatch | `main.jsx` loads Geist; `index.css` previously referenced Inter | Inconsistent typography rendering |
| Status badge duplication (4 implementations) | `features/admin/components/StatusBadge.jsx`, `MyLoans.jsx`, `LoanDetails.jsx`, `ReviewSubmitStep.jsx` | Same status looks different across app; raw Tailwind colors bypass design tokens |
| Form field duplication | `AuthInput.jsx`, local `FormField` in `EducationDetailsStep.jsx`, `FormInput` in `ParentDetailsStep.jsx` | Inconsistent labels, errors, spacing |
| Card hover on all cards | `components/ui/card.jsx` | Cards feel like marketing tiles, not financial records |
| Button press scale animation | `components/ui/button.jsx` `active:scale-[0.98]` | Feels playful/SaaS, not lending-grade |
| Decorative body gradient | `index.css` body background | Adds visual noise to workspace |

## P1 — Consistency & mobile

| Issue | Location | Impact |
|-------|----------|--------|
| Mixed heading sizes | Dashboard (`text-2xl font-bold`), wizard steps (`text-2xl font-semibold`, `sm:text-3xl`) | Weak hierarchy; some titles too large on mobile |
| Ad-hoc section wrappers | Wizard steps use `rounded-2xl border bg-card` divs | Card-inside-card patterns |
| Mixed border radii | `rounded-xl` cards vs `rounded-2xl` badge/textarea/alert/skeleton | Visual inconsistency |
| Small icon buttons | `Button` `icon-xs` (`size-7`), `size-8` | Below 44px touch baseline for primary actions |
| Dialog backdrop blur | `dialog.jsx` overlay | Slight glassmorphism; reduced in Phase 1 |
| Dense bottom nav labels | `MobileBottomNav.jsx` `text-[11px]` | Readable but tight on small screens |
| Payments nav duplicate path | `MobileBottomNav` Payments → same URL as Loans | UX confusion (Phase 2) |

---

## Duplication inventory

### Status presentation

1. `features/admin/components/StatusBadge.jsx` — **migrated in Phase 1** to shared `components/common/StatusBadge.jsx`
2. `getStatusClass()` — `features/loan/pages/MyLoans.jsx`, `features/loan/pages/LoanDetails.jsx`
3. `DocumentStatus` — `features/loan/components/ReviewSubmitStep.jsx`

### Form wrappers

1. `features/auth/components/AuthInput.jsx`
2. Local `FormField` — `features/loan/components/EducationDetailsStep.jsx`
3. `FormInput` / `ErrorMessage` — `features/loan/components/ParentDetailsStep.jsx`

### Profile folders (dead code)

- `components/profile/*` — **zero imports** in codebase
- Active profile UI uses `features/profile/*` via `pages/Profile.jsx`

**Action:** Document as deprecated; do not delete in Phase 1 without explicit cleanup approval.

---

## Card overuse examples (Phase 2 targets)

- `ApplyLoan.jsx` — progress block + stepper + step content each wrapped in bordered cards
- `Dashboard.jsx` — stat metrics in nested bordered boxes inside cards
- Wizard steps — outer `rounded-2xl border bg-card` plus inner `rounded-xl border` sections

**Rule for Phase 2:** Use `Card` for meaningful groups (Loan Summary, Application Status). Use `section` + border/spacing for sub-groups.

---

## shadcn inventory (`components/ui`)

Present: alert, avatar, badge, breadcrumb, button, card, checkbox, dialog, dropdown-menu, input, label, pagination, progress, radio-group, select, separator, sheet, skeleton, table, tabs, textarea, tooltip.

Not present: `form` (shadcn Form wrapper). Project uses React Hook Form + Zod directly — acceptable.

Phase 1 standardized: button, badge, card, dialog, skeleton.

---

## Accessibility notes

| Area | Finding |
|------|---------|
| Focus rings | Button/Input retain `focus-visible:ring-4` — preserved in Phase 1 |
| Icon-only buttons | Dialog close has `sr-only` label — good |
| Status | Previously color-only raw spans; shared `StatusBadge` adds `aria-label` |
| Form errors | Inconsistent `role="alert"` — shared `FormField` provides it |
| Touch targets | Default button height increased to 44px (`h-11`) |

---

## Navigation

- Customer: desktop sidebar + mobile sheet + bottom nav — solid mobile foundation
- Admin: desktop sidebar only — acceptable for Phase 1
- Public/marketing: separate components — out of Phase 1 scope

---

## Recommended rules for Phase 2

1. Use `StatusBadge` from `@/components/common/StatusBadge` everywhere
2. Use `FormField` for new/refactored forms
3. Use `.page-title`, `.section-title`, `.financial-value` utilities
4. Prefer `section` + spacing over nested cards
5. One primary button per action area; full-width on mobile for main CTA
6. No new arbitrary Tailwind status colors — use badge semantic variants
