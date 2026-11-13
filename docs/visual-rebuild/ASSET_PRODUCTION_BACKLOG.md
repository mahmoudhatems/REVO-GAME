# REVO visual production backlog

This is a planning inventory, not an art approval or a request to spend generation credits. Stable IDs below are planning IDs (prefix `VIS-`), not runtime catalog keys. All new items start `PROPOSED — owner approval required`; source and generated-art licenses start `UNVERIFIED`.

| Batch | Stable IDs and deliverables | Priority | Dependencies | Status |
|---|---|---|---|---|
| 1 — Visual Identity | VIS-001 style reference board; VIS-002 N.E.I.L. robot base design; VIS-003 N.E.I.L. animation set; VIS-004 coordinated floor/wall sample; VIS-005 approved palette and pixel-density sheet | P0 | Owner review of visual audit; preserve existing REVO; choose perspective and scale | Proposed |
| 2 — Core Architecture | VIS-010 communication hub assembly; VIS-011 modular habitat wall kit; VIS-012 door/frame/window kit; VIS-013 power-control exterior; VIS-014 life-support exterior; VIS-015 research exterior; VIS-016 greenhouse exterior; VIS-017 radiation-shelter exterior; VIS-018 airlock exterior | P1 | VIS-001 and VIS-004 approval; facility silhouettes/footprints in JSON reviewed | Proposed |
| 3 — Core Systems | VIS-020 external solar array set; VIS-021 inspection controller and cabling; VIS-022 indoor battery cabinet set; VIS-023 power-distribution console and screens; VIS-024 oxygen generator/filter/duct kit; VIS-025 communication consoles and monitors | P1 | VIS-001; matching facility kit from Batch 2; no fake system labels | Proposed |
| 4 — Science and Food | VIS-030 research bench; VIS-031 analyzer; VIS-032 sample vials/trays/tools; VIS-033 greenhouse grow beds; VIS-034 plant growth stages; VIS-035 irrigation/harvest kit | P2 | VIS-001; VIS-015/016; science content sourced separately | Proposed |
| 5 — Safety and Environment | VIS-040 shelter supplies and status signage; VIS-041 terrain tile family; VIS-042 rocks/craters/dust details; VIS-043 exterior signs/lights/fences; VIS-044 safety icons | P2 | VIS-001; VIS-017; no unverified radiation claims | Proposed |
| 6 — Animation and Feedback | VIS-050 REVO animation audit fixes (only if approved); VIS-051 N.E.I.L. idle/walk/talk/gesture; VIS-052 door state animation; VIS-053 equipment active states; VIS-054 warning beacon; VIS-055 effect/sound event map | P2 | Final static art for the relevant character/object; verified frame dimensions and anchors | Proposed |
| 7 — UI | VIS-060 minimap frame/markers; VIS-061 three-resource HUD (POWER, OXYGEN, FOOD; BATTERY sub-status); VIS-062 interaction/tutorial prompts; VIS-063 N.E.I.L. dialogue balloon and portrait; VIS-064 mission/day/notification panel; VIS-065 achievement badge and report card | P3 | VIS-001; child readability review; domain/UI contracts remain code-driven | Proposed |

## Batch 1 — Visual Identity

| ID | Asset | Why | Priority / dependency | Approval |
|---|---|---|---|---|
| VIS-001 | Art style board with front/side/back orientation, outline, palette, light direction, detail density and pixel grid; use REVO as the preserved character reference | Prevents mixing unrelated packs and establishes one visual vocabulary | P0; owner visual review | Proposed |
| VIS-002 | N.E.I.L. friendly mobile robot, full-body views and neutral turnaround | Introduces the approved companion identity; not a drone | P0; VIS-001 | Proposed; new character requires owner approval |
| VIS-003 | N.E.I.L. idle, travel, talk, happy, thinking and directional guidance animation sheet(s) | Supports companion presence and authored guidance | P0; VIS-002 | Proposed |
| VIS-004 | One coordinated interior floor and wall sample (straight, corner, doorway, transition) | Test repeatability and scale before producing all interiors | P0; VIS-001 | Proposed |
| VIS-005 | Pixel-density sample with REVO, N.E.I.L., door, screen and 32 px ground cell shown together | Exposes scale mismatch before full batch | P0; VIS-001/002/004 | Proposed |

## Batch 2 — Core Architecture

| ID | Asset | Priority / dependency | Approval |
|---|---|---|---|
| VIS-010 | Central Communications exterior assembly with distinct entrance, window bands and antenna details | P1; VIS-001/004 | Proposed |
| VIS-011 | Modular hab wall kit: straight, inner/outer corner, T-junction, floor edge, roof edge | P1; VIS-004 | Proposed |
| VIS-012 | Exterior/interior door frame, closed/open/transition leaf and status lamp; consistent doorway module | P1; VIS-011 | Proposed |
| VIS-013 | Power Control exterior identity, with no reactor imagery | P1; VIS-011 | Proposed |
| VIS-014 | Life Support exterior identity | P1; VIS-011 | Proposed |
| VIS-015 | Research Lab exterior identity | P1; VIS-011 | Proposed |
| VIS-016 | Greenhouse transparent/domed exterior assembly | P1; VIS-011 | Proposed |
| VIS-017 | Radiation Shelter reinforced exterior identity | P1; VIS-011/012 | Proposed |
| VIS-018 | Southern Entrance/Airlock assembly; accessible clear opening | P1; VIS-011/012 | Proposed |

Every building remains an independently placeable multi-sprite assembly with known art bounds and authored collision; do not produce one flattened base image.

