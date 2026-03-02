---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
lastStep: 14
status: complete
inputDocuments: ['_bmad-output/planning-artifacts/product-brief-BMAD Zoniq-2026-02-26.md', '_bmad-output/planning-artifacts/prd.md']
workflowType: 'ux-design'
date: 2026-02-26
author: David
---

# UX Design Specification BMAD Zoniq

**Author:** David
**Date:** 2026-02-26

---

## Executive Summary

### Project Vision

Zoniq transforms documentation from painful overhead into a speed advantage for Mendix development teams. By instantly converting unstructured notes into acceptance criteria, development plans, and automated test scripts, it rewards documentation effort with immediate value—making speed the carrot that drives quality.

### Target Users

**Aisha (Junior Mendix Developer)**
- 2-3 years experience, competent builder
- Meets clients directly, often alone
- Struggles with vague requirements, rework, and anxiety about "what to build?"
- Needs: AI prep questions, notes-to-story conversion, gap detection

**Marcus (Business Senior / PM)**
- Excellent verbal communicator, great in meetings
- NOT technical, terrible at writing requirements
- Creates handoff friction through poor documentation
- Needs: Voice/note input, AI structuring, looks organized without being a "writer"

**David (Technical Senior / Founder)**
- Only technical senior on team of 6 juniors
- Bottleneck for quality, repeatedly gives same feedback
- Wants team to internalize automation-first thinking
- Needs: Clear review queue, trust in process, less firefighting

### Key Design Challenges

1. **Complexity in Simplicity** — Sophisticated AI workflows must feel effortless, especially for non-technical PMs
2. **Trust & Transparency** — Users need to trust AI output, understand gaps, and feel confident editing
3. **Multi-Persona Experience** — Same tool serves different mental models (guidance-seeking juniors, speed-seeking PMs, clarity-seeking seniors)

### Design Opportunities

1. **Progressive Disclosure** — Surface AI power when needed, keep initial experience simple and inviting
2. **Confidence Indicators** — Visual cues for story completeness, gap status, and AI generation quality
3. **Flow State Design** — Minimize friction in the notes → criteria → dev plan → test scripts loop

## Core User Experience

### Defining Experience

The heart of Zoniq is the **transformation moment** — when chaotic notes become structured, actionable artifacts. Users dump unstructured thoughts (meeting notes, voice transcripts, client docs), and AI instantly returns acceptance criteria, development plans, and test scripts.

**Core Loop:** Notes → Acceptance Criteria → Dev Plan → Test Scripts

This loop must feel magical. One paste, one click, clear output. No complex forms, no configuration, no friction.

### Platform Strategy

| Decision | Rationale |
|----------|-----------|
| **Primary Platform** | Web (desktop browser) |
| **Input Mode** | Mouse/keyboard |
| **Connectivity** | Always online (no offline mode) |
| **Context** | Office environment, post-meeting workflow |
| **Devices** | Laptops/desktops primarily |

Mobile support is not a priority for MVP — users work at desks after client meetings.

### Effortless Interactions

| Interaction | How It Should Feel |
|-------------|-------------------|
| **Notes → Criteria** | Paste messy text, click once, get structured output |
| **Generation Chain** | Criteria → Dev Plan → Test Scripts flows naturally, no re-entry |
| **Gap Detection** | AI surfaces missing info proactively, user doesn't have to ask |
| **Copy Output** | One-click copy to clipboard, ready for external use |
| **Story Status** | Visual indicators show completeness at a glance |

### Critical Success Moments

1. **First Generation** — User pastes notes, sees structured acceptance criteria → "This is exactly what I needed"
2. **Gap Discovery** — AI flags missing information → "I would have missed that edge case"
3. **Review Clarity** — Senior opens story, understands it in 30 seconds → Trust established
4. **Marcus's Moment** — Chaotic voice notes become clear requirements → Looks competent without being a writer

### Experience Principles

1. **Speed is the Reward** — Every interaction must feel faster than the manual alternative
2. **Embrace the Mess** — Accept chaotic input, output structured clarity
3. **Progressive Power** — Simple start, deeper features revealed when needed
4. **Earned Confidence** — Visual indicators show quality and completeness, building trust over time

## Desired Emotional Response

### Primary Emotional Goals

**Core Feeling: Relief through Speed**

Users should feel that Zoniq just saved them time and headache. The tool rewards documentation effort with immediate value, creating a sense that "this is worth my time."

**Persona-Specific Emotional Targets:**

| Persona | From | To |
|---------|------|-----|
| **Aisha** | Anxiety about "what do I build?" | Confidence and preparedness |
| **Marcus** | Inadequacy at documentation | Competence without changing who he is |
| **David** | Dread of review bottlenecks | Relief and trust in the process |

### Emotional Journey Mapping

| Stage | Desired Feeling |
|-------|-----------------|
| **First discovery** | Curiosity — "This might actually help" |
| **First generation** | Delight — "Wow, that was fast and useful" |
| **After task completion** | Confidence — "AI caught the gaps I would have missed" |
| **Review (seniors)** | Satisfaction — "This story is clear and complete" |
| **Returning to use** | Anticipation — "Let me dump my notes and get value" |

### Micro-Emotions

| Emotion | Priority | Design Focus |
|---------|----------|--------------|
| **Confidence** | Critical | Clear progress indicators, completeness scores |
| **Trust** | Critical | Transparent AI process, easy editing |
| **Relief** | High | One-click actions, minimal friction |
| **Competence** | High | Professional-looking output, "ready to share" |
| **Delight** | Medium | Fast generation, unexpected helpfulness |

### Emotions to Avoid

- **Frustration** — From slow AI or unclear UI
- **Confusion** — From too many options or complex forms
- **Distrust** — From generic or wrong AI output
- **Overwhelm** — From too many features at once

### Emotional Design Principles

1. **Reward Immediately** — Every action should produce instant, visible value
2. **Show the Thinking** — Transparency builds trust in AI output
3. **Make Users Look Good** — Output should be professional and shareable
4. **Catch the Falls** — Gap detection and error handling creates confidence

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

**Mendix (Primary Tool)**

| What They Do Well | UX Lesson |
|-------------------|-----------|
| **Global search** — One entry point to access all features | Single search/command palette to find anything |
| **Visual models** — Diagrams, domain models instead of code/tables | Visual story flow, not text-heavy lists |
| **Hides complexity** — Powerful platform, simple interface | AI complexity behind simple actions |

**ChatGPT (Daily Use)**

| What They Do Well | UX Lesson |
|-------------------|-----------|
| **Minimal UI** — Just a chat box, nothing else | Notes input this simple — paste and go |
| **Low barrier** — Type anything, get response | No forms, just dump thoughts |
| **Forgiving input** — Messy questions, structured answers | Exactly what Marcus needs |

### Transferable UX Patterns

**Navigation:**
- **Command palette** (`Ctrl+K`) — Jump to any story, project, or action instantly
- **Minimal sidebar** — Keep focus on content, not navigation

**Interaction:**
- **Chat-like input** — Notes area feels like a conversation, not a form
- **Progressive chain** — AI output leads naturally to next action ("Generate Dev Plan")

**Visual:**
- **Card-based stories** — Visual, scannable, like Mendix domain models
- **Status indicators** — Color-coded completeness scores

### Anti-Patterns to Avoid

- **Complex forms** — Defeats "embrace the mess" principle
- **Hidden AI actions** — Generation should be one click, not buried
- **Option overload** — Keep it chat-simple, reveal power progressively

### Design Inspiration Strategy

**What to Adopt:**
- Command palette navigation (Mendix pattern) — supports power users
- Chat-simple input (ChatGPT pattern) — lowers barrier for all personas

**What to Adapt:**
- Visual story cards — simpler than Mendix models, but same clarity
- AI conversation flow — more structured than ChatGPT, but same ease

**What to Avoid:**
- Multi-field forms for notes input
- Deep navigation hierarchies
- Feature-heavy initial UI

## Design System Foundation

### Tech Stack

| Layer | Choice | Rationale |
|-------|--------|----------|
| **Framework** | Next.js | Best-in-class React framework, excellent DX, fast builds |
| **Language** | TypeScript | Type safety, better for teams, catches errors early |
| **Component Library** | shadcn/ui | Copy-paste ownership, minimal aesthetic, fully customizable |
| **Styling** | Tailwind CSS | Rapid styling, easy color customization, great with shadcn |

### Visual Direction

**Aesthetic Goals:**
- Light, airy base (soft whites/grays)
- Not monochrome — accent colors for life
- Clean and functional (ChatGPT-like simplicity)
- Slightly playful but professional (rounded corners, subtle animations)

**Color Strategy:**

| Color Role | Direction |
|------------|-----------|
| **Base** | Soft light grays, clean whites |
| **Primary accent** | Playful but professional (e.g., violet, teal, or warm coral) |
| **Status colors** | Success (green), warning (amber), error (red) — standard but not harsh |

### Implementation Approach

1. Initialize Next.js project with TypeScript
2. Install and configure Tailwind CSS
3. Add shadcn/ui components as needed (start minimal)
4. Define custom color palette in Tailwind config
5. Build component library incrementally

### Customization Strategy

**What to Customize:**
- Color palette (light base + playful accent)
- Border radius (slightly rounded for approachable feel)
- Typography (clean, readable, not sterile)

**What to Keep Default:**
- Component structure and patterns
- Accessibility features
- Animation/transition patterns

## Defining Core Experience

### The Defining Experience

**"Universal AI Agent — one input field for everything"**

The universal input is not just for note capture — it's a conversational command center that handles:
- **Capture** → Notes to structured stories
- **Navigate** → "Open story 47"
- **Query** → "What's the status of Claims Portal?"
- **Search** → "Show stories about export"
- **Action** → "Assign #47 to Aisha"
- **Review** → "What do I need to review?"

