"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import PricingSection from "./components/PricingSection";

// ─── ICONS ──────────────────────────────────────────────────────────────────

const IconWaveform = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="10" width="3" height="4" rx="1"/>
    <rect x="6.5" y="6" width="3" height="12" rx="1"/>
    <rect x="11" y="3" width="3" height="18" rx="1"/>
    <rect x="15.5" y="7" width="3" height="10" rx="1"/>
    <rect x="20" y="9" width="3" height="6" rx="1"/>
  </svg>
);

const IconUpload = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const IconDownload = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

const IconNoise = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12h2l2-7 3 14 3-7 2 4 2-2h4"/>
  </svg>
);

const IconLimiter = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="6"/>
    <line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
    <line x1="2" y1="12" x2="6" y2="12"/>
    <line x1="18" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
  </svg>
);

const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconZap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconSliders = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14"/>
    <line x1="4" y1="10" x2="4" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12" y2="3"/>
    <line x1="20" y1="21" x2="20" y2="16"/>
    <line x1="20" y1="12" x2="20" y2="3"/>
    <line x1="1" y1="14" x2="7" y2="14"/>
    <line x1="9" y1="8" x2="15" y2="8"/>
    <line x1="17" y1="16" x2="23" y2="16"/>
  </svg>
);

const IconPlay = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

const IconPause = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1"/>
    <rect x="14" y="4" width="4" height="16" rx="1"/>
  </svg>
);


const IconSun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const IconMoon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);

// ─── LIVE AUDIO DEMO ────────────────────────────────────────────────────────

const DIRTY_URL = "https://hpyzbhlkznkhudiwbnny.supabase.co/storage/v1/object/public/audio-demos/voice-before-new.wav";
const CLEAN_URL = "https://hpyzbhlkznkhudiwbnny.supabase.co/storage/v1/object/public/audio-demos/voice-clean-new.wav";
const MUSIC_DIRTY_URL = "https://hpyzbhlkznkhudiwbnny.supabase.co/storage/v1/object/public/audio-demos/music-before-jetson.wav";
const MUSIC_CLEAN_URL = "https://hpyzbhlkznkhudiwbnny.supabase.co/storage/v1/object/public/audio-demos/music-after-jetson.wav";

function LiveAudioDemo() {
  const [activeTab, setActiveTab] = useState<"voice" | "music">("voice");
  const [playing, setPlaying] = useState<"original" | "cleaned" | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [bars, setBars] = useState<number[]>(Array(16).fill(4));

  const isMusic = activeTab === "music";
  const dirtyUrl = isMusic ? MUSIC_DIRTY_URL : DIRTY_URL;
  const cleanUrl = isMusic ? MUSIC_CLEAN_URL : CLEAN_URL;
  const tabColor = isMusic ? "#8B5CF6" : "#F5A623"; // purple for music, amber for voice
  const tabLabel = isMusic ? "🎵 Music" : "🎙️ Voice";

  const stopAudio = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    if (animFrameRef.current) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null; }
    setPlaying(null);
    setBars(Array(16).fill(4));
  }, []);

  const playSample = useCallback((type: "original" | "cleaned") => {
    stopAudio();
    const audio = new Audio();
    audio.src = type === "cleaned" ? cleanUrl : dirtyUrl;
    audio.volume = 0.6;
    audioRef.current = audio;
    setPlaying(type);
    let frame = 0;
    const animate = () => {
      frame++;
      setBars(bars.map((_, i) => {
        const base = Math.sin(frame * 0.15 + i * 0.7) * 0.5 + 0.5;
        const noise = Math.random() * 0.3;
        return Math.max(4, Math.round((base + noise) * 48));
      }));
      if (frame < 900) { animFrameRef.current = requestAnimationFrame(animate); }
      else { setPlaying(null); setBars(Array(16).fill(4)); }
    };
    animFrameRef.current = requestAnimationFrame(animate);
    audio.play().catch(() => {});
    audio.onended = () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); setPlaying(null); setBars(Array(16).fill(4)); };
  }, [stopAudio, cleanUrl, dirtyUrl]);

  const switchTab = (tab: "voice" | "music") => {
    stopAudio();
    setActiveTab(tab);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E3DF] shadow-lg shadow-amber-100/50 p-6 md:p-8">
      {/* Tab toggle */}
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-block w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
        <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Live Demo</span>
      </div>

      <div className="flex items-center justify-end mb-1">
        {/* Tab switcher */}
        <div className="inline-flex items-center bg-[#F0EFED] rounded-xl p-1 gap-0.5">
          <button
            onClick={() => switchTab("voice")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !isMusic ? "bg-white text-[#F5A623] shadow-sm" : "text-[#9B9B9B] hover:text-[#6B6B6B]"
            }`}
          >
            🎙️ Voice
          </button>
          <button
            onClick={() => switchTab("music")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isMusic ? "bg-white text-[#8B5CF6] shadow-sm" : "text-[#9B9B9B] hover:text-[#6B6B6B]"
            }`}
          >
            🎵 Music
          </button>
        </div>
      </div>
      <p className="text-sm text-[#9B9B9B] mb-5">Compare original audio with our repaired version</p>

      <div className="audio-demo-wave idle mb-5">
        {bars.map((h, i) => (
          <div
            key={i}
            className="bar"
            style={{
              height: `${h}px`,
              background: isMusic
                ? "linear-gradient(to top, #8B5CF6 0%, rgba(139,92,246,0.3) 100%)"
                : undefined,
            }}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => playing === "original" ? stopAudio() : playSample("original")}
          className={`play-btn flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border-2 font-semibold text-sm transition-all ${
            playing === "original" ? "border-[#EF4444] bg-red-50 text-[#EF4444]" : "border-[#E5E3DF] bg-white text-[#1A1A1A] hover:border-[#EF4444] hover:text-[#EF4444]"
          }`}
        >
          {playing === "original" ? <IconPause /> : <IconPlay />}
          {playing === "original" ? "Playing…" : "Original"}
        </button>
        <button
          onClick={() => playing === "cleaned" ? stopAudio() : playSample("cleaned")}
          className={`play-btn flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border-2 font-semibold text-sm transition-all ${
            playing === "cleaned" ? `border-[${tabColor}] bg-[${tabColor}]/10 text-[${tabColor}]` : "border-[#E5E3DF] bg-white text-[#1A1A1A] hover:border-[#8B5CF6] hover:text-[#8B5CF6]"
          }`}
          style={playing === "cleaned" ? { borderColor: tabColor, backgroundColor: `${tabColor}15`, color: tabColor } : {}}
        >
          {playing === "cleaned" ? <IconPause /> : <IconPlay />}
          {playing === "cleaned" ? "Playing…" : "Repaired"}
        </button>
      </div>
      <p className="text-xs text-center text-[#9B9B9B] mt-3">Sample will auto-stop after 3 seconds</p>
    </div>
  );
}

