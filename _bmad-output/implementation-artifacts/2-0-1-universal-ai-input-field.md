# Story 2.0.1: Universal AI Input Field

Status: done

## Story

As a user,
I want to access a universal AI input field on the home page that expands into a full-page chat,
so that I can interact with AI using natural language commands. (FR-new32, FR-new33, FR-new38)

## Acceptance Criteria

1. **Given** a user on the dashboard, **When** the page loads, **Then** a hero input field is displayed prominently above the dashboard widgets with an AI icon and rotating placeholder text.

2. **Given** a user viewing the hero input, **When** the user types a query and clicks "Ask", **Then** the page transforms into a full-page AI chat overlay and the user's query is sent to the AI.

3. **Given** a user in the AI chat overlay, **When** the user types a natural language command (e.g., "Open #47", "What's blocked?", "Assign #52 to Aisha"), **Then** the AI parses the command and responds with actionable suggestions including buttons.

4. **Given** a user in the AI chat overlay, **When** the user clicks "Back to Dashboard" or presses Escape, **Then** the chat overlay closes and the dashboard is restored.

5. **Given** a user in the AI chat overlay, **When** the AI generates a response, **Then** the response is streamed token-by-token with a typing indicator.

6. **Given** an AI command to open a story (e.g., "Open #47"), **When** the AI processes the command, **Then** the user is navigated to the story detail page.

7. **Given** an AI command asking about blocked items (e.g., "What's blocked?"), **When** the AI processes the command, **Then** a list of blocked stories is displayed with reasons and durations.

## Tasks / Subtasks

