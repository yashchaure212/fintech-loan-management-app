# LoanPro Production Financial Design System
## Bajaj Finserv-inspired direction — original implementation for LoanPro

> **Purpose:** This document is the single source of truth for the LoanPro frontend visual system.
> It defines the visual language, CSS tokens, layout rules, component behavior, responsive rules,
> accessibility requirements, animation policy, and page composition standards for a trustworthy
> production-grade Indian financial-services product.
>
> **Reference direction:** Bajaj Finserv is used only as a visual/product-quality reference.
> Do **not** copy its logo, exact layouts, illustrations, proprietary assets, copy, or branding.
> LoanPro must have its own identity.

---

# 1. Design North Star

LoanPro should feel like an **established financial institution**, not a startup SaaS dashboard.

### The desired impression

- Trustworthy
- Stable
- Professional
- Clear
- Financially responsible
- Modern
- Human
- Easy to understand
- Fast and purposeful
- Suitable for customers handling important financial information

### Avoid

- Excessive rounded cards
- Glassmorphism
- Gradient-heavy SaaS visuals
- Huge decorative blobs
- Floating UI everywhere
- Excessive shadows
- Excessive animation
- Dashboard-within-a-dashboard layouts
- Tiny text
- Overly playful illustrations
- Neon colors
- Excessive pill-shaped controls
- Every section becoming a card

### Core rule

**Content should feel like it belongs to a financial institution's official website/app.**

The UI should communicate:

> "Your money and application are being handled by a serious, reliable organization."

---

# 2. Visual Reference Principles

The public experience should take inspiration from the qualities visible in mature financial-services products:

- Strong blue/navy brand presence
- White and very-light neutral surfaces
- Clear product navigation
- Prominent but controlled primary CTAs
- Strong information hierarchy
- Large editorial sections
- Financial calculators and useful tools
- Trust/security information
- FAQs and explanatory content
- Structured service discovery
- Practical customer self-service

Bajaj Finserv's current public materials emphasize customer-centricity, technology leadership, digital-first engagement and broad self-service capabilities. LoanPro should translate those principles into its own design language rather than imitate the brand. citeturn0search2turn0search9

---

# 3. Brand Personality

## Primary personality

**Trusted + Modern + Approachable**

Not:

- Corporate and cold
- Startup and playful
- Luxury banking
- Government portal
- Consumer social app

### Voice-to-visual translation

| Brand quality | UI expression |
|---|---|
| Trust | Navy, restrained shadows, stable layouts |
| Clarity | Strong hierarchy, generous spacing |
| Modern | Clean typography, subtle interaction |
| Approachability | Friendly copy, soft secondary surfaces |
| Financial seriousness | Structured data, tables, clear states |
| Reliability | Predictable controls and consistent patterns |

---

# 4. Color System

Use a restrained palette.

## Brand

```css
:root {
  --lp-navy: #12304A;
  --lp-navy-strong: #0B2438;
  --lp-blue: #1769AA;
  --lp-blue-hover: #12598F;
  --lp-blue-soft: #EEF6FC;

  --lp-sky: #2E8BCB;
  --lp-sky-soft: #F0F8FD;

  --lp-white: #FFFFFF;
  --lp-page: #F7F9FB;
  --lp-surface: #FFFFFF;
  --lp-surface-subtle: #F3F6F8;
  --lp-surface-muted: #EAF0F4;
}
```

## Text

```css
:root {
  --lp-text: #172B3A;
  --lp-text-secondary: #405463;
  --lp-text-muted: #667783;
  --lp-text-subtle: #82919B;
  --lp-text-disabled: #A8B3BA;
  --lp-text-on-dark: #FFFFFF;
}
```

## Borders

```css
:root {
  --lp-border: #D9E1E6;
  --lp-border-light: #E8EDF0;
  --lp-border-strong: #BCC8D0;
}
```

## Semantic colors

```css
:root {
  --lp-success: #16834B;
  --lp-success-soft: #EAF7F0;
  --lp-success-border: #BFE4CF;

  --lp-warning: #B86A00;
  --lp-warning-soft: #FFF5E7;
  --lp-warning-border: #F0D2A4;

  --lp-danger: #C43D3D;
  --lp-danger-soft: #FDEEEE;
  --lp-danger-border: #F1C5C5;

  --lp-info: #1769AA;
  --lp-info-soft: #EEF6FC;
  --lp-info-border: #C8E1F3;
}
```

## Usage rule

Do not use all brand colors simultaneously.

### Recommended visual ratio

- 70% neutral / white
- 20% navy / dark text
- 8% blue
- 2% semantic/accent colors

Blue is a functional brand accent, not a decoration applied to every element.

---

# 5. Tailwind CSS v4 Theme

LoanPro uses Tailwind CSS v4.

Create the design tokens in `src/index.css` and expose them through `@theme inline`.

Recommended structure:

