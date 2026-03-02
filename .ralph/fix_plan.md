# BMAD Zoniq UX Implementation Task List

> Atomized tasks for agentic loop execution. Mark status with `[x]` when complete.
> Created: 2026-02-28
> Last Updated: 2026-03-02

---

## 1. Shared Styles (shared-styles.css) - Custom Scrollbar

| # | Task | Status |
|---|------|--------|
| 1.1 | Add custom webkit scrollbar styles with fixed width (8px) that doesn't change on zoom | [x] |
| 1.2 | Style scrollbar-track with `--off-white` background | [x] |
| 1.3 | Style scrollbar-thumb with `--warm-gray` and rounded corners | [x] |
| 1.4 | Add scrollbar-thumb:hover with `--medium-gray` | [x] |
| 1.5 | Add scrollbar-thumb:active with `--orange` accent | [x] |

---

## 2. Story Details Page (design-story-details.html) - Implementation Steps Enhancement

| # | Task | Status |
|---|------|--------|
| 2.1 | Add collapsible toggle button to each implementation step item | [x] |
| 2.2 | Create collapsed/expanded states with smooth CSS transition (max-height) | [x] |
| 2.3 | Add "Developer Notes" textarea field inside each step item | [x] |
| 2.4 | Add "Add Screenshot" button/area inside each step item | [x] |
| 2.5 | Create screenshot preview thumbnail component | [x] |
| 2.6 | Add delete screenshot button with confirmation | [x] |
| 2.7 | Store toggle state in data attribute | [x] |
| 2.8 | Add JavaScript function to toggle step collapse | [x] |

---

## 3. Story Details Page - AI Assistant Collapsible

| # | Task | Status |
|---|------|--------|
| 3.1 | Add collapse/expand button to AI chat sidebar header | [x] |
| 3.2 | Create collapsed state showing only icon button (width: 48px) | [x] |
| 3.3 | Add smooth width transition animation (0.3s cubic-bezier) | [x] |
| 3.4 | Add keyboard shortcut badge (e.g., "Ctrl+I") near toggle | [x] |
| 3.5 | Implement keyboard shortcut (Ctrl/Cmd + I) to toggle sidebar | [x] |
| 3.6 | Save sidebar state to localStorage | [x] |

---

## 4. Home Page (design-home-page.html) - Apps Card Section

| # | Task | Status |
|---|------|--------|
| 4.1 | Create new "Apps" card in existing 3-column grid layout | [x] |
| 4.2 | Add section header with "Apps" title and count badge | [x] |
| 4.3 | Design app status card component with environment indicators | [x] |
| 4.4 | Add per-environment online status dots (Dev/Test/Acc/Prod) | [x] |
| 4.5 | Add per-environment warning count badges | [x] |
| 4.6 | Apply App object color scheme (`--object-app: #2563EB`) | [x] |
| 4.7 | Add "View All Apps" link button | [x] |

---

## 5. Home Page - Project & App Cards Color Update

| # | Task | Status |
|---|------|--------|
| 5.1 | Update project cards to use `--object-project: #9333EA` color | [x] |
| 5.2 | Update project card header backgrounds to `--object-project-bg: #F3E8FF` | [x] |
| 5.3 | Update app cards to use `--object-app: #2563EB` color | [x] |
| 5.4 | Update app card backgrounds to `--object-app-card: #DBEAFE` | [x] |
| 5.5 | Update customer cards to use `--object-customer: #10B981` color | [x] |
| 5.6 | Ensure hover states use corresponding accent colors | [x] |

---

## 6. New Page - Project Details (design-project-details.html)

| # | Task | Status |
|---|------|--------|
| 6.1 | Create new file: `design-project-details.html` | [x] |
| 6.2 | Add unified topbar navigation (copy from existing pages) | [x] |
| 6.3 | Create project header section with name, description, linked app | [x] |
| 6.4 | Add project metadata grid (status, priority, owner, customer, due date) | [x] |
| 6.5 | Add story count summary with status breakdown (mini kanban) | [x] |
| 6.6 | Create AI chat sidebar panel (similar to story-details.html) | [x] |
| 6.7 | Add "View Kanban" and "View Stories" action buttons | [x] |
| 6.8 | Apply Project object color scheme (`--object-project: #9333EA`) | [x] |
| 6.9 | Add story list section showing project's stories | [x] |
| 6.10 | Add breadcrumb navigation (Projects > [Project Name]) | [x] |

