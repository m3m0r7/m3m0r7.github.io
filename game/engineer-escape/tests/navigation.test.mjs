import test from 'node:test';
import assert from 'node:assert/strict';
import { findPath, createCatWalker } from '../js/navigation.mjs';
import { canStand, movePlayer, SPAWN } from '../js/movement.mjs';
import { initialState, transition, hydrate } from '../js/state.mjs';

function traverse(start, route, unlocked) {
  let current = start;
  for (const point of route) {
    current = movePlayer(current, point.x - current.x, point.z - current.z, unlocked);
    assert.ok(Math.hypot(current.x - point.x, current.z - point.z, current.feet - point.feet) < .03);
    assert.ok(canStand(current.x, current.z, current.feet, unlocked));
  }
  return current;
}
test('自動歩行は家具を避け、階段を経由して往復する', () => {
  const target = { x: 0, z: .4, feet: 0 };
  const down = findPath(SPAWN, target);
  assert.ok(down.some(point => point.feet > .4 && point.feet < 3));
  const downstairs = traverse(SPAWN, down, false); assert.equal(downstairs.feet, 0);
  const up = findPath(downstairs, SPAWN);
  assert.equal(traverse(downstairs, up, false).feet, 3.4);
  assert.ok(Math.hypot(up.at(-1).x - SPAWN.x, up.at(-1).z - SPAWN.z) < .5);
});
test('クリック移動でも施錠中の扉を通れず、解錠すると経路が通る', () => {
  const start = { x: 0, z: .4, feet: 0 }, target = { x: 0, z: -2.4, feet: 0 };
  assert.deepEqual(findPath(start, target, false), []);
  const path = findPath(start, target, true); assert.ok(path.length);
  assert.ok(traverse(start, path, true).z < -2);
  assert.deepEqual(findPath(start, { ...target, x: NaN }, true), []);
});
test('猫は周回の固定軌道ではなく複数の目的地を選び、家具に入らない', () => {
  let seed = 19;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 32; };
  const cat = createCatWalker({ x: .6, z: .5 }, random), goals = new Set(), modes = new Set(), floors=new Set();
  for (let i = 0; i < 7000; i++) {
    const state = cat.step(.05); floors.add(state.feet===0?'lower':state.feet===3.4?'upper':'stairs'); assert.ok(canStand(state.x, state.z, state.feet, false));
    if (state.destination) goals.add(`${state.destination.x}:${state.destination.z}`); modes.add(state.mode);
  }
  assert.ok(goals.size > 5); assert.deepEqual([...floors].sort(),['lower','stairs','upper']); assert.ok(modes.has('idle') && modes.has('walk'));
});
test('猫を撫でると移動が止まり、反応後に歩行を再開する', () => {
  const cat = createCatWalker({ x: .6, z: .5 }, () => .63);
  let before;
  for (let i = 0; i < 80; i++) before = cat.step(.05);
  cat.pet();
  for (let i = 0; i < 60; i++) { const state = cat.step(.05); assert.equal(state.mode, 'pet'); assert.equal(state.x, before.x); assert.equal(state.z, before.z); }
  let resumed = false;
  for (let i = 0; i < 300; i++) if (cat.step(.05).mode === 'walk') resumed = true;
  assert.ok(resumed);
});
test('追加ノートは重複せず、既存の保存データも読み込める', () => {
  const old = initialState(); assert.deepEqual(hydrate(old), old);
  const noted = transition(transition(old, { type: 'CLUE', id: 'phone' }), { type: 'CLUE', id: 'phone' });
  assert.deepEqual(noted.clues, ['phone']); assert.deepEqual(hydrate(noted), noted);
});

test('猫は近接したプレイヤーから離れ、二匹がすれ違った後も歩ける', () => {
  let seed = 43;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 32; };
  const a = createCatWalker({ x: .6, z: .5 }, random), b = createCatWalker({ x: .7, z: .6 }, random);
  const player = { x: .6, z: .5, feet: 3.4 };
  let left = { x: .6, z: .5, feet: 3.4 }, right = { x: .7, z: .6, feet: 3.4 };
  let movedA = 0, movedB = 0;
  for (let i = 0; i < 900; i++) {
    const nextA = a.step(.05, player, right), nextB = b.step(.05, player, left);
    movedA += Math.hypot(nextA.x - left.x, nextA.z - left.z); movedB += Math.hypot(nextB.x - right.x, nextB.z - right.z);
    left = nextA; right = nextB;
  }
  assert.ok(movedA > 2, `一匹目の移動距離: ${movedA}`);
  assert.ok(movedB > 2, `二匹目の移動距離: ${movedB}`);
});