```css
@import "tailwindcss";

@theme inline {
  --color-background: var(--lp-page);
  --color-foreground: var(--lp-text);

  --color-primary: var(--lp-blue);
  --color-primary-foreground: var(--lp-white);

  --color-secondary: var(--lp-surface-subtle);
  --color-secondary-foreground: var(--lp-text);

  --color-muted: var(--lp-surface-subtle);
  --color-muted-foreground: var(--lp-text-muted);

  --color-border: var(--lp-border);
  --color-input: var(--lp-border);
  --color-ring: var(--lp-blue);

  --color-success: var(--lp-success);
  --color-warning: var(--lp-warning);
  --color-destructive: var(--lp-danger);
}
```

Prefer semantic classes over raw color values in components.

Good:

```jsx
className="bg-primary text-primary-foreground"
```

Avoid:

```jsx
className="bg-[#1769AA]"
```

unless the value is genuinely component-specific.

---

# 6. Typography

## Font

Use **Inter** as the primary UI font.

If the existing project already loads Inter, keep it.

```css
font-family:
  "Inter Variable",
  "Inter",
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

Geist may be retained for technical/admin contexts only if there is a strong reason, but the default LoanPro experience should use one consistent type family.

---

# 7. Type Scale

```css
:root {
  --text-xs: 0.75rem;      /* 12 */
  --text-sm: 0.875rem;     /* 14 */
  --text-base: 1rem;       /* 16 */
  --text-lg: 1.125rem;     /* 18 */
  --text-xl: 1.25rem;      /* 20 */
  --text-2xl: 1.5rem;      /* 24 */
  --text-3xl: 1.875rem;    /* 30 */
  --text-4xl: 2.25rem;     /* 36 */
  --text-5xl: 3rem;        /* 48 */
}
```

## Public website

```text
Hero heading:      40–52px
Section heading:   28–36px
Subheading:        18–22px
Body:              16px
Small body:        14px
Legal/meta:        12–13px
```

## Customer portal

```text
Page title:        28–34px
Section title:     20–24px
Body:              14–16px
Data:              14–16px
Labels:            12–14px
```

## Rules

- Never use 10px text for normal UI.
- Labels may be 12–13px.
- Financial values can be visually prominent.
- Use weight for hierarchy instead of dramatically increasing font size.
- Avoid all-caps except compact metadata and very small utility labels.
- Keep paragraph line length around 60–80 characters.

---

# 8. Font Weights

Use a restrained weight system.

```text
400  Regular
500  Medium
600  Semibold
700  Bold
```

Recommended:

```text
Body              400
Navigation        500
Labels            500
Buttons           600
Section headings  600
Hero headings     600–700
Financial values  600–700
```

Avoid using 800/900 except for rare marketing moments.

---

# 9. Spacing System

Use a 4px base grid.

```css
:root {
  --space-1: 0.25rem;   /* 4 */
  --space-2: 0.5rem;    /* 8 */
  --space-3: 0.75rem;   /* 12 */
  --space-4: 1rem;      /* 16 */
  --space-5: 1.25rem;   /* 20 */
  --space-6: 1.5rem;    /* 24 */
  --space-8: 2rem;      /* 32 */
  --space-10: 2.5rem;   /* 40 */
  --space-12: 3rem;      /* 48 */
  --space-16: 4rem;      /* 64 */
  --space-20: 5rem;      /* 80 */
  --space-24: 6rem;      /* 96 */
}
```

### Rule

Use spacing to create hierarchy.

Do not create hierarchy by putting every piece of content inside a separate card.

---

# 10. Container System

All major pages should use a centered content container.

```css
.lp-container {
  width: min(100% - 32px, 1200px);
  margin-inline: auto;
}

@media (min-width: 768px) {
  .lp-container {
    width: min(100% - 64px, 1200px);
  }
}

@media (min-width: 1280px) {
  .lp-container {
    width: min(100% - 80px, 1240px);
  }
}
```

### Wide marketing sections

Maximum width:

```text
1200–1240px
```

### Data-heavy application pages

Maximum width:

```text
1280–1360px
```

Do not make every page full-width.

Use full-width backgrounds with centered inner content.

---

# 11. Section System

The public site should be **section-based**, not card-grid-based.

Preferred:

```text
Full-width background
└── Centered container
    ├── Section eyebrow
    ├── Heading
    ├── Supporting copy
    └── Content layout
```

Example:

```jsx
<section className="bg-white">
  <div className="lp-container py-16 md:py-20">
    ...
  </div>
