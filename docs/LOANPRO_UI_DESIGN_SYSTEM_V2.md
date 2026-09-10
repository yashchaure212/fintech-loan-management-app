# LoanPro UI Design System V2

## Master UI/UX Design & Implementation Handoff for Claude Code

---

# 0. PURPOSE

LoanPro is an existing production-oriented fintech lending application.

The application already has working:

* React frontend
* React Router
* Redux Toolkit
* RTK Query
* React Hook Form
* Zod
* shadcn/ui
* Radix UI
* Tailwind CSS
* Lucide React

The objective is to **redesign and modernize the entire frontend UI while preserving existing functionality**.

The target is:

> A mature, production-grade lending platform with the visual quality, clarity, trust and self-service maturity associated with a major financial institution such as Bajaj Finserv, while remaining an original LoanPro product.

This is a **UI/UX modernization**, not a rewrite of business logic.

---

# 1. NON-NEGOTIABLE IMPLEMENTATION RULES

Before making changes:

1. Inspect the existing codebase.
2. Understand current routes, components, state, API usage and business logic.
3. Preserve working functionality.
4. Continue using the existing React/shadcn/Radix architecture wherever practical.
5. Do not replace the frontend architecture merely for visual redesign.
6. Do not introduce TypeScript.
7. Do not introduce Axios.
8. Keep RTK Query for API interaction.
9. Do not modify API contracts unless explicitly required.
10. Do not change financial/business calculations merely as part of UI redesign.
11. Do not remove working functionality because a UI element is being redesigned.
12. Avoid large simultaneous rewrites of high-risk files.
13. Prefer shared components and tokens over page-specific styling.
14. Do not invent new visual patterns when an existing canonical pattern can be reused.
15. Every implementation should be testable after the change.

The redesign should primarily change:

* visual hierarchy
* layout
* styling
* component composition
* spacing
* typography
* responsive behavior
* interaction presentation

It should not casually change:

* backend behavior
* API contracts
* financial calculations
* authentication behavior
* loan workflow state machines
* Redux architecture
* RTK Query endpoints
* payment integration

---

# 2. EXISTING FRONTEND AUDIT SUMMARY

The current frontend has a solid foundation:

* React Router nested layouts
* Redux Toolkit + RTK Query
* react-hook-form + Zod
* shadcn/Radix component layer
* centralized HSL CSS variables
* working dark mode
* generally good responsive implementation
* strong loading/empty patterns on several important pages

Important known issues:

* `Navbar.jsx` is approximately 1700 lines and is a monolith.
* `LoanDetails.jsx` is approximately 1000 lines.
* `AdminLoanDetails.jsx` is also large and duplicates several patterns.
* Two toast libraries exist.
* Two full-page loading components exist.
* Formatting helpers are duplicated.
* Customer and admin detail components duplicate patterns.
* Auth-page chrome is duplicated.
* Two parallel card systems exist.
* Some UI primitives appear unused.
* Some mobile admin navigation components are currently dead/unwired.
* There is a production JSX `console.log` in `AdminLoanDetails.jsx`.
* There is a stray `text-red-800` class.
* `AdminLoans` has a non-functional Filters button.
* Search is limited to the currently loaded page.
* Some multi-loan-type scaffolding remains despite the current single-product architecture.
* Hardcoded colors still exist in places such as `Landing.jsx`.
* Notifications, settings and help/support are missing.
* Admin customer management, reports and audit-log surfaces are missing.

These findings should inform implementation but should not cause unrelated rewrites.

---

# 3. PRODUCT UI IDENTITY

LoanPro should feel like:

> Established financial institution + modern digital fintech + focused lending experience.

The product should communicate:

* trust
* stability
* clarity
* financial precision
* professionalism
* modern digital experience
* easy navigation
* confidence around financial decisions

The visual tone should be closer to a serious lending institution than a startup SaaS dashboard.

---

# 4. BAJAJ FINANCE / BAJAJ FINSERV REFERENCE

