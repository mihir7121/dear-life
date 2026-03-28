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
    default: "Dear Life",
    template: "%s — Dear Life",
  },
  description:
    "Your life, remembered beautifully.",
  keywords: ["memories", "scrapbook", "travel", "personal", "journal", "globe"],
  authors: [{ name: "Dear Life" }],
  creator: "Dear Life",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Dear Life",
    description: "Your life, remembered beautifully.",
    siteName: "Dear Life",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dear Life",
    description: "Your life, remembered beautifully.",
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