## Batch 3 — Core Systems

| ID | Asset | Priority / dependency | Approval |
|---|---|---|---|
| VIS-020 | Solar array panels, supports, grouped array sizes and clean/dust-state variants | P1; VIS-001/005 | Proposed; remains exterior |
| VIS-021 | Solar inspection unit, conduit/cable segment, connector and readable status lamp | P1; VIS-020 | Proposed |
| VIS-022 | Battery cabinet/module family and charge-state lamp, clearly distinguishable from oxygen canisters | P1; VIS-023 | Proposed; indoors |
| VIS-023 | Power distribution console, labeled breaker group, solar/battery flow display, control surface | P1; VIS-001/005 | Proposed; indoors, values may be fictional UI data |
| VIS-024 | Oxygen-generation machine, air-filter unit, ducts, tanks and control display as separate art | P1; VIS-014 | Proposed; no generic-prop relabeling |
| VIS-025 | Communication console, two or more status displays, crew/base monitoring display, desk/chair and N.E.I.L. docking/interaction station | P1; VIS-010/002 | Proposed |

## Batch 4 — Science and Food

| ID | Asset | Priority / dependency | Approval |
|---|---|---|---|
| VIS-030 | Lab workbench and instrument surfaces | P2; VIS-015 | Proposed |
| VIS-031 | Sample analyzer / microscope-like device with no unsupported identity labels | P2; VIS-030 | Proposed |
| VIS-032 | Sample vial/tray, specimen marker, gloves and small tools | P2; VIS-030 | Proposed; labels require content review |
| VIS-033 | Greenhouse bed/tray and irrigation rails | P2; VIS-016 | Proposed |
| VIS-034 | 3–4 distinguishable crop growth/harvest stages in matching footprints | P2; VIS-033 | Proposed |
| VIS-035 | Watering/maintenance tool and food storage crate | P2; VIS-033/034 | Proposed |

## Batch 5 — Safety and Environment

| ID | Asset | Priority / dependency | Approval |
|---|---|---|---|
| VIS-040 | Shelter supplies, warning panel, heavy inner door detail | P2; VIS-017/012 | Proposed; avoid quantitative protection claims |
| VIS-041 | Terrain base set: seamless main ground, 2–3 controlled variants, sand path, edge/transition cells | P2; VIS-001/005 | Proposed |
| VIS-042 | Rock sizes, crater rims, dust patches and cracks | P2; VIS-041 | Proposed |
| VIS-043 | Antenna/dish, warning light, sign, fence, maintenance crate, pipe and outdoor cable props | P2; VIS-001/010/020 | Proposed |
| VIS-044 | Reviewed safety and facility pictograms with authored labels kept as text where possible | P2; VIS-001 | Proposed |

## Batch 6 — Animation and Feedback

| ID | Asset | Priority / dependency | Approval |
|---|---|---|---|
| VIS-050 | REVO frame mapping/idle/walk fixes only if the audit confirms the preserved sheet cannot support coherent loops | P2; frame audit + owner review; do not redesign identity | Proposed |
| VIS-051 | N.E.I.L. idle, 4-direction travel, talking, happy, thinking and guidance states | P2; VIS-002/003 | Proposed |
| VIS-052 | Door open/closed animation with fixed canvas and shared pivot | P2; VIS-012 | Proposed |
| VIS-053 | Solar/console active/inactive states and one-shot interaction feedback | P2; VIS-020/023/024/025 | Proposed |
| VIS-054 | Warning beacon loop; small, high-contrast and color-accessible | P2; VIS-044 | Proposed |
| VIS-055 | Document event names for footstep, console, door, alert and companion sounds | P2; animation sheet review | Proposed |

## Batch 7 — UI

| ID | Asset | Priority / dependency | Approval |
|---|---|---|---|
| VIS-060 | Bottom-left minimap frame, player marker, facility markers, path and hazard markers | P3; approved map bounds | Proposed; prefer Phaser-drawn frame/markers |
| VIS-061 | Resource presentation for POWER, OXYGEN, FOOD and BATTERY as a POWER sub-status | P3; gameplay state contract | Proposed; code-driven bars/icons where practical |
| VIS-062 | Contextual interaction and tutorial prompts, keyboard/touch state variants | P3; input contract | Proposed; code-driven |
| VIS-063 | N.E.I.L. tail speech bubble and optional portrait frame | P3; VIS-002/051 | Proposed; bubble shape/tail should be Phaser UI, not baked text art |
| VIS-064 | Mission day, objective, notification and communication-delay panels | P3; mission UI model | Proposed; authored text remains data |
| VIS-065 | Achievement badge set and final mission report card | P3; reward design | Proposed |

## Approval and intake gates

1. Owner selects/approves the style board and a small sample set (VIS-001/002/004/005).
2. Owner manually runs any approved PixelLab generation in the browser; no MCP/API or automated download. Do not spend paid credits or depend on paid-only functions.
3. Record original output, source, date, dimensions, alpha verification, applicable plan/license evidence and owner approval in the generated asset manifest.
4. Review pixel density, silhouette, consistency and animation frame alignment on contact sheets before asking for integration.
5. Only after owner approval, wire assets to the JSON runtime map and check sizes/collisions in Phaser.

## Stage 2D.3 status update (2026-11-12)

VIS-002 has been supplied in `assets/source/NEIL_Sprite_Pack/`, approved by the owner for project integration, and integrated as static directional poses. Its license remains `UNVERIFIED`. VIS-003 animation states remain proposed until frame sequence and timing are verified.