Use major Indian lending/financial platforms such as Bajaj Finserv as a **reference for product maturity, information hierarchy and financial UX**.

Do NOT:

* copy branding
* copy logos
* copy proprietary graphics
* copy exact text
* copy exact layouts pixel-for-pixel
* reproduce proprietary visual assets

Instead extract and adapt principles such as:

* strong financial hierarchy
* structured product/service navigation
* clear CTAs
* self-service customer experience
* strong financial information presentation
* accessible service/help flows
* clear application journeys
* professional institutional styling
* disciplined use of color
* mature responsive behavior

LoanPro must remain an original product.

---

# 5. PRODUCT UI PRINCIPLES

## 5.1 Institutional, not startup

LoanPro should look like a financial institution's digital system, not a generic consumer SaaS product.

## 5.2 Numbers are the interface

Loan amounts, EMI values, rates, dates and repayment values receive strong typographic hierarchy.

## 5.3 Low-radius, low-shadow surfaces

Prefer:

* border
* surface
* typography

over:

* heavy shadow
* excessive rounding
* decorative effects

## 5.4 One primary visual accent

Deep navy is the main brand/action color.

Semantic colors should primarily indicate states.

## 5.5 Status consistency

The same status must use the same:

* label
* icon
* token
* color treatment

throughout the product.

## 5.6 Information density with hierarchy

Do not make screens spacious by removing useful information.

Use:

* grouping
* alignment
* typography
* whitespace between logical sections

to make dense information understandable.

## 5.7 No decorative motion

Motion is functional only:

* loading
* transitions
* dialog opening
* wizard progress
* state changes

Avoid:

* bounce
* excessive spring motion
* hover-lift cards
* decorative animation

## 5.8 Irreversible actions require confirmation

Examples:

* approve loan
* reject loan
* submit application
* payment
* destructive account changes

## 5.9 Consistency over cleverness

Prefer one:

* table pattern
* form pattern
* empty state
* error state
* button system
* status system

unless a strong product reason requires another pattern.

## 5.10 Progressive disclosure

Complex experiences such as the loan wizard and admin review should manage complexity with:

* steps
* collapsible sections
* summary panels
* sticky context
* structured sections

## 5.11 Accessibility by default

Status cannot depend on color alone.

Use:

> icon + label + semantic color

Also maintain:

* contrast
* focus states
* keyboard access
* readable sizing
* meaningful labels

---

# 6. COLOR SYSTEM V1

The existing CSS-variable/HSL architecture should remain the implementation foundation.

Do not blindly replace it with hardcoded hex values.

Map the design system into semantic variables.

## Brand colors

Target visual values:

* Primary Navy: `#12304A`
* Deep Navy: `#0B2235`
* Brand Soft: `#E8EEF2`
* Brand Muted: `#D4E0E7`

## Application surfaces

Target direction:

* page background: approximately `#F7F8FA`
* primary surface: `#FFFFFF`
* secondary surface: approximately `#F1F3F5`
* overlay surface: `#FFFFFF`

## Text / neutral ink scale

Use a semantic neutral-ink scale rather than arbitrary Tailwind gray classes:

* near-black: approximately `#111827`
* primary ink: approximately `#1F2937`
* secondary ink: approximately `#374151`
* muted text: approximately `#4B5563` / `#6B7280`
* disabled: approximately `#9CA3AF`

The exact values may be mapped into the current HSL variable architecture.

## Borders

Three levels:

* default: approximately `#E5E7EB`
* subtle: approximately `#EEF0F2`
* strong: approximately `#D1D5DB`

## Semantic colors

Success:

* foreground approximately `#15803D`
* soft approximately `#F0FDF4`
* border approximately `#BBF7D0`

Warning:

* foreground approximately `#B45309`
* soft approximately `#FFFBEB`
* border approximately `#FDE68A`

Danger:

* foreground approximately `#B91C1C`
* soft approximately `#FEF2F2`
* border approximately `#FECACA`

Info:

* foreground approximately `#1D4ED8`
* soft approximately `#EFF6FF`
* border approximately `#BFDBFE`

## Hard rule

Application code should not introduce:

* raw hex colors
* raw Tailwind palette classes
* arbitrary one-off colors

Marketing imagery may have limited documented exceptions.

---

# 7. TYPOGRAPHY SYSTEM V1

Use one primary UI font family.

Recommended:

> Inter

Do not use unrelated font families across features.

## Type scale

Use a controlled scale:

* Display: 40px / 700 / ~1.1
* Page title: 30px / 700 / ~1.2
* Section title: 20px / 600 / ~1.3
* Subsection title: 16px / 600 / ~1.4
* Body: 14px / 400 / ~1.5
* Body medium: 14px / 500 / ~1.5
* Label: 12px / 500 / ~1.4
* Caption: 12px / 400 / ~1.4
* Helper: 13px / 400 / ~1.45

Do not create arbitrary values such as:

* `text-[11px]`
* random 17px
* random 19px
* random 23px

unless there is a documented design-system reason.

## Financial typography

Financial values should use:

`font-variant-numeric: tabular-nums`

Apply to:

* loan amounts
* EMI
* rates
* dates
* IDs
* transaction values
* other aligned numeric displays

Primary financial values should use typography as the main emphasis.

Example:

```text
Outstanding balance

₹1,82,450

of ₹2,50,000
```

Do not rely on bright colors to make financial numbers important.

---

# 8. SPACING + LAYOUT SYSTEM

Keep Tailwind's existing spacing scale.

Standard conventions:

* 4–8px: micro relationships
* 12–16px: component relationships
* 20–24px: internal section spacing
* 32–40px: section separation
* 48–64px: major structural separation

## Page gutters

Desktop:

approximately 32px

Tablet:

approximately 24px

Mobile:

approximately 16px

## Content width

Use a consistent application max-width around 1440px where appropriate.

Center the application content.

Specific pages may use a narrower inner width when readability requires it.

## Standard page structure

```text
Page Header
    ↓
Primary Content
    ↓
Secondary Section
    ↓
Activity / History
```

Do not create arbitrary spacing on individual pages.

## Grid

Desktop:

conceptually 12-column

Tablet:

conceptually 6-column

Mobile:

1-column

Use responsive layout based on content needs rather than forcing a grid everywhere.

## Two-column layouts

Use primarily on large desktop screens.

Examples:

Loan application:

```text
Form + Context
```

Admin review:

```text
Main content + Summary
```

Tablet should usually collapse or simplify.

Mobile should become one column.

---

# 9. RADIUS SYSTEM

Keep low-radius financial-product styling.

Recommended hierarchy:

* small badges: ~4px
* buttons: ~6px
* inputs: ~6px
* cards/panels: ~8px
* larger containers: ~10px
* dialogs/sheets: ~10–12px

Do not introduce:

* excessive pills
* 24–32px radius everywhere
* giant rounded dashboard cards

Pill shapes should be reserved for small semantic UI where appropriate.

---

# 10. BORDER SYSTEM

Borders are the primary separation mechanism for static surfaces.

Default:

`1px solid var(--border)`

Use stronger borders only when hierarchy requires it.

Cards and sections should generally be:

> surface + border

rather than:

> surface + heavy shadow

---

# 11. SHADOW SYSTEM

Static cards:

* usually no shadow
* optional very subtle shadow only where useful

Popovers/dropdowns:

* medium shadow

Dialogs/sheets:

* stronger shadow

Shadow communicates elevation.

Do not give every dashboard card a heavy shadow.

---

# 12. BUTTON SYSTEM

Four main variants:

## Primary

For the dominant action.

Examples:

* Apply for Loan
* Continue
* Submit Application
* Pay EMI
* Approve Loan

Target:

* 40–44px desktop
* 44–48px mobile
* radius around 6px
* 14px / 600

## Secondary

Examples:

* Back
* Cancel
* View Details
* Download