</section>
```

Use alternating backgrounds sparingly:

```text
White
Light neutral
White
Soft blue
White
Navy
```

---

# 12. Border Radius

Financial UI should be slightly rounded, not bubbly.

```css
:root {
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-pill: 999px;
}
```

### Rules

Use:

- 6px for inputs
- 6–8px for buttons
- 8–12px for cards
- 12px for large promotional surfaces
- pill only for tags, filters and compact status indicators

Avoid:

```text
rounded-3xl
rounded-full on large buttons
20–32px card radius
```

---

# 13. Elevation / Shadows

Use borders first and shadows second.

```css
:root {
  --shadow-none: none;

  --shadow-xs:
    0 1px 2px rgb(18 48 74 / 0.04);

  --shadow-sm:
    0 1px 3px rgb(18 48 74 / 0.06),
    0 2px 6px rgb(18 48 74 / 0.04);

  --shadow-md:
    0 6px 18px rgb(18 48 74 / 0.08);

  --shadow-lg:
    0 12px 32px rgb(18 48 74 / 0.12);

  --shadow-dialog:
    0 20px 60px rgb(18 48 74 / 0.18);
}
```

### Rule

Most ordinary surfaces should use:

```text
border + white background
```

rather than:

```text
huge shadow + floating card
```

---

# 14. Card Philosophy

Cards are **supporting primitives**, not the page architecture.

## Use cards for

- Loan product summaries
- Important financial summaries
- Offers
- Documents
- Alerts
- Selectable options
- Small dashboard modules
- Promotional content

## Do not use cards for

- Every paragraph
- Every form section
- Navigation
- Whole pages
- Every table
- Every section of a landing page

### Correct pattern

```text
Page
├── Page header
├── Main section
│   ├── Data table
│   └── Secondary information
├── Supporting section
└── Footer
```

Not:

```text
Page
├── Card
│   ├── Card
│   └── Card
├── Card
└── Card
```

---

# 15. Buttons

## Primary

Used for the main action.

```text
Background: brand blue
Text: white
Radius: 6–8px
Height: 44px desktop
```

## Secondary

```text
Background: white
Border: brand/border
Text: navy
```

## Tertiary

Text-only action.

Use only where the action is clearly secondary.

## Destructive

Reserved for destructive actions.

Never use red as a generic secondary action.

### Button sizing

```text
Small: 36px
Default: 44px
Large: 48–52px
```

### Button rule

One dominant primary action per visual area.

Avoid five competing blue buttons.

---

# 16. Navigation

## Public navigation

Structure:

```text
[Logo]

Loans
Products
Calculators
Resources
About

                         Help
                         Login
                         [Apply Now]
```

Desktop navigation should be:

- White or very light
- Sticky only when useful
- Clearly separated from content
- Minimal
- Stable

### Header height

```text
72–80px desktop
60–68px mobile
```

### Active navigation

Use:

- Blue text
- Small underline or subtle bottom indicator
- No oversized pill

---

# 17. Customer Portal Navigation

Customer portal is calmer than the public website.

Desktop:

```text
Sidebar
├── Overview
├── My Applications
├── My Loans
├── Documents
├── Profile
└── Help & Support
```

Use a narrow, structured sidebar.

Avoid:

- Huge icon tiles
- Excessive gradients
- Giant dashboard cards

---

# 18. Admin Navigation

Admin UI can be denser.

```text
Dashboard
Applications
Customers
Loans
Loan Products
Eligibility
Documents
Institutions
Reports
Settings
```

Admin should prioritize:

- tables
- filters
- search
- status
- bulk actions
- detail views

Not decorative dashboards.

---

# 19. Hero Section

The hero should communicate the product immediately.

Preferred structure:

```text
Small trust/product eyebrow

Large headline
Clear financial value proposition

Supporting text

[Primary CTA] [Secondary CTA]

Trust/support information
```

Optional visual on the right:

- product image
- person using finance service
- loan illustration
- calculator
- structured offer panel

Avoid huge abstract gradients.

### Hero height

Do not force `100vh`.

Prefer content-driven:

```text
480–640px desktop
auto on mobile
```

---

# 20. Marketing Page Composition

Preferred public landing structure:

```text
Header
Hero
Trust / key facts
Product categories
Featured loan/service
Calculator or useful tool
How it works
Eligibility / requirements
Why choose LoanPro
Customer support / FAQ
Security / trust information
Final CTA
Footer
```

This follows a financial-services information architecture rather than a SaaS product-dashboard architecture.

---

# 21. Loan Product Section

Loan products should communicate financial information clearly.

Recommended:

```text
Education Loan

Finance your education with a structured repayment plan.

Loan amount
₹50,000 – ₹20,00,000

Tenure
12 – 84 months

Interest
From 9.5% p.a.

[Check Eligibility] [Apply Now]
```

Do not hide critical terms behind decorative cards.

Financial facts should be easy to scan.

---

# 22. Financial Data Presentation

For important financial values:

```text
₹8,50,000
```

should have visual priority.

Example:

```text
Outstanding balance

₹8,50,000

Next EMI
₹18,240

