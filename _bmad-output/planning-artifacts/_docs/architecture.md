---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/product-brief-BMAD Zoniq-2026-02-26.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
workflowType: 'architecture'
project_name: 'BMAD Zoniq'
user_name: 'David'
date: 2026-02-27
lastStep: 8
status: 'complete'
completedAt: '2026-03-03'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
121 functional requirements organized into 14 major categories:
- Authentication & User Management (FR1-FR6)
- Project & Customer Management (FR7-FR12)
- Story Management (FR13-FR18)
- AI Generation - Notes to Acceptance Criteria (FR19-FR23)
- AI Generation - Gap Analysis (FR24-FR26)
- AI Generation - Development Plan (FR27-FR30)
- AI Generation - Test Scripts (FR31-FR34)
- Review Workflow (FR35-FR38)
- Kanban Board (FR39-FR42)
- App Management (FR43-FR82)
- Project Management (FR83-FR112)
- Context Library (FR113-FR117)
- Floating AI Assistant (FR118-FR121)

**Non-Functional Requirements:**
- Performance: AI generation <10s, page load <2s, 20 concurrent users
- Security: Encryption at rest/transit, secure passwords, RBAC, session management
- Reliability: 90%+ uptime, graceful AI failure handling, daily backups
- Integration: AI provider abstraction, 30s API timeouts, provider swap support

**Scale & Complexity:**

| Attribute | Assessment |
|-----------|------------|
| Primary domain | Full-stack web application |
| Complexity level | Medium |
| Estimated architectural components | 8-12 major components |

### Technical Constraints & Dependencies

| Constraint | Impact |
|------------|--------|
| Chinese Big Model as MVP AI provider | Requires provider abstraction from day one |
| Greenfield project | No legacy constraints, modern stack possible |
| Desktop-first (MVP) | Focus on 1024px+ viewports |
| Internal tool (MVP) | 90% uptime acceptable, single-tenant initially |

### Cross-Cutting Concerns Identified

| Concern | Affected Components |
|---------|---------------------|
| **AI Provider Abstraction** | All generation features, test scripts, gap analysis |
| **Authentication & Authorization** | All API endpoints, UI components, data access |
| **Real-time Updates** | Live logs, activity feeds, AI chat |
| **Audit Logging** | Story changes, AI generations, user actions |
| **File Attachments** | Stories, context sources, project files |
| **Error Handling & Retry** | AI generation, API calls, file uploads |

## Starter Template Evaluation

### Primary Technology Domain

**Full-stack web application** based on project requirements analysis.

### Starter Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **create-next-app** (Official) | Matches UX spec exactly, minimal, maximum flexibility | Manual setup for shadcn/ui, auth, database, React Flow |
| **create-t3-app** | Batteries-included (tRPC, Prisma, Tailwind) | Opinionated stack may conflict with UX spec choices |

### Selected Starter: create-next-app

**Rationale for Selection:**
- UX specification explicitly documents this approach
- Maximum flexibility for custom design system
- Team familiarity with Next.js ecosystem
- Allows incremental adoption of additional libraries

**Initialization Command:**

```bash
npx create-next-app@latest zoniq \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --turbopack \
  --import-alias "@/*"
```

**Post-Install Setup:**

