import test from 'node:test';
import assert from 'node:assert/strict';
import { isCableExtracted, cableSeparation, createExtractionTracker, CABLE_CLEARANCE, CABLE_SETTLE_SECONDS } from '../js/supply-search.mjs';
import { initialState, transition, CAT_CODES, inventory, hydrate, writeSave, readSave, STORAGE_KEY } from '../js/state.mjs';
const proof = (x = 0) => ({ kind: 'lan', held: false, clearance: .7, settledFor: CABLE_SETTLE_SECONDS, points: Array.from({ length: 32 }, (_, i) => [x + (i - 16) * .19, .25, 0]) });
const path = (points, kind = 'lan', radius = .15) => ({ kind, points, radii: points.map(() => radius) });

test('トレーや左右の指定はなく、作業台のどこでも分離した一本を取り出せる', () => {
  for (const x of [-9, 0, 9]) assert.ok(isCableExtracted(proof(x)));
  for (const result of [null, { ...proof(), kind: 'usb' }, { ...proof(), held: true }, { ...proof(), held: undefined }, { ...proof(), clearance: 0 }, { ...proof(), clearance: NaN }, { ...proof(), clearance: Infinity }, { ...proof(), settledFor: 0 }, { ...proof(), settledFor: Infinity }, { ...proof(), points: [] }, { ...proof(), points: [[8, .1, 0]] }, { ...proof(), points: proof().points.map((p, i) => i === 2 ? [NaN, .1, 0] : p) }]) assert.equal(isCableExtracted(result), false);
  assert.ok(isCableExtracted({ ...proof(), clearance: CABLE_CLEARANCE }));
  assert.equal(isCableExtracted({ ...proof(), clearance: CABLE_CLEARANCE - .001 }), false);
});

test('節点間の交差と端子の厚みを検出し、上下に十分離れた線は通す', () => {
  const target = path([[-2, .3, 0], [2, .3, 0]]);
  const crossing = path([[0, .3, -2], [0, .3, 2]], 'usb');
  const overlap = cableSeparation(target, [crossing]);
  assert.equal(overlap.contacts.length, 1); assert.equal(overlap.contacts[0].kind, 'usb'); assert.ok(overlap.clearance < 0);
  const overhead = path(crossing.points.map(([x, y, z]) => [x, y + 1, z]), 'usb');
  assert.equal(cableSeparation(target, [overhead]).contacts.length, 0);
  const plug = path([[2.45, .3, 0], [3, .3, 0]], 'usb');
  assert.equal(cableSeparation(target, [plug]).contacts.length, 0);
  plug.radii[0] = .35;
  assert.equal(cableSeparation(target, [plug]).contacts.length, 1);
});

test('一本の途中だけが接触していても取得を許さない', () => {
  const cable = proof(), target = path(cable.points), other = path([[0, .25, -2], [0, .25, 2]], 'hdmi');
  const separation = cableSeparation(target, [other]);
  assert.ok(cable.points[0][0] < -2 && cable.points.at(-1)[0] > 2);
  assert.equal(isCableExtracted({ ...cable, clearance: separation.clearance }), false);
});

test('平行・重複する節点でも距離が有限で、空や破損した経路を拒否する', () => {
  const a = path([[0, .3, 0], [0, .3, 0], [3, .3, 0]]), b = path([[0, .3, 1], [3, .3, 1]], 'power');
  assert.ok(Math.abs(cableSeparation(a, [b]).clearance - .7) < 1e-9);
  assert.ok(Math.abs(cableSeparation(a, [b]).clearance - cableSeparation(b, [a]).clearance) < 1e-9);
  const dot = path([[0, .3, 0], [0, .3, 0]]);
  assert.ok(cableSeparation(dot, [dot]).clearance < 0);
  for (const other of [[], [null], [{ ...b, radii: [] }], [{ ...b, radii: [Infinity, .1] }], [path([[NaN, .1, 0], [0, 0, 0]])]]) assert.equal(cableSeparation(a, other), null);
});

