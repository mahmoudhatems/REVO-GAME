# Repository Baseline — 11 November 2026

This file records the pre-migration snapshot supplied by the team in `PROJECT_STATUS.md`. It is a historical baseline, not a substitute for inspecting the current repository. The coding agent must verify all facts before changing files and update this document after migration.

## 1. Existing applications

### Root application — actual game

- JavaScript ES Modules.
- Phaser 3.80.1 loaded from jsDelivr in `index.html`.
- No root `package.json` or Vite configuration at the time of the supplied review.
- Actual game, current scenes, menus, video, audio, map and player are in the repository root.

### Nested `revo/` application — separate template

- Vite 6.3.1.
- Phaser 4.0.0.
- Terser `^5.39.0`.
- Has `npm run dev`, `npm run build`, `npm run dev-nolog`, and `npm run build-nolog`.
- Still contains default Phaser template scenes; it is not the actual game.
- `npm run build-nolog` passed in the supplied review with a Vite bundle-size warning above the default 500 kB threshold.

## 2. Root game files

- `index.html`: viewport, Phaser CDN loading, and `src/main.js`.
- `src/main.js`: registers scenes and configures Phaser.
- `src/config/constants.js`: world dimensions, tile dimensions, asset paths, fonts.
- `src/data/worldData.js`: room, corridor, door, and color definitions.
- `src/data/pagesData.js`: instruction and mission briefing page text.
- `src/utils/grid.js`: tile map generation, walls, room lookup.
- `src/utils/audio.js`: Web Audio sound effects and background music.
- `src/utils/ui.js`: Mars background, buttons, audio UI, scene transitions.
- Scenes: `BootScene`, `PreloadScene`, `MenuScene`, `PagedScene`, `IntroScene`, `GameScene`, `UIScene`, `PauseScene`.

## 3. Existing functionality

- 48 × 32 tile map.
- 32 × 32 pixel tiles.
- World dimensions: 1536 × 1024.
- Rooms include Power Station, Life Support, Greenhouse, Radiation Shelter, Central Habitat, and Airlock, plus corridors and doors.
- Directional player movement with WASD and arrow keys.
- Character animations in multiple directions.
- Mobile movement and interaction controls.
- Basic wall collision.
- Responsive camera scaling.
- Arabic instruction and briefing pages.
- Intro video, skip control, fallback message if playback fails.
- Music and effects generated with Web Audio API.
- Pause and resume; returning to menu ends the current session.

## 4. Current implementation gaps

The supplied review found that the UI copy mentions a 30-day scenario, battery, oxygen, radiation, missions, decisions, and events, but the actual game logic did not yet implement:

- day counter / 30-day progression;
- resource state and resource consumption;
- meaningful choices and consequences;
- mission event scheduling;
- dust storm or other event systems;
- win/loss/endings;
- persistent progress.

The current E interaction only displays the room name.

Do not describe these systems as implemented until code and runtime verification confirm they work.

## 5. Existing assets

- `assets/revo.png`: player sprite sheet, loaded with frame size 42 × 64 according to the supplied review.
- `assets/logo.png`: game logo.
- `assets/intro.mp4`: intro video, approximately 11.01 MB.
- `assets/alpha.png`: approximately 2.89 MB; no use was found in the reviewed root code.
- Nested template assets under `revo/public/assets/` are separate from the root game.

The supplied review did not verify ownership or licenses for all visible assets.

## 6. Run and verification status at baseline

- Root application: serve the root folder over HTTP and open `index.html`; it needs internet access for Phaser CDN loading.
- Nested template: run `npm install` then `npm run dev-nolog` from `revo/`.
- Root JavaScript files passed `node --check` in the supplied review.
- No interactive browser verification of the root game was performed in that review.

## 7. Security issue identified

The supplied review reported that `.vscode/mcp.json` contains a PixelLab credential, is tracked by Git, and exists in `origin/main`. Treat it as compromised:

1. The owner must revoke/rotate the credential with PixelLab.
2. Never print or copy the old value.
3. Stop tracking the local credential file and ignore it.
4. Rewriting Git history is a separate operation and must not be done without explicit owner approval and team coordination.

