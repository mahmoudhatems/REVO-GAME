import { describe, expect, it } from "vitest";
import {
  findNearestInteraction,
  getContainingFacility,
} from "../../src/features/world/application/interactionRegistry.js";

const points = [
  {
    id: "comm",
    facilityId: "communication",
    title: "COMM",
    positionTiles: { x: 10, y: 10 },
    radiusPx: 82,
  },
  {
    id: "solar",
    facilityId: "solar-arrays",
    title: "SOLAR",
    positionTiles: { x: 14, y: 10 },
    radiusPx: 82,
  },
];

describe("map interaction registration", () => {
  it("selects the nearest interaction only inside its reach radius", () => {
    expect(
      findNearestInteraction(points, { x: 10 * 32 + 16, y: 10 * 32 + 16 })
        ?.interaction.id,
    ).toBe("comm");
    expect(
      findNearestInteraction(points, { x: 12 * 32 + 16, y: 14 * 32 + 16 }),
    ).toBeNull();
  });

  it("finds the room trigger containing the player position", () => {
    const triggers = [
      {
        facilityId: "communication",
        boundsTiles: { x: 36, y: 13, w: 13, h: 9 },
      },
    ];
    expect(
      getContainingFacility(triggers, { x: 40 * 32, y: 18 * 32 })?.facilityId,
    ).toBe("communication");
    expect(
      getContainingFacility(triggers, { x: 60 * 32, y: 18 * 32 }),
    ).toBeNull();
  });
});
