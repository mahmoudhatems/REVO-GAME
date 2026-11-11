# REVO — Asset and Map Pipeline

## 1. Purpose and source of truth

The recovered canonical archive is `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/`. Preserve it unchanged. `02_32x32_Where_Possible/` is a secondary variant and must be checked per-file; its name does not guarantee 32×32 dimensions. The manifest and verified file dimensions are recorded in `src/data/assets/asset-catalog.json`; contact sheets are in `docs/asset-contact-sheets/`.

Do not use an overview image as a playable map. The world is to be assembled from approved sprites and layers. Do not place assets into a map until the owner has reviewed the catalog and map plan. Do not claim an asset's function or license beyond the evidence recorded in the catalog.

## 2. Stage 2A archive audit

- 2,207 manifest assets in each variant; 4,444 PNGs total including 15 source sheets per variant.
- All 2,207 original-size manifest entries resolve and match recorded dimensions.
- The 15 source sheets have been hash-verified identical across variants.
- Categories: Ground_Tileset 1,516; Buildings 7; Doors_Walls 72; Walls_Modular 49; Panels_Glass 52; Floor_Tiles 12; Tools_Equipment 179; Astronaut 24; Drone_Animations 123; UI_Elements 123; UI_Icons 50.
- Contact sheets use checkerboard transparency previews, preserve aspect ratio, and label asset ID, filename, and dimensions.
- PNG alpha-channel metadata is recorded; transparent-pixel coverage has not been audited. License status is `UNVERIFIED` for every archive asset pending provenance documentation.
- Ground_Tileset is mixed: terrain, edge/rock/plant/mineral-like crops, text fragments, and other isolated imagery. Select per tile; do not treat all 1,516 crops as ready ground tiles.

## 3. Asset preparation rules

1. Keep original files immutable and use original-size files as canonical sources.
2. Use the generated IDs only as stable catalog/contact-sheet references; preserve exact filenames.
3. Verify the selected asset's dimensions, alpha pixels, frame bounds, pixel density, and license before runtime import.
4. Preserve outlines and shadows. Use nearest-neighbor scaling for pixel art.
5. Do not infer animation order from sorted filenames; group and verify frames from their source sheet.
6. Do not assign ambiguous equipment a gameplay role without owner approval.
7. N.E.I.L. remains terminal-based; drone art is not N.E.I.L.

## 4. Approved Alpha Base facilities and coverage

| Facility | Current supplied-art coverage | Status and gap |
|---|---|---|
| Central Communication Room (main hub) | Screens/terminals, desks, antenna-like props, communications icons | Candidate coverage; no uniquely identified room kit or N.E.I.L. terminal asset. |
| External solar arrays | One clearly identifiable building/module array and several small panel-like equipment crops | Solar art confirmed visually; module scale, array count, and installation remain owner approval. |
| Battery storage | Tanks/canisters and generic equipment; no clearly identified battery unit | Missing clearly identifiable battery-storage artwork; generic props are candidates only. |
| Indoor Power Control | Consoles/screens, indicator/control pieces, cabling-like details | Candidate coverage; no confirmed named power-distribution console set. |
| Oxygen Generation / Life Support | Tanks, pipes, equipment, and O₂-like icon | Candidate coverage; dedicated generator/filter identity is not confirmed. |
| Research Lab | Work surfaces, screens, shelving, science-like props | Candidate coverage; no confirmed lab-specific room kit or identified specimen set. |
| Greenhouse / food production | Greenhouse-like dome and plant/seedling tray imagery | Strong candidate coverage; crop/food production props need owner confirmation. |
| Radiation Shelter | Radiation-like icon/sign and robust door/wall pieces | Partial candidate coverage; no clearly identified dedicated shelter module/shielding kit. |
| Main Entrance / Airlock | Multiple door, hatch, and double-door assets | Door/access artwork confirmed; exact airlock assembly and passability remain to be mapped. |

