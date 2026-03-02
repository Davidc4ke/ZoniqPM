# App Management Module - Implementation Plan

**Created:** 2026-02-28
**Author:** David
**Status:** In Progress

---

## Progress Tracker

| Step | Task | Status |
|------|------|--------|
| 1 | Create app-management-plan.md | ✅ Complete |
| 2.1 | HTML: Base structure & navigation | ✅ Complete |
| 2.2 | HTML: App Header section | ✅ Complete |
| 2.3 | HTML: Projects Overview section | ✅ Complete |
| 2.4 | HTML: Modules & Test Coverage table | ✅ Complete |
| 2.5 | HTML: Live Logging Panel | ✅ Complete |
| 2.6 | HTML: Recent Changes timeline | ✅ Complete |
| 2.7 | HTML: Environments & Deployments cards | ✅ Complete |
| 2.8 | HTML: AI Chat Sidebar | ✅ Complete |
| 2.9 | HTML: Additional Widgets (Team, Activity, Quality) | ✅ Complete |
| 2.10 | CSS: App Header styles | ✅ Complete (inline Tailwind) |
| 2.11 | CSS: Log Panel styles | ✅ Complete (inline Tailwind) |
| 2.12 | CSS: Environment Card styles | ✅ Complete (inline Tailwind) |
| 2.13 | CSS: Module Table styles | ✅ Complete (inline Tailwind) |
| 2.14 | JS: Live Log simulation | ✅ Complete |
| 2.15 | JS: Environment status updates | ✅ Complete |
| 2.16 | JS: AI Sidebar interactions | ✅ Complete |
| 2.17 | Add left sidebar navigation for section jumping | ✅ Complete |
| 2.18 | Move AI Chat below App Header (like story-details pattern) | ✅ Complete |
| 2.19 | Restyle AI Chat to match design-story-details.html | ✅ Complete |
| 2.20 | Make nav sidebar always below the app header | ✅ Complete |
| 2.21 | Make app header sticky | ✅ Complete |
| 2.22 | Update sidebar with visible header labels (integrated, simple) | ✅ Complete |
| 2.23 | Animation: Section fade-in on scroll | ✅ Complete |
| 2.24 | Animation: Cards hover effects | ✅ Complete |
| 2.25 | Animation: Progress bars fill animation | ✅ Complete |
| 2.26 | Animation: Log entries slide-in | ✅ Complete |
| 2.27 | Animation: Environment status transitions | ✅ Complete |
| 2.28 | Animation: Sidebar slide transitions | ✅ Complete |
| 2.29 | Animation: AI message typing effect | ✅ Complete |
| 2.30 | Fix theme: Change cards from black to light theme (bg-[#F5F2EF]) | ✅ Complete |
| 2.31 | Fix Project cards: Align kanban-mini columns with labels | ✅ Complete |
| 3 | Update ux-design-specification.md | ✅ Complete |

---

## Overview

The App Management Module provides a comprehensive dashboard for monitoring and managing a Zoniq application. It serves as a central hub for developers and managers to view app health, track projects, monitor logs, and manage deployments.

### Target Users

| Persona | Primary Use |
|---------|-------------|
| **David (Senior)** | Monitor app health, review errors, manage deployments |
| **Aisha (Developer)** | View logs, check module status, debug issues |
| **Marcus (PM)** | Track project progress, view team activity |

---

## Page Sections

### 1. App Header

**Purpose:** Display core app identity and status at a glance

| Element | Type | Description |
|---------|------|-------------|
| App Name | Inline-editable text | Name of the application |
| Description | Inline-editable text | Brief description |
| Version | Badge | Current version number (e.g., v2.4.1) |
| Status | Indicator | Online (green) / Offline (red) / Deploying (amber) |
| Quick Actions | Buttons | Settings, Deploy, View Logs |

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  📦 Claims Management System                              [Online ●]    │
│  Mendix application for processing insurance claims                      │
│  v2.4.1                                                                 │
│                                                           [⚙️] [🚀] [📋]│
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Projects Overview

**Purpose:** Show all projects within the app with their ticket distribution

**Data Required:**
- Project name
- Ticket counts per status (Backlog, Active, Testing, Review, Done)
- Overall completion percentage

**Component:** Reuses `.kanban-mini` pattern from design-home-page.html

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  PROJECTS                                                    View All → │
│  ─────────────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐      │
│  │ Claims Portal        72%    │  │ Policy Management    45%    │      │
│  │ ████████░░                  │  │ █████░░░░░░                 │      │
│  │ [3][8][4][5][16]           │  │ [5][6][2][3][9]            │      │
│  │  B  A  T  R  D              │  │  B  A  T  R  D              │      │
│  └─────────────────────────────┘  └─────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────┘
```

**Mini Kanban Legend:**
| Column | Color | Hex |
|--------|-------|-----|
| Backlog (B) | Gray | `#9A948D` |
| Active (A) | Amber | `#F59E0B` |
| Testing (T) | Purple | `#9333EA` |
| Review (R) | Blue | `#2563EB` |
| Done (D) | Green | `#10B981` |

---

### 3. Modules & Test Coverage

**Purpose:** Display module-level metrics including ticket counts and test coverage

**Data Required:**
- Module name
- Ticket count per status
- Test coverage percentage
- Health status (healthy/warning/critical)

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  MODULES & TEST COVERAGE                                                │
│  ─────────────────────────────────────────────────────────────────────  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Module           │ Tickets    │ Coverage │ Health                 │  │
│  │──────────────────│────────────│──────────│───────────────────────│  │
│  │ Approvals        │ 3 / 2 / 1  │ 85% ████ │ ✅ Healthy             │  │
│  │ User Management  │ 1 / 4 / 0  │ 72% ███░ │ ⚠️ Needs tests         │  │
│  │ Reporting        │ 2 / 1 / 3  │ 45% ██░░ │ ❌ Critical            │  │
│  │ Dashboard        │ 0 / 2 / 2  │ 90% ████ │ ✅ Healthy             │  │
│  │ Notifications    │ 1 / 1 / 0  │ 60% ███░ │ ⚠️ Needs tests         │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

**Ticket Format:** `Active / In Review / Blocked`

**Health Indicators:**
| Status | Icon | Color | Criteria |
|--------|------|-------|----------|
| Healthy | ✅ | Green | Coverage ≥ 80%, no blocked tickets |
| Warning | ⚠️ | Amber | Coverage 50-79% or has blocked tickets |
| Critical | ❌ | Red | Coverage < 50% or multiple blocked tickets |

---

### 4. Live Logging Panel

**Purpose:** Real-time application logs with AI-powered error analysis

**Features:**
- Real-time log streaming
- Color-coded log levels (Error=red, Warning=amber, Info=gray)
- AI suggestion cards for detected issues
- Auto-created ticket badges
- Filter controls

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  LIVE LOGS                                    [All] [Errors] [Warnings] │
│  ─────────────────────────────────────────────────────────────────────  │
│  14:32:15  INFO   Request processed successfully                        │
│  14:32:18  WARN   Response time exceeded threshold (2.3s)               │
│  14:32:22  ERROR  Database connection timeout                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ 🔮 AI Suggestion                                                 │    │
│  │ This error pattern matches #47 (Approval Workflow). The timeout  │    │
│  │ occurs when approval requests exceed 100 concurrent users.       │    │
│  │                                                                  │    │
│  │ 🎫 Ticket #89 auto-created                 [View Ticket]         │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│  14:32:25  INFO   Retrying database connection...                       │
│  14:32:27  INFO   Connection restored                                   │
│                                                                         │
│                                              [▮▮ Pause] [⬇️ Download]  │
└─────────────────────────────────────────────────────────────────────────┘
```

**Log Level Colors:**
| Level | Text Color | Background |
|-------|------------|------------|
| ERROR | `#EF4444` | `#FEE2E2` |
| WARN | `#F59E0B` | `#FEF3C7` |
| INFO | `#9A948D` | transparent |
| DEBUG | `#6B7280` | transparent |

**AI Suggestion Card:**
- Appears inline after error logs
- Shows pattern match to existing tickets
- Displays auto-created ticket reference
- Provides "View Ticket" action button

---

### 5. Recent Changes

**Purpose:** Timeline of recent activity across the app

**Data Required:**
- Change type (commit, deployment, ticket update, comment)
- Actor (user with avatar)
- Timestamp
- Description

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  RECENT CHANGES                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ [A] Aisha deployed v2.4.1 to Test                    10 min ago   │  │
│  │───────────────────────────────────────────────────────────────────│  │
│  │ [M] Marcus created #89 (Fix DB timeout)              15 min ago   │  │
│  │───────────────────────────────────────────────────────────────────│  │
│  │ [D] David approved #47                               1 hour ago    │  │
│  │───────────────────────────────────────────────────────────────────│  │
│  │ [T] Tom moved #52 to Done                            2 hours ago   │  │
│  │───────────────────────────────────────────────────────────────────│  │
│  │ [A] Aisha generated Dev Plan for #58                 3 hours ago  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                            [View Full History →]        │
└─────────────────────────────────────────────────────────────────────────┘
```

**Change Type Icons:**
| Type | Icon | Color |
|------|------|-------|
| Deploy | Rocket | `#10B981` |
| Create | Plus | `#FF6B35` |
| Approve | Check | `#10B981` |
| Move | Arrow | `#2563EB` |
| Generate | Sparkles | `#9333EA` |

---

### 6. Environments & Deployments

**Purpose:** Monitor deployment status across environments

**Data Required:**
- Environment name
- Status (Online/Offline/Deploying)
- Last ping timestamp
- Currently deployed version
- Last deployment time

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  ENVIRONMENTS                                                           │
│  ─────────────────────────────────────────────────────────────────────  │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────┐
│  │ Development    │ │ Test           │ │ Acceptance     │ │ Production │
│  │ ● Online       │ │ ● Online       │ │ ● Online       │ │ ● Online   │
│  │ v2.4.2-dev     │ │ v2.4.1         │ │ v2.4.0         │ │ v2.3.5     │
│  │                │ │                │ │                │ │            │
│  │ Last ping:     │ │ Last ping:     │ │ Last ping:     │ │ Last ping: │
│  │ 2 min ago      │ │ 5 min ago      │ │ 1 min ago      │ │ 30 sec ago │
│  │                │ │                │ │                │ │            │
│  │ Deployed:      │ │ Deployed:      │ │ Deployed:      │ │ Deployed:  │
│  │ Today 14:30    │ │ Today 12:00    │ │ Feb 26         │ │ Feb 24     │
│  │                │ │                │ │                │ │            │
│  │ [Deploy] [Logs]│ │ [Deploy] [Logs]│ │ [Deploy] [Logs]│ │[Deploy][Logs]
│  └────────────────┘ └────────────────┘ └────────────────┘ └────────────┘
└─────────────────────────────────────────────────────────────────────────┘
```

**Status Indicators:**
| Status | Color | Animation |
|--------|-------|-----------|
| Online | `#10B981` | None |
| Offline | `#EF4444` | Pulse |
| Deploying | `#F59E0B` | Pulse |

---

### 7. AI Chat Sidebar

**Purpose:** Context-aware AI assistance for app management

**Width:** 320px (expandable to 480px)

**Features:**
- Context-aware responses about the app
- Quick action buttons
- Natural language queries

**Context Awareness:**
| Query Type | Example | Response |
|------------|---------|----------|
| Status | "How's the app doing?" | Health summary with metrics |
| Errors | "Any recent errors?" | List of recent errors with AI analysis |
| Deployment | "What's deployed to prod?" | Production environment status |
| Module | "Which module needs attention?" | Module with lowest coverage/highest issues |

**Quick Actions:**
- "Analyze recent errors"
- "Summarize deployment status"
- "Check test coverage"
- "What needs attention?"

**Layout:**
```
┌────────────────────────────┐
│  🔮 AI Assistant           │
│  ────────────────────────  │
│                            │
│  [Quick Actions]           │
│  ┌──────────────────────┐  │
│  │ Analyze errors       │  │
│  │ Check coverage       │  │
│  │ Deployment status    │  │
│  └──────────────────────┘  │
│                            │
│  [Chat messages...]        │
│                            │
│  ────────────────────────  │
│  [Type a message...] [Send]│
└────────────────────────────┘
```

---

### 8. Additional Widgets

**Team Members:**
- Shows users assigned to the app
- Avatar initials with status indicator

**Activity Summary:**
- Tickets created today
- Tickets completed today
- Active developers

**Quality Metrics:**
- Overall test coverage
- Open bugs
- Average story quality

---

## Full Page Layout

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  [LOGO] ZONIQ   [Dashboard] [Kanban] [Projects] [Apps] [Masterdata] [Accounts]  │
│                                                        [Create▾] [💬] [👤]      │
├─────────────────────────────────────────────────────────────────────────────────┤
│  APP HEADER                                                                     │
│  Claims Management System ● Online · v2.4.1                    [⚙️] [🚀] [📋]   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────┐  ┌─────────────────────────────────┐  │
│  │ PROJECTS                            │  │ MODULES & COVERAGE              │  │
│  │ [Project cards with mini kanban]    │  │ [Module table with metrics]     │  │
│  └─────────────────────────────────────┘  └─────────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────┐  ┌─────────────────────────────────┐  │
│  │ LIVE LOGS                           │  │ RECENT CHANGES                  │  │
│  │ [Log stream with AI suggestions]    │  │ [Activity timeline]             │  │
│  └─────────────────────────────────────┘  └─────────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ ENVIRONMENTS                                                            │   │
│  │ [Dev] [Test] [Acceptance] [Production]                                  │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                              │ 🔮 AI Assistant │
│  [Additional widgets area]                                   │ [Chat sidebar]  │
│                                                              │                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## CSS Components to Add

### New Classes Required

```css
/* App Header */
.app-header { ... }
.app-status-indicator { ... }

/* Log Panel */
.log-panel { ... }
.log-entry { ... }
.log-entry.error { ... }
.log-entry.warn { ... }
.log-entry.info { ... }
.ai-suggestion-card { ... }
.auto-ticket-badge { ... }

/* Environment Cards */
.environment-card { ... }
.environment-card.online { ... }
.environment-card.offline { ... }
.environment-card.deploying { ... }

/* Module Table */
.module-table { ... }
.health-indicator { ... }
```

---

## JavaScript Functionality

### Live Log Simulation
```javascript
// Simulate real-time log updates
function addLogEntry(level, message) { ... }

// AI suggestion injection
function showAISuggestion(errorLog) { ... }

// Auto-create ticket notification
function showAutoTicketBadge(ticketId) { ... }
```

### Environment Status
```javascript
// Update environment status
function updateEnvironmentStatus(env, status) { ... }

// Deploy animation
function triggerDeploy(env) { ... }
```

### AI Sidebar
```javascript
// Context-aware responses
function getAIResponse(query) { ... }

// Quick actions
function analyzeErrors() { ... }
function checkCoverage() { ... }
```

---

## Navigation Integration

Add "Apps" to the main navigation bar:

```html
<button class="nav-item active">
    <svg><!-- App icon --></svg>
    Apps
</button>
```

**Position:** Between "Projects" and "Masterdata"

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `design-app-management.html` | Create | Full HTML mockup |
| `shared-styles.css` | Update | Add new component classes |
| `ux-design-specification.md` | Update | Add App Management section |

---

## Execution Instructions

**IMPORTANT:** Each prompt should execute EXACTLY ONE substep at a time. Do not batch multiple substeps.

---

## Next Steps

1. ✅ **Step 1 Complete:** Plan document created
2. ⏳ **Step 2:** Create `design-app-management.html` - Execute ONE substep per prompt:
   - 2.1: Base HTML structure with navigation bar
   - 2.2: App Header section (name, status, version, quick actions)
   - 2.3: Projects Overview with mini kanban cards
   - 2.4: Modules & Test Coverage table
   - 2.5: Live Logging Panel with log entries
   - 2.6: Recent Changes timeline
   - 2.7: Environments & Deployments cards
   - 2.8: AI Chat Sidebar
   - 2.9: Additional Widgets (Team, Activity, Quality)
   - 2.10: CSS styles for App Header only
   - 2.11: CSS styles for Log Panel only
   - 2.12: CSS styles for Environment Cards only
   - 2.13: CSS styles for Module Table only
   - 2.14: JS - Live Log simulation only
   - 2.15: JS - Environment status updates only
   - 2.16: JS - AI Sidebar interactions only
3. ⏳ **Step 3:** Update `ux-design-specification.md` with App Management Module section
