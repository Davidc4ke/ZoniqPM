import { describe, it, expect, beforeEach } from 'vitest'
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  resetCustomers,
} from './mock-data'

describe('Customer mock data', () => {
  beforeEach(() => {
    resetCustomers()
  })

  describe('getCustomers', () => {
    it('returns non-deleted customers', () => {
      const customers = getCustomers()
      expect(customers.length).toBe(4)
      expect(customers.every((c) => !c.isDeleted)).toBe(true)
    })
  })

  describe('getCustomerById', () => {
    it('returns a customer by id', () => {
      const customer = getCustomerById('1')
      expect(customer).toBeDefined()
      expect(customer!.name).toBe('Acme Insurance')
    })

    it('returns undefined for non-existent id', () => {
      expect(getCustomerById('999')).toBeUndefined()
    })

    it('returns undefined for deleted customer', () => {
      deleteCustomer('3')
      expect(getCustomerById('3')).toBeUndefined()
    })
  })

  describe('createCustomer', () => {
    it('creates a new customer', () => {
      const customer = createCustomer({ name: 'New Corp', description: 'Desc' }, 'org_test')
      expect(customer.name).toBe('New Corp')
      expect(customer.description).toBe('Desc')
      expect(customer.organizationId).toBe('org_test')
      expect(customer.isDeleted).toBe(false)
      expect(customer.linkedAppsCount).toBe(0)
    })

    it('creates customer without description', () => {
      const customer = createCustomer({ name: 'No Desc' }, 'org_test')
      expect(customer.description).toBeNull()
    })

    it('appears in customer list after creation', () => {
      const before = getCustomers().length
      createCustomer({ name: 'Another' }, 'org_test')
      expect(getCustomers().length).toBe(before + 1)
    })
  })

  describe('updateCustomer', () => {
    it('updates customer name', () => {
      const updated = updateCustomer('1', { name: 'Updated Name' })
      expect(updated).toBeDefined()
      expect(updated!.name).toBe('Updated Name')
    })

    it('updates customer description', () => {
      const updated = updateCustomer('1', { description: 'New description' })
      expect(updated).toBeDefined()
      expect(updated!.description).toBe('New description')
    })

    it('clears description with null', () => {
      const updated = updateCustomer('1', { description: null })
      expect(updated).toBeDefined()
      expect(updated!.description).toBeNull()
    })

    it('returns undefined for non-existent customer', () => {
      expect(updateCustomer('999', { name: 'Test' })).toBeUndefined()
    })
  })

  describe('deleteCustomer', () => {
    it('soft-deletes a customer with no linked apps', () => {
      const result = deleteCustomer('3')
      expect(result.success).toBe(true)
      expect(getCustomerById('3')).toBeUndefined()
    })

    it('prevents deletion of customer with linked apps', () => {
      const result = deleteCustomer('1')
      expect(result.success).toBe(false)
      expect(result.error).toContain('linked apps')
    })

    it('returns error for non-existent customer', () => {
      const result = deleteCustomer('999')
      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })
  })
})
