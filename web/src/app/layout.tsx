import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnalysisProvider } from "@/contexts/AnalysisContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitVue - 無料GitHub分析＆パーソナルブランディングツール",
  description: "GitHubアクティビティを美しいビジュアライゼーションに変換。貢献を追跡し、リポジトリを分析し、開発者ブランドを構築。ローンチキャンペーン中100%無料！",
  keywords: "GitHub分析, 開発者ポートフォリオ, 貢献トラッカー, コード可視化, パーソナルブランディング, GitHub統計, 無料開発者ツール",
  openGraph: {
    title: "GitVue - 無料GitHub分析＆パーソナルブランディング",
    description: "GitHubアクティビティを美しいビジュアライゼーションに変換。AIによるインサイトで開発者ブランドを構築。100%無料！",
    url: "https://gitvue.app",
    siteName: "GitVue",
    type: "website",
    images: [
      {
        url: "/gitvue.png",
        width: 1200,
        height: 630,
        alt: "GitVue - GitHub分析プラットフォーム",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GitVue - 無料GitHub分析",
    description: "GitHubアクティビティを美しいビジュアライゼーションに変換。ローンチ中100%無料！",
    images: ["/gitvue.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head />
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <AuthProvider>
          <LanguageProvider>
            <AnalysisProvider>
              {children}
            </AnalysisProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