test('離した後に静止を確認し、再接触・つかみ直し・リセットで確認時間を戻す', () => {
  const tracker = createExtractionTracker(), p = proof();
  assert.equal(tracker.update(p, .1).settledFor, 0);
  for (let i = 0; i < 7; i++) assert.equal(isCableExtracted(tracker.update(p, .1)), false);
  assert.ok(isCableExtracted(tracker.update(p, .1)));
  assert.equal(tracker.update({ ...p, clearance: 0 }, .1).settledFor, 0);
  for (let i = 0; i < 10; i++) assert.equal(tracker.update({ ...p, held: true }, .1).settledFor, 0);
  for (let i = 0; i < 10; i++) tracker.update(p, .1);
  tracker.reset(); assert.equal(tracker.update(p, .1).settledFor, 0);
  assert.equal(tracker.update({ ...p, points: p.points.map(([x, y, z]) => [x + .5, y, z]) }, .1).settledFor, 0);
  assert.equal(tracker.update(p, 20).settledFor, 0);
  assert.equal(tracker.update({ ...p, points: [[NaN, 0, 0]] }, .1).settledFor, 0);
});

test('取り出し成功と入室条件を満たした場合だけ一度取得し、保存できる', () => {
  const collect = { type: 'TAKE_CABLE', extraction: proof() };
  assert.equal(transition(initialState(), collect).spareTaken, false);
  let state = initialState();
  for (const action of [{ type: 'CHEST', open: true }, { type: 'TAKE_KEY' }, { type: 'INSERT_KEY' }, { type: 'CODE', code: CAT_CODES.eru + CAT_CODES.guri }]) state = transition(state, action);
  assert.equal(transition(state, { type: 'TAKE_CABLE' }).spareTaken, false);
  assert.equal(transition(state, { ...collect, extraction: { ...proof(), settledFor: 0 } }).spareTaken, false);
  assert.equal(transition(state,collect).spareTaken,false);
  state=transition(state,{type:'STAGE_CABLES'});
  assert.ok(state.cablesOnBench);
  assert.deepEqual(transition(state,{type:'STAGE_CABLES'}),state);
  assert.deepEqual(hydrate(state),state);
  state = transition(state, collect); assert.ok(inventory(state).includes('cable')); assert.equal(state.completed, false);
  assert.deepEqual(transition(state, collect), state); assert.deepEqual(hydrate(state), state);
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage'), memory = new Map();
  try {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { setItem: (k, v) => memory.set(k, v), getItem: k => memory.get(k) ?? null } });
    assert.ok(writeSave(state)); assert.deepEqual(JSON.parse(memory.get(STORAGE_KEY)), state); assert.deepEqual(readSave().state, state);
  } finally { if (previous) Object.defineProperty(globalThis, 'localStorage', previous); else delete globalThis.localStorage; }
});

test('初期配置に長さの余裕があり、LAN は他の線と交差する', async () => {
  const { createCableLayout } = await import('../js/cable-layout.mjs');
  const layout = createCableLayout();
  assert.deepEqual(createCableLayout(), layout);
  assert.equal(layout.strands.length, 10);
  const lengths = layout.strands.map(strand => strand.points.slice(1).reduce((sum, p, i) => sum + Math.hypot(...p.map((n, j) => n - strand.points[i][j])), 0));
  for (const length of lengths) assert.ok(length > 15 && length < 21, String(length));
  const paths = layout.strands.map(strand => path(strand.points, strand.typeKey, .25));
  const target = paths.find(p => p.kind === 'lan');
  assert.ok(cableSeparation(target, paths.filter(p => p !== target)).contacts.length > 0);
  assert.equal(layout.strands.find(p => p.typeKey === 'lan').points.length, 48);
});

test('箱の移動は解錠後だけ可能で、古い v3 セーブと搬送途中の再開を保つ',()=>{
  assert.deepEqual(transition(initialState(),{type:'STAGE_CABLES'}),initialState());
  let state=initialState();
  for(const action of [{type:'CHEST',open:true},{type:'TAKE_KEY'},{type:'INSERT_KEY'},{type:'CODE',code:CAT_CODES.eru+CAT_CODES.guri},{type:'STAGE_CABLES'}])state=transition(state,action);
  assert.equal(hydrate(JSON.parse(JSON.stringify(state))).cablesOnBench,true);
  assert.equal(state.spareTaken,false);
  assert.equal(hydrate({...initialState(),cablesOnBench:true}),null);
  const legacy={...state};delete legacy.cablesOnBench;delete legacy.taskChecks;
  assert.equal(hydrate(legacy).cablesOnBench,false);assert.deepEqual(hydrate(legacy).taskChecks,{});
  legacy.spareTaken=true;assert.equal(hydrate(legacy).cablesOnBench,true);
  for(const invalid of ['true',null,1])assert.equal(hydrate({...legacy,cablesOnBench:invalid}),null);
  assert.equal(hydrate({...legacy,cablesOnBench:false}),null);
});
