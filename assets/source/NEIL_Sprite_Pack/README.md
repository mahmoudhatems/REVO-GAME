# N.E.I.L. Sprite Pack — REVO

## Included
- 24 individual transparent 64×64 PNG frames.
- 4 clean horizontal directional sprite sheets (384×64 each).
- JSON asset manifest.
- JSON animation manifest.
- Labeled visual preview.

## Direction mapping
- `south`: front-facing, face visible (source row 1)
- `west`: left-facing side profile (source row 2)
- `east`: right-facing side profile (source row 3)
- `north`: rear-facing (source row 4)

## Frame naming
`neil_<direction>_<index>.png`, for example `neil_south_01.png`.

## Game-ready sheets
- `game_ready/spritesheets/neil_south.png`
- `game_ready/spritesheets/neil_west.png`
- `game_ready/spritesheets/neil_east.png`
- `game_ready/spritesheets/neil_north.png`

Each sheet contains six horizontal 64×64 frames and is ready to be loaded as a Phaser spritesheet with:
`{ frameWidth: 64, frameHeight: 64 }`

## Important animation limitation
The source image is a 6-column × 4-row character sheet. The rows are treated as directional views based on the visible orientation. The six frames in each row are preserved in order, but they are **not verified as continuous tank-track locomotion cycles**. Review them before defining a looping `drive` animation. They may be poses/expressions or animation frames.

## Processing
- Source image: 256×256 RGBA PNG.
- Original pixel artwork was not rescaled.
- Each sprite was isolated from transparent gutters, centered horizontally and aligned to a shared ground-contact baseline in a 64×64 transparent cell.
- No labels are baked into the game-ready sprites.
- Labeled filenames are provided in `preview/neil_labeled_contact_sheet.png`.

## Suggested project destination
Copy the `game_ready/` content into:
`public/assets/characters/neil/`

Keep JSON metadata in:
`src/data/assets/neil/` or the project's approved asset metadata location.

## License
This pack is a derivative crop/layout of the user-provided PixelLab output. Confirm the applicable PixelLab plan/output terms before public redistribution. No license is asserted by this pack.
