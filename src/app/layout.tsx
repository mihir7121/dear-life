import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Atlas of Me",
    template: "%s — Atlas of Me",
  },
  description:
    "A deeply personal digital scrapbook. Your memories, your places, your life — all in one beautiful universe.",
  keywords: ["memories", "scrapbook", "travel", "personal", "journal", "globe"],
  authors: [{ name: "Atlas of Me" }],
  creator: "Atlas of Me",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Atlas of Me",
    description: "A deeply personal digital scrapbook.",
    siteName: "Atlas of Me",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlas of Me",
    description: "A deeply personal digital scrapbook.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0C14" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${inter.variable} ${playfair.variable}`}
      >
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={false}
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
