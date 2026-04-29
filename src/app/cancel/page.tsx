import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="min-h-screen bg-[#F8F7F6] flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#F5A623] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="10" width="3" height="4" rx="1"/>
              <rect x="6.5" y="6" width="3" height="12" rx="1"/>
              <rect x="11" y="3" width="3" height="18" rx="1"/>
              <rect x="15.5" y="7" width="3" height="10" rx="1"/>
              <rect x="20" y="9" width="3" height="6" rx="1"/>
            </svg>
          </div>
          <span className="text-[#1A1A1A] font-bold text-lg tracking-tight">MediaFix</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E3DF] shadow-lg shadow-amber-100/30 p-8 text-center">
          {/* X icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#FFF3E0] border-2 border-[#F5A623]/30 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-[#1A1A1A] mb-2">
            Checkout Cancelled
          </h1>
          <p className="text-[#6B6B6B] text-sm mb-8">
            No worries — your payment wasn&apos;t processed. You can always come back when you&apos;re ready.
          </p>

          <Link
            href="/#pricing"
            className="inline-flex items-center gap-2 bg-[#F5A623] hover:bg-[#D98F1A] text-white font-semibold text-base px-8 py-3.5 rounded-xl transition-all duration-150 shadow-md shadow-amber-200 hover:shadow-lg"
          >
            Back to Pricing
            <span>→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