There is **no external nuclear reactor in the current approved MVP**. Do not add one to the map or energy system. Solar arrays and battery storage are approved and must remain represented in the catalog. “Candidate” indicates visual plausibility, not final placement approval.

## 5. Exterior map construction plan (not yet implemented)

Proposed starting canvas: **80 × 45 tiles at 32 × 32 px (2,560 × 1,440 px)**. The canonical terrain crops are predominantly 32×32, but dimensions must be checked for each chosen tile. The canvas supports a landscape composition while allowing camera framing for smaller screens. Revisit after selected art is assembled at native scale.

Composition guidance, not a final placement map:

- Place the habitat cluster near the center, with the Central Communication Room as the visual and navigational hub.
- Connect the main entrance/airlock to a clear, broad main path that branches to the hub, greenhouse, lab, life support, power control, and shelter.
- Place external solar arrays in an open perimeter zone with a walkable inspection route and clear separation from buildings.
- Place battery storage and an exterior-to-interior power connection near the power/control side of the habitat; show the connection as a readable conduit/path without implying real engineering specifications.
- Put the radiation shelter on a short, obvious route from occupied rooms; do not make it accessible only by crossing exposed terrain.
- Reserve perimeter zones for rocks, craters, dust-colored ground variation, and sparse environmental props. Keep decoration away from collision edges, doors, and interaction spots.

### Geometry and interaction requirements

- Use a tile grid for ground/path composition; use native-sized sprites for buildings and large props where appropriate.
- Define collision for solid walls, building footprints, arrays, machinery, and large rocks. Doors/passages need deliberate open/closed states or clear walkable gaps.
- Define one reachable interaction point per facility and key outdoor object; keep interaction bounds outside walls and away from narrow corridors.
- Ensure all approved facilities connect through a continuous walkable network and the shelter is reachable from the occupied hub.
- Keep important object silhouettes unobscured by foreground layers. Test depth ordering, camera bounds, collision, and touch-scale interactions in the eventual runtime.
- Use authored map geometry and object layers; do not replace it with a generated screenshot. Do not begin final map authoring during Stage 2A.

## 6. Texture atlas recommendations

Build only after a runtime draw/load profile and the selected visual set are known. Proposed small, category-based groups:

| Atlas group | Inputs | Constraint |
|---|---|---|
| Static ground | Approved repeatable terrain tiles and edges only | Exclude labels, props, UI, and isolated crops; preserve tile boundaries. |
| Buildings | Approved static habitat/facility modules | Keep large variable-size art; do not force it into tile dimensions. |
| Props | Static equipment, furniture, doors, and wall details | Group by compatible pixel density; keep animated pieces out. |
| UI | UI_Elements and UI_Icons | Keep UI scale and filtering independent from world art. |
| Character and animation | Astronaut poses grouped by verified direction/frame sequence | Do not assume the 24 files form a single uniform animation sheet. Keep drone animations separate unless verified compatible. |

Avoid unnecessary pages: curate, pack, then measure. Do not combine variable-size props with animation frames that require fixed cells. The 15 original sprite sheets remain source records, not automatic runtime atlases.

## 7. Future map layers and acceptance

When map implementation is approved, author one map source with ground, paths, ground details, buildings, walls, props, foreground, collision, interactables, and room-trigger layers as needed. Test actual Phaser 4.2.1 loading/export compatibility before choosing map serialization details.

Map acceptance: all facilities reachable; clear paths and door gaps; no walking through walls or solid props; visible connection between array, storage, and power-control areas; reachable shelter; readable interaction points; camera frames landscape composition without exposing unintended empty space; no missing textures.

See [ASSET_CATALOG.md](./ASSET_CATALOG.md), [ASSET_LICENSES.md](./ASSET_LICENSES.md), and [ROADMAP_AND_ACCEPTANCE.md](./ROADMAP_AND_ACCEPTANCE.md).
