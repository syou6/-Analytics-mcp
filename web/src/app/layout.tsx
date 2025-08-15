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
  title: "GitVue - Visualize Your GitHub Impact",
  description: "AI-powered GitHub analytics dashboard with beautiful visualizations and insights",
  icons: {
    icon: [
      { url: '/favicon-orb.svg', type: 'image/svg+xml' },
      { url: '/favicon-v3.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: '/favicon-orb.svg',
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
        <link rel="icon" href="/favicon-orb.svg?v=5" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon-v3.svg?v=5" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon-orb.svg?v=5" />
        <link rel="shortcut icon" href="/favicon-orb.svg?v=5" />
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
