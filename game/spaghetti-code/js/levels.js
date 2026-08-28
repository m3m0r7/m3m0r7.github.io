export const LEVEL_ORDER = ["easy", "normal", "hard", "extream", "ultimate", "unknown"];

export const LEVELS = Object.freeze({
  easy: { name: "EASY", count: 3, complexity: 2, note: "Three core products. Learn the pull.", patterns: ["figure8", "overhand", "birdnest", "helix"] },
  normal: { name: "NORMAL", count: 6, complexity: 3, note: "Six products share one tangled core.", patterns: ["figure8", "overhand", "birdnest", "helix", "cinquefoil", "coil"] },
  hard: { name: "HARD", count: 9, complexity: 4, note: "Nine adapters and branches tighten the center.", patterns: ["cinquefoil", "figure8", "overhand", "birdnest", "helix", "coil"] },
  extream: { name: "EXTREAM", count: 12, complexity: 5, note: "Twelve products. Friction compounds quickly.", patterns: ["cinquefoil", "birdnest", "figure8", "overhand", "helix", "coil"] },
  ultimate: { name: "ULTIMATE", count: 15, complexity: 6, note: "Fifteen products. Every pull moves the pile.", patterns: ["cinquefoil", "birdnest", "figure8", "overhand", "helix", "coil"] },
  unknown: { name: "UNKNOWN", count: 18, complexity: 7, note: "Eighteen products drift in zero gravity.", patterns: ["cinquefoil", "birdnest", "figure8", "overhand", "helix", "coil"] },
});
