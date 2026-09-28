import * as THREE from 'three';
import { RopeWorld } from '../../spaghetti-code/js/rope-physics.js?v=4';
import { buildCableWorkbench, makeLanPlug } from './cable-workbench.js';
import { cableSeparation, createExtractionTracker, isCableExtracted, CABLE_SETTLE_SECONDS } from './supply-search.mjs';
import { icon } from './icons.js';
import { createCableLayout, CABLES } from './cable-layout.mjs';

export function mountCableSearch(mount, onTake) {
  mount.innerHTML = `
    <header class="cable-game-header">
      <div class="cable-game-emblem">${icon('cable')}</div>
      <div><span class="cable-eyebrow">サーバー室 / 作業台</span><h3>絡まった一本を、救い出せ。</h3></div>
      <div class="cable-game-time"><span>作業時間</span><strong id="cable-time">00:00</strong><small>制限時間なし</small></div>
    </header>
    <div class="cable-search-stage" data-phase="intro">
      <canvas id="cable-search-canvas" tabindex="0" aria-label="ケーブルをほどく作業台。ドラッグでつかんで移動。ホイールで上下。数字1から9と0で選択、矢印キーで移動、PageUpとPageDownで上下、EnterまたはSpaceで手を離す。" aria-describedby="cable-search-status"></canvas>
      <div class="cable-workbench-shade" aria-hidden="true"></div>
      <aside class="cable-target-card"><span class="cable-eyebrow">探しているもの</span><div>${icon('cable')}<div><strong>LAN ケーブル</strong><small>青緑の被覆 / 透明な端子</small></div></div><p>一本まるごと、他の線から離そう。</p></aside>
      <div class="cable-contact-card"><span class="cable-eyebrow">ケーブルの状態</span><strong id="cable-contact-count">準備中</strong><div class="cable-settle-track" role="progressbar" aria-label="分離の確認" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div><small id="cable-settle-label">手を離すと分離を確認します</small></div>
      <div class="cable-held-label" id="cable-held-label" hidden></div>
      <div class="cable-stage-card" id="cable-intro">
        <div class="cable-card-symbol">${icon('cable')}</div><span class="cable-eyebrow">ケーブル救出</span><h4>この中に、予備がある。</h4>
        <p>10 本の中から LAN ケーブルをつかんで、ゆっくりほどこう。<br>邪魔な線を先によけてもいい。</p>
        <div class="cable-intro-steps"><span>${icon('mouse')}ドラッグで動かす</span><span>↕ ホイールで持ち上げる</span><span>${icon('check')}他の線から離して、手を離す</span></div>
        <button type="button" class="primary-button" id="cable-start">ほどき始める <span aria-hidden="true">→</span></button>
      </div>
      <div class="cable-stage-card cable-win-card" id="cable-win" hidden aria-live="polite">
        <div class="cable-card-symbol">${icon('check')}</div><span class="cable-eyebrow">取り出し成功</span><h4>使える一本、見つけた。</h4>
        <p>LAN ケーブルを手に入れた。<br>端子も、固定用の爪も無事だ。</p><div class="cable-win-item">${icon('cable')}<span>LAN ケーブル<strong>所持品に追加しました</strong></span></div>
        <button type="button" class="primary-button close-dialog" id="cable-return">探索に戻る <span aria-hidden="true">→</span></button>
      </div>
    </div>
    <footer class="cable-search-controls">
      <div class="cable-feedback"><span class="cable-feedback-dot"></span><p id="cable-search-status" role="status">ケーブルを作業台に広げた。</p></div>
      <div class="cable-hand-controls"><button type="button" class="secondary-button" id="cable-lift" disabled>持ち上げる ↑</button><button type="button" class="secondary-button" id="cable-lower" disabled>下ろす ↓</button><button type="button" class="secondary-button" id="cable-release" disabled>手を離す <kbd>Enter</kbd></button><button type="button" class="secondary-button" id="cable-reset" disabled>${icon('restart')} やり直す</button></div>
      <div class="cable-key-guide"><span><kbd>ドラッグ</kbd>つかむ・動かす</span><span><kbd>ホイール</kbd>上下</span><span><kbd>1–9 / 0</kbd>ケーブル選択</span><span><kbd>← ↑ ↓ →</kbd>移動</span><span><kbd>PgUp / PgDn</kbd>上下</span><span><kbd>Enter / Space</kbd>離す</span><span><kbd>Esc</kbd>戻る</span></div>
    </footer>`;
  const $ = selector => mount.querySelector(selector);
  const canvas = $('canvas'), stage = $('.cable-search-stage'), status = $('#cable-search-status');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.22;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#15202b');
  const camera = new THREE.PerspectiveCamera(39, 1, .1, 160);
  scene.add(new THREE.HemisphereLight('#d7edff', '#514139', 2.2));
  const lamp = new THREE.DirectionalLight('#fff2d9', 3.1); lamp.position.set(-9, 19, 9); lamp.castShadow = true;
  lamp.shadow.mapSize.set(2048, 2048); Object.assign(lamp.shadow.camera, { left: -22, right: 22, top: 18, bottom: -18, near: .1, far: 70 }); lamp.shadow.normalBias = .04; scene.add(lamp);
  const fill = new THREE.DirectionalLight('#98c4e8', 1.1); fill.position.set(12, 9, -8); scene.add(fill);
  buildCableWorkbench(scene);
  const world = new RopeWorld(scene), ray = new THREE.Raycaster(); ray.params.Line.threshold = .24;
  const pointer = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -.9), intersection = new THREE.Vector3(), dragOffset = new THREE.Vector3();
  const tracker = createExtractionTracker();
  const markers = Array.from({ length: CABLES.length - 1 }, () => {
    const ring = new THREE.Mesh(new THREE.RingGeometry(.24, .31, 36), new THREE.MeshBasicMaterial({ color: '#f6bb76', transparent: true, opacity: .9, depthTest: false }));
    ring.rotation.x = -Math.PI / 2; ring.renderOrder = 5; ring.visible = false; scene.add(ring); return ring;
  });
  const grip = new THREE.Mesh(new THREE.SphereGeometry(.135, 16, 12), new THREE.MeshBasicMaterial({ color: '#e4fff4', wireframe: true, depthTest: false })); grip.visible = false; grip.renderOrder = 6; scene.add(grip);
  let heldHeight = .9, disposed = false, claimed = false, phase = 'intro', frame, last = 0, lastRead = 0, elapsed = 0;
  let selected = null, activePointer = null, interactionStarted = false, lastMetrics = null;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function setStatus(text) { if (status.textContent !== text) status.textContent = text; }
  function setPhase(value) { phase = value; stage.dataset.phase = value; }
  function updateHand() {
    for (const name of ['lift', 'lower', 'release']) $(`#cable-${name}`).disabled = !world.held || phase !== 'playing';
    $('#cable-held-label').hidden = !world.held;
    if (world.held) $('#cable-held-label').textContent = `${world.held.rope.typeLabel}をつかんでいる`;
    canvas.style.cursor = world.held ? 'grabbing' : 'grab';
  }
  function release() {
    world.release();
    const pointerId = activePointer; activePointer = null;
    if (pointerId !== null && canvas.hasPointerCapture(pointerId)) canvas.releasePointerCapture(pointerId);
    grip.visible = false; updateHand();
  }
  function reset() {
    release(); tracker.reset(); interactionStarted = false; elapsed = 0; lastRead = 0; lastMetrics = null; selected = null;
    const layout = createCableLayout();
    layout.strands.forEach(strand => { strand.points = strand.points.map(point => new THREE.Vector3(...point)); });
    world.load(layout);
    const lan = world.ropes.find(rope => rope.typeKey === 'lan');
    lan.connectorVisuals = [makeLanPlug(lan, 0), makeLanPlug(lan, 1)];
    lan.connectorVisuals.forEach(visual => scene.add(visual.group));
    for (const particle of [lan.particles[0], lan.particles.at(-1)]) { particle.radius = .25; particle.floorRadius = .24; particle.boundaryRadius = .25; }
    world.settleInitial(); world.pickables = world.ropes.flatMap(rope => rope.getPickables());
    markers.forEach(marker => { marker.visible = false; });
    $('.cable-settle-track').setAttribute('aria-valuenow', '0'); $('.cable-settle-track i').style.width = '0%';
    $('#cable-time').textContent = '00:00'; $('#cable-contact-count').textContent = '絡まりを確認中';
    setStatus('青緑の LAN ケーブルを、他の線から離そう。');
    canvas.focus({ preventScroll: true });
  }
  reset();
  function resize() {
    const r = canvas.parentElement.getBoundingClientRect(); if (!r.width || !r.height) return;
    renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height;
    // 机の長辺を常に画面内へ収め、端までドラッグできる余白を確保する。
    const distance = Math.max(29, 20.3 / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect));
    camera.position.set(0, distance * .89, distance * .46); camera.lookAt(0, 0, -.5); camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize); observer.observe(canvas.parentElement); resize();
  const events = new AbortController(), opts = { signal: events.signal };
  function aim(event) { const r = canvas.getBoundingClientRect(); pointer.set((event.clientX - r.left) / r.width * 2 - 1, -(event.clientY - r.top) / r.height * 2 + 1); ray.setFromCamera(pointer, camera); }
  function move(target) {
    target.x = THREE.MathUtils.clamp(target.x, -13.6, 13.6); target.z = THREE.MathUtils.clamp(target.z, -8.2, 8.2); target.y = THREE.MathUtils.clamp(target.y, .35, 4.8);
    heldHeight = target.y; plane.constant = -heldHeight; world.moveGrab(target);
  }
  function grab(rope, index) {
    release(); tracker.reset(); interactionStarted = true; selected = rope;
    heldHeight = Math.max(.65, rope.particles[index].position.y + .4); plane.constant = -heldHeight;
    world.grab(rope, index, rope.particles[index].position.clone().setY(heldHeight));
    world.ropes.forEach(other => { other.material.emissive.set(other === rope ? other.material.color : '#000000'); other.material.emissiveIntensity = other === rope ? .12 : 0; });
    updateHand(); canvas.focus({ preventScroll: true });
  }
  function lift(amount) { if (world.held) { move(world.held.target.clone().add(new THREE.Vector3(0, amount, 0))); tracker.reset(); } }
  $('#cable-start').addEventListener('click', () => { $('#cable-intro').hidden = true; setPhase('playing'); $('#cable-reset').disabled = false; last = performance.now(); canvas.focus({ preventScroll: true }); }, opts);
  canvas.addEventListener('pointerdown', event => {
    if (phase !== 'playing' || event.button !== 0) return;
    aim(event); const hit = ray.intersectObjects(world.pickables, false)[0]; if (!hit) return;
    const rope = hit.object.userData.rope; grab(rope, hit.object.userData.particleIndex ?? rope.closestParticle(hit.point));
    ray.ray.intersectPlane(plane, intersection); dragOffset.copy(world.held.target).sub(intersection);
    activePointer = event.pointerId; canvas.setPointerCapture(event.pointerId); event.preventDefault();
  }, opts);
  canvas.addEventListener('pointermove', event => {
    if (phase !== 'playing' || !world.held || activePointer !== event.pointerId) return;
    aim(event); if (ray.ray.intersectPlane(plane, intersection)) move(intersection.add(dragOffset));
  }, opts);
  canvas.addEventListener('pointerup', event => { if (activePointer === event.pointerId) release(); }, opts);
  canvas.addEventListener('pointercancel', release, opts);
  canvas.addEventListener('lostpointercapture', () => { if (activePointer !== null) release(); }, opts);
  canvas.addEventListener('wheel', event => { if (phase !== 'playing' || !world.held) return; event.preventDefault(); lift(-event.deltaY * .006); }, { ...opts, passive: false });
  canvas.addEventListener('keydown', event => {
    if (phase !== 'playing' || event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
    if (['Enter', ' '].includes(event.key)) { event.preventDefault(); release(); return; }
    if (/^[0-9]$/.test(event.key)) {
      event.preventDefault(); if (event.repeat) return;
      const rope = world.ropes[(Number(event.key) + 9) % 10], index = world.held?.rope === rope && world.held.particleIndex === 47 ? 0 : 47;
      grab(rope, index); return;
    }
    if (!world.held || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(event.key)) return;
    event.preventDefault(); const step = event.shiftKey ? .65 : .32, target = world.held.target.clone();
    if (event.key === 'ArrowLeft') target.x -= step; if (event.key === 'ArrowRight') target.x += step;
    if (event.key === 'ArrowUp') target.z -= step; if (event.key === 'ArrowDown') target.z += step;
    if (event.key === 'PageUp') target.y += step; if (event.key === 'PageDown') target.y -= step;
    move(target);
  }, opts);
  $('#cable-release').addEventListener('click', () => { release(); canvas.focus({ preventScroll: true }); }, opts);
  $('#cable-lift').addEventListener('click', () => lift(.4), opts); $('#cable-lower').addEventListener('click', () => lift(-.4), opts);
  $('#cable-reset').addEventListener('click', () => { if (phase === 'playing') reset(); }, opts);
  window.addEventListener('blur', () => { release(); tracker.reset(); }, opts);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { release(); tracker.reset(); last = 0; lastRead = 0; } }, opts);

  function path(rope) {
    const points = rope.visualCurve.getPoints(64).map(p => p.toArray());
    const bodyRadius = Math.max(rope.radius, ...rope.particles.slice(1, -1).map(p => p.radius));
    const radii = points.map(() => bodyRadius);
    for (const [end, visual] of rope.connectorVisuals.entries()) {
      if (!visual) continue;
      if (!visual.contactShape) {
        const bounds = new THREE.Box3();
        visual.meshes.forEach(mesh => { mesh.geometry.computeBoundingBox(); mesh.updateMatrix(); bounds.union(mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrix)); });
        visual.contactShape = { length: bounds.max.y, radius: Math.max(Math.abs(bounds.min.x), bounds.max.x, Math.abs(bounds.min.z), bounds.max.z) };
      }
      visual.group.updateMatrixWorld(true);
      const tip = visual.group.localToWorld(new THREE.Vector3(0, visual.contactShape.length, 0)).toArray();
      if (end) { points.push(tip); radii.push(visual.contactShape.radius); }
      else { points.unshift(tip); radii.unshift(visual.contactShape.radius); }
    }
    return { kind: rope.typeKey, points, radii };
  }
  function measure(dt) {
    const paths = world.ropes.map(path), target = paths.find(p => p.kind === 'lan');
    const separation = cableSeparation(target, paths.filter(p => p !== target));
    if (!separation) return null;
    const proof = tracker.update({ kind: 'lan', held: Boolean(world.held), points: target.points, clearance: separation.clearance }, dt);
    return { ...separation, proof };
  }
  function showMetrics(metrics) {
    if (!metrics) return;
    const { contacts, proof } = metrics, separated = !contacts.length;
    $('#cable-contact-count').textContent = separated ? '他のケーブルから分離' : `まだ ${contacts.length} 本と絡んでいる`;
    $('.cable-contact-card').classList.toggle('is-clear', separated);
    const progress = Math.round(proof.settledFor / CABLE_SETTLE_SECONDS * 100);
    $('.cable-settle-track').setAttribute('aria-valuenow', String(progress)); $('.cable-settle-track i').style.width = `${progress}%`;
    $('#cable-settle-label').textContent = world.held ? '手を離すと分離を確認します' : separated ? 'ケーブルが落ち着くのを待っています…' : '光っている箇所が、他の線に触れています';
    markers.forEach((marker, i) => { marker.visible = Boolean(contacts[i]) && phase === 'playing'; if (contacts[i]) marker.position.set(...contacts[i].point).add(new THREE.Vector3(0, .2, 0)); });
    if (world.held) setStatus(`${world.held.rope.typeLabel}をつかんでいる。ホイールで持ち上げながら動かせる。`);
    else if (separated && interactionStarted) setStatus('他の線から離れた。分離を確認中…');
    else setStatus(selected && selected.typeKey !== 'lan' ? '邪魔な線をよけた。LAN ケーブルのまわりを空けよう。' : '青緑の LAN ケーブルを、他の線から離そう。');
  }
  function complete(proof) {
    if (claimed || !isCableExtracted(proof)) return;
    claimed = true; release(); world.sleep();
    if (onTake(proof) === false) { setPhase('error'); setStatus('回収できませんでした。いったん作業台を閉じてください。'); return; }
    if (disposed) return;
    setPhase('won'); $('#cable-reset').disabled = true; markers.forEach(marker => { marker.visible = false; });
    $('#cable-win').hidden = false; $('#cable-return').focus({ preventScroll: true });
    $('#cable-settle-label').textContent = '所持品に追加しました'; setStatus('取り出し成功。予備の LAN ケーブルを手に入れた。');
  }
  function tick(now) {
    if (disposed) return;
    const elapsedDt = last ? Math.max(0, (now - last) / 1000) : 0, dt = Math.min(elapsedDt, .033); last = now;
    if (phase === 'playing' && !document.hidden) {
      elapsed += elapsedDt; world.step(dt);
      const seconds = Math.floor(elapsed); $('#cable-time').textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
      if (now - lastRead >= 100) {
        const readDt = lastRead ? (now - lastRead) / 1000 : 0; lastRead = now;
        lastMetrics = measure(readDt); showMetrics(lastMetrics);
        if (interactionStarted && lastMetrics && isCableExtracted(lastMetrics.proof)) complete(lastMetrics.proof);
      }
    }
    if (disposed) return;
    grip.visible = Boolean(world.held); if (world.held) grip.position.copy(world.held.particle.position);
    if (!reducedMotion) markers.forEach(marker => { if (marker.visible) marker.scale.setScalar(1 + Math.sin(now * .004) * .12); });
    renderer.render(scene, camera);
    canvas.dataset.phase = phase; canvas.dataset.ready = String(phase === 'won'); canvas.dataset.held = world.held?.rope.typeKey || '';
    if (lastMetrics) canvas.dataset.extraction = JSON.stringify(lastMetrics.proof);
    canvas.dataset.endpoints = JSON.stringify(world.ropes.map(rope => { const p = rope.particles.at(-1).position.clone().project(camera), r = canvas.getBoundingClientRect(); return { kind: rope.typeKey, x: r.x + (p.x + 1) * r.width / 2, y: r.y + (1 - p.y) * r.height / 2 }; }));
    frame = requestAnimationFrame(tick);
  }
  frame = requestAnimationFrame(tick);
  $('#cable-start').focus({ preventScroll: true });
  return () => {
    if (disposed) return;
    disposed = true; cancelAnimationFrame(frame); release(); observer.disconnect(); events.abort(); world.clear();
    const geometries = new Set(), materials = new Set(), textures = new Set();
    scene.traverse(item => {
      if (item.geometry) geometries.add(item.geometry);
      if (item.material) (Array.isArray(item.material) ? item.material : [item.material]).forEach(material => { materials.add(material); for (const value of Object.values(material)) if (value?.isTexture) textures.add(value); });
      item.shadow?.map?.dispose();
    });
    geometries.forEach(value => value.dispose()); materials.forEach(value => value.dispose()); textures.forEach(value => value.dispose());
    renderer.dispose(); renderer.forceContextLoss();
  };
}