Due 05 Sep 2026
```

Use tables when users need to compare multiple values.

### Prefer table over cards when

- More than 4 similar records exist
- Users need comparison
- Users need sorting/filtering
- Data has consistent columns
- Admin workflows are involved

---

# 23. Tables

Tables are a first-class component.

```text
Header
────────────────────────────────────────
Application   Amount      Status   Date
LP-1024       ₹8.5L       Review   22 Aug
LP-1023       ₹4.2L       Approved 20 Aug
────────────────────────────────────────
```

### Table rules

- Compact but readable
- 48–56px row height
- Subtle row borders
- Hover state only when useful
- Sticky header for long tables
- Right-align financial numbers
- Left-align descriptive content
- Status displayed with text + semantic color
- Avoid excessive cell borders

---

# 24. Forms

Forms should look institutional and easy to complete.

## Field structure

```text
Label *
Input
Helper text
Error message
```

Do not rely on placeholder text as the label.

### Input

```css
height: 44px;
border: 1px solid var(--lp-border);
border-radius: 6px;
background: white;
```

Focus:

```text
2px accessible blue ring
```

### Error

```text
Label remains normal
Input gets danger border
Clear error message below
```

Never rely only on red color.

---

# 25. Form Layout

For complex loan applications:

```text
Step 1
Personal details

Step 2
Employment

Step 3
Education

Step 4
Loan details

Step 5
Documents

Step 6
Review & submit
```

Use a progress indicator at the top.

Desktop:

```text
1 Personal ── 2 Employment ── 3 Education ── 4 Loan ── 5 Documents ── 6 Review
```

Mobile:

```text
Step 3 of 6
Education
──────────────
```

---

# 26. Progress Indicators

Use progress for multi-step financial processes.

Recommended:

- Completed = blue/green
- Current = blue
- Upcoming = neutral

Do not use animated progress bars continuously.

---

# 27. Status System

Statuses must be consistent across the entire application.

```text
Draft
Submitted
Under Review
Approved
Rejected
Disbursed
Closed
```

Suggested mapping:

```css
.status-draft {
  color: #5D6B75;
  background: #F0F3F5;
}

.status-submitted {
  color: #1769AA;
  background: #EEF6FC;
}

.status-review {
  color: #9A5B00;
  background: #FFF5E7;
}

.status-approved {
  color: #16834B;
  background: #EAF7F0;
}

.status-rejected {
  color: #C43D3D;
  background: #FDEEEE;
}

.status-disbursed {
  color: #1769AA;
  background: #EEF6FC;
}

.status-closed {
  color: #52616B;
  background: #EEF1F3;
}
```

Use pills only for status.

---

# 28. Alerts

Alerts should be horizontal information blocks.

```text
[icon] Your application is under review.
      We'll notify you when the status changes.
```

Types:

```text
Info
Success
Warning
Danger
```

Avoid turning every alert into a modal.

---

# 29. Modals / Dialogs

Use dialogs only when interruption is justified.

Good use cases:

- Confirmation
- Delete
- Important verification
- Document preview
- High-impact action

Avoid opening dialogs for ordinary navigation.

### Dialog width

```text
Small: 400px
Medium: 520px
Large: 720–900px
```

---

# 30. Drawers

Use drawers for:

- Filters
- Mobile navigation
- Secondary details
- Application metadata

Do not use drawers as a replacement for every page.

---

# 31. Empty States

Every data-driven page must have an intentional empty state.

Example:

```text
No loan applications yet

Start your first application and track its progress here.

[Apply for a Loan]
```

Avoid generic:

```text
No data
```

---

# 32. Loading States

Prefer skeletons for content-heavy pages.

Skeleton:

```text
neutral gray blocks
subtle pulse
```

Avoid full-screen spinners unless the entire application genuinely cannot render.

### Loading philosophy

```text
Page shell → immediately visible
Content → skeleton
Action → button loading state
Navigation → preserve current state
```

---

# 33. Error States

Every API-backed screen needs:

```text
What happened
Why it matters
What the user can do
```

Example:

```text
We couldn't load your applications.

Your information is safe. Please try again.

