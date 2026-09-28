export const SUPPLY_BOXES = [
  {id:'supply-manuals',position:[-2.22,.235,-4.24],label:'保管 01',kind:'manuals',text:'型落ちした機器の説明書と保証書。捨てられない性分がそのまま詰まっている。ケーブルはない。'},
  {id:'supply-fans',position:[-1.54,.235,-4.24],label:'保管 02',kind:'fans',text:'交換用の冷却ファン。防振ゴムとねじは小袋に分けてある。探し物とは違う。'},
  {id:'supply-adapters',position:[-2.22,.985,-4.24],label:'保管 03',kind:'adapters',text:'AC アダプターと古い映像変換器。先端の形はどれも LAN とは別物だ。'},
  {id:'supply-cables',position:[-1.54,.985,-4.24],label:'保管 04',kind:'cables',text:'ケーブルが何本も絡まって塊になっている。この中に LAN もあるはずだ。'},
  {id:'supply-packing',position:[-2.22,1.735,-4.24],label:'保管 05',kind:'packing',text:'緩衝材と空の帯電防止袋。中身はどこかへ移した後らしい。'},
  {id:'supply-drives',position:[-1.54,1.735,-4.24],label:'保管 06',kind:'drives',text:'帯電防止袋に入った古いドライブと交換用トレー。動くかどうかは怪しい。'},
  {id:'supply-rails',position:[-4.50,.025,-1.62],label:'保管 07',kind:'rails',text:'短いマウント金具と面ファスナーの束。ケーブルは入っていない。'},
  {id:'supply-empty',position:[-4.50,.40,-1.62],label:'保管 08',kind:'empty',text:'底に梱包テープの切れ端だけ。箱を捨てられないから、こうなる。'},
];
export const supplyBox = id => SUPPLY_BOXES.find(box=>box.id===id);

export const CABLE_CLEARANCE = .06;
export const CABLE_SETTLE_SECONDS = .8;
export const WORKBENCH_BOUNDS = Object.freeze({ x: 16.5, z: 10.8, height: 8.7 });

const validPoint = point => Array.isArray(point) && point.length === 3 && point.every(Number.isFinite);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const subtract = (a, b) => a.map((n, i) => n - b[i]);
const clamp = n => Math.max(0, Math.min(1, n));

// 節点同士だけでなく線分全体を比較し、節点の間で交差する線も検出する。
function segmentDistance(a, b, c, d) {
  const u = subtract(b, a), v = subtract(d, c), w = subtract(a, c);
  const uu = dot(u, u), vv = dot(v, v), vw = dot(v, w), uw = dot(u, w), uv = dot(u, v);
  let s = 0, t = 0;
  if (uu <= 1e-12 && vv <= 1e-12) return Math.hypot(...w);
  if (uu <= 1e-12) t = clamp(vw / vv);
  else if (vv <= 1e-12) s = clamp(-uw / uu);
  else {
    const denominator = uu * vv - uv * uv;
    s = denominator > 1e-12 ? clamp((uv * vw - uw * vv) / denominator) : 0;
    t = (uv * s + vw) / vv;
    if (t < 0) { t = 0; s = clamp(-uw / uu); }
    else if (t > 1) { t = 1; s = clamp((uv - uw) / uu); }
  }
  return Math.hypot(...w.map((n, i) => n + u[i] * s - v[i] * t));
}

export function cableSeparation(target, others) {
  const validPath = path => path && Array.isArray(path.points) && path.points.length >= 2 && path.points.every(validPoint)
    && Array.isArray(path.radii) && path.radii.length === path.points.length && path.radii.every(n => Number.isFinite(n) && n > 0);
  if (!validPath(target) || !Array.isArray(others) || !others.length || !others.every(validPath)) return null;
  let clearance = Infinity;
  const contacts = [];
  for (const other of others) {
    let nearest = Infinity, index = 0;
    for (let i = 0; i < target.points.length - 1; i++) for (let j = 0; j < other.points.length - 1; j++) {
      const gap = segmentDistance(target.points[i], target.points[i + 1], other.points[j], other.points[j + 1])
        - Math.max(target.radii[i], target.radii[i + 1]) - Math.max(other.radii[j], other.radii[j + 1]);
      if (gap < nearest) { nearest = gap; index = i; }
    }
    clearance = Math.min(clearance, nearest);
    if (nearest < CABLE_CLEARANCE) contacts.push({ kind: other.kind, point: target.points[index].map((n, i) => (n + target.points[index + 1][i]) / 2) });
  }
  return { clearance, contacts };
}

function isSeparated(result) {
  return result?.kind === 'lan' && result.held === false && Number.isFinite(result.clearance) && result.clearance >= CABLE_CLEARANCE
    && Array.isArray(result.points) && result.points.length >= 12 && result.points.every(p => validPoint(p)
      && Math.abs(p[0]) <= WORKBENCH_BOUNDS.x && p[1] >= 0 && p[1] <= WORKBENCH_BOUNDS.height && Math.abs(p[2]) <= WORKBENCH_BOUNDS.z);
}

// 作業台の左右を問わず、線全体が離れて静止した場合に一度だけ取得できる。
export function isCableExtracted(result) {
  return isSeparated(result) && Number.isFinite(result.settledFor) && result.settledFor >= CABLE_SETTLE_SECONDS;
}

export function createExtractionTracker() {
  let previous = null, settledFor = 0;
  return {
    reset() { previous = null; settledFor = 0; },
    update(result, dt) {
      const comparable = previous && Array.isArray(result?.points) && previous.length === result.points.length;
      const moving = !comparable || result.points.some((p, i) => !validPoint(p) || Math.hypot(...subtract(p, previous[i])) > .22 * dt);
      if (!isSeparated(result) || !Number.isFinite(dt) || dt <= 0 || dt > .3 || moving) settledFor = 0;
      else {
        settledFor += Math.min(dt, .1);
        if (settledFor >= CABLE_SETTLE_SECONDS - 1e-9) settledFor = CABLE_SETTLE_SECONDS;
      }
      previous = Array.isArray(result?.points) && result.points.every(validPoint) ? result.points.map(p => [...p]) : null;
      return { ...result, settledFor };
    },
  };
}
