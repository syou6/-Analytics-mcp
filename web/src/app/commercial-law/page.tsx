'use client';

import { Github } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function CommercialLawPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Github className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-black">GitVue</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-8">
            特定商取引法に基づく表記
          </h1>

          <div className="space-y-6 text-black">
            {/* 事業者名 */}
            <div className="border-b pb-4">
              <h2 className="font-semibold text-lg mb-2">事業者名</h2>
              <p>GitVue</p>
            </div>

            {/* 運営責任者 */}
            <div className="border-b pb-4">
              <h2 className="font-semibold text-lg mb-2">運営責任者</h2>
              <p>ご請求があった場合には速やかに開示いたします</p>
            </div>

            {/* 所在地 */}
            <div className="border-b pb-4">
              <h2 className="font-semibold text-lg mb-2">所在地</h2>
              <p>ご請求があった場合には速やかに開示いたします</p>
            </div>

            {/* 電話番号 */}
            <div className="border-b pb-4">
              <h2 className="font-semibold text-lg mb-2">電話番号</h2>
              <p>ご請求があった場合には速やかに開示いたします</p>
            </div>

            {/* メールアドレス */}
            <div className="border-b pb-4">
              <h2 className="font-semibold text-lg mb-2">お問い合わせ</h2>
              <p>GitHub Issues: <a href="https://github.com/anthropics/claude-code/issues" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://github.com/anthropics/claude-code/issues</a></p>
              <p className="text-sm text-gray-600 mt-1">※技術的なお問い合わせはGitHub Issuesにてお願いいたします</p>
            </div>

            {/* 販売価格 */}
            <div className="border-b pb-4">
              <h2 className="font-semibold text-lg mb-2">販売価格</h2>
              <p className="font-bold text-green-600">無料</p>
              <p className="text-sm text-gray-600 mt-1">
                ※現在、期間限定キャンペーンにより全機能を無料でご利用いただけます
              </p>
              <p className="text-sm text-gray-600">
                ※キャンペーン終了後の価格（予定）：
              </p>
              <ul className="text-sm text-gray-600 ml-4 mt-1">
                <li>• Professional プラン: 月額 1,470円（税込）</li>
                <li>• Enterprise プラン: 月額 7,500円（税込）</li>
              </ul>
            </div>

            {/* 追加手数料 */}
            <div className="border-b pb-4">
              <h2 className="font-semibold text-lg mb-2">追加手数料</h2>
              <p>なし</p>
              <p className="text-sm text-gray-600 mt-1">
                ※インターネット接続に必要な通信料はお客様のご負担となります
              </p>
            </div>

            {/* 支払方法 */}
            <div className="border-b pb-4">
              <h2 className="font-semibold text-lg mb-2">お支払い方法</h2>
              <p>現在無料のため、お支払いは不要です</p>
              <p className="text-sm text-gray-600 mt-1">
                ※将来的な有料プラン：クレジットカード（Visa、Mastercard、American Express、JCB）
              </p>
            </div>

            {/* 支払時期 */}
            <div className="border-b pb-4">
              <h2 className="font-semibold text-lg mb-2">お支払い時期</h2>
              <p>現在無料のため、お支払いは不要です</p>
              <p className="text-sm text-gray-600 mt-1">
                ※将来的な有料プラン：月額プランは毎月自動更新
              </p>
            </div>

            {/* サービス提供時期 */}
            <div className="border-b pb-4">
              <h2 className="font-semibold text-lg mb-2">サービス提供時期</h2>
              <p>GitHubアカウントでのログイン後、即時ご利用いただけます</p>
            </div>

            {/* 返品・交換・キャンセル */}
            <div className="border-b pb-4">
              <h2 className="font-semibold text-lg mb-2">返品・交換・キャンセルについて</h2>
              <p>デジタルサービスの性質上、返品・交換は承っておりません</p>
              <p className="text-sm text-gray-600 mt-2">
                ＜サービスの不具合について＞<br />
                サービスに不具合がある場合は、GitHub Issuesにてご報告ください。
                速やかに対応いたします。
              </p>
              <p className="text-sm text-gray-600 mt-2">
                ＜将来的な有料プランのキャンセルについて＞<br />
                いつでもダッシュボードからサブスクリプションをキャンセル可能です。
                キャンセル後も、現在の請求期間の終了まではサービスをご利用いただけます。
              </p>
            </div>

            {/* 動作環境 */}
            <div className="border-b pb-4">
              <h2 className="font-semibold text-lg mb-2">動作環境</h2>
              <p>推奨ブラウザ：</p>
              <ul className="ml-4 mt-1">
                <li>• Google Chrome（最新版）</li>
                <li>• Mozilla Firefox（最新版）</li>
                <li>• Safari（最新版）</li>
                <li>• Microsoft Edge（最新版）</li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                ※JavaScriptが有効である必要があります<br />
                ※インターネット接続が必要です
              </p>
            </div>

            {/* その他 */}
            <div className="border-b pb-4">
              <h2 className="font-semibold text-lg mb-2">その他</h2>
              <p>本サービスはオープンソースプロジェクトとして提供されています。</p>
              <p className="mt-2">
                ソースコード: <a href="https://github.com/syou6/-Analytics-mcp" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
              </p>
            </div>

            {/* 準拠法・管轄裁判所 */}
            <div>
              <h2 className="font-semibold text-lg mb-2">準拠法・管轄裁判所</h2>
              <p>
                本表記は日本法に準拠し、本サービスに関する一切の紛争については、
                東京地方裁判所を第一審の専属的合意管轄裁判所とします。
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-gray-600">
              最終更新日: 2025年1月16日
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}