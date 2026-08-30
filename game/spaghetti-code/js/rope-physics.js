import * as THREE from "three";
import { WORLD } from "./config.js?v=2";
import { createAccessoryVisual, createConnectorVisual } from "./cable-visuals.js";

const UP = new THREE.Vector3(0, 1, 0);
const X_AXIS = new THREE.Vector3(1, 0, 0);
const HASH_NEIGHBORS = [];

function hashKey(x, y, z) {
  return ((x + 64) * 64 + (y + 8)) * 64 + (z + 32);
}

for (let x = -1; x <= 1; x += 1) {
  for (let y = -1; y <= 1; y += 1) {
    for (let z = -1; z <= 1; z += 1) HASH_NEIGHBORS.push([x, y, z]);
  }
}

function makeTubeGeometry(nodeCount, radialSegments) {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(nodeCount * radialSegments * 3);
  const indices = [];
  for (let node = 0; node < nodeCount - 1; node += 1) {
    for (let side = 0; side < radialSegments; side += 1) {
      const nextSide = (side + 1) % radialSegments;
      const current = node * radialSegments + side;
      const currentNext = node * radialSegments + nextSide;
      const following = (node + 1) * radialSegments + side;
      const followingNext = (node + 1) * radialSegments + nextSide;
      indices.push(current, following, currentNext, currentNext, following, followingNext);
    }
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  return geometry;
}

function connectorCollisionRadius(kind, baseRadius) {
  if (kind === "power-strip") return 0.25;
  if (kind === "power-plug") return 0.22;
  if (kind === "figure8-female") return 0.2;
  if (kind.startsWith("hdmi")) return 0.18;
  if (kind.startsWith("usb-a")) return 0.17;
  if (kind.startsWith("usb-c")) return 0.155;
  if (kind === "earbud") return 0.15;
  return Math.max(baseRadius, 0.15);
}

export class Rope {
  constructor(definition, globalIdStart) {
    this.id = definition.id;
    this.cableId = definition.cableId;
    this.typeKey = definition.typeKey;
    this.typeLabel = definition.typeLabel;
    this.pattern = definition.pattern;
    this.radius = definition.radius;
    this.weight = definition.weight;
    this.dragContactGrip = definition.dragContactGrip;
    this.dragPileFollow = definition.dragPileFollow;
    this.stiffness = definition.stiffness;
    this.bendStiffness = definition.bendStiffness;
    this.externalEnds = definition.externalEnds;
    this.connectorKinds = definition.connectors;
    this.particles = definition.points.map((point, index) => ({
      position: point.clone(),
      previous: point.clone(),
      radius: Math.max(definition.radius * 1.45, 0.15),
      boundaryRadius: definition.radius,
      floorRadius: definition.radius,
      globalId: globalIdStart + index,
      ropeId: definition.id,
      cableId: definition.cableId,
      index,
      contactLoad: 0,
    }));
    this.restLengths = [];
    this.restTotal = 0;
    for (let index = 0; index < this.particles.length - 1; index += 1) {
      const length = this.particles[index].position.distanceTo(this.particles[index + 1].position);
      this.restLengths.push(length);
      this.restTotal += length;
    }
    const continuityRadius = Math.max(0.15, Math.max(...this.restLengths) * 0.52);
    for (const particle of this.particles) particle.radius = Math.min(0.25, Math.max(particle.radius, continuityRadius));
    this.bendLengths = [];
    for (let index = 0; index < this.particles.length - 2; index += 1) {
      this.bendLengths.push((this.restLengths[index] + this.restLengths[index + 1]) * 0.985);
    }

    this.radialSegments = definition.radius < 0.045 ? 9 : 11;
    this.visualNodeCount = (this.particles.length - 1) * 3 + 1;
    this.visualCurve = new THREE.CatmullRomCurve3(
      this.particles.map((particle) => particle.position),
      false,
      "centripetal",
      0.35,
    );
    this.material = new THREE.MeshPhysicalMaterial({
      color: definition.color,
      roughness: definition.roughness,
      metalness: 0,
      clearcoat: 0.72,
      clearcoatRoughness: 0.14,
      ior: 1.47,
      specularIntensity: 0.92,
    });
    this.geometry = makeTubeGeometry(this.visualNodeCount, this.radialSegments);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.userData.rope = this;
    this.mesh.userData.pickable = true;

    this.hitGeometry = new THREE.BufferGeometry();
    this.hitGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(this.particles.length * 3), 3));
    this.hitMaterial = new THREE.LineBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
    this.hitLine = new THREE.Line(this.hitGeometry, this.hitMaterial);
    this.hitLine.frustumCulled = false;
    this.hitLine.userData.rope = this;
    this.hitLine.userData.pickable = true;

    this.connectorVisuals = definition.connectors.map((kind, endpointIndex) => {
      const visual = createConnectorVisual(kind, definition.radius, definition.color);
      if (!visual) return null;
      const particleIndex = endpointIndex === 0 ? 0 : this.particles.length - 1;
      const connectorRadius = connectorCollisionRadius(kind, definition.radius);
      this.particles[particleIndex].radius = Math.max(this.particles[particleIndex].radius, connectorRadius);
      this.particles[particleIndex].boundaryRadius = Math.max(
        this.particles[particleIndex].boundaryRadius,
        connectorRadius,
      );
      this.particles[particleIndex].floorRadius = Math.max(
        this.particles[particleIndex].floorRadius,
        connectorRadius,
      );
      for (const mesh of visual.meshes) {
        mesh.userData.rope = this;
        mesh.userData.particleIndex = particleIndex;
        mesh.userData.pickable = true;
      }
      return visual;
    });

    this.accessoryVisuals = definition.accessories.map((accessory) => {
      const visual = createAccessoryVisual(accessory.kind, definition.radius);
      const particleIndex = Math.round(accessory.t * (this.particles.length - 1));
      this.particles[particleIndex].radius = Math.max(this.particles[particleIndex].radius, 0.25);
      this.particles[particleIndex].boundaryRadius = Math.max(this.particles[particleIndex].boundaryRadius, 0.25);
      this.particles[particleIndex].floorRadius = Math.max(this.particles[particleIndex].floorRadius, 0.25);
      for (const mesh of visual.meshes) {
        mesh.userData.rope = this;
        mesh.userData.particleIndex = particleIndex;
        mesh.userData.pickable = true;
      }
      return { ...visual, particleIndex };
    });
    this.updateVisuals();
  }

  addTo(scene) {
    scene.add(this.mesh, this.hitLine);
    for (const visual of [...this.connectorVisuals, ...this.accessoryVisuals]) {
      if (visual) scene.add(visual.group);
    }
  }

  removeFrom(scene) {
    scene.remove(this.mesh, this.hitLine);
    this.geometry.dispose();
    this.material.dispose();
    this.hitGeometry.dispose();
    this.hitMaterial.dispose();
    for (const visual of [...this.connectorVisuals, ...this.accessoryVisuals]) {
      if (!visual) continue;
      scene.remove(visual.group);
      visual.dispose();
    }
  }

  getPickables() {
    return [
      this.mesh,
      this.hitLine,
      ...this.connectorVisuals.flatMap((visual) => visual?.meshes ?? []),
      ...this.accessoryVisuals.flatMap((visual) => visual.meshes),
    ];
  }

  closestParticle(point) {
    let bestIndex = 0;
    let bestDistance = Infinity;
    for (let index = 0; index < this.particles.length; index += 1) {
      const distance = this.particles[index].position.distanceToSquared(point);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    }
    return bestIndex;
  }

  satisfyDistances() {
    const delta = new THREE.Vector3();
    for (let index = 0; index < this.particles.length - 1; index += 1) {
      const a = this.particles[index];
      const b = this.particles[index + 1];
      delta.subVectors(b.position, a.position);
      const distance = Math.max(delta.length(), 0.00001);
      delta.multiplyScalar((distance - this.restLengths[index]) / distance * 0.5 * this.stiffness);
      a.position.add(delta);
      b.position.sub(delta);
      a.previous.add(delta);
      b.previous.sub(delta);
    }
  }

  satisfyBends() {
    const delta = new THREE.Vector3();
    for (let index = 0; index < this.particles.length - 2; index += 1) {
      const a = this.particles[index];
      const b = this.particles[index + 2];
      delta.subVectors(b.position, a.position);
      const distance = Math.max(delta.length(), 0.00001);
      delta.multiplyScalar((distance - this.bendLengths[index]) / distance * 0.5 * this.bendStiffness);
      a.position.add(delta);
      b.position.sub(delta);
      a.previous.add(delta);
      b.previous.sub(delta);
    }
  }

  updateVisuals() {
    const positionAttribute = this.geometry.getAttribute("position");
    const tangent = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const binormal = new THREE.Vector3();
    const lastNormal = new THREE.Vector3();
    const center = new THREE.Vector3();
    const vertex = new THREE.Vector3();

    for (let index = 0; index < this.visualNodeCount; index += 1) {
      const t = index / (this.visualNodeCount - 1);
      this.visualCurve.getPoint(t, center);
      this.visualCurve.getTangent(t, tangent);
      if (index === 0) {
        normal.crossVectors(tangent, UP);
        if (normal.lengthSq() < 0.001) normal.crossVectors(tangent, X_AXIS);
        normal.normalize();
      } else {
        normal.copy(lastNormal).addScaledVector(tangent, -lastNormal.dot(tangent));
        if (normal.lengthSq() < 0.001) normal.crossVectors(tangent, UP);
        normal.normalize();
      }
      binormal.crossVectors(tangent, normal).normalize();
      lastNormal.copy(normal);
      for (let side = 0; side < this.radialSegments; side += 1) {
        const angle = side / this.radialSegments * Math.PI * 2;
        vertex.copy(center)
          .addScaledVector(normal, Math.cos(angle) * this.radius)
          .addScaledVector(binormal, Math.sin(angle) * this.radius);
        positionAttribute.setXYZ(index * this.radialSegments + side, vertex.x, vertex.y, vertex.z);
      }
    }
    positionAttribute.needsUpdate = true;
    this.geometry.computeVertexNormals();
    this.geometry.computeBoundingSphere();

    const hitPositionAttribute = this.hitGeometry.getAttribute("position");
    for (let index = 0; index < this.particles.length; index += 1) {
      const point = this.particles[index].position;
      hitPositionAttribute.setXYZ(index, point.x, point.y, point.z);
    }
    hitPositionAttribute.needsUpdate = true;
    this.hitGeometry.computeBoundingSphere();

    this.connectorVisuals.forEach((visual, endpointIndex) => {
      if (!visual) return;
      const particleIndex = endpointIndex === 0 ? 0 : this.particles.length - 1;
      const neighborIndex = endpointIndex === 0 ? 1 : this.particles.length - 2;
      const outward = this.particles[particleIndex].position.clone().sub(this.particles[neighborIndex].position);
      if (outward.lengthSq() < 0.0001) outward.set(0, 1, 0);
      outward.normalize();
      visual.group.position.copy(this.particles[particleIndex].position);
      visual.group.quaternion.setFromUnitVectors(UP, outward);
    });

    for (const visual of this.accessoryVisuals) {
      const particle = this.particles[visual.particleIndex];
      const before = this.particles[Math.max(0, visual.particleIndex - 1)].position;
      const after = this.particles[Math.min(this.particles.length - 1, visual.particleIndex + 1)].position;
      tangent.subVectors(after, before);
      if (tangent.lengthSq() < 0.0001) tangent.set(0, 1, 0);
      tangent.normalize();
      visual.group.position.copy(particle.position);
      visual.group.quaternion.setFromUnitVectors(UP, tangent);
    }
  }

  metrics() {
    const start = this.particles[0].position;
    const end = this.particles.at(-1).position;
    return { straightness: start.distanceTo(end) / this.restTotal };
  }
}