---

## 7. New Page - Context Library (design-context-library.html)

| # | Task | Status |
|---|------|--------|
| 7.1 | Create new file: `design-context-library.html` | [x] |
| 7.2 | Add unified topbar navigation | [x] |
| 7.3 | Create page header with "Context Library" title | [x] |
| 7.4 | Add search input with icon (full-width) | [x] |
| 7.5 | Create filter bar (type: All/Note/Summary/Technical/etc.) | [x] |
| 7.6 | Design context object card component | [x] |
| 7.7 | Add context object fields: title, type, summary, linked stories count | [x] |
| 7.8 | Create context list grid layout (2-3 columns) | [x] |
| 7.9 | Add "Add Context" floating action button | [x] |
| 7.10 | Create context detail modal/panel with edit capability | [x] |
| 7.11 | Add context type badge colors (similar to context sources in story-details) | [x] |
| 7.12 | Implement search filtering JavaScript | [x] |

---

## 8. Kanban Board (design-kanban-board.html) - UX Spec Alignment

| # | Task | Status |
|---|------|--------|
| 8.1 | Update column header colors to match UX spec kanban colors | [x] |
| 8.2 | Backlog column: `--kanban-backlog: #9A948D` | [x] |
| 8.3 | Active/In Progress column: `--kanban-active: #F59E0B` | [x] |
| 8.4 | Testing column: `--kanban-testing: #9333EA` | [x] |
| 8.5 | Review column: `--kanban-review: #2563EB` | [x] |
| 8.6 | Done column: `--kanban-done: #10B981` | [x] |
| 8.7 | Update card backgrounds per column (slight tint) | [x] |
| 8.8 | Ensure column badges use correct colors | [x] |
| 8.9 | Update scrollbar styling to match shared-styles | [x] |
| 8.10 | Add quick-filter buttons per UX spec | [x] |

---

## 9. Topbar Full Width Fix (All Pages)

| # | Task | Status |
|---|------|--------|
| 9.1 | Remove `max-w-[1280px] mx-auto` constraint from home page topbar inner container | [x] |
| 9.2 | Remove `max-w-[1280px] mx-auto` constraint from kanban board topbar inner container | [x] |
| 9.3 | Remove `max-w-[1280px] mx-auto` constraint from app management topbar inner container | [x] |
| 9.4 | Remove `max-w-[1280px] mx-auto` constraint from project details topbar inner container | [x] |
| 9.5 | Remove `max-w-[1280px] mx-auto` constraint from story details topbar inner container | [x] |
| 9.6 | Remove `max-w-[1280px] mx-auto` constraint from context library topbar inner container | [x] |

---

## 10. Home Page - Chat Input Max Width

| # | Task | Status |
|---|------|--------|
| 10.1 | Add max-width constraint to chat input bar on home page | [x] |

---

## 11. Kanban Board - Fonts Fix

| # | Task | Status |
|---|------|--------|
| 11.1 | Remove external font import (fontshare General Sans/Clash Grotesk) from kanban-board.html | [x] |
| 11.2 | Use Manrope font from shared-styles.css instead | [x] |
| 11.3 | Remove duplicate font-family CSS rules that override shared-styles | [x] |

---

## 12. Kanban Board - Lane Styling (Match Home Page Section Cards)

| # | Task | Status |
|---|------|--------|
| 12.1 | Update kanban column styling to match section cards on home page | [x] |
| 12.2 | Add consistent border-radius (12px) matching home page cards | [x] |
| 12.3 | Update column header background colors to match card headers | [x] |
| 12.4 | Add subtle shadows matching home page card shadows | [x] |

---

## 13. Kanban Board - Ticket Cards (Match Home Page Exactly)

