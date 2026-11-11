const center = (tile, tileSize) => ({
  x: (tile.x + 0.5) * tileSize,
  y: (tile.y + 0.5) * tileSize,
});

export function findNearestInteraction(interactables, position, tileSize = 32) {
  let nearest = null;
  let nearestDistance = Number.POSITIVE_INFINITY;
  for (const item of interactables) {
    const point = center(item.positionTiles, tileSize);
    const distance = Math.hypot(position.x - point.x, position.y - point.y);
    if (distance <= item.radiusPx && distance < nearestDistance) {
      nearest = item;
      nearestDistance = distance;
    }
  }
  return nearest ? { interaction: nearest, distance: nearestDistance } : null;
}

export function getContainingFacility(roomTriggers, position, tileSize = 32) {
  const x = position.x / tileSize;
  const y = position.y / tileSize;
  return (
    roomTriggers.find(
      ({ boundsTiles }) =>
        x >= boundsTiles.x &&
        x < boundsTiles.x + boundsTiles.w &&
        y >= boundsTiles.y &&
        y < boundsTiles.y + boundsTiles.h,
    ) ?? null
  );
}