export class RopeWorld {
  constructor(scene) {
    this.scene = scene;
    this.cables = [];
    this.ropes = [];
    this.junctions = [];
    this.pickables = [];
    this.held = null;
    this.gravity = new THREE.Vector3(0, -15, 0);
    this.floorY = WORLD.floorY;
    this.floorSurface = null;
    this.hashCellSize = 0.52;
    this.lastContactCount = 0;
    this.lastInterCableContactCount = 0;
    this.cableContactLoads = new Map();
    this.cableContactLinks = new Map();
    this.visualFrame = 0;
    this.sleeping = false;
    this.settlingAfterRelease = false;
    this.idleTime = 0;
  }

  setGravity(gravityY) {
    this.gravity.set(0, gravityY, 0);
  }

  setFloorY(floorY, floorSurface = null) {
    this.floorY = floorY;
    this.floorSurface = floorSurface;
  }

  floorYAt(position) {
    return this.floorSurface?.(position.x, position.z) ?? this.floorY;
  }

  load(sceneDefinition) {
    this.clear();
    this.sleeping = false;
    this.settlingAfterRelease = false;
    this.idleTime = 0;
    let globalId = 0;
    const ropeById = new Map();
    for (const definition of sceneDefinition.strands) {
      const rope = new Rope(definition, globalId);
      globalId += rope.particles.length;
      rope.addTo(this.scene);
      this.ropes.push(rope);
      ropeById.set(rope.id, rope);
      this.pickables.push(...rope.getPickables());
    }
    this.cables = sceneDefinition.cables.map((cable) => ({
      ...cable,
      ropes: cable.strandIds.map((strandId) => ropeById.get(strandId)),
    }));
    this.junctions = sceneDefinition.junctions.map((junction) => ({
      cableId: junction.cableId,
      particles: junction.members.map((member) => ropeById.get(member.strandId).particles[member.particleIndex]),
    }));
    this.settleInitial();
  }