## 8. Migration outcome to record

After migration, replace this section with verified facts:

- new root Phaser version;
- new root Vite version;
- final project structure;
- migrated scenes and features;
- map source of truth;
- tests actually run;
- runtime checks actually performed;
- unresolved migration issues.

## 9. Stage 0 and Stage 1 progress — 11 November 2026

This section records the verified intermediate state after the first root consolidation step. The migration is not complete.

- A local checkpoint branch, `checkpoint/revo-pre-consolidation`, points to the pre-migration `development` commit. It preserves the tracked application baseline; pre-existing untracked documentation remains in the working tree.
- The root now has a Vite application with exact dependencies Phaser 4.2.1 and Vite 6.3.1, a lockfile, and `dev`, `build`, and `preview` scripts.
- The root Phaser CDN script was removed. Phaser is imported as an ES module by the root entrypoint, scenes, and UI helper.
- The existing `src/` application and its gameplay implementation remain in place. The legacy `revo/` template has not been deleted or changed.
- `assets/logo.png`, `assets/revo.png`, and `assets/intro.mp4` were copied into `public/assets/` for Vite. The original files remain in `assets/`. `assets/alpha.png` was inspected and preserved as an unused concept image; it includes solar arrays and is not copied into runtime assets.
- The local `.vscode/mcp.json` remains on disk and is ignored, but is no longer tracked in the current index. Existing Git history was not rewritten.
- The categorized asset source bundle is present under `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/` (an extra repeated directory level compared with the supplied tree). It contains `01_Original_Size/`, `02_32x32_Where_Possible/`, 4,444 PNGs across both folders, and an `Asset_Manifest.csv` with 2,207 entries. All manifest entries resolve to files. Fifteen source sprite sheets in the two folders were hash-checked and are identical copies. Sampled images use a 32-bit ARGB format; the `02_32x32_Where_Possible` set retains native dimensions for sampled non-tile sprites, so do not assume every asset is 32×32. Actual transparency contents have not been audited.
- The categorized archive contains source tile and sprite imagery, but no Tiled map export (`.tmj`/`.tmx`), Tiled tileset metadata (`.tsx`/`.tsj`), mission JSON, or validated NASA data extracts. No NASA data integration is claimed.
- Stage 2A generated review sheets for all 11 source categories and a 2,207-record catalog at `src/data/assets/asset-catalog.json`. The archive remains unchanged. Contact-sheet generation verified each original-size manifest path and dimensions. The asset license state remains `UNVERIFIED`; transparent pixel contents have not been audited.
- The latest owner-approved map/energy architecture supersedes the older baseline text above: external solar arrays and battery storage are included, indoor Power Control distributes electricity, and no external nuclear reactor is part of the current MVP. See `docs/DECISION_LOG.md`.
- Proposed exterior map for review: 80 × 45 tiles at 32 px (2,560 × 1,440 px). This is a planning recommendation only; no map has been authored.
- Verification performed: root `npm run build` succeeded with a bundle-size warning (about 1.72 MB minified JavaScript); the Vite development server rendered a browser canvas. This was a smoke check, not full gameplay verification. No test suite is configured yet.
- Remaining migration work: Phaser 4 runtime/input checks, interaction and asset-load verification, test/lint/format setup, map and mission source recovery, and full browser verification. The existing game still uses its procedural JavaScript map and does not yet implement the documented mission systems.

## Stage 2C implementation status (2026-11-11)

The historical Stage 0/1 and Stage 2B entries above describe earlier snapshots. The root Phaser 4.2.1/Vite 6.3.1 application now renders `src/data/maps/alpha-base-exterior.json` as an 80 × 45, 32 px nominal JSON-driven exterior world. The map is rendered by reusable world-layer code and uses a curated runtime set of 27 images copied from the canonical archive; source originals remain unchanged. No Tiled runtime dependency was added.

