import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '../..');
const catalogPath = path.join(root, 'src/data/assets/asset-catalog.json');
const outputDir = path.join(root, 'docs/asset-review');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const byId = new Map(catalog.map((entry) => [entry.assetId, entry]));

const facilityGroups = [
  {
    id: 'communication', name: 'Central Communication Room', confidence: 'Medium',
    reason: 'Generic room modules plus desk/terminal and antenna-like props form a plausible mission-control grouping; none is identified as N.E.I.L. hardware.',
    gaps: 'No confirmed room-specific communication console, N.E.I.L. terminal, wall display, or communication-delay feedback set.',
    supplement: 'Owner-approved terminal/dashboard artwork and room signage. Keep N.E.I.L. as authored terminal dialogue, not a drone character.',
    assets: [
      ['BLD-0001','Generic habitat module candidate; appearance alone does not identify this as the hub.','Low'],
      ['BLD-0002','Compact equipment/habitat module candidate; exact function is unknown.','Low'],
      ['EQP-0055','Visible workstation/console with display; plausible operator station.','Medium'],
      ['EQP-0058','Desk and computer silhouette; plausible communication-room workstation.','Medium'],
      ['EQP-0063','Dish antenna silhouette; suitable as a proposed exterior communications prop, not proof of a particular system.','Medium'],
      ['UIC-0042','Antenna/radio-wave-like UI symbol; suitable as a proposed communication status icon.','Medium'],
      ['WAL-0002','Straight modular wall segment for a constructed interior.','Medium'],
      ['WAL-0003','Corner wall segment for a constructed interior.','Medium'],
      ['FLT-0001','Floor-panel artwork for an interior floor treatment; scale needs validation.','Medium'],
    ],
  },
  {
    id: 'solar', name: 'External Solar Arrays', confidence: 'High for visual identity; Medium for layout',
    reason: 'BLD-0007 is visibly a solar-array structure. EQP panel sprites are smaller visual candidates for repeated array elements; they are not evidence of electrical specifications.',
    gaps: 'No verified cabling/connector kit or reviewed array count/orientation. Small panel props need a scale and repetition review.',
    supplement: 'If the owner wants a larger field than the supplied array art supports, create approved array-extension art and a readable, fictional cable/conduit connection.',
    assets: [
      ['BLD-0007','Clearly depicts solar panels on a support structure; strongest supplied array asset.','High'],
      ['EQP-0013','Small panel-on-stand silhouette; possible supplementary array unit.','Medium'],
      ['EQP-0019','Panel-on-stand silhouette; possible repeated array element.','Medium'],
      ['EQP-0020','Smaller panel-on-stand silhouette; possible array detail.','Medium'],
    ],
  },
  {
    id: 'power-control', name: 'Indoor Power Control', confidence: 'Medium',
    reason: 'Control-panel and equipment-rack imagery could support a power-distribution room, but no supplied asset is explicitly named as a power controller.',
    gaps: 'No confirmed power distribution board, labeled breakers, energy-flow display, or room-specific console.',
    supplement: 'Owner-approved power-control panel/room signage and a child-readable distribution display. Any values must be fictional gameplay values.',
    assets: [
      ['BLD-0004','Equipment-rack module candidate; exact function remains unknown.','Low'],
      ['EQP-0004','Console with two gauges and status lights; plausible control-panel detail.','Medium'],
      ['EQP-0006','Large equipment/console unit with a screen; plausible room machine.','Medium'],
      ['EQP-0017','Rack-like machine artwork; may provide a room equipment silhouette.','Medium'],
      ['EQP-0018','Cabled paired device; possible connection/detail prop, not verified as power cabling.','Low'],
      ['WAL-0002','Straight wall segment for room construction.','Medium'],
      ['FLT-0001','Interior floor-panel candidate; verify against room grid.','Medium'],
    ],
  },
  {
    id: 'battery', name: 'Battery Storage', confidence: 'Low',
    reason: 'No catalog item is confirmed as a battery. The listed canister/tank-like images are visual analogues only and must not be labeled as battery hardware without owner confirmation.',
    gaps: 'A clearly identifiable battery cabinet/storage module, charging/status indicator, and connector artwork are missing.',
    supplement: 'Owner-approved battery cabinet and simple charge/status visual. Do not use generic tanks as a final battery representation.',
    assets: [
      ['BLD-0006','Twin-cylinder module; candidate storage silhouette only, not identified as batteries.','Low'],
      ['EQP-0001','Small canister-like equipment; not identified as a battery.','Low'],
      ['EQP-0068','Barrel/canister-like prop; generic storage appearance only.','Low'],
      ['EQP-0069','Small canister-like prop; generic storage appearance only.','Low'],
    ],
  },
  {
    id: 'oxygen', name: 'Oxygen Generation / Life Support', confidence: 'Low to Medium',
    reason: 'The O₂ symbols and a few canister/machine sprites can support a status panel and generic equipment dressing. They do not confirm an oxygen generator or air filter.',
    gaps: 'No clearly identified oxygen-generation machinery, air-filtration unit, labeled ductwork, or room-specific control set.',
    supplement: 'Owner-approved generator/filter artwork, vents or ducts, and a readable life-support status terminal. Avoid implying a real measured oxygen concentration.',
    assets: [
      ['BLD-0006','Twin-cylinder module candidate for generic life-support equipment; function unverified.','Low'],
      ['EQP-0001','Canister-like equipment candidate; not identified as an oxygen cylinder.','Low'],
      ['EQP-0005','Enclosed machine/canister with a display; possible life-support machinery dressing only.','Low'],
      ['EQP-0049','Transparent-looking vertical container with green contents; function unclear.','Low'],
      ['UIC-0011','Clearly contains an O₂ glyph; suitable as a proposed UI/status symbol, not as machinery.','High for symbol; low for system meaning'],
      ['UIC-0012','O₂-labeled cylinder-like icon; proposed status symbol only.','Medium'],
      ['WAL-0002','Straight wall segment for separate-room construction.','Medium'],
    ],
  },
  {
    id: 'research', name: 'Research Lab', confidence: 'Low to Medium',
    reason: 'Workstation and shelf-like art could dress a lab. The supplied images do not establish lab equipment, sample identity, or scientific function.',
    gaps: 'No confirmed laboratory bench, sample container set, microscope/analysis instrument, or lab signage.',
    supplement: 'Owner-approved science bench, sample containers, and a clear analysis instrument. Keep any NASA-linked science content separately sourced and attributed.',
    assets: [
      ['BLD-0005','Compact enclosed module candidate; exact facility function is unknown.','Low'],
      ['EQP-0055','Display workstation candidate for a research terminal.','Medium'],
      ['EQP-0056','Shelf-like prop with small objects; contents and purpose are unidentified.','Low'],
      ['EQP-0058','Desk/computer candidate for a lab workstation.','Medium'],
      ['WAL-0002','Straight modular wall segment.','Medium'],
      ['WAL-0003','Corner modular wall segment.','Medium'],
      ['FLT-0001','Floor-panel candidate; verify scale and repeatability.','Medium'],
    ],
  },
  {
    id: 'greenhouse', name: 'Greenhouse', confidence: 'Medium to High',
    reason: 'BLD-0003 visibly resembles a glazed dome habitat. EQP-0045 through EQP-0048 visibly show plant trays/planters and are the strongest supplied food-production candidates.',
    gaps: 'No verified crop growth stages, harvesting tools, seed packs, or complete interior greenhouse kit.',
    supplement: 'Owner approval of the dome and tray roles; consider additional crop stages or harvesting art if the planned interaction needs them.',
    assets: [
      ['BLD-0003','Glazed dome with green interior; visually suitable as a greenhouse-module candidate.','High'],
      ['EQP-0045','Small planted tray/display.','High for plant tray; medium for greenhouse use'],
      ['EQP-0046','Two-tier planted tray/display.','High for plant tray; medium for greenhouse use'],
      ['EQP-0047','Planted tray.','High for plant tray; medium for greenhouse use'],
      ['EQP-0048','Enclosed planted tray/container.','High for plant tray; medium for greenhouse use'],
      ['GLS-0011','Large framed panel candidate; possible greenhouse frame/window detail, not a full glass wall.','Medium'],
    ],
  },
  {
    id: 'shelter', name: 'Radiation Shelter', confidence: 'Low to Medium',
    reason: 'Modular heavy walls/doors can define an enclosed room, and UIC-0015 is a radiation trefoil symbol. This does not establish shielding performance or a dedicated shelter kit.',
    gaps: 'No dedicated shelter module/interior, verified shielding material, or shelter-specific status/occupancy indicator.',
    supplement: 'Owner-approved shelter signage/interior cues. Any safety explanation must avoid invented dose or shielding values.',
    assets: [
      ['DOR-0005','Heavy framed double-door artwork; possible protected-room entrance.','Medium'],
      ['DOR-0006','Related open/frame door variant; possible entrance state.','Medium'],
      ['WAL-0001','Modular corner wall piece.','Medium'],
      ['WAL-0002','Straight modular wall piece.','Medium'],
      ['WAL-0003','Modular corner/transition wall piece.','Medium'],
      ['UIC-0015','Radiation trefoil icon; suitable for proposed shelter signage/UI only.','High for symbol; low for safety function'],
      ['FLT-0001','Interior floor-panel candidate.','Low'],
    ],
  },
  {
    id: 'airlock', name: 'Southern Entrance / Airlock', confidence: 'Medium to High',
    reason: 'Several door assets visibly show framed/hatch-style access structures. They are candidates for an airlock assembly; no state sequence or passability is encoded in the art.',
    gaps: 'No verified paired inner/outer airlock sequence, pressure-cycle UI, or clear exterior threshold strip.',
    supplement: 'Owner-approved open/closed door pairing and a simple child-readable airlock status display if gameplay needs a cycle interaction.',
    assets: [
      ['DOR-0005','Heavy framed double-door form; proposed outer or inner access door.','Medium'],
      ['DOR-0006','Matching open/frame variant; proposed alternate state, pending verification.','Medium'],
      ['DOR-0009','Wide framed doorway with central door panels; candidate entrance assembly.','Medium'],
      ['DOR-0010','Wide doorway with central opening; candidate alternate doorway state.','Medium'],
      ['DOR-0017','Compact reinforced door/hatch form.','Medium'],
      ['DOR-0018','Related open/alternate reinforced door form.','Medium'],
      ['WAL-0002','Straight modular wall piece to join the selected doorway to a room boundary.','Medium'],
    ],
  },
  {
    id: 'player', name: 'Shared Player Character', isShared: true, confidence: 'Medium',
    reason: 'The original sheet contains astronaut poses in suit and non-suit variants. These are map-wide character candidates, not facility art.',
    gaps: 'The extracted crops have variable trimmed dimensions. A consistent walk loop, direction mapping, frame registration, and suit variant choice have not been approved.',
    supplement: 'Owner approval of the REVO appearance, plus alignment/sequence metadata if these poses are used as an animation. Do not infer frame order from filename order.',
    assets: [
      ['AST-0001','Front-facing suited astronaut pose candidate for REVO.','Medium'],
      ['AST-0009','Side-facing suited pose candidate from a different source-sheet row; animation role is not verified.','Low'],
      ['AST-0010','Side-facing suited pose candidate; trimmed dimensions differ from adjacent poses.','Low'],
      ['AST-0011','Side-facing suited pose candidate; trimmed dimensions differ from adjacent poses.','Low'],
      ['AST-0012','Side-facing suited pose candidate; trimmed dimensions differ from adjacent poses.','Low'],
    ],
  },
];