| # | Task | Status |
|---|------|--------|
| 13.1 | Update kanban card structure to match home page ticket cards exactly | [x] |
| 13.2 | Match priority dot styling (colors: high=#EF4444, medium=#F59E0B, low=#6B7280) | [x] |
| 13.3 | Match card padding, border, and hover effects | [x] |
| 13.4 | Match status badge styling and colors | [x] |
| 13.5 | Match avatar size and positioning | [x] |
| 13.6 | Match progress bar styling | [x] |

---

## 14. App Management Page - Content Fix

| # | Task | Status |
|---|------|--------|
| 14.1 | Investigate missing content on app management page | [x] |
| 14.2 | Restore or fix any missing sections | [x] |

---

## 15. Project Details Page - Multiple Fixes

| # | Task | Status |
|---|------|--------|
| 15.1 | Make sidebar collapsible (add collapse/expand functionality) | [x] |
| 15.2 | Add dummy chat messages to AI chat sidebar | [x] |
| 15.3 | Change nav bar background from primary purple (#9333EA) to neutral (#F5F2EF like app management) | [x] |
| 15.4 | Fix topbar to match home page style (full width, remove max-width constraint) | [x] |
| 15.5 | Ensure topbar structure matches home page exactly | [x] |

---

## Summary

| Category | Total Tasks | Completed |
|----------|-------------|-----------|
| 1. Shared Styles (Scrollbar) | 5 | 5 |
| 2. Story Details - Steps Enhancement | 8 | 8 |
| 3. Story Details - AI Collapsible | 6 | 6 |
| 4. Home Page - Apps Card | 7 | 7 |
| 5. Home Page - Color Updates | 6 | 6 |
| 6. New: Project Details Page | 10 | 10 |
| 7. New: Context Library Page | 12 | 12 |
| 8. Kanban Board Updates | 10 | 10 |
| 9. Topbar Full Width Fix | 6 | 6 |
| 10. Home Page - Chat Input Max Width | 1 | 1 |
| 11. Kanban Board - Fonts Fix | 3 | 3 |
| 12. Kanban Board - Lane Styling | 4 | 4 |
| 13. Kanban Board - Ticket Cards | 6 | 6 |
| 14. App Management - Content Fix | 2 | 2 |
| 15. Project Details - Multiple Fixes | 5 | 5 |
| **TOTAL** | **91** | **91** |

---

## Reference: UX Design Color Variables

```css
/* Object Colors */
--object-project: #9333EA;
--object-project-bg: #F3E8FF;
--object-app: #2563EB;
--object-app-bg: #EFF6FF;
--object-app-card: #DBEAFE;
--object-customer: #10B981;
--object-customer-bg: #D1FAE5;

/* Kanban Column Colors */
--kanban-backlog: #9A948D;
--kanban-active: #F59E0B;
--kanban-testing: #9333EA;
--kanban-review: #2563EB;
--kanban-done: #10B981;

/* Base Colors */
--orange: #FF6B35;
--orange-light: #FFF7F3;
--dark: #2D1810;
--off-white: #FAFAF9;
--warm-gray: #E8E4E0;
--medium-gray: #9A948D;
```

---

## Context Library - Context Object Types

| Type | Icon | Color | Description |
|------|------|-------|-------------|
| Project Summary | Folder | `#9333EA` | High-level project overview |
| Ticket Summary | Ticket | `#FF6B35` | User story/ticket summary |
| Module Summary | Module | `#2563EB` | Module documentation |
| Recent Changes | Clock | `#F59E0B` | Change log summary |
| Mendix Info | Code | `#10B981` | Mendix development information |
| Technical Doc | File | `#6B7280` | Technical implementation details |

---

## Execution Notes for Agentic Loop

1. **One task at a time**: Execute exactly ONE task per iteration
2. **Mark complete**: Update `[ ]` to `[x]` after each task
3. **Test after each**: Open HTML in browser to verify changes
4. **Preserve existing code**: Only modify what's specified
5. **Follow patterns**: Match existing code style from other pages

---

EXIT_SIGNAL: true
