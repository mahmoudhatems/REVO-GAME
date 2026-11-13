import {
  directionFromVector,
  vectorForDirection,
} from "../domain/NeilDirection.js";
import { NEIL_STATE } from "../domain/NeilState.js";

export const NEIL_FOLLOW_DISTANCE = 96;
export const NEIL_FOLLOW_DEAD_ZONE = 12;
export const NEIL_MIN_PLAYER_GAP = 72;
export const NEIL_MAX_SPEED = 118;

const distanceBetween = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function isReserved(point, reservedPoints) {
  return reservedPoints.some(
    (reserved) => distanceBetween(point, reserved) < reserved.radius,
  );
}

export function getFollowTarget(player, playerDirection, reservedPoints = []) {
  const direction = vectorForDirection(playerDirection);
  const back = {
    x: player.x - direction.x * NEIL_FOLLOW_DISTANCE,
    y: player.y - direction.y * NEIL_FOLLOW_DISTANCE,
  };
  if (!isReserved(back, reservedPoints)) return back;

  const perpendicular = { x: -direction.y, y: direction.x };
  const alternatives = [1, -1].map((side) => ({
    x:
      player.x -
      direction.x * NEIL_FOLLOW_DISTANCE +
      perpendicular.x * 56 * side,
    y:
      player.y -
      direction.y * NEIL_FOLLOW_DISTANCE +
      perpendicular.y * 56 * side,
  }));
  return (
    alternatives.find((point) => !isReserved(point, reservedPoints)) ?? null
  );
}

export function getFollowCommand({
  companion,
  velocity = { x: 0, y: 0 },
  player,
  playerDirection,
  deltaMs,
  reservedPoints = [],
  isTalking = false,
  currentDirection = "south",
}) {
  if (isTalking) {
    return {
      velocity: { x: 0, y: 0 },
      direction: directionToward(companion, player),
      state: NEIL_STATE.TALKING,
    };
  }

  const target = getFollowTarget(player, playerDirection, reservedPoints);
  if (!target) {
    return {
      velocity: { x: 0, y: 0 },
      direction: directionFromVector(velocity.x, velocity.y, currentDirection),
      state: NEIL_STATE.IDLE,
    };
  }

  const dx = target.x - companion.x;
  const dy = target.y - companion.y;
  const distance = Math.hypot(dx, dy);
  const desiredSpeed =
    distance <= NEIL_FOLLOW_DEAD_ZONE
      ? 0
      : Math.min(
          NEIL_MAX_SPEED,
          Math.max(0, distance - NEIL_FOLLOW_DEAD_ZONE) * 2.2,
        );
  const desired =
    desiredSpeed === 0
      ? { x: 0, y: 0 }
      : {
          x: (dx / distance) * desiredSpeed,
          y: (dy / distance) * desiredSpeed,
        };
  const blend = Math.min(1, Math.max(0, deltaMs) / 180);
  const nextVelocity = {
    x: velocity.x + (desired.x - velocity.x) * blend,
    y: velocity.y + (desired.y - velocity.y) * blend,
  };

  return {
    target,
    velocity: nextVelocity,
    direction: directionFromVector(
      nextVelocity.x,
      nextVelocity.y,
      currentDirection,
    ),
    state: desiredSpeed === 0 ? NEIL_STATE.IDLE : NEIL_STATE.FOLLOWING,
  };
}

function directionToward(from, to) {
  return directionFromVector(to.x - from.x, to.y - from.y);
}

export function getInitialNeilPosition(player, facing = "north") {
  const direction = vectorForDirection(facing);
  return {
    x: player.x - direction.x * 88 + direction.y * 28,
    y: player.y - direction.y * 88 - direction.x * 28,
  };
}
