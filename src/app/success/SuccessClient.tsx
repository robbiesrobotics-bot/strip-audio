"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SessionData {
  customerName: string | null;
  customerEmail: string | null;
  plan: string | null;
  amount: string | null;
  date: string | null;
}

function IconCheck() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.removeItem("mediafix-upload-session");

    if (!sessionId) {
      setError("No session ID found.");
      setLoading(false);
      return;
    }

    fetch(`/api/checkout?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setSession(data);
      })
      .catch(() => setError("Failed to load session."))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const planLabel = session?.plan
    ? session.plan.charAt(0).toUpperCase() + session.plan.slice(1)
    : null;

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

        <div className="bg-white rounded-2xl border border-[#E5E3DF] shadow-lg shadow-amber-100/30 p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
              <IconCheck />
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-[#1A1A1A] text-center mb-2">
            Payment Successful!
          </h1>
          <p className="text-[#6B6B6B] text-sm text-center mb-8">
            Thank you for your purchase. A confirmation email has been sent.
          </p>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 rounded-full border-2 border-[#F5A623] border-t-transparent animate-spin" />
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {!loading && session && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#E5E3DF] bg-[#F8F7F6] p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9B9B9B]">Name</span>
                  <span className="text-[#1A1A1A] font-medium">{session.customerName ?? "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9B9B9B]">Plan</span>
                  <span className="text-[#F5A623] font-semibold">{planLabel ?? "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9B9B9B]">Amount</span>
                  <span className="text-[#1A1A1A] font-medium">${session.amount ?? "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9B9B9B]">Date</span>
                  <span className="text-[#1A1A1A] font-medium">{session.date ?? "—"}</span>
                </div>
              </div>

              <p className="text-xs text-[#9B9B9B] text-center">
                A confirmation email has been sent to {session.customerEmail ?? "your email"}.
              </p>

              <a
                href="/"
                className="w-full py-3.5 rounded-xl bg-[#F5A623] hover:bg-[#D98F1A] text-white font-semibold text-base transition-colors flex items-center justify-center gap-2 shadow-md shadow-amber-200"
              >
                Open MediaFix
                <span>→</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
