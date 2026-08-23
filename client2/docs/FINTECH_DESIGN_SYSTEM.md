# FinTech Design System — Phase 1 Foundation

Loan management UI for Indian lending context. Calm, trustworthy, mobile-first.

## Principles

- Trust over decoration
- Clarity over complexity
- Consistency over novelty
- Mobile usability over desktop aesthetics
- Financial readability over visual effects

Avoid: glassmorphism, heavy gradients, glowing effects, decorative motion, marketing-style pills.

---

## Color system

Use existing CSS variables in `src/index.css`. Do not introduce arbitrary Tailwind palette colors.

| Token | Usage |
|-------|--------|
| `--primary` | Brand actions, links, submitted status accent |
| `--background` / `--card` | App shell and surfaces |
| `--muted` / `--muted-foreground` | Secondary text, neutral badges |
| `--destructive` / `--danger-soft` | Rejected, failed, overdue |
| `--success` / `--success-soft` | Approved, verified, paid |
| `--warning` / `--warning-soft` | Pending, under review, action required |
| `--info` / `--info-soft` | Informational states (submitted, disbursed) |

### Status mapping

| Status | Tone | Variant |
|--------|------|---------|
| DRAFT, CLOSED | neutral | `neutral` |
| SUBMITTED, DISBURSED | info | `info` |
| UNDER_REVIEW, PENDING, PARTIALLY_PAID | warning | `warning` |
| APPROVED, VERIFIED, PAID | success | `success` |
| REJECTED, OVERDUE | destructive | `destructive` |

Config source: `src/lib/status.js`  
Component: `src/components/common/StatusBadge.jsx`

---

## Typography

| Class | Use |
|-------|-----|
| `.page-title` | Page heading (restrained: xl → 2xl) |
| `.section-title` | Major section heading |
| `.subsection-title` | Group heading inside a section |
| `.text-label` | Form labels, field names |
| `.text-helper` | Helper text below inputs |
| `.text-caption` | Meta / footnotes |
| `.financial-label` | Metric label (e.g. "Loan Amount") |
| `.financial-value` | Metric value — `tabular-nums`, semibold |

### Financial value pattern

```jsx
<div>
  <p className="financial-label">Monthly EMI</p>
  <p className="financial-value">₹12,450</p>
</div>
```

Font stack: **Geist Variable** (loaded in `main.jsx`).

---

## Spacing & layout

### Page container

`.page-container` — used in `CustomerLayout` and `AdminLayout`:

- `max-w-7xl`
- `px-4 py-5` → `sm:px-6 sm:py-6` → `lg:px-8 lg:py-8`

Do not invent per-page max-widths.

### Section spacing

- Between sections: `space-y-6` or `gap-6`
- Inside sections: `space-y-4`
- Form fields: `space-y-2` (via `FormField`)

---

## Buttons (`components/ui/button`)

| Variant | When to use |
|---------|-------------|
| `default` | Primary action (one per section) |
| `outline` | Secondary / cancel |
| `ghost` | Tertiary / toolbar |
| `destructive` | Irreversible delete |
| `link` | Inline navigation |
| `success` / `warning` | **Avoid** as buttons — reserve for badges |

### Sizes & touch targets

- Default: `h-11` (44px) — mobile baseline
- `sm`: `h-10` — dense secondary actions
- `lg` / `xl`: prominent CTAs
- `icon`: `size-11` minimum for primary icon buttons

### Loading state

```jsx
<Button loading disabled={isSubmitting}>
  {isSubmitting ? "Saving..." : "Continue"}
</Button>
```

Sets `aria-busy` and `disabled`. Pair with visible loading text.

**Removed in Phase 1:** `active:scale` press animation.

---

## Forms (`components/common/FormField`)

Structure:

1. `Label` (+ required `*`)
2. Input / Select / Textarea (child)
3. Helper text OR error (`role="alert"`)

Use `aria-invalid` on inputs when validation fails.

Do not rewrite existing forms in Phase 1 — adopt on new/refactored screens in Phase 2.

---

## Cards (`components/ui/card`)

Use `Card` when grouping **meaningful** units:

- Loan summary
- Application status block
- Document group

Do **not** wrap every subsection in a card.

### Interactive cards

```jsx
<Card interactive onClick={...}>
```

Hover shadow only when `interactive={true}`.

---

## Badges (`components/ui/badge`)

Semantic variants: `success`, `warning`, `info`, `neutral`, `destructive`, `outline`, `secondary`.

Radius: `rounded-md` (restrained, not pill marketing).

Prefer `StatusBadge` for enum statuses.

---

## Dialogs (`components/ui/dialog`)

- Mobile width: `max-w-[calc(100%-2rem)]`
- Max height: `max-h-[calc(100dvh-2rem)]` with `overflow-y-auto`
- Footer: `flex-col-reverse` on mobile, row on `sm+`
- Overlay: `bg-black/40` without blur

Use `Sheet` for mobile-first side panels when appropriate (Phase 2).

---

## Icons

Lucide React only. Use for actions (Upload, View, Delete, Edit, navigation). Do not icon-decorate every label.

---

## Animation

Allowed: loading pulse (skeleton), short dialog fade/zoom, color transitions on hover.

Not allowed: floating elements, animated backgrounds, scale-on-press buttons, decorative motion.

---

## Mobile-first

Design for 320–412px first. Prefer `flex-col` → `sm:flex-row`.

Check:

- No horizontal overflow
- Primary CTA full-width on narrow screens where appropriate
- Dialogs scroll internally
- Bottom nav clearance (`pb-24` on customer main)

---

## Dark mode

Tokens support `.dark` in `index.css`. Components use semantic variables — no hardcoded grays in new code.
