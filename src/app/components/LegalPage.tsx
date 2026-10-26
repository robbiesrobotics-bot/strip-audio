import Link from "next/link";

export const CONTACT_EMAIL = "[contact email TBD]";

export default function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#F8F7F6] px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-[#1A1A1A] font-bold text-lg tracking-tight">
          MediaFix
        </Link>
        <h1 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight mt-10 mb-8">{title}</h1>
        <div className="space-y-5 text-[#3A3A3A] text-sm leading-relaxed">{children}</div>
        <p className="mt-12 text-xs text-[#9B9B9B]">
          <Link href="/" className="hover:text-[#1A1A1A]">← Back to MediaFix</Link>
        </p>
      </div>
    </main>
  );
}
