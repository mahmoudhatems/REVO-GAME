# REVO visual audit and rebuild plan

**Status:** audit only; owner visual direction is accepted, all proposed replacement art remains unapproved. No runtime code, source art, map geometry, or generated art was changed for this audit.

## Evidence inspected

- Current Phaser implementation: `src/main.js`, `src/scenes/GameScene.js`, `src/scenes/InteriorScene.js`, `src/features/player/presentation/PlayerControls.js`, `src/features/world/render/MapLayerRenderer.js`, `src/data/maps/alpha-base-exterior.json`, and `src/data/interiors/communication-room.json`.
- Current captures: [`../screenshots/stage2d1-exterior.png`](../screenshots/stage2d1-exterior.png) and [`../screenshots/stage2d1-communication-room.png`](../screenshots/stage2d1-communication-room.png).
- The player source `assets/revo.png` is a 256 × 256 PNG with 36,441 fully transparent pixels and no partial-alpha pixels, measured with System.Drawing. It is divided by the runtime loader into 42 × 64 cells (6 columns × 4 rows; 24 frame slots). The displayed sheet contains helmeted poses in its upper two rows and a visually different, unhelmeted orange-haired figure in its lower two rows. Runtime animation keys use frames from both groups: exterior keys use indices in the first 12, while interior keys use indices 12–23. This is a concrete continuity issue, not a license to replace the owner's character.
- The asset catalog contains 2,207 original-size records: 1,516 Ground_Tileset, 7 Buildings, 72 Doors_Walls, 49 Walls_Modular, 52 Panels_Glass, 12 Floor_Tiles, 179 Tools_Equipment, 24 Astronaut, 123 Drone_Animations, 123 UI_Elements, and 50 UI_Icons. Catalog classifications are 332 CONFIRMED, 1,701 CANDIDATE, 174 UNIDENTIFIED; all 2,207 license states are `UNVERIFIED`. These counts describe source inventory, not final-approved art.
- There are 40 contact-sheet files including the CSV index (39 image pages). Source contact sheets remain the reference for the full recovered archive; the runtime uses a curated subset rather than loading all records.

## Current visual quality

| Area | Observed implementation | Why it reads as a prototype | Production direction |
|---|---|---|---|
| Exterior composition | The capture shows an orange field with sparse procedural marks, narrow path bands, a few small structures and extensive empty areas. The 80 × 45 JSON map is 2,560 × 1,440 px. | `renderGround()` makes one flat fill and adds a deterministic accent to only a fraction of cells. The visual ground is not an authored terrain system. Building art is 73–100 px wide while facility outlines span 256–480 px, leaving large unmatched footprints. | Build a tileable terrain family, authored path edges, readable habitat assemblies, consistent scale and a deliberate silhouette hierarchy. Keep paths brighter and quieter than props. |
| Building identity | Current visible modules come from candidate BLD-0001/0003/0004/0005 and solar array BLD-0007. Several approved sites have labeled placeholders. | Seven catalog building crops are not a complete, owner-approved facility kit. Current map facility footprints do not match the individual module dimensions. | Produce separate exterior assemblies and repeatable wall/window/door kits; retain independent JSON placement and collision. |
| Interior | The capture shows a 640 × 448 room tiled with FLT-0001 and repeated WAL-0002/0003 corner pieces. | Repeated floor panels dominate; console and N.E.I.L. art are code-drawn development placeholders; the equipment labels compete with the action prompt; current view clips fixed UI at this browser viewport. | Establish a larger navigable room, clear interaction stations, wall/floor variation, authored depth and readable code-driven UI after owner art review. |
| REVO | `assets/revo.png` renders at 42 × 64 per Phaser frame; screenshot character is smaller than the large room panels and hard to locate on the orange exterior. | Current animation mappings mix helmeted and unhelmeted rows between outdoor/indoor keys; no authored idle state or verified footstep cadence is present. | Preserve the approved identity. Audit frame-to-direction mapping, consistent helmet/suit rows, opaque bounds and idle/walk loops before asking for any new REVO art. |
| N.E.I.L. | The current interior draws a small screen labeled “N.E.I.L. DEV PLACEHOLDER.” | This is a terminal placeholder and conflicts with the owner's current decision: N.E.I.L. is a companion robot, not a drone or terminal-only assistant. | Create an original friendly ground/mobile robot with a clear silhouette and authored dialogue bubble. Do not use Drone_Animations as a substitute. |
| Scale and pixel density | Source art ranges from tiny 4–7 px marks to 100 × 77 px building crops; the astronaut frame is 42 × 64. | The mixed archive includes text/logo fragments in Ground_Tileset and sprites from multiple source sheets; similar nominal pixel dimensions do not establish a shared style. | Define a scale/style sheet and approve one coordinated asset batch before atlasing or runtime replacement. |
| Hierarchy and feedback | Labels are small, dark-backed, and appear over structures; interior status text and prompts occupy the same visual region. | Facility identity, current action, navigation, and status do not yet have a consistent visual hierarchy. | Keep primary action and core resources prominent, secondary data contextual, and minimap uncluttered. |
| Atmosphere, lighting, sound | Current map uses flat color and tile marks; audio implementation is Web Audio generated tones. | No cohesive dust, lighting, animated machinery, surface footsteps, or material-aware audio is visible/audible from the inspected code. | Use restrained dust/lighting layers and authored sound effects, with accessibility controls and no paid tools. |

The exterior capture is evidence of composition and scale, not a final art sample. The interior capture is evidence of placeholder hierarchy and viewport clipping. Neither was edited for this audit.

## Preserve / temporary / replace / missing / review

