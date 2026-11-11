import { describe, expect, it } from "vitest";
import map from "../../src/data/maps/alpha-base-exterior.json";
import catalog from "../../src/data/assets/asset-catalog.json";
import {
  EXPECTED_FACILITIES,
  REQUIRED_LAYERS,
  validateMapData,
} from "../../src/features/world/data/mapSchema.js";

describe("Alpha Base exterior map data", () => {
  it("satisfies the map schema and uses catalog asset keys", () => {
    const result = validateMapData(map, catalog);
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it("contains all separate rendering and gameplay layers", () => {
    expect(Object.keys(map.layers)).toEqual(
      expect.arrayContaining(REQUIRED_LAYERS),
    );
    expect(map.layers.SolarArrays).toHaveLength(3);
    expect(map.layers.Collision.length).toBeGreaterThan(50);
    expect(map.layers.Paths).toHaveLength(6);
  });

  it("registers one interaction and room trigger for all approved facilities", () => {
    expect(map.facilities).toHaveLength(EXPECTED_FACILITIES.size);
    expect(map.layers.Interactables).toHaveLength(EXPECTED_FACILITIES.size);
    expect(
      new Set(map.layers.Interactables.map(({ facilityId }) => facilityId))
        .size,
    ).toBe(EXPECTED_FACILITIES.size);
    expect(map.layers.RoomTriggers).toHaveLength(EXPECTED_FACILITIES.size);
  });

  it("keeps missing battery and oxygen system art as explicit placeholders", () => {
    expect(map.facilities.find(({ id }) => id === "battery")).toMatchObject({
      assetId: null,
      artStatus: "labeled-placeholder",
    });
    expect(map.facilities.find(({ id }) => id === "oxygen")).toMatchObject({
      assetId: null,
      artStatus: "labeled-placeholder",
    });
    expect(map.energyArchitecture.externalNuclearReactor).toBe(false);
  });

  it("marks every catalog asset as a candidate or visually confirmed and never unidentified", () => {
    for (const asset of map.assets) {
      expect(asset.visualClassification).not.toBe("UNIDENTIFIED");
      expect(asset.licenseStatus).toBe("UNVERIFIED");
    }
  });
});
