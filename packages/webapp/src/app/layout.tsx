import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "slideshot — Convert HTML to High-Res Images & PDF",
  description:
    "Paste HTML slides, preview live, export to high-res PNG, WebP, and PDF. Powered by Puppeteer. CLI, MCP server, and web app.",
  metadataBase: new URL("https://slideshot.vercel.app"),
  openGraph: {
    title: "slideshot — Convert HTML to High-Res Images & PDF",
    description:
      "Paste HTML slides, preview live, export to high-res PNG, WebP, and PDF.",
    url: "https://slideshot.vercel.app",
    siteName: "slideshot",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "slideshot — Convert HTML to High-Res Images & PDF",
    description:
      "Paste HTML slides, preview live, export to high-res PNG, WebP, and PDF.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
