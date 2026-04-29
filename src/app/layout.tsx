import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediaFix — Fix Any File. Audio, Image, and Video Repair",
  description: "Fix any file. Audio, image, and video repair — all in one place. No login, no drama.",
};

// Anti-flash: apply saved dark mode preference before first paint
const darkModeScript = `
try {
  const saved = localStorage.getItem('mediafix-dark-mode');
  if (saved === 'dark') {
    document.documentElement.classList.add('dark');
  }
} catch(e) {}
`.trim();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: darkModeScript }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
