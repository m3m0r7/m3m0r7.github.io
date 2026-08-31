export const LEVEL_ORDER = Object.freeze(["easy", "normal", "hard", "extream", "ultimate", "unknown"]);
export const SPECIAL_LEVEL_KEY = "special";

export const LEVELS = Object.freeze({
  easy: {
    name: "EASY",
    caseLabel: "INBOX OVERFLOW",
    count: 10,
    deskWasteCount: 1,
    binCapacity: 20,
    feedLimit: 4,
    jamLimit: 4.6,
    processSpeed: 1,
  },
  normal: {
    name: "NORMAL",
    caseLabel: "QUARTERLY ARCHIVE",
    count: 18,
    deskWasteCount: 2,
    binCapacity: 26,
    feedLimit: 4,
    jamLimit: 4.6,
    processSpeed: 0.94,
  },
  hard: {
    name: "HARD",
    caseLabel: "OFFICE RELOCATION",
    count: 30,
    deskWasteCount: 4,
    binCapacity: 32,
    feedLimit: 4,
    jamLimit: 4.6,
    processSpeed: 0.88,
  },
  extream: {
    name: "EXTREAM",
    caseLabel: "YEAR-END PURGE",
    count: 38,
    deskWasteCount: 5,
    binCapacity: 38,
    feedLimit: 4,
    jamLimit: 4.6,
    processSpeed: 0.84,
  },
  ultimate: {
    name: "ULTIMATE",
    caseLabel: "CORPORATE ARCHIVE",
    count: 47,
    deskWasteCount: 6,
    binCapacity: 44,
    feedLimit: 4,
    jamLimit: 4.6,
    processSpeed: 0.8,
  },
  unknown: {
    name: "UNKNOWN",
    caseLabel: "CLASSIFIED FLOOR",
    count: 57,
    deskWasteCount: 7,
    binCapacity: 50,
    feedLimit: 4,
    jamLimit: 4.6,
    processSpeed: 0.76,
  },
  special: {
    name: "SPECIAL",
    caseLabel: "PERFECT OPERATOR",
    count: 33,
    deskWasteCount: 4,
    binCapacity: 32,
    feedLimit: 4,
    jamLimit: 4.6,
    processSpeed: 0.86,
  },
});