  clear() {
    this.release();
    for (const rope of this.ropes) rope.removeFrom(this.scene);
    this.cables = [];
    this.ropes = [];
    this.junctions = [];
    this.pickables = [];
    this.cableContactLoads.clear();
    this.cableContactLinks.clear();
    this.sleeping = true;
    this.settlingAfterRelease = false;
    this.idleTime = 0;
  }

  getCableEndpoints(cableIndex) {
    const cable = this.cables[cableIndex];
    if (!cable) return [];
    const endpoints = [];
    for (const rope of cable.ropes) {
      if (rope.externalEnds[0]) endpoints.push({ rope, particleIndex: 0 });
      if (rope.externalEnds[1]) endpoints.push({ rope, particleIndex: rope.particles.length - 1 });
    }
    return endpoints;
  }

  grab(rope, particleIndex, target) {
    const particle = rope.particles[particleIndex];
    this.held = { rope, particleIndex, particle, target: target.clone() };
    particle.previous.copy(particle.position);
    this.sleeping = false;
    this.settlingAfterRelease = false;
    this.idleTime = 0;
  }

  moveGrab(target) {
    if (this.held) this.held.target.copy(target);
  }

  release() {
    if (this.held) {
      this.held.particle.previous.copy(this.held.particle.position);
      this.settlingAfterRelease = true;
      this.idleTime = 0;
    }
    this.held = null;
  }

