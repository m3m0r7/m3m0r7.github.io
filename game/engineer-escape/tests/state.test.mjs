import test from 'node:test';
import assert from 'node:assert/strict';
import { CAT_CODES, initialState, transition, hydrate, inventory, hasLink, isOnline, serverOpen, readSave, writeSave } from '../js/state.mjs';
import { SPAWN, movePlayer, canStand } from '../js/movement.mjs';
import { executeCommand } from '../js/terminal.mjs';

const run = (state, ...actions) => actions.reduce((current, action) => transition(current, typeof action === 'string' ? { type: action } : action), state);
const extracted={type:'TAKE_CABLE',extraction:{kind:'lan',held:false,clearance:1,settledFor:.8,points:Array.from({length:32},(_,i)=>[5+i*.15,.1,0])}};
const code = { type: 'CODE', code:CAT_CODES.eru+CAT_CODES.guri };
const chest={type:'CHEST',open:true};
const unlocked = () => run(initialState(), 'DRAWER', chest, 'TAKE_KEY', 'INSERT_KEY', code);
const repaired = () => run(unlocked(), 'STAGE_CABLES', extracted, 'REPLACE');

test('鍵と正しい暗証番号の両方がなければサーバー室を開けない', () => {
  for (const state of [initialState(), run(initialState(), code), run(initialState(), 'DRAWER', chest, 'TAKE_KEY', 'INSERT_KEY'), run(initialState(), 'DRAWER', chest, 'TAKE_KEY', 'INSERT_KEY', { type: 'CODE', code: '417' }), run(initialState(), 'DRAWER', chest, 'TAKE_KEY', 'INSERT_KEY', { type: 'CODE', code: '1111' })]) {
    assert.equal(serverOpen(state), false);
    assert.deepEqual(run(state, extracted, 'TAKE_USB', 'REPLACE'), state);
  }
  assert.equal(serverOpen(unlocked()), true);
  assert.equal(serverOpen(run(initialState(), code, 'DRAWER', chest, 'TAKE_KEY', 'INSERT_KEY')), true);
});

test('拾う・開錠する・交換する操作を繰り返しても増殖しない', () => {
  assert.deepEqual(run(initialState(), 'TAKE_KEY', 'TAKE_TESTER', 'INSERT_KEY', 'REPLACE', 'VERIFY_INTERFACE'), initialState());
  const state = run(unlocked(), 'TAKE_TESTER', 'TAKE_USB', 'STAGE_CABLES', extracted);
  assert.deepEqual(inventory(state), ['tester', 'usb', 'cable']);
  const replaced = run(state, 'REPLACE');
  assert.deepEqual(inventory(replaced), ['tester', 'usb', 'broken']);
  assert.deepEqual(run(replaced, 'TAKE_KEY', 'INSERT_KEY', code, extracted, 'REPLACE'), replaced);
  assert.deepEqual(run(state, { type: 'CLUE', id: 'birthday' }, { type: 'CLUE', id: 'birthday' }).clues, ['birthday']);
});

test('配線・給電・IP・DNS が揃うまではクリアしない', () => {
  const rebooted = run(initialState(), { type: 'POWER', on: false }, { type: 'POWER', on: true }, { type: 'MODEM', on: false }, { type: 'MODEM', on: true }, 'VERIFY_INTERFACE');
  assert.equal(hasLink(rebooted), false); assert.equal(rebooted.completed, false);
  for (const action of [{ type: 'POWER', on: false }, { type: 'MODEM', on: false }, { type: 'SETTINGS', autoIP: false, autoDNS: true }, { type: 'SETTINGS', autoIP: true, autoDNS: false }]) {
    const state = run(repaired(), action, 'VERIFY_INTERFACE'); assert.equal(isOnline(state), false); assert.equal(state.completed, false);
  }
  assert.equal(run(repaired(), 'VERIFY_INTERFACE').completed, true);
  const off = run(repaired(), { type: 'POWER', on: false });
  assert.deepEqual(run(off, { type: 'POWER', on: false }), off);
});

test('保存の往復と、鍵・扉・所持品の依存関係を検証する', () => {
  const state = run(repaired(), 'TAKE_TESTER', 'TAKE_USB', 'VERIFY_INTERFACE', { type: 'POWER', on: false });
  assert.deepEqual(hydrate(JSON.parse(JSON.stringify(state))), state);
  for (const corrupt of [null, {}, { ...state, version: 1 }, { ...state, elapsed: -1 }, { ...state, elapsed: Infinity }, { ...state, clues: ['<script>'] }, { ...state, spareTaken: false }, { ...state, keyInserted: false }, { ...state, codeAccepted: false }, { ...state, keyTaken: false }, { ...state, drawerOpen: false }, { ...state, autoDNS: 'false' }]) assert.equal(hydrate(corrupt), null);
  assert.deepEqual(run(state, 'TICK', 'UNKNOWN'), state);
});

test('保存拒否と不正な JSON を区別する', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  try {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => '{broken' } }); assert.equal(readSave().status, 'invalid');
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('Storage blocked'); } });
    assert.deepEqual(readSave(), { state: initialState(), status: 'unavailable' }); assert.equal(writeSave(initialState()), false);
  } finally { if (previous) Object.defineProperty(globalThis, 'localStorage', previous); else delete globalThis.localStorage; }
});

