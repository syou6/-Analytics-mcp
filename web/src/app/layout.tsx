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
    icon: '/gitvue.png',
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
        <link rel="icon" href="/gitvue.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/gitvue.png?v=2" />
        <link rel="apple-touch-icon" sizes="180x180" href="/gitvue.png?v=2" />
        <link rel="shortcut icon" href="/gitvue.png?v=2" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#60a5fa" />
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