  sleep() {
    for (const rope of this.ropes) {
      for (const particle of rope.particles) particle.previous.copy(particle.position);
    }
    this.sleeping = true;
    this.settlingAfterRelease = false;
    this.idleTime = 0;
  }

  integrate(dt) {
    const acceleration = this.gravity.clone().multiplyScalar(dt * dt);
    const velocity = new THREE.Vector3();
    for (const rope of this.ropes) {
      const velocityRetention = THREE.MathUtils.clamp(0.88 - (rope.weight - 1) * 0.009, 0.79, 0.88);
      for (const particle of rope.particles) {
        velocity.subVectors(particle.position, particle.previous).multiplyScalar(velocityRetention);
        particle.previous.copy(particle.position);
        particle.position.add(velocity).add(acceleration);
      }
    }
  }

  constrainWorld() {
    for (const rope of this.ropes) {
      const floorRetention = THREE.MathUtils.clamp(0.56 / Math.sqrt(0.88 + rope.weight * 0.12), 0.46, 0.56);
      for (const particle of rope.particles) {
        const floor = this.floorYAt(particle.position) + particle.floorRadius;
        if (particle.position.y < floor) {
          particle.position.y = floor;
          particle.previous.y = floor;
          particle.previous.x = particle.position.x - (particle.position.x - particle.previous.x) * floorRetention;
          particle.previous.z = particle.position.z - (particle.position.z - particle.previous.z) * floorRetention;
        }
        const clampedX = THREE.MathUtils.clamp(particle.position.x, -WORLD.halfWidth, WORLD.halfWidth);
        const clampedZ = THREE.MathUtils.clamp(particle.position.z, -WORLD.halfDepth, WORLD.halfDepth);
        const clampedY = Math.min(particle.position.y, WORLD.maxHeight);
        particle.previous.x += clampedX - particle.position.x;
        particle.previous.z += clampedZ - particle.position.z;
        particle.previous.y += clampedY - particle.position.y;
        particle.position.set(clampedX, clampedY, clampedZ);
      }
    }
  }

