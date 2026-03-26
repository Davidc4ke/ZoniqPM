# Story 2.0.1: Universal AI Input Field

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to access a universal AI input field on the home page that expands into a full-page chat,
so that I can interact with AI using natural language commands.

## Acceptance Criteria

1. **AC1 - Hero Input Display:** Given a user on the home page, when the page loads, then a hero input field is displayed prominently with an AI icon and placeholder text that rotates between teaching prompts.

2. **AC2 - Full-Page Chat Overlay:** Given a user viewing the hero input, when the user types a query and clicks "Ask" (or presses Enter), then the page transforms into a full-page AI chat overlay and the user's query is sent to the AI.

3. **AC3 - Natural Language Commands:** Given a user in the AI chat overlay, when the user types a natural language command (e.g., "Open #47", "What's blocked?", "Assign #52 to Aisha"), then the AI parses the command and performs the appropriate action, and responses include actionable suggestions with buttons.

4. **AC4 - Chat Overlay Dismiss:** Given a user in the AI chat overlay, when the user clicks "Back to Dashboard" or presses Escape, then the chat overlay closes and the dashboard is restored.

5. **AC5 - Streaming Response:** Given a user in the AI chat overlay, when the AI generates a response, then the response is streamed token-by-token with a typing indicator.

6. **AC6 - Navigation Command:** Given an AI command to open a story (e.g., "Open #47"), when the AI processes the command, then the user is navigated to the story detail page.

7. **AC7 - Query Command:** Given an AI command asking about blocked items (e.g., "What's blocked?"), when the AI processes the command, then a list of blocked stories is displayed with reasons and durations.

## Tasks / Subtasks