Use surface/border treatment.

## Tertiary / Ghost

For low-priority actions.

## Destructive

For:

* Reject
* Delete
* Remove
* destructive cancellation

Do not invent feature-specific button styles.

Use the canonical shadcn button underneath the LoanPro styling system.

Support:

* default
* hover
* focus
* active
* disabled
* loading

Existing `loading` / `aria-busy` behavior should be preserved.

---

# 13. INPUT + FORM SYSTEM

Standard structure:

```text
Label
↓
Input
↓
Helper / Error
```

Target:

* 40–44px input height
* approximately 6px radius
* 12–14px horizontal padding
* 14px UI text

Avoid floating labels unless there is a specific usability reason.

## States

Every control should have:

* default
* hover
* focus
* disabled
* error
* optional meaningful success state

Red should indicate an actual error, not simply that a field is required.

## Errors

Errors should explain:

> what is wrong + what the user can do

Example:

```text
Annual income must be greater than ₹0.
```

## Financial inputs

Use financial formatting where appropriate.

Example:

```text
Loan Amount

₹ 2,50,000
```

Show limits and constraints when useful.

---

# 14. CARD SYSTEM

Cards organize information. They should not exist simply because the page needs visual decoration.

Canonical card characteristics:

* surface
* 1px border
* low/moderate radius
* usually no shadow
* consistent padding
* consistent header pattern

Target padding:

* desktop: 24px
* mobile: 16px
* dense operational UI: 16–20px

The application should converge toward one canonical card approach rather than keeping two competing systems.

---

# 15. FINANCIAL COMPONENT SYSTEM

Create a dedicated financial component layer.

Recommended:

```text
components/financial/
├── AmountDisplay
├── EmiSummary
├── InterestRateBadge
├── TenureDisplay
├── DueDateIndicator
├── PaymentStatusBadge
├── ApplicationStatusBadge
├── DocumentStatusBadge
├── ApprovalStatusBadge
└── RepaymentProgressBar
```

These components should use centralized formatters.

No page should independently recreate:

* currency formatting
* date formatting
* status-color mapping
* repayment progress logic for display
* financial number presentation

---

# 16. LOAN CARD

A canonical LoanCard should communicate:

1. loan identity
2. status
3. primary amount
4. EMI
5. repayment information
6. important dates
7. action

Example structure:

```text
Education Loan                         [✓ Approved]

₹2,50,000
Approved amount

EMI                 Interest          Tenure
₹8,420/month        8.5%             36 months

███████████████████░░ 73% repaid

Next EMI: ₹8,420 · 12 Sep 2026

[View Loan]
```

Do not make each element a separate decorative card.

---

# 17. FINANCIAL DATA DISPLAY RULES

## Loan amount

Always clearly formatted.

## EMI

Always provide frequency where appropriate:

`₹8,420 / month`

## Interest rate

Example:

`8.5%`

with type if meaningful.

## Tenure

Prefer:

`36 months (3 years)`

where useful.

## Outstanding amount

Show relative context:

`₹1,82,450 of ₹2,50,000`

not only the outstanding value.

## Due date

Use semantic proximity:

* normal future
* due soon
* overdue

## Progress

Use one canonical `RepaymentProgressBar`.

---

# 18. STATUS SYSTEM

Canonical application statuses:

```text
Draft
Submitted
Under Review
Approved
Rejected
Disbursed
Closed
```

Payment statuses:

```text
Paid
Due
Overdue
Processing
Failed
```

Document statuses:

```text
Pending
Uploaded
Under Review
Verified
Rejected
```

Each status must have:

* consistent text
* consistent icon
* consistent semantic token
* consistent treatment

Never communicate status through color alone.

Examples:

```text
✓ Approved
↻ Processing
⚠ Due Soon
! Overdue
```

---

# 19. TABLE SYSTEM

Use the shared shadcn table primitives as the canonical desktop table.

Tables are for:

> comparison and scanning

Cards are for:

