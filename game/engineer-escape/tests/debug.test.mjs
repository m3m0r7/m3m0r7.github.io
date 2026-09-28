import test from 'node:test';
import assert from 'node:assert/strict';
import { createDebugSequence } from '../js/debug-sequence.mjs';
import { initialState,transition,hydrate,serverOpen,isOnline } from '../js/state.mjs';
const bath={x:-2.3,z:3.5,feet:0},toilet={x:-3,z:0,feet:0},event={code:'KeyD',repeat:false};
test('指定室の22回目だけで発動し、長押し・退室・別階の入力を除外する',()=>{
 const sequence=createDebugSequence();
 for(let i=0;i<21;i++)assert.equal(sequence.press(event,bath),null);
 assert.equal(sequence.press({...event,repeat:true},bath),null);
 assert.equal(sequence.press(event,bath).type,'DEBUG_CLEAR');
 for(let i=0;i<21;i++)sequence.press(event,toilet);
 sequence.position({x:0,z:0,feet:0});assert.equal(sequence.press(event,toilet),null);
 for(let i=0;i<30;i++)assert.equal(sequence.press(event,{...bath,feet:3.4}),null);
 for(let i=0;i<21;i++)assert.equal(sequence.press(event,toilet),null);
 assert.equal(sequence.press(event,toilet).type,'DEBUG_UNLOCK');
});
test('デバッグ後も保存・所持品の依存関係を満たし、対象外の場所では状態を変えない',()=>{
 const initial=initialState();assert.deepEqual(transition(initial,{type:'DEBUG_CLEAR',position:toilet}),initial);
 const unlocked=transition(initial,{type:'DEBUG_UNLOCK',position:toilet});assert.equal(serverOpen(unlocked),true);assert.equal(unlocked.completed,false);assert.deepEqual(hydrate(unlocked),unlocked);
 const cleared=transition(initial,{type:'DEBUG_CLEAR',position:bath});assert.equal(isOnline(cleared),true);assert.equal(cleared.completed,true);assert.deepEqual(hydrate(cleared),cleared);assert.deepEqual(transition(cleared,{type:'DEBUG_CLEAR',position:bath}),cleared);
});