```bash
cd zoniq

# Initialize shadcn/ui
npx shadcn@latest init

# Add React Flow for workflow diagrams (FR99-FR103)
npm install @xyflow/react
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript 5.x with strict mode
- React 19.x with App Router
- Node.js runtime for API routes

**Styling Solution:**
- Tailwind CSS 4.x with PostCSS
- CSS variables for theming
- Custom Zoniq palette (from UX spec)

**Build Tooling:**
- Turbopack (dev), Webpack (prod)
- ESLint 9.x for code quality
- Import alias `@/*` → `./src/*`

**Additional Libraries (Post-Install):**

| Library | Purpose | Requirement |
|---------|---------|-------------|
| `shadcn/ui` | Component library | UX spec |
| `@xyflow/react` | Visual workflow diagrams | FR99-FR103 |
| `framer-motion` | Animations (FAB, transitions) | UX spec |
| `react-hook-form` | Complex forms | UX spec |

**Note:** Project initialization using these commands should be the first implementation story.

## Core Architectural Decisions

### Category 1: Data Layer

| Decision | Choice | Version |
|----------|--------|---------|
| **Database** | PostgreSQL | 16.x |
| **ORM** | Drizzle ORM | 0.36.x |
| **Migrations** | Drizzle Kit | 0.28.x |

**Rationale:**
- Zero runtime overhead (no Prisma engine) - keeps app fast
- SQL-like TypeScript API - familiar for team
- Type-safe with inference
- Works with Neon/Supabase for easy deployment

**Connection Pattern:**
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client);
```

---

### Category 2: Authentication & Security

| Decision | Choice | Version |
|----------|--------|---------|
| **Authentication** | Clerk | 5.x |
| **Session Management** | Clerk (built-in) | - |
| **RBAC** | Clerk Organizations + custom roles | - |

**Rationale:**
- RBAC built-in with organizations (matches Admin/PM/Consultant roles)
- Session management handled automatically
- Self-hosted option available (no vendor lock-in)
- Future SSO integration support

**Role Mapping:**
| Zoniq Role | Clerk Role |
|------------|------------|
| Admin | org:admin |
| PM | org:pm |
| Consultant | org:member |

---

### Category 3: Real-time Communication

| Decision | Choice | Version |
|----------|--------|---------|
| **Pattern** | Server-Sent Events (SSE) | Native |
| **Transport** | HTTP streaming | - |

**Rationale:**
- Simpler than WebSockets for server-push scenarios
- Works through firewalls/proxies
- Native browser support
- Sufficient for live logs and activity feeds

**Use Cases:**
- Live log streaming (FR75-FR78)
- Activity feed updates (FR41, FR121)
- AI chat streaming responses

---

### Category 4: AI Integration

| Decision | Choice | Version |
|----------|--------|---------|
| **AI SDK** | Vercel AI SDK | 4.x |
| **Provider (MVP)** | Chinese Big Model | - |
| **Provider (Post-MVP)** | Anthropic Claude | - |

**Rationale:**
- Unified API for all AI providers (easy swap)
- Streaming responses built-in
- TypeScript-first design
- Works with Next.js App Router

**Abstraction Pattern:**
```typescript
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

function getActiveProvider() {
  const provider = process.env.AI_PROVIDER;
  if (provider === 'anthropic') {
    return anthropic('claude-sonnet-4-20250514');
  }
  return createOpenAI({
    apiKey: process.env.BIGMODEL_API_KEY,
    baseURL: process.env.BIGMODEL_BASE_URL,
  })('bigmodel-model');
}

export async function generateAcceptanceCriteria(notes: string) {
  return generateText({
    model: getActiveProvider(),
    prompt: `Convert these notes to acceptance criteria: ${notes}`,
  });
}
```

**Configuration:**
```env
AI_PROVIDER=bigmodel
BIGMODEL_API_KEY=xxx
BIGMODEL_BASE_URL=https://api.bigmodel.cn
# AI_PROVIDER=anthropic  # Post-MVP
# ANTHROPIC_API_KEY=xxx
```

---

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 5 areas where AI agents could make different choices

### Naming Patterns

**Database Naming Conventions (Drizzle ORM):**

| Element | Pattern | Example |
|---------|---------|---------|
| Table names | `snake_case`, plural | `users`, `stories`, `projects` |
| Column names | `snake_case` | `user_id`, `created_at`, `is_active` |
| Foreign keys | Same as referenced column | `user_id` → references `users.id` |
| Indexes | `idx_{table}_{columns}` | `idx_stories_project_id` |
| Primary keys | `id` (singular) | `id` UUID or serial |

**API Naming Conventions (Next.js App Router):**

| Element | Pattern | Example |
|---------|---------|---------|
| REST endpoints | Plural nouns | `/api/stories`, `/api/projects` |
| Nested resources | Parent/child | `/api/projects/[id]/stories` |
| Route params | `[id]`, `[slug]` | `/stories/[id]` |
| Query params | `camelCase` | `?projectId=123&status=active` |

**Code Naming Conventions:**

| Element | Pattern | Example |
|---------|---------|---------|
| React components | `PascalCase.tsx` | `StoryCard.tsx`, `KanbanBoard.tsx` |
| Component folders | `kebab-case/` | `story-card/`, `kanban-board/` |
| Utilities | `camelCase.ts` | `formatDate.ts`, `cn.ts` |
| Hooks | `use{Purpose}` | `useStories`, `useAI` |
| Types/Interfaces | `PascalCase` | `Story`, `Project`, `CreateStoryInput` |
| Constants | `SCREAMING_SNAKE` | `MAX_RETRIES`, `DEFAULT_PAGE_SIZE` |

### Structure Patterns

**Project Organization (Next.js App Router):**

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Clerk auth group routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/         # Authenticated routes group
│   │   ├── dashboard/
│   │   ├── kanban/
│   │   ├── projects/
│   │   ├── apps/
│   │   └── stories/
│   ├── api/                 # API routes
│   │   ├── stories/
│   │   ├── projects/
│   │   ├── ai/              # AI generation endpoints
│   │   └── webhooks/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                  # shadcn/ui components (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── features/             # Feature-specific components
│       ├── story-card/
│       ├── kanban-board/
│       └── ai-chat-sidebar/
├── lib/
│   ├── db/                   # Drizzle ORM
│   │   ├── schema.ts         # All table definitions
│   │   ├── index.ts          # Database client
│   │   └── queries/          # Typed query functions
│   ├── ai/                   # AI provider abstraction
│   │   ├── providers/
│   │   │   ├── bigmodel.ts
│   │   │   └── anthropic.ts
│   │   └── index.ts          # Provider factory
│   ├── auth/                 # Clerk helpers
│   └── utils/                # Shared utilities
│       ├── cn.ts             # Tailwind class merge
│       └── format.ts         # Date/formatting
├── hooks/                    # Custom React hooks
│   ├── use-stories.ts
│   ├── use-ai-generation.ts
│   └── use-realtime.ts
└── types/                   # TypeScript type definitions
    ├── api.ts               # API request/response types
    ├── entities.ts          # Database entity types
    └── ai.ts                # AI generation types
```

### Format Patterns

**API Response Formats:**

```typescript
// Success Response
interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
}

// Error Response
interface ApiError {
  error: {
    code: string;        // e.g., "VALIDATION_ERROR", "NOT_FOUND"
    message: string;     // User-friendly message
    details?: unknown;   // Additional context (validation errors, etc.)
  };
}

// Example: Single item
{ data: { id: "123", title: "Story" } }

// Example: Paginated list
{ 
  data: [...stories], 
  meta: { page: 1, pageSize: 20, total: 100 } 
}
```

**Data Exchange Formats:**

| Element | Format | Example |
|---------|--------|---------|
| JSON fields | `camelCase` | `{ "projectId": "123" }` |
| Dates | ISO 8601 string | `"2026-02-27T10:30:00Z"` |
| Booleans | `true`/`false` | `{ "isActive": true }` |
| Null values | `null` (not omitted) | `{ "description": null }` |
| IDs | UUID v4 string | `"550e8400-e29b-41d4-a716-446655440000"` |

### Communication Patterns

**Event System (SSE for real-time):**

| Event | Naming | Payload Structure |
|-------|--------|-------------------|
| Log stream | `log.created` | `{ id, level, message, timestamp }` |
| Activity feed | `activity.created` | `{ id, type, userId, createdAt }` |
| Story update | `story.updated` | `{ id, changes, updatedBy }` |
| AI generation | `ai.generation.complete` | `{ id, type, result }` |

**State Management (React):**

```typescript
// Server state: TanStack Query (React Query)
const { data, isLoading, error } = useQuery({
  queryKey: ['stories', projectId],
  queryFn: () => fetchStories(projectId),
});

// Local UI state: React useState
const [isSidebarOpen, setIsSidebarOpen] = useState(false);

// Form state: React Hook Form
const { register, handleSubmit, formState: { errors } } = useForm();
```

### Process Patterns

**Error Handling:**

| Error Type | Handling | User Feedback |
|------------|----------|---------------|
| API errors | Catch in query/mutation | Toast notification (Sonner) |
| Validation | React Hook Form + Zod | Inline field errors |
| AI generation | Retry with exponential backoff (max 3) | "Retry" button + error message |
| Unexpected | Error boundary | Fallback UI + "Report issue" |
| Network | Detect offline state | Banner + auto-retry on reconnect |

**Loading States:**

```typescript
// Query loading
{ isLoading: true } → Show skeleton
{ isFetching: true } → Keep content, show subtle indicator

// Mutation loading
{ isPending: true } → Disable button, show spinner

// Skeleton pattern
<Skeleton className="h-24 w-full" />
```

### Enforcement Guidelines

**All AI Agents MUST:**

1. Use snake_case for database schema, camelCase for TypeScript/JSON
2. Place components in `components/features/{feature-name}/`
3. Wrap all API responses in `{ data, meta? }` or `{ error }` format
4. Use ISO 8601 dates everywhere (no timestamps)
5. Handle loading states with skeletons, not just spinners
6. Use Zod for all input validation
7. Never expose raw errors to users - always provide friendly messages

**Pattern Verification:**

- ESLint rules enforce naming conventions (to be configured)
- TypeScript strict mode catches type mismatches
- PR reviews verify pattern compliance
- Shared types prevent API contract drift

### Pattern Examples

**Good Examples:**

```typescript
// ✅ Correct API response
return Response.json({ data: story });

// ✅ Correct component file
// components/features/story-card/story-card.tsx

// ✅ Correct database query
await db.select().from(stories).where(eq(stories.projectId, projectId));

// ✅ Correct error handling
catch (error) {
  toast.error("Failed to create story. Please try again.");
  console.error("Story creation failed:", error);
}
```

**Anti-Patterns:**

```typescript
// ❌ Wrong: snake_case in TypeScript/JSON
{ story_id: "123" }  // Should be storyId

// ❌ Wrong: Unwrapped response
return Response.json(story);  // Should wrap in { data: story }

// ❌ Wrong: Timestamp instead of ISO string
createdAt: 1709030400  // Should be ISO 8601

// ❌ Wrong: Exposing raw error
toast.error(error.message);  // Should be user-friendly
```

## Project Structure & Boundaries

### Complete Project Directory Structure

```
zoniq/
├── README.md
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── drizzle.config.ts
├── components.json                    # shadcn/ui config
├── .env.local
├── .env.example
├── .gitignore
├── .eslintrc.json
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── src/
│   ├── app/                            # Next.js App Router
│   │   ├── globals.css                 # Tailwind + CSS variables
│   │   ├── layout.tsx                  # Root layout with ClerkProvider
│   │   ├── page.tsx                    # Home/redirect
│   │   │
│   │   ├── (auth)/                     # Clerk auth group
│   │   │   ├── sign-in/[[...sign-in]]/
│   │   │   │   └── page.tsx
│   │   │   └── sign-up/[[...sign-up]]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/                # Protected routes group
│   │   │   ├── layout.tsx              # Dashboard layout with topbar
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx            # FR39-FR42: Home dashboard
│   │   │   ├── kanban/
│   │   │   │   └── page.tsx            # FR39-FR42: Kanban board
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx            # Project list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx        # FR83-FR112: Project details
│   │   │   ├── apps/
│   │   │   │   ├── page.tsx            # App list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx        # FR43-FR82: App management
│   │   │   ├── stories/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx        # FR13-FR38: Story details
│   │   │   ├── context/
│   │   │   │   └── page.tsx            # FR113-FR117: Context library
│   │   │   ├── masterdata/             # Admin only
│   │   │   │   └── page.tsx
│   │   │   └── accounts/               # Admin only
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/                        # API Routes
│   │   │   ├── stories/
│   │   │   │   ├── route.ts            # CRUD stories
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       ├── review/
│   │   │   │       │   └── route.ts    # FR35-FR38
│   │   │   │       └── ai/
│   │   │   │           ├── criteria/
│   │   │   │           │   └── route.ts    # FR19-FR23
│   │   │   │           ├── gaps/
│   │   │   │           │   └── route.ts    # FR24-FR26
│   │   │   │           ├── dev-plan/
│   │   │   │           │   └── route.ts    # FR27-FR30
│   │   │   │           └── tests/
│   │   │   │               └── route.ts    # FR31-FR34
│   │   │   ├── projects/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── apps/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── logs/
│   │   │   │           └── stream/
│   │   │   │               └── route.ts    # FR75-FR78: SSE live logs
│   │   │   ├── context/
│   │   │   │   └── route.ts
│   │   │   ├── ai/
│   │   │   │   └── chat/
│   │   │   │       └── route.ts          # FR118-FR121: AI chat
│   │   │   └── webhooks/
│   │   │       └── clerk/
│   │   │           └── route.ts          # Clerk webhooks
│   │   │
│   │   └── api/trpc/
│   │       └── [trpc]/
│   │           └── route.ts              # Optional: tRPC router
│   │
│   ├── components/
│   │   ├── ui/                          # shadcn/ui (auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── command.tsx
│   │   │   └── ...
│   │   │
│   │   └── features/                    # Feature-specific components
│   │       ├── topbar/
│   │       │   ├── topbar.tsx
│   │       │   ├── nav-item.tsx
│   │       │   ├── create-dropdown.tsx
│   │       │   └── profile-dropdown.tsx
│   │       ├── universal-input/
│   │       │   └── universal-input.tsx
│   │       ├── story-card/
│   │       │   └── story-card.tsx
│   │       ├── kanban-board/
│   │       │   ├── kanban-board.tsx
│   │       │   ├── kanban-column.tsx
│   │       │   └── kanban-card.tsx
│   │       ├── story-detail/
│   │       │   ├── story-header.tsx
│   │       │   ├── story-tabs.tsx
│   │       │   ├── context-tab/
│   │       │   ├── requirements-tab/
│   │       │   ├── implementation-tab/
│   │       │   ├── qa-tab/
│   │       │   ├── deployment-tab/
│   │       │   └── activity-tab/
│   │       ├── ai-chat-sidebar/
│   │       │   └── ai-chat-sidebar.tsx
│   │       ├── floating-ai-fab/
│   │       │   └── floating-ai-fab.tsx
│   │       ├── workflow-diagram/
│   │       │   └── workflow-diagram.tsx  # FR99-FR103: React Flow
│   │       ├── mini-kanban/
│   │       │   └── mini-kanban.tsx
│   │       ├── activity-feed/
│   │       │   └── activity-feed.tsx
│   │       └── live-logs/
│   │           └── live-logs.tsx         # FR75-FR78
│   │
│   ├── lib/
│   │   ├── db/                          # Drizzle ORM
│   │   │   ├── schema.ts                # All table definitions
│   │   │   ├── index.ts                 # Database client
│   │   │   └── queries/
│   │   │       ├── stories.ts
│   │   │       ├── projects.ts
│   │   │       ├── apps.ts
│   │   │       └── users.ts
│   │   ├── ai/                          # AI provider abstraction
│   │   │   ├── providers/
│   │   │   │   ├── bigmodel.ts
│   │   │   │   └── anthropic.ts
│   │   │   ├── index.ts                 # Provider factory
│   │   │   └── prompts/                 # Prompt templates
│   │   │       ├── criteria.ts
│   │   │       ├── dev-plan.ts
│   │   │       └── tests.ts
│   │   ├── auth/                        # Clerk helpers
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── cn.ts                    # Tailwind class merge
│   │       └── format.ts                # Date/formatting
│   │
│   ├── hooks/
│   │   ├── use-stories.ts
│   │   ├── use-projects.ts
│   │   ├── use-ai-generation.ts
│   │   └── use-realtime.ts              # SSE hooks
│   │
│   ├── types/
│   │   ├── api.ts                       # API request/response types
│   │   ├── entities.ts                  # Database entity types
│   │   ├── ai.ts                        # AI generation types
│   │   └── workflow.ts                  # React Flow node types
│   │
│   └── middleware.ts                    # Next.js middleware (Clerk auth)
│
├── drizzle/                             # Drizzle migrations
│   ├── 0000_initial_schema.sql
│   └── meta/
│
├── tests/
│   ├── unit/
│   │   ├── components/
│   │   └── lib/
│   ├── integration/
│   │   └── api/
│   └── e2e/
│       ├── stories.spec.ts
│       ├── ai-generation.spec.ts
│       └── playwright.config.ts
│
└── public/
    ├── favicon.ico
    └── fonts/
        └── manrope/
```

### Architectural Boundaries

**API Boundaries:**

| Boundary | Technology | Purpose |
|----------|------------|---------|
| External API | Next.js API Routes | REST endpoints for client |
| Auth Boundary | Clerk + middleware.ts | Session validation, RBAC |
| AI Provider | Vercel AI SDK abstraction | Provider-agnostic AI calls |
| Database | Drizzle ORM queries | Type-safe data access |

**Component Boundaries:**

| Layer | Responsibility |
|-------|---------------|
| Page Components | Route handling, data fetching |
| Feature Components | UI logic, user interactions |
| UI Components | Pure presentation, no business logic |

### Requirements to Structure Mapping

| FR Category | Components | API Routes | Database |
|-------------|------------|------------|----------|
| **FR1-FR6: Auth** | `middleware.ts`, `(auth)/` | `webhooks/clerk/` | `users` table |
| **FR7-FR12: Projects** | `projects/`, `create-dropdown.tsx` | `/api/projects/` | `projects`, `customers` |
| **FR13-FR18: Stories** | `story-card/`, `story-detail/` | `/api/stories/` | `stories` |
| **FR19-FR34: AI Gen** | `ai-chat-sidebar/`, `universal-input/` | `/api/ai/*` | `ai_generations` |
| **FR35-FR38: Review** | `story-detail/activity-tab/` | `/api/stories/[id]/review` | `reviews` |
| **FR39-FR42: Kanban** | `kanban-board/`, `mini-kanban/` | `/api/stories/` | - |
| **FR43-FR82: Apps** | `apps/`, `live-logs/`, `workflow-diagram/` | `/api/apps/` | `apps`, `modules`, `features` |
| **FR83-FR112: Projects** | `projects/[id]/` | `/api/projects/[id]/` | `project_modules` |
| **FR113-FR117: Context** | `context/` | `/api/context/` | `context_items` |
| **FR118-FR121: FAB** | `floating-ai-fab/`, `ai-chat-sidebar/` | `/api/ai/chat/` | - |

### Integration Points

**Internal Communication:**
- Pages → API Routes via fetch/TanStack Query
- Components → Shared state via React Context (minimal)
- Real-time → SSE streams from `/api/*/stream/`

**External Integrations:**
| Service | Integration Point | Config |
|---------|-------------------|--------|
| Clerk | `middleware.ts`, `ClerkProvider` | `NEXT_PUBLIC_CLERK_*` |
| Big Model | `lib/ai/providers/bigmodel.ts` | `BIGMODEL_API_KEY` |
| Anthropic | `lib/ai/providers/anthropic.ts` | `ANTHROPIC_API_KEY` |
| PostgreSQL | `lib/db/index.ts` | `DATABASE_URL` |

**Data Flow:**
```
User Action → Feature Component → API Route → Drizzle Query → PostgreSQL
                                    ↓
                            AI Provider (if needed)
                                    ↓
                              Response → Client State Update
