import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const catalog = JSON.parse(
  fs.readFileSync(
    path.join(root, "src/data/assets/asset-catalog.json"),
    "utf8",
  ),
);
const blueprint = JSON.parse(
  fs.readFileSync(
    path.join(root, "docs/asset-review/alpha-base-exterior-blueprint.json"),
    "utf8",
  ),
);
const byId = new Map(catalog.map((asset) => [asset.assetId, asset]));
const tile = 32;
const selected = new Set();

const assetRef = (id) => {
  const asset = byId.get(id);
  if (!asset) throw new Error(`Missing asset catalog record: ${id}`);
  selected.add(id);
  return {
    assetId: asset.assetId,
    assetKey: asset.semanticKey,
    sourceFolder: asset.sourceFolder,
    runtimePath: `assets/map/${asset.assetId}.png`,
    dimensionsPx: asset.dimensions,
    category: asset.category,
    visualClassification: asset.visualClassification,
    licenseStatus: asset.licenseStatus,
  };
};

const roomPresentation = {
  "solar-arrays": { label: "EXTERNAL SOLAR ARRAYS", assetId: null },
  shelter: {
    label: "RADIATION SHELTER",
    placeholder: "SHELTER MODULE ART NEEDED",
  },
  oxygen: {
    label: "OXYGEN GENERATION / LIFE SUPPORT",
    placeholder: "OXYGEN SYSTEM ART NEEDED",
  },
  communication: {
    label: "CENTRAL COMMUNICATION ROOM",
    assetId: "BLD-0001",
    placeholder: "N.E.I.L. TERMINAL ART NEEDED",
  },
  "power-control": { label: "INDOOR POWER CONTROL", assetId: "BLD-0004" },
  battery: {
    label: "INDOOR BATTERY STORAGE",
    placeholder: "DEDICATED BATTERY ART NEEDED",
  },
  research: { label: "RESEARCH LAB", assetId: "BLD-0005" },
  greenhouse: { label: "GREENHOUSE", assetId: "BLD-0003" },
  airlock: {
    label: "SOUTHERN ENTRANCE / AIRLOCK",
    assetId: "DOR-0009",
    placeholder: "AIRLOCK STATE ART NEEDS REVIEW",
  },
};

const facilities = blueprint.facilities.map((facility) => {
  const presentation = roomPresentation[facility.id];
  if (!presentation)
    throw new Error(`No presentation metadata for facility: ${facility.id}`);
  return {
    id: facility.id,
    name: presentation.label,
    boundsTiles: facility.boundsTiles,
    interactionPointTiles:
      facility.id === "shelter"
        ? { x: 24, y: 19 }
        : facility.id === "communication"
          ? { x: 42, y: 22 }
          : facility.id === "power-control"
            ? { x: 53, y: 21 }
            : facility.id === "solar-arrays"
              ? { x: 66, y: 14 }
              : facility.id === "research"
                ? { x: 31, y: 25 }
                : facility.id === "greenhouse"
                  ? { x: 59, y: 23 }
                  : facility.id === "airlock"
                    ? { x: 43, y: 39 }
                    : facility.interactionPointTiles,
    doorways:
      facility.id === "airlock"
        ? [
            {
              edge: "south",
              offsetTiles: 4,
              widthTiles: 2,
              status: "proposed-opening",
            },
          ]
        : facility.doorways,
    assetId: presentation.assetId ?? null,
    assetKey: presentation.assetId
      ? assetRef(presentation.assetId).assetKey
      : null,
    visualClassification: presentation.assetId
      ? byId.get(presentation.assetId).visualClassification
      : "PLACEHOLDER",
    placeholder: presentation.placeholder ?? null,
    artStatus: presentation.assetId ? "candidate-art" : "labeled-placeholder",
    licenseStatus: presentation.assetId
      ? byId.get(presentation.assetId).licenseStatus
      : "not-applicable",
  };
});

