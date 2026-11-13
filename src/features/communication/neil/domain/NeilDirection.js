export const NEIL_DIRECTIONS = Object.freeze([
  "south",
  "west",
  "east",
  "north",
]);

const DIRECTION_VECTORS = Object.freeze({
  south: { x: 0, y: 1 },
  west: { x: -1, y: 0 },
  east: { x: 1, y: 0 },
  north: { x: 0, y: -1 },
});

const PLAYER_DIRECTIONS = Object.freeze({
  up: "north",
  down: "south",
  left: "west",
  right: "east",
});

export function normalizeNeilDirection(direction) {
  return (
    PLAYER_DIRECTIONS[direction] ??
    (DIRECTION_VECTORS[direction] ? direction : "south")
  );
}

export function directionFromVector(x, y, current = "south", threshold = 5) {
  if (Math.abs(x) < threshold && Math.abs(y) < threshold) return current;
  if (Math.abs(x) > Math.abs(y)) return x < 0 ? "west" : "east";
  return y < 0 ? "north" : "south";
}

export function vectorForDirection(direction) {
  return DIRECTION_VECTORS[normalizeNeilDirection(direction)];
}

export function directionToward(from, to) {
  return directionFromVector(to.x - from.x, to.y - from.y);
}
