# Story 2.0.1: Universal AI Input Field

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to access a universal AI input field on the home page that expands into a full-page chat,
so that I can interact with AI using natural language commands.

**Source:** FR-new32, FR-new33, FR-new38

## Acceptance Criteria

1. **AC1 - Hero Input Field Display:**
   - GIVEN I am on the dashboard page
   - WHEN the page loads
   - THEN a hero input field is displayed prominently above the dashboard widgets with an AI icon (#FF6B35), placeholder text "Paste notes, or try 'What do I need to review?'...", an "Ask" button, example suggestions ("Open story 47" · "What's blocked?" · "Assign #52 to Aisha"), and a character counter
   - AND the input field has a pulsing glow animation and orange border styling

2. **AC2 - Chat Overlay Activation:**
   - GIVEN the hero input field is displayed
   - WHEN I type a query and click "Ask" (or press Enter)
   - THEN the page transforms into a full-page AI chat overlay
   - AND my query appears as the first user message in the chat
   - AND the query is sent to the AI backend for processing

3. **AC3 - Chat Overlay Controls:**
   - GIVEN the chat overlay is open
   - WHEN I click "Back to Dashboard" or press Escape
   - THEN the chat overlay closes and the dashboard is restored to its previous state

4. **AC4 - AI Response Streaming:**
   - GIVEN I have submitted a query
   - WHEN the AI is generating a response
   - THEN a typing indicator (3-dot animation) is displayed
   - AND the AI response is streamed token-by-token as it's generated
   - AND the response renders as formatted text

5. **AC5 - Continued Conversation:**
   - GIVEN the chat overlay is open with previous messages
   - WHEN I type a follow-up message and click "Send" (or press Enter)
   - THEN my message is appended to the chat history
   - AND the AI responds with context from the full conversation

6. **AC6 - Error Handling:**
   - GIVEN an AI request fails (network error, timeout, provider error)
   - WHEN the error occurs
   - THEN a clear error message is displayed in the chat
   - AND a retry button is provided to resend the last message

## Tasks / Subtasks

- [ ] Task 1: Install and configure Vercel AI SDK with provider abstraction (AC: 4, 5)
  - [ ] 1.1: Install `ai` package (Vercel AI SDK 4.x) and provider packages
  - [ ] 1.2: Create AI provider factory at `src/lib/ai/provider.ts` using architecture's provider pattern
  - [ ] 1.3: Add AI-related environment variables to `.env.local` template (AI_PROVIDER, API keys, base URLs)
  - [ ] 1.4: Create chat API route at `src/app/api/ai/chat/route.ts` with streaming response using `streamText()`
  - [ ] 1.5: Write unit tests for provider factory and integration test for chat API route

- [ ] Task 2: Build hero AI input field component (AC: 1)
  - [ ] 2.1: Create `src/components/features/ai-input/hero-ai-input.tsx` with textarea, AI icon, Ask button, suggestion hints, and character counter
  - [ ] 2.2: Style with Tailwind matching design prototype (orange border, gradient background, glow animation, focus states)
  - [ ] 2.3: Add auto-resize textarea behavior (expand as user types)
  - [ ] 2.4: Integrate into dashboard page above the widget grid
  - [ ] 2.5: Write component unit tests (render, placeholder, character count, submit on Enter, submit on Ask click)

- [ ] Task 3: Build full-page chat overlay component (AC: 2, 3)
  - [ ] 3.1: Create `src/components/features/ai-chat/chat-overlay.tsx` - full-screen overlay with header ("Zoniq Assistant" + AI avatar), messages area, and input area
  - [ ] 3.2: Create `src/components/features/ai-chat/chat-message.tsx` - individual message bubble (user vs assistant styling, timestamps)
  - [ ] 3.3: Create `src/components/features/ai-chat/chat-input.tsx` - bottom input bar with textarea, Send button, suggestions, and Clear button
  - [ ] 3.4: Implement overlay open/close with animation (fadeIn 0.3s, Escape key handler)
  - [ ] 3.5: Auto-scroll to latest message on new messages
  - [ ] 3.6: Write component unit tests (open/close, Escape key, message rendering, auto-scroll)

- [ ] Task 4: Integrate AI streaming with chat UI (AC: 4, 5, 6)
  - [ ] 4.1: Use Vercel AI SDK's `useChat` hook in the chat overlay to manage conversation state and streaming
  - [ ] 4.2: Implement typing indicator (3-dot animation) shown while AI is generating
  - [ ] 4.3: Render streamed tokens in real-time as assistant message content
  - [ ] 4.4: Implement error handling: display error message in chat + retry button
  - [ ] 4.5: Wire hero input submission to open overlay and trigger first AI request
  - [ ] 4.6: Write integration tests for streaming flow, error handling, and retry

- [ ] Task 5: Dashboard integration and end-to-end validation (AC: 1-6)
  - [ ] 5.1: Update dashboard page to render hero input above widget grid with proper spacing
  - [ ] 5.2: Ensure overlay covers full viewport (z-index above topbar z-50) and prevents background scroll
  - [ ] 5.3: Verify "Back to Dashboard" restores dashboard state exactly
  - [ ] 5.4: Run full test suite (unit + integration), lint check, and build verification
  - [ ] 5.5: Verify all 6 acceptance criteria are satisfied end-to-end

## Dev Notes

### Architecture Requirements

**AI Provider Setup (from Architecture doc):**
- Use Vercel AI SDK 4.x (`ai` npm package) for provider abstraction
- MVP Provider: "Chinese Big Model" (OpenAI-compatible API via `@ai-sdk/openai` with custom base URL)
- Post-MVP Provider: Anthropic Claude (via `@ai-sdk/anthropic`)
- Provider factory pattern for runtime swapping based on `AI_PROVIDER` env var

```typescript
// Architecture-mandated provider pattern (src/lib/ai/provider.ts)
import { createOpenAI } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

export function getActiveProvider() {
  if (process.env.AI_PROVIDER === 'anthropic') {
    return anthropic('claude-sonnet-4-20250514');
  }
  // Default: BigModel (OpenAI-compatible)
  return createOpenAI({
    apiKey: process.env.BIGMODEL_API_KEY,
    baseURL: process.env.BIGMODEL_BASE_URL ?? 'https://api.bigmodel.cn',
  })('bigmodel-model');
}
```

**Environment Variables:**
```
AI_PROVIDER=bigmodel          # or "anthropic"
BIGMODEL_API_KEY=xxx
BIGMODEL_BASE_URL=https://api.bigmodel.cn
ANTHROPIC_API_KEY=xxx         # for post-MVP
```

**API Route Pattern (from existing admin routes):**
- Clerk authentication required on all API routes
- Zod validation for request bodies
- Standardized response: `{ data: T }` success / `{ error: { code, message } }` error
- 30s API timeout for AI generation
- Max 3 retries with exponential backoff on AI provider failure

**Chat API Route Structure:**
```
src/app/api/ai/chat/route.ts   → POST handler with streamText()
```

### UI/UX Requirements (from Design Prototype)

**Hero Input Field:**
- Container: `max-w-[1000px] mx-auto`, padding `px-8 pt-6 pb-2`
- Input box: gradient background `linear-gradient(135deg, #FFF7F3 0%, white 100%)`, 2px solid `#FF6B35` border, `border-radius: 16px`, box-shadow `0 4px 24px rgba(255, 107, 53, 0.12)`
- Focus state: shadow increases to `0 8px 32px rgba(255, 107, 53, 0.2)`
- Glow animation: pulsing orange glow (`pulseGlow` keyframes, 2s infinite, 1s delay)
- AI icon: `#FF6B35` colored SVG (24x24), positioned left
- Textarea: single row, auto-resize, `text-base font-medium`, placeholder `text-[#9A948D]`
- Ask button: primary orange button (`bg-[#FF6B35] text-white`), `text-sm px-4 py-2`
- Footer row: suggestion text left, character counter right, separated by `border-t border-[#E8E4E0]`

**Chat Overlay:**
- Full-screen fixed overlay (`position: fixed, inset: 0, z-index: 100`)
- Background: `#E8E4E0` (warm gray)
- Content container: `var(--off-white)` background, `min-height: 100vh`, flex column
- Header: white background, bottom border, "Back to Dashboard" button left, "Zoniq Assistant" + AI avatar right
- AI avatar: orange circle (`bg-[#FF6B35]`) with "AI" text
- Messages area: flex-1, overflow-y auto, `padding: 2rem`, inner `max-width: 900px` centered
- Input area: white background, top border, `padding: 1.5rem 2rem`, inner `max-width: 900px` centered
- Input: `bg-[#FAFAF9]` background, `border-[#E8E4E0]`, `rounded-xl`, focus border `#FF6B35`
- Send button: primary orange, `px-5 py-2.5`
- Animation: fadeIn 0.3s ease-out on overlay open
- Message animation: chatSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)

