import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { customers } from '@/lib/db/schema';
import { CustomerDetail } from '@/components/features/customer-management/customer-detail';

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  const { id } = await params;

  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, id))
    .limit(1);

  if (!customer) {
    notFound();
  }

  // Serialize dates for client component
  const serializedCustomer = {
    ...customer,
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
  };

  return (
    <div>
      {/* Breadcrumbs override */}
      <nav className="-mt-6 mb-6 flex items-center gap-2 text-sm text-[#9A948D]">
        <Link
          href="/dashboard"
          className="transition-colors hover:text-[#2D1810]"
        >
          Home
        </Link>
        <span>/</span>
        <Link
          href="/masterdata"
          className="transition-colors hover:text-[#2D1810]"
        >
          Masterdata
        </Link>
        <span>/</span>
        <span className="text-[#2D1810]">{customer.name}</span>
      </nav>

      <CustomerDetail
        customer={serializedCustomer}
        canManage={isAdmin || isPM}
      />
    </div>
  );
}
