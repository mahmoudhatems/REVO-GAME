# REVO — Alpha Base Exterior Map Blueprint (Stage 2B starting point)

> Stage 2B planning blueprint. The owner approved beginning Stage 2C implementation from this layout. Runtime implementation now lives in `src/data/maps/alpha-base-exterior.json`; actual dimensions, placements, asset statuses, and collisions are recorded there. This file preserves the original planning rationale and is not itself loaded by the game. Runtime collision/reachability still needs direct play verification.

## World frame

- **Draft size:** 80 × 45 tiles, nominal 32 × 32 px pitch, 2560 × 1440 px (16:9).
- **Fit:** Landscape composition with the habitat campus in the middle/south, an open solar field in the northeast, and a clear southern arrival apron. Maintain a walkable loop around the hub where room footprints allow.
- **Scale caution:** Source art is not uniformly 32 × 32. Selected building sprites range from 65 × 67 px to 100 × 77 px; walls are about 28–30 px wide/high, floor art is 60 × 64 px, and door sprites are 42–81 px wide. Room boxes below are construction footprints, not sprite dimensions. Validate seams and a consistent pixel scale before assembly.

## Facility positions

Bounds use `[x, y, width, height]` in tile units. They reserve room or outdoor zone footprints. Facility interaction points identify a proposed reachable approach tile.

| Facility | Bounds | Interaction point | Layout reason | Art and confidence |
|---|---:|---:|---|---|
| External Solar Arrays | `[62, 4, 15, 9]` | `(66, 11)` | Open northeast perimeter with an inspection path; keep buildings and tall decoration clear. | BLD-0007 at 83 × 69 px is confirmed as solar-array imagery; small panel props are candidates. |
| Radiation Shelter | `[16, 16, 8, 7]` | `(20, 19)` | West side of occupied campus, reachable from oxygen/life-support wing. | Door/wall pieces are candidates for a shelter enclosure; radiation icon UIC-0015 is only a symbol. |
| Oxygen Generation / Life Support | `[26, 16, 8, 7]` | `(30, 19)` | West-center, adjacent to shelter and connected to the hub. | No dedicated oxygen-generation machine is confirmed; equipment and O₂ icon candidates only. |
| Central Communication Room | `[36, 13, 13, 9]` | `(42, 18)` | Largest central footprint; main hub for N.E.I.L. and routes. | Generic module and workstation candidates; no asset is identified as N.E.I.L.'s terminal. |
| Indoor Power Control | `[49, 13, 9, 8]` | `(52, 17)` | Immediately east of communications for readable energy distribution access. | Console/rack candidates only; no confirmed electrical distribution unit. |
| Battery Storage | `[49, 22, 9, 7]` | `(52, 25)` | Indoors, below power control; visually connects storage with distribution. | No confirmed battery artwork; cylindrical props are generic analogues and must not be labeled as batteries. |
| Research Lab | `[26, 26, 10, 7]` | `(31, 29)` | Southwest branch off the main path, separate from life-support. | Generic room/workstation candidates; no distinctive lab apparatus is confirmed. |
| Greenhouse | `[60, 19, 12, 9]` | `(65, 23)` | East campus near service route and solar inspection path. | BLD-0003 visually resembles a glazed growing module; planted trays are candidates. |
| Southern Entrance / Airlock | `[38, 34, 10, 4]` | `(43, 36)` | Southern boundary approach aligned with the hub's main axis. | Several door forms are candidates; no verified inner/outer airlock pair or pressure-cycle art. |

The listed sprite dimensions and exact catalog records are in [the selection review](./ASSET_SELECTION_REVIEW.md). The solar zone is not an indoor building: its bounds reserve outdoor ground and access space. Battery storage and Power Control remain indoors. No nuclear reactor is included.

## Paths and circulation

Proposed two-tile-wide routes, specified by waypoints in the JSON draft:

| Route | Connection | Purpose |
|---|---|---|
| South main walkway | Airlock → Communication Room | Arrival corridor and primary hub approach. |
| West occupied wing | Communication Room → Oxygen Generation | Access life-support without merging its room with the hub. |
| Shelter connector | Oxygen Generation → Radiation Shelter | Short protected route to shelter. |
| Research branch | Main route → Research Lab | Separate research access. |
| East power service | Communication → Power Control → Battery → Greenhouse | Readable indoor energy/service corridor. |
| Solar inspection path | Greenhouse/service edge → Solar zone | Outdoor access for array inspection; preserve a safe, clear apron. |

The paths are polylines, not finished terrain tiles. Smooth corners, doorway alignment, and clear widths need visual review. The illustrative solar-to-power conduit route in JSON is a visual connection only, not an engineering schematic.

## Spawn, interaction, camera, and collision

- **Player spawn:** Tile `(43, 37)`, facing north, just inside the southern approach. Keep the entrance readable and leave the spawn tile clear.
- **Facility interactions:** One proposed approach tile per facility is listed in JSON. Place the actual prompt/trigger within reachable distance and outside solid wall sprites; confirm mobile input reach and avoid overlapping nearby triggers.
- **Collision:** JSON contains 46 proposed one-tile-thick interior wall rectangles generated from room bounds, with two-tile doorway gaps. The outdoor solar zone has no enclosing wall collision; individual solar props and placed furniture have provisional footprint flags. These are planning boundaries only: align collision to sprite silhouettes, resolve shared-wall overlaps, keep doorways passable, and separately test walkable paths before runtime use.
- **Camera:** Logical 1280 × 720 px viewport, clamped to the 2560 × 1440 px world, following the player. Initial focus is the airlock/hub approach. Recheck that the player, room names, interaction prompt, and nearby route stay in frame at desktop and narrow mobile sizes.

## Environmental decoration zones

- Northwest rock/crater field `[2, 2, 15, 39]`, kept clear of occupied west wing.
- North ridge `[18, 2, 42, 8]`, sparse variation while protecting solar exposure.
- East perimeter `[74, 14, 5, 25]`, sparse rocks and terrain edge details.
- South border `[2, 40, 76, 4]`, low-contrast boundary that does not obstruct entrance apron.

Select individual ground assets only after owner review. Keep sight lines to solar arrays and room entrances clear; avoid decorative clutter along paths and collision edges.

## Energy system consistency

Solar arrays are the approved primary energy source and remain outdoors. Battery storage and electricity distribution controls remain indoors, with Power Control managing distribution. A future dust storm reduces available sunlight and fictional solar generation, making stored battery energy more important. No numerical values are set, and no NASA engineering measurement is implied. No external nuclear reactor is part of this approved MVP.

## Approval and implementation gates

1. Owner approves or revises asset groupings, room footprints, pathing, and supplementary art needs.
2. Confirm sprite scale, wall/floor repetition seams, doorway clearance, and which props are safe to call batteries or oxygen equipment.
3. Resolve provenance and license records; keep unknown licenses `UNVERIFIED`.
4. Validate geometry, reachability, camera framing, and collisions in a visual map prototype before connecting this data to a Phaser Scene.

The original machine-readable proposal is [alpha-base-exterior-blueprint.json](./alpha-base-exterior-blueprint.json). It remains a planning reference; the owner-approved implementation source is `src/data/maps/alpha-base-exterior.json`.
