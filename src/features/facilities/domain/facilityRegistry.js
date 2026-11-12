import mapData from "../../../data/maps/alpha-base-exterior.json";

const COMMUNICATION_ENTRANCE = Object.freeze({
  facilityId: "communication",
  name: "COMMUNICATION ROOM",
  interiorId: "communication-room",
  interactionId: "communication",
  doorPositionPx: Object.freeze({ x: 1360, y: 688 }),
  exitPositionPx: Object.freeze({ x: 1360, y: 720 }),
  interactionRadiusPx: 82,
});

export const FACILITY_REGISTRY = Object.freeze({
  communication: COMMUNICATION_ENTRANCE,
});

export function getExteriorFacilityEntrances(map = mapData) {
  return map.layers.Interactables.flatMap((interaction) => {
    const definition = FACILITY_REGISTRY[interaction.facilityId];
    if (!definition) return [];
    const tileSize = map.coordinateSystem.tileSizePx;
    return [
      {
        ...definition,
        name: map.facilities.find(({ id }) => id === definition.facilityId)
          ?.name,
        positionPx: {
          x: (interaction.positionTiles.x + 0.5) * tileSize,
          y: (interaction.positionTiles.y + 0.5) * tileSize,
        },
        radiusPx: Math.min(
          interaction.radiusPx,
          definition.interactionRadiusPx,
        ),
      },
    ];
  });
}

export function findNearestFacilityEntrance(entrances, position) {
  let nearest = null;
  let nearestDistance = Number.POSITIVE_INFINITY;
  for (const entrance of entrances) {
    const distance = Math.hypot(
      position.x - entrance.positionPx.x,
      position.y - entrance.positionPx.y,
    );
    if (distance <= entrance.radiusPx && distance < nearestDistance) {
      nearest = entrance;
      nearestDistance = distance;
    }
  }
  return nearest ? { entrance: nearest, distance: nearestDistance } : null;
}

export function createFacilityTransition(facilityId, returnContext) {
  const facility = FACILITY_REGISTRY[facilityId];
  if (!facility || !returnContext) return null;
  return {
    facilityId,
    interiorId: facility.interiorId,
    returnContext: {
      x: returnContext.x,
      y: returnContext.y,
      direction: returnContext.direction,
    },
  };
}