> grouped information

Do not convert all datasets into cards.

Desktop/tablet:

* full columns
* clear alignment
* moderate row height
* tabular numeric values

Mobile:

* transform to compact information cards
* preserve only primary fields
* provide clear detail action

For dense financial rows, approximately 48–56px row height is a useful target.

---

# 20. TIMELINE SYSTEM

Use one canonical vertical timeline for:

* application history
* verification
* loan workflow
* activity

Structure:

```text
● Date
  Event
  Description
│
● Date
  Event
  Description
```

Use:

* semantic icons
* date
* title
* optional supporting description
* connector line

Do not turn every timeline event into a separate floating card.

---

# 21. EMPTY / LOADING / ERROR SYSTEM

Create canonical Tier 2 components:

```text
EmptyState
ErrorState
PageLoader
```

## Loading

Use layout-preserving skeletons.

Avoid generic full-page spinners when actual content structure is known.

Create reusable templates:

* DashboardSkeleton
* DetailPageSkeleton
* TableSkeleton

## Empty

Structure:

```text
icon
headline
description
primary CTA
```

## Error

Structure:

```text
semantic icon/tone
headline
description
retry action
```

## Disabled

Disabled controls should explain why when the reason is not obvious.

## Processing

Use status + inline button spinner.

Avoid unnecessary full-page blocking.

## Failed

Always explain the next step where possible.

Example:

```text
Payment failed

Try the payment again.
```

## Offline

Define a future shared global network-status banner.

---

# 22. PAGE TEMPLATES

## Public

Marketing page:

```text
Header
Hero
Contained content sections
Footer
```

Marketing can have somewhat more visual expression than the logged-in application.

## Authentication

Create one shared `AuthLayout`.

Used by:

* Login
* Register
* Forgot Password
* Reset Password

The individual pages should become thin content-focused files.

## Customer dashboard

```text
Page header/context
Primary loan summary
Secondary financial metrics
Quick actions
Recent activity
Upcoming payments/documents
```

## Customer detail page

```text
Header + back navigation
Status
Summary
Detail sections
Optional sticky summary
Timeline/history
```

## Customer forms

```text
Step header
Progress
Form content
Context/help panel
Navigation
```

## Admin dashboard

```text
Header
Aggregate metrics
Pipeline/status distribution
Operational actions
Recent activity
```

## Admin data table

```text
Page header
Search
Filters
Table
Pagination
Mobile cards
```

## Admin review workspace

```text
Header
Main review content
Sectioned details
Sticky summary sidebar
Decision bar
Confirmation dialogs
```

## Settings

```text
Desktop:
section navigation + form

Mobile:
accordion sections
```

## Help/support

```text
Search
FAQ
Popular topics
Contact/support
```

---

# 23. CUSTOMER NAVIGATION

Customer navigation should remain simpler than admin navigation.

Recommended conceptual structure:

```text
LoanPro

Dashboard
My Loans
Payments
Documents
Help

                    Notifications
                    Profile
```

Secondary account options:

```text
Profile
Settings
Security
Logout
```

Do not expose every possible route in the primary navigation.

---

# 24. ADMIN NAVIGATION

Admin should move toward a real left sidebar as the admin product expands.

Recommended:

```text
Dashboard
Applications
Customers
Documents
Payments
Reports
Audit Log
Settings
```

Desktop:

persistent sidebar

Mobile:

drawer or bottom navigation based on the final admin navigation design

The existing dead admin mobile components may be reused if their architecture fits.

---

# 25. NAVBAR REFACTOR

`Navbar.jsx` is currently approximately 1700 lines.

Refactor responsibilities.

Possible structure:

```text
components/layout/
├── PublicNav
├── CustomerNav
├── AdminNav
├── AdminSidebar
├── MobileNavigation
├── GlobalSearch
├── NotificationsMenu
├── AccountMenu
└── ThemeToggle
```

Preserve all existing functionality.

Do not accidentally change route behavior during the extraction.

---

