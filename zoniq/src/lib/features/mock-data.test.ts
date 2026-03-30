import { describe, it, expect, beforeEach } from 'vitest'
import {
  getFeaturesByModuleId,
  getFeatureById,
  createFeature,
  updateFeature,
  deleteFeature,
  getLinkedStoriesByFeatureId,
  resetFeatures,
} from './mock-data'

describe('Feature mock data', () => {
  beforeEach(() => {
    resetFeatures()
  })

  describe('getFeaturesByModuleId', () => {
    it('should return features for a given module', () => {
      const features = getFeaturesByModuleId('mod-1-1')
      expect(features.length).toBeGreaterThan(0)
      features.forEach((f) => {
        expect(f.moduleId).toBe('mod-1-1')
        expect(f.isDeleted).toBe(false)
      })
    })

    it('should not return deleted features', () => {
      // Create a feature with no linked stories so it can be deleted
      const feat = createFeature('mod-1-1', '1', { name: 'Deletable' })
      const before = getFeaturesByModuleId('mod-1-1')
      deleteFeature(feat.id)
      const afterDelete = getFeaturesByModuleId('mod-1-1')
      expect(afterDelete.length).toBe(before.length - 1)
      expect(afterDelete.find((f) => f.id === feat.id)).toBeUndefined()
    })

    it('should return empty array for unknown module', () => {
      const features = getFeaturesByModuleId('unknown')
      expect(features).toEqual([])
    })
  })

  describe('getFeatureById', () => {
    it('should return a feature by id', () => {
      const features = getFeaturesByModuleId('mod-1-1')
      const found = getFeatureById(features[0].id)
      expect(found).toBeDefined()
      expect(found?.id).toBe(features[0].id)
    })

    it('should not return a deleted feature', () => {
      const feat = createFeature('mod-1-1', '1', { name: 'ToDelete' })
      deleteFeature(feat.id)
      const found = getFeatureById(feat.id)
      expect(found).toBeUndefined()
    })

    it('should return undefined for unknown id', () => {
      const found = getFeatureById('nonexistent')
      expect(found).toBeUndefined()
    })
  })

  describe('createFeature', () => {
    it('should create a new feature with name and description', () => {
      const feat = createFeature('mod-1-1', '1', { name: 'New Feature', description: 'Test desc' })
      expect(feat.id).toBeDefined()
      expect(feat.moduleId).toBe('mod-1-1')
      expect(feat.appId).toBe('1')
      expect(feat.name).toBe('New Feature')
      expect(feat.description).toBe('Test desc')
      expect(feat.linkedStoriesCount).toBe(0)
      expect(feat.isDeleted).toBe(false)
      expect(feat.createdAt).toBeDefined()
      expect(feat.updatedAt).toBeDefined()
    })

    it('should create a feature without description', () => {
      const feat = createFeature('mod-1-1', '1', { name: 'No Desc Feature' })
      expect(feat.name).toBe('No Desc Feature')
      expect(feat.description).toBeNull()
    })

    it('should be retrievable after creation', () => {
      const feat = createFeature('mod-1-1', '1', { name: 'Retrievable' })
      const found = getFeatureById(feat.id)
      expect(found).toBeDefined()
      expect(found?.name).toBe('Retrievable')
    })

    it('should appear in module feature list after creation', () => {
      const before = getFeaturesByModuleId('mod-1-1')
      createFeature('mod-1-1', '1', { name: 'Extra Feature' })
      const after = getFeaturesByModuleId('mod-1-1')
      expect(after.length).toBe(before.length + 1)
    })
  })

  describe('updateFeature', () => {
    it('should update feature name', () => {
      const features = getFeaturesByModuleId('mod-1-1')
      const updated = updateFeature(features[0].id, { name: 'Updated Name' })
      expect(updated).toBeDefined()
      expect(updated?.name).toBe('Updated Name')
    })

    it('should update feature description', () => {
      const features = getFeaturesByModuleId('mod-1-1')
      const updated = updateFeature(features[0].id, { description: 'New desc' })
      expect(updated).toBeDefined()
      expect(updated?.description).toBe('New desc')
    })

    it('should clear description with null', () => {
      const features = getFeaturesByModuleId('mod-1-1')
      const updated = updateFeature(features[0].id, { description: null })
      expect(updated).toBeDefined()
      expect(updated?.description).toBeNull()
    })

    it('should update updatedAt timestamp', () => {
      const features = getFeaturesByModuleId('mod-1-1')
      const updated = updateFeature(features[0].id, { name: 'Timestamp Test' })
      expect(updated?.updatedAt).toBeDefined()
      expect(new Date(updated!.updatedAt).toISOString()).toBe(updated!.updatedAt)
    })

    it('should return undefined for nonexistent id', () => {
      const updated = updateFeature('nonexistent', { name: 'Nope' })
      expect(updated).toBeUndefined()
    })

    it('should return undefined for deleted feature', () => {
      const feat = createFeature('mod-1-1', '1', { name: 'WillDelete' })
      deleteFeature(feat.id)
      const updated = updateFeature(feat.id, { name: 'Nope' })
      expect(updated).toBeUndefined()
    })
  })

  describe('deleteFeature (soft-delete)', () => {
    it('should soft-delete a feature with no linked stories', () => {
      const feat = createFeature('mod-1-1', '1', { name: 'Deletable' })
      const result = deleteFeature(feat.id)
      expect(result.success).toBe(true)
    })

    it('should fail for nonexistent feature', () => {
      const result = deleteFeature('nonexistent')
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should fail for already deleted feature', () => {
      const feat = createFeature('mod-1-1', '1', { name: 'DeleteTwice' })
      deleteFeature(feat.id)
      const result = deleteFeature(feat.id)
      expect(result.success).toBe(false)
    })

    it('should make feature invisible in list and getById', () => {
      const feat = createFeature('mod-1-1', '1', { name: 'Invisible' })
      deleteFeature(feat.id)
      expect(getFeatureById(feat.id)).toBeUndefined()
      expect(getFeaturesByModuleId('mod-1-1').find((f) => f.id === feat.id)).toBeUndefined()
    })

    it('should prevent deletion of feature with linked stories', () => {
      // Pre-seeded features have linkedStoriesCount > 0
      const features = getFeaturesByModuleId('mod-1-1')
      const featWithStories = features.find((f) => f.linkedStoriesCount > 0)
      if (featWithStories) {
        const result = deleteFeature(featWithStories.id)
        expect(result.success).toBe(false)
        expect(result.error).toContain('linked stories')
      }
    })
  })

  describe('getLinkedStoriesByFeatureId', () => {
    it('should return linked stories for a feature', () => {
      const features = getFeaturesByModuleId('mod-1-1')
      const featWithStories = features.find((f) => f.linkedStoriesCount > 0)
      if (featWithStories) {
        const stories = getLinkedStoriesByFeatureId(featWithStories.id)
        expect(stories.length).toBe(featWithStories.linkedStoriesCount)
        stories.forEach((s) => {
          expect(s.id).toBeDefined()
          expect(s.title).toBeDefined()
          expect(s.status).toBeDefined()
          expect(s.projectName).toBeDefined()
        })
      }
    })

    it('should return empty array for feature with no linked stories', () => {
      const feat = createFeature('mod-1-1', '1', { name: 'No Stories' })
      const stories = getLinkedStoriesByFeatureId(feat.id)
      expect(stories).toEqual([])
    })

    it('should return empty array for unknown feature', () => {
      const stories = getLinkedStoriesByFeatureId('nonexistent')
      expect(stories).toEqual([])
    })
  })

  describe('resetFeatures', () => {
    it('should restore original state', () => {
      const before = getFeaturesByModuleId('mod-1-1').length
      createFeature('mod-1-1', '1', { name: 'Extra' })
      resetFeatures()
      const after = getFeaturesByModuleId('mod-1-1').length
      expect(after).toBe(before)
    })
  })
})
