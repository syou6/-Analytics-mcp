export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* サービス情報 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">GitVue</h3>
            <p className="text-sm text-gray-600 mb-3">
              GitHub開発分析プラットフォーム<br/>
              Developer Analytics Platform
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SSL/TLS暗号化
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                データ保護
              </span>
            </div>
          </div>

          {/* リンク */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">サポート</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:heartssh950@gmail.com" className="text-gray-600 hover:text-blue-600">
                  お問い合わせ
                </a>
              </li>
              <li>
                <a href="https://github.com/syou6/github-analytics-mcp/issues" className="text-gray-600 hover:text-blue-600">
                  GitHub Issues
                </a>
              </li>
            </ul>
          </div>

          {/* 法的情報 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">法的情報 / Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/terms" className="text-gray-600 hover:text-blue-600">
                  利用規約
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-600 hover:text-blue-600">
                  プライバシーポリシー
                </a>
              </li>
              <li>
                <a href="/legal" className="text-gray-600 hover:text-blue-600 font-medium">
                  特定商取引法に基づく表記
                </a>
              </li>
            </ul>
          </div>

          {/* コンプライアンス */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">セキュリティ</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>HTTPS通信</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Stripe決済</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>OAuth 2.0認証</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>データ暗号化</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          © 2025 GitVue. All rights reserved.
        </div>
      </div>
    </footer>
  );
}