const wallAsset = assetRef("WAL-0002");
const cornerAsset = assetRef("WAL-0003");
const doorAsset = assetRef("DOR-0005");
const facilitiesWithoutOutdoorZone = facilities.filter(
  (facility) => facility.id !== "solar-arrays",
);
const wallSegments = [];
for (const facility of facilitiesWithoutOutdoorZone) {
  const { x, y, w, h } = facility.boundsTiles;
  const gaps = new Map(
    facility.doorways.map((door) => [door.edge, door.offsetTiles]),
  );
  for (let offset = 0; offset < w; offset += 1) {
    if (
      ["north", "south"].some(
        (edge) =>
          gaps.has(edge) &&
          offset >= gaps.get(edge) &&
          offset < gaps.get(edge) + 2,
      )
    )
      continue;
    for (const edge of ["north", "south"]) {
      const corner = offset === 0 || offset === w - 1;
      wallSegments.push({
        facilityId: facility.id,
        edge,
        x: x + offset,
        y: edge === "north" ? y : y + h - 1,
        ...(corner ? cornerAsset : wallAsset),
        corner,
      });
    }
  }
  for (let offset = 1; offset < h - 1; offset += 1) {
    if (
      ["west", "east"].some(
        (edge) =>
          gaps.has(edge) &&
          offset >= gaps.get(edge) &&
          offset < gaps.get(edge) + 2,
      )
    )
      continue;
    for (const edge of ["west", "east"]) {
      wallSegments.push({
        facilityId: facility.id,
        edge,
        x: edge === "west" ? x : x + w - 1,
        y: y + offset,
        ...wallAsset,
      });
    }
  }
  for (const door of facility.doorways) {
    const visualDoor = assetRef(
      facility.id === "airlock" ? "DOR-0009" : "DOR-0005",
    );
    const position =
      door.edge === "north"
        ? { x: x + door.offsetTiles + 1, y }
        : door.edge === "south"
          ? { x: x + door.offsetTiles + 1, y: y + h - 1 }
          : door.edge === "west"
            ? { x, y: y + door.offsetTiles + 1 }
            : { x: x + w - 1, y: y + door.offsetTiles + 1 };
    wallSegments.push({
      facilityId: facility.id,
      edge: door.edge,
      ...position,
      rotation: ["west", "east"].includes(door.edge) ? 90 : 0,
      ...visualDoor,
      isDoor: true,
    });
  }
}

const rockPositions = [
  [4, 7, "GTS-1497"],
  [12, 11, "GTS-1498"],
  [7, 25, "GTS-1499"],
  [13, 35, "GTS-1500"],
  [5, 38, "GTS-1501"],
  [74, 34, "GTS-1502"],
  [77, 8, "GTS-1499"],
  [58, 5, "GTS-1497"],
  [20, 5, "GTS-1501"],
  [28, 7, "GTS-1502"],
  [53, 7, "GTS-1498"],
  [75, 41, "GTS-1500"],
  [3, 17, "GTS-1498"],
  [10, 4, "GTS-1502"],
  [72, 16, "GTS-1497"],
  [16, 40, "GTS-1501"],
  [56, 36, "GTS-1499"],
  [70, 38, "GTS-1502"],
  [5, 31, "GTS-1497"],
  [79, 23, "GTS-1500"],
];

const props = [
  {
    id: "communication-workstation-candidate",
    assetId: "EQP-0058",
    x: 44,
    y: 17,
    facilityId: "communication",
  },
  {
    id: "communication-display-candidate",
    assetId: "EQP-0055",
    x: 39,
    y: 18,
    facilityId: "communication",
  },
  {
    id: "communication-dish-candidate",
    assetId: "EQP-0063",
    x: 47,
    y: 14,
    facilityId: "communication",
  },
  {
    id: "power-control-console-candidate",
    assetId: "EQP-0004",
    x: 54,
    y: 17,
    facilityId: "power-control",
  },
  {
    id: "greenhouse-tray-1-candidate",
    assetId: "EQP-0045",
    x: 63,
    y: 23,
    facilityId: "greenhouse",
  },
  {
    id: "greenhouse-tray-2-candidate",
    assetId: "EQP-0046",
    x: 66,
    y: 23,
    facilityId: "greenhouse",
  },
  {
    id: "greenhouse-tray-3-candidate",
    assetId: "EQP-0047",
    x: 63,
    y: 25,
    facilityId: "greenhouse",
  },
  {
    id: "greenhouse-tray-4-candidate",
    assetId: "EQP-0048",
    x: 66,
    y: 25,
    facilityId: "greenhouse",
  },
  {
    id: "radiation-symbol-candidate",
    assetId: "UIC-0015",
    x: 19,
    y: 16,
    facilityId: "shelter",
  },
  {
    id: "oxygen-sign-candidate",
    assetId: "UIC-0011",
    x: 28,
    y: 16,
    facilityId: "oxygen",
  },
].map((prop) => ({
  ...prop,
  ...assetRef(prop.assetId),
  artStatus: "candidate-art",
  collision: ["EQP-0058", "EQP-0063", "EQP-0004"].includes(prop.assetId),
}));

