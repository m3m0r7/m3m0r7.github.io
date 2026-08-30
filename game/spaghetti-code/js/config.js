import * as THREE from "three";
import { LEVEL_ORDER, LEVELS } from "./levels.js";

export { LEVEL_ORDER, LEVELS, SPECIAL_LEVEL_KEY } from "./levels.js";

export const WORLD = Object.freeze({ floorY: 0, halfWidth: 15, halfDepth: 9.5, maxHeight: 8 });

export const CABLE_TYPES = Object.freeze({
  earphones: { label: "有線イヤフォン", weight: 13, family: "earphones", ends: ["audio-jack", "splitter"], colors: [0xe7e4dc, 0x246fa8, 0xdd4f86, 0xb92b20], radius: [0.036, 0.048], weightScale: 1.05, branched: true },
  "power-c7": { label: "電源プラグ", weight: 13, family: "power-cable", ends: ["power-plug", "figure8-female"], radius: [0.058, 0.078], weightScale: 1.75 },
  "power-brick": { label: "ACアダプター", weight: 9, family: "power-cable", ends: ["power-plug", "figure8-female"], accessory: "power-brick", radius: [0.058, 0.08], weightScale: 2.3 },
  "power-strip": { label: "電源タップ", weight: 8, family: "power-strip", ends: ["power-plug", "power-strip"], radius: [0.062, 0.084], weightScale: 2.45 },
  "hdmi-mm": { label: "HDMIケーブル", weight: 10, ends: ["hdmi-male", "hdmi-male"], radius: [0.048, 0.064], weightScale: 1.4 },
  "hdmi-mf": { label: "HDMIケーブル", weight: 6, ends: ["hdmi-male", "hdmi-female"], radius: [0.05, 0.066], weightScale: 1.45 },
  "usb-c-ff": { label: "Type-Cケーブル", weight: 3, ends: ["usb-c-female", "usb-c-female"], radius: [0.04, 0.054], weightScale: 1.08 },
  "usb-c-mf": { label: "Type-Cケーブル", weight: 8, ends: ["usb-c-male", "usb-c-female"], radius: [0.04, 0.055], weightScale: 1.12 },
  "usb-c-mm": { label: "Type-Cケーブル", weight: 11, ends: ["usb-c-male", "usb-c-male"], radius: [0.039, 0.054], weightScale: 1.08 },
  "usb-a-ff": { label: "Type-Aケーブル", weight: 3, ends: ["usb-a-female", "usb-a-female"], radius: [0.043, 0.058], weightScale: 1.18 },
  "usb-a-mf": { label: "Type-Aケーブル", weight: 7, ends: ["usb-a-male", "usb-a-female"], radius: [0.044, 0.06], weightScale: 1.2 },
  "usb-a-mm": { label: "Type-Aケーブル", weight: 9, ends: ["usb-a-male", "usb-a-male"], radius: [0.043, 0.059], weightScale: 1.18 },
});

const POWER_CABLE_KEYS = ["power-c7", "power-brick"];
const BLACK_CABLE_COLORS = [0x090a08, 0x11120f, 0x181814, 0x20201b];

