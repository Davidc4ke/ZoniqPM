# UX Design Audit: Home Page Mockup

**Date:** 2026-02-27  
**Auditor:** Claude Code  
**File:** `design-home-page.html`  
**Reference:** `ux-design-specification.md`

---

## Anti-Patterns Verdict

### PASS ✓

The mockup **does NOT look AI-generated**. It avoids the major AI slop tells:

- ❌ No AI color palette (cyan-on-dark, purple-blue gradients)
- ❌ No gradient text on metrics/headings
- ❌ No glassmorphism overuse
- ❌ No generic card grids with identical icon+heading+text templates
- ❌ No hero metric layout template (big number, small label, supporting stats, gradient accent)
- ❌ No bounce/elastic easing
- ❌ No sparklines as decoration
- ❌ No rounded rectangles with generic drop shadows

**Minor AI Tells Detected:**
- ⚠️ Emoji usage in section headers (📋, 🔍, 📊, 👥) - somewhat generic but not a dealbreaker
- ⚠️ Card-based layout is consistent (but varied enough in content to not feel templated)

**Overall:** This feels intentionally designed with a clear brand identity. The warm brown/orange palette is distinctive and cohesive.

---

## Executive Summary

### Issue Count by Severity

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 1 |
| Medium | 8 |
| Low | 6 |

**Total Issues:** 15

### Most Critical Issue

1. **Typography mismatch** - Mockup uses "Clash Grotesk" + "General Sans" but spec requires "Syne" + "Manrope"

### Overall Quality Score

**8.5/10** - Solid foundation with good visual direction. Requires typography correction.

### Recommended Next Steps

1. Replace fonts with Syne (headings) and Manrope (body)
2. Address medium-severity issues for full spec compliance
3. Topbar redesign planned for later session

---

## Detailed Findings by Severity

---

### Critical Issues

**None identified.** The mockup does not have blocking issues.

---

### High-Severity Issues

#### H1: Typography System Mismatch

**Location:** Lines 8, 22-23  
**Category:** Design System Compliance  
**Description:** Mockup uses "Clash Grotesk" (headings) and "General Sans" (body) but specification explicitly requires "Syne" (headings) and "Manrope" (body).

**Impact:** Breaks brand consistency. Typography is a core brand element.

**Spec Reference:**
```
| Role | Font | Weight | Use |
|------|------|--------|-----|
| H1-H4 | Syne | Bold/SemiBold | Headings |
| Body | Manrope | Regular | Descriptions, content |
```

**Recommendation:** Replace font imports and update CSS:
```css
@import url('https://api.fontshare.com/v2/css?f[]=syne@400,500,600,700&f[]=manrope@300,400,500,600,700&display=swap');

* { font-family: 'Manrope', sans-serif; }
h1, h2, h3, h4, h5, h6, .font-heading { font-family: 'Syne', sans-serif; }
```

**Suggested Command:** `/normalize`

---

#### ~~H2: Missing AI Response Area~~ → NOT AN ISSUE

**Status:** ✅ RESOLVED - Not a missing feature

**Analysis:** The specification is ambiguous about the interaction model. It shows both:
1. Dashboard view with `[AI Response Area — inline responses appear here]`
2. Chat Mode triggered "after clicking Ask"

**Clarification:** The intended interaction model is:
- **Ask button** → navigates to **Chat Mode** (full conversation view)
- **Dashboard** → remains a status overview (no inline AI responses needed)

This is a valid design choice. The mockup correctly implements the Ask → Chat flow without needing an inline response area on the Dashboard. The Dashboard is for status/at-a-glance information; Chat mode is for AI interactions.

**No action required.**

---

#### ~~H2: Missing Mode Toggle (Dashboard/Chat)~~ → DEFERRED

**Status:** ⏸️ DEFERRED - Planned for later session

**Reason:** Topbar redesign planned separately. No need to add mode toggle to current mockup.

---

### Medium-Severity Issues

#### M1: Max Content Width Exceeds Spec

**Location:** Line 28-29  
**Category:** Layout Compliance  
**Description:** Mockup uses `max-width: 1440px` but specification states "Max content width: 1280px".

**Impact:** Wider content may feel less focused; doesn't match spec.

**Recommendation:** Change to `max-width: 1280px;`

**Suggested Command:** `/normalize`

---

#### M2: Missing Breadcrumbs in Header

**Location:** Header section  
**Category:** Navigation Pattern  
**Description:** Specification shows breadcrumbs format "Projects > [Project Name] > [Story #]" but mockup doesn't include breadcrumbs.

**Impact:** Users lose context of where they are in the hierarchy.

**Note:** This may be intentional for home page (top level). Consider adding for sub-pages.

**Recommendation:** Add breadcrumbs component to header, hide on home page, show on sub-pages.

---

#### M3: Story Card Missing Status Flow Indication

**Location:** Lines 239-282 (Story items)  
**Category:** Component Design  
**Description:** Story cards show status badges but don't clearly indicate the workflow position. Spec defines: Backlog → In Progress → Review → Done.

**Impact:** Users may not understand where stories are in the workflow at a glance.

