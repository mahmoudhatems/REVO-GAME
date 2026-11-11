# REVO — Supplied Asset Catalog

## Audit status

Stage 2A visual audit cataloged the recovered original-size archive without modifying source art. The canonical archive is `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/`; the secondary 32x32-named variant is not assumed to contain only 32×32 files. The JSON catalog has one record for each original-size manifest entry and includes stable contact-sheet ID/key, exact filename, source path, verified dimensions, category, PNG alpha-channel metadata, manifest source sheet and crop rectangle, conservative visual classification, intended use, approval state, and license state.

Counts: **2,207 catalog records** across 11 categories; **4,444 PNGs** across both variants (2,207 manifest assets plus 15 source sheets in each variant). All original-size manifest references resolve and dimensions match the manifest. The 15 original sheets were hash-verified across variants. Pixel-level transparent-pixel presence has not been audited; the catalog records alpha-channel metadata only. All licenses are `UNVERIFIED` until supported by provenance/terms.

Per-file visual review status: **332 CONFIRMED**, **1,701 CANDIDATE**, **174 UNIDENTIFIED**. Confirmed describes the visible asset type at a broad level (for example astronaut pose, wall segment, floor tile, or interface component); it does not approve final use or placement. Unidentified includes mixed/fragmentary source tiles that cannot be assigned a reliable purpose from the contact sheet.

## Category index and contact sheets

Contact-sheet pages contain 64 assets each, on checkerboard backgrounds with aspect-preserving thumbnails, stable IDs, filenames, and actual dimensions. The generated index is [contact-sheet-index.csv](./asset-contact-sheets/contact-sheet-index.csv).

| Category | Count | Contact sheets |
|---|---:|---|
| Ground_Tileset | 1,516 | [pages 1–24](./asset-contact-sheets/Ground_Tileset/) |
| Buildings | 7 | [page 1](./asset-contact-sheets/Buildings/) |
| Doors_Walls | 72 | [pages 1–2](./asset-contact-sheets/Doors_Walls/) |
| Walls_Modular | 49 | [page 1](./asset-contact-sheets/Walls_Modular/) |
| Panels_Glass | 52 | [page 1](./asset-contact-sheets/Panels_Glass/) |
| Floor_Tiles | 12 | [page 1](./asset-contact-sheets/Floor_Tiles/) |
| Tools_Equipment | 179 | [pages 1–3](./asset-contact-sheets/Tools_Equipment/) |
| Astronaut | 24 | [page 1](./asset-contact-sheets/Astronaut/) |
| Drone_Animations | 123 | [pages 1–2](./asset-contact-sheets/Drone_Animations/) |
| UI_Elements | 123 | [pages 1–2](./asset-contact-sheets/UI_Elements/) |
| UI_Icons | 50 | [page 1](./asset-contact-sheets/UI_Icons/) |

Catalog file: [asset-catalog.json](../src/data/assets/asset-catalog.json). Each file in a category folder is named `<category>-NN.png` and can be reviewed directly; see the index for the page and ID interval.

## Classification meaning

- **CONFIRMED** — visual identity is clear enough to name at the stated level; this does not itself approve final gameplay placement.
- **CANDIDATE** — plausible use based on appearance, but exact function, grouping, or placement needs owner approval.
- **UNIDENTIFIED** — the crop's purpose is unclear or the crop is a fragment; do not assign an identity.

The catalog intentionally avoids guessing exact function for ambiguous equipment. Category-level notes and the facility matrix are in [ASSET_AND_MAP_PIPELINE.md](./ASSET_AND_MAP_PIPELINE.md). Filename-derived category is not proof of semantic identity.

## Semantic classification summary