export const DOCUMENT_TYPES = Object.freeze({
  document: {
    label: "書類",
    shortLabel: "DOCUMENT",
    size: [1.28, 1.82],
    stiffness: 0.18,
    feedUnits: 1,
    duration: 1380,
    colors: ["#f4f0e8", "#e9f1f2", "#f3eee0"],
    accent: "#315b6f",
  },
  letter: {
    label: "手紙",
    shortLabel: "LETTER",
    size: [1.2, 1.7],
    stiffness: 0.12,
    feedUnits: 1,
    duration: 1300,
    colors: ["#f5ecd9", "#eee0c8", "#f8f1e4"],
    accent: "#9b4242",
  },
  note: {
    label: "メモ",
    shortLabel: "NOTE",
    size: [0.92, 1.08],
    stiffness: 0.08,
    feedUnits: 0.72,
    duration: 920,
    colors: ["#f4e98a", "#dce9ad", "#f3d6b2"],
    accent: "#74652a",
  },
  receipt: {
    label: "レシート",
    shortLabel: "RECEIPT",
    size: [0.68, 1.66],
    stiffness: 0.05,
    feedUnits: 0.62,
    duration: 880,
    colors: ["#edf0e8", "#f4f1e8"],
    accent: "#515850",
  },
  envelope: {
    label: "茶封筒",
    shortLabel: "KRAFT ENVELOPE",
    size: [1.44, 0.92],
    stiffness: 0.58,
    feedUnits: 1.55,
    duration: 1620,
    colors: ["#bd8954", "#c99a64", "#ad7848"],
    accent: "#604025",
  },
  "business-card": {
    label: "名刺",
    shortLabel: "BUSINESS CARD",
    size: [0.88, 0.52],
    stiffness: 0.96,
    feedUnits: 1.35,
    duration: 780,
    colors: ["#f7f7f1", "#dce5e8", "#e5e1dc"],
    accent: "#223b45",
    rigid: true,
  },
  photo: {
    label: "写真",
    shortLabel: "PHOTO",
    size: [1.02, 1.26],
    stiffness: 0.88,
    feedUnits: 1.7,
    duration: 1480,
    colors: ["#dce3dc", "#e7ded4"],
    accent: "#254b41",
    rigid: true,
  },
  folded: {
    label: "二つ折りの紙",
    shortLabel: "FOLDED PAPER",
    size: [1.16, 0.9],
    stiffness: 0.72,
    feedUnits: 2.15,
    duration: 1780,
    colors: ["#ded8c9", "#e8e0cf"],
    accent: "#6f5643",
  },
  "credit-card": {
    label: "クレジットカード",
    shortLabel: "CREDIT CARD",
    size: [0.88, 0.55],
    stiffness: 1,
    feedUnits: 2.35,
    duration: 1380,
    colors: ["#dbe9f2", "#c7d8ea", "#d9d4ed"],
    accent: "#275f91",
    rigid: true,
    thickness: 0.055,
  },
  stapled: {
    label: "ホッチキス書類",
    shortLabel: "STAPLED FILE",
    size: [1.3, 1.84],
    stiffness: 0.68,
    feedUnits: 3.05,
    preparedFeedUnits: 2.7,
    duration: 1920,
    colors: ["#f3f6f7", "#e8f0f5", "#f1eee6"],
    accent: "#376e95",
    rigid: true,
    thickness: 0.075,
    binUnits: 3,
    prepAction: "unstaple",
    prepSteps: 1,
  },
  book: {
    label: "本",
    shortLabel: "OFFICE HANDBOOK",
    size: [1.35, 1.82],
    stiffness: 0.96,
    feedUnits: 9,
    preparedFeedUnits: 2.65,
    duration: 2240,
    colors: ["#4d91bd", "#5c83ad", "#3f769c"],
    accent: "#e8f6ff",
    rigid: true,
    thickness: 0.22,
    binUnits: 4,
    prepAction: "tear",
    prepSteps: 4,
  },
  dictionary: {
    label: "辞書",
    shortLabel: "OFFICE DICTIONARY",
    size: [1.5, 2.02],
    stiffness: 0.99,
    feedUnits: 14,
    preparedFeedUnits: 3.35,
    duration: 2860,
    colors: ["#235275", "#356989", "#294a68"],
    accent: "#f1d9a7",
    rigid: true,
    thickness: 0.34,
    binUnits: 6,
    prepAction: "tear",
    prepSteps: 6,
  },
});

export const DESK_WASTE_TYPES = Object.freeze({
  "pen-black": { kind: "pen", variant: "click", label: "黒ボールペン", color: "#243746", accent: "#a9bac5", jamLoad: 2.1 },
  "pen-blue": { kind: "pen", variant: "grip", label: "青ボールペン", color: "#2876a8", accent: "#d8edf7", jamLoad: 2.1 },
  "pen-red": { kind: "pen", variant: "cap", label: "赤ボールペン", color: "#d84d59", accent: "#f6dce0", jamLoad: 2.2 },
  "pen-multicolor": { kind: "pen", variant: "multi", label: "多色ボールペン", color: "#e8edf0", accent: "#285777", jamLoad: 2.5 },
  ruler: { kind: "ruler", label: "定規", color: "#e5c84e", accent: "#5e5426", jamLoad: 3.1 },
  stamp: { kind: "stamp", label: "ハンコ", color: "#b84242", accent: "#f1d3b0", jamLoad: 4.8 },
  stapler: { kind: "stapler", label: "ホッチキス本体", color: "#2f698e", accent: "#d6e9f2", jamLoad: 7.2 },
  "hole-punch": { kind: "hole-punch", label: "穴あけパンチ", color: "#48616e", accent: "#cfdce2", jamLoad: 9.4 },
});

