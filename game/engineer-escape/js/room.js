import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { inspectionPose } from './inspection.mjs';
import { homeLocation } from './home-layout.mjs';
import { buildHouse, OBJECTS } from './house.js';
import { movePlayer, SPAWN } from './movement.mjs';
import { findPath } from './navigation.mjs';
import { serverOpen } from './state.mjs';

export function createRoom(canvas, callbacks) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#253144');
  const camera = new THREE.PerspectiveCamera(66, 1, .035, 45); camera.rotation.order = 'YXZ';
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7)); renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.shadowMap.autoUpdate = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  scene.add(new THREE.HemisphereLight('#e4e9eb', '#555049', 1.6));
  const sun = new THREE.DirectionalLight('#ffdec0', 2.4); sun.position.set(-7, 9, -6);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -7; sun.shadow.camera.right = 7; sun.shadow.camera.top = 7; sun.shadow.camera.bottom = -7; sun.shadow.camera.far = 25; sun.shadow.normalBias = .035; scene.add(sun);
  const fill = new THREE.PointLight('#f0dcc0', 13, 10, 2); fill.position.set(-1, 6.2, 0); scene.add(fill);
  const downstairs = new THREE.PointLight('#c3daeb', 16, 10, 2); downstairs.position.set(-1, 2.8, -2); scene.add(downstairs);
  const hallLight = new THREE.PointLight('#ffe1ac', 15, 9, 2); hallLight.position.set(2, 3, 3.8); scene.add(hallLight);
  const house = buildHouse(scene);
  const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), .11, .5, 1.5)); composer.addPass(new OutputPass());
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
  const keys = new Set(), pad = { x: 0, y: 0 };
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const seatedCamera = new THREE.PerspectiveCamera(), playerPosition = new THREE.Vector3(), playerRotation = new THREE.Quaternion();
  let player = { ...SPAWN }, paused = false, frozen = false, unlocked = false, inspecting = false, orbit = 0, tilt = .32, distance = 1.05;
  let inspection = null;
  let openingPhase = null, openingExit = 0, currentState;
  let drag = null, aim = null, lastFrame = 0, elapsed = 0, frame, disposed = false, lastLocation = '';
  let width = 1, height = 1, pausedRendered = false, lastTap = null, route = [], selected = null, pendingInspect = null, blockedTime = 0, approachClock = 0;
  const selection = new THREE.Box3Helper(new THREE.Box3(), '#9db9f5'); selection.visible = false; scene.add(selection);
  const destinationMark = new THREE.Mesh(new THREE.RingGeometry(.15, .19, 32), new THREE.MeshBasicMaterial({ color: '#9abfff', transparent: true, opacity: .85, side: THREE.DoubleSide, depthWrite: false })); destinationMark.rotation.x = -Math.PI / 2; destinationMark.visible = false; scene.add(destinationMark);
  function stopWalking() { route = []; pendingInspect = null; destinationMark.visible = false; }
  function clearInput() { keys.clear(); pad.x = 0; pad.y = 0; drag = null; lastTap = null; stopWalking(); }
  function visible(object) { for (let current = object; current; current = current.parent) if (!current.visible) return false; return true; }
  function objectId(object) { while (object && !object.userData.id) object = object.parent; return object?.userData.id; }
  function objectAction(object) { while(object&&!object.userData.action)object=object.parent;return object?.userData.action; }
  function hitAt(x, y) {
    pointer.set(x, y); raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObject(house.world, true).find(hit => visible(hit.object));
  }
  function pick(x = 0, y = 0, far = 3.3, forgiving = false) {
    const offsets = [[0, 0]];
    if (forgiving) for (const radius of [12, 24]) for (let i = 0; i < 8; i++) offsets.push([Math.cos(i * Math.PI / 4) * radius * 2 / width, Math.sin(i * Math.PI / 4) * radius * 2 / height]);
    for (const [dx, dy] of offsets) {
      const hit = hitAt(x + dx, y + dy), id = hit && objectId(hit.object);
      if (hit && hit.distance <= far && OBJECTS[id]) return { id, action:objectAction(hit.object), point: hit.point, distance: hit.distance };
    }
    return null;
  }
  function objectFor(id) { let result; house.world.traverse(object => { if (object.userData.id === id) result = object; }); return result; }
  function objectCenter(id) {
    const object = objectFor(id);
    return id.startsWith('cat-') ? object.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, .25, 0)) : new THREE.Box3().setFromObject(object).getCenter(new THREE.Vector3());
  }
  function interact(id, action) { if(!paused&&id){stopWalking();if(inspecting&&id===inspection.id&&action)callbacks.onOperate?.(action);else callbacks.onInspect(id);} }
  function select(hit) {
    if (!hit || paused) return;
    selected = hit.id; canvas.dataset.selected = selected;
    if (hit.distance <= 3.3 || objectFor(selected)?.userData.remoteInspect || inspecting) { interact(selected,hit.action); return; }
    const center = objectCenter(selected);
    const catState=house.cats().find(cat=>cat.id===selected);
    const target = { x: center.x, z: center.z, feet:catState?catState.feet:center.y>=3.4?3.4:0 };
    route = findPath(player, target, unlocked, 1.45, 0, house.doors()); pendingInspect = route.length ? selected : null; approachClock = 0;
    if (!route.length) callbacks.onNotice?.('そこへは近づけません。別の場所から調べてみよう。');
  }
  function walkTo(x, y) {
    if (paused || inspecting || openingExit) return;
    stopWalking();
    const hit = hitAt(x, y);
    if (!hit) return;
    if (!hit.object.userData.walkable) { const object = pick(x, y, 15, true); if (object) select(object); else callbacks.onNotice?.('床や階段をダブルクリックすると歩けます。'); return; }
    const target = { x: hit.point.x, z: hit.point.z, feet: Math.abs(hit.point.y - 3.4) < .15 ? 3.4 : hit.point.y < .15 ? 0 : hit.point.y };
    route = findPath(player, target, unlocked, .42, 0, house.doors()); selected = null; canvas.dataset.selected = '';
    if (!route.length) { callbacks.onNotice?.('そこへは歩いて行けません。'); return; }
    const last = route.at(-1); destinationMark.position.set(last.x, last.feet + .045, last.z); destinationMark.visible = true;
  }
  function updateCamera(dt = 0) {
    if (openingPhase || openingExit > 0) {
      const viewingDistance = Math.max(1.55, 1.42 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect * .88));
      seatedCamera.position.set(-2.14, 5.04, -4.225 + viewingDistance); seatedCamera.lookAt(-2.14, 4.69, -4.225);
      const progress = openingPhase ? 0 : 1 - openingExit, eased = progress * progress * (3 - 2 * progress);
      playerPosition.set(player.x, player.feet + 1.58, player.z); playerRotation.setFromEuler(new THREE.Euler(player.pitch, player.yaw, 0, 'YXZ'));
      camera.position.lerpVectors(seatedCamera.position, playerPosition, eased); camera.quaternion.slerpQuaternions(seatedCamera.quaternion, playerRotation, eased);
      if (!openingPhase) openingExit = Math.max(0, openingExit - dt / .85);
    } else if (inspecting) {
      const position=inspectionPose(inspection,orbit,tilt,distance);
      camera.position.set(position.x,position.y,position.z);camera.lookAt(new THREE.Vector3(...inspection.center));
    } else {
      camera.position.set(player.x, player.feet + 1.58, player.z); camera.rotation.set(player.pitch, player.yaw, 0, 'YXZ');
    }
    camera.updateMatrixWorld();
  }
  function resize() {
    width = canvas.clientWidth; height = canvas.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height, false); composer.setSize(width, height); pausedRendered = false;
  }
  const observer = new ResizeObserver(resize); observer.observe(canvas);
  canvas.addEventListener('pointerdown', event => {
    if (paused || openingExit || event.button > 0) return;
    canvas.focus({ preventScroll: true }); drag = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false, yaw: player.yaw, pitch: player.pitch, orbit, tilt };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', event => {
    if (paused || openingExit) return;
    if (document.pointerLockElement === canvas && !inspecting) {
      player.yaw -= event.movementX * .0025; player.pitch = THREE.MathUtils.clamp(player.pitch - event.movementY * .0025, -1.35, 1.35);
      callbacks.onProgress?.('look', Math.hypot(event.movementX, event.movementY) * .0025); return;
    }
    if (!drag) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (Math.hypot(dx, dy) > 5) drag.moved = true;
    if (!drag.moved) return;
    lastTap = null;
    if (inspecting) { orbit = drag.orbit - dx * .006; tilt = THREE.MathUtils.clamp(drag.tilt + dy * .004, inspection.minTilt??-.1, inspection.maxTilt??1.1); }
    else {
      const beforeYaw = player.yaw, beforePitch = player.pitch;
      player.yaw = drag.yaw - dx * .0038; player.pitch = THREE.MathUtils.clamp(drag.pitch - dy * .0038, -1.35, 1.35);
      callbacks.onProgress?.('look', Math.hypot(player.yaw - beforeYaw, player.pitch - beforePitch));
    }
  });
  canvas.addEventListener('pointerup', event => {
    if (drag && !drag.moved && !paused && !openingExit) {
      const rect = canvas.getBoundingClientRect(), x = (event.clientX - rect.left) / width * 2 - 1, y = -(event.clientY - rect.top) / height * 2 + 1;
      if (document.pointerLockElement === canvas) select(pick(0, 0, 3.3, true));
      else if (lastTap && performance.now() - lastTap.time < 310 && Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) < 24) { walkTo(x, y); lastTap = null; }
      else {
        lastTap = { x: event.clientX, y: event.clientY, time: performance.now() };
        // 物体の選択を待機させない。床のダブルクリックだけを別途判定する。
        // 床のクリックを近隣の家具へ吸着させず、次のダブルクリックを受け付ける。
        if(!hitAt(x,y)?.object.userData.walkable)select(pick(x,y,15,true));
      }
    }
    drag = null;
  });
  canvas.addEventListener('dblclick', event => {
    event.preventDefault(); lastTap = null;
    const rect = canvas.getBoundingClientRect(); walkTo((event.clientX - rect.left) / width * 2 - 1, -(event.clientY - rect.top) / height * 2 + 1);
  });
  canvas.addEventListener('pointercancel', () => { drag = null; });
  canvas.addEventListener('wheel', event => { if (inspecting && !paused) { event.preventDefault(); distance = THREE.MathUtils.clamp(distance + event.deltaY * .001, inspection.minDistance, inspection.maxDistance); } }, { passive: false });
  canvas.addEventListener('contextmenu', event => event.preventDefault());
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented)return;
    if (event.isComposing || event.altKey || event.ctrlKey || event.metaKey || paused || openingExit || /INPUT|SELECT|TEXTAREA|BUTTON/.test(event.target.tagName)) return;
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyX', 'ShiftLeft', 'ShiftRight'].includes(event.code)) {
      event.preventDefault(); stopWalking(); keys.add(event.code);
      if (event.code === 'KeyX' && !event.repeat) {const hit=pick(0,0,3.3,true);interact(hit?.id,hit?.action);}
    }
    if (event.code === 'Escape') { stopWalking(); if (inspecting) unfocus(); }
  });
  document.addEventListener('keyup', event => keys.delete(event.code));
  window.addEventListener('blur', clearInput);
  document.addEventListener('visibilitychange', () => { clearInput(); lastFrame = 0; });
  document.addEventListener('pointerlockchange', () => { if (!document.pointerLockElement) clearInput(); callbacks.onLock?.(document.pointerLockElement === canvas); });
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault(); paused = true;
    document.getElementById('load-error-message').textContent = '3D 描画が中断されました。進行は自動保存されています。再読み込みしてください。'; document.getElementById('load-error').hidden = false;
  });
  function focusObject(id) {
    const profile=house.inspection(id,player);if(!profile)return false;
    inspection=profile;canvas.dataset.inspecting=id;inspecting=true;orbit=0;tilt=profile.tilt;distance=profile.distance;
    clearInput();if(document.pointerLockElement)document.exitPointerLock();
    callbacks.onMode(true,OBJECTS[id]);updateCamera();return true;
  }
  function unfocus() { inspecting = false; inspection=null;canvas.dataset.inspecting=''; clearInput(); callbacks.onMode(false); canvas.focus({ preventScroll: true }); }
  function render(timestamp) {
    if (disposed) return;
    frame = requestAnimationFrame(render);
    if(frozen&&pausedRendered)return;
    const reading=(paused||document.querySelector('#skit').matches(':popover-open'))&&!openingPhase&&!openingExit;
    if (document.hidden || timestamp - lastFrame < (reading?90:32)) return;
    const dt = Math.min(reading?.12:.05, lastFrame ? (timestamp - lastFrame) / 1000 : .016); lastFrame = timestamp;
    if (!paused && !openingExit) {

      const turn = (Number(keys.has('ArrowLeft')) - Number(keys.has('ArrowRight'))) * dt * 1.4;
      const pitch = (Number(keys.has('ArrowUp')) - Number(keys.has('ArrowDown'))) * dt;
      if (inspecting) { orbit += turn; tilt = THREE.MathUtils.clamp(tilt + pitch, inspection.minTilt??-.1, inspection.maxTilt??1.1); }
      else {
        player.yaw += turn; player.pitch = THREE.MathUtils.clamp(player.pitch + pitch, -1.35, 1.35);
        if (turn || pitch) callbacks.onProgress?.('look', Math.hypot(turn, pitch));
        const forward = Number(keys.has('KeyW')) - Number(keys.has('KeyS')) - pad.y;
        const side = Number(keys.has('KeyD')) - Number(keys.has('KeyA')) + pad.x;
        const norm = Math.max(1, Math.hypot(forward, side)), speed = keys.has('ShiftLeft') || keys.has('ShiftRight') ? 2.9 : 1.85;
        const previous = player;
        if (forward || side) { stopWalking(); player = movePlayer(player, (-Math.sin(player.yaw) * forward + Math.cos(player.yaw) * side) / norm * dt * speed, (-Math.cos(player.yaw) * forward - Math.sin(player.yaw) * side) / norm * dt * speed, unlocked, house.doors()); }
        else if (route.length) {
          if (pendingInspect?.startsWith('cat-') && (approachClock -= dt) <= 0) {
            const center = objectCenter(pendingInspect), updated = findPath(player, { x: center.x, z: center.z, feet: house.cats().find(cat=>cat.id===pendingInspect)?.feet??0 }, unlocked, 1.3, 0, house.doors());
            if (updated.length) route = updated;
            approachClock = .6;
          }
          const target = route[0], dx = target.x - player.x, dz = target.z - player.z, length = Math.hypot(dx, dz), stride = Math.min(length, dt * 1.85);
          player = movePlayer(player, dx / (length || 1) * stride, dz / (length || 1) * stride, unlocked, house.doors());
          const desired = Math.atan2(-dx, -dz), delta = Math.atan2(Math.sin(desired - player.yaw), Math.cos(desired - player.yaw));
          if (length > .03) player.yaw += delta * Math.min(1, dt * 5);
          blockedTime = Math.hypot(player.x - previous.x, player.z - previous.z) < .0001 && length > .09 ? blockedTime + dt : 0;
          if (length < .09) route.shift();
          if (blockedTime > .7) { stopWalking(); callbacks.onNotice?.('通路がふさがっています。'); }
          if (!route.length) {
            const id = pendingInspect; stopWalking();
            if (id) {
              const center = objectCenter(id);
              player.yaw = Math.atan2(-(center.x - player.x), -(center.z - player.z));
              player.pitch = Math.atan2(center.y - (player.feet + 1.58), Math.hypot(center.x - player.x, center.z - player.z)); updateCamera();
              const check = pick(0, 0, 3.3, true); if (check?.id === id) interact(id); else callbacks.onNotice?.('近づきました。物をクリックして調べよう。');
            }
          }
        }
        const moved = Math.hypot(player.x - previous.x, player.z - previous.z);
        if (moved) callbacks.onProgress?.('move', moved);

      }

    }
    if(!frozen){elapsed += dt; house.animate(elapsed, dt, player);}
    if(inspecting)orbit=THREE.MathUtils.clamp(orbit,-inspection.arc,inspection.arc);
    updateCamera(dt);
    const nextAim = paused || openingExit ? null : pick()?.id || null;
    const selectedObject = selected && objectFor(selected); selection.visible = Boolean(selectedObject && !selected.startsWith('cat-') && !selectedObject.userData.remoteInspect && visible(selectedObject) && !paused && !openingExit && !inspecting);
    if (selection.visible) selection.box.setFromObject(selectedObject);
    canvas.dataset.inspecting=inspection?.id||'';canvas.dataset.camera=JSON.stringify({position:camera.position.toArray(),rotation:camera.rotation.toArray().slice(0,3)});canvas.dataset.fixtures=JSON.stringify(house.fixtureState());
    canvas.dataset.walking = String(route.length > 0); canvas.dataset.cats = JSON.stringify(house.cats());
    if (nextAim !== aim) { aim = nextAim; callbacks.onAim(aim, OBJECTS[aim]); }
    const location = player.x > 3 && Math.abs(player.z) < 3.2 ? '階段' : player.feet > 1.7 ? '２階 / 仕事部屋' : player.z < -1.1 && player.x < .9 ? '１階 / サーバー室' : '１階 / ホール';
    const namedLocation=homeLocation(player)||location;
    if (namedLocation !== lastLocation) { lastLocation=namedLocation;callbacks.onLocation(namedLocation); }
    callbacks.onPosition?.(player,house.cats());
    canvas.dataset.clock=house.clockTime();
    canvas.dataset.position = [player.x, player.feet, player.z, player.yaw, player.pitch].map(n => n.toFixed(3)).join(',');
    canvas.dataset.cameraMode = openingPhase ? 'opening' : openingExit ? 'standing' : inspecting ? 'inspection' : 'explore';
    composer.render(); pausedRendered = paused;
  }
  resize(); updateCamera(); frame = requestAnimationFrame(render);
  return {
    update(state) { currentState = state; unlocked = serverOpen(state); house.update(state, openingPhase);fill.visible=state.circuits.living;downstairs.visible=state.circuits.equipment;hallLight.visible=state.circuits.kitchen; renderer.shadowMap.needsUpdate = true; pausedRendered = false; },
    opening(phase) {
      openingExit = !phase && openingPhase && !reducedMotion ? 1 : 0; openingPhase = phase; clearInput();
      house.update(currentState, phase); pausedRendered = false;
    },
    pause(value,{freeze=false}={}) { paused = value; frozen=freeze; pausedRendered = false; clearInput(); if (value && document.pointerLockElement) document.exitPointerLock(); },
    focusDevice() { return focusObject('modem'); },
    focusObject,
    fixture(key) { return house.fixtureState()[key]; },
    inspectionActions() { return inspection?house.actions(inspection.id):[]; },
    operate(key) { if(!inspection)return null;const result=house.operate(inspection.id,key,player);if(result){renderer.shadowMap.needsUpdate=true;stopWalking();}return result; },
    unfocus,
    pet(id) { house.pet(id, player); },
    reset() { house.resetFixtures();player = { ...SPAWN }; openingPhase = null; openingExit = 0; unfocus(); },
    interact() { const hit=pick(0,0,3.3,true);interact(hit?.id,hit?.action); },
    pad(x, y) { if (x || y) stopWalking(); pad.x = x; pad.y = y; },
    async lock() {
      if (paused || inspecting || !canvas.requestPointerLock) return false;
      try { await canvas.requestPointerLock(); return true; } catch { return false; }
    },
    dispose() { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); composer.dispose(); renderer.dispose(); },
  };
}