[Try Again]
```

Avoid raw server errors.

---

# 34. Toasts

Toasts are for lightweight feedback.

Good:

- Saved successfully
- Document uploaded
- Application updated

Bad:

- Important legal information
- Detailed validation
- Critical financial decisions

Never put essential information only in a toast.

---

# 35. Icons

Use Lucide React consistently.

Rules:

```text
16px  inline/icon metadata
18px  buttons
20px  navigation
24px  feature/icon blocks
```

Do not mix icon libraries.

Avoid decorative icons that do not improve comprehension.

---

# 36. Illustration / Imagery

Imagery should communicate:

- people
- education
- financial goals
- trust
- progress
- customer support
- responsible finance

Avoid:

- generic crypto imagery
- futuristic neon finance
- excessive 3D objects
- random abstract blobs
- cliché stock photos everywhere

Use imagery as a supporting layer, not the entire identity.

---

# 37. Animation System

Animation should be intentionally minimal.

### Default duration

```css
--duration-fast: 120ms;
--duration-normal: 180ms;
--duration-slow: 260ms;
```

### Easing

```css
--ease-standard: cubic-bezier(0.2, 0, 0, 1);
```

Use animation for:

- hover
- focus
- dropdown
- modal
- drawer
- accordion
- page transition where appropriate

Avoid:

- floating cards
- constant background movement
- bouncing buttons
- excessive scroll animations
- animated financial numbers unless meaningful
- parallax everywhere

### Hover

Prefer:

```text
small background change
border change
shadow change
```

Not:

```text
large transform
scale 1.08
```

---

# 38. Reduced Motion

Always support reduced motion.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

# 39. Accessibility

Production-level financial UI must target WCAG 2.2 AA.

Requirements:

- Keyboard navigation
- Visible focus states
- Proper labels
- Semantic HTML
- Accessible error messages
- Sufficient color contrast
- `aria-live` for async status where appropriate
- No color-only status communication
- Touch targets at least ~44px
- Meaningful button labels
- Alt text for meaningful images
- Decorative images marked appropriately

---

# 40. Focus Ring

Never remove browser focus without replacing it.

Recommended:

```css
:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px #FFFFFF,
    0 0 0 4px var(--lp-blue);
}
```

---

# 41. Responsive Design

Design mobile-first.

## Breakpoints

```text
sm  640px
md  768px
lg  1024px
xl  1280px
2xl 1536px
```

## Mobile

- Single column
- Bottom actions when useful
- Large touch targets
- Simplified navigation
- Horizontal scrolling for small tab groups
- Tables may become stacked records
- Sidebars become drawers

## Tablet

- 2-column layouts where useful
- Maintain readable content width

## Desktop

- 2–4 column content layouts
- Full navigation
- Data tables
- Sidebars
- Larger information density

---

# 42. Mobile Navigation

Public mobile:

```text
[Logo]                         [Menu]
```

Customer app:

```text
[Logo]                         [Profile]
────────────────────────────
Page content
────────────────────────────
Home | Applications | Loans | Profile
```

Use bottom navigation only when it improves frequent mobile workflows.

Do not force bottom navigation on every page.

---

# 43. Dashboard Philosophy

The dashboard is not a collection of KPI cards.

Preferred:

```text
Welcome back, Rahul

Application status
────────────────────────────────────
Education Loan
Under review

Next action
Upload income document
[Continue]

────────────────────────────────────

Recent applications
Table/list

────────────────────────────────────

Useful services
Small action links
```

The user should immediately understand:

1. Where am I?
2. What do I have?
3. What needs my attention?
4. What can I do next?

---

# 44. Customer Dashboard

Priority order:

```text
1. Important status
2. Required action
3. Financial summary
4. Applications / loans
5. Documents
6. Support
```

Avoid showing 10 unrelated metrics above the fold.

---

# 45. Admin Dashboard

Admin priority:

```text
1. Applications requiring action
2. Queue / status overview
3. Recent activity
4. Search
5. Operational metrics
```

Use KPI cards only for genuinely important numbers.

Example:

```text
Applications
1,284

Under Review
128

Approved
74

Disbursed
42
```

Four cards are enough.

---

# 46. Page Header

Standard internal page:

```text
Dashboard

Overview of your applications and account activity.

[Primary action]
```

For admin:

```text
Loan Applications
Review and manage customer applications.

[Export] [Filters]
```

Use consistent spacing.

---

# 47. Breadcrumbs

Use breadcrumbs for:

- Admin detail pages
- Deep configuration pages
- Multi-level resources

Do not use breadcrumbs on simple customer pages.

---

# 48. Search

Search should look like an actual utility, not a decorative input.

Recommended:

```text
[ Search applications, customers, loan IDs... ]
```

Use:

- clear placeholder
- keyboard shortcut if appropriate
- result count
- empty state
- loading state
- clear button

---

# 49. Filters

Use filter bars for data-heavy screens.

Desktop:

```text
Search
Status
Loan type
Date
[Reset]
```

Mobile:

```text
[Search]

[Filters]
```

Open filters in a drawer.

---

# 50. Financial Formatting

Always format Indian currency correctly.

Examples:

```text
₹50,000
₹1,25,000
₹12,50,000
₹1,00,00,000
```

Use consistent decimal rules.

Avoid:

```text
1250000
Rs 1250000
₹12.5L
```

unless compact notation is explicitly needed.

---

# 51. Numbers

Financial numbers should be visually stable.

Use tabular numerals where supported:

```css
.financial-number {
  font-variant-numeric: tabular-nums;
}
```

Useful for:

- EMI
- loan amount
- balances
- interest
- application IDs
- dates

---

# 52. Date & Time

Use clear Indian-friendly formats.

Example:

```text
23 Aug 2026
```

Avoid overly technical timestamps in customer UI.

Admin systems may show:

```text
23 Aug 2026, 03:15 PM
```

---

# 53. Footer

Public footer should feel like an established institution.

Structure:

```text
LoanPro

Products
Loans
Education Loans
Personal Loans
...

Resources
Calculators
FAQs
Guides
...

Company
About
Contact
Careers
...

Legal
Privacy
Terms
Security
Grievance
...