# 26. RESPONSIVE SYSTEM

Functional tiers:

## Mobile

`<768`

## Tablet

`768–1023`

## Desktop

`>=1024`

Use `xl` primarily for:

* persistent sidebars
* large summary panels
* large two-column layouts

## Navigation

Public/customer:

* desktop navigation
* condensed tablet navigation
* mobile Sheet/drawer

Admin:

* desktop sidebar
* mobile drawer/bottom navigation

## Forms

Desktop:

* multi-column where logically appropriate

Tablet:

* simplified layout

Mobile:

* one column

## Primary actions

For long mobile workflows:

* sticky bottom CTA where useful

Examples:

* wizard Next
* Pay Now
* critical decision action

---

# 27. MISSING PRODUCT SCREENS

Customer UI surfaces to design:

```text
/customer/notifications
/customer/settings
/customer/help
```

These may initially be UI-only if backend support is not yet present.

Admin architecture should eventually accommodate:

```text
/admin/customers
/admin/customers/:id
/admin/reports
/admin/audit-log
/admin/settings
```

Do not invent backend contracts merely to make the UI functional.

Clearly separate:

* existing functional UI
* UI-only placeholder functionality
* future backend-dependent features

---

# 28. EXISTING CODE CLEANUP

Eventually consolidate:

### Navbar

Split monolith.

### Loading

Merge:

* `FullPageLoader`
* `FullPageSpinner`

into one canonical page loader.

### Formatting

Remove local duplicates from dashboard/MyLoans.

Use the existing centralized formatter utilities.

### Detail fields

Merge customer/admin duplicate patterns into shared components such as:

* `DetailField`
* `SectionHeader`

### Auth shell

Create `AuthLayout`.

### Card system

Choose one canonical approach.

### Toasts

Use one toast library throughout.

### Admin mobile components

Reuse only if they become part of the actual admin navigation architecture.

Otherwise remove.

### UI primitives

Keep and activate useful primitives when templates require them.

Remove unused primitives only after the redesigned pages are finalized.

### Cross-feature styling constant

Move shared style constants into an appropriate shared location.

### Dead debug code

Remove production `console.log`.

### Stray class

Remove accidental `text-red-800`.

### Multi-loan scaffolding

Simplify obsolete single-product UI branches unless near-term multi-product support genuinely exists.

---

# 29. IMPLEMENTATION ORDER

Do not redesign everything in one giant commit.

Recommended sequence:

## Phase A: Safe cleanup

1. Remove debug output.
2. Resolve obvious UI bugs.
3. Consolidate formatters.
4. Consolidate toast library.
5. Merge page loaders.

## Phase B: Navigation architecture

6. Split the Navbar monolith.
7. Establish customer navigation.
8. Establish admin navigation architecture.
9. Preserve route behavior.

## Phase C: Design foundation

10. Formalize color tokens.
11. Formalize typography.
12. Formalize spacing.
13. Formalize radius.
14. Formalize borders.
15. Formalize shadows.
16. Formalize focus states.

## Phase D: Shared components

17. EmptyState.
18. ErrorState.
19. PageLoader.
20. AuthLayout.
21. SectionHeader.
22. DetailField.
23. Financial components.
24. Status components.
25. LoanCard.
26. RepaymentProgressBar.
27. DueDateIndicator.

## Phase E: Low-risk pages

28. NotFound.
29. EMI Calculator.
30. Authentication pages.

## Phase F: Customer

31. Profile.
32. My Loans.
33. Loan Details.
34. Payments.
35. Application wizard last.

## Phase G: Admin

36. Admin Dashboard.
37. Admin Loan Configuration.
38. Admin Loans.
39. Admin Loan Details last.

## Phase H: New product surfaces

40. Notifications.
41. Settings.
42. Help/support.

Later, as backend capability exists:

43. Customers.
44. Reports.
45. Audit Log.
46. Admin settings.

---

# 30. CRITICAL PAGE-SPECIFIC RULES

## Dashboard