| Use | Evidence and classification |
|---|---|
| Exterior Martian terrain | **CANDIDATE** — many orange/red and blue/purple surface tiles, rocks, and edges; Ground_Tileset is mixed with text and other crops, so curate individual IDs. |
| Interior floor construction | **CANDIDATE** — Floor_Tiles show metal, patterned, and hazard-marked surfaces; verify dimensions and room scale. |
| Building modules | **CANDIDATE** — seven varied modules; exact facility labels are not established by appearance alone. |
| Solar arrays | **CONFIRMED visually** — BLD-0007 clearly depicts an array; some equipment crops also resemble panels. World usage remains subject to owner placement approval. |
| Battery storage | **UNIDENTIFIED as a dedicated asset** — containers/tanks are candidates only; no clear battery unit was confirmed. |
| Power distribution | **CANDIDATE** — consoles, displays, indicators, pipes/cabling-like details; no identified power-distribution unit. |
| Communication room equipment | **CANDIDATE** — screens, desks, antenna-like prop, communications-like icons; no confirmed dedicated N.E.I.L. terminal. |
| Oxygen generation | **CANDIDATE** — tanks, machinery, pipes, and O₂-like UI symbol; no dedicated generator confirmed. |
| Research laboratory | **CANDIDATE** — work surfaces, screens, shelving, and science-like props; no identified lab kit. |
| Greenhouse and food | **CANDIDATE** — dome-like module and seedling/plant-tray imagery; exact crop-production function needs owner review. |
| Radiation shelter | **CANDIDATE** — radiation-like icon/sign and heavy wall/door components; no dedicated shelter module confirmed. |
| Doors and airlocks | **CONFIRMED at visual level** — doors, hatches, and double-door forms are present; their exact assembly/passability is a map decision. |
| Player movement/animation | **CANDIDATE** — 24 astronaut poses show different orientations/poses; frame grouping and animation sequence need verification. |
| Interactive objects | **CANDIDATE** — consoles, machinery, doors, and props can be considered; interaction assignment is not encoded in source art. |
| Environmental decoration | **CANDIDATE** — rocks, plant/mineral-like pieces, terrain details; specific identities remain unverified. |
| HUD/gameplay feedback | **CANDIDATE** — UI frames, glyphs, icons, warnings, and status-like symbols; exact meanings and accessibility require approval. |

Drone_Animations are visually drone-like but are not N.E.I.L.; N.E.I.L. is accessed through terminals/dialogue. Do not assert meanings for icons without owner review.

## Facility coverage and missing dedicated artwork

| Approved facility/system | Supplied-art readiness | Dedicated artwork gap |
|---|---|---|
| Central Communication Room (main hub) | Candidate screen/terminal, desk, antenna, communications symbols | No uniquely confirmed N.E.I.L. terminal or named communication-room set. |
| External solar arrays | Solar-array image confirmed; small panel candidates | Verify intended module scale and repeatable array composition. |
| Battery storage | Generic container/tank candidates only | Clear battery-storage unit and connection detail. |
| Indoor Power Control | Candidate console/screen/indicator pieces | Clear power distribution console/control-room kit. |
| Oxygen Generation / Life Support | Candidate tanks, pipes, machinery, O₂ symbol | Clearly identifiable generator/filter equipment. |
| Research Lab | Candidate desks/screens/shelf/science-like props | Lab bench and identifiable sample/science props. |
| Greenhouse / food production | Greenhouse-like module and plant-tray candidates | Confirm crop trays/food production workflow; crop variety may be needed. |
| Radiation Shelter | Candidate radiation symbol and strong door/wall parts | Dedicated shelter silhouette/interior and shielding cues. |
| Main Entrance / Airlock | Door/hatch assets confirmed visually | Final airlock assembly and access details need map review. |

No external nuclear reactor is in the approved MVP. Do not infer one from generic machinery. See [the map plan](./ASSET_AND_MAP_PIPELINE.md).

## Reproduction and limits

Run `powershell -ExecutionPolicy Bypass -File scripts/asset-audit/generate-contact-sheets.ps1` from the repository root to verify manifest dimensions and regenerate contact sheets/catalog. The script reads source art and writes only generated review outputs and the requested JSON catalog. The per-file visual status is deliberately conservative; owner review is required before mapping, animation assembly, runtime import, or public redistribution. Licenses remain unresolved until the owner supplies source/permission records.
