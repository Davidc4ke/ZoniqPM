import { describe, it, expect } from 'vitest';
import { hasRole, type AuthResult } from '@/lib/auth';

describe('hasRole', () => {
  it('should return true when user has required role', () => {
    const authResult: AuthResult = {
      authorized: true,
      userId: 'user-1',
      roles: ['admin', 'pm'],
    };
    expect(hasRole(authResult, 'admin')).toBe(true);
  });

  it('should return true when user has any of the required roles', () => {
    const authResult: AuthResult = {
      authorized: true,
      userId: 'user-1',
      roles: ['pm'],
    };
    expect(hasRole(authResult, 'admin', 'pm')).toBe(true);
  });

  it('should return false when user has no matching roles', () => {
    const authResult: AuthResult = {
      authorized: true,
      userId: 'user-1',
      roles: ['consultant'],
    };
    expect(hasRole(authResult, 'admin', 'pm')).toBe(false);
  });

  it('should return false when roles is undefined', () => {
    const authResult: AuthResult = {
      authorized: false,
      error: 'Unauthorized',
    };
    expect(hasRole(authResult, 'admin')).toBe(false);
  });

  it('should return false when roles array is empty', () => {
    const authResult: AuthResult = {
      authorized: true,
      userId: 'user-1',
      roles: [],
    };
    expect(hasRole(authResult, 'admin')).toBe(false);
  });
});
