# Manual PixelLab asset specifications

This document specifies future deliverables. It does **not** contain generation prompts, submit jobs, create assets, or certify PixelLab features/rights. The owner will use the PixelLab website manually after reviewing individual prompts. No MCP/API or automation is authorized. PixelLab free-tier feature availability is **UNVERIFIED** from repository evidence; if a desired operation is unavailable without payment, use the listed free-tool fallback and ask before changing the art plan.

## Shared visual contract

- Style: cohesive top-down / low top-down pixel art, readable silhouettes, deliberate cluster detail, crisp hard pixel edges, controlled navy outline, consistent upper-left light, transparent background for isolated props/characters.
- Palette anchors: Mars orange, rust red, dark navy, white/light gray, cyan/turquoise, controlled yellow-orange alerts. Use a shared palette sheet; exact RGB values are an owner decision, not inferred from screenshots.
- Scale anchor: preserved REVO sprite frame is 42 × 64 px; map pitch is nominally 32 px; current candidate assets vary in source dimensions. Build matching scale references into prompt boards; do not stretch finished sprites to fit.
- Perspective/orientation: one agreed orthographic top-down or low top-down camera; doors face the same camera, roofs/floor plans remain legible, props show the same front/side visibility. The owner must approve the perspective sheet before mass production.
- Output: lossless PNG; alpha transparency for standalone objects; exact intended canvas and frame dimensions; no baked checkerboard/shadow unless specified; include a separate preview and unscaled source. No text glyphs when Phaser text can remain editable.
- Rights: store source tool, generation date/record if supplied by PixelLab, plan/license terms URL or snapshot in project records, modification permission, redistribution/commercial terms, attribution and owner approval. Keep `UNVERIFIED` until evidence is saved.

## Proposed asset specifications

| Planning ID | Required output and visual description | Canvas / transparency | Static/animation and direction | Tool / fallback / dependencies |
|---|---|---|---|---|
| VIS-001 | Compact reference board showing palette, outlines, lighting, materials, REVO size anchor and the one chosen camera angle | 512 × 512 or scalable board; opaque board acceptable | Static reference | PixelLab website only if free image tool supports it; otherwise assemble a reference board in Pixelorama/Krita/Inkscape. Preserve REVO; do not regenerate it. |
| VIS-002 | N.E.I.L. friendly compact ground/mobile robot: recognizable head/body, expressive display/face, wheels/legs/hover only after owner design choice, tool-free guidance gesture silhouette; not drone-like | 42 × 56 px first target, transparent; turnaround/side views may use separate frames | Static design sheet, front/side/back; no animation baked into turnaround | PixelLab manual character tool if available free; Pixelorama for pixel cleanup. Depends on VIS-001 and owner mobility/perspective choice. |
| VIS-004 | Repeatable floor material plus straight/corner/doorway wall cells; material contrast suitable for REVO | 32 × 32 px tile cells; alpha only where edges need it | Static tile family | Pixelorama/manual tile editing is preferable for seam control; PixelLab only if it can produce a consistent seamless sample free. |
| VIS-010–018 | Individual facility modules/assemblies with unmistakable silhouette, doorway clear opening, window/roof details and consistent scale; each module remains separate from background | Initial building assembly canvases 256 × 192 px target; transparent; may expand after map-footprint review | Static modular sprites/layers, no flattened map | PixelLab website for individual assets if free; assemble modular structure in Pixelorama. Depends on approved VIS-001/004 and map footprints. |
| VIS-020 | Solar array groups with visible panel grid/support structure, cable endpoint and inspectable controller separate | Array 128 × 96 px target, transparent; controller separate 48 × 48 px | Static; separate clean and dusty state art only if needed | PixelLab for individual array art if free; Pixelorama for variants. Must be outdoors and preserve approved solar architecture. |
| VIS-022–025 | Battery cabinet, power distribution and oxygen generation each separate and semantically readable; no unrelated generic substitution | Main equipment 64 × 80 px target, transparent; interaction consoles 96 × 64 px | Static with optional separate active/off states | PixelLab manual if free; UI data/labels remain code/text. Depends on approved facility module and real gameplay definitions. |
| VIS-030–035 | Lab bench/analyzer/sample group and greenhouse beds/plant stages in consistent top-down scale | Workstations 96 × 64 px; samples 16–24 px; plant trays 48 × 32 px | Static props plus crop stages as separate frames | PixelLab for individual coherent sprites if free; Pixelorama to ensure exact frame/grid matching. Scientific meaning must stay authored/data-reviewed. |
| VIS-040–044 | Shelter equipment, warnings, terrain, rocks and small exterior props | Facility props 32–64 px; terrain cell 32 × 32 px; transparent isolated sprites | Static; dust states separately named | Terrain seams/effects better handled in Pixelorama or listed free effect tools. No unsupported radiation-performance imagery/text. |
| VIS-051 | N.E.I.L. animation sheet, same 42 × 56 cell per frame, consistent pivot; directions/state naming provided separately | Transparent RGBA PNG; fixed 42 × 56 cells; no variable cells | Separate sheet per state/direction as enumerated in `ANIMATION_REQUIREMENTS.md` | PixelLab animation tool only if available in free plan; Pixelorama is the deterministic fallback. Do not infer frame ordering. |
| VIS-052 | Door leaf/frame states with stable opening bounds and no building-background pixels | 64 × 48 cell target, transparent; fixed pivot | 5 frames closed→open; same frames reversed for close | Pixelorama/manual cell animation preferred; PixelLab animation if free and output grid can be verified. |
| VIS-060–065 | Only distinct decorative frames/badges that benefit from pixel art; text, meters, markers and balloons remain code-driven | Icons 24 × 24 / 32 × 32; badge 48 × 48; transparent | Static, with simple state variants | Phaser-drawn UI or Pixelorama preferred. No generated words or baked resource values. |

