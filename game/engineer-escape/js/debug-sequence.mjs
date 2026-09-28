// 指定された部屋での独立した 22 回の D 入力だけを受け付ける。
export function debugZone(player) {
  if(!player||![player.x,player.z,player.feet].every(Number.isFinite)||player.feet>.15||player.feet<0)return null;
  if(player.x> -4.9&&player.x< -1.66&&player.z>2.96&&player.z<4.94)return 'bath';
  if(player.x> -4.9&&player.x< -2.66&&player.z>-.92&&player.z<.84)return 'toilet';
  return null;
}
export function createDebugSequence() {
  let zone=null,count=0;
  return {reset(){zone=null;count=0;},position(player){const next=debugZone(player);if(next!==zone){zone=next;count=0;}},press(event,player){
    this.position(player);
    if(!zone||event.code!=='KeyD'||event.repeat)return null;
    if(++count!==22)return null;
    count=0;return {type:zone==='bath'?'DEBUG_CLEAR':'DEBUG_UNLOCK',position:{x:player.x,z:player.z,feet:player.feet}};
  }};
}