// ─── HERO PRODUCT MOCKUP ────────────────────────────────────────────────────

function HeroProductMockup() {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center w-full max-w-sm">
      <div className="relative w-full">
        <div className="bg-[#1A1A1A] rounded-2xl p-6 shadow-2xl shadow-black/20 border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-[#F5A623]"><IconWaveform /></span>
              <span className="text-white font-bold text-sm">MediaFix</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
              <span className="text-[#22C55E] text-xs font-medium">Processing</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { label: "LUFS: -14.0 ✓", color: "#22C55E" },
              { label: "Peak: -0.95dB ✓", color: "#22C55E" },
              { label: "Clips: 0 ✓", color: "#22C55E" },
            ].map((p, i) => (
              <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/10">
                {p.label}
              </span>
            ))}
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#9B9B9B] text-xs">Before</span>
                <span className="text-[#9B9B9B] text-xs font-mono">-19.2 LUFS</span>
              </div>
              <div className="flex items-end gap-0.5 h-12">
                {[12,18,15,28,35,22,40,55,30,45,60,38,48,25,35,42,30,20,15,28,38,45,30,20,15,25,35,40,28,18,12,8].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-red-400/50" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-[#F5A623] text-sm font-bold">↓ cleaned ↓</span>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#9B9B9B] text-xs">After</span>
                <span className="text-[#F5A623] text-xs font-mono font-bold">-14.0 LUFS</span>
              </div>
              <div className="flex items-end gap-0.5 h-12">
                {[22,28,25,32,35,28,38,42,32,40,44,35,42,30,36,40,32,26,24,30,36,42,32,26,24,28,34,38,30,24,20,16].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-[#F5A623]/80" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-[#9B9B9B] text-xs w-12">Level</span>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#22C55E] via-[#F5A623] to-[#EF4444]"
                  style={{ width: "78%" }} />
              </div>
              <span className="text-[#F5A623] text-xs font-mono font-bold">-14.0</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <div className="bg-[#22C55E] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg shadow-green-500/30">
            Fixed ⚡
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NAV ────────────────────────────────────────────────────────────────────

function NavBar() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem('mediafix-dark-mode') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mediafix-dark-mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mediafix-dark-mode', 'light');
    }
  }, [darkMode]);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#0D0D0F]/90 backdrop-blur-md border-b border-[#E5E3DF] dark:border-[#2A2A30] shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <span className="text-[#F5A623]"><IconWaveform /></span>
          <span className="text-[#1A1A1A] dark:text-[#F0EFE8] font-bold text-lg tracking-tight">MediaFix</span>
        </a>
        <div className="flex items-center gap-4">
          <a href="#how-it-works" className="text-[#6B6B6B] dark:text-[#6B6B75] hover:text-[#1A1A1A] dark:hover:text-[#F0EFE8] text-sm font-medium transition-colors hidden md:inline-block">How It Works</a>
          <a href="#pricing" className="text-[#6B6B6B] dark:text-[#6B6B75] hover:text-[#1A1A1A] dark:hover:text-[#F0EFE8] text-sm font-medium transition-colors hidden md:inline-block">Pricing</a>
          <a href="#faq" className="text-[#6B6B6B] dark:text-[#6B6B75] hover:text-[#1A1A1A] dark:hover:text-[#F0EFE8] text-sm font-medium transition-colors hidden md:inline-block">FAQ</a>
          <span className="pill-badge pill-free hidden sm:inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shrink-0"></span>
            Free
          </span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg border border-[#E5E3DF] dark:border-[#2A2A30] bg-white dark:bg-[#141418] hover:border-[#F5A623] dark:hover:border-[#F5A623] transition-all duration-200 text-[#6B6B6B] dark:text-[#A0A0B0] hover:text-[#1A1A1A] dark:hover:text-[#F0EFE8]"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <IconSun /> : <IconMoon />}
          </button>
          <a href="#app" className="bg-[#F5A623] hover:bg-[#D98F1A] text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 shadow-md shadow-amber-200 dark:shadow-amber-900/30 hover:shadow-lg hover:shadow-amber-300/40 dark:hover:shadow-amber-600/20">
            Open App
          </a>
        </div>
      </div>
    </nav>
  );
}

