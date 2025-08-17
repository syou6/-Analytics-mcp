'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-8 py-10">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">利用規約</h1>
          
          <div className="prose max-w-none text-gray-800">
            <p className="text-gray-600 mb-6">最終更新日: 2025年1月14日</p>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-900">第1条（適用）</h2>
              <p className="text-gray-700 leading-relaxed">本規約は、GitVue（以下「本サービス」）の利用条件を定めるものです。ユーザーの皆様には、本規約に従って本サービスをご利用いただきます。</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-900">第2条（利用登録）</h2>
              <p className="text-gray-700 leading-relaxed">登録希望者が当社の定める方法によって利用登録を申請し、当社がこれを承認することによって利用登録が完了するものとします。</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-900">第3条（料金および支払方法）</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>無料プラン：月10回までの分析が無料</li>
                <li>Proプラン：月額1,500円（税込）で月100回までの分析とAI機能</li>
                <li>支払いはクレジットカード決済で行われます（決済代行：ストライプ社）</li>
                <li>料金は前払いとし、月額プランは自動更新されます</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-900">第4条（キャンセル・返金）</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>いつでもサブスクリプションをキャンセル可能です</li>
                <li>キャンセル後も期間終了まではProプランをご利用いただけます</li>
                <li>初回購入から7日以内は全額返金に対応します</li>
                <li>技術的な問題でサービスが利用できない場合は日割り返金します</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-900">第5条（禁止事項）</h2>
              <p className="text-gray-700 leading-relaxed">ユーザーは、以下の行為をしてはなりません：</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>法令または公序良俗に違反する行為</li>
                <li>サーバーに過度な負荷をかける行為</li>
                <li>他のユーザーに迷惑をかける行為</li>
                <li>不正アクセスやハッキング行為</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-900">第6条（免責事項）</h2>
              <p className="text-gray-700 leading-relaxed">本サービスに起因してユーザーに生じたあらゆる損害について、当社は一切の責任を負いません。ただし、当社の故意または重大な過失による場合を除きます。</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-900">第7条（サービス内容の変更等）</h2>
              <p className="text-gray-700 leading-relaxed">当社は、ユーザーに通知することなく、本サービスの内容を変更または提供を中止することができるものとします。</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-900">第8条（利用規約の変更）</h2>
              <p className="text-gray-700 leading-relaxed">当社は、必要と判断した場合には、ユーザーに通知することなく本規約を変更することができるものとします。</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-900">第9条（準拠法・裁判管轄）</h2>
              <p className="text-gray-700 leading-relaxed">本規約は日本法に準拠し、本規約に起因する紛争は、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
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