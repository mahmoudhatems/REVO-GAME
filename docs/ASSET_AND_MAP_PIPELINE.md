# REVO — Asset and Tiled Map Pipeline

## 1. Purpose

The team is creating and preparing original pixel-art assets using PixelLab and related tools, and building map geometry with Tiled. The goal is to produce a coherent, playable world—not to place one large generated image behind the player.

## 2. Source-of-truth rules

- Preserve original PixelLab exports and source sheets.
- Tiled is the source of truth for room geometry and map layers after integration.
- The asset manifest records source images and sprite metadata.
- Gameplay rules live in feature/domain code and mission JSON.
- Do not maintain a second conflicting map layout in `worldData.js` once Tiled has become authoritative.
- Generated concept art is a reference, not an automatically playable map.

## 3. Suggested asset folders

```text
public/assets/
├── source/          # Original source exports; do not overwrite
├── characters/      # REVO sprites and animation sheets
├── tilesets/        # Ground, walls, floors, trim, edges
├── buildings/       # Dome and facility sprites
├── props/           # Consoles, tanks, furniture, machinery
├── environment/     # Rocks, craters, terrain, plants
├── ui/              # HUD, icons, dialogue panels
├── audio/           # SFX and music
├── video/           # Intro video
└── fonts/           # Licensed fonts
```

Keep existing paths working until references are migrated and tested.

## 4. Asset inspection checklist

For each sprite sheet:

1. Record image dimensions and format.
2. Inspect transparency/alpha.
3. Identify cell sizes and spacing.
4. Check whether there are labels or UI elements mixed into the sheet.
5. Identify intended sprites and bounding boxes.
6. Check consistency with REVO's art style.
7. Export individual assets only when needed.
8. Preserve dark outlines and shadows; do not remove black pixels blindly.
9. Use nearest-neighbor scaling for pixel art.
10. Record source and license status.

Do not guess frame size from appearance. Verify the actual sprite sheet and animation order.

## 5. Tiled map configuration

Use an orthogonal top-down map unless the approved art reference clearly requires another perspective. Do not mix orthogonal gameplay geometry with isometric art without an explicit plan.

Use the actual tile dimensions from the supplied tileset; do not assume 16×16 or 32×32 until inspected.

Suggested layers:

1. `Ground`
2. `GroundDetails`
3. `MainPaths`
4. `Buildings`
5. `Walls`
6. `Props`
7. `AbovePlayer`
8. `Collision`
9. `Interactables`
10. `RoomTriggers`

Suggested custom properties:

- `collides: boolean`
- `roomId: string`
- `facilityType: string`
- `interactionKey: string`
- `displayName: string`
- `interactionRadius: number`
- `zIndex: number`

Use separate object layers for interaction rectangles and non-rendering triggers where appropriate.

## 6. Accepted Alpha Base facilities

- Central Communication Room — primary hub and mission control.
- External Fission Power Unit — secured outside.
- Power Control Room — indoors.
- Oxygen Generation / Life Support Room — separate.
- Research Lab — separate.
- Greenhouse.
- Radiation Shelter.
- Entrance / Airlock.

No solar arrays are part of the accepted map design.

## 7. Phaser map loading

Build a map adapter that loads the Tiled export and exposes:

- rendered layers;
- collision bodies;
- room/facility IDs;
- interaction points;
- map bounds;
- spawn points.

Avoid putting all Tiled parsing and object handling inside the main gameplay Scene.

Important compatibility note: verify Tiled export options against the installed Phaser 4 version. Phaser's Tiled parser may not support external TSX references in the runtime export. Prefer embedded tileset definitions in JSON or add a tested build-time conversion step. Do not assume compressed layer encodings work unless the installed Phaser parser supports them.

## 8. Playability checks

- All required facilities can be reached.
- Corridors connect correctly.
- Doors have clear passability rules.
- Collision does not block intended routes.
- REVO cannot walk through solid walls or large props.
- Interaction zones are reachable but not inside walls.
- The camera cannot expose unintended empty map areas.
- Foreground elements render in front of REVO where expected.
- No missing textures or invalid tileset references.

## 9. Visual consistency checklist

- Same pixel density across the world.
- Consistent outline thickness.
- Consistent top-down perspective.
- Consistent scale of doors and equipment.
- Clear contrast between walkable and blocked tiles.
- Readable corridors.
- Limited visual clutter around interaction points.
- Distinct silhouettes for facilities.
- Clear accessibility/readability for children.

## 10. Asset licensing

Every asset must have a source record in `docs/ASSET_LICENSES.md`. An asset with unknown provenance or terms must be marked `UNVERIFIED` and must not be represented as cleared for public redistribution.
