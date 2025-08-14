'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-8 py-10">
          <h1 className="text-3xl font-bold mb-8">プライバシーポリシー</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">最終更新日: 2025年1月14日</p>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">1. 収集する情報</h2>
              <p>GitVue（以下「本サービス」）は、以下の情報を収集します：</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>GitHubアカウント情報</strong>：ユーザー名、メールアドレス、プロフィール画像</li>
                <li><strong>リポジトリ情報</strong>：公開リポジトリのメタデータ、統計情報</li>
                <li><strong>利用状況</strong>：分析回数、アクセスログ</li>
                <li><strong>決済情報</strong>：Stripeが管理（クレジットカード情報は当社では保持しません）</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">2. 情報の利用目的</h2>
              <p>収集した情報は以下の目的で利用します：</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>サービスの提供・運営</li>
                <li>ユーザーサポート</li>
                <li>サービスの改善・新機能の開発</li>
                <li>利用統計の分析</li>
                <li>重要なお知らせの送信</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">3. 情報の管理</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>SSL/TLS暗号化通信による保護</li>
                <li>Supabaseの安全なデータベースでの管理</li>
                <li>アクセス権限の適切な管理</li>
                <li>定期的なセキュリティ監査</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">4. 第三者への提供</h2>
              <p>以下の場合を除き、個人情報を第三者に提供することはありません：</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>ユーザーの同意がある場合</li>
                <li>法令に基づく場合</li>
                <li>人の生命・身体・財産の保護に必要な場合</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">5. 外部サービスの利用</h2>
              <p>本サービスは以下の外部サービスを利用しています：</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>GitHub API</strong>：リポジトリ情報の取得</li>
                <li><strong>Stripe</strong>：決済処理</li>
                <li><strong>Supabase</strong>：データベース・認証</li>
                <li><strong>Google Gemini API</strong>：AI分析機能</li>
                <li><strong>Vercel</strong>：ホスティング</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">6. Cookie の使用</h2>
              <p>本サービスは、ユーザー体験の向上のために Cookie を使用します：</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>認証状態の維持</li>
                <li>言語設定の保存</li>
                <li>利用統計の収集</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">7. データの削除</h2>
              <p>ユーザーは以下の方法でデータの削除を要求できます：</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>アカウントの削除リクエスト</li>
                <li>サポートへの連絡（heartssh950@gmail.com）</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">8. お問い合わせ</h2>
              <p>プライバシーに関するお問い合わせ：</p>
              <p className="mt-2">
                メール: heartssh950@gmail.com<br/>
                GitHub Issues: <a href="https://github.com/syou6/github-analytics-mcp/issues" className="text-blue-600 hover:underline">GitHub</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">9. 改定</h2>
              <p>本ポリシーは、必要に応じて改定されることがあります。重要な変更がある場合は、サービス内でお知らせします。</p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t">
            <a href="/" className="text-blue-600 hover:underline">← ホームに戻る</a>
          </div>
        </div>
      </div>
    </div>
  );
}