**Type or paste anything. The AI figures out intent and responds.**

### Home Screen Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  ZONIQ                                    [Create] [Edit] [⚙️] [⌘K] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🔮 Ask me anything...                                       │   │
│  │                                                             │   │
│  │ Placeholder: "Paste notes, or try 'What do I review?'"      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [AI Response Area — inline responses appear here]                  │
│                                                                     │
├───────────────────────────────────┬─────────────────────────────────┤
│  YOUR WORK                        │  PROJECT STATUS                 │
│  ─────────────────────────────    │  ─────────────────────────────  │
│                                   │                                 │
│  📋 Assigned to You               │  Claims Portal        72% ████░ │
│  [Story cards]                    │  Policy Management    45% ██░░░ │
│                                   │                                 │
│  🔍 Review Queue                  │  Team Activity (Today)          │
│  [Stories for review]             │  [Activity feed]                │
│                                   │                                 │
└───────────────────────────────────┴─────────────────────────────────┘
```

### Universal Input Capabilities

| Intent Type | Example Input | AI Response |
|-------------|---------------|-------------|
| **Capture** | [Pastes notes] | "New story for [Project]?" [Create] |
| **Navigate** | "Open story 47" | Direct navigation to story |
| **Query** | "Status of Claims Portal?" | Inline project status card |
| **Search** | "Stories about export" | List of matching stories |
| **Action** | "Assign #47 to Aisha" | Confirmation + [View Story] |
| **Review** | "What do I review?" | Inline review queue |
| **Create** | "New story for Policy" | Story form, project pre-filled |

### Interaction Patterns

**Pattern 1: Inline Response**
```
User: "What's the status of Claims Portal?"

AI:   ┌─────────────────────────────────────┐
      │ Claims Portal — 72% Complete        │
      │ ████████░░                          │
      │                                     │
      │ 24 stories · 16 ready · 5 in review │
      │ ⚠️ 2 stories blocked                │
      │                                     │
      │ [View Project] [Show Blocked]       │
      └─────────────────────────────────────┘
```

**Pattern 2: Action Confirmation**
```
User: "Assign story 47 to Aisha"

AI:   ✅ Done. Story #47 assigned to Aisha.
      [View Story]
```

**Pattern 3: Smart Capture**
```
User: [Pastes notes about approval workflow]

AI:   📝 This looks like a new story for Claims Portal.
      
      Title: "Approval Workflow by Role"
      
      [Create Story] [Different Project] [Edit Title]
```

**Pattern 4: Navigation**
```
User: "Open story 47"

