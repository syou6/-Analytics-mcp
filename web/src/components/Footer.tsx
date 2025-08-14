export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* サービス情報 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">GitVue</h3>
            <p className="text-sm text-gray-600">
              GitHubリポジトリの分析と可視化を提供する開発者向けツール
            </p>
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
            <h3 className="font-bold text-gray-900 mb-3">法的情報</h3>
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
                <a href="/legal" className="text-gray-600 hover:text-blue-600">
                  特定商取引法に基づく表記
                </a>
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