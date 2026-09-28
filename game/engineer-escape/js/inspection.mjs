const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
export function inspectionPose(profile, orbit, tilt, distance) {
  const center=profile.center, yaw=(profile.yaw||0)+clamp(orbit,-(profile.arc??Math.PI),profile.arc??Math.PI), pitch=clamp(tilt,profile.minTilt??-.1,profile.maxTilt??1.1);
  const radius=clamp(distance,profile.minDistance??.35,profile.maxDistance??3);
  const floor=center[1]>3.4?3.4:0, bounds=profile.bounds||{x:[-4.72,4.72],y:[floor+.18,floor+3.12],z:[-4.72,floor?4.72:8.72]};
  return {x:clamp(center[0]+Math.sin(yaw)*Math.cos(pitch)*radius,...bounds.x),y:clamp(center[1]+Math.sin(pitch)*radius,...bounds.y),z:clamp(center[2]+Math.cos(yaw)*Math.cos(pitch)*radius,...bounds.z)};
}
