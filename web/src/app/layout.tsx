import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitVue - Free GitHub Analytics & Personal Branding Tool",
  description: "Transform your GitHub activity into beautiful visualizations. Track contributions, analyze repositories, and build your developer brand. 100% FREE during launch campaign!",
  keywords: "GitHub analytics, developer portfolio, contribution tracker, code visualization, personal branding, GitHub stats, free developer tools",
  openGraph: {
    title: "GitVue - Free GitHub Analytics & Personal Branding",
    description: "Transform your GitHub activity into beautiful visualizations. Build your developer brand with AI-powered insights. 100% FREE!",
    url: "https://gitvue.app",
    siteName: "GitVue",
    type: "website",
    images: [
      {
        url: "/gitvue.png",
        width: 1200,
        height: 630,
        alt: "GitVue - GitHub Analytics Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GitVue - Free GitHub Analytics",
    description: "Transform your GitHub activity into beautiful visualizations. 100% FREE during launch!",
    images: ["/gitvue.png"],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/gitvue.png', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: '/gitvue.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=20250116" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=20250116" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=20250116" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=20250116" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=20250116" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#7b3ff2" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