export function createRng(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function weightedPick(rng, keys) {
  const total = keys.reduce((sum, key) => sum + CABLE_TYPES[key].weight, 0);
  let target = rng() * total;
  for (const key of keys) {
    target -= CABLE_TYPES[key].weight;
    if (target <= 0) return key;
  }
  return keys.at(-1);
}

function selectCableTypes(count, rng) {
  const allKeys = Object.keys(CABLE_TYPES);
  const selected = ["earphones", weightedPick(rng, POWER_CABLE_KEYS), "power-strip"];
  while (selected.length < count) selected.push(weightedPick(rng, allKeys));
  for (let index = selected.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [selected[index], selected[swapIndex]] = [selected[swapIndex], selected[index]];
  }
  return selected;
}

export function createCableTypeSelection(levelKey, seed) {
  const level = LEVELS[levelKey];
  if (!level) throw new Error(`Unknown level: ${levelKey}`);
  return selectCableTypes(level.count, createRng(seed + level.complexity * 104729));
}

function trefoilPoint(u, scale, phase, yOffset) {
  return new THREE.Vector3(
    (Math.sin(u) + 2 * Math.sin(2 * u)) * scale,
    yOffset - Math.sin(3 * u) * scale * 0.38,
    (Math.cos(u) - 2 * Math.cos(2 * u)) * scale * 0.78,
  ).applyAxisAngle(new THREE.Vector3(0, 1, 0), phase);
}

function figureEightPoint(u, scale, phase, yOffset) {
  const radius = 2 + Math.cos(2 * u);
  return new THREE.Vector3(
    radius * Math.cos(3 * u) * scale,
    yOffset + Math.sin(4 * u) * scale * 0.46,
    radius * Math.sin(3 * u) * scale * 0.72,
  ).applyAxisAngle(new THREE.Vector3(0, 1, 0), phase);
}

function cinquefoilPoint(u, scale, phase, yOffset) {
  const radius = 2 + Math.cos(5 * u);
  return new THREE.Vector3(
    radius * Math.cos(2 * u) * scale,
    yOffset + Math.sin(5 * u) * scale * 0.48,
    radius * Math.sin(2 * u) * scale * 0.74,
  ).applyAxisAngle(new THREE.Vector3(0, 1, 0), phase);
}

function makeOpenKnotPoint(t, kind, scale, phase, lane) {
  const knotStart = kind === "cinquefoil" ? 0.15 : 0.18;
  const knotEnd = 1 - knotStart;
  const uStart = kind === "figure8" ? 0.24 : kind === "cinquefoil" ? 0.2 : 0.38;
  const uEnd = Math.PI * 2 - uStart;
  const pointAt = kind === "figure8" ? figureEightPoint : kind === "cinquefoil" ? cinquefoilPoint : trefoilPoint;
  const start = pointAt(uStart, scale, phase, 0.72 + lane * 0.02);
  const end = pointAt(uEnd, scale, phase, 0.72 + lane * 0.02);
  const left = new THREE.Vector3(-8.2, 0.22, lane * 0.18 - 0.65);
  const right = new THREE.Vector3(8.2, 0.22, lane * 0.18 + 0.65);

  if (t < knotStart) return left.lerp(start, t / knotStart);
  if (t > knotEnd) return end.lerp(right, (t - knotEnd) / (1 - knotEnd));
  const u = THREE.MathUtils.lerp(uStart, uEnd, (t - knotStart) / (knotEnd - knotStart));
  return pointAt(u, scale, phase, 0.72 + lane * 0.02);
}

function createCurvePoint(pattern, t, options) {
  const { phase, lane, amplitude, turns, complexity } = options;
  const window = Math.sin(Math.PI * t);
  const x = THREE.MathUtils.lerp(-8.6, 8.6, t);

  if (["overhand", "figure8", "cinquefoil"].includes(pattern)) {
    const scale = pattern === "figure8"
      ? 1.08 + complexity * 0.03
      : pattern === "cinquefoil"
        ? 1.04 + complexity * 0.028
        : 1.34 + complexity * 0.03;
    return makeOpenKnotPoint(t, pattern, scale, phase * 0.19, lane);
  }

  if (pattern === "birdnest") {
    const horizontalTurns = 2.25 + complexity * 0.14;
    const depthTurns = 3.2 + complexity * 0.16;
    return new THREE.Vector3(
      THREE.MathUtils.lerp(-4.7, 4.7, t) + Math.sin(t * Math.PI * 2 * horizontalTurns + phase) * amplitude * 1.32 * window,
      0.28 + (0.5 + complexity * 0.022) * (0.5 + 0.5 * Math.sin(t * Math.PI * 2 * (depthTurns + 0.7) + phase * 0.6)) * window,
      lane * 0.12 + Math.sin(t * Math.PI * 2 * depthTurns + phase * 0.73) * amplitude * 1.3 * window,
    );
  }

  const theta = t * Math.PI * 2 * (pattern === "coil" ? turns * 0.92 : turns) + phase;
  const depth = pattern === "coil" ? Math.cos(theta) : Math.sin(theta);
  return new THREE.Vector3(
    x + (pattern === "coil" ? Math.sin(theta) * amplitude * 0.82 * window : 0),
    0.22 + (0.38 + complexity * 0.026) * (0.5 + 0.5 * Math.cos(theta * 1.03)) * window,
    lane * 0.16 + depth * amplitude * window,
  );
}

function createMainStrand(cableId, strandId, level, typeKey, rng) {
  const type = CABLE_TYPES[typeKey];
  const pattern = level.patterns[cableId % level.patterns.length];
  const phase = rng() * Math.PI * 2;
  const fanPosition = level.count === 1 ? 0 : (cableId - (level.count - 1) / 2) / ((level.count - 1) / 2);
  const options = {
    phase,
    lane: fanPosition * 2.4,
    amplitude: 0.92 + rng() * 0.86 + level.complexity * 0.07,
    turns: 1.8 + level.complexity * 0.18 + rng() * 0.72,
    complexity: level.complexity,
  };
  const controlCount = ["overhand", "figure8", "cinquefoil"].includes(pattern) ? 112 : 94;
  const controlPoints = [];
  for (let index = 0; index < controlCount; index += 1) {
    const point = createCurvePoint(pattern, index / (controlCount - 1), options);
    point.y += Math.sin(index * 4.37 + cableId * 2.1) * (0.017 + level.complexity * 0.0025);
    controlPoints.push(point);
  }

  let sourceCurve = new THREE.CatmullRomCurve3(controlPoints, false, "centripetal", 0.4);
  const maximumPlayableLength = type.branched ? 10.6 + rng() * 0.9 : 21 + rng() * 2.6;
  const approximateLength = sourceCurve.getLength();
  if (approximateLength > maximumPlayableLength) {
    const scale = maximumPlayableLength / approximateLength;
    for (const point of controlPoints) {
      point.x *= scale;
      point.z *= scale;
      point.y = 0.2 + (point.y - 0.2) * scale;
    }
  }

  const fanRotation = fanPosition * 1.02 + (rng() - 0.5) * 0.16;
  const verticalPhase = phase + cableId * 0.83;
  for (let pointIndex = 0; pointIndex < controlPoints.length; pointIndex += 1) {
    const point = controlPoints[pointIndex];
    const t = pointIndex / (controlPoints.length - 1);
    const centerWeight = Math.sin(Math.PI * t);
    point.applyAxisAngle(new THREE.Vector3(0, 1, 0), fanRotation);
    point.y += Math.sin(t * Math.PI * 2 * (2.4 + level.complexity * 0.2) + verticalPhase) * 0.22 * centerWeight;
    point.x *= level.layoutScale ?? 1;
    point.z *= level.layoutScale ?? 1;
  }

  sourceCurve = new THREE.CatmullRomCurve3(controlPoints, false, "centripetal", 0.4);
  const length = sourceCurve.getLength();
  const crowdScale = Math.log2(level.count / 6);
  const nodeSpacing = 0.3 + crowdScale * 0.04;
  const nodeCount = THREE.MathUtils.clamp(Math.ceil(length / nodeSpacing), 38, 72);
  const radius = THREE.MathUtils.lerp(type.radius[0], type.radius[1], rng());
  const color = type.colors ? type.colors[Math.floor(rng() * type.colors.length)] : BLACK_CABLE_COLORS[cableId % BLACK_CABLE_COLORS.length];

  return {
    id: strandId,
    cableId,
    typeKey,
    typeLabel: type.label,
    levelCount: level.count,
    pattern,
    points: sourceCurve.getSpacedPoints(nodeCount - 1),
    radius,
    color,
    stiffness: 0.8 + rng() * 0.13,
    bendStiffness: 0.065 + rng() * 0.1,
    roughness: 0.24 + rng() * 0.18,
    weight: type.weightScale * (level.physicalWeightScale ?? 1) * (0.94 + rng() * 0.16),
    dragContactGrip: level.dragContactGrip ?? 0.82,
    dragPileFollow: level.dragPileFollow ?? 0,
    connectors: type.ends,
    externalEnds: type.branched ? [true, false] : [true, true],
    accessories: type.accessory ? [{ kind: type.accessory, t: 0.52 }] : [],
  };
}

function createEarphoneBranches(mainStrand, firstStrandId) {
  const end = mainStrand.points.at(-1);
  const previous = mainStrand.points.at(-2);
  const forward = end.clone().sub(previous).setY(0);
  if (forward.lengthSq() < 0.001) forward.set(1, 0, 0);
  forward.normalize();
  const side = new THREE.Vector3(-forward.z, 0, forward.x);

  return [-1, 1].map((direction, branchIndex) => {
    const points = [];
    const nodeCount = 18;
    const forwardLength = 3.55 + branchIndex * 0.12;
    const spread = 0.94 + branchIndex * 0.08;
    for (let index = 0; index < nodeCount; index += 1) {
      const t = index / (nodeCount - 1);
      const divergence = Math.pow(t, 1.65);
      points.push(
        end.clone()
          .addScaledVector(forward, t * forwardLength + Math.sin(t * Math.PI) * 0.08)
          .addScaledVector(side, direction * divergence * spread)
          .add(new THREE.Vector3(0, Math.sin(t * Math.PI) * 0.16, 0)),
      );
    }
    return {
      ...mainStrand,
      id: firstStrandId + branchIndex,
      pattern: "earphone-branch",
      points,
      radius: mainStrand.radius * 0.82,
      stiffness: 0.9,
      bendStiffness: 0.1,
      weight: mainStrand.weight * 0.82,
      connectors: ["none", "earbud"],
      externalEnds: [false, true],
      accessories: [],
    };
  });
}

export function createCableDefinitions(levelKey, seed) {
  const level = LEVELS[levelKey];
  if (!level) throw new Error(`Unknown level: ${levelKey}`);
  const typeKeys = createCableTypeSelection(levelKey, seed);
  const cables = [];
  const strands = [];
  const junctions = [];
  let strandId = 0;

  for (let cableId = 0; cableId < level.count; cableId += 1) {
    const typeKey = typeKeys[cableId];
    const rng = createRng(seed + cableId * 1973 + level.complexity * 7919);
    const mainStrand = createMainStrand(cableId, strandId, level, typeKey, rng);
    const strandIds = [strandId];
    strands.push(mainStrand);
    strandId += 1;

    if (CABLE_TYPES[typeKey].branched) {
      const branches = createEarphoneBranches(mainStrand, strandId);
      strands.push(...branches);
      strandIds.push(...branches.map((branch) => branch.id));
      junctions.push({
        cableId,
        members: [
          { strandId: mainStrand.id, particleIndex: mainStrand.points.length - 1 },
          ...branches.map((branch) => ({ strandId: branch.id, particleIndex: 0 })),
        ],
      });
      strandId += branches.length;
    }

    cables.push({ id: cableId, typeKey, label: CABLE_TYPES[typeKey].label, color: mainStrand.color, strandIds });
  }

  return { cables, strands, junctions };
}