  constrainHeld() {
    if (!this.held) return;
    let localContactLoad = 0;
    for (
      let index = Math.max(0, this.held.particleIndex - 2);
      index <= Math.min(this.held.rope.particles.length - 1, this.held.particleIndex + 2);
      index += 1
    ) {
      localContactLoad += this.held.rope.particles[index].contactLoad;
    }
    const cableContactLoad = this.cableContactLoads.get(this.held.rope.cableId) ?? 0;
    const contactResistance = Math.max(
      THREE.MathUtils.clamp(localContactLoad / 4, 0, 1),
      THREE.MathUtils.clamp(cableContactLoad / 8, 0, 1),
    );
    const weightInfluence = Math.sqrt(0.82 + this.held.rope.weight * 0.18);
    const maxStep = THREE.MathUtils.lerp(0.032, 0.0085, contactResistance) / weightInfluence;
    const delta = this.held.target.clone().sub(this.held.particle.position);
    if (delta.length() > maxStep) delta.setLength(maxStep);
    this.held.particle.position.add(delta);
    this.translateConnectedPile(delta);
  }

  translateConnectedPile(delta) {
    const follow = this.held?.rope.dragPileFollow ?? 0;
    if (follow <= 0 || delta.lengthSq() < 0.00000001) return;
    const heldCableId = this.held.rope.cableId;
    const connectedCableIds = new Set([heldCableId]);
    const pendingCableIds = [heldCableId];
    while (pendingCableIds.length) {
      const cableId = pendingCableIds.pop();
      for (const linkedCableId of this.cableContactLinks.get(cableId) ?? []) {
        if (connectedCableIds.has(linkedCableId)) continue;
        connectedCableIds.add(linkedCableId);
        pendingCableIds.push(linkedCableId);
      }
    }
    for (const rope of this.ropes) {
      if (rope.cableId === heldCableId || !connectedCableIds.has(rope.cableId)) continue;
      for (const particle of rope.particles) {
        particle.position.addScaledVector(delta, follow);
        particle.previous.addScaledVector(delta, follow);
      }
    }
  }

  solveJunctions() {
    const center = new THREE.Vector3();
    const previousCenter = new THREE.Vector3();
    for (const junction of this.junctions) {
      const heldMember = junction.particles.find((particle) => particle === this.held?.particle);
      center.set(0, 0, 0);
      previousCenter.set(0, 0, 0);
      if (heldMember) {
        center.copy(heldMember.position);
        previousCenter.copy(heldMember.previous);
      } else {
        for (const particle of junction.particles) {
          center.add(particle.position);
          previousCenter.add(particle.previous);
        }
        center.multiplyScalar(1 / junction.particles.length);
        previousCenter.multiplyScalar(1 / junction.particles.length);
      }
      center.y = Math.max(
        center.y,
        ...junction.particles.map((particle) => this.floorYAt(particle.position) + particle.floorRadius),
      );
      for (const particle of junction.particles) {
        particle.position.copy(center);
        particle.previous.copy(previousCenter);
      }
    }
  }

  buildParticleHash() {
    const hash = new Map();
    const particles = [];
    for (const rope of this.ropes) {
      for (const particle of rope.particles) {
        particles.push(particle);
        const cellX = Math.floor(particle.position.x / this.hashCellSize);
        const cellY = Math.floor(particle.position.y / this.hashCellSize);
        const cellZ = Math.floor(particle.position.z / this.hashCellSize);
        particle.cellX = cellX;
        particle.cellY = cellY;
        particle.cellZ = cellZ;
        const key = hashKey(cellX, cellY, cellZ);
        if (!hash.has(key)) hash.set(key, []);
        hash.get(key).push(particle);
      }
    }
    return { hash, particles };
  }