const placements = (assetIds, positions, role) =>
  positions.map(([assetId, x, y], index) => ({
    id: `${role}-${index + 1}`,
    ...assetRef(assetId),
    positionTiles: { x, y },
    anchor: "bottom-center",
    role,
    artStatus:
      byId.get(assetId).visualClassification === "CANDIDATE"
        ? "candidate-art"
        : "visually-confirmed-art",
    collision: role === "solar-array" ? "solid-footprint" : false,
  }));

const solarArrays = placements(
  ["BLD-0007", "EQP-0019", "EQP-0020"],
  [
    ["BLD-0007", 65, 9],
    ["EQP-0019", 70, 8],
    ["EQP-0020", 73, 8],
  ],
  "solar-array",
);

const terrainDetails = rockPositions.map(([x, y, assetId], index) => ({
  id: `surface-rock-${index + 1}`,
  ...assetRef(assetId),
  positionTiles: { x, y },
  anchor: "bottom-center",
  artStatus: "candidate-terrain-detail",
}));

const collision = [
  ...blueprint.collisionRectangles.map((rect, index) => ({
    id: `wall-${index + 1}`,
    tileRect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
    x: rect.x * tile,
    y: rect.y * tile,
    width: rect.width * tile,
    height: rect.height * tile,
    source: "facility-boundary",
  })),
  ...facilities
    .filter(
      (facility) => facility.assetId && !["airlock"].includes(facility.id),
    )
    .map((facility) => {
      const asset = byId.get(facility.assetId);
      const centerX =
        (facility.boundsTiles.x + facility.boundsTiles.w / 2) * tile;
      const baseY =
        (facility.boundsTiles.y + facility.boundsTiles.h / 2) * tile;
      const width = Math.min(
        asset.dimensions.width,
        facility.boundsTiles.w * tile - 16,
      );
      const height = Math.min(
        asset.dimensions.height,
        facility.boundsTiles.h * tile - 24,
      );
      return {
        id: `building-${facility.id}`,
        facilityId: facility.id,
        x: centerX - width / 2,
        y: baseY - height,
        width,
        height,
        source: "candidate-building-footprint",
      };
    }),
  ...solarArrays.map((item) => ({
    id: `solid-${item.id}`,
    x: item.positionTiles.x * tile - item.dimensionsPx.width / 2,
    y: item.positionTiles.y * tile - item.dimensionsPx.height,
    width: item.dimensionsPx.width,
    height: item.dimensionsPx.height * 0.35,
    source: "solar-array-footprint",
  })),
  ...props
    .filter((prop) => prop.collision)
    .map((prop) => ({
      id: `solid-${prop.id}`,
      x: prop.x * tile - prop.dimensionsPx.width / 2,
      y: prop.y * tile - prop.dimensionsPx.height,
      width: prop.dimensionsPx.width,
      height: prop.dimensionsPx.height * 0.45,
      source: "large-equipment-footprint",
    })),
  ...rockPositions.slice(0, 8).map(([x, y], index) => ({
    id: `rock-${index + 1}`,
    x: (x + 0.5) * tile - 10,
    y: (y + 0.5) * tile - 7,
    width: 20,
    height: 14,
    source: "large-rock-footprint",
  })),
  {
    id: "map-edge-north",
    x: 0,
    y: 0,
    width: blueprint.map.worldWidthPx,
    height: tile,
    source: "map-edge",
  },
  {
    id: "map-edge-south",
    x: 0,
    y: blueprint.map.worldHeightPx - tile,
    width: blueprint.map.worldWidthPx,
    height: tile,
    source: "map-edge",
  },
  {
    id: "map-edge-west",
    x: 0,
    y: 0,
    width: tile,
    height: blueprint.map.worldHeightPx,
    source: "map-edge",
  },
  {
    id: "map-edge-east",
    x: blueprint.map.worldWidthPx - tile,
    y: 0,
    width: tile,
    height: blueprint.map.worldHeightPx,
    source: "map-edge",
  },
];

