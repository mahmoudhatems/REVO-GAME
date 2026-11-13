const REQUIRED_LAYERS = [
  "Ground",
  "GroundDetails",
  "Paths",
  "Buildings",
  "Walls",
  "Props",
  "SolarArrays",
  "Foreground",
  "Collision",
  "Interactables",
  "RoomTriggers",
];

const EXPECTED_FACILITIES = new Set([
  "communication",
  "solar-arrays",
  "power-control",
  "battery",
  "oxygen",
  "research",
  "greenhouse",
  "shelter",
  "airlock",
]);

export function validateMapData(map, catalog) {
  const errors = [];
  if (map?.schemaVersion !== 1) errors.push("schemaVersion must be 1");
  if (map?.dimensions?.widthTiles !== 80 || map?.dimensions?.heightTiles !== 45)
    errors.push("map dimensions must be 80 × 45 tiles");
  if (map?.coordinateSystem?.tileSizePx !== 32)
    errors.push("tileSizePx must be 32");

  const layerKeys = Object.keys(map?.layers ?? {});
  for (const layer of REQUIRED_LAYERS) {
    if (!layerKeys.includes(layer)) errors.push(`missing ${layer} layer`);
  }

  const facilities = map?.facilities ?? [];
  const facilityIds = facilities.map((facility) => facility.id);
  if (
    facilityIds.length !== EXPECTED_FACILITIES.size ||
    EXPECTED_FACILITIES.size !== new Set(facilityIds).size
  ) {
    errors.push(
      "map must define each of the nine approved facility IDs exactly once",
    );
  }
  for (const id of EXPECTED_FACILITIES) {
    if (!facilityIds.includes(id))
      errors.push(`missing approved facility: ${id}`);
  }

  const catalogByKey = new Map(
    catalog.map((asset) => [asset.semanticKey, asset]),
  );
  const mapAssetById = new Map(
    (map?.assets ?? []).map((asset) => [asset.assetId, asset]),
  );
  const scanReferences = (value, location = "map") => {
    if (Array.isArray(value)) {
      value.forEach((item, index) =>
        scanReferences(item, `${location}[${index}]`),
      );
    } else if (value && typeof value === "object") {
      if (value.assetKey || value.assetId) {
        const catalogAsset = catalogByKey.get(value.assetKey);
        if (
          !catalogAsset ||
          (value.assetId && catalogAsset.assetId !== value.assetId)
        )
          errors.push(`${location} has an invalid asset key/ID pair`);
        if (catalogAsset && !mapAssetById.has(catalogAsset.assetId))
          errors.push(`${location} asset is absent from map asset manifest`);
        if (catalogAsset?.visualClassification === "UNIDENTIFIED")
          errors.push(`${location} uses an UNIDENTIFIED asset`);
        if (
          catalogAsset &&
          value.licenseStatus &&
          value.licenseStatus !== catalogAsset.licenseStatus
        )
          errors.push(`${location} license status differs from the catalog`);
      }
      for (const [key, child] of Object.entries(value)) {
        if (key !== "assets") scanReferences(child, `${location}.${key}`);
      }
    }
  };
  scanReferences(map);

  const interactables = map?.layers?.Interactables ?? [];
  const triggers = map?.layers?.RoomTriggers ?? [];
  if (interactables.length !== EXPECTED_FACILITIES.size)
    errors.push("exactly nine facility interactables must be registered");
  if (
    new Set(interactables.map((item) => item.facilityId)).size !==
    EXPECTED_FACILITIES.size
  )
    errors.push("facility interactables must have unique facility IDs");
  for (const id of EXPECTED_FACILITIES) {
    if (!interactables.some((item) => item.facilityId === id))
      errors.push(`missing interaction registration for ${id}`);
    if (!triggers.some((item) => item.facilityId === id))
      errors.push(`missing room trigger for ${id}`);
  }

  if (map?.energyArchitecture?.externalNuclearReactor !== false)
    errors.push("external nuclear reactor must remain disabled");
  if (facilities.find((facility) => facility.id === "battery")?.assetId)
    errors.push(
      "battery art must remain a labeled placeholder until dedicated art is approved",
    );
  if (facilities.find((facility) => facility.id === "oxygen")?.assetId)
    errors.push(
      "oxygen equipment must remain a labeled placeholder until dedicated art is approved",
    );
  if (!map?.playerSpawn?.tile) errors.push("playerSpawn.tile is required");

  const bounds = map?.dimensions ?? {};
  for (const blocker of map?.layers?.Collision ?? []) {
    if (
      ![blocker.x, blocker.y, blocker.width, blocker.height].every(
        Number.isFinite,
      ) ||
      blocker.width <= 0 ||
      blocker.height <= 0
    ) {
      errors.push(`collision ${blocker.id} has invalid pixel bounds`);
    } else if (
      blocker.x < 0 ||
      blocker.y < 0 ||
      blocker.x + blocker.width > bounds.widthPx ||
      blocker.y + blocker.height > bounds.heightPx
    ) {
      errors.push(`collision ${blocker.id} falls outside the map`);
    }
  }
  for (const route of map?.layers?.Paths ?? []) {
    if (route.waypointsTiles.length < 2)
      errors.push(`path ${route.id} needs at least two waypoints`);
    for (const [x, y] of route.waypointsTiles) {
      if (x < 0 || y < 0 || x >= bounds.widthTiles || y >= bounds.heightTiles)
        errors.push(`path ${route.id} waypoint is outside the map`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export { REQUIRED_LAYERS, EXPECTED_FACILITIES };