| Status | Current inventory | Decision |
|---|---|---|
| **KEEP** | `assets/revo.png` and its runtime copy `public/assets/revo.png` | Only currently approved character artwork. Preserve identity and file. License remains `UNVERIFIED`; visual approval does not grant redistribution rights. |
| **TEMPORARY** | Current 27 map textures, FLT-0001, DOR-0006, candidate wall/door/equipment crops, `assets/logo.png`, `assets/intro.mp4`, and procedural render embellishments | Retain to keep the prototype usable while the replacement set is produced. Do not call them final-approved art. The logo/video also need rights and visual review. |
| **REPLACE** | Flat procedural ground treatment; current candidate building assemblies; placeholder N.E.I.L. screen; code-drawn main console; candidate door cross-fade; small repeated floor treatment; unreviewed candidate props in final-facing scenes | Replace or recompose only after asset approval. The JSON map remains the runtime source of truth and should reference new independent assets, not a flattened overview. |
| **MISSING** | N.E.I.L. companion; coherent Mars terrain family; complete modular exterior architecture for all facilities; approved interior kit and facility-specific equipment; consistent door-state animation; dialogue balloon art/implementation polish; dedicated battery and oxygen-generation visual language; minimap and final HUD art; material-specific audio/VFX | Produce in dependencies below. Do not label generic tanks or equipment as named systems. |
| **NEEDS REVIEW** | Every supplied visual other than REVO, including all 332 broadly CONFIRMED catalog rows and all runtime-selected assets | Broad visual identity does not equal final approval, role approval, or rights clearance. Run owner review page by page, especially the candidate greenhouse/building/panel/door art. |

## Facility-by-facility gap summary

| Facility | Existing evidence | Final art needed |
|---|---|---|
| Central Communication Room | BLD-0001 candidate module; EQP-0055 candidate monitor; EQP-0058 candidate desk/computer; WAL-0002/0003 confirmed modular forms | Owner-approved habitat exterior, actual communications console and multiple displays, crew/base status screens, a N.E.I.L. robot docking/interaction area, readable signs and a wall/floor kit. |
| External solar arrays | BLD-0007 visually depicts solar-panel array; EQP-0019/0020 resemble small arrays | A coordinated array module, support, inspectable controller, ground conduit/cable route, and optional clean/dust-covered states. Keep outside. |
| Indoor Power Control | EQP-0004 has control panel/gauges; EQP-0006/0017 are equipment/rack candidates | Dedicated distribution console, breakers, solar/battery status screens, conduits and accessible interaction zones. |
| Battery storage | BLD-0006 and EQP-0001/0068/0069 look like storage/canister forms only | Dedicated battery cabinet/modules, charge state indicator and connector; do not repurpose cylinders as final batteries. |
| Oxygen / Life Support | EQP-0005 and EQP-0049 are generic machinery candidates; UIC-0011/0012 show O₂ symbols | Generator/filter unit, tanks/ducts, clearly labeled monitoring display and maintenance interaction. O₂ icons are UI symbols, not machine art. |
| Research Lab | EQP-0055/0058 workstation candidates; EQP-0056 shelves | Lab bench, analyzer, sample kit, shelves, screens and research signage. Keep real NASA facts as separate attributed data. |
| Greenhouse | BLD-0003 greenhouse-like candidate; EQP-0045–0048 show plant trays | Owner-approved greenhouse exterior/interior kit, growing beds, irrigation, growth stages and harvesting tools. |
| Radiation Shelter | UIC-0015 radiation trefoil; wall/door crops | Reinforced room assembly, heavy door, supplies, status indicator and child-friendly signage. No unsupported shielding efficacy claims. |
| Entrance / Airlock | DOR-0005/0006/0009 visually door/hatch-like candidates | Complete modular pressure-door assembly, frame, status lights, inner/outer door states and passable clear width. |

## Scale continuity finding

`assets/revo.png` is 256 × 256, loaded as 42 × 64 frames. Current facility modules are 73 × 72 through 100 × 77 px. The map uses 32 px nominal tiles and 80 × 45 cells. These are measurable anchors; they do not justify stretching the modules or choosing arbitrary tile dimensions. The current communication footprint is 13 × 9 tiles (416 × 288 px), far larger than its 100 × 77 px module crop. A final design should use multi-part assemblies whose visible silhouette and collision bounds agree, not simply scale the single crop to fill that footprint.

## Owner decisions recorded for this rebuild

- REVO is the approved player character and must be preserved.
- N.E.I.L. is **Navigation & Exploration Intelligence Link**, a dedicated friendly robot companion, not a drone and not terminal-only.
- All other existing visual art is temporary, replaceable, or awaiting owner review. No supplied asset is final-approved solely by presence or catalog classification.
- PixelLab is an owner-operated manual website workflow. No MCP, API, external image generator, paid tool, or automated job/download is authorized.
- Every generated asset requires owner visual approval and provenance/license review before runtime integration.
- Keep Phaser 4.2.1 + Vite, JSON-driven map data, and external solar/battery/indoor Power Control architecture.

## Limits and blockers

The source contact sheets and catalog preserve source metadata, but PNG alpha-channel presence is not the same as a pixel-level transparency audit. This audit measured transparency for the player sheet only. PixelLab plan rights and generated-output rights have not been verified. No generation jobs or new art were created. Final asset selection, license evidence, art approval, runtime integration, and responsive visual QA remain gates.

## Stage 2D.3 update � N.E.I.L. source pack

The owner-approved pack is now integrated from preserved source files as a tracked robot companion. Only stable directional poses are displayed; movement sequence and animation timing remain unverified. PixelLab rights remain `UNVERIFIED`. This supersedes the earlier audit statement that N.E.I.L. artwork was missing. The supplied base character resolves VIS-002 delivery; VIS-003 animation verification remains proposed.
