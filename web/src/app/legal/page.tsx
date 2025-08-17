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
                    将　勝治<br/>
                    <span className="text-sm text-gray-600">※お問い合わせはメールでお願いいたします</span>
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
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">販売価格</td>
                  <td className="py-4 text-gray-700">
                    <ul className="list-disc pl-5">
                      <li><strong>無料プラン:</strong> ¥0（送料不要）</li>
                      <li><strong>プロフェッショナルプラン:</strong><br/>
                        月額 $9.8 USD (約¥1,470)<br/>
                        年額 $93.6 USD (約¥14,040) - 20%割引
                      </li>
                      <li><strong>エンタープライズプラン:</strong><br/>
                        月額 $99 USD (約¥14,850)
                      </li>
                    </ul>
                    <span className="text-sm text-gray-600 block mt-2">
                      ※価格は税込表示です<br/>
                      ※日本円表示は参考価格です。実際の請求は米ドルで行われます。<br/>
                      ※送料: 該当なし（デジタルサービスのため）
                    </span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">追加料金</td>
                  <td className="py-4 text-gray-700">
                    表示価格以外の追加料金は一切発生しません<br/>
                    <span className="text-sm text-gray-600">
                      ※アップグレード・ダウングレード時は日割り計算で調整されます
                    </span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">支払方法</td>
                  <td className="py-4 text-gray-700">
                    <strong>クレジットカード決済</strong><br/>
                    対応カード: Visa, Mastercard, American Express, JCB, Diners Club, Discover<br/><br/>
                    
                    <strong>決済処理:</strong> Stripe, Inc.<br/>
                    <span className="text-sm text-gray-600">
                      ※Stripeは世界最高水準のセキュリティ基準PCI DSSレベル1を満たしています<br/>
                      ※カード情報は当社のサーバーを通過せず、直接Stripeで暗号化処理されます<br/>
                      ※デビットカードもご利用いただけます
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
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">商品引き渡し時期</td>
                  <td className="py-4 text-gray-700">
                    決済完了後、即時アクセス可能<br/>
                    <span className="text-sm text-gray-600">
                      ※クレジットカード決済確認後、自動的にプレミアム機能が有効化されます<br/>
                      ※サービスの利用開始に必要な情報は登録メールアドレスに送信されます
                    </span>
                  </td>
                </tr>
                
                <tr className="border-b">
                  <td className="py-4 pr-4 font-bold align-top text-gray-900">返品・交換・キャンセル</td>
                  <td className="py-4 text-gray-700">
                    <strong>【返品・交換について】</strong><br/>
                    デジタルサービスの性質上、返品・交換は承っておりません。<br/><br/>
                    
                    <strong>【返金について】</strong><br/>
                    <ul className="list-disc pl-5">
                      <li>初回購入から30日以内: 全額返金保証</li>
                      <li>サービス不具合による利用不可: 影響期間の日割り返金</li>
                      <li>重複決済・誤決済: 全額返金</li>
                    </ul><br/>
                    
                    <strong>【解約について】</strong><br/>
                    <ul className="list-disc pl-5">
                      <li>いつでも解約可能（次回更新分から停止）</li>
                      <li>解約後も契約期間終了まで利用可能</li>
                      <li>再加入はいつでも可能</li>
                    </ul><br/>
                    
                    <span className="text-sm text-gray-600">
                      ※返金をご希望の場合は、k.sho626626@gmail.com までご連絡ください<br/>
                      ※返金処理には5-10営業日かかる場合があります
                    </span>
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