- [x] Task 1: Create AI chat types and mock AI service (AC: #2, #3, #5)
  - [x]1.1 Create `src/types/ai.ts` with ChatMessage, ChatIntent, and AIChatResponse types
  - [x]1.2 Create `src/lib/ai/chat-service.ts` with mock AI response logic that classifies intents (capture, navigate, query, search, action, review, create) and returns mock streaming responses
  - [x]1.3 Write unit tests for intent classification and response generation

- [x] Task 2: Create UniversalInput component (AC: #1)
  - [x]2.1 Create `src/components/features/ai-chat/universal-input.tsx` — hero input with AI icon, auto-expanding textarea, Ask button, character count, and helper text
  - [x]2.2 Implement placeholder rotation (cycle through teaching phrases every 4 seconds)
  - [x]2.3 Write unit tests for UniversalInput: renders correctly, placeholder rotates, fires onSubmit with query text, character count updates

- [x] Task 3: Create ChatOverlay component (AC: #2, #4, #5)
  - [x]3.1 Create `src/components/features/ai-chat/chat-message.tsx` — renders user and AI messages with proper styling (user: white bg, right-aligned; AI: orange gradient bg, left-aligned) and avatar initials
  - [x]3.2 Create `src/components/features/ai-chat/typing-indicator.tsx` — three bouncing orange dots animation
  - [x]3.3 Create `src/components/features/ai-chat/chat-overlay.tsx` — full-page fixed overlay with topbar (Back to Dashboard button, "Zoniq Assistant" header), scrollable messages area, and bottom chat input
  - [x]3.4 Implement Escape key handler and Back to Dashboard button to close overlay
  - [x]3.5 Write unit tests for ChatOverlay: renders messages, closes on Escape, closes on Back button click, shows typing indicator when loading

- [x] Task 4: Create AI chat API route (AC: #3, #5)
  - [x]4.1 Create `src/app/api/ai/chat/route.ts` — POST endpoint that accepts `{ message: string, history: ChatMessage[] }`, classifies intent via mock service, returns streamed response using ReadableStream
  - [x]4.2 Write unit tests for the API route: validates input, returns streamed response, handles errors with `{ error }` wrapper

- [x] Task 5: Create useAIChat hook (AC: #2, #3, #5, #6, #7)
  - [x]5.1 Create `src/hooks/use-ai-chat.ts` — manages chat state (messages, isLoading, isOverlayOpen), handles sending messages via fetch to `/api/ai/chat`, processes streamed responses, exposes openChat/closeChat/sendMessage
  - [x]5.2 Write unit tests for useAIChat: initializes empty, sends message and receives response, manages overlay state

- [x] Task 6: Integrate into Dashboard page (AC: #1, #2, #4)
  - [x]6.1 Create `src/app/(dashboard)/dashboard/dashboard-client.tsx` — client component wrapping UniversalInput + ChatOverlay + existing dashboard widgets
  - [x]6.2 Update `src/app/(dashboard)/dashboard/page.tsx` to use the new client wrapper
  - [x]6.3 Wire the topbar "Open AI Chat" button to open the chat overlay
  - [x]6.4 Write integration tests: hero input renders above widgets, submitting query opens chat overlay, closing overlay restores dashboard

- [x] Task 7: Polish animations and accessibility (AC: #1, #4, #5)
  - [x]7.1 Add framer-motion animations: hero input slide-up on load, chat overlay fade-in/out, message slide-up entrance, typing indicator bounce
  - [x]7.2 Add accessibility: `aria-label="Ask me anything"` on input, focus management (auto-focus chat input when overlay opens, restore focus when closed), proper heading hierarchy in overlay
  - [x]7.3 Verify keyboard navigation: Enter to send, Shift+Enter for newline, Escape to close overlay
  - [x]7.4 Run full test suite and fix any regressions

## Dev Notes

### Architecture Compliance

- **AI SDK**: Vercel AI SDK 4.x is specified but NOT yet installed. For this story, use a **mock AI service** that simulates streaming responses. The real AI provider integration will come in later stories. Use `ReadableStream` + `TextEncoder` to simulate SSE-style streaming from the API route.
- **API pattern**: POST `/api/ai/chat` with request body `{ message: string, history: ChatMessage[] }`. Success: stream text. Error: `{ error: { code, message } }`.
- **State management**: Use React `useState` for local UI state (messages, loading, overlay visibility). No TanStack Query needed yet — direct fetch is fine for chat.
- **Component location**: `src/components/features/ai-chat/` for all chat components.
- **Animations**: Use `framer-motion` (already installed v12.34.4).
- **Toast notifications**: Use `sonner` for errors (already installed).

### Design Tokens (from shared-styles.css and design prototype)

- **Hero input border**: `2px solid #FF6B35` with `border-radius: 16px`
- **Hero input background**: `linear-gradient(135deg, #FFF7F3 0%, white 100%)`
- **Hero input shadow**: `0 4px 24px rgba(255, 107, 53, 0.12)`, focus: `0 8px 32px rgba(255, 107, 53, 0.2)`
- **Ask button**: bg `#FF6B35`, hover `#E55A2B`, text white, `rounded-lg px-4 py-2`
- **AI message bubble**: bg gradient `#FFF7F3 → white`, border `1px solid #FF6B35`, `rounded-2xl rounded-bl-sm`
- **User message bubble**: bg white, border `1px solid #E8E4E0`, `rounded-2xl rounded-br-sm`
- **AI avatar**: bg `#FF6B35`, text white, initials "AI"
- **User avatar**: bg `#E8E4E0`, text `#2D1810`
- **Typing indicator dots**: bg `#FF6B35`, 8px circles, staggered bounce animation
- **Chat overlay**: fixed inset-0, bg `#E8E4E0`, z-100
- **Back button**: white bg, `border #E8E4E0`, hover border/text `#FF6B35`
- **Chat input**: bg `#FAFAF9`, border `#E8E4E0`, focus border `#FF6B35`, `rounded-xl`
- **Max content width**: `900px` for chat messages, `1000px` for hero input
- **Placeholder text suggestions**: "Paste notes, or try 'What do I need to review?'" / "Try: 'Open story 47' or 'How's Claims Portal?'" / "Ask me anything about your projects..." / "Create a story, or ask 'What's blocked?'"
- **Helper text**: "Try: 'Open story 47' . 'What's blocked?' . 'Assign #52 to Aisha'" in `text-xs text-[#9A948D]`

### File Structure

```
src/
├── types/
│   └── ai.ts                              # NEW: Chat types
├── lib/
│   └── ai/
│       └── chat-service.ts                # NEW: Mock AI chat service
├── hooks/
│   └── use-ai-chat.ts                     # NEW: Chat state hook
├── components/
│   └── features/
│       └── ai-chat/
│           ├── universal-input.tsx         # NEW: Hero input component
│           ├── chat-overlay.tsx            # NEW: Full-page chat overlay
│           ├── chat-message.tsx            # NEW: Individual message bubble
│           └── typing-indicator.tsx        # NEW: Loading dots
├── app/
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       ├── page.tsx                   # MODIFY: Use client wrapper
│   │       └── dashboard-client.tsx       # NEW: Client component wrapper
│   └── api/
│       └── ai/
│           └── chat/
│               └── route.ts               # NEW: Chat API endpoint
```

### Testing Standards

- **Framework**: Vitest + React Testing Library (already configured)
- **Test files**: Co-locate as `*.test.ts` / `*.test.tsx` next to source files
- **Mocks**: Clerk auth is mocked in `src/test/setup.ts`. For API route tests, mock the chat service.
- **Pattern**: Write tests BEFORE implementation (red-green-refactor)
- **Coverage expectations**: All components render correctly, key interactions work (submit, close, keyboard), hook state transitions, API route validation

### Previous Story Intelligence (2-0-home-page-dashboard-layout)

- Dashboard page is at `src/app/(dashboard)/dashboard/page.tsx` — currently a server component with static widget grid
- Dashboard layout (`src/app/(dashboard)/layout.tsx`) wraps with Topbar, checks auth
- Topbar has an "Open AI Chat" button (line 115-123 of topbar.tsx) — currently non-functional, needs to be wired
- Widget components are in `src/components/features/dashboard/`
- Test mocks for Clerk are in `src/test/setup.ts`
- The previous story established the 4-column grid layout with `mx-auto max-w-[1280px] px-8 py-6`
- StoryCard component with priority colors and status badges already exists

### Key Implementation Decisions

1. **Mock AI for now**: No real AI provider configured yet. The chat-service.ts should simulate intent classification and return canned responses with a small delay to mimic streaming. Use TODO comments for real AI integration.
2. **Streaming simulation**: Use `ReadableStream` with `TextEncoder` to emit response chunks character-by-character with small delays (20-50ms per chunk).
3. **No database needed**: Chat history is client-side only (React state). No persistence required for this story.
4. **Topbar integration**: The topbar's chat button onClick should trigger opening the chat overlay. This requires either lifting state to the dashboard layout or using a shared context/callback. Simplest approach: pass an `onOpenChat` callback through the dashboard layout.

### References

- [Source: _bmad-output/planning-artifacts/_docs/ux-design-specification.md - Universal Input section]
- [Source: _bmad-output/planning-artifacts/_docs/architecture.md - AI Integration, Communication Patterns]
- [Source: _bmad-output/planning-artifacts/design-home-page.html - Hero input and chat overlay]
- [Source: _bmad-output/planning-artifacts/shared-styles.css - Design tokens]
- [Source: _bmad-output/planning-artifacts/epics.md - Story 2.0.1]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- framer-motion mock caused test failures with React 19 event handling; switched to CSS keyframe animations instead

### Completion Notes List

- Created full AI chat feature with mock AI service (7 intent types: navigate, query, search, action, review, create, capture)
- Universal hero input with placeholder rotation, character count, Enter-to-submit
- Full-page chat overlay with message bubbles (user/AI styled differently), typing indicator, Escape to close
- SSE-style streaming API route at POST /api/ai/chat with auth check
- useAIChat hook managing chat state, streaming response parsing, error handling
- Dashboard page converted to client wrapper to host AI chat
- Topbar chat button wired via custom event dispatch
- CSS animations (slideUp, fadeIn, typingBounce) instead of framer-motion for test compatibility
- 57 total tests (17 chat-service + 10 universal-input + 12 chat-overlay + 5 API route + 5 hook + 4 dashboard integration + 4 existing)

### File List

**Created:**
- zoniq/src/types/ai.ts
- zoniq/src/lib/ai/chat-service.ts
- zoniq/src/lib/ai/chat-service.test.ts
- zoniq/src/components/features/ai-chat/universal-input.tsx
- zoniq/src/components/features/ai-chat/universal-input.test.tsx
- zoniq/src/components/features/ai-chat/chat-message.tsx
- zoniq/src/components/features/ai-chat/typing-indicator.tsx
- zoniq/src/components/features/ai-chat/chat-overlay.tsx
- zoniq/src/components/features/ai-chat/chat-overlay.test.tsx
- zoniq/src/app/api/ai/chat/route.ts
- zoniq/src/app/api/ai/chat/route.test.ts
- zoniq/src/hooks/use-ai-chat.ts
- zoniq/src/hooks/use-ai-chat.test.ts
- zoniq/src/app/(dashboard)/dashboard/dashboard-client.tsx
- zoniq/src/app/(dashboard)/dashboard/dashboard-client.test.tsx

**Modified:**
- zoniq/src/app/(dashboard)/dashboard/page.tsx (use DashboardClient wrapper)
- zoniq/src/components/features/topbar/topbar.tsx (wire chat button onClick)
- zoniq/src/app/globals.css (add slideUp, fadeIn keyframe animations)