function htmlEscape(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

const enrichedGroups = facilityGroups.map((group) => ({
  ...group,
  assets: group.assets.map(([assetId, fitReason, confidence]) => {
    const asset = byId.get(assetId);
    if (!asset) throw new Error(`Shortlist references missing catalog ID ${assetId}`);
    const categoryOrdinal = Number(assetId.slice(assetId.lastIndexOf('-') + 1));
    const page = Math.ceil(categoryOrdinal / 64);
    const categoryPage = `${asset.category}-${String(page).padStart(2, '0')}.png`;
    const galleryPath = `../../${asset.sourceFolder.split('/').map(encodeURIComponent).join('/')}`;
    const contactPath = `../asset-contact-sheets/${asset.category}/${categoryPage}`;
    return { ...asset, fitReason, confidence, categoryPage, contactPath, galleryPath };
  }),
}));

const reviewLines = [
  '# REVO — Stage 2B Asset Selection Review',
  '',
  '> **Owner review package. Nothing in this document is approved for final map placement.** Every shortlisted asset retains the catalog approval state and license state; proposed groupings are visual recommendations only.',
  '',
  '## Review rules',
  '',
  '- Asset IDs, semantic keys, filenames, dimensions, source paths, classifications, and crops come from `src/data/assets/asset-catalog.json`.',
  '- All listed images are canonical original-size assets. The archive is read-only.',
  '- Confidence describes visual suitability for the proposed grouping, not scientific/engineering correctness or owner approval.',
  '- A generic canister, cabinet, or machine is not labeled as a battery, oxygen generator, or power unit unless its appearance/source supports that identity.',
  '- Contact-sheet references point to the relevant category page; the local HTML gallery is a read-only filtering view.',
  '',
  '## Facility shortlist',
  '',
];

for (const group of enrichedGroups) {
  if (group.isShared) reviewLines.push('## Shared map assets', '');
  reviewLines.push(`### ${group.name}`, '', `**Overall confidence:** ${group.confidence}. ${group.reason}`, '',
    '| Asset ID | Semantic key | Original filename | Exact source path | Dimensions | Contact sheet | Classification | Suitability and confidence | Approval / license |',
    '|---|---|---|---|---:|---|---|---|---|');
  for (const asset of group.assets) {
    reviewLines.push(`| ${asset.assetId} | \`${asset.semanticKey}\` | \`${asset.originalFilename}\` | \`${asset.sourceFolder}\` | ${asset.dimensions.width} × ${asset.dimensions.height} px | [${asset.categoryPage}](../asset-contact-sheets/${asset.category}/${asset.categoryPage}) | ${asset.visualClassification} | ${asset.fitReason} **Confidence:** ${asset.confidence}. | ${asset.approvalStatus}; ${asset.licenseStatus} |`);
  }
  reviewLines.push('', `**Missing components:** ${group.gaps}`, '', `**Supplementary art / owner decision:** ${group.supplement}`, '');
}

reviewLines.push(
  '## Shared construction candidates',
  '',
  'The wall, floor, glazing, and doorway pieces are cropped sprites, not room-sized structures. Proposed room footprints in the blueprint must be assembled from selected repeats and checked for seam fit; the current shortlist does not establish an approved building kit. Contact sheets and exact source metadata are in the asset rows above.',
  '',
  '## Shortlist transparency and animation audit',
  '',
  'The pixel audit covers 47 selected original-size PNGs. Every file contains transparent pixels and none is fully opaque. Ten files contain some pure-black opaque pixels: the five astronaut poses (11.46–13.94% of each image) and five door/UI sprites (0.04–0.43%). Visual inspection of the astronaut contact sheet and crop shows these pixels as dark outlines/shading, not a black rectangular background; the UI/door percentages are sparse detail pixels. Non-transparent bounds are reported per asset in the audit CSV. All 47 manifest crop rectangles fit within their 256×256 source sheets and match extracted crop dimensions.',
  '',
  'Each selected PNG is a static crop, not an animated file. Five astronaut crops are drawn from a 24-pose original sheet; the available catalog crop layout does not establish frame order, stable registration, or a loop. Door variants are not validated animation frames. No destructive extraction or editing was performed.',
  '',
  '## Proposed exterior map',
  '',
  'The companion [human-readable map blueprint](./MAP_BLUEPRINT.md) and [machine-readable draft](./alpha-base-exterior-blueprint.json) propose an 80×45 tile world at a nominal 32 px pitch (2560×1440 px, 16:9). Coordinates are planning positions only. Solar stays outdoors; battery storage and power distribution stay indoors; a future dust storm reduces fictional solar generation and raises the value of stored battery energy.',
  '',
  '## Licensing and source status',
  '',
  'All shortlisted assets currently have catalog license status `UNVERIFIED`. The project still needs creator/source records, applicable PixelLab plan or generation terms, modification/redistribution permissions, attribution requirements, and any source-sheet provenance. Do not infer commercial permission from availability or generation. See `docs/ASSET_LICENSES.md`.',
  '',
  '## Supporting review files',
  '',
  '- [Read-only visual gallery](./index.html)',
  '- [Stable shortlisted asset IDs](./shortlisted-asset-ids.json)',
  '- [Shortlisted transparency/crop audit](./shortlisted-asset-audit.csv)',
  '- [Human-readable map blueprint](./MAP_BLUEPRINT.md)',
  '- [Proposed exterior blueprint JSON](./alpha-base-exterior-blueprint.json)',
  '- [Stage 2A full catalog](../../src/data/assets/asset-catalog.json)',
  '- [Stage 2A contact-sheet index](../asset-contact-sheets/contact-sheet-index.csv)',
  '',
  'No Phaser Scene, runtime map loader, gameplay system, or source asset is changed by this review package.',
);

const blueprintFacilities = [
  ['solar-arrays','External Solar Arrays',{x:62,y:4,w:15,h:9},[],{x:66,y:11},['BLD-0007','EQP-0013','EQP-0019','EQP-0020']],
  ['shelter','Radiation Shelter',{x:16,y:16,w:8,h:7},[{edge:'east',offsetTiles:2}],{x:20,y:19},['DOR-0005','DOR-0006','WAL-0001','WAL-0002','WAL-0003','UIC-0015','FLT-0001']],
  ['oxygen','Oxygen Generation / Life Support',{x:26,y:16,w:8,h:7},[{edge:'west',offsetTiles:2},{edge:'east',offsetTiles:2}],{x:30,y:19},['BLD-0006','EQP-0001','EQP-0005','EQP-0049','UIC-0011','UIC-0012','WAL-0002']],
  ['communication','Central Communication Room',{x:36,y:13,w:13,h:9},[{edge:'west',offsetTiles:5},{edge:'east',offsetTiles:3},{edge:'south',offsetTiles:5}],{x:42,y:18},['BLD-0001','BLD-0002','EQP-0055','EQP-0058','EQP-0063','UIC-0042','WAL-0002','WAL-0003','FLT-0001']],
  ['power-control','Indoor Power Control',{x:49,y:13,w:9,h:8},[{edge:'west',offsetTiles:3},{edge:'south',offsetTiles:3}],{x:52,y:17},['BLD-0004','EQP-0004','EQP-0006','EQP-0017','EQP-0018','WAL-0002']],
  ['battery','Battery Storage',{x:49,y:22,w:9,h:7},[{edge:'north',offsetTiles:3},{edge:'east',offsetTiles:2}],{x:52,y:25},['BLD-0006','EQP-0001','EQP-0068','EQP-0069','WAL-0002']],
  ['research','Research Lab',{x:26,y:26,w:10,h:7},[{edge:'north',offsetTiles:4}],{x:31,y:29},['BLD-0005','EQP-0055','EQP-0056','EQP-0058','WAL-0002','WAL-0003','FLT-0001']],
  ['greenhouse','Greenhouse',{x:60,y:19,w:12,h:9},[{edge:'north',offsetTiles:5},{edge:'west',offsetTiles:3}],{x:65,y:23},['BLD-0003','EQP-0045','EQP-0046','EQP-0047','EQP-0048','GLS-0011']],
  ['airlock','Southern Entrance / Airlock',{x:38,y:34,w:10,h:4},[{edge:'north',offsetTiles:4}],{x:43,y:36},['DOR-0005','DOR-0006','DOR-0009','DOR-0010','DOR-0017','DOR-0018','WAL-0002']],
];

function roomWallCollisions(bounds, doorways) {
  const wall = 1;
  const opening = 2;
  const rects = [];
  const horizontal = (edge, y) => {
    const gaps = doorways.filter((door) => door.edge === edge).map((door) => door.offsetTiles).sort((a,b) => a-b);
    let cursor = 0;
    for (const offset of gaps) {
      if (offset > cursor) rects.push({ x: bounds.x + cursor, y, width: offset - cursor, height: wall, type: 'room-wall' });
      cursor = offset + opening;
    }
    if (cursor < bounds.w) rects.push({ x: bounds.x + cursor, y, width: bounds.w - cursor, height: wall, type: 'room-wall' });
  };
  const vertical = (edge, x) => {
    const gaps = doorways.filter((door) => door.edge === edge).map((door) => door.offsetTiles).sort((a,b) => a-b);
    let cursor = 0;
    for (const offset of gaps) {
      if (offset > cursor) rects.push({ x, y: bounds.y + cursor, width: wall, height: offset - cursor, type: 'room-wall' });
      cursor = offset + opening;
    }
    if (cursor < bounds.h) rects.push({ x, y: bounds.y + cursor, width: wall, height: bounds.h - cursor, type: 'room-wall' });
  };
  horizontal('north', bounds.y);
  horizontal('south', bounds.y + bounds.h - wall);
  vertical('west', bounds.x);
  vertical('east', bounds.x + bounds.w - wall);
  return rects;
}

const facilityObjects = blueprintFacilities.map(([id, name, bounds, doorways, interactionPoint, ids]) => ({
  id, name, boundsTiles: bounds,
  doorways: doorways.map((door) => ({ ...door, widthTiles: 2, status: 'proposed-opening' })),
  interactionPointTiles: interactionPoint,
  assetReferences: ids.map((assetId) => {
    const asset = byId.get(assetId);
    if (!asset) throw new Error(`Blueprint references missing catalog ID ${assetId}`);
    return {
      assetKey: asset.semanticKey,
      assetId: asset.assetId,
      sourceDimensionsPx: asset.dimensions,
      classification: asset.visualClassification,
      assetStatus: 'proposed-not-approved',
      licenseStatus: asset.licenseStatus,
      useNote: id === 'battery' ? 'Visual analogue only; do not label or ship as battery art without owner approval.' : 'Proposed grouping; do not treat as final artwork before owner approval.',
    };
  }),
  collisionRects: id === 'solar-arrays' ? [] : roomWallCollisions(bounds, doorways),
}));

const proposedPlacements = [
  ['solar-array-main','BLD-0007',64,5,'External solar array structure; proposed placement.'],
  ['solar-panel-a','EQP-0019',68,7,'Small panel prop; proposed repeat element.'],
  ['solar-panel-b','EQP-0020',71,7,'Small panel prop; proposed repeat element.'],
  ['communication-workstation','EQP-0058',41,17,'Desk/computer candidate.'],
  ['communication-console','EQP-0055',45,17,'Display console candidate.'],
  ['communication-dish','EQP-0063',46,14,'Dish antenna proposed outside/near communication room.'],
  ['power-control-console','EQP-0004',52,16,'Control panel candidate.'],
  ['power-control-rack','BLD-0004',54,15,'Generic equipment rack candidate.'],
  ['battery-analogue','BLD-0006',54,23,'Unidentified twin-cylinder module; must not be labeled as battery.'],
  ['oxygen-equipment-analogue','EQP-0005',32,19,'Generic machine/canister candidate; not identified as oxygen generator.'],
  ['greenhouse-dome','BLD-0003',61,20,'Glazed dome greenhouse candidate.'],
  ['greenhouse-tray-a','EQP-0045',62,23,'Plant tray candidate.'],
  ['greenhouse-tray-b','EQP-0046',64,23,'Plant tray candidate.'],
  ['greenhouse-tray-c','EQP-0047',66,23,'Plant tray candidate.'],
  ['greenhouse-tray-d','EQP-0048',68,23,'Plant tray candidate.'],
  ['shelter-door','DOR-0005',22,19,'Heavy door candidate.'],
  ['airlock-door-outer','DOR-0005',40,34,'Proposed outer door; state pairing needs owner review.'],
  ['airlock-door-inner','DOR-0006',40,34,'Proposed alternate door state; not a validated animation.'],
];

const blueprint = {
  schemaVersion: 1,
  title: 'Alpha Base Exterior Map Blueprint — Owner Review Draft',
  status: 'proposed-not-runtime-data',
  approvalStatus: 'pending-owner-review',
  map: {
    widthTiles: 80, heightTiles: 45, tileSizePx: 32, worldWidthPx: 2560, worldHeightPx: 1440,
    aspectRatio: '16:9', coordinateConventions: {
      roomBounds: 'tile units; origin is top-left; bounds are [x,y,width,height]',
      interactionPoints: 'tile coordinate of reachable player interaction center',
      spritePlacement: 'tile origin for top-left; asset pixels are preserved at native dimensions unless a later approved scale is recorded',
      collisions: 'tile units; proposed one-tile-thick wall rectangles with two-tile doorway gaps',
    },
  },
  energyArchitecture: {
    primarySource: 'external solar arrays',
    storage: 'battery storage indoors',
    distribution: 'indoor Power Control Room',
    externalNuclearReactor: false,
    futureDustStormRule: 'A future storm reduces available sunlight and fictional solar generation, increasing the importance of stored battery energy.',
    numericValues: 'not set; fictional gameplay values require separate balancing and must not be described as NASA engineering measurements',
  },
  facilities: facilityObjects,
  objects: proposedPlacements.map(([id, assetId, x, y, note]) => {
    const asset = byId.get(assetId);
    return { id, assetKey: asset.semanticKey, assetId, positionTiles: { x, y }, dimensionsPx: asset.dimensions, status: 'proposed-not-approved', note };
  }),
  collisionRectangles: facilityObjects.flatMap((facility) => facility.collisionRects.map((rect) => ({ facilityId: facility.id, ...rect, status: 'proposed' }))),
  interactionPoints: facilityObjects.map((facility) => ({ facilityId: facility.id, positionTiles: facility.interactionPointTiles, status: 'proposed' })),
  paths: [
    { id: 'south-main-walkway', widthTiles: 2, waypointsTiles: [[43,38],[43,34],[43,30],[43,22]], connects: ['airlock','communication'], surface: 'proposed-walkable-path' },
    { id: 'west-occupied-wing', widthTiles: 2, waypointsTiles: [[42,20],[36,20],[34,19]], connects: ['communication','oxygen'], surface: 'proposed-walkable-path' },
    { id: 'shelter-connector', widthTiles: 2, waypointsTiles: [[26,19],[24,19]], connects: ['oxygen','shelter'], surface: 'proposed-walkable-path' },
    { id: 'research-branch', widthTiles: 2, waypointsTiles: [[42,24],[34,24],[31,24],[31,26]], connects: ['south-main-walkway','research'], surface: 'proposed-walkable-path' },
    { id: 'east-power-service', widthTiles: 2, waypointsTiles: [[48,17],[49,17],[53,21],[53,22],[58,24],[60,23]], connects: ['communication','power-control','battery','greenhouse'], surface: 'proposed-walkable-path' },
    { id: 'solar-inspection-path', widthTiles: 2, waypointsTiles: [[66,12],[66,17],[66,19]], connects: ['greenhouse','solar-array-zone'], surface: 'proposed-walkable-path' },
  ],
  energyConnection: {
    routeTiles: [[65,11],[65,15],[58,17]],
    status: 'visual-conduit-concept-only',
    collision: false,
    note: 'Illustrative map connection between exterior arrays and indoor storage/control; not an engineering schematic.',
  },
  siteZones: [
    { id: 'solar-array-zone', boundsTiles: { x: 62,y: 4,w: 15,h: 9 }, placement: 'outside; keep buildings, tall decoration, and camera-blocking props clear of the array field' },
    { id: 'habitat-campus', boundsTiles: { x: 16,y: 13,w: 56,h: 25 }, placement: 'room footprints and connecting paths; individual room footprints remain provisional' },
  ],
  proposedPlacements: proposedPlacements.map(([id, assetId, x, y, note]) => {
    const asset = byId.get(assetId);
    return {
      id, assetKey: asset.semanticKey, assetId,
      positionTiles: { x, y },
      sourceDimensionsPx: asset.dimensions,
      classification: asset.visualClassification,
      status: 'proposed-not-approved',
      finalAsset: false,
      licenseStatus: asset.licenseStatus,
      collision: id.startsWith('solar-') || id.includes('door') || id === 'shelter-door' ? 'proposed-solid-footprint; keep door gap passable' : 'not-set-until-placement-test',
      note,
    };
  }),
  playerSpawn: { tile: { x: 43, y: 37 }, facing: 'north', status: 'proposed' },
  camera: {
    logicalViewportPx: { width: 1280, height: 720 }, aspectRatio: '16:9',
    initialFocusTiles: { x: 43, y: 33 },
    boundsWorldPx: { x: 0, y: 0, width: 2560, height: 1440 },
    behavior: 'follow REVO with world clamping; keep room, interaction prompt, and nearby path visible; recheck mobile safe margins',
  },
  decorationZones: [
    { id: 'north-west-rock-field', boundsTiles: { x: 2,y: 2,w: 15,h: 39 }, contents: 'select individual rock/crater candidates from Ground_Tileset after owner review', keepClearOf: ['west-occupied-wing'] },
    { id: 'north-ridge', boundsTiles: { x: 18,y: 2,w: 42,h: 8 }, contents: 'sparse terrain variation; maintain open solar exposure' },
    { id: 'east-perimeter', boundsTiles: { x: 74,y: 14,w: 5,h: 25 }, contents: 'sparse rocks and terrain edge details' },
    { id: 'south-border', boundsTiles: { x: 2,y: 40,w: 76,h: 4 }, contents: 'low-contrast terrain boundary; preserve entrance apron' },
  ],
  constructionNotes: [
    'Room rectangles are planning footprints, not dimensions of the supplied building sprites.',
    'Most selected room/wall sprites are approximately 24–50 px; several floor panels are about 60 × 64 px. Verify repeat seams before using as 32 px grid cells.',
    'The actual map data architecture is JSON-driven for Phaser 4; Tiled is not a required dependency.',
    'All asset references are proposed and explicitly non-final. No unapproved candidate is marked final.',
    'Collision rectangles are conceptual room boundaries. Validate door gaps, shared walls, sprite bounds, and reachability in a later runtime stage.',
    'Solar arrays remain outside; battery storage and Power Control remain indoors.',
  ],
  sharedActors: ['AST-0001','AST-0009','AST-0010','AST-0011','AST-0012'].map((assetId) => {
    const asset = byId.get(assetId);
    return { assetKey: asset.semanticKey, assetId, sourceDimensionsPx: asset.dimensions, sourceSheet: asset.sourceSheet, crop: asset.crop, status: 'proposed-not-approved', finalAsset: false, animationVerified: false, licenseStatus: asset.licenseStatus };
  }),
};

const uniqueAssets = new Map();
for (const group of enrichedGroups) for (const asset of group.assets) uniqueAssets.set(asset.assetId, asset);
const invalidRooms = blueprint.facilities.filter((facility) => {
  const { x, y, w, h } = facility.boundsTiles;
  const { widthTiles, heightTiles } = blueprint.map;
  const point = facility.interactionPointTiles;
  return x < 0 || y < 0 || x + w > widthTiles || y + h > heightTiles
    || point.x < x || point.y < y || point.x >= x + w || point.y >= y + h
    || facility.collisionRects.some((rect) => rect.width <= 0 || rect.height <= 0 || rect.x < 0 || rect.y < 0 || rect.x + rect.width > widthTiles || rect.y + rect.height > heightTiles);
});
const invalidPaths = blueprint.paths.flatMap((pathEntry) => pathEntry.waypointsTiles).filter(([x, y]) => x < 0 || y < 0 || x >= blueprint.map.widthTiles || y >= blueprint.map.heightTiles);
if (invalidRooms.length || invalidPaths.length) throw new Error(`Blueprint geometry validation failed: ${invalidRooms.length} rooms and ${invalidPaths.length} paths are out of bounds.`);
if (blueprint.facilities.flatMap((facility) => facility.assetReferences).some((reference) => !byId.has(reference.assetId) || byId.get(reference.assetId).semanticKey !== reference.assetKey || reference.assetStatus !== 'proposed-not-approved' || reference.licenseStatus !== 'UNVERIFIED')) {
  throw new Error('Blueprint contains an invalid catalog reference, approval status, or license status.');
}
const galleryData = [...uniqueAssets.values()].map((asset) => ({
  ...asset,
  facilities: enrichedGroups.filter((group) => group.assets.some((entry) => entry.assetId === asset.assetId)).map((group) => group.name),
}));

const galleryHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>REVO — Stage 2B Asset Review</title>
<style>
:root{color-scheme:dark;--bg:#101923;--panel:#1b2935;--line:#344b5b;--text:#edf4f6;--muted:#aec0c8;--accent:#64d2c4}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.45 system-ui,sans-serif}header{padding:24px clamp(16px,4vw,56px);background:#182633;border-bottom:1px solid var(--line)}h1{margin:0 0 6px;font-size:clamp(24px,4vw,34px)}header p{margin:0;color:var(--muted)}.toolbar{position:sticky;top:0;z-index:2;display:flex;flex-wrap:wrap;gap:10px;padding:14px clamp(16px,4vw,56px);background:#111d27;border-bottom:1px solid var(--line)}select,input{min-height:42px;padding:8px 12px;border:1px solid var(--line);border-radius:8px;background:#1b2935;color:var(--text);font:inherit}input{flex:1;min-width:210px}#count{align-self:center;color:var(--muted)}main{padding:18px clamp(16px,4vw,56px) 48px}.group-title{margin:28px 0 12px;color:var(--accent);font-size:20px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px}.card{overflow:hidden;border:1px solid var(--line);border-radius:10px;background:var(--panel)}.preview{height:190px;display:grid;place-items:center;padding:10px;background-color:#d7dde0;background-image:linear-gradient(45deg,#bfc8cc 25%,transparent 25%),linear-gradient(-45deg,#bfc8cc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#bfc8cc 75%),linear-gradient(-45deg,transparent 75%,#bfc8cc 75%);background-size:20px 20px;background-position:0 0,0 10px,10px -10px,-10px 0}.preview img{max-width:100%;max-height:100%;object-fit:contain;image-rendering:pixelated;cursor:zoom-in}.meta{padding:12px}.idline{display:flex;align-items:center;justify-content:space-between;gap:8px}.id{font-weight:750;color:var(--accent)}.badge{border-radius:99px;padding:3px 8px;font-size:11px;font-weight:750;background:#394750}.CONFIRMED{background:#1c594f}.CANDIDATE{background:#685126}.UNIDENTIFIED{background:#703c46}.name{font-weight:650;overflow-wrap:anywhere}.small{color:var(--muted);font-size:13px}.reason{margin:8px 0}.facilities{color:#d3e1e5;font-size:12px}.empty{padding:30px;color:var(--muted)}dialog{width:min(92vw,1050px);max-height:90vh;border:1px solid var(--line);border-radius:12px;background:#111d27;color:var(--text)}dialog::backdrop{background:#000b}.zoom{max-height:68vh;width:100%;object-fit:contain;image-rendering:pixelated}.close{float:right;padding:7px 12px;border:0;border-radius:7px;background:#334958;color:white;font:inherit;cursor:pointer}.zoom-meta{padding:10px 0;color:var(--muted)}a{color:#81ded0}
</style></head><body>
<header><h1>REVO asset selection — owner review</h1><p>Local, read-only gallery of proposed groupings. Source images are loaded from the canonical original-size archive; filters do not modify any project file.</p><p>All items remain pending owner approval; license status is UNVERIFIED.</p></header>
<div class="toolbar"><select id="facility"><option value="">All facilities and shared assets</option>${enrichedGroups.map((group) => `<option>${htmlEscape(group.name)}</option>`).join('')}</select><select id="category"><option value="">All categories</option>${[...new Set(galleryData.map((x) => x.category))].sort().map((category) => `<option>${category}</option>`).join('')}</select><select id="classification"><option value="">All classifications</option><option>CONFIRMED</option><option>CANDIDATE</option><option>UNIDENTIFIED</option></select><input id="search" type="search" placeholder="Search ID, filename, key, or note"><span id="count"></span></div>
<main id="gallery"></main><dialog id="zoom"><button class="close">Close</button><img class="zoom"><div class="zoom-meta"></div></dialog>
<script type="application/json" id="asset-data">${JSON.stringify(galleryData).replace(/</g, '\\u003c')}</script>
<script>
const assets=JSON.parse(document.querySelector('#asset-data').textContent);const fields=['facility','category','classification','search'];const selectors=Object.fromEntries(fields.map(x=>[x,document.getElementById(x)]));const gallery=document.getElementById('gallery');const count=document.getElementById('count');const zoom=document.getElementById('zoom');
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function render(){const [facility,category,classification,search]=fields.map(x=>selectors[x].value.toLowerCase());const filtered=assets.filter(a=>(!facility||a.facilities.some(x=>x.toLowerCase()===facility))&&(!category||a.category.toLowerCase()===category)&&(!classification||a.visualClassification.toLowerCase()===classification)&&(!search||[a.assetId,a.originalFilename,a.semanticKey,a.fitReason].join(' ').toLowerCase().includes(search)));count.textContent=filtered.length+' proposed asset groupings';if(!filtered.length){gallery.innerHTML='<div class="empty">No matches. Clear a filter to see more assets.</div>';return}const byFacility=new Map();for(const a of filtered){for(const f of a.facilities){if(facility&&f.toLowerCase()!==facility)continue;if(!byFacility.has(f))byFacility.set(f,[]);byFacility.get(f).push(a)}}gallery.innerHTML=[...byFacility].map(([f,items])=>'<section><h2 class="group-title">'+esc(f)+'</h2><div class="grid">'+items.map(a=>'<article class="card"><div class="preview"><img loading="lazy" src="'+esc(a.galleryPath)+'" alt="'+esc(a.assetId+' '+a.originalFilename)+'" data-src="'+esc(a.galleryPath)+'"></div><div class="meta"><div class="idline"><span class="id">'+esc(a.assetId)+'</span><span class="badge '+esc(a.visualClassification)+'">'+esc(a.visualClassification)+'</span></div><div class="name">'+esc(a.originalFilename)+'</div><div class="small">'+esc(a.category)+' · '+a.dimensions.width+' × '+a.dimensions.height+' px · confidence '+esc(a.confidence)+'</div><div class="reason">'+esc(a.fitReason)+'</div><div class="facilities">'+esc(a.semanticKey)+'</div><div class="small">License: UNVERIFIED · '+esc(a.approvalStatus)+'</div><a href="'+esc(a.contactPath)+'" target="_blank" rel="noreferrer">Contact sheet page</a></div></article>').join('')+'</div></section>').join('');gallery.querySelectorAll('.preview img').forEach(img=>img.addEventListener('click',()=>{zoom.querySelector('.zoom').src=img.dataset.src;const a=assets.find(x=>x.galleryPath===img.dataset.src);zoom.querySelector('.zoom-meta').textContent=a.assetId+' · '+a.originalFilename+' · '+a.dimensions.width+'×'+a.dimensions.height+' px · '+a.visualClassification+' · '+a.facilities.join(', ');zoom.showModal()}))}
fields.forEach(x=>selectors[x].addEventListener('input',render));zoom.querySelector('.close').addEventListener('click',()=>zoom.close());render();
</script></body></html>`;

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'ASSET_SELECTION_REVIEW.md'), reviewLines.join('\n'), 'utf8');
fs.writeFileSync(path.join(outputDir, 'index.html'), galleryHtml, 'utf8');
fs.writeFileSync(path.join(outputDir, 'alpha-base-exterior-blueprint.json'), `${JSON.stringify(blueprint, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(outputDir, 'shortlisted-asset-ids.json'), `${JSON.stringify([...uniqueAssets.keys()].sort(), null, 2)}\n`, 'utf8');
console.log(`Wrote review package for ${uniqueAssets.size} unique shortlisted assets across 9 facilities plus shared player-art review.`);
