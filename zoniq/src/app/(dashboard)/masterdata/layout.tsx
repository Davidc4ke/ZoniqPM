import Link from 'next/link';

export default function MasterdataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-[#9A948D]">
        <Link
          href="/dashboard"
          className="transition-colors hover:text-[#2D1810]"
        >
          Home
        </Link>
        <span>/</span>
        <span className="text-[#2D1810]">Masterdata</span>
      </nav>
      {children}
    </div>
  );
}
