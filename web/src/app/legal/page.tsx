'use client';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-8 py-10">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">特定商取引法に基づく表記</h1>
          <p className="text-gray-600 mb-6">Specified Commercial Transactions Act Disclosure</p>
          
          <div className="prose max-w-none">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top w-1/3 text-gray-900">販売事業者名<br/><span className="text-sm font-normal text-gray-600">Business Name</span></td>
                  <td className="py-4 text-gray-700">
                    個人事業主<br/>
                    <span className="text-sm text-gray-600">Individual Business Owner</span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">代表者名<br/><span className="text-sm font-normal text-gray-600">Representative</span></td>
                  <td className="py-4 text-gray-700">
                    <span className="text-sm text-gray-600">※請求があった場合に遅滞なく開示いたします<br/>
                    Disclosed upon request</span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">所在地<br/><span className="text-sm font-normal text-gray-600">Business Address</span></td>
                  <td className="py-4 text-gray-700">
                    〒690-0000<br/>
                    島根県松江市<br/>
                    <span className="text-sm text-gray-600">
                      ※番地等の詳細は請求があった場合に遅滞なく開示いたします<br/>
                      Detailed address disclosed upon request
                    </span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">電話番号<br/><span className="text-sm font-normal text-gray-600">Phone Number</span></td>
                  <td className="py-4 text-gray-700">
                    <span className="text-sm text-gray-600">
                      請求があった場合に遅滞なく開示いたします<br/>
                      Disclosed upon request<br/>
                      営業時間: 平日 9:00-18:00 JST
                    </span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">メールアドレス<br/><span className="text-sm font-normal text-gray-600">Email</span></td>
                  <td className="py-4 text-gray-700">
                    k.sho626626@gmail.com<br/>
                    <span className="text-sm text-gray-600">
                      お問い合わせはメールでお願いいたします<br/>
                      Please contact us via email
                    </span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">サービス内容<br/><span className="text-sm font-normal text-gray-600">Service Type</span></td>
                  <td className="py-4 text-gray-700">
                    GitHub開発分析プラットフォーム<br/>
                    <span className="text-sm text-gray-600">
                      GitHub Development Analytics Platform<br/>
                      開発者向けクラウドアナリティクスツール<br/>
                      Cloud-based analytics tool for developers
                    </span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">料金<br/><span className="text-sm font-normal text-gray-600">Pricing</span></td>
                  <td className="py-4 text-gray-700">
                    <ul className="list-disc pl-5">
                      <li><strong>無料プラン / Free Plan:</strong> $0</li>
                      <li><strong>Professionalプラン / Professional Plan:</strong><br/>
                        月額 $9.8 USD (約¥1,470 税込)<br/>
                        年額 $93.6 USD (約¥14,040 税込) - 20%割引
                      </li>
                      <li><strong>Enterpriseプラン / Enterprise Plan:</strong><br/>
                        月額 $99 USD (約¥14,850 税込)
                      </li>
                    </ul>
                    <span className="text-sm text-gray-600 block mt-2">
                      ※日本円表示は参考価格です。実際の請求は米ドルで行われます。<br/>
                      ※表示価格には日本の消費税10%が含まれています。<br/>
                      Japanese Yen amounts are approximate. Actual charges in USD.
                    </span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">追加料金<br/><span className="text-sm font-normal text-gray-600">Additional Fees</span></td>
                  <td className="py-4 text-gray-700">
                    表示価格以外の追加料金はありません<br/>
                    <span className="text-sm text-gray-600">No additional fees beyond displayed subscription price</span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">支払方法<br/><span className="text-sm font-normal text-gray-600">Payment Methods</span></td>
                  <td className="py-4 text-gray-700">
                    クレジットカード (Stripe決済)<br/>
                    <span className="text-sm text-gray-600">
                      対応カード: Visa, Mastercard, American Express, JCB<br/>
                      Credit cards via Stripe payment processing
                    </span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">支払時期<br/><span className="text-sm font-normal text-gray-600">Payment Timing</span></td>
                  <td className="py-4 text-gray-700">
                    サブスクリプション登録時に即時決済<br/>
                    月額プラン: 毎月同日に自動更新<br/>
                    年額プラン: 12ヶ月ごとに自動更新<br/>
                    <span className="text-sm text-gray-600">
                      Charged immediately upon subscription activation<br/>
                      Recurring charges on monthly/annual renewal date
                    </span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">契約期間<br/><span className="text-sm font-normal text-gray-600">Contract Period</span></td>
                  <td className="py-4 text-gray-700">
                    月額プラン: 1ヶ月単位の自動更新<br/>
                    年額プラン: 12ヶ月単位の自動更新<br/>
                    <span className="text-sm text-gray-600">
                      Monthly Plan: 1 month auto-renewal<br/>
                      Annual Plan: 12 months auto-renewal
                    </span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">サービス提供時期<br/><span className="text-sm font-normal text-gray-600">Service Delivery</span></td>
                  <td className="py-4 text-gray-700">
                    アカウント作成後、即時アクセス可能<br/>
                    <span className="text-sm text-gray-600">Immediate access upon account creation</span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">返品・返金<br/><span className="text-sm font-normal text-gray-600">Returns/Refunds</span></td>
                  <td className="py-4 text-gray-700">
                    <ul className="list-disc pl-5">
                      <li>初回購入から30日以内: 日割り返金可能</li>
                      <li>30日経過後: 返金不可（次回更新からの解約のみ）</li>
                      <li>サービス不具合による利用不可: 影響期間の日割り返金</li>
                    </ul>
                    <span className="text-sm text-gray-600">
                      Pro-rated refunds available within 30 days<br/>
                      No refunds for partial months after 30 days
                    </span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">解約方法<br/><span className="text-sm font-normal text-gray-600">Cancellation</span></td>
                  <td className="py-4 text-gray-700">
                    アカウントダッシュボードからいつでも解約可能<br/>
                    解約後も請求期間終了まで利用可能<br/>
                    <span className="text-sm text-gray-600">
                      Cancel anytime from account dashboard<br/>
                      Service continues until end of billing period
                    </span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">動作環境<br/><span className="text-sm font-normal text-gray-600">System Requirements</span></td>
                  <td className="py-4 text-gray-700">
                    <ul className="list-disc pl-5">
                      <li>インターネット接続環境（ブロードバンド推奨）</li>
                      <li>最新版のWebブラウザ<br/>
                        <span className="text-sm text-gray-600">Chrome, Firefox, Safari, Edge (最新2バージョン)</span>
                      </li>
                      <li>GitHubアカウント（データアクセスに必要）</li>
                      <li>JavaScript有効化必須</li>
                    </ul>
                    <span className="text-sm text-gray-600">
                      Modern web browser required<br/>
                      GitHub account required for data access
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-bold mb-2 text-gray-900">データ取り扱いについて / Data Handling</h3>
              <p className="text-sm text-gray-700 mb-2">
                GitVueは以下のセキュリティ対策を実施しています：
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>GitHubの公開リポジトリデータまたは明示的に許可されたプライベートリポジトリのみアクセス</li>
                <li>SSL/TLS暗号化通信による保護</li>
                <li>データは暗号化された状態で保存</li>
                <li>ユーザーはいつでもアクセス権を取り消し可能</li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                GitVue only accesses public repository data or explicitly authorized private repositories.<br/>
                All data is encrypted in transit and at rest. Users maintain full control with ability to revoke access anytime.
              </p>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
              <p className="text-sm text-gray-700">
                <strong>お問い合わせ / Contact:</strong><br/>
                サポート対応時間: 平日 9:00-18:00 JST<br/>
                Email responses within 24 hours during business days<br/>
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