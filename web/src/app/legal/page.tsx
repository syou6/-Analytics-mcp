'use client';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-8 py-10">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">特定商取引法に基づく表記</h1>
          
          <div className="prose max-w-none">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top w-1/3 text-gray-900">販売事業者名</td>
                  <td className="py-4 text-gray-700">
                    個人事業主
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">代表者名</td>
                  <td className="py-4 text-gray-700">
                    <span className="text-sm text-gray-600">※請求があった場合に遅滞なく開示いたします</span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">所在地</td>
                  <td className="py-4 text-gray-700">
                    〒690-0000<br/>
                    島根県松江市<br/>
                    <span className="text-sm text-gray-600">
                      ※番地等の詳細は請求があった場合に遅滞なく開示いたします
                    </span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">電話番号</td>
                  <td className="py-4 text-gray-700">
                    <span className="text-sm text-gray-600">
                      請求があった場合に遅滞なく開示いたします<br/>
                      営業時間: 平日 9:00-18:00
                    </span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">メールアドレス</td>
                  <td className="py-4 text-gray-700">
                    k.sho626626@gmail.com<br/>
                    <span className="text-sm text-gray-600">
                      お問い合わせはメールでお願いいたします
                    </span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">サービス内容</td>
                  <td className="py-4 text-gray-700">
                    GitHub開発分析プラットフォーム<br/>
                    <span className="text-sm text-gray-600">
                      開発者向けクラウドアナリティクスツール
                    </span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">料金</td>
                  <td className="py-4 text-gray-700">
                    <ul className="list-disc pl-5">
                      <li><strong>無料プラン:</strong> ¥0</li>
                      <li><strong>プロフェッショナルプラン:</strong><br/>
                        月額 $9.8 USD (約¥1,470 税込)<br/>
                        年額 $93.6 USD (約¥14,040 税込) - 20%割引
                      </li>
                      <li><strong>エンタープライズプラン:</strong><br/>
                        月額 $99 USD (約¥14,850 税込)
                      </li>
                    </ul>
                    <span className="text-sm text-gray-600 block mt-2">
                      ※日本円表示は参考価格です。実際の請求は米ドルで行われます。<br/>
                      ※表示価格には日本の消費税10%が含まれています。
                    </span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">追加料金</td>
                  <td className="py-4 text-gray-700">
                    表示価格以外の追加料金はありません
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">支払方法</td>
                  <td className="py-4 text-gray-700">
                    クレジットカード (Stripe決済)<br/>
                    <span className="text-sm text-gray-600">
                      対応カード: Visa, Mastercard, American Express, JCB
                    </span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">支払時期</td>
                  <td className="py-4 text-gray-700">
                    サブスクリプション登録時に即時決済<br/>
                    月額プラン: 毎月同日に自動更新<br/>
                    年額プラン: 12ヶ月ごとに自動更新
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">契約期間</td>
                  <td className="py-4 text-gray-700">
                    月額プラン: 1ヶ月単位の自動更新<br/>
                    年額プラン: 12ヶ月単位の自動更新
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">サービス提供時期</td>
                  <td className="py-4 text-gray-700">
                    アカウント作成後、即時アクセス可能
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">返品・返金</td>
                  <td className="py-4 text-gray-700">
                    <ul className="list-disc pl-5">
                      <li>初回購入から30日以内: 日割り返金可能</li>
                      <li>30日経過後: 返金不可（次回更新からの解約のみ）</li>
                      <li>サービス不具合による利用不可: 影響期間の日割り返金</li>
                    </ul>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">解約方法</td>
                  <td className="py-4 text-gray-700">
                    アカウントダッシュボードからいつでも解約可能<br/>
                    解約後も請求期間終了まで利用可能
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">動作環境</td>
                  <td className="py-4 text-gray-700">
                    <ul className="list-disc pl-5">
                      <li>インターネット接続環境（ブロードバンド推奨）</li>
                      <li>最新版のWebブラウザ<br/>
                        <span className="text-sm text-gray-600">Chrome, Firefox, Safari, Edge (最新2バージョン)</span>
                      </li>
                      <li>GitHubアカウント（データアクセスに必要）</li>
                      <li>JavaScript有効化必須</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-bold mb-2 text-gray-900">データ取り扱いについて</h3>
              <p className="text-sm text-gray-700 mb-2">
                GitVueは以下のセキュリティ対策を実施しています：
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>GitHubの公開リポジトリデータまたは明示的に許可されたプライベートリポジトリのみアクセス</li>
                <li>SSL/TLS暗号化通信による保護</li>
                <li>データは暗号化された状態で保存</li>
                <li>ユーザーはいつでもアクセス権を取り消し可能</li>
              </ul>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
              <p className="text-sm text-gray-700">
                <strong>お問い合わせ:</strong><br/>
                サポート対応時間: 平日 9:00-18:00<br/>
                メールでのお問い合わせは24時間受付<br/>
                k.sho626626@gmail.com
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