**Typing Indicator:**
- 3 animated dots for AI "thinking" state

### Coding Standards

- **Components:** PascalCase files (e.g., `HeroAiInput.tsx`), kebab-case folders (e.g., `ai-input/`)
- **Client components:** Must use `'use client'` directive for interactive components (hooks, state, event handlers)
- **Imports:** Use `@/` path alias for `src/`
- **Colors:** Use exact hex values from design system, NOT Tailwind defaults
- **API responses:** Wrap in `{ data }` or `{ error: { code, message } }` format
- **TypeScript:** strict mode, no `any` types
- **Testing:** Vitest + Testing Library for unit tests; test files co-located in `src/test/`

### Project Structure Notes

**New files to create:**
```
src/lib/ai/provider.ts                          # AI provider factory
src/app/api/ai/chat/route.ts                    # Chat streaming API
src/components/features/ai-input/hero-ai-input.tsx   # Hero input component
src/components/features/ai-chat/chat-overlay.tsx     # Full-page chat overlay
src/components/features/ai-chat/chat-message.tsx     # Chat message bubble
src/components/features/ai-chat/chat-input.tsx       # Chat input bar
src/components/features/ai-chat/typing-indicator.tsx # Typing dots animation
```

**Files to modify:**
```
src/app/(dashboard)/dashboard/page.tsx    # Add hero input above widget grid
zoniq/package.json                        # Add ai, @ai-sdk/openai dependencies
.env.local                                # Add AI env vars (template)
```

