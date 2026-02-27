# Story Card Design Critique

**Date:** 2026-02-27  
**Scope:** Ticket cards in `design-home-page.html` (Assigned to You & Review Queue columns)

---

## Anti-Patterns Verdict

**PASS** — Does not look AI-generated. The design uses a custom warm color palette (#FF6B35 orange, #2D1810 dark brown), Manrope font throughout, and avoids generic AI tells like gradient text, glassmorphism, or dark mode with glowing accents. The visual identity feels intentional and brand-specific.

---

## Overall Impression

The unified story card component is a step in the right direction, but the implementation has **inconsistencies that undermine the normalization effort**. The cards claim to be variants of the same component, yet they behave differently in ways that feel accidental rather than intentional. The biggest issue is **information hierarchy** — too many elements compete for attention at the same visual weight.

---

## Priority Issues

### 1. Inconsistent Font Sizes Between Variants

**What:**  
Assigned cards use `font-semibold` without explicit size (inherits ~16px). Review cards use `font-semibold text-sm` (14px).

```html
<!-- Assigned card -->
<span class="font-semibold">#47 Approval Workflow</span>

<!-- Review card -->
<span class="font-semibold text-sm">#44 Login Flow</span>
```

**Why it matters:**  
Users scanning both columns will perceive visual "jank" — the same information (story title) rendered at different sizes for no logical reason. This breaks the normalization goal and suggests the components aren't actually unified.

**Fix:**  
Remove `text-sm` from review card titles. Both variants should use the same title size. If review cards need to be more compact, reduce padding or hide elements — don't shrink typography.

**Command:** `/normalize`

---

### 2. Redundant Progress Indication (Percentage + Progress Bar)

**What:**  
Assigned cards show both a numeric percentage (85%) AND a progress bar. These communicate the same information twice.

**Why it matters:**  
- Visual clutter — two elements fighting for the same cognitive slot
- The progress bar IS the percentage, visualized
- Users don't need both — pick one based on context

**Recommendation:**

| Variant | Show Percentage | Show Progress Bar |
|---------|-----------------|-------------------|
| Assigned | ✅ No (bar is enough) | ✅ Yes |
| Review | ✅ Yes (no bar) | ❌ No (already hidden) |

For assigned cards, the progress bar is more scannable than a number. For review cards (where progress is less relevant), the percentage in the footer is acceptable as secondary metadata.

**Fix:**  
Remove `.story-card-percent` from the header in assigned cards. Keep the progress bar as the primary indicator. Move percentage to tooltip on hover if needed.

**Command:** `/simplify`

---

### 3. Status and Priority Conflated in Single Badge

**What:**  
The status badge mixes two different concepts:
- **Priority:** Urgent, High, Medium, Low
- **Status:** Ready, In Progress, In Review, Done

Current implementation:
```html
<span class="status-badge urgent">🔴 Urgent</span>
<span class="status-badge ready">🟢 Ready</span>
<span class="status-badge progress">🟡 In Progress</span>
```

"Urgent" is a priority. "Ready" is a status. They're semantically different.

**Why it matters:**  
- Users can't distinguish "this is urgent" from "this is ready to work"
- A ticket can be both "Urgent" AND "In Progress" — current design forces mutually exclusive choice
- The spec (ux-design-specification.md lines 383-400) defines priority indicator AND status as separate elements

**Fix:**  
Split into two visual elements:

```
┌─────────────────────────────────────────────┐
│ 🔴  #47 Approval Workflow          [85%]   │  ← Priority dot
│ Implement multi-level approval...           │
│ ████████░░                                  │  ← Progress bar
│ Claims Portal · Ready · Due Mar 15          │  ← Status as text/badge
└─────────────────────────────────────────────┘
```

Or use position:
- **Left of title:** Priority indicator (colored dot only, no text)
- **Right of footer:** Status badge

**Command:** `/normalize`

---

### 4. No Visual Distinction Between Description and Project Name

**What:**  
Both use identical styling:
```css
.story-card-description {
    font-size: 0.75rem;
    color: var(--medium-gray);
}

.story-card-footer {
    font-size: 0.75rem;
    color: var(--medium-gray);
}
```

Result: "Implement multi-level approval..." looks identical to "Claims Portal"

**Why it matters:**  
- Description is primary content (what the ticket is about)
- Project name is metadata (where it belongs)
- Same visual weight = user can't quickly parse what's important

**Fix:**  
Option A — Add visual separator:
```html
<p class="story-card-description">Implement multi-level approval...</p>
<div class="story-card-progress">...</div>
<div class="story-card-footer">
    <span class="story-card-project">Claims Portal</span>
    <span>Due Mar 15</span>
</div>
```

Option B — Use subtle icon prefix for project:
```html
<span><svg>📁</svg> Claims Portal</span>
```

Option C — Make description slightly darker:
```css
.story-card-description {
    color: var(--dark); /* or a tint */
    opacity: 0.8;
}
```

**Command:** `/polish`

---

## Minor Observations

1. **Empty footer slot** — Card #58 has an empty `<span></span>` for due date. Should hide the entire element or show "No due date".

2. **Emoji in status badges** — The colored circle emoji (🔴🟢🟡🔵) duplicates the badge background color. Redundant. Use colored dots via CSS or keep emoji, not both.

3. **Review card percentage in footer** — Shows "100%" in orange, which draws the eye. But for review cards, completion is less important than assignee. De-emphasize: use medium-gray instead of orange.

4. **Assignee avatar size** — Review cards use `w-6 h-6` (24px) which is quite small. Consider `w-7 h-7` (28px) for better recognizability.

---

## Questions to Consider

1. **What's the primary action for each card?** Click to view? Click to start working? The card is clickable but offers no affordance. Consider a subtle chevron or "View" indicator on hover.

2. **Does every card need a description?** For review queue, the description might be noise. Consider showing only on hover or truncating to one line.

3. **What would a senior developer (David) need to see first?** The review queue should optimize for: Who submitted it? What project? How complete? Current design buries assignee in a tiny avatar.

4. **Is "Ready" a useful status for review queue?** If it's in the review queue, it's ready for review by definition. The status badge becomes redundant in this context.

---

## Recommended Actions

| Priority | Issue | Command |
|----------|-------|---------|
| 1 | Inconsistent title font sizes | `/normalize` |
| 2 | Remove percentage from assigned card header | `/simplify` |
| 3 | Separate priority from status | `/normalize` |
| 4 | Distinguish description from project name | `/polish` |

---

## Proposed Card Structure (After Fixes)

**Assigned Variant:**
```
┌─────────────────────────────────────────────┐
│ 🔴  #47 Approval Workflow                   │
│                                             │
│ Implement multi-level approval based on     │
│ user role and amount                        │
│                                             │
│ ████████████████░░░░  85%                   │
│                                             │
│ Claims Portal · Due Mar 15                  │
└─────────────────────────────────────────────┘
```

**Review Variant:**
```
┌─────────────────────────────────────────────┐
│ [A]  #44 Login Flow                         │
│                                             │
│ User authentication and session management   │
│                                             │
│ Claims Portal · Ready · 100%                │
└─────────────────────────────────────────────┘
```

Key changes:
- Priority = colored dot only (left of title)
- Assignee = avatar left of title (review only)
- Percentage = inside progress bar (assigned) or footer (review)
- Project = first item in footer, possibly with folder icon
- Description = darker text, clear separation from footer