const map = {
  schemaVersion: 1,
  id: "alpha-base-exterior",
  title: "Alpha Base Exterior",
  status: "playable-prototype",
  approvalStatus: "owner-approved-stage-2c",
  coordinateSystem: {
    origin: "top-left",
    tileSizePx: tile,
    positions: "tile coordinates",
    collision: "pixel rectangles",
  },
  dimensions: {
    widthTiles: 80,
    heightTiles: 45,
    widthPx: 2560,
    heightPx: 1440,
    aspectRatio: "16:9",
  },
  energyArchitecture: {
    primarySource: "external solar arrays",
    storage: "battery storage indoors",
    distribution: "indoor Power Control Room",
    externalNuclearReactor: false,
  },
  facilities,
  layers: {
    Ground: { color: "#a9472c", accent: "#b85432", tilePitchPx: tile },
    GroundDetails: terrainDetails,
    Paths: blueprint.paths.map((route) => ({
      id: route.id,
      connects: route.connects,
      widthPx: 52,
      waypointsTiles: route.waypointsTiles,
    })),
    Buildings: facilities
      .filter(
        (facility) =>
          facility.assetId &&
          !["solar-arrays", "airlock"].includes(facility.id),
      )
      .map((facility) => ({
        id: `building-${facility.id}`,
        facilityId: facility.id,
        assetId: facility.assetId,
        assetKey: facility.assetKey,
        positionTiles: {
          x: facility.boundsTiles.x + facility.boundsTiles.w / 2,
          y: facility.boundsTiles.y + facility.boundsTiles.h / 2,
        },
        anchor: "bottom-center",
        visualClassification: facility.visualClassification,
        artStatus: facility.artStatus,
        licenseStatus: facility.licenseStatus,
      })),
    Walls: {
      assetKey: wallAsset.assetKey,
      cornerAssetKey: cornerAsset.assetKey,
      doorAssetKey: doorAsset.assetKey,
      segments: wallSegments,
    },
    Props: props,
    SolarArrays: solarArrays,
    Foreground: facilities.map((facility) => ({
      facilityId: facility.id,
      label: facility.name,
      placeholder: facility.placeholder,
      boundsTiles: facility.boundsTiles,
    })),
    Collision: collision,
    Interactables: facilities.map((facility) => ({
      id: facility.id,
      facilityId: facility.id,
      title: facility.name,
      message:
        facility.id === "solar-arrays"
          ? "The outdoor solar arrays are the base’s primary energy source."
          : facility.id === "battery"
            ? "Battery storage helps the base use energy collected by the outdoor solar arrays."
            : facility.id === "power-control"
              ? "Power Control manages how electricity is distributed around Alpha Base."
              : facility.id === "communication"
                ? "The Communication Room is the mission hub. N.E.I.L. terminal artwork is still needed."
                : `Explore the ${facility.name.toLowerCase()} area. Dedicated facility artwork may still be needed.`,
      positionTiles: facility.interactionPointTiles,
      radiusPx: 82,
      status: "registered-prototype-interaction",
    })),
    RoomTriggers: facilities.map((facility) => ({
      id: facility.id,
      facilityId: facility.id,
      boundsTiles: facility.boundsTiles,
    })),
  },
  playerSpawn: { tile: { x: 43, y: 40 }, facing: "north" },
  camera: {
    initialZoom: 1,
    desktopZoom: 1,
    mobileZoom: 0.55,
    follow: true,
    clampToWorld: true,
  },
  notes: [
    "Candidate art remains explicitly marked. No candidate is presented as dedicated system equipment without visual evidence.",
    "Battery and oxygen-generation machinery are labeled placeholders; no generic canister is used as a battery or oxygen generator.",
    "N.E.I.L. terminal is represented as a labeled art placeholder only; no unrelated sprite is substituted.",
    "Source PNGs are copied to public/assets/map by this script for Vite production packaging; canonical source archive files remain unchanged.",
    "All supplied art licenses remain UNVERIFIED and block public redistribution pending provenance review.",
  ],
  assets: [...selected].sort().map(assetRef),
};

const ids = new Set(map.assets.map((asset) => asset.assetId));
const badReferences = [];
const scan = (value, location = "$") => {
  if (Array.isArray(value))
    value.forEach((item, index) => scan(item, `${location}[${index}]`));
  else if (value && typeof value === "object") {
    if (
      value.assetId &&
      (!ids.has(value.assetId) ||
        byId.get(value.assetId)?.semanticKey !== value.assetKey)
    )
      badReferences.push(location);
    Object.entries(value).forEach(([key, child]) => {
      if (key !== "assets") scan(child, `${location}.${key}`);
    });
  }
};
scan(map);
if (badReferences.length)
  throw new Error(`Bad asset references: ${badReferences.join(", ")}`);

for (const asset of map.assets) {
  const source = path.join(root, ...asset.sourceFolder.split("/"));
  if (!fs.existsSync(source))
    throw new Error(
      `Missing source asset ${asset.assetId}: ${asset.sourceFolder}`,
    );
  const target = path.join(root, "public", ...asset.runtimePath.split("/"));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

const out = path.join(root, "src/data/maps/alpha-base-exterior.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, `${JSON.stringify(map, null, 2)}\n`, "utf8");
console.log(
  `Generated ${path.relative(root, out)} with ${map.assets.length} selected assets, ${map.facilities.length} facilities, ${wallSegments.length} wall sprites, and ${collision.length} collision rectangles.`,
);
