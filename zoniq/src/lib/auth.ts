import { auth, clerkClient } from '@clerk/nextjs/server';

export interface AuthResult {
  authorized: boolean;
  userId?: string;
  roles?: string[];
  error?: string;
  status?: number;
}

export async function verifyAuth(): Promise<AuthResult> {
  const { userId } = await auth();
  if (!userId) {
    return { authorized: false, error: 'Unauthorized', status: 401 };
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const roles = (user.privateMetadata?.roles as string[] | undefined) ?? [];
  const role = user.privateMetadata?.role as string | undefined;

  // Merge single role into array if not already present
  const allRoles = role && !roles.includes(role) ? [...roles, role] : roles;

  return { authorized: true, userId, roles: allRoles };
}

export function hasRole(
  authResult: AuthResult,
  ...requiredRoles: string[]
): boolean {
  if (!authResult.roles) return false;
  return requiredRoles.some((r) => authResult.roles!.includes(r));
}