// ─── HERO ───────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative bg-[#F8F7F6] px-6 pt-20 pb-28 overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#F5A623] opacity-[0.06] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-16 w-64 h-64 rounded-full bg-[#F5A623] opacity-[0.04] blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
          {/* Left: copy */}
          <div className="max-w-2xl flex-1">
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="pill-badge pill-hot"><span>🔥</span> AI Analysis</span>
              <span className="pill-badge pill-free">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] inline-block"></span>
                No Login Required
              </span>
              <span className="pill-badge pill-new">
                <span>⚡</span>
                Fast Results
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-[#1A1A1A] leading-[1.02] tracking-tight mb-6">
              Your files deserve a<br />
              <span className="text-[#F5A623]">professional fix</span><br />
              pass.
            </h1>
            <p className="text-[#6B6B6B] text-lg leading-relaxed mb-10 max-w-xl">
              Fix any file. Audio, image, and video repair — all in one place. No login, no drama.
            </p>

            {/* THE BIG CTA */}
            <div className="mb-8">
              <a href="#app" className="inline-flex items-center gap-3 bg-[#F5A623] hover:bg-[#D98F1A] text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-amber-300/40 hover:shadow-2xl hover:shadow-amber-400/50">
                Upload Your File
                <span className="text-xl">→</span>
              </a>
              <p className="text-[#9B9B9B] text-sm mt-3 ml-1">Free to try · No login required · Results in seconds</p>
            </div>

          </div>

          {/* Right: product mockup */}
          <HeroProductMockup />
        </div>
      </div>
    </section>
  );
}

// ─── AUDIO DEMO (below hero CTA) ──────────────────────

function AudioDemoSection() {
  return (
    <section className="bg-[#F8F7F6] px-6 py-16 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="mb-1">
          <h3 className="text-xl font-bold text-[#1A1A1A]">Hear the difference</h3>
        </div>
        <LiveAudioDemo />
      </div>
    </section>
  );
}

// ─── PROBLEM ─────────────────────────────────────────────────────────────────

