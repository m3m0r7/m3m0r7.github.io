import { LOWER_Z_MAX, HOME_DOORS } from './home-layout.mjs';
import { canStand, floorAt, movePlayer } from './movement.mjs';

const STEP = .24, SIZE = 39, ORIGIN = -4.56;
const graphs = new Map();
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z, a.feet - b.feet);

function graph(unlocked, clearance = 0, doors = {}) {
  const key = `${unlocked}:${clearance}:${Object.keys(HOME_DOORS).map(id=>Number(!!doors[id])).join('')}`;
  if (graphs.has(key)) return graphs.get(key);
  const nodes = [], cells = new Map();
  for (let ix = 0; ix < SIZE; ix++) for (let iz = 0; iz < Math.ceil((LOWER_Z_MAX-.24-ORIGIN)/STEP); iz++) {
    const x = ORIGIN + ix * STEP, z = ORIGIN + iz * STEP, column = [];
    for (const floor of [0, 3.4]) {
      const feet = floorAt(x, z, floor);
      if (column.some(node => node.feet === feet) || !canStand(x, z, feet, unlocked, doors)) continue;
      if (clearance && [[-1,-1],[-1,1],[1,-1],[1,1]].some(([dx,dz]) => !canStand(x + dx * clearance, z + dz * clearance, feet, unlocked, doors))) continue;
      const node = { x, z, feet, ix, iz, index: nodes.length, edges: [] }; column.push(node); nodes.push(node);
    }
    cells.set(`${ix},${iz}`, column);
  }
  for (const node of nodes) {
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
      if (!dx && !dz) continue;
      for (const next of cells.get(`${node.ix + dx},${node.iz + dz}`) || []) {
        if (Math.abs(next.feet - node.feet) > .15) continue;
        const reached = movePlayer(node, next.x - node.x, next.z - node.z, unlocked, doors);
        if (distance(reached, next) < .015) node.edges.push(next.index);
      }
    }
  }
  graphs.set(key, nodes); return nodes;
}

// 歩行と同じ衝突判定で経路を作り、階層の重なりや施錠中の扉を横切らない。
export function findPath(start, target, unlocked = false, tolerance = .45, clearance = 0, doors = {}) {
  if (![start.x, start.z, start.feet, target.x, target.z, target.feet].every(Number.isFinite)) return [];
  const nodes = graph(unlocked, clearance, doors);
  const nearest = nodes.filter(node => distance(start, node) < .55).sort((a, b) => distance(start, a) - distance(start, b));
  const first = nearest.find(node => distance(movePlayer(start, node.x - start.x, node.z - start.z, unlocked, doors), node) < .02);
  if (!first) return [];
  const goals = new Set(nodes.filter(node => distance(node, target) <= tolerance).map(node => node.index));
  if (!goals.size) return [];
  const costs = new Map([[first.index, 0]]), previous = new Map(), open = [first.index], closed = new Set();
  while (open.length) {
    open.sort((a, b) => costs.get(a) + Math.max(0, distance(nodes[a], target) - tolerance) - costs.get(b) - Math.max(0, distance(nodes[b], target) - tolerance));
    const index = open.shift(), current = nodes[index];
    if (goals.has(index)) {
      const path = [current]; let back = index;
      while (previous.has(back)) { back = previous.get(back); path.unshift(nodes[back]); }
      return path.map(({ x, z, feet }) => ({ x, z, feet }));
    }
    closed.add(index);
    for (const next of current.edges) {
      if (closed.has(next)) continue;
      const cost = costs.get(index) + distance(current, nodes[next]);
      if (cost >= (costs.get(next) ?? Infinity)) continue;
      costs.set(next, cost); previous.set(next, index); if (!open.includes(next)) open.push(next);
    }
  }
  return [];
}

export function randomCatDestination(position, random = Math.random, changeFloor = false) {
  const floor=changeFloor?(position.feet>1.7?0:3.4):(position.feet>1.7?3.4:0);
  const candidates = graph(false, .15).filter(node => node.feet === floor && (floor===0||node.x<2.5) && distance(node, position) > 1.8);
  const { x, z, feet } = candidates[Math.min(candidates.length - 1, Math.floor(random() * candidates.length))] || position;
  return { x, z, feet };
}

export function createCatWalker(start, random = Math.random) {
  let trips=0;
  let position = { ...start, feet: start.feet ?? 3.4 }, route = [], rest = .15 + random() * .4, pet = 0, mode = 'idle', destination = null;
  return {
    pet(player) {
      pet = 4.5; route = []; rest = .3 + random() * .6; mode = 'pet';
      if (player) position.yaw = Math.atan2(-(player.x - position.x), -(player.z - position.z));
    },
    step(dt, player, other) {
      if (pet > 0) { pet = Math.max(0, pet - dt); mode = 'pet'; }
      else if (rest > 0) { rest -= dt; mode = 'idle'; }
      else {
        if (!route.length) { destination = randomCatDestination(position, random, trips++%3===0); route = findPath(position, destination, false, .25, .15); }
        const target = route[0];
        if (!target) { rest = 1; mode = 'idle'; }
        else {
          const dx = target.x - position.x, dz = target.z - position.z, length = Math.hypot(dx, dz);
          const stride = Math.min(length, dt * .65), next = movePlayer(position, dx / (length || 1) * stride, dz / (length || 1) * stride, false);
          // 近接中は距離を広げる歩行を許可する。重なりから永久停止しない。
          const actors = [player, other].filter(actor => actor && Math.abs(actor.feet - position.feet) < .2);
          const blocked = actors.some(actor => {
            const before = Math.hypot(position.x - actor.x, position.z - actor.z), after = Math.hypot(next.x - actor.x, next.z - actor.z);
            return after < .52 && after < before - .00001;
          });
          if (blocked) {
            // グリッドの始点自体が相手側にある場合は、通れる方向へ退避する。
            const separation = point => Math.min(...actors.map(actor => Math.hypot(point.x - actor.x, point.z - actor.z)));
            const options = Array.from({ length: 16 }, (_, i) => {
              const angle = i * Math.PI / 8;
              return movePlayer(position, Math.sin(angle) * dt * .65, Math.cos(angle) * dt * .65, false);
            }).filter(point => Math.abs(point.feet-position.feet)<.15);
            options.sort((a, b) => separation(b) - separation(a));
            const escape = options[0]; route = [];
            if (escape && separation(escape) > separation(position) + .00001) {
              escape.yaw = Math.atan2(position.x - escape.x, position.z - escape.z); position = escape; mode = 'walk';
            } else { rest = .1 + random() * .3; mode = 'idle'; }
          }
          else { position = next; mode = 'walk'; if (length > .01) position.yaw = Math.atan2(-dx, -dz); if (length < .05) route.shift(); if (!route.length) rest = .6 + random() * 1.8; }
        }
      }
      return { ...position, mode, destination };
    },
  };
}
