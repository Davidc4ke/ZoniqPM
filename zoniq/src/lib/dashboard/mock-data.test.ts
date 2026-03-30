import { describe, it, expect } from 'vitest'
import {
  getAssignedStories,
  getReviewQueue,
  getProjects,
  getApps,
  getTeamActivity,
} from './mock-data'

describe('mock-data', () => {
  describe('getAssignedStories', () => {
    it('returns an array of assigned stories with required fields', () => {
      const stories = getAssignedStories()
      expect(stories.length).toBeGreaterThan(0)
      for (const story of stories) {
        expect(story).toHaveProperty('id')
        expect(story).toHaveProperty('number')
        expect(story).toHaveProperty('title')
        expect(story).toHaveProperty('status')
        expect(story).toHaveProperty('priority')
        expect(story).toHaveProperty('projectName')
        expect(['high', 'medium', 'low']).toContain(story.priority)
      }
    })
  })

  describe('getReviewQueue', () => {
    it('returns stories with ready or review status only', () => {
      const stories = getReviewQueue()
      expect(stories.length).toBeGreaterThan(0)
      for (const story of stories) {
        expect(['ready', 'review']).toContain(story.status)
      }
    })
  })

  describe('getProjects', () => {
    it('returns projects with progress and column counts', () => {
      const projects = getProjects()
      expect(projects.length).toBeGreaterThan(0)
      for (const project of projects) {
        expect(project).toHaveProperty('name')
        expect(project.progress).toBeGreaterThanOrEqual(0)
        expect(project.progress).toBeLessThanOrEqual(100)
        expect(project.columns).toHaveProperty('backlog')
        expect(project.columns).toHaveProperty('active')
        expect(project.columns).toHaveProperty('testing')
        expect(project.columns).toHaveProperty('review')
        expect(project.columns).toHaveProperty('done')
      }
    })
  })

  describe('getApps', () => {
    it('returns apps with environment statuses', () => {
      const apps = getApps()
      expect(apps.length).toBeGreaterThan(0)
      for (const app of apps) {
        expect(app).toHaveProperty('name')
        expect(app.environments.length).toBeGreaterThan(0)
        for (const env of app.environments) {
          expect(['healthy', 'warning', 'error', 'offline']).toContain(env.status)
        }
      }
    })
  })

  describe('getTeamActivity', () => {
    it('returns activity items with user, action, and time', () => {
      const activities = getTeamActivity()
      expect(activities.length).toBeGreaterThan(0)
      for (const item of activities) {
        expect(item).toHaveProperty('user')
        expect(item.user).toHaveProperty('name')
        expect(item.user).toHaveProperty('initials')
        expect(item).toHaveProperty('action')
        expect(item).toHaveProperty('time')
      }
    })
  })
})