test('階段で連続的に一階へ降り、同じ道で二階へ戻れる', () => {
  let player = { ...SPAWN };
  for (const [dx, dz] of [[3.5, 0], [0, -2.6], [1.9, 0], [0, 8]]) player = movePlayer(player, dx, dz, false);
  assert.ok(Math.abs(player.x - 3.9) < .01); assert.ok(Math.abs(player.z - 4) < .01); assert.equal(player.feet, 0);
  player = movePlayer(player, 0, -8, false); player = movePlayer(player, -1.9, 0, false);
  assert.ok(Math.abs(player.x - 2) < .01); assert.equal(player.feet, 3.4);
});

test('施錠中の扉、壁、家具を大きな移動量でも貫通しない', () => {
  const start = { x: 0, z: 1, feet: 0, yaw: 0, pitch: 0 };
  const blocked = movePlayer(start, 0, -5, false); assert.ok(blocked.z > -.73);
  const entered = movePlayer(start, 0, -4, true); assert.ok(entered.z < -2.9);
  const side = movePlayer({ ...SPAWN, x: 2, z: 0 }, 6, 0, true); assert.ok(side.x < 2.68); assert.equal(side.feet, 3.4);
  const desk = movePlayer({ ...SPAWN, x: -3.3, z: -2 }, 0, -5, true); assert.ok(desk.z > -3);
  assert.equal(canStand(NaN, 0, 0, true), false);
});

test('端末は実際の状態に沿う診断を返し、接続修復を代行しない', () => {
  const offline = initialState();
  assert.match(executeCommand('icfg', offline).output, /carrier 0/);
  assert.match(executeCommand('p 127.0.0.1', offline).output, /0% packet loss/);
  assert.match(executeCommand('p 192.168.10.1', offline).output, /unreachable/);
  assert.match(executeCommand('nlp i.mem.ooo', offline).output, /no servers/);
  assert.match(executeCommand('dhclient', repaired()).output, /DHCPACK/);
  assert.match(executeCommand('nlp i.mem.ooo', repaired()).output, /203.0.113.24/);
  assert.match(executeCommand('<img src=x>', offline).output, /command not found/);
  assert.deepEqual(offline, initialState());
});


test('端子は両端が必要で、差し直しても断線は直らない',()=>{
  let state=initialState();
  for(const side of ['pc','router']) {
    state=transition(state,{type:'CONNECTOR',side,connected:false});
    assert.equal(hasLink(state),false);
    state=transition(state,{type:'CONNECTOR',side,connected:true});
    assert.equal(hasLink(state),false);
  }
  for(const action of [{type:'DRAWER'},chest,{type:'TAKE_KEY'},{type:'INSERT_KEY'},code,{type:'STAGE_CABLES'},extracted,{type:'REPLACE'}])state=transition(state,action);
  assert.equal(hasLink(state),true);
  for(const side of ['pc','router']) {
    state=transition(state,{type:'CONNECTOR',side,connected:false});assert.equal(hasLink(state),false);
    assert.equal(hydrate(state)[side+'Connected'],false);
    state=transition(state,{type:'CONNECTOR',side,connected:true});assert.equal(hasLink(state),true);
    assert.deepEqual(transition(state,{type:'CONNECTOR',side,connected:true}),state);
  }
});

test('旧形式の進行を新しい謎解きの解錠に流用しない',()=>{
  assert.equal(hydrate({...initialState(),version:2}),null);
  assert.equal(hydrate({...initialState(),circuits:{living:true}}),null);
});
test('鍵はベッド横のチェストを開けたときだけ取れ、閉めても失われない',()=>{
  assert.equal(run(initialState(),'DRAWER','TAKE_KEY').keyTaken,false);
  const state=run(initialState(),chest,'TAKE_KEY',{type:'CHEST',open:false});
  assert.equal(state.keyTaken,true);assert.equal(state.nightstandOpen,false);assert.deepEqual(hydrate(state),state);
});
test('両方の猫の誕生日が順番も含めて一致する必要がある',()=>{
  for(const value of ['0619','1228','12280619','6191228','０６１９１２２８','06191229'])assert.equal(run(initialState(),{type:'CODE',code:value}).codeAccepted,false);
  assert.equal(run(initialState(),code).codeAccepted,true);
});
test('交換だけでは未クリアで icfg の正常結果だけが確認を要求する',()=>{
  const state=repaired();assert.equal(state.completed,false);
  for(const command of ['irt','p i.mem.ooo','curl https://i.mem.ooo','icfg; echo ok'])assert.equal(executeCommand(command,state).verifyInterface,undefined);
  assert.equal(executeCommand('icfg',initialState()).verifyInterface,false);
  assert.equal(executeCommand('icfg',state).verifyInterface,true);
  assert.match(executeCommand('icfg',state).output,/RUNNING/);
  assert.equal(run(state,'VERIFY_INTERFACE').completed,true);
});
test('分電盤の部分停電は復帰可能、全回路断は永続的な失敗になる',()=>{
  let state=repaired();state=run(state,{type:'BREAKER',circuit:'living',on:false});assert.equal(hasLink(state),false);assert.equal(state.gameOver,false);
  state=run(state,{type:'BREAKER',circuit:'living',on:true});assert.equal(hasLink(state),true);
  for(const circuit of ['equipment','kitchen','living'])state=run(state,{type:'BREAKER',circuit,on:false});
  assert.equal(state.gameOver,true);assert.equal(state.completed,false);assert.deepEqual(hydrate(state),state);
  assert.deepEqual(run(state,{type:'BREAKER',circuit:'living',on:true},'VERIFY_INTERFACE','TICK'),state);
  assert.equal(hydrate({...state,gameOver:false}),null);
});