Use as the reference customer template.

Preserve the strong skeleton/error/empty architecture.

Reduce duplicated formatting logic.

## My Loans

Upgrade loading fidelity.

Reuse the canonical `LoanCard`.

## Loan Details

Break the large file into composable sections.

Replace raw EMI HTML table with the shared table system.

Reuse shared `DetailField`.

## Apply Loan

Preserve:

* seven-step wizard
* draft resume
* auto-save
* navigation guards

Remove obsolete multi-product UI branching.

Surface save failures to the user instead of only logging them.

## EMI Payments

Preserve Razorpay and sequential EMI behavior.

Replace raw form controls with shared primitives.

Use the canonical toast library.

## Admin Loans

Make filtering real or remove the misleading control.

Use proper server-side search when appropriate.

## Admin Loan Details

Remove the JSX `console.log`.

Remove the stray red class.

Extract workflow decision logic where appropriate.

Reuse shared detail components.

Preserve confirmation before irreversible actions.

---

# 31. DO / DON'T

## DO

* use semantic design tokens
* use shared components
* prioritize financial information
* use borders as primary separation
* use subtle shadows
* maintain low-radius surfaces
* create excellent empty/loading/error states
* make mobile behavior intentional
* preserve current business functionality
* make status systems consistent
* make admin operational UI denser than customer UI
* reuse shadcn/Radix primitives

## DON'T

* don't create generic SaaS dashboards
* don't make everything a card
* don't use gradients throughout the application
* don't use glassmorphism
* don't heavily round everything
* don't use random Tailwind colors
* don't create new one-off spacing systems
* don't create separate status systems
* don't copy Bajaj branding/assets/layouts
* don't rewrite backend logic during UI redesign
* don't rebuild the application from scratch
* don't create page-specific component styling when a shared component should exist

---

# 32. VISUAL QUALITY STANDARD

Every redesigned page should answer:

### Hierarchy

Can a user immediately understand:

* where they are
* what matters
* what action to take

### Financial clarity

Can the user quickly identify:

* amount
* EMI
* status
* due date
* outstanding amount
* progress

### Consistency

Do the same components look the same across all pages?

### Restraint

Is anything on the page decorative without serving a purpose?

### Responsive quality

Does the page intentionally adapt rather than merely shrink?

### Accessibility

Are:

* contrast
* focus
* labels
* keyboard navigation
* non-color status cues

handled?

### Production maturity

Does the screen look like a serious financial product rather than an AI-generated dashboard?

---

# 33. IMPORTANT WORKING METHOD FOR CLAUDE CODE

Do not jump directly into a full redesign.

For each implementation phase:

1. Inspect affected files.
2. Identify shared dependencies.
3. Explain intended changes internally through the implementation plan.
4. Make the smallest coherent change.
5. Run the appropriate build/lint/tests.
6. Verify relevant routes.
7. Check responsive behavior.
8. Check that APIs and state behavior remain intact.
9. Continue to the next phase.

For high-risk files such as:

* `ApplyLoan.jsx`
* `LoanDetails.jsx`
* `AdminLoanDetails.jsx`
* navigation architecture

make incremental commits/changes instead of one huge rewrite.

---

# 34. FIRST IMPLEMENTATION TASK

Do not redesign all pages yet.

Begin by:

1. Inspect the current codebase again against this design specification.
2. Identify conflicts between the specification and current implementation.
3. Produce an implementation roadmap grouped into:

   * foundation
   * navigation
   * shared components
   * customer pages
   * admin pages
   * missing pages
4. Identify potential regression risks.
5. Identify the exact files that will change in each phase.
6. Do not modify files during this planning pass.

Return:

```text
LOANPRO UI V2 IMPLEMENTATION PLAN

1. Foundation
2. Navigation
3. Shared components
4. Customer
5. Admin
6. New screens
7. Cleanup
8. Testing
9. Regression risks
10. Suggested commit sequence
```

Only after this plan is reviewed should implementation begin.