Dimensions above are **starting canvas recommendations**, not accepted final asset measurements. Re-evaluate against the 1280 × 720 scale guide and owner-approved reference board before using a generation credit.

## Manual owner workflow and QA

1. Approve the individual specification and later prompt before opening PixelLab generation.
2. Use the website manually. Do not add the PixelLab MCP server, credentials, API calls, job submission, or automated downloads.
3. Save the original output to the designated generated-art intake folder only after the owner supplies it. Do not overwrite source assets.
4. Verify actual PNG width/height, alpha pixels, background artifacts, nearest-neighbor silhouette, palette and matching pixel density.
5. For sheets, verify exact cell size, row/column order, frame count, empty margins, pivot alignment and state labels. A preview or tool label is not verification.
6. Record metadata and license evidence. If license terms are not available/clear, keep status `UNVERIFIED` and do not ship/redistribute.
7. Owner reviews a contact sheet and approves/rejects each stable asset ID before any runtime mapping.

## Generation metadata templates

These examples define required fields and deliberately contain no fabricated generated-asset facts. `null` means the field must be measured or sourced when a real approved file arrives.

### `assets/generated/pixellab/metadata/asset-manifest.json`

```json
{
  "schemaVersion": 1,
  "assets": [
    {
      "assetId": "VIS-0000",
      "semanticKey": "category.semantic-name",
      "filename": "owner-supplied-file.png",
      "category": "",
      "width": null,
      "height": null,
      "alpha": { "channelPresent": null, "transparentPixelsVerified": null },
      "perspective": "",
      "frameCount": null,
      "frameWidth": null,
      "frameHeight": null,
      "generationSource": "owner-supplied",
      "sourceTool": "PixelLab website | other documented tool",
      "sourceRecord": null,
      "licenseStatus": "UNVERIFIED",
      "licenseEvidence": null,
      "approvalStatus": "pending_owner_review",
      "runtimeDestination": null
    }
  ]
}
```

### `assets/generated/pixellab/metadata/animation-manifest.json`

```json
{
  "schemaVersion": 1,
  "animations": [
    {
      "assetId": "VIS-0000",
      "animationName": "state-direction",
      "filename": "owner-supplied-sheet.png",
      "direction": "front | back | left | right | omnidirectional",
      "frameCount": null,
      "frameWidth": null,
      "frameHeight": null,
      "fps": null,
      "looping": null,
      "pivot": { "x": null, "y": null, "coordinateSpace": "frame-pixels" },
      "transparentBackgroundVerified": null,
      "eventMarkers": [],
      "frameOrderVerified": false,
      "approvalStatus": "pending_owner_review"
    }
  ]
}
```

### `assets/generated/pixellab/metadata/phaser-runtime-mapping.json`

```json
{
  "schemaVersion": 1,
  "mappings": [
    {
      "assetId": "VIS-0000",
      "semanticKey": "category.semantic-name",
      "runtimePath": null,
      "textureKey": null,
      "frameConfig": { "frameWidth": null, "frameHeight": null, "startFrame": null, "endFrame": null },
      "animationKeys": [],
      "scale": null,
      "origin": { "x": null, "y": null },
      "collisionBounds": null,
      "approvedForRuntime": false
    }
  ]
}
```
