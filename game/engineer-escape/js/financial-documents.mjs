// すべてゲーム内の架空資料。金額は明細から計算し、画面と端末で共有する。
export const FINANCIAL_DOCUMENTS = {
  '今月の請求書.rtx': {
    title:'ご利用料金のお知らせ',subtitle:'2026年9月ご請求分',issuer:'みどり通信',department:'料金センター',recipient:'めもりー 様',number:'26-09-118042',date:'2026年9月1日',subject:'戸建て光回線・接続サービス',
    fields:[['ご利用期間','2026年8月1日〜8月31日'],['お客様番号','0000-••••-0101'],['お支払方法','口座振替'],['口座振替日','2026年9月20日']],
    items:[{name:'光回線・戸建てプラン',quantity:1,unit:'月',price:4500},{name:'接続サービス利用料',quantity:1,unit:'月',price:500},{name:'セット割引',quantity:1,unit:'月',price:-200}],
    taxMode:'exclusive',taxRate:.1,amountLabel:'今回のご請求額',status:'口座振替済み',notes:['今回のお支払いは完了しています。未払い残高：0円。','ご契約は利用中です。次回もご登録の口座から振り替えいたします。'],
  },
  '配管工事見積.rtx': {
    title:'御見積書',subtitle:'洗面所の止水栓交換',issuer:'くすのき工務店',department:'住宅設備係',recipient:'めもりー 様',number:'K-260912-07',date:'2026年9月12日',subject:'洗面台・給水側止水栓の交換工事',
    fields:[['有効期限','発行日から30日間'],['工事場所','お客様宅・1階洗面所'],['予定工期','半日（訪問日別途調整）'],['お支払条件','作業完了後、翌月末払い']],
    items:[{name:'アングル止水栓・パッキン一式',quantity:1,unit:'組',price:3800},{name:'既設撤去・交換・通水試験',quantity:1,unit:'式',price:8000},{name:'出張費',quantity:1,unit:'回',price:3000}],
    taxMode:'exclusive',taxRate:.1,amountLabel:'お見積金額',status:'未発注',notes:['既存配管に破損がないことを前提とします。追加作業が必要な場合は、着手前に内容と費用をご案内します。','交換部品・撤去材の処分費は上記に含みます。'],
  },
  'キッチン施工明細.rtx': {
    title:'工事明細書',subtitle:'アイランドキッチン設置工事',issuer:'くすのき工務店',department:'住宅改修係',recipient:'めもりー 様',number:'K-240516-02',date:'2024年5月16日',subject:'キッチン入替・給排水・専用回路工事',
    fields:[['工事場所','お客様宅・1階キッチン'],['施工期間','2024年5月10日〜5月14日'],['引渡確認日','2024年5月15日'],['支払状況','精算済み']],
    items:[{name:'アイランドキッチン本体・天板・水栓',quantity:1,unit:'式',price:880000},{name:'ビルトイン食器洗浄機',quantity:1,unit:'台',price:180000},{name:'給排水管の切り回し',quantity:1,unit:'式',price:95000},{name:'専用電源回路の増設',quantity:2,unit:'回路',price:35000},{name:'搬入・組立・設置工事',quantity:1,unit:'式',price:100000},{name:'既設撤去・運搬処分',quantity:1,unit:'式',price:25000},{name:'端数調整',quantity:1,unit:'式',price:-2727}],
    taxMode:'exclusive',taxRate:.1,amountLabel:'工事代金合計',status:'精算済み',notes:['シンク・排水接続部の漏水試験、食洗機の試運転を実施しました。','取扱説明書と保証書は引渡し時にお渡ししています。'],
  },
  '領収書.rtx': {
    title:'領収書',subtitle:'機材・消耗品のお買い上げ',issuer:'ねこねこコーポレーション',department:'電材売場',recipient:'めもりー 様',number:'N-250614-031',date:'2025年6月14日',subject:'LAN ケーブルテスター・通信ケーブルほか',
    fields:[['お支払方法','現金'],['取引日','2025年6月14日'],['商品点数','4点'],['税区分','全品10％・税込単価']],
    items:[{name:'LAN ケーブルテスター LT-08',quantity:1,unit:'台',price:3980},{name:'CAT6 LAN ケーブル 3m（青）',quantity:1,unit:'本',price:980},{name:'CAT6 LAN ケーブル 5m（青緑）',quantity:1,unit:'本',price:1280},{name:'結束バンド 100本入り',quantity:1,unit:'袋',price:340},{name:'会員割引',quantity:1,unit:'式',price:-112}],
    taxMode:'inclusive',taxRate:.1,amountLabel:'領収金額',status:'領収済み',notes:['上記金額を正に領収いたしました。'],
  },
};
export function financialTotals(doc){
  const itemsTotal=doc.items.reduce((sum,item)=>sum+item.quantity*item.price,0);
  const tax=doc.taxMode==='inclusive'?Math.round(itemsTotal*doc.taxRate/(1+doc.taxRate)):Math.floor(itemsTotal*doc.taxRate);
  return {subtotal:doc.taxMode==='inclusive'?itemsTotal-tax:itemsTotal,tax,total:doc.taxMode==='inclusive'?itemsTotal:itemsTotal+tax};
}
