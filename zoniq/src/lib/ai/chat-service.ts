import type { ChatIntent, ChatMessage, ChatResponseMeta } from '@/types/ai'

const INTENT_PATTERNS: { intent: ChatIntent; patterns: RegExp[] }[] = [
  {
    intent: 'review',
    patterns: [/need\s+to\s+review/i, /^review\s+queue/i, /^my\s+reviews/i],
  },
  {
    intent: 'navigate',
    patterns: [/^open\s+/i, /^go\s+to\s+/i, /^show\s+(me\s+)?story\s+#?\d+/i],
  },
  {
    intent: 'query',
    patterns: [
      /^what('s|\s+is)\s+(the\s+)?status/i,
      /^how('s|\s+is)\s+/i,
      /^what('s|\s+is)\s+blocked/i,
      /^what\s+do\s+i\s+need/i,
    ],
  },
  {
    intent: 'search',
    patterns: [/^(find|search|show)\s+(me\s+)?stories?\s+(about|with|for)/i, /^list\s+/i],
  },
  {
    intent: 'action',
    patterns: [/^assign\s+#?\d+/i, /^move\s+#?\d+/i, /^update\s+/i],
  },
  {
    intent: 'create',
    patterns: [/^(create|new|add)\s+/i],
  },
  {
    intent: 'capture',
    patterns: [/\n/], // Multi-line input treated as notes capture
  },
]

export function classifyIntent(message: string): ChatIntent {
  const trimmed = message.trim()
  for (const { intent, patterns } of INTENT_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(trimmed)) {
        return intent
      }
    }
  }
  return 'unknown'
}

// TODO: Replace with real AI provider integration (Vercel AI SDK + Chinese Big Model / Anthropic)
const MOCK_RESPONSES: Record<ChatIntent, (message: string) => { text: string; meta: ChatResponseMeta }> = {
  navigate: (message) => {
    const match = message.match(/#?(\d+)/)
    const storyId = match ? match[1] : '1'
    return {
      text: `Opening story #${storyId} for you.`,
      meta: {
        intent: 'navigate',
        actions: [{ label: `View Story #${storyId}`, href: `/stories/${storyId}` }],
      },
    }
  },
  query: (message) => {
    if (/blocked/i.test(message)) {
      return {
        text: 'Here are the currently blocked stories:\n\n1. **Story #12** - Claims Export - Blocked by: API dependency (3 days)\n2. **Story #28** - User Notifications - Blocked by: Design review pending (1 day)\n\nWould you like to take action on any of these?',
        meta: {
          intent: 'query',
          actions: [
            { label: 'View #12', href: '/stories/12' },
            { label: 'View #28', href: '/stories/28' },
          ],
        },
      }
    }
    return {
      text: 'Here\'s a summary of your project status:\n\n- **Claims Portal**: 68% complete (12/18 stories done)\n- **Policy Manager**: 45% complete (5/11 stories done)\n\nEverything is on track for the sprint deadline.',
      meta: { intent: 'query' },
    }
  },
  search: () => ({
    text: 'Found 3 matching stories:\n\n1. **#15** - Export to PDF (In Progress)\n2. **#22** - Export CSV data (Ready)\n3. **#31** - Bulk export feature (Backlog)',
    meta: {
      intent: 'search',
      actions: [
        { label: 'View #15', href: '/stories/15' },
        { label: 'View #22', href: '/stories/22' },
        { label: 'View #31', href: '/stories/31' },
      ],
    },
  }),
  action: (message) => {
    const match = message.match(/#?(\d+)/)
    const storyId = match ? match[1] : '1'
    return {
      text: `Done! Story #${storyId} has been updated.`,
      meta: {
        intent: 'action',
        actions: [{ label: `View Story #${storyId}`, href: `/stories/${storyId}` }],
      },
    }
  },
  review: () => ({
    text: 'You have 3 items waiting for review:\n\n1. **#44** - Login flow redesign (High priority)\n2. **#47** - Dashboard widgets (Medium priority)\n3. **#51** - API error handling (Low priority)',
    meta: {
      intent: 'review',
      actions: [
        { label: 'Review #44', href: '/stories/44' },
        { label: 'Review #47', href: '/stories/47' },
        { label: 'Review #51', href: '/stories/51' },
      ],
    },
  }),
  create: () => ({
    text: 'I\'ll help you create a new story. What project should it be for?\n\n- Claims Portal\n- Policy Manager\n- Customer Dashboard',
    meta: {
      intent: 'create',
      actions: [
        { label: 'Claims Portal', action: 'select-project-claims' },
        { label: 'Policy Manager', action: 'select-project-policy' },
      ],
    },
  }),
  capture: () => ({
    text: 'I\'ve analyzed your notes and detected this could be a new story for **Claims Portal**.\n\n**Draft Title:** Implement export validation\n**Draft Description:** Add validation checks before exporting claim data...\n\nWould you like me to create this story?',
    meta: {
      intent: 'capture',
      actions: [
        { label: 'Create Story', action: 'create-story' },
        { label: 'Edit Draft', action: 'edit-draft' },
      ],
    },
  }),
  unknown: () => ({
    text: 'I\'m not sure what you mean. Here are some things I can help with:\n\n- **Navigate**: "Open story #47"\n- **Query**: "What\'s blocked?" or "How\'s Claims Portal?"\n- **Search**: "Find stories about export"\n- **Action**: "Assign #52 to Aisha"\n- **Review**: "What do I need to review?"\n- **Create**: "New story for Claims Portal"',
    meta: { intent: 'unknown' },
  }),
}

export function generateMockResponse(
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  history: ChatMessage[]
): { text: string; meta: ChatResponseMeta } {
  const intent = classifyIntent(message)
  return MOCK_RESPONSES[intent](message)
}
