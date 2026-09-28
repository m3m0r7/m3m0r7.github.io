import { invoiceMarkup } from './invoice.js';
import { mountCableSearch } from './cable-search.js';
import { buildXShareUrl } from './share.mjs';
import { supplyBox } from './supply-search.mjs';
import { createRoom } from './room.js';
import { createDebugSequence } from './debug-sequence.mjs';
import { icon, hydrateIcons } from './icons.js';
import { initialState, transition, readSave, writeSave, inventory, pcPowered, hasLink, isOnline, serverOpen, CLUES } from './state.mjs';
import { executeCommand } from './terminal.mjs';
import { terminalPrompt, commandTranscript } from './terminal-view.mjs';
import { browserView } from './browser-view.mjs';
import { EXTRA_INSPECTIONS } from './exploration.mjs';
import { readHistory, saveHistory, HISTORY_LIMIT } from './conversation.mjs';
import { insuranceMarkup } from './insurance-card.js';
import { PAPERWORK } from './documents.mjs';
import { createFileBrowser, mountBook, documentMarkup } from './readers.js';
import { createMinimap } from './minimap.js';
import { createTypewriter } from './typewriter.js';

const ITEMS = {
  key: { name: 'サーバー室の鍵', icon: 'key', description: '真鍮の鍵。タグに手書きで「サーバー室」。' },
  tester: { name: 'LAN テスター', icon: 'network', description: '芯線 8 本の導通を 1 本ずつ確認できる。' },
  usb: { name: 'USB ケーブル', icon: 'plug', description: 'USB-A / USB-C の充電ケーブル。LAN の端子には挿さらない。' },
  cable: { name: '予備の LAN', icon: 'cable', description: '未使用の CAT6、5m の青緑。端子の爪も無事。' },
  broken: { name: '壊れた LAN', icon: 'cable', description: '外した青の 3m。折れ癖の奥で芯線が切れている。' },
};
const NOTES = {
  ...Object.fromEntries(Object.entries(EXTRA_INSPECTIONS).map(([id, value]) => [id, [value.title, value.note]])),
  power: ['電源タップ', 'PC は机の下のタップ、通信機器はラック内の電源。照明とは別系統。'],
  modem: ['ゲートウェイ', '前面に状態ランプ、背面に WAN / LAN と電源スイッチ。光回線の終端は一階の ONU。'],
  invoice: ['支払い済みの請求書', '9 月分 5,280 円は振替済み。未払いによる停止ではない。'],
  book: ['ネットワークの本', '下の層から順に見る：電源 → ケーブル → リンク → アドレス → 名前解決。'],
  connector: ['配線の両端', 'PC 側・ルーター側を個別に抜き差しできる。爪が掛かっていても導通は別問題。'],
  damage: ['ケーブルの損傷', '椅子のそばの青い LAN に折れ癖。被覆の内側で芯線が切れている。'],
  dhcp: ['インターフェースの記録', 'eth0 のリンク状態と DHCP を端末で確認した。'],
  dns: ['リゾルバーの記録', 'ホスト名の名前解決を端末で確認した。'],
  birthday: ['動物保険カード', 'えるの生年月日：２０２１年６月１９日（保険証より）。'],
  adoption: ['動物譲渡契約書', 'ぐりの生年月日：２０２２年１２月２８日（段ボールの譲渡契約書より）。'],
  construction: ['サーバー室施工契約書', '第９条：暗証番号は猫の誕生日。先に迎えた猫から、月二桁・日二桁で八桁。'],
  'command-book': ['コマンドリファレンス', 'icfg で eth0 の RUNNING、inet、carrier を読む。直した後も同じコマンドで確認。'],
  door: ['サーバー室の二重ロック', '機械錠と電子錠の二重。鍵と８桁の番号、両方そろって開く。'],
};
const $ = selector => document.querySelector(selector);
const formatTime = value => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
const button = (action, text, primary = false) => `<button class="${primary ? 'primary' : 'secondary'}-button" data-action="${action}">${text}</button>`;
const facts = entries => `<dl class="fact-list">${entries.map(([key, value]) => `<dt>${key}</dt><dd>${value}</dd>`).join('')}</dl>`;

