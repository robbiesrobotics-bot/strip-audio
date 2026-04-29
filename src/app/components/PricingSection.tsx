"use client";

import { useState } from "react";

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export default function PricingSection() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (plan: "pro" | "studio") => {
    setLoading(plan);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout failed");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-28 px-6 bg-[#F8F7F6]">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-16 text-center mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F5A623] mb-3 block">Pricing</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight">Simple pricing.</h2>
          <p className="text-[#6B6B6B] text-sm mt-3">Pay per file on Pro. No subscription required.</p>
        </div>
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto ">
          {/* Free */}
          <div className="bg-white rounded-2xl border border-[#E5E3DF] p-7 flex flex-col">
            <h3 className="text-[#1A1A1A] font-bold text-base mb-1">Free</h3>
            <div className="flex items-baseline gap-1.5 mb-6">
              <span className="text-3xl font-extrabold text-[#1A1A1A]">$0</span>
              <span className="text-[#9B9B9B] text-sm">forever</span>
            </div>
            <ul className="space-y-2.5 flex-1 mb-8">
              {["3 files/month", "MP3 192kbps", "Basic analysis"].map((f, i) => (
                <li key={i} className="text-[#6B6B6B] text-sm flex items-center gap-2.5">
                  <span className="text-[#C8C5BF] shrink-0"><IconCheck /></span>{f}
                </li>
              ))}
            </ul>
            <button className="w-full py-2.5 rounded-xl border border-[#E5E3DF] text-[#6B6B6B] font-medium text-sm hover:bg-[#F8F7F6] transition-colors mt-auto">Get Started</button>
          </div>

          {/* Pro */}
          <div className="relative bg-white rounded-2xl border-2 border-[#F5A623] p-7 flex flex-col shadow-lg shadow-amber-100/50 -mt-2 mb-[-2px]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F5A623] text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wide uppercase">Most Popular</div>
            <h3 className="text-[#1A1A1A] font-bold text-base mb-1">Pro</h3>
            <div className="flex items-baseline gap-1.5 mb-6">
              <span className="text-3xl font-extrabold text-[#1A1A1A]">$4.99</span>
              <span className="text-[#9B9B9B] text-sm">per file</span>
            </div>
            <ul className="space-y-2.5 flex-1 mb-8">
              {["Unlimited files", "MP3 320kbps", "Full filter chain", "Commercial use"].map((f, i) => (
                <li key={i} className="text-[#6B6B6B] text-sm flex items-center gap-2.5">
                  <span className="text-[#F5A623] shrink-0"><IconCheck /></span>{f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout("pro")}
              disabled={loading === "pro"}
              className="w-full py-2.5 rounded-xl bg-[#F5A623] text-white font-semibold text-sm hover:bg-[#D98F1A] transition-colors shadow-md shadow-amber-200/50 mt-auto disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading === "pro" ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Redirecting…
                </>
              ) : "Go Pro"}
            </button>
          </div>

          {/* Studio */}
          <div className="bg-white rounded-2xl border border-[#E5E3DF] p-7 flex flex-col">
            <h3 className="text-[#1A1A1A] font-bold text-base mb-1">Studio</h3>
            <div className="flex items-baseline gap-1.5 mb-6">
              <span className="text-3xl font-extrabold text-[#1A1A1A]">$49</span>
              <span className="text-[#9B9B9B] text-sm">/month</span>
            </div>
            <ul className="space-y-2.5 flex-1 mb-8">
              {["Everything in Pro", "Bulk processing (up to 50)", "API access", "Priority queue"].map((f, i) => (
                <li key={i} className="text-[#6B6B6B] text-sm flex items-center gap-2.5">
                  <span className="text-[#C8C5BF] shrink-0"><IconCheck /></span>{f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout("studio")}
              disabled={loading === "studio"}
              className="w-full py-2.5 rounded-xl border border-[#E5E3DF] text-[#6B6B6B] font-medium text-sm hover:bg-[#F8F7F6] transition-colors mt-auto disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading === "studio" ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-[#9B9B9B]/30 border-t-[#9B9B9B] animate-spin" />
                  Redirecting…
                </>
              ) : "Start Studio"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
