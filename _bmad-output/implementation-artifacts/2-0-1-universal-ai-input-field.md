# Story 2.0.1: Universal AI Input Field

Status: ready-for-dev

## Story

As a user,
I want to access a universal AI input field on the home page that expands into a full-page chat,
so that I can interact with AI using natural language commands.

(FR-new32, FR-new33, FR-new38)

## Acceptance Criteria

1. **Given** a user on the home page, **When** the page loads, **Then** a hero input field is displayed prominently above the dashboard widgets with an AI icon and rotating placeholder text.

2. **Given** a user viewing the hero input, **When** the user types a query and clicks "Ask" (or presses Enter), **Then** the page transforms into a full-page AI chat overlay, the dashboard content fades out, and the user's query is sent to the AI.

3. **Given** a user in the AI chat overlay, **When** the user types a natural language command (e.g., "Open #47", "What's blocked?", "Assign #52 to Aisha"), **Then** the AI parses the command and performs the appropriate action, and responses include actionable suggestions with buttons.

4. **Given** a user in the AI chat overlay, **When** the user clicks "Back to Dashboard" or presses Escape, **Then** the chat overlay closes and the dashboard is restored to its previous state.

5. **Given** a user in the AI chat overlay, **When** the AI generates a response, **Then** the response is streamed token-by-token with a typing indicator.

6. **Given** an AI command to open a story (e.g., "Open #47"), **When** the AI processes the command, **Then** the user is navigated to the story detail page.

7. **Given** an AI command asking about blocked items (e.g., "What's blocked?"), **When** the AI processes the command, **Then** a list of blocked stories is displayed with reasons and durations.

## Tasks / Subtasks

- [ ] Task 1: Create AI provider abstraction layer (AC: #2, #5)
  - [ ] 1.1 Install Vercel AI SDK (`ai` package)
  - [ ] 1.2 Create `src/lib/ai/provider.ts` with factory pattern for configurable LLM provider
  - [ ] 1.3 Create `src/lib/ai/types.ts` with chat message types and streaming interfaces
  - [ ] 1.4 Add environment variables for AI provider config (`AI_PROVIDER`, `AI_API_KEY`, `AI_BASE_URL`)

- [ ] Task 2: Create API route for AI chat streaming (AC: #2, #5)
  - [ ] 2.1 Create `src/app/api/ai/chat/route.ts` with POST handler
  - [ ] 2.2 Implement SSE streaming response using Vercel AI SDK `streamText`
  - [ ] 2.3 Add Zod validation for request body (messages array)
  - [ ] 2.4 Add Clerk auth middleware check on the route

- [ ] Task 3: Build HeroInput component (AC: #1)
  - [ ] 3.1 Create `src/components/features/hero-input/hero-input.tsx`
  - [ ] 3.2 Implement auto-expanding textarea with AI sparkle icon
  - [ ] 3.3 Add rotating placeholder text with fade animation (4 placeholder variants)
  - [ ] 3.4 Add "Ask" submit button with orange primary styling
  - [ ] 3.5 Add character count display
  - [ ] 3.6 Style with orange focus border (`#FF6B35`), Manrope font
  - [ ] 3.7 Support Enter to submit, Shift+Enter for newline
  - [ ] 3.8 Create barrel export `src/components/features/hero-input/index.ts`

- [ ] Task 4: Build ChatOverlay component (AC: #2, #4, #5)
  - [ ] 4.1 Create `src/components/features/chat-overlay/chat-overlay.tsx`
  - [ ] 4.2 Implement full-page overlay with topbar (Back to Dashboard button, Zoniq logo)
  - [ ] 4.3 Create `ChatMessage` sub-component for AI messages (orange avatar, left) and user messages (gray bg, right)
  - [ ] 4.4 Implement streaming token display with typing indicator using `useChat` from Vercel AI SDK
  - [ ] 4.5 Add chat input at bottom with send button
  - [ ] 4.6 Implement fade-in/fade-out transition with Framer Motion
  - [ ] 4.7 Handle Escape key to close overlay
  - [ ] 4.8 Create barrel export `src/components/features/chat-overlay/index.ts`

- [ ] Task 5: Integrate hero input and chat overlay into dashboard page (AC: #1, #2, #4)
  - [ ] 5.1 Add HeroInput above widget grid in `dashboard/page.tsx`
  - [ ] 5.2 Wire up state management: `isChatOpen`, `initialQuery`
  - [ ] 5.3 Implement dashboard fade-out when chat opens, restore on close
  - [ ] 5.4 Pass initial query from hero input to chat overlay

- [ ] Task 6: Implement command parsing and action buttons (AC: #3, #6, #7)
  - [ ] 6.1 Create `src/lib/ai/command-parser.ts` for detecting intent from AI responses
  - [ ] 6.2 Implement navigation action for "Open #N" commands (use Next.js router)
  - [ ] 6.3 Implement blocked items query response rendering
  - [ ] 6.4 Add actionable suggestion buttons in AI response messages
  - [ ] 6.5 Create `ActionButton` component for in-chat actions

- [ ] Task 7: Accessibility and keyboard support (AC: #1, #4)
  - [ ] 7.1 Add `aria-label="Ask me anything"` to hero input
  - [ ] 7.2 Ensure full keyboard navigation in chat overlay
  - [ ] 7.3 Add focus trap in chat overlay when open
  - [ ] 7.4 Respect `prefers-reduced-motion` for animations
  - [ ] 7.5 Ensure 4.5:1 contrast ratios on all text