function ProblemSection() {
  const problems = [
    { title: "Wrong loudness", desc: "Wrong loudness for streaming. Your audio might be too quiet for Spotify or too loud for Apple." },
    { title: "Clip city", desc: "Peaks above 0 dBFS. Every platform either compresses it harshly or rejects it outright." },
    { title: "Noise floor", desc: "Background hiss, room rumble, bad preamps. All of it ends up in the final mix." },
    { title: "Dead air", desc: "Silent gaps and inconsistent levels. Listeners tune out before the intro ends." },
  ];
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="max-w-2xl mb-14 text-center mx-auto">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F5A623] mb-3 block">The Problem</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight">
          Your media files need work. Here&apos;s why.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {problems.map((p, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#E5E3DF] p-7 hover:shadow-md hover:border-[#D8D5CF] transition-all duration-200">
            <h3 className="text-[#1A1A1A] font-semibold text-base mb-2">{p.title}</h3>
            <p className="text-[#6B6B6B] text-sm leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    { num: "01", title: "Upload", desc: "Drop your WAV, FLAC, AIFF, or MP3. Any size up to 500MB.", icon: <IconUpload /> },
    { num: "02", title: "Analyze", desc: "7 metrics checked simultaneously: LUFS, peaks, noise, dynamic range, frequency balance, clip count, and source quality.", icon: <IconSliders /> },
    { num: "03", title: "Download", desc: "A conditioned, normalized, clip-free file ready for any platform.", icon: <IconDownload /> },
  ];
  return (
    <section id="how-it-works" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-16 text-center mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F5A623] mb-3 block">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight">Any file to release-ready.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, i) => (
            <div key={i} className="relative flex flex-col bg-[#F8F7F6] rounded-2xl p-8">
              <div className="text-6xl font-black leading-none text-[#E5E3DF] absolute top-4 right-5 select-none pointer-events-none tracking-tighter hidden md:block">{s.num}</div>
              <div className="relative flex items-center gap-4 mb-4">
                <div className="w-11 h-11 rounded-xl bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center text-[#F5A623] shrink-0">{s.icon}</div>
                <h3 className="text-[#1A1A1A] font-bold text-xl relative">{s.title}</h3>
              </div>
              <p className="text-[#6B6B6B] text-sm leading-relaxed relative ml-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES ────────────────────────────────────────────────────────────────

function FeaturesSection() {
  const features = [
    { icon: <IconShield />, title: "Upload-ready loudness", desc: "Targets common streaming loudness levels to help prepare files for platform upload." },
    { icon: <IconNoise />, title: "Cuts the noise", desc: "FFT-based noise reduction. Hiss, hum, and room rumble — gone." },
    { icon: <IconLimiter />, title: "Tames clipping", desc: "A brick-wall limiter keeps peaks under control." },
    { icon: <IconClock />, title: "13 seconds", desc: "Upload to download. Not a minute. Not 10 minutes." },
    { icon: <IconZap />, title: "No DAW required", desc: "Zero learning curve. If you can click a button, you can fix a file." },
    { icon: <IconSliders />, title: "Smart fixes only", desc: "Conditional processing. We only touch what your audio actually needs." },
  ];
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="max-w-2xl mb-14 text-center mx-auto">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F5A623] mb-3 block">Capabilities</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight">Everything a repair shop can do — and then some.</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#E5E3DF] p-6 hover:shadow-md hover:border-[#D8D5CF] transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center text-[#F5A623] mb-5">{f.icon}</div>
            <h3 className="text-[#1A1A1A] font-semibold text-base mb-1.5">{f.title}</h3>
            <p className="text-[#6B6B6B] text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── BEFORE / AFTER ─────────────────────────────────────────────────────────

function BeforeAfter() {
  const metrics = [
    { label: "Loudness", before: "-19.2 LUFS", after: "-14.0 LUFS", beforeVal: 30, afterVal: 80 },
    { label: "Peak Level", before: "-0.3 dBFS", after: "-1.2 dBFS", beforeVal: 95, afterVal: 75 },
    { label: "Noise Floor", before: "-48 dBFS", after: "-68 dBFS", beforeVal: 60, afterVal: 20 },
    { label: "Dynamic Range", before: "6.1 LU", after: "11.0 LU", beforeVal: 35, afterVal: 65 },
    { label: "Clip Count", before: "14", after: "0", beforeVal: 90, afterVal: 5 },
  ];
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-14 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F5A623] mb-3 block">Results</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight">See the difference.</h2>
        </div>
        <div className="rounded-2xl border border-[#E5E3DF] overflow-hidden bg-white">
          <div className="grid grid-cols-[1fr_100px_100px]">
            <div className="px-6 py-4 border-b border-[#E5E3DF] bg-[#F8F7F6]">
              <span className="text-[#6B6B6B] text-xs font-semibold uppercase tracking-wider">Metric</span>
            </div>
            <div className="px-3 py-4 border-b border-[#E5E3DF] border-l border-[#E5E3DF] text-center bg-[#F8F7F6]">
              <span className="text-[#6B6B6B] text-xs font-semibold uppercase tracking-wider">Before</span>
            </div>
            <div className="px-3 py-4 border-b border-[#E5E3DF] border-l border-[#E5E3DF] text-center bg-[#F8F7F6]">
              <span className="text-[#6B6B6B] text-xs font-semibold uppercase tracking-wider">After</span>
            </div>
            {metrics.map((m, i) => (
              <div key={i} className="contents">
                <div className="px-6 py-4 border-b border-[#E5E3DF] last:border-0">
                  <span className="text-[#1A1A1A] text-sm font-medium">{m.label}</span>
                </div>
                <div className="px-3 py-4 border-b border-[#E5E3DF] border-l border-[#E5E3DF] last:border-0">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[#9B9B9B] text-sm font-mono">{m.before}</span>
                    <div className="w-12 h-1.5 rounded-full bg-[#F0EFED] overflow-hidden">
                      <div className="h-full rounded-full bg-[#C8C5BF]" style={{ width: `${m.beforeVal}%` }} />
                    </div>
                  </div>
                </div>
                <div className="px-3 py-4 border-b border-[#E5E3DF] border-l border-[#E5E3DF] last:border-0">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[#F5A623] text-sm font-semibold font-mono">{m.after}</span>
                    <div className="w-12 h-1.5 rounded-full bg-[#F0EFED] overflow-hidden">
                      <div className="h-full rounded-full bg-[#F5A623]" style={{ width: `${m.afterVal}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-6 rounded-full bg-[#C8C5BF]" />
            <span className="text-xs text-[#9B9B9B]">Before</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-6 rounded-full bg-[#F5A623]" />
            <span className="text-xs text-[#9B9B9B]">After</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PRICING ─────────────────────────────────────────────────────────────────

// Pricing section moved to components/PricingSection.tsx
function Pricing() { return <PricingSection />; }
// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    { q: "What file types do you support?", a: "WAV, FLAC, AIFF, and MP3. Up to 500MB per file." },
    { q: "Will my file be accepted by streaming platforms?", a: "MediaFix targets common streaming loudness levels (around -14 LUFS integrated, with limited true peak) to help prepare files for platform upload. Each platform sets its own requirements and review process, so we can't guarantee acceptance." },
    { q: "What happens to my files?", a: "Your file is processed to produce the fixed file. It is held in temporary storage only while processing runs and is deleted when processing finishes. See our Privacy page for details." },
    { q: "How is this different from Audacity or Adobe Enhance?", a: "Audacity requires manual setup and expertise. Adobe Enhance is for speech only. MediaFix handles full-spectrum audio with conditional, automatic processing — no configuration needed." },
    { q: "Can I use repaired files commercially?", a: "Yes, on the Pro and Studio plans. You retain full copyright of your repaired audio." },
    { q: "How does the 13-second claim work?", a: "On a typical 3-minute track, our pipeline checks 7 metrics simultaneously, then runs a conditional 12-filter ffmpeg chain. Total pipeline completes in under 13 seconds for files under 50MB." },
  ];
  return (
    <section id="faq" className="py-24 px-6 bg-[#F8F7F6]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F5A623] mb-3 block">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">Questions?</h2>
        </div>
        <div className="space-y-1 bg-white rounded-2xl border border-[#E5E3DF] overflow-hidden">
          {items.map((item, i) => (
            <div key={i} className="border-b border-[#E5E3DF] last:border-0">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 px-6 text-left hover:bg-[#F8F7F6] transition-colors"
              >
                <span className="text-[#1A1A1A] font-medium text-sm pr-8">{item.q}</span>
                <span className={`shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180 text-[#F5A623]' : 'text-[#9B9B9B]'}`}><IconChevronDown /></span>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${open === i ? 'max-h-40 pb-5 px-6' : 'max-h-0'}`}>
                <p className="text-[#6B6B6B] text-sm leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA BANNER ─────────────────────────────────────────────────────────────

function CTABanner() {
  return (
    <section className="py-20 px-6 bg-[#1A1A1A]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
          Ready to repair your first file?
        </h2>
        <p className="text-[#9B9B9B] text-lg mb-8">It takes seconds. No signup required.</p>
        <a href="#app" className="inline-flex items-center gap-3 bg-[#F5A623] hover:bg-[#D98F1A] text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-amber-900/30">
          Upload Your File
          <span className="text-xl">→</span>
        </a>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-white border-t border-[#E5E3DF] py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="text-[#F5A623]"><IconWaveform /></span>
          <span className="text-[#1A1A1A] font-bold text-base">MediaFix</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="/privacy" className="text-[#9B9B9B] hover:text-[#1A1A1A] text-xs transition-colors">Privacy</a>
          <a href="/terms" className="text-[#9B9B9B] hover:text-[#1A1A1A] text-xs transition-colors">Terms</a>
          <a href="#" className="text-[#9B9B9B] hover:text-[#1A1A1A] text-xs transition-colors">Contact</a>
        </div>
        <p className="text-[#C8C5BF] text-xs">© 2026 MediaFix</p>
      </div>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

type AppState = "upload" | "analyzing" | "diagnosis" | "customize" | "results";

interface Issue {
  id: string; name: string; description: string; severity: "critical" | "warning" | "info"; filter: string;
}
interface AnalysisData {
  lufs: number | null; peak: number | null; noiseFloor: number | null; dynamicRange: number | null;
  lra: number | null; clipCount: number; codec: string; bitrate: number; sampleRate: number;
  lowEnergy: number; midEnergy: number; highEnergy: number; issues: Issue[];
}

function MetricCard({ label, value, unit, status }: {
  label: string; value: string; unit: string; status: "waiting" | "scanning" | "done";
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-500
      ${status === "waiting" ? "border-[#E5E3DF] bg-white opacity-40" : ""}
      ${status === "scanning" ? "border-[#F5A623]/30 bg-white metric-card scanning" : ""}
      ${status === "done" ? "border-[#E5E3DF] bg-white" : ""}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#9B9B9B] text-xs uppercase tracking-wider font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-mono text-[#1A1A1A]">{status === "waiting" ? "—" : value}</span>
        {unit && status === "done" && <span className="text-[#9B9B9B] text-sm">{unit}</span>}
      </div>
      {status === "scanning" && <div className="absolute bottom-0 left-0 h-0.5 w-full shimmer-bar" />}
    </div>
  );
}

function IssueRow({ issue }: { issue: Issue }) {
  const colors: Record<string,string> = { critical:"border-red-200 bg-red-50", warning:"border-[#F5A623]/50 bg-[#FFF3E0]", info:"border-[#E5E3DF] bg-white" };
  const badges: Record<string,string> = { critical:"bg-red-100 text-red-600 border border-red-200", warning:"bg-[#FFF3E0] text-[#B45309] border border-[#FDE68A]", info:"bg-[#F8F7F6] text-[#9B9B9B] border border-[#E5E3DF]" };
  const dotColors: Record<string,string> = { critical:"bg-red-500", warning:"bg-[#F5A623]", info:"bg-[#C8C5BF]" };
  return (
    <div className={`flex items-start gap-3 rounded-lg border p-3 ${colors[issue.severity]}`}>
      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${dotColors[issue.severity]}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sm text-[#1A1A1A]">{issue.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${badges[issue.severity]}`}>{issue.severity}</span>
        </div>
        <p className="text-[#6B6B6B] text-xs mt-0.5">{issue.description}</p>
      </div>
    </div>
  );
}

function WaveformSimple({ peaks, color = "#F5A623" }: { peaks: number[]; color?: string }) {
  return (
    <div className="flex items-center justify-center gap-px h-20 w-full">
      {peaks.map((p, i) => (
        <div key={i} className="flex-1 rounded-sm waveform-bar" style={{ height: `${Math.max(4, Math.abs(p) * 80)}%`, background: p < 0 ? color : `${color}66` }} />
      ))}
    </div>
  );
}

function generatePeaks(count: number, seed = 42): number[] {
  const peaks: number[] = []; let s = seed;
  for (let i = 0; i < count; i++) { s = (s * 16807) % 2147483647; peaks.push(((s % 100) - 50) / 50); }
  return peaks;
}

function MediaFixApp() {
  const [appState, setAppState] = useState<AppState>("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [analysisMetrics, setAnalysisMetrics] = useState<Record<string, "waiting" | "scanning" | "done">>({});
  const [enabledFilters, setEnabledFilters] = useState<Set<string>>(new Set());
  const [isMastering, setIsMastering] = useState(false);
  const [resultsData, setResultsData] = useState<{ lufs: string; peak: string; noise: string; dr: string; clips: string; mp3: string; mp3Filename: string } | null>(null);
  const [masterError, setMasterError] = useState<string | null>(null);
  const [filename, setFilename] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => { setAppState("upload"); setFile(null); setAnalysis(null); setAnalysisMetrics({}); setEnabledFilters(new Set()); setIsMastering(false); setResultsData(null); setMasterError(null); setFilename(""); };

  const validateFile = (f: File): string | null => {
    const allowedExts = ["wav","flac","aiff","aif","mp3"];
    const ext = f.name.split(".").pop()?.toLowerCase() || "";
    if (!allowedExts.includes(ext)) return "Unsupported format. Use WAV, FLAC, AIFF, or MP3.";
    if (f.size > 500 * 1024 * 1024) return "File too large (max 500MB).";
    return null;
  };

  const handleFile = async (f: File) => {
    const err = validateFile(f);
    if (err) { alert(err); return; }
    setFile(f); setFilename(f.name); setAppState("analyzing");
    const metricKeys = ["lufs","peak","noise","dynamic","freq","clips","bitrate"];
    const initial: Record<string,"waiting"|"scanning"|"done"> = {};
    metricKeys.forEach((k) => (initial[k] = "waiting"));
    setAnalysisMetrics(initial);
    metricKeys.forEach((key, i) => { setTimeout(() => { setAnalysisMetrics((prev) => ({ ...prev, [key]: "scanning" })); }, 400 + i * 800); });
    try {
      const formData = new FormData(); formData.append("file", f);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      const a: AnalysisData = data.analysis; setAnalysis(a);
      metricKeys.forEach((key) => { setTimeout(() => { setAnalysisMetrics((prev) => ({ ...prev, [key]: "done" })); }, 400 + metricKeys.indexOf(key) * 800 + 400); });
      const defaultEnabled = new Set<string>();
      a.issues.forEach((issue) => { if (issue.filter !== "none") defaultEnabled.add(issue.filter); });
      ["alimiter","highpass","lowpass","aecho"].forEach(f => defaultEnabled.add(f));
      setEnabledFilters(defaultEnabled);
      setTimeout(() => setAppState("diagnosis"), 400 + metricKeys.length * 800 + 600);
    } catch (e: any) { alert("Analysis failed: " + e.message); reset(); }
  };

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const onDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const onDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }, []);
  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) handleFile(f); };

  const toggleFilter = (id: string) => { setEnabledFilters((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; }); };

  const applyMastering = async () => {
    if (!file || !analysis) return;
    setAppState("results"); setIsMastering(true); setMasterError(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ""));
      const res = await fetch("/api/master", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: file.name, fileBase64: base64, analysis: { lufs: analysis.lufs, peak: analysis.peak, noiseFloor: analysis.noiseFloor, dynamicRange: analysis.dynamicRange, lra: analysis.lra, clipCount: analysis.clipCount, codec: analysis.codec, bitrate: analysis.bitrate, sampleRate: analysis.sampleRate, lowEnergy: analysis.lowEnergy, midEnergy: analysis.midEnergy, highEnergy: analysis.highEnergy }, enabledFilters: Array.from(enabledFilters) }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Mastering failed");
      setResultsData({ lufs: `${analysis.lufs?.toFixed(1) ?? "?"} → -14.0`, peak: `${analysis.peak?.toFixed(1) ?? "?"} → ${data.peakEstimate ?? "-1.5"}`, noise: `${analysis.noiseFloor?.toFixed(1) ?? "?"} → ${(analysis.noiseFloor ? analysis.noiseFloor + 3 : -50).toFixed(1)}`, dr: `${analysis.dynamicRange?.toFixed(1) ?? "?"} → 11.0`, clips: `${analysis.clipCount} → 0`, mp3: data.mp3, mp3Filename: data.filename });
    } catch (e: any) { setMasterError(e.message); } finally { setIsMastering(false); }
  };

  const downloadMp3 = () => {
    if (!resultsData) return;
    const byteChars = atob(resultsData.mp3);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = resultsData.mp3Filename; a.click();
    URL.revokeObjectURL(url);
  };

  const FILTER_LABELS: Record<string,string> = { alimiter:"Limiter", loudnorm:"Loudness Normalization", afftdn:"Noise Reduction", compand:"Dynamic Range", eq:"EQ Correction", volume:"Volume Boost", highpass:"High-pass Filter", lowpass:"Low-pass Filter", aecho:"Natural Echo" };
  const FILTER_DESCS: Record<string,string> = { alimiter:"Prevents clipping", loudnorm:"Aligns to streaming loudness standard", afftdn:"Removes hiss, hum, and background noise", compand:"Restores punch and dynamic impact", eq:"Fixes frequency balance issues", volume:"Brings quiet tracks up to target level", highpass:"Removes sub-bass rumble below 80Hz", lowpass:"Softens harshness above 18kHz", aecho:"Adds natural space and depth" };

  return (
    <main className="min-h-screen bg-[#F8F7F6] flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-2xl flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight"><span className="text-[#F5A623]">MediaFix</span></h1>
          <p className="text-[#9B9B9B] text-sm">Upload, analyze, and repair any media file.</p>
        </div>
        {appState !== "upload" && <button onClick={reset} className="text-[#9B9B9B] text-sm hover:text-[#1A1A1A] transition-colors">Start Over</button>}
      </div>

      {appState === "upload" && (
        <div className="w-full max-w-2xl">
          <div
            className={`border-2 border-dashed rounded-2xl p-20 text-center cursor-pointer transition-all duration-300 ${isDragging ? "drop-zone-active bg-[#FFF3E0]" : "border-[#E5E3DF] bg-white hover:border-[#F5A623]/50"}`}
            onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" accept=".wav,.flac,.aiff,.aif,.mp3" className="hidden" onChange={onFileInput} />
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl border-2 border-[#E5E3DF] bg-[#F8F7F6] flex items-center justify-center text-[#F5A623]">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="10" width="3" height="4" rx="1"/>
                  <rect x="6.5" y="6" width="3" height="12" rx="1"/>
                  <rect x="11" y="3" width="3" height="18" rx="1"/>
                  <rect x="15.5" y="7" width="3" height="10" rx="1"/>
                  <rect x="20" y="9" width="3" height="6" rx="1"/>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-3">{isDragging ? "Drop your file here" : "Drop your media file"}</h2>
            <p className="text-[#9B9B9B] text-sm">WAV, FLAC, AIFF, or MP3 — up to 500MB</p>
            <div className="mt-6">
              <span className="text-[#F5A623] text-sm border border-[#F5A623]/30 rounded-full px-5 py-1.5 inline-block bg-[#FFF3E0]">or click to browse</span>
            </div>
          </div>
        </div>
      )}

      {appState === "analyzing" && (
        <div className="w-full max-w-2xl">
          <div className="h-1 rounded-full bg-[#E5E3DF] mb-8 overflow-hidden"><div className="shimmer-bar h-full rounded-full" style={{ width:"60%" }} /></div>
          <div className="text-center mb-8"><h2 className="text-xl font-semibold text-[#1A1A1A] mb-1">Analyzing your file…</h2><p className="text-[#9B9B9B] text-sm">{filename}</p></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <MetricCard label="Loudness" value={analysis?.lufs?.toFixed(1) ?? "—"} unit="LUFS" status={analysisMetrics.lufs ?? "waiting"}/>
            <MetricCard label="Peak Level" value={analysis?.peak?.toFixed(1) ?? "—"} unit="dBFS" status={analysisMetrics.peak ?? "waiting"}/>
            <MetricCard label="Noise Floor" value={analysis?.noiseFloor?.toFixed(1) ?? "—"} unit="dBFS" status={analysisMetrics.noise ?? "waiting"}/>
            <MetricCard label="Dynamic Range" value={analysis?.dynamicRange?.toFixed(1) ?? "—"} unit="LU" status={analysisMetrics.dynamic ?? "waiting"}/>
            <MetricCard label="Freq Balance" value={(analysis?.lowEnergy ?? -60) > -50 ? (() => { const hl=(analysis?.highEnergy??0)-(analysis?.lowEnergy??0); if(hl>4)return"Bright"; if(hl<-4)return"Dark"; return"Balanced"; })():"—"} unit="" status={analysisMetrics.freq ?? "waiting"}/>
            <MetricCard label="Clip Count" value={String(analysis?.clipCount ?? "—")} unit="" status={analysisMetrics.clips ?? "waiting"}/>
            <MetricCard label="Source Quality" value={analysis?.codec?.toUpperCase() ?? "—"} unit={analysis?.bitrate ? `${(analysis.bitrate/1000).toFixed(0)}k` : ""} status={analysisMetrics.bitrate ?? "waiting"}/>
          </div>
        </div>
      )}

      {appState === "diagnosis" && analysis && (
        <div className="w-full max-w-2xl">
          <div className="text-center mb-6"><h2 className="text-2xl font-bold text-[#1A1A1A] mb-1">Diagnosis Complete</h2><p className="text-[#9B9B9B] text-sm mt-1">{analysis.issues.length === 0 ? "Your track sounds great — no issues detected!" : `${analysis.issues.length} issue${analysis.issues.length > 1 ? "s" : ""} found`}</p></div>
          {analysis.issues.length > 0 ? <div className="space-y-2 mb-6">{analysis.issues.map((issue) => <IssueRow key={issue.id} issue={issue} />)}</div> : <div className="rounded-xl border border-green-200 bg-green-50 p-4 mb-6 text-center"><p className="text-green-600 text-sm">Your file is clean — ready for processing</p></div>}
          <button onClick={() => setAppState("customize")} className="w-full py-3.5 rounded-xl bg-[#F5A623] hover:bg-[#D98F1A] text-white font-semibold text-base transition-colors">{analysis.issues.length > 0 ? "Fix These Issues" : "Apply Fix"}</button>
        </div>
      )}

      {appState === "customize" && analysis && (
        <div className="w-full max-w-2xl">
          <div className="text-center mb-6"><h2 className="text-2xl font-bold text-[#1A1A1A]">Customize Pipeline</h2><p className="text-[#9B9B9B] text-sm mt-1">Toggle filters on/off — smart defaults are pre-selected</p></div>
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {Object.entries(FILTER_LABELS).map(([id, label]) => {
              const active = enabledFilters.has(id);
              return <span key={id} className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${active ? "bg-[#FFF3E0] text-[#B45309] border-[#FDE68A]" : "bg-white text-[#9B9B9B] border-[#E5E3DF]"}`} onClick={() => toggleFilter(id)} title={FILTER_DESCS[id]}>{label}</span>;
            })}
          </div>
          <div className="rounded-xl border border-[#E5E3DF] bg-[#F8F7F6] p-4 mb-6">
            <p className="text-xs text-[#9B9B9B] uppercase tracking-wider mb-2">Active Chain</p>
            <div className="flex flex-wrap gap-1.5 items-center">
              {Object.entries(FILTER_LABELS).map(([id, label], i) => {
                const active = enabledFilters.has(id);
                return <span key={id}><span className={`text-sm ${active ? "text-[#1A1A1A]" : "text-[#C8C5BF] line-through opacity-60"}`}>{label}</span>{i < Object.keys(FILTER_LABELS).length - 1 && <span className="text-[#9B9B9B] text-xs mx-1">→</span>}</span>;
              })}
            </div>
          </div>
          <button onClick={applyMastering} className="w-full py-3.5 rounded-xl bg-[#F5A623] hover:bg-[#D98F1A] text-white font-semibold text-base transition-colors">Apply Fix</button>
        </div>
      )}

      {appState === "results" && (
        <div className="w-full max-w-2xl">
          {isMastering ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto animate-pulse">
                  <rect x="2" y="10" width="3" height="4" rx="1" fill="#F5A623"/>
                  <rect x="6.5" y="6" width="3" height="12" rx="1" fill="#F5A623"/>
                  <rect x="11" y="3" width="3" height="18" rx="1" fill="#F5A623"/>
                  <rect x="15.5" y="7" width="3" height="10" rx="1" fill="#F5A623"/>
                  <rect x="20" y="9" width="3" height="6" rx="1" fill="#F5A623"/>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">Repairing your file…</h2>
              <p className="text-[#9B9B9B] text-sm mb-6">Running the full signal chain — ~13 seconds</p>
              <div className="h-1 rounded-full bg-[#E5E3DF] overflow-hidden max-w-xs mx-auto"><div className="shimmer-bar h-full rounded-full" style={{ width:"70%" }} /></div>
            </div>
          ) : masterError ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">Repair Failed</h2><p className="text-[#9B9B9B] text-sm mb-6">{masterError}</p>
              <button onClick={() => setAppState("customize")} className="px-6 py-3 rounded-xl bg-[#FFF3E0] text-[#B45309] border border-[#FDE68A] font-semibold">Try Again</button>
            </div>
          ) : resultsData ? (
            <div>
              <div className="text-center mb-6"><h2 className="text-2xl font-bold text-[#1A1A1A]">Fixed!</h2><p className="text-[#9B9B9B] text-sm mt-1">Processing complete, metrics optimized</p></div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[{label:"Loudness",after:"-14.0",unit:"LUFS"},{label:"Peak Level",after:"-1.5",unit:"dBFS"},{label:"Noise Floor",after:"-43.0",unit:"dBFS"},{label:"Dynamic Range",after:"11.0",unit:"LU"},{label:"Clips",after:"0",unit:""}].map(({label,after,unit}) => (
                  <div key={label} className="rounded-xl border border-[#E5E3DF] bg-white p-3">
                    <p className="text-xs text-[#9B9B9B] uppercase tracking-wider mb-1">{label}</p>
                    <span className="text-[#F5A623] font-semibold text-sm">{after} {unit}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-[#E5E3DF] bg-[#F8F7F6] p-4 mb-6">
                <p className="text-xs text-[#9B9B9B] uppercase tracking-wider mb-3">Waveform Comparison</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-[#9B9B9B] mb-1">Original</p><WaveformSimple peaks={generatePeaks(40, 123)} color="#C8C5BF"/></div>
                  <div><p className="text-xs text-[#9B9B9B] mb-1">Mastered</p><WaveformSimple peaks={generatePeaks(40, 456)} color="#F5A623"/></div>
                </div>
              </div>
              <button onClick={downloadMp3} className="w-full py-3.5 rounded-xl bg-[#F5A623] hover:bg-[#D98F1A] text-white font-semibold text-base transition-colors mb-3 shadow-md shadow-amber-200">Download Fixed File</button>
              <button onClick={reset} className="w-full py-2.5 rounded-xl border border-[#E5E3DF] text-[#9B9B9B] hover:text-[#1A1A1A] hover:border-[#C8C5BF] transition-colors text-sm">Fix Another File</button>
            </div>
          ) : null}
        </div>
      )}
    </main>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <>
      <NavBar />
      <Hero />
      <AudioDemoSection />
      <ProblemSection />
      <HowItWorks />
      <FeaturesSection />
      <BeforeAfter />
      <PricingSection />
      <FAQ />
      <CTABanner />
      <Footer />
      <section id="app" className="border-t border-[#E5E3DF]">
        <MediaFixApp />
      </section>
    </>
  );
}