export async function startGame() {
  const saved = readSave();
  let state = saved.state, selectedItem = null, currentApp = 'browser', audioContext, soundOn = false;
  let toastTimer, acquisitionTimer, acquisitionBusy = false;
  let introIndex = 0, tutorialActive = false, tutorialProgress = { look: 0, move: 0, inspect: 0 };
  let terminalCwd='/home/memory';
  let terminalHistory = [], commands = [], historyIndex = 0, terminalDraft = '', networkFeedback = '', deviceMode = false;
  const announcements = [], inspectDialog = $('#inspect-dialog'), pcDialog = $('#pc-dialog'), introDialog = $('#intro-dialog'), canvas = $('#room-canvas');
  const topDialog=$('#game-top'),pauseDialog=$('#pause-dialog');
  const minimap=createMinimap($('#minimap-canvas'));
  const files=createFileBrowser(clue,{getChecks:()=>state.taskChecks,onCheck:(id,checked)=>dispatch({type:'TASK_CHECK',id,checked})});
  let disposeCableSearch=null;
  let paperIndex=0,currentPlayer=null;const debugSequence=createDebugSequence();
  const room = createRoom(canvas, {
    onInspect: inspect,
    onPosition: (player,cats)=>{currentPlayer=player;debugSequence.position(player);minimap.update(player,cats);},
    onOperate: operateInspection,
    onProgress: advanceTutorial,
    onNotice: toast,
    onAim: (id, name) => { $('#interact-button').hidden = !id; $('#aim-label').textContent = name || ''; $('#interact-verb').textContent = id?.startsWith('cat-') ? '撫でる' : '調べる'; },
    onLocation: name => { $('#location-name').textContent = name; },
    onMode: (active,name) => { deviceMode=active;document.body.classList.toggle('has-inspection',active);$('#device-toolbar').hidden=!active;$('#inspection-panel').hidden=!active;if(name)$('#inspection-name').textContent=name; $('.movement-help').style.visibility = active ? 'hidden' : ''; $('.touch-controls').style.visibility = active ? 'hidden' : ''; },
    onLock: active => { $('#look-button').textContent = active ? 'Esc で解除' : 'マウス視点'; },
  });
  let conversation = [];
  try { conversation = readHistory(localStorage); } catch { /* 保存不可でも会話を続ける。 */ }
  let activeSkit = null;
  const spoken=new Set(conversation.filter(line=>line.kind!=='opening').map(line=>line.text));
  function recordLine(text,kind='explore') {
    conversation.push({text,kind,elapsed:state.elapsed});conversation=conversation.slice(-HISTORY_LIMIT);
    try { saveHistory(localStorage,conversation); } catch { /* セッション内の履歴は保持する。 */ }
    $('#history-count').textContent=String(conversation.length);
  }
  function showHistory() {
    const list=$('#history-lines');list.replaceChildren();
    if(!conversation.length){const empty=document.createElement('li');empty.className='history-empty';empty.textContent='まだ会話はありません。部屋を調べると、ここに記録されます。';list.append(empty);}
    conversation.forEach(entry=>{const row=document.createElement('li'),meta=document.createElement('div'),speaker=document.createElement('strong'),time=document.createElement('time'),text=document.createElement('p');speaker.textContent='あなた';time.textContent=`${entry.kind==='opening'?'序章':'探索'} / ${formatTime(entry.elapsed)}`;text.textContent=entry.text;meta.append(speaker,time);row.append(meta,text);list.append(row)});
    popover($('#skit'),false);openDialog($('#history-dialog'));requestAnimationFrame(()=>{list.scrollTop=list.scrollHeight});
  }
  const skitWriter = createTypewriter($('#dialogue-text'), $('#skit-prompt'), () => {
    activeSkit=null;popover($('#skit'),false);
    if(!document.querySelector('dialog[open]'))canvas.focus({preventScroll:true});
  });
  const introWriter = createTypewriter($('#intro-dialogue'), $('#intro-next'), () => { if (introIndex < openingBeats.length - 1) { introIndex++; renderOpening(); } else finishIntro(); });
  function clearNarrative() { activeSkit = null; skitWriter.cancel(); popover($('#skit'), false); }
  function popover(node, visible) {
    if (visible && !node.matches(':popover-open')) node.showPopover();
    else if (!visible && node.matches(':popover-open')) node.hidePopover();
  }
  function sound(kind = 'click') {
    if (!soundOn) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)(); audioContext.resume();
      const oscillator = audioContext.createOscillator(), gain = audioContext.createGain(), now = audioContext.currentTime;
      oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(kind === 'pet' ? 85 : kind === 'item' ? 740 : kind === 'success' ? 523 : 330, now); oscillator.frequency.exponentialRampToValueAtTime(kind === 'success' ? 1046 : 510, now + .16);
      gain.gain.setValueAtTime(.035, now); gain.gain.exponentialRampToValueAtTime(.001, now + .23); oscillator.start(now); oscillator.stop(now + .24);
    } catch { soundOn = false; $('#sound-button').setAttribute('aria-pressed', 'false'); }
  }
  function say(text,{repeat=false}={}) {
    if(!repeat&&spoken.has(text))return;spoken.add(text);
    activeSkit=text;recordLine(text);popover($('#skit'),true);skitWriter.show(text);
  }
  function toast(text) { clearTimeout(toastTimer); $('#toast').textContent = text; popover($('#toast'), true); toastTimer = setTimeout(() => popover($('#toast'), false), 3000); }
  function announce(kind, name, image) {
    announcements.push({ kind, name, image }); if (!acquisitionBusy) nextAnnouncement();
  }
  function nextAnnouncement() {
    const entry = announcements.shift(); acquisitionBusy = Boolean(entry);
    if (!entry) return;
    $('#acquisition-kind').textContent = entry.kind; $('#acquisition-name').textContent = entry.name; $('#acquisition-icon').innerHTML = icon(entry.image);
    popover($('#acquisition'), true); sound('item');
    acquisitionTimer = setTimeout(() => { popover($('#acquisition'), false); acquisitionTimer = setTimeout(nextAnnouncement, 180); }, 3000);
  }
  function persist() { const saved=writeSave(state);$('#save-status').textContent=saved?'自動セーブ':'保存を利用できません';return saved; }
  function dispatch(action) {
    const before=state;state=transition(state,action);persist();update();
    if(!before.completed&&state.completed)queueMicrotask(()=>showSuccess(action.type==='DEBUG_CLEAR'));
    if(!before.gameOver&&state.gameOver)queueMicrotask(showGameOver);
  }
  function clue(id) {
    if (state.clues.includes(id)) return;
    dispatch({ type: 'CLUE', id }, false); announce('調査ノートに記録', NOTES[id][0], 'notebook');
  }
  function pickup(id, type, message, details={}) {
    const before = inventory(state); dispatch({ type, ...details }, false);
    if (before.includes(id) || !inventory(state).includes(id)) return;
    announce('アイテムを手に入れた', ITEMS[id].name, ITEMS[id].icon); say(message); sound('item');
  }
  function update() {
    $('#clear-button').hidden=!state.completed;
    room.update(state); $('#clue-count').textContent = `${state.clues.length} / ${CLUES.length}`; $('#timer').textContent = formatTime(state.elapsed);
    $('#connection-light').classList.toggle('online', isOnline(state)); $('#objective-text').textContent = state.gameOver ? '停電 / ゲームオーバー' : state.completed ? '接続復旧 / ステージクリア' : 'ホームページへの接続を復旧する';
    const items = inventory(state), focused = document.activeElement?.dataset.item;
    if (!items.includes(selectedItem)) selectedItem = null;
    $('#inventory-count').textContent = `${items.length} / 4`;
    $('#inventory-slots').innerHTML = Array.from({ length: 4 }, (_, i) => {
      const id = items[i], item = ITEMS[id];
      return `<button class="inventory-slot${id === selectedItem ? ' selected' : ''}" ${item ? `data-item="${id}" aria-label="${item.name}を選ぶ" aria-pressed="${id === selectedItem}"` : 'disabled aria-label="空のアイテム枠"'}><span class="slot-number">${i + 1}</span>${item ? `${icon(item.icon)}<small>${item.name}</small>` : ''}</button>`;
    }).join('');
    if (focused) $(`[data-item="${focused}"]`)?.focus({ preventScroll: true });
  }
  function selectItem(id) {
    if (!inventory(state).includes(id)) return;
    selectedItem = selectedItem === id ? null : id; update(); sound();
    if (selectedItem) say(ITEMS[id].description);
    canvas.focus({ preventScroll: true });
  }
  function syncPause() { const historyOpen=$('#history-dialog').open; document.body.classList.toggle('has-history',historyOpen);document.body.classList.toggle('on-game-top',topDialog.open); if(historyOpen) popover($('#skit'),false); else if(activeSkit && !introDialog.open) popover($('#skit'),true); const active = Boolean(document.querySelector('dialog[open]')); document.body.classList.toggle('has-dialog', active); room.pause(active||state.gameOver,{freeze:topDialog.open||pauseDialog.open||(inspectDialog.open&&inspectDialog.classList.contains('cable-dialog'))}); if (!active) canvas.focus({ preventScroll: true }); }
  function closeDialogs() { document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close()); syncPause(); }
  function openDialog(dialog) {
    if (deviceMode) room.unfocus();
    document.querySelectorAll('dialog[open]').forEach(current => { if (current !== dialog) current.close(); });
    if (!dialog.open) dialog.showModal(); syncPause();
  }
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('close', syncPause));
  function dismissAnnouncements(){
    [toastTimer,acquisitionTimer].forEach(clearTimeout);announcements.length=0;acquisitionBusy=false;
    ['#toast','#acquisition'].forEach(id=>popover($(id),false));
  }
  function showGameTop(){
    stopCableSearch();clearNarrative();dismissAnnouncements();stopTutorial();
    const saved=persist();
    $('#episode-progress').textContent=state.gameOver?'停電 / 探索終了':state.completed?'クリア済み':state.introSeen?`探索中 · ${formatTime(state.elapsed)} · 調査ノート ${state.clues.length} 件`:'未プレイ';
    $('#episode-action').textContent=state.gameOver?'結果を見る ↗':state.introSeen?'つづきから ↗':'はじめる ↗';
    $('.top-save-note').textContent=saved?'進行状況は自動で保存されます。':'このブラウザでは進行状況を保存できません。';
    openDialog(topDialog);
  }
  function playEpisode(){
    topDialog.close();
    if(state.gameOver)showGameOver();else if(!state.introSeen)startIntro();else syncPause();
  }
  function pauseGame(){
    if(document.querySelector('dialog[open]')||state.gameOver)return;
    clearNarrative();dismissAnnouncements();
    const saved=persist();$('#pause-time').textContent=formatTime(state.elapsed);$('#pause-notes').textContent=String(state.clues.length);
    $('#pause-save-status').textContent=saved?'進行状況は自動保存されています。':'このブラウザでは進行状況を保存できません。';
    openDialog(pauseDialog);
  }
  function resumeGame(){pauseDialog.close();syncPause();}
  function panel(title, content, actions = '', kicker = '詳しく調べる') {
    $('#inspect-dialog').classList.remove('lock-dialog','reader-dialog','failure-dialog','clear-dialog','cable-dialog');
    $('#inspect-kicker').textContent = kicker;
    $('#inspect-content').innerHTML = `<h2 id="inspect-title">${title}</h2>${content}${actions ? `<div class="action-list">${actions}</div>` : ''}`;
    openDialog(inspectDialog); sound();
  }
  function renderInspectionActions() {
    const actions=$('#inspection-actions');actions.replaceChildren();
    room.inspectionActions().forEach(({key,label})=>{const button=document.createElement('button');button.className='secondary-button';button.dataset.inspectAction=key;button.textContent=label;actions.append(button)});
    const id=canvas.dataset.inspecting, cableView=['cable','cable-pc','cable-router'].includes(id);
    const add=(key,label)=>{const button=document.createElement('button');button.className='secondary-button';button.dataset.inspectAction=key;button.textContent=label;actions.append(button)};
    if(cableView){
      if(id==='cable')add('cable:examine','被覆を調べる');
      else {const side=id==='cable-pc'?'pc':'router';$('#inspection-description').textContent=`${side==='pc'?'PC':'ルーター'} 側の LAN 端子。透明なハウジング、8 本の接点、固定用の爪。現在は${state[`${side}Connected`]?'接続されている':'抜けている'}。`;add(`${id}:toggle`,state[`${side}Connected`]?'爪を押して抜く':'端子を挿し込む');add(`${id}:reseat`,'差し直す');}
      if(id!=='cable-pc')add('cable:pc','PC 側の端子を見る');if(id!=='cable-router')add('cable:router','ルーター側の端子を見る');if(id!=='cable')add('cable:body','ケーブルに沿って見る');
      if(state.testerTaken)add('cable:test','テスターで導通を調べる');
      if(selectedItem==='usb')add('cable:usb','USB ケーブルを合わせる');
      if(inventory(state).includes('cable'))add('cable:replace','予備の LAN ケーブルに交換');
    }
    if(['modem','network-rack'].includes(id))add('cable:router','LAN 端子の抜き差し');
    if(id==='network-rack')add('rack:router','ルーター本体を調べる');
    if(supplyBox(id)&&room.fixture(`${id}:open`))add(`${id}:search`,supplyBox(id).kind==='cables'&&!state.cablesOnBench?'ケーブル類を作業台へ移す':'中身を調べる');
    if(id==='server-workbench'){
      $('#inspection-description').textContent=state.spareTaken?'LAN ケーブルを取り出した作業台。他のケーブルはマットの上に残っている。':state.cablesOnBench?'保管 04 から運んだ 10 本のケーブルが、作業マットの上で絡まっている。':'照明とマットを備えた整備用の作業台。ケーブルを広げられる空きがある。';
      if(state.cablesOnBench&&!state.spareTaken)add('server-workbench:extract','LAN ケーブルを取り出す');
    }
    if(id==='book'){add('book:basics','ネットワークの仕組みを読む');add('book:network','ネットワーク調査の手引きを読む');}
    if(id==='command-book')add('book:commands','コマンドリファレンスを読む');
    if(id==='lounge-book')add('book:home','本を開く');
    if(id==='nightstand'&&state.nightstandOpen&&!state.keyTaken)add('nightstand:key','真鍮の鍵を取る');
    if(id==='delivery'&&state.boxOpen)add('delivery:papers','中の書類を調べる');
    if(id==='clock')add('clock:time','時刻を確かめる');
    if(id==='breaker')for(const [circuit,name] of [['living','居室・仕事部屋'],['kitchen','キッチン・水回り'],['equipment','機材室']])add(`breaker:${circuit}`,`${name}：${state.circuits[circuit]?'入 → 切':'切 → 入'}`);
    [...actions.children].forEach((button,i)=>{const key=document.createElement('kbd'),label=document.createElement('span');key.textContent=String(i+1);label.textContent=button.textContent;button.replaceChildren(key,label)});
  }
  function operateInspection(key) {
    if(state.gameOver)return;
    let result;
    if(key==='rack:router'){inspect('modem');return;}
    const box=supplyBox(key.split(':')[0]);
    if(key==='server-workbench:extract'){startCableSearch();return;}
    if(box&&key.endsWith(':search')){
      if(!room.fixture(`${box.id}:open`))return;
      if(box.kind==='cables'&&!state.cablesOnBench){
        dispatch({type:'STAGE_CABLES'});if(!state.cablesOnBench)return;
        result='ケーブル類をまとめて作業台へ運んだ。机の上なら、端子を確かめながらほどけそうだ。';
        toast('ケーブル類を作業台へ移した');
      }else result=box.kind==='cables'?'箱は空だ。ケーブル類は奥の作業台へ運んである。':box.text;
      renderInspectionActions();$('#inspection-result').textContent=result;say(result);sound();return;
    }
    if(key.startsWith('book:')&&['network','basics','commands','home'].includes(key.split(':')[1])){showBook(key.split(':')[1]);return;}
    if(key==='nightstand:key'){inspect('key');renderInspectionActions();return;}
    if(key==='delivery:papers'){paperIndex=0;showPaperwork();return;}
    if(key==='nightstand:drawer'){dispatch({type:'CHEST',open:!state.nightstandOpen});result=state.nightstandOpen?'チェストを開いた。眼鏡と耳栓の隣に、小物を置くトレーがある。':'チェストを閉めた。';}
    else if(key==='delivery:open'){dispatch({type:'BOX',open:!state.boxOpen});result=state.boxOpen?'段ボールを開いた。契約書や明細が何枚も重なっている。':'書類を戻し、段ボールを閉じた。';}
    else if(key.startsWith('breaker:')){const circuit=key.split(':')[1];dispatch({type:'BREAKER',circuit,on:!state.circuits[circuit]});result=state.circuits[circuit]?'回路を入れた。灯りと機器に電源が戻る。':'回路を切った。その回路の灯りと機器が止まる。';}
    else if(key==='clock:time'){const now=new Date();result=`時計は ${now.toLocaleTimeString('ja-JP')}。今いる場所の時刻と合っている。秒針も動いている。`;}
    else if(key.startsWith('cable')) {
      if(connectorTimer){clearTimeout(connectorTimer);connectorTimer=null;}
      if(['cable:pc','cable:router','cable:body'].includes(key)){showCable(key==='cable:body'?'cable':`cable-${key.split(':')[1]}`);return;}
      if(key==='cable:replace'){actions.replace();renderInspectionActions();return;}
      if(key==='cable:usb'&&state.usbTaken)result='端子の形が合わない。これは USB ケーブルだ。';
      if(key==='cable:examine'){if(!state.cableReplaced)clue('damage');result=state.cableReplaced?'交換した被覆に傷はない。':'床の折れ跡を拡大した。被覆の内側で芯線が傷んでいる。';}
      if(key==='cable:test'){if(!state.testerTaken)return;if(!state.cableReplaced)clue('damage');result=state.cableReplaced?'導通検査：1〜8 番、すべて正常。端子の接続状態は検査前に戻した。':'導通検査：3・6 番が断線。1・2・4・5・7・8 番は正常。端子の接続状態は検査前に戻した。';}
      const match=key.match(/^cable-(pc|router):(toggle|reseat)$/);
      if(match){const side=match[1],name=side==='pc'?'PC':'ルーター';clue('connector');if(match[2]==='reseat'){dispatch({type:'CONNECTOR',side,connected:false});awaitConnector(side,name);return;}const connected=!state[`${side}Connected`];dispatch({type:'CONNECTOR',side,connected});result=connected?`${name} 側を挿し込んだ。${hasLink(state)?'リンクランプが点灯した。':'リンクランプは消えたまま。'}`:`${name} 側の爪を押して、端子を抜いた。`;}
    } else result=room.operate(key);
    if(!result)return;
    renderInspectionActions();$('#inspection-result').textContent=result;say(result);sound();$('#room-canvas').focus({preventScroll:true});
  }
  let connectorTimer=null;
  function awaitConnector(side,name) {
    clearTimeout(connectorTimer);renderInspectionActions();$('#inspection-result').textContent=`${name} 側の端子を抜いた。`;
    const narrativeAtStart=conversation.length;
    connectorTimer=setTimeout(()=>{connectorTimer=null;dispatch({type:'CONNECTOR',side,connected:true});renderInspectionActions();const result=`${name} 側を差し直した。${hasLink(state)?'リンクランプが点灯した。':'リンクランプは消えたまま。'}`;if(conversation.length===narrativeAtStart&&canvas.dataset.inspecting===`cable-${side}`){$('#inspection-result').textContent=result;say(result)}},650);
  }
  function observe(id,entry) {
    room.focusObject(id);$('#inspection-description').textContent=entry.text;$('#inspection-result').textContent='';renderInspectionActions();
    if(entry.skit)say(entry.skit,{repeat:true});
  }
  function inspect(id) {
    clearTimeout(connectorTimer);connectorTimer=null;
    if (introDialog.open||state.gameOver) return;
    clearNarrative();
    advanceTutorial('inspect', 1);
    if (EXTRA_INSPECTIONS[id]) {
      const entry=EXTRA_INSPECTIONS[id];clue(id);observe(id,entry);return;
    }
    if (id === 'pc') {
      if (!pcPowered(state)) { say('画面が真っ暗。電源が入っていない。'); return; }
      openPC(); return;
    }
    if (id === 'modem') {
      clue('modem');observe(id,{text:'前面のランプと、背面のポート。ドラッグして裏へ回り込める。電源スイッチは本体をクリックして操作する。',skit:'まずはこいつから。ランプと配線を見せてもらおう。'});return;
    }
    if (id === 'modem-switch') { dispatch({ type: 'MODEM', on: !state.modemOn }); say(state.modemOn ? 'ルーターの電源を入れた。' : 'ルーターの電源を切った。'); return; }
    if (id === 'power') {
      clue('power'); dispatch({ type: 'POWER', on: !state.powerOn }); say(state.powerOn ? 'タップの電源を入れた。PC の電源が戻った。' : 'タップの電源を切った。PC のランプが消えた。'); return;
    }
    if (id === 'drawer') {
      if (!state.drawerOpen) { dispatch({ type: 'DRAWER' }, false); say('引き出しが開いた。小物がいくつか入ってる。'); }
      else panel('引き出しの中','<p>測定器と文具、それからカードケースに入った保険証。</p>',button('read-insurance','保険証を調べる')+(!state.testerTaken?button('take-tester','LAN テスターを取る'):''));
      return;
    }
    if (id === 'key') { pickup('key', 'TAKE_KEY', '小さな鍵。「サーバー室」って書いてある。'); return; }
    if (id === 'tester') { pickup('tester', 'TAKE_TESTER', 'テスターの電池、まだ残ってる。'); return; }
    if (id === 'spare') return;
    if (id === 'usb') { pickup('usb', 'TAKE_USB', 'ケーブルはケーブルでも、これは USB。まぎらわしい。'); return; }
    if (id === 'door' || id === 'keypad') { clue('door'); showDoor(id === 'keypad'); return; }
    if(id==='birthday'){if(!state.drawerOpen)return;clue('birthday');panel('どうぶつ健康保険証',insuranceMarkup());say('えるの保険証。生年月日の欄……もう５歳になったのか。早いな。',{repeat:true});return;}
    if (id === 'invoice') {
      clue('invoice'); panel('通信料金の明細',invoiceMarkup());say('振替済み、未払いゼロ。料金滞納の線は消えた。',{repeat:true});return;
    }
    if(id==='command-book'||id==='lounge-book'){observe(id,{text:id==='command-book'?'使い込まれたコマンドリファレンス。目次から必要なページを探せる。':'猫と暮らす日々を綴った本。紙の束と、布張りの表紙。'});return;}
    if (id === 'book') {
      clue('book');observe(id,{text:'ネットワーク、ＯＳ、データベース、設計、アルゴリズム。背表紙の厚さも日焼けの具合もばらばらだ。\n\n付箋のはみ出た「ネットワーク調査の手引き」を引き出せる。',skit:'読んだ本と積んだ本、比率は聞かないでほしい。'});
      return;
    }
    if (['cable','cable-pc','cable-router'].includes(id)) { showCable(id); return; }
    if (id === 'cat-mugi') { room.pet(id); say('えるをそっと撫でた。青い目を細めて、ふわふわの頬を手にすり寄せてくる。……ごろごろ。'); toast('えるを撫でた'); sound('pet'); return; }
    if (id === 'cat-sumi') { room.pet(id); say('ぐりを撫でると、灰色のしっぽがゆっくり揺れた。手の下にもぐりこんで、もう一回、と催促している。'); toast('ぐりを撫でた'); sound('pet'); }
  }
  function startCableSearch() {
    if(!serverOpen(state)||!state.cablesOnBench||state.spareTaken)return;
    clearNarrative();dismissAnnouncements();panel('ケーブル救出','<div id="cable-search-mount"></div>','','作業台');inspectDialog.classList.add('cable-dialog');syncPause();
    let awarded=false;
    inspectDialog.addEventListener('close',()=>{if(awarded){announce('アイテムを手に入れた',ITEMS.cable.name,ITEMS.cable.icon);say('LAN ケーブルを取り出した。端子も爪も、まだきれいだ。');}},{once:true});
    disposeCableSearch=mountCableSearch($('#cable-search-mount'),proof=>{dispatch({type:'TAKE_CABLE',extraction:proof});awarded=state.spareTaken;if(awarded)sound('success');return awarded;});
  }
  function stopCableSearch(){disposeCableSearch?.();disposeCableSearch=null;}
  inspectDialog.addEventListener('close',stopCableSearch);
  function showDoor(keypad=true,feedback='') {
    const keypadUI=state.codeAccepted?`<div class="keypad-accepted">${icon('check')}<strong>認証済み</strong><span>${state.keyInserted?'ロックを解除しました':'鍵のロックを解除してください'}</span></div>`:`<form id="code-form" class="code-form" novalidate><div class="keypad-fields"><label>暗証番号<input id="code-value" name="code" inputmode="numeric" pattern="[0-9]{8}" maxlength="8" placeholder="− − − − − − − −" autocomplete="off" aria-label="暗証番号・８桁" required></label></div><p id="code-feedback" class="code-feedback" role="status">${feedback||'８桁の暗証番号を入力してください'}</p><div class="keypad-grid">${[1,2,3,4,5,6,7,8,9].map(digit=>`<button type="button" data-digit="${digit}" aria-label="${digit}">${digit}</button>`).join('')}<button type="button" data-keypad="delete" aria-label="一文字消す">⌫</button><button type="button" data-digit="0" aria-label="0">0<span>●</span></button><button type="submit" class="keypad-enter">確定</button></div></form>`;
    panel('サーバー室の電子錠',`<div class="lock-console"><div class="lock-console-head">${icon('lock')}<span>入室認証</span><i class="${serverOpen(state)?'unlocked':''}"></i></div><div class="door-status"><span class="${state.keyInserted?'good':''}">${icon('key')} 鍵：${state.keyInserted?'解除':'施錠'}</span><span class="${state.codeAccepted?'good':''}">${icon('lock')} 番号：${state.codeAccepted?'認証済み':'未認証'}</span></div>${keypadUI}</div>`,(!state.keyInserted&&state.keyTaken?button('insert-key','サーバー室の鍵を使う',true):'')+(serverOpen(state)?button('keep-exploring','扉をくぐる',true):''),'１階 / 二重ロック');
    inspectDialog.classList.add('lock-dialog');
  }
  function showBook(kind) {
    panel(kind==='commands'?'memoryOSコマンドリファレンス':kind==='home'?'猫と暮らす日々の記録':kind==='basics'?'ネットワークの仕組み':'ネットワーク調査の手引き','<div id="book-mount"></div>','','本を読む');inspectDialog.classList.add('reader-dialog');
    mountBook($('#book-mount'),kind,page=>{if(kind==='commands'&&page>=4)clue('command-book');else if(['network','basics'].includes(kind))clue('book')});
  }
  function showPaperwork() {
    if(!state.boxOpen)return;
    const doc=PAPERWORK[paperIndex];panel('段ボールの書類',`<div class="paper-stack">${documentMarkup(doc)}</div><nav class="paper-controls"><button class="secondary-button" data-action="paper-prev" ${paperIndex===0?'disabled':''}><kbd>1</kbd> 一枚戻す</button><span>${paperIndex+1} / ${PAPERWORK.length}</span><button class="secondary-button" data-action="paper-next" ${paperIndex===PAPERWORK.length-1?'disabled':''}><kbd>2</kbd> 次の書類</button></nav>`,'','書類を一枚ずつ調べる');inspectDialog.classList.add('reader-dialog');if(doc.clue)clue(doc.clue);
  }
  function showGameOver(){
    closeDialogs();room.unfocus();clearNarrative();panel('家中の電気が、一斉に落ちた。','<div class="failure-content"><span class="eyebrow">ゲームオーバー</span><h3>サーバー室から、ファンの音が消えた。</h3><p>三つの回路をすべて切ってしまった。処理を回していた検証用 PC は電源を突然断たれ、二度と起動しなくなった。</p><p>ブレーカーを落とす前に、その回路の先で何が動いているか。確かめる手段は、そろっていたはずだ。</p></div>',button('restart-confirm','最初からやり直す',true)+button('game-top','ゲームトップへ戻る'),'停電');inspectDialog.classList.add('failure-dialog');
  }
  function showCable(id='cable') {
    closeDialogs();
    observe(id,{text:id==='cable'?'PC とルーターをつなぐ LAN ケーブル。ドラッグで角度を変え、ホイールで近づける。':`${id==='cable-pc'?'PC':'ルーター'} 側の LAN 端子。透明なハウジング、8 本の接点、固定用の爪。現在は${state[id==='cable-pc'?'pcConnected':'routerConnected']?'接続されている':'抜けている'}。`,skit:id==='cable'?'配線をたどってみよう。':undefined});
  }
  function openPC(app = currentApp) { currentApp = app; renderPC(); openDialog(pcDialog); sound(); }
  function renderPC() {
    document.querySelectorAll('[data-app]').forEach(node => { node.classList.toggle('active', node.dataset.app === currentApp); node.setAttribute('aria-pressed', String(node.dataset.app === currentApp)); });
    $('#pc-status-dot').classList.toggle('online', hasLink(state));
    const content = $('#pc-content');
    if (currentApp === 'browser') {
      const view = browserView(state);
      content.innerHTML = `<div class="address-bar">${icon('globe')}<span>https://i.mem.ooo/</span>${view.kind==='online'?'<a href="https://i.mem.ooo/" target="_blank" rel="noopener noreferrer" aria-label="i.mem.ooo を別のタブで開く">別タブで開く ↗</a>':''}</div>${view.kind==='online'?'<div class="live-website"><iframe id="homepage-frame" title="i.mem.ooo のホームページ" src="https://i.mem.ooo/" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"></iframe></div>':`<div class="browser-page">${icon('globe')}<h3>${view.heading}</h3><p>${view.description}</p><code>${view.code}</code>${button('reload-page','再読み込み')}</div>`}`;
    } else if(currentApp==='files'){files.mount(content);
    } else if (currentApp === 'network') {
      const link = hasLink(state), ip = link && state.autoIP;
      content.innerHTML = `<div class="app-toolbar"><span>システム設定 / ネットワーク</span><small>有線接続</small></div><div class="network-panel"><div class="network-heading">${icon('network')}<div><h3>有線接続</h3><p>eth0 · ${link ? '接続済み / 1000 Mbps' : '未接続'}</p></div></div>${facts([['IPv4', ip ? '192.168.10.24 / 24' : '—'], ['ゲートウェイ', ip ? '192.168.10.1' : '—'], ['DNS', ip && state.autoDNS ? '192.168.10.1' : '—'], ['MAC', '02:00:00:00:10:24']])}<form id="network-form"><label class="settings-row" for="ip-mode">IPv4 の構成<select id="ip-mode" name="ip"><option value="auto"${state.autoIP ? ' selected' : ''}>自動 / DHCP</option><option value="manual"${!state.autoIP ? ' selected' : ''}>手動 / 未設定</option></select></label><label class="settings-row" for="dns-mode">DNS の構成<select id="dns-mode" name="dns"><option value="auto"${state.autoDNS ? ' selected' : ''}>自動</option><option value="manual"${!state.autoDNS ? ' selected' : ''}>手動 / 未設定</option></select></label><div class="action-list"><button type="submit" class="primary-button">変更を適用</button><button type="button" class="secondary-button" data-action="renew-dhcp">DHCP リースを更新</button></div></form><p id="network-feedback" class="network-feedback" role="status"></p></div>`;
      $('#network-feedback').textContent = networkFeedback;
    } else {
      content.innerHTML = '<div class="terminal"><div class="app-toolbar"><span>memory@memory-home: ~</span><small>memoryOS 端末 — 80 × 24</small></div><div class="terminal-scroll" id="terminal-scroll"><pre id="terminal-output" aria-live="polite" aria-label="端末の出力"></pre><form id="terminal-form" class="terminal-form"><label for="terminal-input" class="terminal-prompt">memory@home:~ $</label><input id="terminal-input" name="command" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="160" aria-label="コマンド入力"></form></div><div class="terminal-status"><span>ローカル端末</span><span>UTF-8 / eth0</span></div></div>';
      $('#terminal-input').value = terminalDraft; renderTerminal(); $('#terminal-input').focus({preventScroll:true});
    }
  }
  function renderTerminal() { if($('.terminal-prompt'))$('.terminal-prompt').textContent=terminalPrompt(terminalCwd);const out = $('#terminal-output'); if (out) { out.textContent = terminalHistory.join('\n\n'); $('#terminal-scroll').scrollTop = $('#terminal-scroll').scrollHeight; } }
  function runCommand(input) {
    if (!input.trim()) return;
    const submittedCwd=terminalCwd;
    const result = executeCommand(input, state,{cwd:terminalCwd,history:commands});
    if(result.cwd)terminalCwd=result.cwd;
    commands.push(input); commands = commands.slice(-50); historyIndex = commands.length;
    if (result.clear) terminalHistory = [];
    else { terminalHistory.push(commandTranscript(submittedCwd,input,result.output)); terminalHistory = terminalHistory.slice(-35); }
    if (result.clue) clue(result.clue);
    renderTerminal(); sound();
    if(result.verifyInterface)dispatch({type:'VERIFY_INTERFACE'});
  }
  function showJournal() {
    panel('調査ノート', state.clues.length ? `<ul class="journal-list">${state.clues.map(id => `<li>${icon('check')}<div><strong>${NOTES[id][0]}</strong><p>${NOTES[id][1]}</p></div></li>`).join('')}</ul>` : `<div class="journal-empty">${icon('notebook')}<p>まだ、白紙。</p></div>`, '', `調査ノート / ${state.clues.length} / ${CLUES.length}`);
  }
  function showSuccess(debug=false) {
    if (!state.completed) return;
    stopCableSearch();closeDialogs(); room.unfocus(); clearNarrative(); sound('success');
    panel('ゲームクリア', `<div class="success-content"><div class="success-mark">${icon('check')}</div><span class="eyebrow">ステージクリア</span><h3>おかえり、インターネット。</h3><p>原因は、椅子の下でずっと踏まれていた LAN ケーブルの断線。<br>${debug?'デバッグ操作で復旧状態へ移行した。':'予備に交換し、icfg で eth0 の復旧をこの目で確認した。これで明日の朝に間に合う。'}</p><div class="success-stats"><div><strong>${formatTime(state.elapsed)}</strong><span>探索時間</span></div><div><strong>${state.clues.length} / ${CLUES.length}</strong><span>調査ノート</span></div></div></div>`, button('view-homepage', 'ホームページを開く', true) + button('keep-exploring', '探索を続ける'), '第一話 / リンクダウン');
    inspectDialog.classList.add('clear-dialog');
    const share=document.createElement('a');share.id='clear-share';share.className='secondary-button clear-share';share.href=buildXShareUrl(formatTime(state.elapsed));share.target='_blank';share.rel='noopener noreferrer';share.textContent='X でクリア時間をシェア';
    inspectDialog.querySelector('.action-list').append(share);
  }
  function restart() {
    stopCableSearch();
    clearTimeout(connectorTimer);connectorTimer=null;
    clearIntroTimers(); stopTutorial(); [toastTimer, acquisitionTimer].forEach(clearTimeout); clearNarrative();
    announcements.length = 0; acquisitionBusy = false;
    ['#skit', '#toast', '#acquisition'].forEach(id => popover($(id), false));
    spoken.clear();files.reset();conversation=[];try{saveHistory(localStorage,conversation)}catch{}$('#history-count').textContent='0';
    state = initialState();terminalCwd='/home/memory'; selectedItem = null; terminalHistory = []; commands = []; historyIndex = 0; terminalDraft = ''; networkFeedback = ''; currentApp = 'browser';
    debugSequence.reset();room.reset(); persist(); update(); startIntro();
  }
  function clearIntroTimers() { introWriter.cancel(); }
  function finishIntro() {
    if (!introDialog.open) return;
    clearIntroTimers(); introDialog.close(); document.body.classList.remove('opening-playing'); room.opening(null);
    if (!state.introSeen) dispatch({ type: 'INTRO' }, false);
    openDialog($('#briefing-dialog'));
  }
  function beginExploring() {
    $('#briefing-dialog').close();syncPause();canvas.focus({preventScroll:true});
    if (!state.completed) { tutorialActive = true; tutorialProgress = { look: 0, move: 0, inspect: 0 }; renderTutorial(); }
  }

  const openingBeats = [
    { phase: 'work', screen: 'loading', title: '今日も、システムエンジニアの仕事だ。', text: '今日もシステムエンジニアの仕事だ…。明日の朝いちで先方が見るから、午前中に改修の動作確認まで終わらせたい。まずはいつものサイトから。', status: '作業用サイトを開いています' },
    { phase: 'failed', screen: 'error', title: '……あれ？', text: '「インターネットに接続されていません」……？　昨日の夜は普通に見られたはず。読み込み直せば直るやつであってくれ。', status: 'ページを表示できませんでした' },
    { phase: 'retrying', screen: 'loading', title: 'もう一回だけ。', text: 'リロード。……仕様書もリポジトリも全部この先にあるんだよな。頼む。', status: 'もう一度アクセスしています' },
    { phase: 'panic', screen: 'error', title: 'だめだ。切り分けよう。', text: '同じエラー。ということは一時的な引っかかりじゃない。回線障害か、未払い……はないはず。機器か、配線か。落ち着いて、下の層から順番に見ていこう。', status: '接続できません' },
  ];
  function renderOpening() {
    const beat = openingBeats[introIndex]; recordLine(beat.text,'opening');
    introDialog.dataset.phase = beat.phase; $('#intro-title').textContent = beat.title; $('#intro-status').textContent = beat.status;
    $('#intro-chapter').textContent = `序章 / ${introIndex + 1} / ${openingBeats.length}`;
    $('#intro-next').hidden = false;
    room.opening(beat.screen);
    introWriter.show(beat.text);
  }
  function startIntro() {
    clearIntroTimers(); stopTutorial(); [toastTimer, acquisitionTimer].forEach(clearTimeout); clearNarrative();
    announcements.length = 0; acquisitionBusy = false;
    ['#toast', '#acquisition'].forEach(id => popover($(id), false));
    $('#intro-kicker').textContent = state.introSeen ? '第１話 / 序章の再生' : '第１話 / いつもの仕事部屋';
    introIndex = 0; document.body.classList.add('opening-playing'); openDialog(introDialog); renderOpening();
  }
  const tutorialSteps = [
    { id: 'look', threshold: .22, title: 'まずは、見回してみよう。', description: '画面をドラッグして周りを見る。矢印キーでも視点を動かせます。' },
    { id: 'move', threshold: .35, title: '席を離れて、歩いてみよう。', description: '床をダブルクリックすると、その場所へ歩きます。W / A / S / D でも移動できます。' },
    { id: 'inspect', threshold: 1, title: '気になるものを、調べよう。', description: '物や猫をクリックすると選んで調べます。離れていれば自動で近づきます。X キーも使えます。' },
  ];
  function stopTutorial() { tutorialActive = false; $('#tutorial').hidden = true; }
  function renderTutorial() {
    const index = tutorialSteps.findIndex(step => tutorialProgress[step.id] < step.threshold);
    if (!tutorialActive || index < 0) { stopTutorial(); return; }
    const step = tutorialSteps[index]; $('#tutorial').hidden = false; $('#tutorial').dataset.step = step.id;
    $('#tutorial-counter').textContent = `操作ガイド / ${index + 1} / 3`; $('#tutorial-title').textContent = step.title; $('#tutorial-description').textContent = step.description;
    document.querySelectorAll('.tutorial-progress i').forEach((node, i) => node.classList.toggle('complete', tutorialProgress[tutorialSteps[i].id] >= tutorialSteps[i].threshold));
  }
  function advanceTutorial(action, amount) {
    if (!tutorialActive || introDialog.open) return;
    const step = tutorialSteps.find(step => step.id === action);
    if (!step || tutorialProgress[action] >= step.threshold) return;
    tutorialProgress[action] += amount;
    if (tutorialProgress[action] >= step.threshold) renderTutorial();
  }
  const actions = {
    'read-network-book':()=>showBook('network'),
    'paper-prev':()=>{if(paperIndex>0){paperIndex--;showPaperwork()}},
    'paper-next':()=>{if(paperIndex<PAPERWORK.length-1){paperIndex++;showPaperwork()}},
    'read-insurance':()=>inspect('birthday'),
    'take-key': () => { closeDialogs(); inspect('key'); },
    'take-tester': () => { closeDialogs(); inspect('tester'); },
    'insert-key': () => { dispatch({ type: 'INSERT_KEY' }, false); showDoor(); say(serverOpen(state) ? 'カチッ。ふたつのロックが外れた。' : '鍵が回った。電子錠は、まだ閉じてる。'); },
    keypad: () => showDoor(true),
    replace: () => { if (!inventory(state).includes('cable')) return; closeDialogs(); dispatch({ type: 'REPLACE' }); announce('ケーブル交換完了', '壊れた LAN を回収', 'cable'); say('新しいケーブルを接続した。'); },
    'reload-page': () => { renderPC(); sound(); if (!isOnline(state)) say('読み込み直しても、同じエラーだ。'); },
    'renew-dhcp': () => { clue('dhcp'); networkFeedback = !hasLink(state) ? 'eth0: no carrier / リースを取得できませんでした。' : !state.autoIP ? 'DHCP は無効です。' : 'リース取得: 192.168.10.24 / 24'; renderPC(); },
    'view-homepage': () => openPC('browser'), 'keep-exploring': closeDialogs, 'restart-confirm': restart, 'replay-intro': startIntro,
    'game-top':showGameTop,
  };
  document.addEventListener('click', event => {

    const fixture=event.target.closest('[data-inspect-action]');if(fixture)operateInspection(fixture.dataset.inspectAction);
    const digit=event.target.closest('[data-digit]');
    if(digit&&$('#code-value')){const input=$('#code-value');input.value=(input.value+digit.dataset.digit).slice(0,8);$('#code-feedback').textContent=`${input.value.length} / 8`;sound();}
    if(event.target.closest('[data-keypad="delete"]')&&$('#code-value')){const input=$('#code-value');input.value=input.value.slice(0,-1);sound();}
    const target = event.target.closest('[data-action]'); if (target && !target.disabled) actions[target.dataset.action]?.();
    const app = event.target.closest('[data-app]'); if (app) { if ($('#terminal-input')) terminalDraft = $('#terminal-input').value; currentApp = app.dataset.app; renderPC(); sound(); }
    const item = event.target.closest('[data-item]'); if (item) selectItem(item.dataset.item);
    if (event.target.closest('.close-dialog')) !state.gameOver&&event.target.closest('dialog').close();
  });
  document.addEventListener('submit', event => {
    if (event.target.id === 'network-form') {
      event.preventDefault(); const form = new FormData(event.target);
      dispatch({ type: 'SETTINGS', autoIP: form.get('ip') === 'auto', autoDNS: form.get('dns') === 'auto' });
      networkFeedback = '変更を適用しました。'; renderPC();
    } else if (event.target.id === 'terminal-form') {
      event.preventDefault(); const input = $('#terminal-input'); if (event.isComposing) return; runCommand(input.value); input.value = ''; terminalDraft = ''; input.focus({preventScroll:true});
    } else if (event.target.id === 'code-form') {
      event.preventDefault();const data=new FormData(event.target),code=String(data.get('code')).replace(/[０-９]/g,digit=>String.fromCharCode(digit.charCodeAt(0)-0xfee0));
      if(!/^[0-9]{8}$/.test(code)){$('#code-feedback').textContent='８桁の番号を入力してください。';return;}
      dispatch({type:'CODE',code});
      if(state.codeAccepted){showDoor();say(serverOpen(state)?'電子錠が開いた。サーバー室に入れそう。':'認証音が鳴った。あとは、もうひとつの錠前。');}
      else{$('#code-feedback').textContent='認証失敗。番号と並び順を確認してください。';sound();}
    }
  });
  document.addEventListener('keydown', event => {
    if (event.isComposing) return;
    const consume=()=>{event.preventDefault();event.stopImmediatePropagation()};
    // 会話の Esc は入力欄やダイアログの閉じる処理より先に受け取る。
    if(event.key==='Escape'&&!event.altKey&&!event.ctrlKey&&!event.metaKey){
      if(event.repeat){consume();return;}
      if(topDialog.open){consume();return;}
      if(introDialog.open){consume();introWriter.advance();return;}
      if(activeSkit&&$('#skit').matches(':popover-open')){consume();skitWriter.advance();return;}
      if(!document.querySelector('dialog[open]')&&!state.gameOver){consume();if(deviceMode)room.unfocus();else pauseGame();return;}
    }
    if (event.target.id === 'terminal-input') {
      if (['ArrowUp', 'ArrowDown'].includes(event.key)) { event.preventDefault(); historyIndex = Math.max(0, Math.min(commands.length, historyIndex + (event.key === 'ArrowUp' ? -1 : 1))); event.target.value = commands[historyIndex] || ''; }
      if (event.ctrlKey && event.key === 'l') { event.preventDefault(); terminalHistory = []; renderTerminal(); }
      return;
    }
    if(event.altKey||event.ctrlKey||event.metaKey||/INPUT|SELECT|TEXTAREA/.test(event.target.tagName))return;
    if(state.gameOver){if(event.key==='Escape')consume();return;}
    if(['KeyX','Space'].includes(event.code)){
      if(event.repeat){consume();return;}
      if(introDialog.open){consume();introWriter.advance();return;}
      if($('#briefing-dialog').open){consume();beginExploring();return;}
      if(activeSkit&&$('#skit').matches(':popover-open')){consume();skitWriter.advance();return;}
      if(!document.querySelector('dialog[open]')){consume();room.interact();canvas.focus({preventScroll:true});return;}
    }
    if(/^[1-9]$/.test(event.key)){
      const index=Number(event.key)-1;
      const reader=inspectDialog.open?inspectDialog.querySelectorAll('.book-controls button,.paper-controls button'):[];
      const fixture=!document.querySelector('dialog[open]')&&deviceMode?$('#inspection-actions').children:[];
      const target=reader[index]||fixture[index];
      if(target){consume();if(!target.disabled)target.click();return;}
      if(!document.querySelector('dialog[open]')&&!deviceMode){const id=inventory(state)[index];if(id){consume();selectItem(id)}}
    }
    if(document.querySelector('dialog[open]'))return;
    if(!deviceMode){const action=debugSequence.press(event,currentPlayer);if(action){dispatch(action);if(action.type==='DEBUG_UNLOCK')toast('デバッグ：サーバー室を解錠しました。');}}
    if(event.code==='KeyJ')showJournal();if(event.code==='KeyL')showHistory();
  },true);
  inspectDialog.addEventListener('cancel',event=>{if(state.gameOver)event.preventDefault()});
  $('#history-button').addEventListener('click',showHistory);
  $('#episode-one').addEventListener('click',playEpisode);
  $('#pause-button').addEventListener('click',pauseGame);
  $('#resume-game').addEventListener('click',resumeGame);
  $('#return-game-top').addEventListener('click',showGameTop);
  topDialog.addEventListener('cancel',event=>event.preventDefault());
  pauseDialog.addEventListener('cancel',event=>{event.preventDefault();resumeGame();});
  $('#skit-log').addEventListener('click',showHistory);
  $('#history-count').textContent=String(conversation.length);
  $('#journal-button').addEventListener('click', showJournal);
  $('#interact-button').addEventListener('click', () => { room.interact(); canvas.focus({ preventScroll: true }); });
  $('#leave-device').addEventListener('click', () => room.unfocus());
  $('#look-button').addEventListener('click', async () => { canvas.focus({ preventScroll: true }); if (!await room.lock()) toast('ドラッグでも見回せます。'); });
  $('#restart-button').addEventListener('click', () => panel('最初から始めますか', '<p>このステージの進行、アイテム、調査ノート、会話ログをリセットします。</p>', button('restart-confirm', '最初から', true) + button('keep-exploring', '戻る'), '新しく始める'));
  $('#clear-button').addEventListener('click',()=>showSuccess());
  $('#help-button').addEventListener('click', () => panel('家の中を、歩く。', facts([['移動', '床をダブルクリック / W A S D'], ['見回す', 'ドラッグ / 矢印キー'], ['調べる・撫でる', '物や猫をクリック / X / Space'], ['早歩き', 'Shift + 移動'], ['観察中の操作', '数字 1 ～ 9'], ['会話を進める', 'クリック / X / Space / Esc'], ['アイテム選択', '探索中に数字 1 ～ 4'], ['調査ノート', 'J'], ['戻る・ポーズ', '会話・観察を閉じた状態で Esc'], ['拡大して観察', 'ドラッグ / 矢印キー / ホイール'], ['会話ログ', 'L / 画面右上の会話ログ']]) + '<p>物に近づき、いろいろな角度から見てみましょう。階段は歩いて登り降りできます。時間制限はありません。</p><p class="inline-note">進行はこのブラウザに保存。再訪時は 2 階の居室から再開します。通信や端末はゲーム内のシミュレーションです。復旧後のブラウザには実際の i.mem.ooo を表示します。</p>', button('replay-intro', 'オープニングを見る'), '操作方法'));
  $('#sound-button').addEventListener('click', () => { soundOn = !soundOn; $('#sound-button').setAttribute('aria-pressed', String(soundOn)); $('#sound-button').setAttribute('aria-label', soundOn ? '効果音をオフ' : '効果音をオン'); sound(); });
  $('#skit').addEventListener('click', event => { if(!event.target.closest('#skit-log'))skitWriter.advance(); });
  $('.intro-story').addEventListener('click', event => { if (!event.target.closest('#begin-exploring')) introWriter.advance(); });
  $('#skip-intro').addEventListener('click', finishIntro);
  $('#begin-exploring').addEventListener('click', beginExploring);
  $('#briefing-dialog').addEventListener('cancel',event=>{event.preventDefault();beginExploring();});
  $('#skip-tutorial').addEventListener('click', () => { stopTutorial(); canvas.focus({ preventScroll: true }); });
  introDialog.addEventListener('cancel', event => { event.preventDefault(); finishIntro(); });
  let joystickPointer = null;
  function moveJoystick(event) { if (event.pointerId !== joystickPointer) return; const rect = $('#joystick').getBoundingClientRect(), dx = event.clientX - rect.left - rect.width / 2, dy = event.clientY - rect.top - rect.height / 2, length = Math.max(32, Math.hypot(dx, dy)); const x = dx / length, y = dy / length; room.pad(x, y); $('#joystick-knob').style.transform = `translate(${x * 27}px,${y * 27}px)`; }
  $('#joystick').addEventListener('pointerdown', event => { joystickPointer = event.pointerId; $('#joystick').setPointerCapture(event.pointerId); moveJoystick(event); });
  $('#joystick').addEventListener('pointermove', moveJoystick);
  function releaseJoystick() { joystickPointer = null; room.pad(0, 0); $('#joystick-knob').style.transform = ''; }
  $('#joystick').addEventListener('pointerup', releaseJoystick); $('#joystick').addEventListener('pointercancel', releaseJoystick); window.addEventListener('blur', releaseJoystick);
  setInterval(() => { if (document.hidden || topDialog.open || pauseDialog.open || introDialog.open || !state.introSeen || state.completed || state.gameOver) return; state = transition(state, { type: 'TICK' }); $('#timer').textContent = formatTime(state.elapsed); if (state.elapsed % 5 === 0) persist(); }, 1000);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { persist(); releaseJoystick(); } }); window.addEventListener('pagehide', persist);
  hydrateIcons(); update(); $('#loading').hidden = true;
  if (saved.status === 'invalid') toast('保存データを読み取れなかったため、新しく開始します。');
  if (saved.status === 'unavailable') $('#save-status').textContent = '保存を利用できません';
  showGameTop();
}