  solveCollisions() {
    const { hash, particles } = this.buildParticleHash();
    for (const particle of particles) particle.contactLoad = 0;
    const delta = new THREE.Vector3();
    const velocityA = new THREE.Vector3();
    const velocityB = new THREE.Vector3();
    const tangentVelocity = new THREE.Vector3();
    let contacts = 0;
    let interCableContacts = 0;
    const cableContactLoads = new Map();
    const cableContactLinks = new Map();

    for (const particle of particles) {
      for (const [ox, oy, oz] of HASH_NEIGHBORS) {
        const bucket = hash.get(hashKey(particle.cellX + ox, particle.cellY + oy, particle.cellZ + oz));
        if (!bucket) continue;
        for (const other of bucket) {
          if (other.globalId <= particle.globalId) continue;
          if (other.ropeId === particle.ropeId && Math.abs(other.index - particle.index) <= 2) continue;
          if (other.ropeId !== particle.ropeId && other.cableId === particle.cableId) continue;
          const minimum = particle.radius + other.radius;
          delta.subVectors(other.position, particle.position);
          const distanceSq = delta.lengthSq();
          if (distanceSq >= minimum * minimum) continue;
          const distance = Math.sqrt(Math.max(distanceSq, 0.000001));
          if (distanceSq < 0.000001) delta.set(1, 0.15, 0).normalize();
          else delta.multiplyScalar(1 / distance);
          const correction = minimum - distance;
          const particleHeld = particle === this.held?.particle;
          const otherHeld = other === this.held?.particle;
          const particleShare = particleHeld ? 0.14 : otherHeld ? 0.86 : 0.5;
          const otherShare = otherHeld ? 0.14 : particleHeld ? 0.86 : 0.5;
          const particleCorrection = -correction * particleShare;
          const otherCorrection = correction * otherShare;
          particle.position.addScaledVector(delta, particleCorrection);
          other.position.addScaledVector(delta, otherCorrection);
          // 接触を解消する位置補正を次フレームの速度に変換しない。
          particle.previous.addScaledVector(delta, particleCorrection);
          other.previous.addScaledVector(delta, otherCorrection);

          velocityA.subVectors(particle.position, particle.previous);
          velocityB.subVectors(other.position, other.previous);
          tangentVelocity.subVectors(velocityB, velocityA);
          tangentVelocity.addScaledVector(delta, -tangentVelocity.dot(delta));
          const activeCableContact = Boolean(
            this.held
            && particle.cableId !== other.cableId
            && (particle.cableId === this.held.rope.cableId || other.cableId === this.held.rope.cableId)
          );
          const grip = activeCableContact ? this.held.rope.dragContactGrip : particleHeld || otherHeld ? 0.6 : 0.2;
          particle.position.addScaledVector(tangentVelocity, grip * particleShare);
          other.position.addScaledVector(tangentVelocity, -grip * otherShare);
          const friction = THREE.MathUtils.clamp(0.46 + correction / minimum * 0.7, 0.46, 0.76);
          const particleFriction = particleHeld ? 0.14 : otherHeld ? 0.68 : 0.55;
          const otherFriction = otherHeld ? 0.14 : particleHeld ? 0.68 : 0.55;
          particle.previous.addScaledVector(tangentVelocity, -friction * particleFriction);
          other.previous.addScaledVector(tangentVelocity, friction * otherFriction);
          contacts += 1;
          particle.contactLoad += 1;
          other.contactLoad += 1;
          if (particle.cableId !== other.cableId) {
            interCableContacts += 1;
            cableContactLoads.set(particle.cableId, (cableContactLoads.get(particle.cableId) ?? 0) + 1);
            cableContactLoads.set(other.cableId, (cableContactLoads.get(other.cableId) ?? 0) + 1);
            if (!cableContactLinks.has(particle.cableId)) cableContactLinks.set(particle.cableId, new Set());
            if (!cableContactLinks.has(other.cableId)) cableContactLinks.set(other.cableId, new Set());
            cableContactLinks.get(particle.cableId).add(other.cableId);
            cableContactLinks.get(other.cableId).add(particle.cableId);
          }
        }
      }
    }
    this.lastContactCount = contacts;
    this.lastInterCableContactCount = interCableContacts;
    this.cableContactLoads = cableContactLoads;
    this.cableContactLinks = cableContactLinks;
  }