© LoanPro
```

Include trust/security/legal links.

---

# 54. Trust & Security UI

Financial services need visible trust signals.

Possible sections:

```text
Secure application
Your information is protected.

Transparent terms
No hidden surprises.

Customer support
We're here when you need us.

Responsible lending
Clear eligibility and repayment information.
```

Do not overuse security badges.

---

# 55. Security Messaging

Security messages should be plain and useful.

Good:

```text
Never share your OTP, PIN or password with anyone.
LoanPro will never ask you to share sensitive credentials.
```

Avoid:

```text
BANK-GRADE MILITARY-GRADE 256-BIT ULTRA SECURITY!!!
```

Trust comes from clarity.

---

# 56. Component Architecture

Recommended primitives:

```text
src/components/ui/
├── Button
├── Input
├── Select
├── Checkbox
├── RadioGroup
├── Textarea
├── Badge
├── StatusBadge
├── Alert
├── Card
├── Table
├── Dialog
├── Drawer
├── Tabs
├── Accordion
├── Tooltip
├── Skeleton
├── EmptyState
├── ErrorState
├── Spinner
├── Progress
└── Separator
```

Layout primitives:

```text
src/components/layout/
├── Navbar
├── Footer
├── Sidebar
├── MobileSidebar
├── BottomNav
├── PageContainer
├── PageHeader
└── Section
```

---

# 57. Component Rules

Every reusable component should have:

1. predictable spacing
2. semantic variants
3. disabled state
4. loading state where relevant
5. focus state
6. error state where relevant
7. responsive behavior
8. accessible semantics

Avoid one-off styling when a reusable primitive already exists.

---

# 58. CSS Utility Classes

Create a small number of semantic utilities.

```css
.lp-container {}

.lp-section {}

.lp-section-muted {}

.lp-section-blue {}

.lp-page {}

.lp-page-header {}

.lp-content {}

.lp-eyebrow {}

.lp-financial-number {}

.lp-muted {}

.lp-divider {}
```

Do not create hundreds of custom utility classes.

Tailwind should remain the primary layout tool.

---

# 59. Suggested Global CSS

```css
html {
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  margin: 0;
  background: var(--lp-page);
  color: var(--lp-text);
  font-family:
    "Inter Variable",
    "Inter",
    ui-sans-serif,
    system-ui,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
}

img,
svg {
  display: block;
}

img {
  max-width: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}
```

---

# 60. Scrollbars

Do not create highly customized branded scrollbars unless required.

The browser scrollbar should remain familiar.

For horizontal chips/tabs:

```css
.scrollbar-none {
  scrollbar-width: none;
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}
```

---

# 61. Dark Mode

Dark mode is optional.

If implemented, it must be treated as a complete theme rather than simply inverting colors.

For a financial customer portal, **light mode should remain the primary experience** unless product requirements explicitly demand dark mode.

Public marketing pages should generally remain light.

---

# 62. Page Background Rules

Use:

```text
Public:
white / very light gray

Customer:
very light neutral gray

Admin:
very light neutral gray
```

Avoid dark dashboards unless there is a strong operational reason.

---

# 63. Visual Density

### Public

Low-to-medium density.

### Customer

Medium density.

### Admin

Medium-to-high density.

The design system should allow density to increase by product area without changing the brand.

---

# 64. Information Hierarchy

Every screen should answer:

```text
What is this?
What matters?
What can I do?
What happens next?
```

Example:

```text
Education Loan Application

Under Review

Your application is currently being reviewed.

Next expected step
We'll contact you if additional documents are required.

[View Application]
```

---

# 65. Anti-Pattern Rules

Never automatically turn data into cards.

Never add animation just because a library supports it.

Never use gradients to solve hierarchy.

Never make every button blue.

Never use icons as decoration everywhere.

Never use huge border radius.

Never use shadows to separate every element.

Never hide financial terms.

Never make important actions visually ambiguous.

Never rely on color alone for status.

Never create a new visual style for a single page.

---

# 66. Public vs Customer vs Admin

## Public

```text
Marketing-led
Editorial sections
Large content
Strong CTAs
Trust information
Product discovery
```

## Customer

```text
Task-led
Calm
Clear status
Applications
Documents
Financial information
Support
```

## Admin

```text
Operational
Dense
Tables
Filters
Queues
Statuses
Actions
```

All three should clearly belong to the same product.

---

# 67. Design Tokens: Single Source of Truth

Do not scatter design values throughout components.

Bad:

```jsx
className="bg-[#12304A] rounded-[13px] shadow-[...]"
```

Good:

```jsx
className="bg-primary rounded-lg shadow-sm"
```

Keep brand values in the global token layer.

---

# 68. Recommended `index.css` Organization

Use this order:

```text
1. Tailwind import
2. Theme tokens
3. Root design tokens
4. Dark theme (if supported)
5. Global reset
6. Typography
7. Accessibility
8. Layout utilities
9. Surface utilities
10. Motion
11. Responsive helpers
```

Do not mix page-specific component CSS into the global token section.

---

# 69. Component Styling Strategy

Prefer:

```jsx
<Button variant="primary" size="default">
  Apply Now
