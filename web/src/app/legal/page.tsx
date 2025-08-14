'use client';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-8 py-10">
          <h1 className="text-3xl font-bold mb-8">特定商取引法に基づく表記</h1>
          
          <div className="prose max-w-none">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top w-1/3">販売事業者</td>
                  <td className="py-4">[あなたの名前または事業者名]</td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top">運営責任者</td>
                  <td className="py-4">[運営責任者名]</td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top">所在地</td>
                  <td className="py-4">
                    [郵便番号]<br/>
                    [住所]
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top">連絡先</td>
                  <td className="py-4">
                    メールアドレス: support@gitvue.dev<br/>
                    電話番号: [電話番号]<br/>
                    ※お問い合わせはメールでお願いします
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top">販売価格</td>
                  <td className="py-4">
                    <ul className="list-disc pl-5">
                      <li>無料プラン: 0円</li>
                      <li>Proプラン: 月額 1,500円（税込）</li>
                    </ul>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top">追加料金</td>
                  <td className="py-4">なし</td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top">支払方法</td>
                  <td className="py-4">クレジットカード（Visa、Mastercard、American Express、JCB）</td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top">支払時期</td>
                  <td className="py-4">
                    お申し込み時に初回料金をお支払いいただきます。<br/>
                    以降、毎月同日に自動的に課金されます。
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top">サービス提供時期</td>
                  <td className="py-4">決済完了後、即時利用可能</td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top">返金・キャンセル</td>
                  <td className="py-4">
                    <ul className="list-disc pl-5">
                      <li>初回購入から7日以内: 全額返金</li>
                      <li>サービスの不具合による利用不可: 日割り返金</li>
                      <li>キャンセル: いつでも可能（期間終了まで利用可）</li>
                    </ul>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top">動作環境</td>
                  <td className="py-4">
                    <ul className="list-disc pl-5">
                      <li>インターネット接続環境</li>
                      <li>最新版のWebブラウザ（Chrome、Firefox、Safari、Edge）</li>
                      <li>GitHubアカウント</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-gray-700">
                <strong>注意事項:</strong><br/>
                この表記は仮のテンプレートです。実際の事業者情報を記入してください。<br/>
                [  ] で囲まれた部分を実際の情報に置き換えてください。
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t">
            <a href="/" className="text-blue-600 hover:underline">← ホームに戻る</a>
          </div>
        </div>
      </div>
    </div>
  );
}