**Recommendation:** Consider adding workflow position indicator or using consistent color coding that maps to kanban columns.

**Suggested Command:** `/polish`

---

#### M4: Missing Role-Aware Dashboard Logic

**Location:** Dashboard grid section  
**Category:** UX Specification Compliance  
**Description:** Specification requires role-aware dashboard content:
- Developer (Aisha): Assigned stories first
- Senior (David): Review queue first  
- PM (Marcus): Project status first

Mockup shows static layout without role consideration.

**Impact:** Not personalized to user needs; all users see same content.

**Note:** This requires backend logic but UI should support reordering.

**Recommendation:** Implement role-based card ordering or prominence.

**Suggested Command:** Manual implementation required

---

#### M5: Placeholder Not Rotating

**Location:** Line 213  
**Category:** Interaction Pattern  
**Description:** Specification requires rotating placeholder text to teach capabilities. Mockup shows static placeholder.

**Spec Reference:**
```
- "Paste notes, or try 'What do I need to review?'"
- "Try: 'Open story 47' or 'How's Claims Portal?'"
- "Ask me anything about your projects..."
```

**Impact:** Missed opportunity to educate users about AI capabilities.

**Recommendation:** Implement placeholder rotation via JavaScript.

**Suggested Command:** `/animate`

---

#### M6: Footer Section Should Be Removed

**Location:** Lines 471-514  
**Category:** Design Quality  
**Description:** The mockup includes an explanatory footer section describing the page layout. This appears to be documentation/meta content that should not be in production.

**Impact:** Unnecessary UI clutter; looks like mockup annotation.

**Recommendation:** Remove footer section for production. Keep only as documentation reference.

**Suggested Command:** Manual removal

---

#### M7: Avatar Sizes Inconsistent with Spec

**Location:** Lines 145-155 (Avatar CSS), various locations  
**Category:** Component Design  
**Description:** Mockup uses 28px and 24px avatars. Specification mentions minimum 44px touch targets for accessibility.

**Impact:** May not meet accessibility standards for touch targets.

**Recommendation:** Increase avatar sizes to minimum 32px (clickable area can be larger).

**Suggested Command:** `/harden`

---

#### M8: Progress Bar Height Differs from Spec

**Location:** Lines 115-125  
**Category:** Component Design  
**Description:** Mockup uses 6px progress bar height. Spec doesn't explicitly define this but mentions progress indicators as part of CompletenessMeter component.

**Impact:** Minor visual inconsistency.

**Recommendation:** Document progress bar height in design tokens; consider 8px for better visibility.

---

### Low-Severity Issues

#### L1: Emoji Use in Headers

**Location:** Lines 233, 288, 354, 438  
**Category:** Visual Design  
**Description:** Section headers use emojis (📋, 🔍, 📊, 👥). While not explicitly forbidden, this can feel generic.

**Impact:** Minor - may date the design or feel less professional.

**Recommendation:** Consider replacing with subtle icons or removing entirely for cleaner look.

**Suggested Command:** `/polish`

---

#### L2: Character Count Implementation

**Location:** Line 221  
**Category:** Interaction Design  
**Description:** Shows "0 chars" but this would need JavaScript to update. Static mockup shows the intent correctly.

**Recommendation:** Ensure character count updates in real-time when implemented.

---

#### L3: Missing Focus State Styles

**Location:** Universal input and buttons  
**Category:** Accessibility  
**Description:** Specification requires "Orange ring (#FF6B35), 2px offset" for focus states. Mockup has some hover states but focus states not explicitly shown.

**Impact:** Keyboard users may not see focus indicators clearly.

**Recommendation:** Add explicit `:focus-visible` styles matching spec.

**Suggested Command:** `/harden`

---

#### L4: Sticky Header z-index

**Location:** Line 172  
**Category:** Technical Implementation  
**Description:** Header uses `z-index: 50` which is fine, but should be documented in design tokens.

**Recommendation:** Document z-index scale in design system.

---

#### L5: Button Hover States Use Different Transition

**Location:** Various buttons  
**Category:** Motion Design  
**Description:** Buttons use `transition: all 0.2s ease` but spec mentions exponential easing (ease-out-quart/quint/expo) for natural deceleration.

**Impact:** Minor - feels less polished than spec intends.

**Recommendation:** Use `transition-timing-function: cubic-bezier(0.25, 1, 0.5, 1)` for ease-out-quart.

**Suggested Command:** `/animate`

---

#### L6: Missing Empty States

**Location:** Dashboard cards  
**Category:** UX Pattern  
**Description:** Mockup shows populated states but doesn't demonstrate empty states for cards (no stories, no activity, etc.).

**Impact:** Implementation may not handle empty states gracefully.

**Recommendation:** Create empty state variants for:
- No assigned stories
- Empty review queue
- No team activity

**Suggested Command:** `/polish`

---

## Patterns & Systemic Issues

### 1. Card Container Overuse (Minor)

The mockup wraps most content in cards with consistent styling. While not egregious, some elements could breathe more without containers.

