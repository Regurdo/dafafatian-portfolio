import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Dafa — Creative Developer Portfolio",
  description:
    "I craft digital experiences with clean code and cinematic design. Explore my portfolio of web projects built with modern technologies.",
  keywords: [
    "portfolio",
    "developer",
    "web developer",
    "frontend",
    "next.js",
    "react",
  ],
  authors: [{ name: "Dafa" }],
  openGraph: {
    title: "Dafa — Creative Developer Portfolio",
    description:
      "I craft digital experiences with clean code and cinematic design.",
    type: "website",
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('theme');
                  if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  const savedLang = localStorage.getItem('language');
                  if (savedLang) {
                    document.documentElement.lang = savedLang;
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans bg-[#f8f9fa] dark:bg-[#0a0a0a] text-neutral-900 dark:text-white antialiased selection:bg-neutral-900/15 dark:selection:bg-white/20 transition-colors duration-300`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
