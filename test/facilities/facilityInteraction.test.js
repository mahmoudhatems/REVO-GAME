import { describe, expect, it } from "vitest";
import map from "../../src/data/maps/alpha-base-exterior.json";
import layout from "../../src/data/interiors/communication-room.json";
import catalog from "../../src/data/assets/asset-catalog.json";
import {
  createFacilityTransition,
  findNearestFacilityEntrance,
  getExteriorFacilityEntrances,
} from "../../src/features/facilities/domain/facilityRegistry.js";
import { validateInteriorLayout } from "../../src/features/facilities/domain/interiorSchema.js";

describe("Communication Room facility flow", () => {
  it("offers only the nearest registered entrance within its radius", () => {
    const entrances = getExteriorFacilityEntrances(map);
    expect(entrances).toHaveLength(1);
    expect(
      findNearestFacilityEntrance(entrances, { x: 1360, y: 720 })?.entrance
        .facilityId,
    ).toBe("communication");
    expect(
      findNearestFacilityEntrance(entrances, { x: 1360, y: 900 }),
    ).toBeNull();
  });

  it("captures exact exterior return position and facing direction", () => {
    expect(
      createFacilityTransition("communication", {
        x: 1364,
        y: 721,
        direction: "left",
      }),
    ).toEqual({
      facilityId: "communication",
      interiorId: "communication-room",
      returnContext: { x: 1364, y: 721, direction: "left" },
    });
    expect(
      createFacilityTransition("oxygen", { x: 1, y: 2, direction: "up" }),
    ).toBeNull();
  });

  it("validates the JSON layout, catalog references, and required interactions", () => {
    expect(validateInteriorLayout(layout, catalog)).toEqual({
      valid: true,
      errors: [],
    });
  });

  it("keeps the interior entry spawn outside the immediate exit prompt radius", () => {
    expect(
      validateInteriorLayout({ ...layout, entry: { ...layout.exit } }, catalog)
        .errors,
    ).toContain(
      "entry spawn must not start inside the exit interaction radius",
    );
  });

  it("keeps a walk-through in the south wall for the registered entrance", () => {
    const walls = map.layers.Collision.filter((item) =>
      item.id.startsWith("communication-south-wall"),
    );
    expect(walls).toHaveLength(2);
    expect(walls.map(({ x, width }) => [x, width])).toEqual([
      [1152, 160],
      [1408, 160],
    ]);
  });

  it("keeps the approved southern airlock entrance traversable", () => {
    const airlockSouthWall = map.layers.Collision.filter(({ id }) =>
      id.startsWith("wall-44-"),
    );
    expect(airlockSouthWall.map(({ x, width }) => [x, width])).toEqual([
      [1216, 128],
      [1408, 128],
    ]);
  });
});