**Scope:** Dashboard grid cards, activity section

**Recommendation:** Consider if all sections need card containers or if some can use looser layouts.

---

### 2. Spacing Consistency

The mockup uses varied spacing (8px base unit as per spec) but some areas feel tighter than others.

**Scope:** Card internal padding varies (p-5 vs p-4), activity items have different padding.

**Recommendation:** Audit spacing for consistency; use Tailwind spacing tokens systematically.

---

### 3. Color Token Usage

The mockup correctly uses CSS custom properties for colors, which aligns with spec. However, some inline hex codes remain:

- Line 110: `#FEE2E2` (status badge)
- Line 110: `#DC2626` (status badge)
- Lines 111-113: Status badge colors

**Recommendation:** Add status colors to CSS variables for maintainability.

---

## Positive Findings

### What's Working Well

1. **Color Palette Excellence** - The warm brown/orange palette is distinctive, cohesive, and avoids AI slop. The `#FF6B35` orange with `#2D1810` dark brown creates strong brand identity.

2. **Universal Input Design** - The hero input is well-designed with:
   - Clear visual prominence
   - Gradient background for subtle emphasis
   - Proper placeholder guidance
   - Character count display
   - Helper text for capabilities

3. **Story Card Design** - Cards include all required elements:
   - Status badge with color coding
   - Story number + title
   - Progress percentage
   - Progress bar
   - Project and due date metadata

4. **Mini Kanban Visualization** - Excellent at-a-glance project status display. Color coding matches workflow stages.

5. **Team Activity Feed** - Clean horizontal scroll design, proper avatar integration, relative timestamps.

6. **Button Hierarchy** - Clear distinction between primary (orange), secondary (dark), and ghost buttons.

7. **Semantic Color Mapping** - Status badges use appropriate colors (red=urgent, green=ready, amber=in progress, blue=review).

8. **Accessibility Consideration** - Generally good contrast ratios between dark text and light backgrounds.

---

## Recommendations by Priority

### Immediate (Critical Blockers)

None - no critical issues.

### Short-term (This Sprint)

| Priority | Issue | Effort |
|----------|-------|--------|
| 1 | Replace fonts (Syne/Manrope) | Low |
| 2 | Fix max-width to 1280px | Low |

### Medium-term (Next Sprint)

| Priority | Issue | Effort |
|----------|-------|--------|
| 5 | Implement role-aware dashboard | Medium |
| 6 | Add placeholder rotation | Low |
| 7 | Add focus state styles | Low |
| 8 | Fix avatar sizes for accessibility | Low |

### Long-term (Nice-to-Haves)

| Priority | Issue | Effort |
|----------|-------|--------|
| 9 | Replace emoji headers with icons | Low |
| 10 | Create empty state variants | Medium |
| 11 | Document z-index scale | Low |
| 12 | Add breadcrumb component | Low |

---

## Suggested Commands for Fixes

| Command | Issues Addressed |
|---------|------------------|
| `/normalize` | H1 (typography), M1 (max-width) |
| `/harden` | M7 (avatar sizes), L3 (focus states) |
| `/polish` | M3 (status indication), L1 (emojis), L6 (empty states) |
| `/animate` | M5 (placeholder rotation), L5 (easing) |

**Manual Implementation Required:**
- M4 (Role-aware dashboard)
- M6 (Remove footer)

**Deferred (Later Session):**
- Topbar redesign (mode toggle, navigation)

---

## Specification Compliance Matrix

| Spec Requirement | Status | Notes |
|------------------|--------|-------|
| Universal Input (hero) | ✅ Pass | Well implemented |
| AI Response Area | ✅ N/A | Ask → Chat mode; no inline needed on Dashboard |
| Dashboard/Chat toggle | ⏸️ Deferred | Topbar redesign planned |
| Assigned Stories card | ✅ Pass | Good design |
| Review Queue card | ✅ Pass | Good design |
| Project Status card | ✅ Pass | Mini Kanban excellent |
| Team Activity feed | ✅ Pass | Clean design |
| Command Palette (⌘K) | ⚠️ Partial | Kbd shown, not implemented |
| Typography (Syne/Manrope) | ❌ Wrong fonts | High priority |
| Color palette | ✅ Pass | Excellent |
| Button hierarchy | ✅ Pass | Clear levels |
| Status badges | ✅ Pass | Good color coding |
| Progress bars | ✅ Pass | Functional |
| Max width 1280px | ❌ 1440px | Easy fix |
| Focus states | ⚠️ Partial | Hover done, focus unclear |

**Overall Compliance: 85%** - Good foundation, needs typography fix.

---

## Conclusion

The home page mockup demonstrates strong visual design with a distinctive brand identity. The warm color palette and clean layout avoid generic AI aesthetics. The interaction model (Ask → Chat mode) is a valid interpretation of the specification.

The typography system mismatch is the primary fix needed. The topbar/mode toggle will be addressed in a separate redesign session.

**Priority Order:**
1. Fix typography (immediate visual impact, low effort)
2. Remove documentation footer
3. Address remaining medium/low issues

---

*End of Audit Report*
