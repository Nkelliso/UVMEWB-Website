import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted (was next/font/google). Fetching Google Fonts at compile time is
// fragile: it hard-fails `next build` when a pinned woff2 404s, and in dev the
// font-loader's jest-worker can die on a flaky fetch ("Jest worker … exceeding
// retry limit"), which broke the /admin layout editor. Files live in app/fonts/.
const manrope = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "./fonts/manrope-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/manrope-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/manrope-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/manrope-800.woff2", weight: "800", style: "normal" },
  ],
});

const nunitoSans = localFont({
  variable: "--font-body",
  display: "swap",
  src: [
    { path: "./fonts/nunito-sans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/nunito-sans-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/nunito-sans-700.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Engineers Without Borders — UVM Chapter",
  description:
    "The University of Vermont student chapter of Engineers Without Borders — designing sustainable infrastructure alongside the communities we serve.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${nunitoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