const DESK_WASTE_POOL = Object.freeze([
  "pen-black",
  "pen-blue",
  "pen-red",
  "pen-multicolor",
  "ruler",
  "stamp",
  "stapler",
  "hole-punch",
]);

const DESK_WASTE_SPOTS = Object.freeze([
  [-7.25, 0.55], [-5.8, 1.85], [-4.2, 4.95], [-2.55, 3.2], [-0.7, 5.45], [1.35, 2.55],
  [2.75, 4.95], [4.35, 3.65], [6.05, 4.8], [7.4, 2.05], [-7.15, 4.1], [-5.0, 3.45],
  [-3.1, 5.55], [-1.35, 1.65], [1.05, 5.35], [3.25, 2.15], [5.45, 5.25], [7.25, 3.85],
  [-6.35, 5.35], [-3.8, 2.05], [2.1, 3.8], [6.65, 1.05],
]);

const LEVEL_DOCUMENT_POOLS = Object.freeze({
  easy: [
    "document", "letter", "document", "note", "receipt", "envelope", "business-card", "letter", "document", "stapled",
    "credit-card", "document", "book", "receipt", "envelope", "note", "stapled", "business-card", "document", "letter",
  ],
  normal: [
    "document", "letter", "receipt", "document", "envelope", "stapled", "credit-card", "document",
    "letter", "photo", "receipt", "book", "envelope", "note", "business-card", "folded", "document", "dictionary",
    "stapled", "letter", "credit-card", "document", "book", "receipt", "envelope",
  ],
  hard: [
    "document", "stapled", "receipt", "envelope", "credit-card", "document", "dictionary", "note",
    "photo", "letter", "book", "document", "envelope", "business-card", "folded", "stapled",
    "note", "photo", "letter", "receipt", "credit-card", "dictionary", "document", "book",
    "envelope", "stapled", "receipt", "folded", "business-card", "document",
  ],
  extream: [
    "stapled", "document", "dictionary", "envelope", "credit-card", "folded", "book", "receipt",
    "stapled", "photo", "document", "letter", "dictionary", "business-card", "envelope", "folded",
    "book", "stapled", "note", "credit-card", "document", "receipt", "photo", "letter",
  ],
  ultimate: [
    "dictionary", "stapled", "book", "folded", "credit-card", "document", "envelope", "stapled",
    "photo", "dictionary", "receipt", "book", "document", "business-card", "folded", "stapled",
    "envelope", "credit-card", "letter", "dictionary", "document", "book", "note", "stapled",
  ],
  unknown: [
    "dictionary", "stapled", "document", "book", "credit-card", "folded", "dictionary", "envelope",
    "stapled", "photo", "letter", "book", "receipt", "document", "business-card", "stapled",
    "dictionary", "credit-card", "folded", "envelope", "book", "document", "stapled", "note",
  ],
  special: [
    "document", "letter", "receipt", "envelope", "business-card", "photo", "folded", "credit-card",
    "stapled", "book", "dictionary", "document", "note", "envelope", "stapled", "credit-card",
  ],
});

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

