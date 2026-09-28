import test from 'node:test';
import assert from 'node:assert/strict';
import { findPath } from '../js/navigation.mjs';
import { canStand, movePlayer } from '../js/movement.mjs';
import { inspectionPose } from '../js/inspection.mjs';
import { initialState, transition, hydrate, CLUES } from '../js/state.mjs';
import { HOME_DOORS, doorContains } from '../js/home-layout.mjs';
import { HOME_INSPECTIONS } from '../js/home-inspections.mjs';

test('水回りとキッチンは施錠されたサーバー室を通らず出入りできる', () => {
  const doors=Object.fromEntries(Object.keys(HOME_DOORS).map(id=>[id,true]));
  const start = { x: 0, z: 2, feet: 0 };
  for (const target of [{ x: -2.2, z: 2.1, feet: 0 }, { x: -2.2, z: 3.7, feet: 0 }, { x: -3.1, z: .05, feet: 0 }, { x: 1.6, z: 7.6, feet: 0 }]) {
    for (const [from, to] of [[start, target], [target, start]]) {
      const path = findPath(from, to, false,.45,0,doors); assert.ok(path.length, JSON.stringify(to));
      let position = from;
      for (const point of path) {
        position = movePlayer(position, point.x - position.x, point.z - position.z, false,doors);
        assert.ok(Math.hypot(position.x - point.x, position.z - point.z) < .03);
      }
    }
  }
  for (const [x, z] of [[-2.6, -.7], [-1.6, 3.8], [-4.1, 4], [-4.3, .05], [-4.4, 1.8], [-3.03, 1.33]]) assert.equal(canStand(x, z, 0, false), false);
  assert.equal(canStand(1.8, 3.8, 3.4, false), false);
});

test('観察カメラは壁や床の外へ出ず、旋回・拡大の制限を守る', () => {
  const profile = { center: [-4.49, .94, 1.79], yaw: Math.PI / 2, arc: .7, minDistance: .65, maxDistance: 1.6, bounds: { x: [-4.85, -1.8], y: [.22, 2.85], z: [1.06, 2.7] } };
  for (const orbit of [-100, 0, 100]) for (const tilt of [-100, .3, 100]) for (const distance of [-100, 1, 100]) {
    const pose = inspectionPose(profile, orbit, tilt, distance);
    for (const axis of ['x', 'y', 'z']) assert.ok(pose[axis] >= profile.bounds[axis][0] && pose[axis] <= profile.bounds[axis][1]);
  }
  assert.deepEqual(inspectionPose(profile, 100, 100, 100), inspectionPose(profile, .7, 1.1, 1.6));
  assert.ok(inspectionPose({ center: [1, 3.8, 3] }, 0, -100, 3).y >= 3.58);
});

test('家の調査対象がすべて保存され、重複操作や旧セーブで失われない', () => {
  let state = transition(initialState(), { type: 'CLUE', id: 'poster' });
  for (const id of Object.keys(HOME_INSPECTIONS)) {
    assert.ok(CLUES.includes(id));
    state = transition(transition(state, { type: 'CLUE', id }), { type: 'CLUE', id });
  }
  assert.deepEqual(hydrate(state), state);
  assert.equal(new Set(state.clues).size, state.clues.length);
});


test('水回りの扉は閉じていると通れず、開けた場所だけ通れる',()=>{
  for(const [id,[x1,x2,z1,z2]] of Object.entries(HOME_DOORS)) {
    const x=(x1+x2)/2,z=(z1+z2)/2;
    assert.equal(canStand(x,z,0,false),false);
    assert.equal(canStand(x,z,0,false,{[id]:true}),true);
    assert.equal(doorContains(id,{x,z,feet:0}),true);
    assert.equal(doorContains(id,{x,z,feet:3.4}),false);
  }
  const start={x:0,z:2,feet:0},target={x:-2.2,z:2.1,feet:0};
  assert.equal(findPath(start,target,false).length,0);
  assert.ok(findPath(start,target,false,.45,0,{'washroom-door':true}).length);
});

test('島の左右と冷蔵庫前を歩け、増築部分へ二階からは入れない',()=>{
  let point={x:0,z:4,feet:0};
  for(const [x,z] of [[0,5.2],[0,7.6],[3.8,7.6],[3.8,5.2],[0,5.2]]) {
    const path=findPath(point,{x,z,feet:0},false,.22);assert.ok(path.length);
    for(const node of path)point=movePlayer(point,node.x-point.x,node.z-point.z,false);
    assert.ok(Math.hypot(point.x-x,point.z-z)<.3);
  }
  assert.equal(canStand(1.7,6.4,0,false),false);
  assert.equal(canStand(3.72,8.5,0,false),false);
  assert.equal(canStand(0,7,3.4,false),false);
});

test('作業台が通り抜けを防ぎ、扉から作業面と保管棚へ近づける',()=>{
  const entrance={x:0,z:-2,feet:0};
  assert.equal(canStand(-.8,-4.35,0,true),false);
  for(const target of [{x:-.2,z:-3.55,feet:0},{x:-1.55,z:-3.3,feet:0}]){
    assert.ok(canStand(target.x,target.z,target.feet,true));
    assert.ok(findPath(entrance,target,true).length);
  }
});
