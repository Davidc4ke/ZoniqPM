import { describe, it, expect } from 'vitest'
import { classifyIntent, generateMockResponse } from './chat-service'

describe('classifyIntent', () => {
  it('classifies navigate commands', () => {
    expect(classifyIntent('Open #47')).toBe('navigate')
    expect(classifyIntent('open story #12')).toBe('navigate')
    expect(classifyIntent('go to story 5')).toBe('navigate')
    expect(classifyIntent('show me story #3')).toBe('navigate')
  })

  it('classifies query commands', () => {
    expect(classifyIntent("What's blocked?")).toBe('query')
    expect(classifyIntent("How's Claims Portal?")).toBe('query')
    expect(classifyIntent('What is the status of project X?')).toBe('query')
    expect(classifyIntent('What do I need to work on?')).toBe('query')
  })

  it('classifies search commands', () => {
    expect(classifyIntent('Find stories about export')).toBe('search')
    expect(classifyIntent('search stories with auth')).toBe('search')
    expect(classifyIntent('show me stories for Claims Portal')).toBe('search')
    expect(classifyIntent('list all stories')).toBe('search')
  })

  it('classifies action commands', () => {
    expect(classifyIntent('Assign #52 to Aisha')).toBe('action')
    expect(classifyIntent('move #47 to in progress')).toBe('action')
    expect(classifyIntent('update status')).toBe('action')
  })

  it('classifies review commands', () => {
    expect(classifyIntent('What do I need to review?')).toBe('review')
    expect(classifyIntent('review queue')).toBe('review')
    expect(classifyIntent('my reviews')).toBe('review')
  })

  it('classifies create commands', () => {
    expect(classifyIntent('Create a new story')).toBe('create')
    expect(classifyIntent('new ticket for Claims Portal')).toBe('create')
    expect(classifyIntent('add story')).toBe('create')
  })

  it('classifies multi-line input as capture', () => {
    expect(classifyIntent('Meeting notes\nClient wants export feature')).toBe('capture')
  })

  it('returns unknown for unrecognized input', () => {
    expect(classifyIntent('hello')).toBe('unknown')
    expect(classifyIntent('thanks')).toBe('unknown')
  })
})

describe('generateMockResponse', () => {
  it('returns navigate response with story link', () => {
    const result = generateMockResponse('Open #47', [])
    expect(result.text).toContain('#47')
    expect(result.meta.intent).toBe('navigate')
    expect(result.meta.actions).toBeDefined()
    expect(result.meta.actions![0].href).toBe('/stories/47')
  })

  it('returns blocked stories for blocked query', () => {
    const result = generateMockResponse("What's blocked?", [])
    expect(result.text).toContain('blocked')
    expect(result.meta.intent).toBe('query')
    expect(result.meta.actions).toBeDefined()
  })

  it('returns project status for status query', () => {
    const result = generateMockResponse("How's Claims Portal?", [])
    expect(result.text).toContain('Claims Portal')
    expect(result.meta.intent).toBe('query')
  })

  it('returns search results', () => {
    const result = generateMockResponse('Find stories about export', [])
    expect(result.text).toContain('matching stories')
    expect(result.meta.intent).toBe('search')
  })

  it('returns action confirmation', () => {
    const result = generateMockResponse('Assign #52 to Aisha', [])
    expect(result.text).toContain('#52')
    expect(result.meta.intent).toBe('action')
  })

  it('returns review queue', () => {
    const result = generateMockResponse('What do I need to review?', [])
    expect(result.text).toContain('review')
    expect(result.meta.intent).toBe('review')
  })

  it('returns create prompt', () => {
    const result = generateMockResponse('Create a new story', [])
    expect(result.meta.intent).toBe('create')
  })

  it('returns capture analysis for multi-line input', () => {
    const result = generateMockResponse('Meeting notes\nWant export feature', [])
    expect(result.meta.intent).toBe('capture')
  })

  it('returns help for unknown input', () => {
    const result = generateMockResponse('hello there', [])
    expect(result.meta.intent).toBe('unknown')
    expect(result.text).toContain('help with')
  })
})