**Existing patterns to follow:**
- Dashboard page layout: `mx-auto max-w-[1280px] px-8 py-6` container
- Widget component: `rounded-xl border border-[#E8E4E0] bg-white p-5 shadow-sm`
- Topbar z-index: `z-50` (overlay must be above: `z-[100]`)
- Feature components organized in `src/components/features/{feature-name}/`
- Clerk auth in API routes: check auth, return 401 if unauthorized (see `src/lib/admin-auth.ts` pattern)

### Previous Story Learnings (from Story 2.0)

- shadcn/ui components folder exists but is empty (`.gitkeep` only); all UI is custom-built with Tailwind + Radix primitives
- Dashboard uses mock data in widgets (no API calls yet); this story should also use mock/simulated AI responses if provider isn't configured
- Test setup at `src/test/setup.ts` with Vitest; 4 tests currently pass
- Clerk mocking pattern established in `src/test/logout.test.tsx` for testing auth-dependent components
- `cn()` utility at `src/lib/utils.ts` for merging Tailwind classes
- Build with `npm run build`, test with `npm run test`, lint with `npm run lint`

### Testing Requirements

- **Unit tests:** Hero input component (render, placeholder, char count, Ask click, Enter submit), chat overlay (open/close, Escape key), chat message (user vs assistant), chat input (submit, clear)
- **Integration tests:** Chat API route (auth check, streaming response, error handling), useChat hook integration with overlay
- **Framework:** Vitest + @testing-library/react (already configured)
- **Mocking:** Mock AI provider for tests (don't make real API calls); mock Clerk auth for API route tests

### References

- [Source: _bmad-output/planning-artifacts/epics.md - Epic 2, Story 2.0.1]
- [Source: _bmad-output/planning-artifacts/_docs/architecture.md - AI/LLM Integration, API Patterns, Technical Stack]
- [Source: _bmad-output/planning-artifacts/design-home-page.html - Lines 184-209 (hero input), Lines 772-819 (chat overlay)]
- [Source: _bmad-output/planning-artifacts/shared-styles.css - Lines 76-90 (input styles), Lines 676-723 (overlay styles), Lines 951-969 (animations)]
- [Source: _bmad-output/implementation-artifacts/2-0-home-page-dashboard-layout.md - Dev notes, file list, patterns]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
