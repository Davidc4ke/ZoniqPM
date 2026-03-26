import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { CustomerList } from '@/components/features/customer-management/customer-list';

export default async function MasterdataPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const roles = (user.privateMetadata?.roles as string[] | undefined) ?? [];
  const role = user.privateMetadata?.role as string | undefined;
  const isAdmin = roles.includes('admin') || role === 'admin';
  const isPM = roles.includes('pm') || role === 'pm';

  if (!isAdmin && !isPM) {
    redirect('/dashboard');
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2D1810]">
            Masterdata
          </h1>
          <p className="mt-1 text-sm text-[#9A948D]">
            Manage customers and their applications
          </p>
        </div>
      </div>
      <CustomerList canManage={isAdmin || isPM} />
    </div>
  );
}