All nine approved sites have map footprints and interaction registrations. The Central Communication Room is the hub; solar arrays remain outside; power control and battery storage are indoors; oxygen generation is separate. This is an outdoor navigation and facility-inspection foundation only. Dedicated N.E.I.L. terminal, battery-storage, and oxygen-generation art are absent; these areas are explicitly labeled placeholders. Other facility modules and props retain candidate status where the catalog says `CANDIDATE`. No external nuclear reactor, 30-day progression, resource simulation, NASA data integration, or authored mission system is implemented.

The current character, keyboard/touch movement, camera follow, collision bodies, and facility prompt are connected to the map. Build and automated verification results are recorded in the Stage 2C acceptance log in `docs/ROADMAP_AND_ACCEPTANCE.md`; browser checks are reported there only after actually performed. A generated bundle-size warning remains to assess. Asset licenses remain `UNVERIFIED`.

## Stage 2B owner review package (2026-11-11)

- Prepared a non-runtime shortlist of 47 unique canonical original-size assets, grouped across the nine approved facilities plus shared player-art candidates. Exact catalog IDs, semantic keys, filenames, source paths, dimensions, contact-sheet pages, visual classifications, confidence, missing components, and supplementary art needs are in `docs/asset-review/ASSET_SELECTION_REVIEW.md`.
- Added a local read-only gallery at `docs/asset-review/index.html`, filtered by facility/shared group, source category, classification, and search. The gallery embeds metadata and refers to original source images; it does not edit or copy source artwork.
- Pixel-audited only the shortlisted 47 PNGs. All have transparent pixels; none is fully opaque. Ten include some fully black opaque pixels: five astronaut crops (up to 13.94%) and five door/UI art crops (up to 0.43%). The astronaut pixels were visually inspected as outlines/shading, not a rectangular black background. Manifest crop rectangles are within 256×256 source sheets and crop dimensions match the extracted files. The selected PNGs are individual static crops. The five astronaut crops originate from a 24-pose sheet, but frame order, registration, and a consistent animation loop remain unverified. See `docs/asset-review/shortlisted-asset-audit.csv`.
- Drafted `docs/asset-review/alpha-base-exterior-blueprint.json` at 80×45 tiles, 32 px nominal pitch, 2560×1440 px (16:9). It has nine facility/site footprints including exterior solar, six paths, proposed object placements, collision rectangles, facility interaction points, player spawn, camera framing, and decoration zones. It is planning data only and is not connected to runtime.
- The archive and all source artwork remain unchanged. Asset licenses and provenance remain `UNVERIFIED`. Battery, power-distribution, oxygen-generation, and airlock system art remain partly or wholly generic candidates pending owner review or supplementary art. No Phaser Scene, runtime map loader, or gameplay mechanic was changed.

## Stage 2D.1 implementation status (2026-11-12)

The root Phaser 4 application now has the first reusable facility-entry flow and a data-driven Communication Room interior. The exterior entrance is proximity-gated and accepts E, Space, or the existing mobile action. Its door remains a separate sprite over the JSON-authored map. The `DOR-0005`/`DOR-0006` visual transition is a development cross-fade between catalog candidate images, not a verified frame animation. Communication Room collision now leaves a southern doorway gap.

The interior uses `src/data/interiors/communication-room.json` and one Phaser `InteriorScene`. It has a floor, wall boundaries, a door/exit, REVO movement and collision, and three authored information interactions. N.E.I.L. and the main console are drawn development placeholders; the status display uses `EQP-0055`, which remains a catalog candidate. Returning resumes the original exterior Scene at the saved coordinates and facing. The game has no resource simulation to preserve yet.

Automated verification on 2026-11-12 passed: ESLint, 13 Vitest tests across three files, and the Vite production build. The build retains a large-chunk warning (3,494.28 kB minified; 463.30 kB gzip). Browser verification reached the exterior entrance prompt, entered the interior with E, and showed REVO movement and the N.E.I.L. proximity prompt. Captures of the actual Phaser canvas are in `docs/screenshots/stage2d1-exterior.png` and `docs/screenshots/stage2d1-communication-room.png`. Interaction result panels, interior collision, exact return state, touch action, pause/resume, audio retention, and responsive fixed-UI framing remain unverified; Stage 2D.1 is not complete yet. See `docs/ROADMAP_AND_ACCEPTANCE.md` for the evidence log.