  resetMotion(anchorXZ = null) {
    let offsetX = 0;
    let offsetZ = 0;
    if (anchorXZ) {
      let centerX = 0;
      let centerZ = 0;
      let count = 0;
      for (const rope of this.ropes) {
        for (const particle of rope.particles) {
          centerX += particle.position.x;
          centerZ += particle.position.z;
          count += 1;
        }
      }
      if (count) {
        offsetX = anchorXZ.x - centerX / count;
        offsetZ = anchorXZ.z - centerZ / count;
      }
    }
    for (const rope of this.ropes) {
      for (const particle of rope.particles) {
        particle.position.x = THREE.MathUtils.clamp(
          particle.position.x + offsetX,
          -WORLD.halfWidth,
          WORLD.halfWidth,
        );
        particle.position.z = THREE.MathUtils.clamp(
          particle.position.z + offsetZ,
          -WORLD.halfDepth,
          WORLD.halfDepth,
        );
        particle.previous.copy(particle.position);
      }
    }
  }

  settleInitial() {
    if (!this.ropes.length) return;
    let centerX = 0;
    let centerZ = 0;
    let particleCount = 0;
    for (const rope of this.ropes) {
      for (const particle of rope.particles) {
        centerX += particle.position.x;
        centerZ += particle.position.z;
        particleCount += 1;
      }
    }
    const anchorXZ = { x: centerX / particleCount, z: centerZ / particleCount };
    const passes = 44 + Math.min(this.cables.length, 15);
    for (let pass = 0; pass < passes; pass += 1) {
      this.step(1 / 60, false);
      this.resetMotion(anchorXZ);
    }
    this.solveCollisions();
    this.solveJunctions();
    this.constrainWorld();
    this.resetMotion(anchorXZ);
    for (const rope of this.ropes) rope.updateVisuals();
    this.visualFrame = 0;
    this.sleep();
  }

  step(dt, updateVisuals = true) {
    if (this.sleeping && !this.held) return;
    const safeDt = Math.min(dt, 1 / 30);
    const substeps = this.cables.length >= 48 ? 1 : 2;
    const subDt = safeDt / substeps;
    const iterations = this.cables.length >= 72 ? 3 : this.cables.length >= 36 ? 4 : 5;

    for (let substep = 0; substep < substeps; substep += 1) {
      this.integrate(subDt);
      for (let iteration = 0; iteration < iterations; iteration += 1) {
        for (const rope of this.ropes) {
          rope.satisfyDistances();
          rope.satisfyBends();
        }
        this.constrainHeld();
        this.constrainWorld();
        this.solveJunctions();
        if (this.held || iteration === 0 || iteration === iterations - 1) this.solveCollisions();
      }
      this.constrainWorld();
      this.solveJunctions();
    }

    this.visualFrame += 1;
    const visualStride = this.cables.length >= 72 ? 2 : 1;
    if (updateVisuals && (this.visualFrame % visualStride === 0 || this.held)) {
      for (const rope of this.ropes) rope.updateVisuals();
    }
    if (!this.held && this.settlingAfterRelease) {
      this.idleTime += safeDt;
      const sleepDelay = this.gravity.lengthSq() < 0.0001 ? 0.4 : 3.2;
      if (this.idleTime >= sleepDelay) this.sleep();
    }
  }

  clearMetrics() {
    if (!this.cables.length) return { cleared: false, reason: "empty" };
    if (this.lastInterCableContactCount > 0) {
      return {
        cleared: false,
        contactCount: this.lastInterCableContactCount,
        minimumClearance: null,
      };
    }
    const { hash, particles } = this.buildParticleHash();
    let contactCount = 0;
    let minimumClearance = Infinity;
    for (const particle of particles) {
      for (const [ox, oy, oz] of HASH_NEIGHBORS) {
        const bucket = hash.get(hashKey(particle.cellX + ox, particle.cellY + oy, particle.cellZ + oz));
        if (!bucket) continue;
        for (const other of bucket) {
          if (other.globalId <= particle.globalId || other.cableId === particle.cableId) continue;
          const contactDistance = particle.radius + other.radius + 0.012;
          const clearance = particle.position.distanceTo(other.position) - contactDistance;
          minimumClearance = Math.min(minimumClearance, clearance);
          if (clearance <= 0) contactCount += 1;
        }
      }
    }
    return { cleared: contactCount === 0, contactCount, minimumClearance };
  }
}