export function createDocumentPlan(levelKey, seed) {
  const level = LEVELS[levelKey];
  const pool = LEVEL_DOCUMENT_POOLS[levelKey];
  if (!level || !pool) throw new Error(`Unknown level: ${levelKey}`);

  const rng = createRng(seed + level.count * 7919);
  const shuffled = Array.from({ length: level.count }, (_, index) => ({
    typeKey: pool[index % pool.length],
    sourceIndex: index,
  }));
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  const clutterZones = [
    { x: -5.4, z: 0.7, radiusX: 2.55, radiusZ: 2.4 },
    { x: 4.65, z: 1.75, radiusX: 2.6, radiusZ: 2.15 },
    { x: -3.75, z: 4.3, radiusX: 2.45, radiusZ: 1.55 },
    { x: 2.45, z: 4.8, radiusX: 3.1, radiusZ: 1.1 },
    { x: -0.65, z: 2.85, radiusX: 2.25, radiusZ: 1.7 },
    { x: 6.2, z: 4.55, radiusX: 1.55, radiusZ: 1.15 },
  ];
  const moundHeight = {
    easy: 0.3,
    normal: 0.44,
    hard: 0.62,
    extream: 0.74,
    ultimate: 0.84,
    unknown: 0.94,
    special: 0.72,
  }[levelKey];

  return shuffled.map(({ typeKey }, index) => {
    const type = DOCUMENT_TYPES[typeKey];
    const zone = clutterZones[Math.floor(rng() * clutterZones.length)];
    const looseDocument = rng() < 0.22;
    const denseRadius = Math.pow(rng(), 2.15);
    const angle = rng() * Math.PI * 2;
    let x = looseDocument
      ? (rng() - 0.5) * 15.2
      : zone.x + Math.cos(angle) * zone.radiusX * denseRadius + (rng() - 0.5) * 0.38;
    const z = looseDocument
      ? -0.35 + rng() * 5.9
      : zone.z + Math.sin(angle) * zone.radiusZ * denseRadius + (rng() - 0.5) * 0.34;
    if (Math.abs(x) < 2.35 && z < 0.8) x = Math.sign(x || rng() - 0.5) * (2.35 + rng() * 0.7);
    const secretEligible = ["document", "letter", "folded", "stapled"].includes(typeKey);
    return {
      id: `document-${index + 1}`,
      index,
      typeKey,
      ...type,
      color: type.colors[Math.floor(rng() * type.colors.length)],
      rotation: (rng() - 0.5) * Math.PI * 2,
      pileHeight: looseDocument ? rng() * 0.035 : Math.pow(1 - denseRadius, 2) * moundHeight + rng() * 0.035,
      isSecret: secretEligible && (
        levelKey === "unknown" || index % 13 === 0 || rng() < (levelKey === SPECIAL_LEVEL_KEY ? 0.28 : 0.16)
      ),
      position: {
        x: Math.min(8.15, Math.max(-8.15, x)),
        z: Math.min(5.75, Math.max(-0.95, z)),
      },
    };
  });
}

export function getLevelTotalCount(levelKey) {
  const level = LEVELS[levelKey];
  return level ? level.count + level.deskWasteCount : 0;
}

export function createDeskWastePlan(levelKey, seed) {
  const level = LEVELS[levelKey];
  if (!level) throw new Error(`Unknown level: ${levelKey}`);
  const rng = createRng((seed ^ 0x51f15e5d) + level.deskWasteCount * 3571);
  const definitions = Array.from({ length: level.deskWasteCount }, (_, index) => {
    const typeKey = DESK_WASTE_POOL[index % DESK_WASTE_POOL.length];
    const type = DESK_WASTE_TYPES[typeKey];
    const spot = DESK_WASTE_SPOTS[index % DESK_WASTE_SPOTS.length];
    const pileBase = {
      easy: 0.14,
      normal: 0.2,
      hard: 0.28,
      extream: 0.34,
      ultimate: 0.4,
      unknown: 0.46,
      special: 0.32,
    }[levelKey];
    return {
      id: `desk-waste-${index + 1}`,
      index,
      typeKey,
      ...type,
      position: {
        x: spot[0] + (rng() - 0.5) * 0.52,
        y: pileBase + rng() * 0.16,
        z: spot[1] + (rng() - 0.5) * 0.42,
      },
      rotation: rng() * Math.PI * 2,
      scale: 0.9 + rng() * 0.18,
    };
  });
  for (let index = definitions.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [definitions[index], definitions[swapIndex]] = [definitions[swapIndex], definitions[index]];
  }
  return definitions;
}

export function calculateAngleThicknessMultiplier(angle = 0) {
  return 1 + Math.sin(Math.abs(angle)) ** 2 * 0.55;
}

export function calculateBundleLoad(documents, angles = []) {
  return documents.reduce((total, document, index) => (
    total + document.feedUnits * calculateAngleThicknessMultiplier(angles[index] ?? 0)
  ), 0);
}
