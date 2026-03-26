import { describe, it, expect } from 'vitest';
import {
  createCustomerSchema,
  updateCustomerSchema,
} from '@/lib/validations/customer';

describe('createCustomerSchema', () => {
  it('should accept valid input with name only', () => {
    const result = createCustomerSchema.safeParse({
      name: 'Acme Corp',
    });
    expect(result.success).toBe(true);
  });

  it('should accept valid input with name and description', () => {
    const result = createCustomerSchema.safeParse({
      name: 'Acme Corp',
      description: 'A leading insurance company',
    });
    expect(result.success).toBe(true);
  });

  it('should accept null description', () => {
    const result = createCustomerSchema.safeParse({
      name: 'Acme Corp',
      description: null,
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty name', () => {
    const result = createCustomerSchema.safeParse({
      name: '',
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing name', () => {
    const result = createCustomerSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should reject name exceeding 100 characters', () => {
    const result = createCustomerSchema.safeParse({
      name: 'A'.repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it('should reject description exceeding 500 characters', () => {
    const result = createCustomerSchema.safeParse({
      name: 'Acme',
      description: 'A'.repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it('should accept name at exactly 100 characters', () => {
    const result = createCustomerSchema.safeParse({
      name: 'A'.repeat(100),
    });
    expect(result.success).toBe(true);
  });

  it('should accept description at exactly 500 characters', () => {
    const result = createCustomerSchema.safeParse({
      name: 'Acme',
      description: 'A'.repeat(500),
    });
    expect(result.success).toBe(true);
  });
});

describe('updateCustomerSchema', () => {
  it('should accept partial updates (name only)', () => {
    const result = updateCustomerSchema.safeParse({
      name: 'Updated Name',
    });
    expect(result.success).toBe(true);
  });

  it('should accept partial updates (description only)', () => {
    const result = updateCustomerSchema.safeParse({
      description: 'Updated description',
    });
    expect(result.success).toBe(true);
  });

  it('should accept isActive boolean', () => {
    const result = updateCustomerSchema.safeParse({
      isActive: false,
    });
    expect(result.success).toBe(true);
  });

  it('should accept empty object (no changes)', () => {
    const result = updateCustomerSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should reject name exceeding 100 characters', () => {
    const result = updateCustomerSchema.safeParse({
      name: 'A'.repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty name when provided', () => {
    const result = updateCustomerSchema.safeParse({
      name: '',
    });
    expect(result.success).toBe(false);
  });
});