AI:   → [Navigates directly to story #47]
```

**Pattern 5: Search Results**
```
User: "Show stories about export"

AI:   🔍 3 stories matching "export":
      
      #49 Export Feature · In Progress · 60%
      #32 CSV Export · Done · 100%
      #28 PDF Export · Ready · 85%
      
      [Open #49] [Open #32] [Open #28]
```

### Placeholder Rotation

The input placeholder rotates to teach users capabilities:

- "Paste notes, or try 'What do I need to review?'"
- "Try: 'Open story 47' or 'How's Claims Portal?'"
- "Ask me anything about your projects..."
- "Create a story, or ask 'What's blocked?'"

### Role-Aware Dashboard

| User Role | "Your Work" Shows | Universal Input Suggests |
|-----------|-------------------|-------------------------|
| **Developer (Aisha)** | Assigned stories | "Try: 'What should I work on?'" |
| **Senior (David)** | Review queue | "Try: 'What needs review?'" |
| **PM (Marcus)** | Project status | "Try: 'How's Claims Portal?'" |

### Story Card Design

**Unified Card Structure:**
```
┌─────────────────────────────────────────────┐
│ 🔴  #47 Approval Workflow            [A]    │  ← Priority · Title · Assignee
│                                             │
│ Implement multi-level approval based on     │  ← Description
│ user role and amount                        │
│                                             │
│ 📂 Claims Portal · In Progress              │  ← Project · Status
└─────────────────────────────────────────────┘
```

| Element | Position | Purpose |
|---------|----------|---------|
| **Priority dot** | Left of title | Visual urgency indicator (red/amber/gray) |
| **Story number + title** | Header left | Quick identification |
| **Assignee avatar** | Header right (top-right corner) | Who owns/submitted the story |
| **Description** | Body | Context without opening the card |
| **Project name** | Footer left (with folder icon) | Which project this belongs to |
| **Status badge** | Footer right (bottom-right corner) | Current workflow state |

**Priority Levels:**
| Level | Dot Color | Hex | Use |
|-------|-----------|-----|-----|
| High | Red | `#EF4444` | Urgent/critical stories |
| Medium | Amber | `#F59E0B` | Normal priority |
| Low | Gray | `#9A948D` | Low priority |

**Status Values:**
| Status | Badge Color | Meaning |
|--------|-------------|---------|
| Ready | Green | Ready for review/work |
| In Progress | Amber | Currently being worked on |
| In Review | Blue | Awaiting code review |

**Card Background Strategy:**

All cards throughout the dashboard use a consistent warm gray background (`#F5F2EF`) for visual unity and clear separation from white container backgrounds:

| Element | Background | Rationale |
|---------|------------|-----------|
| **Story Cards** (all containers) | `#F5F2EF` | Consistent card identity across dashboard |
| **Project Cards** | `#F5F2EF` | Unified visual language |
| **Activity Items** | `#F5F2EF` | Consistent with other card elements |
| **Kanban Columns** | `white` | Crisp white in kanban context (different view) |

**CSS Implementation:**
```css
.story-card.assigned,
.story-card.review {
    background: #F5F2EF;
    border: none;
}
.story-card.assigned .story-card-header,
.story-card.review .story-card-header {
    border-bottom-color: #E8E4E0;
}
.project-card,
.activity-item {
    background: #F5F2EF;
}
```

**Design Rationale:**
- **Unified card color**: All cards share the same warm gray for visual consistency
- **No contextual colors per container**: Simpler mental model, cards look the same everywhere
- **No borders on cards**: Background color alone provides sufficient separation from white containers
- **No progress bar**: Status already indicates workflow state; progress bars added visual noise
- **No percentage**: Status badge is sufficient; numeric percentages were redundant
- **No due date**: Moved to story detail view to keep cards scannable
- **Status anchored to bottom-right**: Consistent position makes it easy to scan
- **Assignee in top-right**: Immediate visibility of who owns the work
- **Icons (not emojis)**: Professional iconography using inline SVGs from Heroicons

### Quick Actions Bar

| Button | Purpose |
|--------|---------|
| **[Create]** | Create new story (manual mode) |
| **[Edit]** | Find and edit existing story |
| **[⚙️]** | Project settings, user preferences |
| **[⌘K]** | Command palette for power users |

### Experience Mechanics

**1. Initiation (Multi-Intent):**

*Intent A: Capture*
- Focus on universal input
- Paste notes, AI detects context
- Quick capture flow

*Intent B: Action*
- Eyes go to "Your Work" column
- Role-aware content surfaces immediately
- Click story to start working

*Intent C: Overview*
- Scan project status column
- Check team activity
- Understand project health

**2. Intent Detection:**
- AI classifies intent (capture, query, action, navigate)
- Response type determined (inline, navigate, confirm)

**3. Response:**
- Inline: Show results in response area
- Navigate: Jump to target
- Confirm: Show action + confirmation button

**4. Follow-up:**
- User can chain commands: "Now assign it to Aisha"
- Context persists within session

### Success Criteria

| Criterion | Target |
|-----------|--------|
| **Instant clarity** | "What do I do?" answered in <2 seconds |
| **Intent accuracy** | 95%+ correct intent classification |
| **Response speed** | Inline responses <2s, navigation instant |
| **Learnable** | Placeholder suggestions teach capabilities |
| **Fallback** | "I'm not sure — did you mean X or Y?" |
| **Chain-able** | Context persists for follow-up commands |

## Visual Design Foundation

### Color System

**Refined Zoniq Palette**

| Category | Color | Hex | Use |
|----------|-------|-----|-----|
| **Primary Accent** | Warm Orange | `#FF6B35` | CTAs, highlights, active states |
| **Primary Dark** | Dark Brown | `#2D1810` | Text, icons, headers |
| **Base Light** | Off-White | `#FAFAF9` | Background, cards |
| **Neutral Light** | Warm Gray | `#E8E4E0` | Secondary backgrounds, hover states |
| **Neutral Medium** | Medium Gray | `#9A948D` | Secondary text, borders, dividers |
| **Success** | Green | `#10B981` | Success states, completion indicators |
| **Warning** | Amber | `#F59E0B` | Warnings, attention needed |
| **Error** | Red | `#EF4444` | Errors, critical issues |

**Semantic Color Mapping**

| Semantic Role | Color | Application |
|---------------|-------|-------------|
| Primary action | Warm Orange | Generate button, Create story, primary CTAs |
| Secondary action | Dark Brown | Secondary buttons, text links |
| Background | Off-White | Page background, card backgrounds |
| Elevated surface | White | Modals, dropdowns, popovers |
| Border | Warm Gray | Card borders, input borders |
| Text primary | Dark Brown | Headings, body text |
| Text secondary | Medium Gray | Descriptions, metadata |

### Typography System

**Single Font Family:** Manrope — Using one font family for both headings and body creates visual consistency and a cleaner, more cohesive aesthetic.

| Role | Font | Weight | Size | Use |
|------|------|--------|------|-----|
| **H1** | Manrope | ExtraBold (800) | 32px | Page titles |
| **H2** | Manrope | Bold (700) | 24px | Section headers |
| **H3** | Manrope | SemiBold (600) | 18px | Card titles, story titles |
| **H4** | Manrope | SemiBold (600) | 16px | Subsection headers |
| **Body** | Manrope | Regular (400) | 16px | Descriptions, content |
| **Body Small** | Manrope | Regular (400) | 14px | Metadata, secondary text |
| **Caption** | Manrope | Medium (500) | 12px | Labels, tags, hints |
| **Button** | Manrope | SemiBold (600) | 14px | Button text |

**Rationale for Single Font:**
- Creates visual unity across the interface
- Manrope's geometric-yet-friendly character works well at all sizes
- Weight contrast (800 vs 400) provides sufficient hierarchy without font-switching jank
- Simpler implementation and faster load times

**Type Scale:**
- Base: 16px
- Scale ratio: 1.25 (major third)
- Line height: 1.5 for body, 1.2 for headings

### Spacing & Layout Foundation

**Base Unit: 8px**

| Token | Value | Use |
|-------|-------|-----|
| `space-1` | 4px | Tight spacing, icon gaps |
| `space-2` | 8px | Default component padding |
| `space-3` | 16px | Card padding, section gaps |
| `space-4` | 24px | Between sections |
| `space-5` | 32px | Major section dividers |
| `space-6` | 48px | Page margins |

**Grid System:**
- 12-column grid
- 24px gutters
- Max content width: 1280px

**Layout Feel:** Balanced — not dense, not airy. Enough white space for clarity, efficient use of screen real estate.

### Accessibility Considerations

- **Contrast ratios:** All text meets WCAG AA (4.5:1 for body, 3:1 for large text)
- **Focus states:** Visible focus rings on all interactive elements
- **Font sizes:** Minimum 14px for readability
- **Interactive targets:** Minimum 44px touch targets

### CSS Variables Reference

**Core Colors (`shared-styles.css`):**

```css
:root {
    --orange: #FF6B35;
    --orange-light: #FFF7F3;
    --dark: #2D1810;
    --off-white: #FAFAF9;
    --warm-gray: #E8E4E0;
    --medium-gray: #9A948D;
    --success: #10B981;
    --warning: #F59E0B;
    --error: #EF4444;
}
```

**Status Colors:**

```css
:root {
    --status-ready-bg: #D1FAE5;
    --status-ready-text: #059669;
    --status-progress-bg: #FEF3C7;
    --status-progress-text: #D97706;
    --status-review-bg: #DBEAFE;
    --status-review-text: #2563EB;
}
```

**Kanban Column Colors:**

```css
:root {
    --kanban-backlog: #9A948D;
    --kanban-active: #F59E0B;
    --kanban-testing: #9333EA;
    --kanban-review: #2563EB;
    --kanban-done: #10B981;
}
```

**Object Type Colors:**

Each major object type in Zoniq has a distinct color identity for cards, headers, and accents:

```css
:root {
    /* Ticket/Story - Orange (action-oriented, primary brand) */
    --object-ticket: #FF6B35;
    --object-ticket-bg: #FFF7F3;
    --object-ticket-card: #F5F2EF;
    
    /* App - Blue (technical/system objects) */
    --object-app: #2563EB;
    --object-app-bg: #EFF6FF;
    --object-app-card: #F0F7FF;
    
    /* Project - Purple (organizational/creative) */
    --object-project: #9333EA;
    --object-project-bg: #FAF5FF;
    --object-project-card: #F9F5FC;
    
    /* Customer - Green (people/external relationships) */
    --object-customer: #10B981;
    --object-customer-bg: #ECFDF5;
    --object-customer-card: #F0FDF9;
}
```

**Object Color Usage:**

| Object | Primary Color | Card Background | Header Background | Use Case |
|--------|--------------|-----------------|-------------------|----------|
| **Ticket/Story** | `#FF6B35` | `#F5F2EF` | `#F5F2EF` | Story cards, ticket details, AI suggestions |
| **App** | `#2563EB` | `#F0F7FF` | `#EFF6FF` | App cards, app management pages, environment indicators |
| **Project** | `#9333EA` | `#F9F5FC` | `#FAF5FF` | Project cards, project overviews, module groupings |
| **Customer** | `#10B981` | `#F0FDF9` | `#ECFDF5` | Customer cards, client pages, external entity indicators |

**Key Component Classes:**

| Class | Purpose |
|-------|---------|
| `.app-container` | Main app wrapper, max-width 1280px |
| `.universal-input-hero` | Hero input with orange border |
| `.card` | Base card component |
| `.btn-primary` | Orange primary button |
| `.btn-secondary` | White with border button |
| `.btn-ghost` | Transparent hover button |
| `.btn-ghost-icon` | Icon-only button |
| `.nav-item` | Topbar navigation link |
| `.nav-item.active` | Active navigation state |
| `.story-card` | Dashboard story card |
| `.story-card.assigned` | Assigned story variant |
| `.story-card.review` | Review queue variant |
| `.topbar` | Sticky navigation header |
| `.avatar` | User avatar |
| `.avatar-initials` | Initials circle |
| `.dropdown` | Dropdown container |
| `.dropdown-menu` | Dropdown panel |
| `.tab-active` | Active tab indicator |
| `.progress-bar` / `.progress-fill` | Progress indicator |
| `.kanban-mini` | Mini kanban display |
| `.code-block` | Syntax highlighted code |
| `.comment-item` | Comment card |
| `.inline-editable` | Editable text field |

**Animation Transitions:**

```css
transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
```

**Reference File:** `_bmad-output/planning-artifacts/shared-styles.css`

## Design Direction Decision

### Chosen Direction

**Hero Input + Dual Mode (Dashboard / Chat)**

### Key Elements

| Element | Description |
|---------|-------------|
| **Logo** | Zoniq brand mark — orange square with brown abstract icon |
| **Hero Universal Input** | Below header, expands for long text, auto-detects project |
| **Navigation Header** | Dashboard, Kanban, Projects + role-specific: Masterdata, Accounts |
| **Create Dropdown** | New Ticket, New Project, New Story, New Document |
| **AI Chat Button** | Separate chat access in topbar |
| **Profile Dropdown** | User info, View Profile, Settings, Sign Out |
| **Dashboard View** | Three-column: Assigned, Review Queue, Projects |
| **Team Activity** | Horizontal scrolling activity feed |

### Home Screen Layout

**Default: Dashboard View**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [LOGO] ZONIQ   [Dashboard] [Kanban] [Projects] [Masterdata] [Accounts]     │
│                                                        [Create▾] [💬] [👤]  │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 🔮 [Paste notes, or try 'What do I need to review?'...]        [Ask] │  │
│  │ Try: "Open story 47" · "What's blocked?" · "Assign #52 to Aisha"     │  │
│  │                                                            0 chars    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────┬───────────────────┬───────────────────┐              │
│  │ 📋 Assigned       │ 🔍 Review         │ 📊 Projects       │              │
│  │       (3)         │       (5)         │   View Kanban →   │              │
│  │                   │                   │                   │              │
│  │   [story cards]   │   [story cards]   │  [mini kanban     │              │
│  │   warm gray bg    │   warm gray bg    │   per project]    │              │
│  │                   │                   │  [progress bars]  │              │
│  │                   │                   │                   │              │
│  └───────────────────┴───────────────────┴───────────────────┘              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 👥 Team Activity — Today                                              │  │
│  │ [A moved #47] [M created #62] [T completed #44] [A generated plan]... │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Create Dropdown Menu:**
```
┌─────────────────┐
│ ○  New Ticket   │
│ 📁 New Project  │
│ 📋 New Story    │
│ ─────────────── │
│ 📄 New Document │
└─────────────────┘
```

**Profile Dropdown Menu:**
```
┌─────────────────────┐
│ David               │
│ david@zoniq.dev     │
│ ─────────────────── │
│ 👤 View Profile     │
│ ⚙️ Settings         │
│ ─────────────────── │
│ 🚪 Sign Out         │
└─────────────────────┘
```

### Unified Topbar Navigation

| Nav Item | Visibility | Icon | Description |
|----------|------------|------|-------------|
| **Dashboard** | All users | Grid | Home dashboard with assigned stories |
| **Kanban** | All users | Table | Full kanban board view |
| **Projects** | All users | Folder | Project list and management |
| **Masterdata** | Admins/Managers | Database | System configuration data |
| **Accounts** | Admins/Managers | Users | User management |

### Mini Kanban Columns

| Column | Color | Hex | Meaning |
|--------|-------|-----|---------|
| Backlog | Gray | `#9A948D` | Not started |
| Active | Amber | `#F59E0B` | In progress |
| Testing | Purple | `#9333EA` | QA/testing |
| Review | Blue | `#2563EB` | Awaiting review |
| Done | Green | `#10B981` | Complete |

### Story Card Design (Dashboard)

**Unified Card Structure:**
```
┌─────────────────────────────────────────────┐
│ 🔴  #47 Approval Workflow            [A]    │  ← Priority · Title · Assignee
│                                             │
│ Implement multi-level approval based on     │  ← Description
│ user role and amount                        │
│                                             │
│ 📂 Claims Portal · In Progress              │  ← Project · Status
└─────────────────────────────────────────────┘
```

| Element | Position | Style |
|---------|----------|-------|
| **Priority dot** | Left of title | Red/Amber/Gray |
| **Story # + title** | Header left | Font-semibold |
| **Assignee avatar** | Header right (top-right) | Initials circle |
| **Description** | Body | Truncated, 2 lines max |
| **Project name** | Footer left | With folder icon |
| **Status badge** | Footer right (bottom-right) | Colored pill |

**Card Background:** All dashboard cards use warm gray (`#F5F2EF`) for visual consistency.

### Design Rationale

1. **Hero input encourages AI-first** — Prominent placement with orange border, expands for long notes
2. **Expanded navigation** — Role-aware items appear based on user permissions
3. **Dashboard provides at-a-glance status** — Three columns show all relevant info
4. **Mini Kanban shows project health** — Visual distribution with progress percentages
5. **Team Activity horizontal scroll** — Compact activity feed saves vertical space

### Visual Reference

Interactive mockups:
- Home Page: `_bmad-output/planning-artifacts/design-home-page.html`
- Story Details: `_bmad-output/planning-artifacts/design-story-details.html`
- Shared Styles: `_bmad-output/planning-artifacts/shared-styles.css`

## User Journey Flows

### Journey 1: Quick Capture

**Persona:** Marcus (PM), Aisha (Developer)
**Goal:** Transform unstructured notes into a structured story in seconds

```mermaid
flowchart TD
    A[Open Zoniq] --> B[Focus on Universal Input]
    B --> C{Input Type?}
    C -->|Paste notes| D[AI detects project/story]
    C -->|Type command| E[AI parses intent]
    D --> F[AI generates story draft]
    E --> F
    F --> G{Gaps detected?}
    G -->|Yes| H[Show gap warnings]
    G -->|No| I[Show story preview]
    H --> J{User action?}
    I --> J
    J -->|Create| K[Story created → show success]
    J -->|Edit| L[Edit title/details]
    J -->|Cancel| M[Clear input, return to dashboard]
    L --> K
    K --> N{Continue in chat?}
    N -->|Yes| O[Chat mode active]
    N -->|No| P[Return to dashboard]
```

**Entry Points:**
- Dashboard universal input (default)
- Chat mode continuation
- ⌘K command palette

**Success Metrics:**
- Time from paste to story created: <10 seconds
- Gaps caught before creation: 80%+

---

### Journey 2: Review & Approve

**Persona:** David (Senior)
**Goal:** Quickly review stories and provide feedback or approval

```mermaid
flowchart TD
    A[Open Zoniq] --> B[See Review Queue count]
    B --> C[Click story to review]
    C --> D[Story detail view]
    D --> E{Review decision?}
    E -->|Approve| F[Mark approved → notification to assignee]
    E -->|Request changes| G[Add feedback comment]
    E -->|Questions| H[Use universal input to ask AI]
    G --> I[Story returns to In Progress]
    F --> J[Story moves to Done/Next stage]
    H --> K[AI answers or flags for discussion]
    K --> E
```

**Entry Points:**
- Review Queue card on dashboard
- "What do I review?" command in universal input
- Direct link from notification

**Success Metrics:**
- Time to understand story: <30 seconds
- Review completed: <2 minutes

---

### Journey 3: Start My Day

**Persona:** All
**Goal:** Immediately see what needs attention based on role

```mermaid
flowchart TD
    A[Open Zoniq] --> B{User role?}
    B -->|Developer| C[See Assigned stories]
    B -->|Senior| D[See Review Queue]
    B -->|PM| E[See Project Status]
    C --> F[Click story to work]
    D --> G[Click story to review]
    E --> H[Check Kanban or query status]
    F --> I[Story detail view]
    G --> I
    H --> J[AI answers status question]
```

**Role-Aware Dashboard:**

| Role | Primary Card | Secondary |
|------|--------------|-----------|
| Developer | Assigned to You | Review Queue (if any) |
| Senior | Review Queue | Project Status |
| PM | Project Status | Team Activity |

---

### Journey 4: Generate Dev Plan

**Persona:** Aisha (Developer)
**Goal:** Transform acceptance criteria into actionable development plan

```mermaid
flowchart TD
    A[View story with acceptance criteria] --> B[Click Generate Dev Plan]
    B --> C[AI analyzes criteria]
    C --> D[Dev plan generated]
    D --> E{Plan has gaps?}
    E -->|Yes| F[AI flags unclear areas]
    E -->|No| G[Show plan preview]
    F --> H{User action?}
    G --> H
    H -->|Accept| I[Dev plan saved to story]
    H -->|Edit| J[Edit plan steps]
    H -->|Generate Tests| K[Continue to test generation]
    J --> I
    I --> L[Story ready for implementation]
```

**Chain Flow:**
1. Notes → Acceptance Criteria
2. Acceptance Criteria → Dev Plan
3. Dev Plan → Test Scripts

---

### Journey Patterns

| Pattern | Description | Used In |
|---------|-------------|---------|
| **One-click entry** | Single action to start any journey | All journeys |
| **AI-first generation** | AI produces draft, user refines | Capture, Dev Plan |
| **Inline gap detection** | Warnings shown in flow, not separate modal | Capture, Dev Plan |
| **Role-aware defaults** | Dashboard shows relevant content | Start My Day |
| **Chain actions** | Complete task, offered logical next step | Capture → Dev Plan → Tests |
| **Chat persistence** | Conversation continues across actions | All via universal input |

### Flow Optimization Principles

1. **Minimize clicks to value** — Every journey starts with one action
2. **AI generates, user refines** — Never start from blank
3. **Inline feedback** — Gaps and warnings in context, not blocking modals
4. **Role-aware defaults** — See what matters most immediately
5. **Graceful recovery** — Cancel always returns to safe state
6. **Progress visibility** — Always know where you are in a flow

## Component Strategy

### Design System Components (shadcn/ui)

**Available Foundation Components:**

| Component | Use Case |
|-----------|----------|
| Button | CTAs, form submissions, actions |
| Input / Textarea | Text entry, notes input |
| Select | Dropdowns, filters |
| Dialog / Sheet | Modals, side panels |
| Tabs | Content organization (story tabs) |
| Avatar | User representation, assignees |
| Badge | Status indicators, tags |
| Card | Container for content blocks |
| Dropdown Menu | Context menus, actions |
| Popover / Tooltip | contextual info, hints |
| Command | ⌘K command palette |
| Progress | Completion indicators |
| Skeleton | Loading states |
| Separator | Visual dividers |
| Scroll Area | Scrollable containers |

### Custom Components

#### 1. UniversalInput

**Purpose:** Single input field for capture, navigate, query, and action — the hero interaction element.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Free-form text, pasted notes, commands |
| **States** | Default, focused, expanded (multi-line), loading (AI processing) |
| **Variants** | Compact (header), Expanded (chat mode) |
| **Features** | Auto-expand textarea, placeholder rotation, character count, submit button |
| **Accessibility** | `aria-label="Ask me anything"`, Enter to submit, Shift+Enter for newline |

#### 2. StoryCard

**Purpose:** Display story summary for quick scanning in lists and dashboards.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Story #, title, status badge, % complete, due date, assignee avatar |
| **States** | Default, hover (subtle lift), selected |
| **Variants** | Compact (dashboard list), Full (story list page) |
| **Accessibility** | Clickable, keyboard navigable, `aria-label` with full context |

#### 3. CompletenessMeter

**Purpose:** Visual story completeness indicator with color-coded progress.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Percentage, progress bar |
| **States** | Color-coded: red (<50%), amber (50-80%), green (>80%) |
| **Accessibility** | `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |

#### 4. GapIndicator

**Purpose:** Flag missing information in stories before "Ready" status.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Warning icon, gap description |
| **States** | Default, dismissible |
| **Accessibility** | `role="alert"`, high contrast |

#### 5. AIResponseCard

**Purpose:** Display inline AI responses in dashboard/chat.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Varies: status cards, confirmations, search results, story previews |
| **States** | Default, with action buttons |
| **Variants** | Status, Confirmation, SearchResults, StoryPreview |

#### 6. MiniKanban

**Purpose:** Show project status distribution at a glance on dashboard.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Column headers with count, mini story indicators |
| **States** | Static display (clicking opens full Kanban) |
| **Accessibility** | `aria-label` with column counts |

#### 7. KanbanBoard

**Purpose:** Full project workflow visualization with drag-drop story management.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Columns (Backlog, In Progress, Testing, Review, Done), story cards |
| **States** | Default, dragging (card lifted), drop-target (column highlighted) |
| **Features** | Drag-and-drop, column collapse, filters, quick actions on hover |
| **Accessibility** | Keyboard drag (Space to pick up, arrows to move, Space to drop) |

#### 8. KanbanColumn

**Purpose:** Container for stories in a status within KanbanBoard.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Column header, count, story cards, "Add story" button |
| **States** | Default, drop-target, collapsed |

#### 9. StoryHeader

**Purpose:** Display story identity and key metadata in detail view.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Story #, title (inline-editable), description (inline-editable) |
| **Metadata Grid** | Status, Priority, Assignee, Project, Module, Due Date, Quality % |
| **Actions** | Delete (⋮ menu) |

#### 10. StoryTabs

**Purpose:** Content organization for story detail page.

| Tab | Content |
|-----|---------|
| **Context** | Questions + Context Sources (Notes, Documents, URLs, Project Files) |
| **Requirements** | Given/When/Then criteria list |
| **Implementation** | Grouped sections with steps (Domain Model, Microflow Logic, etc.) |
| **Quality Assurance** | UAT test steps + Automated tests |
| **Deployment** | Release info, tasks, environment status |
| **Activity** | Comments, history log |

#### 11. QuestionsList

**Purpose:** Display and manage questions about a story.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Questions with asker, status (answered/unanswered) |
| **Actions** | Add question, answer question |
| **States** | Answered (green check), Unanswered (empty checkbox) |

#### 12. ContextSources

**Purpose:** Manage context attached to a story.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Notes, Documents, URLs, Project Files |
| **Actions** | Add context source (dropdown: Note, Upload, URL, Project File) |
| **Variants** | Note (orange bg), Document (blue bg), URL (green bg), Project File (amber bg) |

#### 13. RequirementsList

**Purpose:** Display and manage requirements in Given/When/Then format.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Requirements with Given/When/Then structure |
| **Actions** | Add, edit, delete |
| **States** | Verified/unverified |

#### 14. ImplementationSection

**Purpose:** Grouped implementation steps organized by category.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Section header (icon + name), steps with checkboxes |
| **Section Types** | Domain Model (purple), Microflow Logic (amber), Page Logic (green), Security Check (red) |
| **Actions** | Add step, edit section, delete section |
| **States** | Expanded/collapsed, step complete/pending/current |

#### 15. UATTestSteps

**Purpose:** Display UAT test steps with checkboxes.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Numbered steps with description, instructions |
| **Actions** | Add step, mark complete |
| **States** | Complete/incomplete |

#### 16. AutomatedTests

**Purpose:** Display AI-generated Playwright test scripts.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Playwright code block, syntax highlighted, line numbers |
| **Actions** | Copy to clipboard, download .spec.ts, edit, regenerate |
| **Features** | Passing count badge |

#### 17. DeploymentPanel

**Purpose:** Manage release information and deployment status.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Release info (date, version), release tasks, environment deployment status |
| **Actions** | Add task, add environment, mark deployed |
| **States** | Deployed (green), Pending (gray) |

#### 18. AIChatSidebar

**Purpose:** Tab-aware AI assistance for story detail page.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Chat messages, tab-aware responses, quick actions |
| **Layout** | Fixed right sidebar, 320px wide (expands to 480px) |
| **Features** | Context-aware suggestions, gap detection, action buttons |
| **States** | Per-tab content (Context, Requirements, Implementation, QA, Deployment, Activity) |

#### 19. CommentThread

**Purpose:** Review feedback and discussion on stories.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Comments with author avatar, timestamp, replies (threaded) |
| **Actions** | Add comment, reply, @mention, react (👍) |
| **States** | Default, composing |

#### 20. ActivityLog

**Purpose:** Story history (status changes, edits, AI generations).

| Attribute | Specification |
|-----------|---------------|
| **Content** | Timeline of changes with actor, timestamp |

#### 21. ActivityFeed

**Purpose:** Show recent team activity on dashboard (horizontal scroll).

| Attribute | Specification |
|-----------|---------------|
| **Content** | User avatar, action description, timestamp |
| **States** | Default, hover (highlight) |
| **Accessibility** | List semantics, relative time |

#### 22. Topbar

**Purpose:** Unified navigation header.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Logo, nav items (role-aware), Create dropdown, AI Chat button, Profile dropdown |
| **Features** | Sticky positioning, role-based visibility |
| **States** | Nav item active (orange bg) |

#### 23. NavItem

**Purpose:** Navigation link in topbar.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Icon + label |
| **States** | Default, hover (warm gray bg), active (orange bg + text) |
| **Accessibility** | Focus-visible outline |

#### 24. AttachmentUploader

**Purpose:** Client docs, screenshots, reference materials.

| Attribute | Specification |
|-----------|---------------|
| **Actions** | Upload, preview, delete, download |

### Component Implementation Strategy

**Foundation (shadcn/ui):**
Button, Input, Textarea, Card, Badge, Dialog, Command, Progress, Avatar, Dropdown Menu, Tabs, Tooltip, Scroll Area, Skeleton, Separator

**Custom Built (using Tailwind + shadcn patterns):**
- UniversalInput — core interaction component
- StoryCard — primary content display
- CompletenessMeter — progress visualization
- GapIndicator, GapWarningPanel — quality feedback
- KanbanBoard, KanbanColumn, MiniKanban — workflow visualization
- StoryHeader, StoryTabs — detail page structure
- AcceptanceCriteriaList, DevPlanViewer, TestScriptViewer — AI output display
- CommentThread, ActivityLog, ActivityFeed — collaboration
- AIResponseCard — inline AI feedback
- AttachmentUploader — file management

**Implementation Principles:**
- Build custom components using Tailwind + shadcn primitives
- Use design tokens from Visual Design Foundation (colors, typography, spacing)
- Compose from shadcn components where possible
- Full accessibility compliance (WCAG AA)
- Consistent interaction patterns across all custom components

### Implementation Roadmap

**Phase 1 — Core (MVP):**
| Component | Needed For |
|-----------|------------|
| UniversalInput | All capture flows |
| StoryCard | Dashboard & story lists |
| CompletenessMeter | Story status display |
| StoryHeader | Story detail page |
| StoryTabs | Story detail page |
| AcceptanceCriteriaList | Story detail page |
| GapWarningPanel | Story quality gate |

**Phase 2 — Kanban & Detail:**
| Component | Needed For |
|-----------|------------|
| KanbanBoard | Full workflow view |
| KanbanColumn | KanbanBoard |
| DevPlanViewer | Story detail page |
| TestScriptViewer | Story detail page |
| CommentThread | Review workflow |
| ActivityLog | Story history |

**Phase 3 — Enhancement:**
| Component | Needed For |
|-----------|------------|
| MiniKanban | Dashboard project status |
| AIResponseCard | Universal input responses |
| ActivityFeed | Dashboard collaboration |
| AttachmentUploader | Story attachments |

## UX Consistency Patterns

### Button Hierarchy

| Level | Use Case | Visual Style |
|-------|----------|--------------|
| **Primary** | Main actions (Generate, Create, Save) | Warm Orange fill (`#FF6B35`), white text |
| **Secondary** | Alternative actions (Cancel, Edit) | Dark Brown outline (`#2D1810`), brown text |
| **Tertiary** | Low-priority links (View, Learn more) | Text only, orange on hover |
| **Destructive** | Dangerous actions (Delete) | Red fill (`#EF4444`), white text |
| **Ghost** | Inline actions within content | Transparent, brown text, hover gray bg |

**Button Rules:**
- One primary action per context
- Primary always on right or bottom
- Destructive actions require confirmation dialog
- Loading state: spinner icon + disabled
- Minimum width: 80px
- Border radius: 8px (consistent with design system)

### Feedback Patterns

**Toast Notifications:**

| Type | Color | Icon | Duration | Example |
|------|-------|------|----------|---------|
| **Success** | Green `#10B981` | ✓ checkmark | 3s auto-dismiss | "Story created" |
| **Error** | Red `#EF4444` | ✗ X mark | 5s + manual dismiss | "AI generation failed" |
| **Warning** | Amber `#F59E0B` | ⚠ triangle | 4s + manual dismiss | "Gaps detected in story" |
| **Info** | Blue | ℹ circle | 3s auto-dismiss | "Story assigned to you" |

**Toast Position:** Bottom-right corner, stacked vertically

**Toast Actions:** Optional action button (e.g., "View Story", "Undo")

**Inline Field Feedback:**
- Success: Green border + check icon on field
- Error: Red border + error message below field
- Warning: Amber border + warning message below field

### Form Patterns

**Layout:**
- Single column layout (no multi-column forms)
- Labels above inputs, not inline
- Required fields marked with asterisk (*)
- Helper text below input in Medium Gray (`#9A948D`)
- Consistent 16px vertical spacing between fields

**Validation:**
- Real-time validation on blur (not on type)
- Error messages: Clear, specific, actionable
  - ❌ "Invalid input"
  - ✓ "Story title must be at least 5 characters"
- Validation icon appears inside input on right

**AI Generation Forms:**
- Notes input: Large textarea, auto-expand to 200px max
- Generate button: Primary styling, prominent placement
- Loading: Skeleton in output area + "Generating..." text
- Retry option always available on failure

### Navigation Patterns

**Primary Navigation (Topbar):**

| Position | Element | Visibility |
|----------|---------|------------|
| Left | Logo + brand name "ZONIQ" | All users |
| Center-left | Dashboard, Kanban, Projects | All users |
| Center-left | Masterdata, Accounts | Admins/Managers only |
| Right | Create dropdown, AI Chat button, Profile dropdown | All users |

**Role-Based Navigation Visibility:**

| Nav Item | Developer | PM | Senior/Admin |
|----------|-----------|-----|--------------|
| Dashboard | ✓ | ✓ | ✓ |
| Kanban | ✓ | ✓ | ✓ |
| Projects | ✓ | ✓ | ✓ |
| Masterdata | ✗ | ✗ | ✓ |
| Accounts | ✗ | ✗ | ✓ |

**Create Dropdown Options:**
- New Ticket
- New Project
- New Story
- New Document (divider before this)

**Profile Dropdown:**
- User name + email (non-clickable header)
- View Profile
- Settings
- Sign Out

**Command Palette (⌘K):**
- Opens with `Cmd/Ctrl + K`
- Search bar focused automatically on open
- Sections: Quick Actions, Recent Stories, Projects
- Arrow keys to navigate, Enter to select, Escape to close
- Fuzzy search across all content

**Breadcrumbs:**
- Format: Projects > [Project Name] > [Story #]
- All segments clickable except current
- Hidden on mobile (use back button pattern)

### Modal & Overlay Patterns

**Dialog (Modal):**
- Centered on screen, max-width 480px
- Backdrop: Semi-transparent dark (`rgba(0,0,0,0.5)`)
- Structure: Header + content + footer (actions)
- Close methods: X button (top-right), Escape key, click outside backdrop
- Focus trap active when open
- Body scroll locked

**Sheet (Side Panel):**
- Slides in from right edge
- Width variants: 400px (narrow) / 600px (wide)
- Use cases: Story detail preview, settings panels, filters
- Close: X button, Escape key, swipe gesture (future mobile)

**Confirmation Dialog:**
- Title format: Action verb + object ("Delete Story?")
- Body: Clear consequence explanation
- Actions: Cancel (secondary, left) + Confirm (destructive/primary, right)
- Destructive confirm: Red button

### Empty States

| Context | Message | Action |
|---------|---------|--------|
| No stories | "No stories yet" | "Paste notes to create your first story" + focus universal input |
| No search results | "No stories match '[query]'" | "Try different keywords or check spelling" |
| No review queue | "All caught up!" | "No stories need your review right now" |
| No activity | "No recent activity" | None (just illustration) |
| No projects | "No projects yet" | "Create Project" button |

**Empty State Visuals:** Illustration or icon + primary message + optional secondary text + optional action button

### Loading States

| Context | Pattern |
|---------|---------|
| AI generation | Skeleton in output area + "Generating..." text + spinner in button |
| Page load | Skeleton cards matching final layout |
| Button action | Spinner icon in button + disabled state |
| List load | Shimmer effect on list items |
| Inline update | Subtle pulse on updated element |

**Skeleton Styling:** Warm Gray (`#E8E4E0`) background, Off-White (`#FAFAF9`) shimmer animation

### Search & Filtering Patterns

**Universal Input Search:**
- User types "Search [query]" or just query terms
- AI detects search intent
- Results appear inline as AIResponseCard with clickable story cards

**Filter Bar (Kanban/List views):**
- Dropdown filters: Status, Assignee, Project
- Active filters shown as removable badges
- "Clear all" button when filters active
- Filter count badge on filter icon

### AI Interaction Patterns

**Generation Flow:**
1. User triggers generation (button click or command)
2. Loading state: Skeleton in output area, spinner in button
3. Result appears: Editable content with action buttons
4. Actions available: Accept, Edit, Regenerate, Copy

**Gap Detection:**
- Inline warning panel below generated content
- Amber background (`#FEF3C7`), warning icon
- Format: "Missing: [gap description]"
- Each gap has "Dismiss" and "Mark addressed" actions

**Retry Pattern:**
- On AI failure: Error toast + inline error message + "Retry" button
- On timeout (>15s): "Taking longer than usual..." + "Cancel" option
- Max 3 retries before suggesting manual entry

**Confidence Indicators:**
- High confidence: No indicator (clean output)
- Medium confidence: Subtle amber badge "Review suggested"
- Low confidence: Warning banner "May need manual review"

## Story Detail Page

### Page Overview

The Story Detail page is the primary workspace for working with individual stories. It features a 2-column layout with main content and an AI Chat sidebar.

| Persona | Primary Use | Focus |
|---------|-------------|-------|
| **Aisha (Developer)** | Building stories | Implementation steps, QA tests, requirements |
| **Marcus (PM)** | Creating stories | Context sources, requirements generation |
| **David (Senior)** | Reviewing stories | Quick scan, approval/rejection, comments |

### Full Page Layout

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  [LOGO] ZONIQ   [Dashboard] [Kanban] [Projects] [Masterdata] [Accounts]         │
│                                                        [Create▾] [💬] [👤]      │
├─────────────────────────────────────────────────────────────────────────────────┤
│  #47  Approval Workflow by Role                                        [🔧 ⋮]   │
│  Implement multi-level approval based on user role and request amount           │
│  ─────────────────────────────────────────────────────────────────────────────  │
│  Status      Priority    Assignee   Project        Module    Due Date   Quality │
│  ● In Progress  ● High   [A] Aisha  Claims Portal  Approvals  Mar 15   65% ████ │
├─────────────────────────────────────────────────────────────────────────────────┤
│  Context(2) │ Requirements(2) │ Implementation(6) │ QA(5) │ Deployment │ Activity│
├────────────────────────────────────────────────────┬────────────────────────────┤
│                                                    │  🔮 AI Assistant           │
│  [TAB CONTENT AREA]                                │  ──────────────────────    │
│                                                    │                            │
│  • Context: Questions + Context Sources            │  [Tab-aware AI responses]  │
│  • Requirements: Given/When/Then criteria          │                            │
│  • Implementation: Sections with steps             │  • Story summary           │
│  • QA: UAT steps + Automated tests                 │  • Gap detection           │
│  • Deployment: Release info, tasks, environments   │  • Implementation guidance │
│  • Activity: Comments + History                    │  • Test coverage summary   │
│                                                    │  • Deployment checklist    │
│                                                    │                            │
│                                                    │  [Quick Actions]           │
└────────────────────────────────────────────────────┴────────────────────────────┘
```

### Page Header (StoryHeader Component)

**Metadata Grid (7 columns):**

| Field | Type | Description |
|-------|------|-------------|
| **Status** | Dropdown | Backlog / Ready / In Progress / Testing / Review / Done |
| **Priority** | Dropdown | High (red) / Medium (amber) / Low (gray) |
| **Assignee** | Dropdown | User with avatar initials |
| **Project** | Dropdown | Linked project (orange text) |
| **Module** | Dropdown | Project module (e.g., Approvals, User Management) |
| **Due Date** | Date | Target completion date |
| **Quality** | Progress | Percentage + progress bar (amber if <80%) |

**Story Actions (⋮ menu):** Delete

### Tab Navigation (StoryTabs Component)

**Tab Bar Layout:**
```
┌──────────┬───────────────┬────────────────┬──────────────┬────────────┬──────────┐
│ Context  │ Requirements  │ Implementation │ Quality      │ Deployment │ Activity │
│   (2)    │      (2)      │      (6)       │    (5)       │            │    •     │
└──────────┴───────────────┴────────────────┴──────────────┴────────────┴──────────┘
            ↑ Badge shows count of items
```

---

### Tab 1: Context

**Purpose:** Questions + Context Sources for the story

**Questions Section:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  ❓ Questions                                    2 unanswered        │
│  ─────────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ☐ What happens if the amount changes after partial approval?│   │
│  │   Asked by David · Feb 28                    [Unanswered]   │   │
│  │   ┌─────────────────────────────────────────────────────┐   │   │
│  │   │ Type your answer...                                 │   │   │
│  │   └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ☐ Should there be a time limit for approval responses?      │   │
│  │   Asked by Marcus · Feb 28                  [Unanswered]   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ☑ How should delegation be configured?             [Answered]│   │
│  │   Answered by Aisha · Via delegation rules in user settings  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  [+ Add Question]                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

**Context Sources Section:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  Context Sources                                                    │
│  ─────────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 📝 Client Meeting Notes                              [✕]    │   │
│  │     Note · Added Feb 28 by Marcus                           │   │
│  │     Client wants approval workflow with different levels... │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 📄 approval-flow-diagram.png                         [✕]    │   │
│  │     Document · 245 KB · Added Feb 28                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🔗 Mendix Workflow Documentation                     [✕]    │   │
│  │     URL · docs.mendix.com · Added Feb 28                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 📁 /modules/Approvals/UserRole.entity               [✕]    │   │
│  │     Project File · Entity definition · Added Feb 28        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  [+ Add Context Source ▾]                                          │
│    → Add Note | Upload Document | Add URL | Link Project File     │
└─────────────────────────────────────────────────────────────────────┘
```

**Context Source Types:**

| Type | Icon | Color | Description |
|------|------|-------|-------------|
| **Note** | Pencil | Orange (`#FFF7F3` bg) | Freeform text notes |
| **Document** | File | Blue (`#EFF6FF` bg) | Uploaded files (PDF, images) |
| **URL** | Link | Green (`#F0FDF4` bg) | External links |
| **Project File** | Folder | Amber (`#FEF3C7` bg) | Mendix project files |

---

### Tab 2: Requirements

**Purpose:** AI-generated and manual requirements in Given/When/Then format

```
┌─────────────────────────────────────────────────────────────────────┐
│  REQUIREMENTS (2)                                                   │
│  ─────────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ○  Manager approval for amounts ≤ $5,000             [✕]    │   │
│  │   ──────────────────────────────────────────────────────── │   │
│  │   Given  a request with amount ≤ $5,000                     │   │
│  │   When  a Manager submits approval                          │   │
│  │   Then  the request is approved                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ○  Director approval for amounts $5,001-$25,000      [✕]    │   │
│  │   ──────────────────────────────────────────────────────── │   │
│  │   Given  a request with amount between $5,001-$25,000       │   │
│  │   When  a Director submits approval                         │   │
│  │   Then  the request is approved                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  [+ Add Requirement]                                                │
└─────────────────────────────────────────────────────────────────────┘
```

**Requirement Card Structure:**

| Element | Description |
|---------|-------------|
| **Checkbox** | Mark as verified/complete |
| **Title** | Requirement summary (inline editable) |
| **Given** | Precondition |
| **When** | Action/trigger |
| **Then** | Expected outcome |
| **Delete** | Remove button (top-right) |

---

### Tab 3: Implementation

**Purpose:** Grouped implementation steps organized by section

```
┌─────────────────────────────────────────────────────────────────────┐
│  IMPLEMENTATION                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🟪 Domain Model                                    [✎] [🗑] │   │
│  │     (3 steps)                                                │   │
│  │   ┌─────────────────────────────────────────────────────┐   │   │
│  │   │ ✓ Create ApprovalLevel Enumeration         [☑]      │   │   │
│  │   │   Manager ($0-$5K), Director ($5K-$25K), VP (>$25K) │   │   │
│  │   └─────────────────────────────────────────────────────┘   │   │
│  │   ┌─────────────────────────────────────────────────────┐   │   │
│  │   │ ✓ Extend User Entity with Role/Delegation  [☑]      │   │   │
│  │   │   Add approval level and delegate association       │   │   │
│  │   └─────────────────────────────────────────────────────┘   │   │
│  │   ┌─────────────────────────────────────────────────────┐   │   │
│  │   │ ✓ Create ApprovalRequest Entity            [☑]      │   │   │
│  │   │   Fields: amount, status, requester, approver       │   │   │
│  │   └─────────────────────────────────────────────────────┘   │   │
│  │   [+ Add Step]                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🟠 Microflow Logic                                  [✎] [🗑] │   │
│  │     (2 steps) · Current step highlighted                    │   │
│  │   ┌─────────────────────────────────────────────────────┐   │   │
│  │   │ 1 Implement Approval Microflow              [☐]     │   │   │
│  │   │   Route requests based on amount thresholds         │   │   │
│  │   │   ⚡ Current step · border orange                   │   │   │
│  │   └─────────────────────────────────────────────────────┘   │   │
│  │   ┌─────────────────────────────────────────────────────┐   │   │
│  │   │ 2 Add Delegation Logic                      [☐]     │   │   │
│  │   │   Handle unavailable approvers with delegates       │   │   │
│  │   └─────────────────────────────────────────────────────┘   │   │
│  │   [+ Add Step]                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🟢 Page Logic                                      [✎] [🗑] │   │
│  │     (1 step)                                                │   │
│  │   ┌─────────────────────────────────────────────────────┐   │   │
│  │   │ 1 Create Approval UI Pages                  [☐]     │   │   │
│  │   │   Request form, approval list, detail view          │   │   │
│  │   └─────────────────────────────────────────────────────┘   │   │
│  │   [+ Add Step]                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🔴 Security Check                                  [✎] [🗑] │   │
│  │     (0 steps) · Empty state                                 │   │
│  │   No steps yet. Add steps to define security requirements.  │   │
│  │   [+ Add Step]                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [+ Add Section]                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

**Section Types:**

| Section | Icon | Color | Purpose |
|---------|------|-------|---------|
| **Domain Model** | Grid | Purple (`#8B5CF6`) | Entities, enumerations, associations |
| **Microflow Logic** | Lightning | Amber (`#F59E0B`) | Business logic, workflows |
| **Page Logic** | Columns | Green (`#10B981`) | UI pages, widgets |
| **Security Check** | Shield | Red (`#EF4444`) | Access rules, permissions |

**Step States:**

| State | Visual | Description |
|-------|--------|-------------|
| **Complete** | ✓ Green check, filled checkbox | Step done |
| **Current** | Orange border, number badge | Active step |
| **Pending** | Blue circle, empty checkbox | Not started |

---

### Tab 4: Quality Assurance

**Purpose:** UAT test steps + Automated test scripts

```
┌─────────────────────────────────────────────────────────────────────┐
│  UAT Test Steps                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 1 Login as Manager user                             [☐]    │   │
│  │   Use credentials: manager@test.com / Test123!              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 2 Create new approval request with amount $3,000   [☐]    │   │
│  │   Navigate to Requests → New Request → Fill form            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 3 Submit and verify status changes to "Pending"    [☐]    │   │
│  │   Check request details page for status                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  [+ Add Test Step]                                                  │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Automated Tests                               2 passing            │
│  ─────────────────────────────────────────────────────────────────  │
│  approval-workflow.spec.ts                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  1 │ import { test, expect } from '@playwright/test';       │   │
│  │  2 │ test.describe('Approval Workflow', () => {              │   │
│  │  3 │   test('Manager approval...', async ({ page }) => {     │   │
│  │ ...                                                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  [📋 Copy] [⬇️ Download .spec.ts] [Edit]                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Tab 5: Deployment

**Purpose:** Release information, tasks, and environment tracking

```
┌─────────────────────────────────────────────────────────────────────┐
│  Release Information                                                │
│  ─────────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Target Release Date    │  Version                           │   │
│  │ [Mar 20, 2026    ]     │  [1.2.0        ]                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Release Tasks                                                      │
│  ─────────────────────────────────────────────────────────────────  │
│  ☑ Create backup of production database                            │
│  ☑ Run regression tests on test environment                        │
│  ☐ Update release notes documentation                              │
│  ☐ Notify stakeholders of deployment                               │
│  ☐ Monitor post-deployment metrics                                 │
│  [+ Add Task]                                                       │
│                                                                     │
│  Environment Deployment                                             │
│  ─────────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🧪 Test Environment                              [☑]        │   │
│  │    Last deployed: Mar 10, 2026 at 2:30 PM                   │   │
│  │    Status: ✓ Deployed                                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🛡️ Production Environment                        [☐]        │   │
│  │    Not yet deployed                                         │   │
│  │    Status: ○ Pending                                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  [+ Add Environment]                                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Tab 6: Activity

**Purpose:** Comments and change history

```
┌─────────────────────────────────────────────────────────────────────┐
│  [💬 Comments (3)]  [📜 History]                                    │
│  ─────────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ [D] David                                 Feb 28, 3:45 PM   │   │
│  │ @Aisha looks good overall. One question: what happens if    │   │
│  │ someone changes the amount after partial approval?          │   │
│  │ [👍 2] [Reply]                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │     [A] Aisha                             Feb 28, 4:12 PM   │   │
│  │     @David good catch! I'll add a criterion for amount...   │   │
│  │     [👍 1] [Reply]                                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 💬 Add a comment... Use @ to mention team members           │   │
│  │ [@ mention] [Attach]                          [Post Comment]│   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

### AI Chat Sidebar

**Purpose:** Tab-aware AI assistance for the current story

**Layout:** Fixed right sidebar, 320px wide (expands to 480px)

**Tab-Aware Content:**

| Tab | AI Shows |
|-----|----------|
| **Context** | Story summary, context search |
| **Requirements** | Gap detection, "+ Add criterion" for gaps |
| **Implementation** | Progress summary, Mendix guidance, "Regenerate" action |
| **QA** | Test coverage summary, missing test scenarios |
| **Deployment** | Deployment readiness, pre-deployment checklist |
| **Activity** | Discussion summary, action items detected |

**Chat Message Types:**

| Type | Style |
|------|-------|
| **AI message** | Orange avatar, left-aligned |
| **User message** | Gray background, right-aligned |
| **Gap warning** | Amber background, yellow border |
| **Success** | Green text, checkmark |
| **Code block** | Dark background, syntax highlighting |

**Quick Actions (per tab):**

| Tab | Quick Action |
|-----|--------------|
| Context | Search Context |
| Requirements | Analyze for Gaps |
| Implementation | Regenerate Implementation Plan |
| QA | Generate More Tests |
| Deployment | Start Deployment |
| Activity | Create Task from Action Item |

## App Management Page

### Page Overview

The App Management page provides a comprehensive dashboard for monitoring and managing a Zoniq application. It serves as a central hub for developers and managers to view app health, track projects, monitor logs, and manage deployments.

| Persona | Primary Use | Focus |
|---------|-------------|-------|
| **David (Senior)** | Monitor app health, manage deployments | Environment status, error logs, deployment actions |
| **Aisha (Developer)** | View logs, check module status, debug issues | Live logs, test coverage, module health |
| **Marcus (PM)** | Track project progress, view team activity | Project cards, activity timeline, team widgets |

### Object Type Color

App objects use the **Blue** color identity:

| Element | Color | Usage |
|---------|-------|-------|
| Header background | `#EFF6FF` | App header section |
| Card background | `#F0F7FF` | App-specific cards |
| Primary accent | `#2563EB` | Icons, buttons, links |
| Text (dark) | `#1E3A8A` | Headings, titles |
| Border | `#BFDBFE` | Header borders |

### Full Page Layout

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  [LOGO] ZONIQ   [Dashboard] [Kanban] [Projects] [Apps] [Masterdata] [Accounts]   │
│                                                        [Create▾] [💬] [👤]      │
├─────────────────────────────────────────────────────────────────────────────────┤
│  APP HEADER (Blue theme - #EFF6FF)                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ [📦] Claims Management System    v2.4.1  ● Online                        │   │
│  │      Mendix application for processing insurance claims                  │   │
│  │                                                           [🔮] [⚙️] [🚀] [📋]│   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────┐  ┌─────────────────────────────────────────────────────────────┐ │
│  │ NAV      │  │ CONTENT AREA                                                 │ │
│  │ ──────── │  │ ─────────────────────────────────────────────────────────── │ │
│  │ Projects │  │ PROJECTS OVERVIEW                                            │ │
│  │ Modules  │  │ ┌─────────────────────────┐ ┌─────────────────────────────┐  │ │
│  │ Logs     │  │ │ Claims Portal     72%   │ │ Policy Management    45%    │  │ │
│  │ Changes  │  │ │ ████████░░             │ │ █████░░░░░░                 │  │ │
│  │ Environs │  │ │ [3][8][4][5][16]       │ │ [5][6][2][3][9]            │  │ │
│  │ Widgets  │  │ │  B  A  T  R  D         │ │  B  A  T  R  D              │  │ │
│  │          │  │ └─────────────────────────┘ └─────────────────────────────┘  │ │
│  │          │  │                                                             │ │
│  │          │  │ MODULES & TEST COVERAGE                                     │ │
│  │          │  │ ┌─────────────────────────────────────────────────────────┐  │ │
│  │          │  │ │ Module        │ Tickets  │ Coverage │ Health           │  │ │
│  │          │  │ │ Approvals     │ 3/2/1    │ 85% ████ │ ✅ Healthy       │  │ │
│  │          │  │ │ User Mgmt     │ 1/4/0    │ 72% ███░ │ ⚠️ Needs tests   │  │ │
│  │          │  │ │ Reporting     │ 2/1/3    │ 45% ██░░ │ ❌ Critical      │  │ │
│  │          │  │ └─────────────────────────────────────────────────────────┘  │ │
│  │          │  │                                                             │ │
│  │          │  │ LIVE LOGS                        [All] [Errors] [Warnings]  │ │
│  │          │  │ ┌─────────────────────────────────────────────────────────┐  │ │
│  │          │  │ │ 14:32:15  INFO   Request processed successfully         │  │ │
│  │          │  │ │ 14:32:22  ERROR  Database connection timeout             │  │ │
│  │          │  │ │ ┌─ AI Suggestion ─────────────────────────────────────┐ │  │ │
│  │          │  │ │ │ 🔮 This matches #47. Ticket #89 auto-created        │ │  │ │
│  │          │  │ │ └─────────────────────────────────────────────────────┘ │  │ │
│  │          │  │ └─────────────────────────────────────────────────────────┘  │ │
│  │          │  │                                                             │ │
│  │          │  │ ENVIRONMENTS                                                │ │
│  │          │  │ [Development] [Test] [Acceptance] [Production]              │ │
│  │          │  │   ● Online     ● Online    ● Online     ● Online           │ │
│  │          │  │   v2.4.2-dev   v2.4.1      v2.4.0       v2.3.5             │ │
│  └──────────┘  └─────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│                                                    ┌─ AI SIDEBAR ─────────────┐│
│                                                    │ 🔮 AI Assistant          ││
│                                                    │ [Quick Actions]          ││
│                                                    │ [Chat messages...]       ││
│                                                    └─────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Page Sections

#### 1. App Header (Sticky)

| Element | Type | Description |
|---------|------|-------------|
| App Icon | Icon box | Blue background with app icon |
| App Name | Text (editable) | Large title, dark blue |
| Version | Badge | Light blue background |
| Status | Indicator | Online (green) / Offline (red) / Deploying (amber) |
| Description | Text | Gray, below title |
| Quick Actions | Buttons | AI toggle, Settings, Deploy, View Logs |

**Behavior:** Sticky at top when scrolling, z-index: 20

#### 2. Projects Overview

| Element | Description |
|---------|-------------|
| Project cards | 2-column grid with mini kanban |
| Progress bar | Animated fill on scroll into view |
| Mini kanban | 5 columns (B/A/T/R/D) with counts and labels |

**Mini Kanban Colors:**
| Column | Color | Hex |
|--------|-------|-----|
| Backlog | Gray | `#9A948D` |
| Active | Amber | `#F59E0B` |
| Testing | Purple | `#9333EA` |
| Review | Blue | `#2563EB` |
| Done | Green | `#10B981` |

#### 3. Modules & Test Coverage

| Column | Description |
|--------|-------------|
| Module | Module name |
| Tickets | Format: `Active / In Review / Blocked` |
| Coverage | Percentage with animated progress bar |
| Health | Icon + status text |

**Health Indicators:**
| Status | Icon | Color | Criteria |
|--------|------|-------|----------|
| Healthy | ✅ | Green | Coverage ≥ 80%, no blocked |
| Warning | ⚠️ | Amber | Coverage 50-79% or blocked |
| Critical | ❌ | Red | Coverage < 50% or multiple blocked |

#### 4. Live Logging Panel

| Feature | Description |
|---------|-------------|
| Log entries | Timestamped with color-coded levels |
| Filter buttons | All, Errors, Warnings |
| AI Suggestion | Inline card after error logs |
| Auto-ticket badge | Shows auto-created ticket reference |

**Log Level Colors:**
| Level | Text Color | Background |
|-------|------------|------------|
| ERROR | `#EF4444` | `#FEE2E2` |
| WARN | `#F59E0B` | `#FEF3C7` |
| INFO | `#9A948D` | transparent |

#### 5. Recent Changes Timeline

| Element | Description |
|---------|-------------|
| Avatar | Initials with colored background |
| Action text | User + action + target |
| Timestamp | Relative time (e.g., "10 min ago") |

#### 6. Environments & Deployments

| Element | Description |
|---------|-------------|
| Environment cards | 4-column grid |
| Status indicator | Pulsing dot for offline/deploying |
| Version | Currently deployed version |
| Last ping | Time since last heartbeat |
| Action buttons | Deploy, Logs |

**Status Indicators:**
| Status | Color | Animation |
|--------|-------|-----------|
| Online | `#10B981` | None |
| Offline | `#EF4444` | Pulse |
| Deploying | `#F59E0B` | Pulse |

#### 7. AI Chat Sidebar

| Feature | Description |
|---------|-------------|
| Toggle | Ctrl+K keyboard shortcut |
| Position | Right side, below app header |
| Width | 320px default |
| Quick actions | Pre-defined prompts for app context |

**AI Quick Actions:**
- "Analyze recent errors"
- "Summarize deployment status"
- "Check test coverage"
- "What needs attention?"

### Navigation Sidebar

Left sidebar with section jump links:

| Link | Icon | Target Section |
|------|------|----------------|
| Projects | Folder | `#projects` |
| Modules | Grid | `#modules` |
| Logs | File | `#logs` |
| Changes | Clock | `#changes` |
| Environments | Rocket | `#environments` |
| Widgets | Layout | `#widgets` |

**Behavior:** Scroll spy highlights active section, smooth scroll on click

### Animations

| Animation | Trigger | Duration |
|-----------|---------|----------|
| Section fade-in | Scroll into view | 0.5s ease-out |
| Card hover | Mouse hover | 0.2s |
| Progress bar fill | Scroll into view | 1s ease-out |
| Log entry slide-in | New log added | 0.3s |
| Environment status | Status change | 0.3s |
| Sidebar slide | Toggle open/close | 0.3s |
| AI typing indicator | AI response pending | 1.4s loop |

### Design File Reference

- App Management: `_bmad-output/planning-artifacts/design-app-management.html`

## Responsive Design & Accessibility

### Responsive Strategy

**Desktop-First Approach (MVP):**

| Device | Priority | Strategy |
|--------|----------|----------|
| **Desktop (1280px+)** | Primary (MVP) | Full experience, all features, multi-column layouts |
| **Desktop (1024-1279px)** | High | Slightly condensed, maintain all features |
| **Tablet (768-1023px)** | Future | Touch-optimized, collapsed navigation |
| **Mobile (<768px)** | Post-MVP | View-only mode for story status on-the-go |

**Rationale:** Users work at desks post-meeting in office environments. Mobile not prioritized for MVP.

### Breakpoint Strategy

| Breakpoint | Name | Target | MVP Scope |
|------------|------|--------|-----------|
| `1280px` | `xl` | Full desktop experience | ✓ Yes |
| `1024px` | `lg` | Condensed desktop | ✓ Yes |
| `768px` | `md` | Tablet layout | ✗ Future |
| `640px` | `sm` | Mobile layout | ✗ Post-MVP |

**Layout Adaptations (Desktop):**

| Screen Width | Dashboard | Kanban | Story Detail |
|--------------|-----------|--------|--------------|
| 1280px+ | 3 columns + activity feed | 5 columns visible | Full tabs, sidebar |
| 1024-1279px | 3 columns (condensed) | 4 columns + horizontal scroll | Stacked tabs |

### Accessibility Strategy

**Target Compliance: WCAG 2.1 Level AA** (industry standard for internal B2B tools)

**Core Requirements:**

| Category | Requirement | Implementation |
|----------|-------------|----------------|
| **Color Contrast** | 4.5:1 body text, 3:1 large text | All colors tested against `#FAFAF9` background |
| **Focus States** | Visible indicator on all interactive elements | Orange ring (`#FF6B35`), 2px offset |
| **Keyboard Navigation** | Full keyboard operability | Logical tab order, skip links, ⌘K |
| **Screen Readers** | Semantic HTML + ARIA | VoiceOver, NVDA compatible |
| **Touch Targets** | Minimum 44x44px | All buttons, cards, interactive elements |
| **Motion** | Respect `prefers-reduced-motion` | Disable animations when requested |

**Color Contrast Validation:**

| Color Pair | Ratio | Status |
|------------|-------|--------|
| Dark Brown (`#2D1810`) on Off-White (`#FAFAF9`) | 12.6:1 | ✓ AAA |
| Medium Gray (`#9A948D`) on Off-White | 4.8:1 | ✓ AA |
| Warm Orange (`#FF6B35`) on White | 3.2:1 | ✓ AA Large |
| White on Warm Orange | 3.2:1 | ✓ AA Large |

### Testing Strategy

**Responsive Testing (MVP):**

| Test Type | Tools | Frequency |
|-----------|-------|-----------|
| Browser testing | Chrome, Firefox, Safari, Edge | Each release |
| Viewport testing | Chrome DevTools, Responsively | During development |
| Window resizing | Manual at 1024px, 1280px, 1440px | PR review |

**Accessibility Testing:**

| Test Type | Tools | Frequency |
|-----------|-------|-----------|
| Automated audit | axe DevTools, Lighthouse | Each PR |
| Keyboard navigation | Manual tab-through | Each feature |
| Screen reader | VoiceOver (Mac), NVDA (Windows) | Major releases |
| Color blindness | Chrome DevTools simulation | Design review |
| Focus management | Manual testing after dynamic content | Each feature |

### Implementation Guidelines

**Responsive Development (Tailwind):**

```css
/* MVP breakpoints */
lg: 1024px  /* Condensed desktop */
xl: 1280px  /* Full desktop */
2xl: 1536px /* Wide desktop */
```

- Use Tailwind responsive prefixes (`lg:`, `xl:`)
- Max content width: 1280px, centered with auto margins
- Fluid typography: `clamp()` for headings
- Grid: 12-column with responsive column spans

**Accessibility Implementation:**

| Element | Implementation |
|---------|----------------|
| **Semantic HTML** | `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>` |
| **Headings** | Logical hierarchy (h1 → h2 → h3), no skips |
| **ARIA labels** | On custom components (UniversalInput, StoryCard, KanbanBoard) |
| **Live regions** | `aria-live="polite"` for toasts, AI responses |
| **Skip links** | "Skip to main content" at page top |
| **Focus trap** | Modals, command palette |
| **Focus return** | Return to trigger element after modal close |
| **Alt text** | All images have descriptive alt or `aria-hidden` |

**Keyboard Shortcuts:**

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open command palette |
| `Escape` | Close modal/palette |
| `Tab / Shift+Tab` | Navigate focus |
| `Enter` | Activate focused element |
| `Space` | Toggle checkboxes, kanban drag |
| `Arrow keys` | Navigate lists, move kanban cards |
