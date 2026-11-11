import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { resume } from "@/data/resume";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = `${resume.name} — ${resume.roles[0]}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description: resume.pitch,
  alternates: { canonical: SITE_URL },
  openGraph: { type: "profile", url: SITE_URL, title, description: resume.pitch, siteName: resume.name },
  // The og:image itself comes from app/opengraph-image.tsx.
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // next-themes sets the class on <html> before hydration, so React must not warn about it.
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