</Button>
```

instead of:

```jsx
<button className="bg-blue-600 px-6 py-3 rounded-xl shadow-lg ...">
```

The component should own its visual rules.

---

# 70. Data-First UI Decisions

Before creating a component, ask:

### Is this information?

Use:

```text
text / table / list
```

### Is this an action?

Use:

```text
button / link
```

### Is this a decision?

Use:

```text
radio / select / segmented control
```

### Is this a state?

Use:

```text
badge / status / alert
```

### Is this a collection?

Use:

```text
table / list / structured section
```

### Is this a high-priority summary?

Use:

```text
card / highlighted panel
```

This prevents unnecessary card-based design.

---

# 71. Responsive Card-to-Table Rule

If desktop displays:

```text
Application | Amount | Status | Date | Action
```

Mobile can become:

```text
Education Loan
₹8,50,000
Under Review

22 Aug 2026

[View]
```

Do not force a tiny desktop table into a narrow mobile screen.

---

# 72. Forms on Mobile

On mobile:

- one field per row
- full-width inputs
- sticky bottom action only when useful
- preserve context
- avoid side-by-side fields unless both are short

Example:

```text
Loan amount
[ ₹8,50,000 ]

Tenure
[ 60 months ]

Interest rate
[ 9.5% ]

[ Continue ]
```

---

# 73. Sticky Actions

For long financial forms, a sticky action bar can be used:

```text
────────────────────────────────────
Back                         Continue
────────────────────────────────────
```

Keep it subtle.

Do not cover form content.

---

# 74. Breadcrumb / Back Navigation

Customer mobile should prefer:

```text
← Back
```

Admin desktop can use:

```text
Applications / Education Loan / LP-1024
```

---

# 75. Modal Confirmation Copy

Good:

```text
Submit application?

Once submitted, you may not be able to edit certain details.

[Cancel] [Submit Application]
```

Avoid:

```text
Are you ABSOLUTELY SURE???
```

Financial products require calm language.

---

# 76. Content Width

Long-form content should not span the entire screen.

Recommended:

```css
.lp-prose {
  max-width: 720px;
}
```

Legal/help content can use:

```text
680–820px
```

---

# 77. Marketing Grid

Use grids to organize content, not to create a wall of cards.

Preferred:

```text
Feature
────────────────────────────
Icon + title
Description

Feature
────────────────────────────
Icon + title
Description
```

Three or four columns maximum on desktop.

---

# 78. Promotional Surfaces

Promotional areas can be visually stronger.

Use:

- blue/navy background
- controlled imagery
- one CTA
- clear financial proposition

Example:

```text
Need help funding your education?

Explore an education loan designed around your goals.

[Check Eligibility]
```

Keep promotional surfaces separate from normal application UI.

---

# 79. CTA Hierarchy

Priority:

```text
Primary
Apply Now / Continue / Submit

Secondary
Check Eligibility / View Details

Tertiary
Learn More / View All

Destructive
Delete / Reject / Cancel Application
```

Never make all actions equally strong.

---

# 80. Hover Behavior

Links:

```text
color transition
```

Buttons:

```text
background darkens slightly
```

Cards:

```text
border/shadow changes only if clickable
```

Clickable cards should have a clear affordance.

Static cards should not look clickable.

---

# 81. Focus / Active / Disabled

Every interactive component should define:

```text
default
hover
focus-visible
active
disabled
loading
```

Do not allow components to rely on browser defaults for important product interactions.

---

# 82. Skeleton System

Skeletons should match final layout.

Bad:

```text
one giant spinner
```

Good:

```text
Page heading skeleton
Summary skeleton
Table row skeleton
```

This reduces perceived waiting.

---

# 83. Performance Rules

Visual design must not create unnecessary performance cost.

Avoid:

- huge background images
- continuous animations
- dozens of animated elements
- unnecessary SVG filters
- blur-heavy effects
- excessive box shadows

Prefer:

- CSS
- optimized images
- SVG icons
- native transitions

---

# 84. Image Rules

Marketing imagery:

```text
aspect ratio controlled
lazy-loaded below the fold
compressed
responsive
```

Do not use massive images as CSS backgrounds when an optimized `<img>` is more appropriate.

---

# 85. Z-Index Scale

Use a predictable scale.

```css
:root {
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-toast: 500;
  --z-tooltip: 600;
}
```

Avoid arbitrary:

```text
z-[99999]
```

---

# 86. Notification / Toast Position

Desktop:

```text
top-right
```

Mobile:

```text
top center
```

Do not hide toasts behind navigation.

---

# 87. Security / Compliance Visual Tone

Financial compliance content should be:

- readable
- structured
- calm
- explicit
- easy to locate

Do not hide important terms inside tiny gray text.

Legal disclaimers can be visually secondary but still readable.

---

# 88. Copywriting Rules

Use:

```text
Apply for an Education Loan
```

instead of:

```text
Get Started Now!!!

