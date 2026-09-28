export const TODO_DOCUMENTS = {
  '買い物リスト.tdo': {title:'買い物リスト',subtitle:'次に出かけたら',groups:[
    {title:'日用品',items:[{id:'shop-paper',text:'キッチンペーパー',done:false},{id:'shop-coffee',text:'コーヒー豆',detail:'深煎り。今の袋があと少し。',done:false},{id:'shop-ties',text:'面ファスナーの結束バンド',done:true}]},
    {title:'猫たちのもの',items:[{id:'shop-litter',text:'猫砂を 2 袋',done:false},{id:'shop-food',text:'えるのウェットフード',detail:'選り好みがあるので、いつもの味を少量ずつ。',done:false}]},
  ]},
  '作業予定.tdo': {title:'作業予定',subtitle:'9月28日からの作業',groups:[
    {title:'今日',items:[{id:'work-review',text:'帳票改修の動作確認',detail:'結果は明日の朝までに先方へ共有。',tag:'優先',done:false},{id:'work-regression',text:'既存の日次帳票の回帰確認',detail:'9/24 実施済み。',done:true}]},
    {title:'今週',items:[{id:'work-release',text:'帳票改修の本番反映',detail:'10/01 夜の作業枠。',done:false},{id:'work-meeting',text:'ねこねこコーポレーション定例',detail:'10/01 14:00。確認結果を持っていく。',done:false}]},
    {title:'来週',items:[{id:'work-backup',text:'バックアップ世代の棚卸し',done:false},{id:'work-kernel',text:'検証機の memoryOS 更新',done:false}]},
  ]},
  '家事の分担.tdo': {title:'今週の家事',subtitle:'一人暮らしの「分担」は曜日に割り振ること',groups:[
    {title:'今日',items:[{id:'house-water',text:'給水機をすすいで水を替える',done:true},{id:'house-litter',text:'猫トイレの掃除',done:true},{id:'house-floor',text:'床に落ちた小物を拾う',detail:'ぐりが何でも口に入れるので、机の下も忘れずに。',done:false}]},
    {title:'曜日の仕事',items:[{id:'house-trash',text:'月曜：燃えるごみ',done:true},{id:'house-plants',text:'水曜：植物の水やり・プラごみ',done:false},{id:'house-sheets',text:'金曜：シーツの洗濯',done:false}]},
  ]},
};
export const TASK_IDS = new Set(Object.values(TODO_DOCUMENTS).flatMap(doc=>doc.groups.flatMap(group=>group.items.map(item=>item.id))));
export const taskDone = (item,checks={}) => Object.hasOwn(checks,item.id)?checks[item.id]:item.done;