```

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
| Decisions | Compatibility | Status |
|-----------|--------------|--------|
| Next.js 16 + React 19 + TypeScript 5 | Native support, latest versions | ✅ |
| Tailwind 4 + shadcn/ui | shadcn requires Tailwind | ✅ |
| Clerk + Next.js App Router | Official integration exists | ✅ |
| Drizzle ORM + PostgreSQL + Neon | Fully supported | ✅ |
| Vercel AI SDK + Next.js | Same team, optimized integration | ✅ |
| @xyflow/react + React 19 | Compatible (v12+) | ✅ |

**Pattern Consistency:** All patterns align with technology choices (snake_case for DB, camelCase for TS, App Router conventions).

**Structure Alignment:** Project structure follows Next.js App Router best practices with feature-based component organization.

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**

| FR Category | Total FRs | Architecture Support | Status |
|-------------|-----------|---------------------|--------|
| Auth (FR1-FR6) | 6 | Clerk + middleware | ✅ |
| Projects (FR7-FR12) | 6 | API routes + projects table | ✅ |
| Stories (FR13-FR18) | 6 | API routes + stories table | ✅ |
| AI Generation (FR19-FR34) | 16 | Vercel AI SDK + provider abstraction | ✅ |
| Review (FR35-FR38) | 4 | API routes + reviews table | ✅ |
| Kanban (FR39-FR42) | 4 | React components + drag-drop | ✅ |
| App Management (FR43-FR82) | 40 | Full API + component support | ✅ |
| Project Management (FR83-FR112) | 30 | Full API + component support | ✅ |
| Context Library (FR113-FR117) | 5 | API routes + context_items table | ✅ |
| Floating AI (FR118-FR121) | 4 | AI chat sidebar + SSE | ✅ |

**Non-Functional Requirements Coverage:**

| NFR | Requirement | Architecture Support | Status |
|-----|-------------|---------------------|--------|
| NFR1 | AI generation <10s | Vercel AI SDK streaming + provider abstraction | ✅ |
| NFR2 | Page load <2s | Next.js SSR/SSG + Turbopack | ✅ |
| NFR3 | 20 concurrent users | PostgreSQL connection pooling | ✅ |
| NFR4-9 | Security | Clerk auth + HTTPS + encryption | ✅ |
| NFR10-12 | Reliability | Error boundaries + retry logic | ✅ |
| NFR13-15 | Integration | AI provider abstraction layer | ✅ |

### Implementation Readiness Validation ✅

**Decision Completeness:**
- All critical technologies specified with versions ✅
- Implementation patterns comprehensive ✅
- Consistency rules clear and enforceable ✅
- Examples provided for all major patterns ✅

**Structure Completeness:**
- Complete directory structure defined ✅
- All files and directories mapped ✅
- Integration points specified ✅
- Component boundaries defined ✅

**Pattern Completeness:**
- All naming conventions documented ✅
- API response formats standardized ✅
- Error handling patterns defined ✅
- Loading state patterns specified ✅

### Gap Analysis Results

**No Critical Gaps Found** ✅

**Minor Enhancements for Future:**
| Area | Enhancement | Priority |
|------|-------------|----------|
| Multi-tenancy | Tenant isolation architecture | Phase 3 |
| Caching | Redis integration for hot data | Post-MVP |
| Rate Limiting | API rate limiting details | Post-MVP |
| Observability | APM/logging service integration | Post-MVP |

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** ✅ READY FOR IMPLEMENTATION

**Confidence Level:** HIGH

**Key Strengths:**
- Modern, cohesive technology stack with excellent DX
- Clear separation of concerns (UI / API / Data layers)
- AI provider abstraction enables easy provider swapping
- Comprehensive patterns prevent agent implementation conflicts

**Areas for Future Enhancement:**
- Multi-tenant support (Phase 3)
- Advanced caching with Redis (post-MVP)
- Rate limiting implementation details

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions

**First Implementation Priority:**
```bash
npx create-next-app@latest zoniq --typescript --tailwind --eslint --app --src-dir --turbopack --import-alias "@/*"
```

**Post-Install Setup:**
```bash
cd zoniq

# shadcn/ui
npx shadcn@latest init

# Core dependencies
npm install @xyflow/react framer-motion react-hook-form @hookform/resolvers zod

# Database
npm install drizzle-orm postgres drizzle-kit

# Auth
npm install @clerk/nextjs

# AI
npm install ai @ai-sdk/anthropic

# Utilities
npm install date-fns sonner
```