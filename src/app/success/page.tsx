import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

function LoadingFallback() {
  return (
    <main className="min-h-screen bg-[#F8F7F6] flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg">
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
        <div className="bg-white rounded-2xl border border-[#E5E3DF] p-8 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full border-2 border-[#F5A623] border-t-transparent animate-spin" />
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessClient />
    </Suspense>
  );
}
