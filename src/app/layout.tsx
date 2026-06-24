import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const SITE = "https://kevinclear.me";
const TITLE = "Kevin Clear — Site Reliability & Support Engineer";
const DESCRIPTION =
  "Kevin Clear, a reliability and support engineer in Austin, TX — 10+ years keeping live, business-critical systems and the people who depend on them up and running. Open to SRE / Support Engineering roles.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Kevin Clear",
    "Site Reliability Engineer",
    "Support Engineer",
    "Production Support",
    "Austin",
    "SRE",
  ],
  authors: [{ name: "Kevin Clear", url: SITE }],
  openGraph: {
    type: "website",
    url: SITE,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Kevin Clear",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        {children}
        {/* Umami — privacy-friendly, cookieless analytics, self-hosted on this VM.
            Same-origin /script.js → posts hits to /api/send (both proxied to local Umami). */}
        <Script
          src="https://kevinclear.me/script.js"
          data-website-id="2fc74a74-45bf-494b-9983-756ab6282bf5"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