Use:

```text
Your application is under review.
```

instead of:

```text
Awesome! You're almost there 🚀
```

The product should feel confident, not childish.

---

# 89. Microcopy

Prefer:

```text
Continue
Save and continue
Review application
Submit application
View details
Upload document
Try again
Contact support
```

Avoid:

```text
Let's go!
Yay!
Boom!
Unlock magic!
```

---

# 90. Design Review Checklist

Before approving any screen:

- [ ] Does it look like a financial institution?
- [ ] Is the primary action obvious?
- [ ] Is the page too card-heavy?
- [ ] Is there unnecessary decoration?
- [ ] Are financial values easy to scan?
- [ ] Is the typography readable?
- [ ] Are spacing and alignment consistent?
- [ ] Does mobile work naturally?
- [ ] Are loading/error/empty states handled?
- [ ] Are focus states visible?
- [ ] Is status communicated without color alone?
- [ ] Is animation subtle?
- [ ] Does the component use existing design tokens?
- [ ] Does the screen feel related to the rest of LoanPro?

---

# 91. Definition of Production Quality

A page is not production-ready merely because it looks attractive.

It must have:

```text
Visual consistency
+
Responsive behavior
+
Accessibility
+
Loading states
+
Error states
+
Empty states
+
Form validation
+
Clear hierarchy
+
Predictable interaction
+
Performance
+
Financial clarity
```

---

# 92. Implementation Priority for the Existing LoanPro Frontend

When applying this system to the current frontend, work in this order:

## Phase 1 — Foundation

- Replace/normalize global CSS tokens
- Establish typography
- Establish spacing
- Establish containers
- Establish button/input/status primitives
- Normalize radius and shadows
- Add focus and reduced-motion rules

## Phase 2 — Layout

- Public navbar
- Customer shell
- Admin shell
- Mobile navigation
- Page header
- Section primitives
- Footer

## Phase 3 — Public website

- Hero
- Product navigation
- Loan sections
- Calculator
- How it works
- Eligibility
- FAQ
- Trust/security
- Footer

## Phase 4 — Customer portal

- Dashboard
- Applications
- Application details
- Loan details
- Documents
- Profile
- Support

## Phase 5 — Loan application flow

- Stepper
- Form sections
- Validation
- Review
- Submit
- Success state

## Phase 6 — Admin

- Dashboard
- Application table
- Filters
- Detail page
- Status workflow
- Documents
- Configuration pages

---

# 93. Important Existing Frontend Direction

The current project already has a relatively mature token layer in `src/index.css`.

Do not throw away useful semantic variables blindly.

Instead:

1. Consolidate duplicate tokens.
2. Reduce unnecessary accent colors.
3. Remove excessive SaaS-style visual options.
4. Normalize radius.
5. Normalize shadows.
6. Keep semantic states.
7. Move toward navy + blue + neutral.
8. Keep the light financial-services experience as the default.
9. Make cards selective.
10. Make sections and structured data the primary layout primitives.

---

# 94. Recommended Final Token Snapshot

This is the target visual foundation:

```css
:root {
  --lp-navy: #12304A;
  --lp-navy-strong: #0B2438;

  --lp-blue: #1769AA;
  --lp-blue-hover: #12598F;
  --lp-blue-soft: #EEF6FC;

  --lp-page: #F7F9FB;
  --lp-surface: #FFFFFF;
  --lp-surface-subtle: #F3F6F8;

  --lp-text: #172B3A;
  --lp-text-secondary: #405463;
  --lp-text-muted: #667783;
  --lp-text-subtle: #82919B;

  --lp-border: #D9E1E6;
  --lp-border-light: #E8EDF0;

  --lp-success: #16834B;
  --lp-warning: #B86A00;
  --lp-danger: #C43D3D;
  --lp-info: #1769AA;

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  --shadow-xs: 0 1px 2px rgb(18 48 74 / 0.04);
  --shadow-sm:
    0 1px 3px rgb(18 48 74 / 0.06),
    0 2px 6px rgb(18 48 74 / 0.04);
  --shadow-md:
    0 6px 18px rgb(18 48 74 / 0.08);
  --shadow-lg:
    0 12px 32px rgb(18 48 74 / 0.12);

  --duration-fast: 120ms;
  --duration-normal: 180ms;
  --duration-slow: 260ms;
}
```

---

# 95. Final Design Principle

LoanPro should never look like:

> "A developer built a dashboard using Tailwind cards."

It should look like:

> **"A serious Indian financial-services company built a modern digital platform."**

The visual language should be:

**Navy + blue + white + neutral surfaces  
Structured sections + useful data  
Selective cards + strong tables  
Clear typography + restrained radius  
Minimal animation + strong accessibility  
Trust + clarity + confidence**

That is the permanent design direction for the frontend.
