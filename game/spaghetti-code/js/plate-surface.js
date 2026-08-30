function smoothstep(value) {
  return value * value * (3 - 2 * value);
}

export function ellipseRadiusRatio(x, z, playArea) {
  return Math.hypot(x / playArea.radiusX, z / playArea.radiusZ);
}

export function plateSurfaceYAt(x, z, playArea, tableY) {
  const ratio = ellipseRadiusRatio(x, z, playArea);
  if (ratio > 1) return tableY;
  if (ratio <= playArea.wellRadiusRatio) return playArea.floorY;

  if (ratio <= playArea.rimRadiusRatio) {
    const progress = (ratio - playArea.wellRadiusRatio)
      / (playArea.rimRadiusRatio - playArea.wellRadiusRatio);
    return playArea.floorY
      + (playArea.rimY - playArea.floorY) * smoothstep(progress);
  }

  const progress = (ratio - playArea.rimRadiusRatio)
    / (1 - playArea.rimRadiusRatio);
  return playArea.rimY
    + (playArea.edgeY - playArea.rimY) * smoothstep(progress);
}

export function tableContactMetrics(ropes, playArea, tableY, tolerance = 0.006) {
  let maximumRatio = 0;
  let minimumTableClearance = Infinity;
  let nearestCableId = null;

  for (const rope of ropes) {
    for (const particle of rope.particles) {
      const ratio = ellipseRadiusRatio(particle.position.x, particle.position.z, playArea);
      maximumRatio = Math.max(maximumRatio, ratio);
      if (ratio <= 1) continue;

      const clearance = particle.position.y - particle.floorRadius - tableY;
      if (clearance >= minimumTableClearance) continue;
      minimumTableClearance = clearance;
      nearestCableId = rope.cableId;
    }
  }

  const touchingTable = minimumTableClearance <= tolerance;
  return {
    touchingTable,
    maximumRatio,
    minimumTableClearance: Number.isFinite(minimumTableClearance) ? minimumTableClearance : null,
    tableCableId: touchingTable ? nearestCableId : null,
  };
}
