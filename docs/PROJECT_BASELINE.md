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