- [ ] Task 1: Create UniversalInput component (AC: #1)
  - [ ] 1.1: Build hero input with AI sparkle icon, auto-expanding textarea, and "Ask" button
  - [ ] 1.2: Implement rotating placeholder text with animation
  - [ ] 1.3: Handle input states: default, focused, expanded (multi-line), loading
  - [ ] 1.4: Wire Enter to submit, Shift+Enter for newline

- [ ] Task 2: Create AI Chat Overlay component (AC: #2, #4)
  - [ ] 2.1: Build full-page overlay with backdrop and transition animation
  - [ ] 2.2: Implement chat message list with user messages (right-aligned, gray bg) and AI messages (left-aligned, orange avatar)
  - [ ] 2.3: Add "Back to Dashboard" button and Escape key handler to dismiss overlay
  - [ ] 2.4: Preserve chat history within session (React state)

- [ ] Task 3: Create AI chat API route (AC: #3, #5, #6, #7)
  - [ ] 3.1: Create `/api/ai/chat/route.ts` using Vercel AI SDK `streamText`
  - [ ] 3.2: Implement AI provider abstraction (use existing pattern from architecture)
  - [ ] 3.3: Define system prompt with command parsing instructions (navigate, query, action, capture, search)
  - [ ] 3.4: Return streaming response via SSE

- [ ] Task 4: Integrate streaming in chat overlay (AC: #5)
  - [ ] 4.1: Use Vercel AI SDK `useChat` hook to manage chat state and streaming
  - [ ] 4.2: Show typing indicator during AI generation
  - [ ] 4.3: Render streamed tokens progressively

- [ ] Task 5: Implement AI response rendering (AC: #3, #6, #7)
  - [ ] 5.1: Create AIResponseCard component for structured responses (status cards, story lists, confirmations)
  - [ ] 5.2: Render actionable suggestion buttons in AI responses
  - [ ] 5.3: Handle navigation commands (router.push to story detail)
  - [ ] 5.4: Handle query commands (render story lists with status badges)

- [ ] Task 6: Integrate into dashboard page (AC: #1, #2)
  - [ ] 6.1: Add UniversalInput as hero section above widget grid on dashboard page
  - [ ] 6.2: Wire input submission to open chat overlay with initial query
  - [ ] 6.3: Ensure overlay sits above all dashboard content (z-index layering)

- [ ] Task 7: Testing and verification
  - [ ] 7.1: Verify lint passes (`npm run lint`)
  - [ ] 7.2: Verify build succeeds (`npm run build`)
  - [ ] 7.3: Verify existing tests still pass (`npm run test`)

## Dev Notes

### Architecture Compliance

**Tech Stack (MUST use):**
- Next.js 16 with React 19 and TypeScript 5
- Tailwind CSS 4 with shadcn/ui components
- Vercel AI SDK 4.x with `useChat` hook for client, `streamText` for server
- AI Provider: Chinese Big Model for MVP (via OpenAI-compatible API)
- Framer Motion for overlay/input animations
- Sonner for toast notifications on errors

**AI Provider Abstraction (MUST follow this exact pattern):**
```typescript
// src/lib/ai/provider.ts
import { createOpenAI } from '@ai-sdk/openai';

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
```

**API Response Format (MUST wrap):**
```typescript
// Success: { data: T, meta?: {...} }
// Error: { error: { code: string, message: string } }
// For streaming: Use Vercel AI SDK streaming response directly
```

**State Management:**
- Chat state: Use Vercel AI SDK `useChat` hook (manages messages, input, streaming)
- Overlay open/close: React `useState`
- No TanStack Query needed for this story (chat is ephemeral, not cached server state)

### Component Placement (MUST follow)

```
src/components/features/
├── universal-input/
│   └── universal-input.tsx        # Hero input component
├── ai-chat/
│   ├── ai-chat-overlay.tsx        # Full-page chat overlay
│   ├── chat-message.tsx           # Individual message bubble
│   └── ai-response-card.tsx       # Structured AI response rendering
src/app/api/
└── ai/
    └── chat/
        └── route.ts               # Streaming chat API endpoint
```

**Naming Conventions:**
- Component files: `kebab-case.tsx`
- Component exports: `PascalCase`
- Feature folders: `kebab-case/`

### Design Tokens (from shared-styles.css and previous story)

| Token | Value | Usage |
|-------|-------|-------|
| Primary Orange | `#FF6B35` | Input border focus, AI avatar, Ask button, gradient |
| Orange Gradient | `#FF6B35` to `#FF8F5A` | AI-related UI elements |
| Dark Brown | `#2D1810` | Text color |
| Off-White BG | `#FAFAF9` | Page background |
| Warm Gray | `#E8E4E0` | Borders, skeleton loading |
| Card BG | `#F5F2EF` | Card backgrounds |
| Medium Gray | `#9A948D` | Placeholder text, secondary text |
| Error Red | `#EF4444` | Error states |
| Success Green | `#10B981` | Success indicators |
| Warning Amber | `#F59E0B` | Warnings |
| Font | Manrope | All text |

### UX Specification Details

**Universal Input States:**
- Default: Single-line input with AI sparkle icon left, "Ask" button right
- Focused: Orange border glow, auto-expand to multi-line
- Loading: Spinner in Ask button, input disabled
- Expanded: Textarea mode for multi-line input

**Placeholder Rotation (cycle every 4-5s):**
1. "Paste notes, or try 'What do I need to review?'"
2. "Try: 'Open story 47' or 'How's Claims Portal?'"
3. "Ask me anything about your projects..."
4. "Create a story, or ask 'What's blocked?'"

**Input Accessibility:**
- `aria-label="Ask me anything"`
- Enter to submit, Shift+Enter for newline
- Character count display (optional)

**Chat Message Styling:**

| Type | Style |
|------|-------|
| User message | Right-aligned, gray background (`#F5F2EF`), dark text |
| AI message | Left-aligned, orange avatar icon, white background |
| Gap warning | Amber background (`#FEF3C7`), yellow border |
| Success | Green text, checkmark icon |
| Code block | Dark background, monospace font |

**AI Response Types (from UX spec):**

| Intent | Example | Response |
|--------|---------|----------|
| Capture | [Pastes notes] | "New story for [Project]?" + [Create] button |
| Navigate | "Open story 47" | Direct navigation to story |
| Query | "Status of Claims Portal?" | Inline project status card |
| Search | "Stories about export" | List of matching stories |
| Action | "Assign #47 to Aisha" | Confirmation + [View Story] button |
| Review | "What do I review?" | Inline review queue |
| Create | "New story for Policy" | Story form, project pre-filled |

**Chat Overlay:**
- Full-page overlay with semi-transparent dark backdrop (`rgba(0,0,0,0.5)`)
- Chat area max-width 720px centered
- Scroll to bottom on new messages
- Escape or "Back to Dashboard" to dismiss

**Error Handling:**
- On AI failure: Error toast + inline error message + "Retry" button
- On timeout (>15s): "Taking longer than usual..." + "Cancel" option
- Max 3 retries before suggesting manual entry

**Loading/Streaming:**
- Typing indicator: 3 animated dots with bounce animation
- Tokens streamed progressively into message bubble
- Skeleton shimmer while waiting for first token

### Previous Story Intelligence (Story 2.0)

**Key patterns established:**
- Dashboard uses `grid grid-cols-4 gap-5` layout
- Widget component wrapper at `src/components/features/dashboard/widget.tsx`
- StoryCard at `src/components/features/dashboard/story-card.tsx` (reuse for AI response story lists)
- MiniKanban at `src/components/features/mini-kanban/mini-kanban.tsx`
- Topbar already has an AI Chat button placeholder (non-functional) - DO NOT modify topbar in this story
- Dashboard layout at `src/app/(dashboard)/layout.tsx` uses Clerk auth
- Tests pass: lint (0 errors), build (success), test (4/4)
- Root redirect already implemented

**Files to REUSE (not recreate):**
- `src/components/features/dashboard/story-card.tsx` - for rendering story results in AI responses
- `src/lib/utils.ts` - `cn()` utility for class merging
- `src/lib/constants.ts` - role constants

**Files to MODIFY:**
- `src/app/(dashboard)/dashboard/page.tsx` - Add UniversalInput hero section above widget grid

**Files to CREATE:**
- `src/components/features/universal-input/universal-input.tsx`
- `src/components/features/ai-chat/ai-chat-overlay.tsx`
- `src/components/features/ai-chat/chat-message.tsx`
- `src/components/features/ai-chat/ai-response-card.tsx`
- `src/app/api/ai/chat/route.ts`
- `src/lib/ai/provider.ts` (if not exists - AI provider abstraction)

### Anti-Patterns to Avoid

- **DO NOT** use snake_case in TypeScript/JSON (use camelCase)
- **DO NOT** return unwrapped API responses (wrap in `{ data }` or use AI SDK streaming)
- **DO NOT** expose raw errors to UI (use friendly messages via Sonner toast)
- **DO NOT** use spinners alone for loading (use skeleton shimmer patterns)
- **DO NOT** create new utility functions in component files (put in `src/lib/`)
- **DO NOT** install new dependencies without checking if already in package.json
- **DO NOT** modify topbar, widget, or other Story 2.0 components
- **DO NOT** use timestamp numbers for dates (use ISO 8601 strings)

### Project Structure Notes

- Alignment: All new components follow `src/components/features/{feature-name}/` convention
- API route follows `src/app/api/ai/chat/route.ts` pattern per architecture
- AI provider abstraction goes in `src/lib/ai/` per architecture spec
- No database changes needed for this story (chat is ephemeral)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.0.1]
- [Source: _bmad-output/planning-artifacts/_docs/ux-design-specification.md#Universal Input]
- [Source: _bmad-output/planning-artifacts/_docs/ux-design-specification.md#AI Chat Sidebar]
- [Source: _bmad-output/planning-artifacts/_docs/architecture.md#AI Provider Abstraction]
- [Source: _bmad-output/planning-artifacts/_docs/architecture.md#Project Directory Structure]
- [Source: _bmad-output/planning-artifacts/_docs/architecture.md#Naming Conventions]
- [Source: _bmad-output/planning-artifacts/_docs/architecture.md#Error Handling Patterns]
- [Source: _bmad-output/planning-artifacts/design-home-page.html]
- [Source: _bmad-output/planning-artifacts/shared-styles.css]
- [Source: _bmad-output/implementation-artifacts/2-0-home-page-dashboard-layout.md]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
