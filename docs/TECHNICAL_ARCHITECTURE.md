# REVO — Technical Architecture and Migration Standard

## 1. Target stack

As checked on 11 November 2026, the Phaser official archive lists Phaser 4.2.1 as the latest Phaser 4 release. Pin exact versions in `package.json` and `package-lock.json` after confirming compatibility.

- Phaser 4.2.1: https://phaser.io/download/release/v4.2.1
- JavaScript ES Modules.
- Vite.
- JSON-driven map data validated and loaded by the Phaser 4 world/map adapter. Tiled is optional, not a required dependency.
- Vitest.
- ESLint.
- Prettier.
- Git/GitHub.
- Vercel.

Phaser 4.2.1 official documentation: https://docs.phaser.io/  
Phaser 3-to-4 migration guide: https://phaser.io/news/2026/04/migrating-from-phaser-3-to-phaser-4-what-you-need-to-know

## 2. Current baseline and migration constraint

At the supplied baseline:

- root game uses Phaser 3.80.1 via CDN;
- `revo/` is a separate Phaser 4.0.0 + Vite 6.3.1 template;
- the actual game is in the root;
- the inner template is not the game.

Target: one root Vite + Phaser 4 application containing the real REVO game. No duplicate active copy.

Do not blindly copy the empty inner template over the root game. Migrate the working root game deliberately, preserving scenes, player assets, audio, intro, menus, controls, and map.

## 3. Phaser 4 migration rules

- Read the official migration guide and version-specific changelog.
- Use Phaser 4-compatible ES module imports and APIs.
- Verify every changed API against the installed Phaser 4.2.1 package/types/docs.
- Inspect renderer, tint, FX/masks, shaders, lighting, removed classes, camera, scale, physics, text, input, animation, tweens, and audio changes.
- Do not assume Phaser 3 defaults or import patterns remain valid.
- Do not upgrade through `latest` without recording the exact resolved version.
- Do not claim migration completion on build success alone; verify actual gameplay.

## 4. Pragmatic Feature-Based Clean Architecture

The architecture should be understandable to a small hackathon team. It should separate business rules without creating excessive boilerplate.

### Domain

Pure JavaScript entities, value objects, rules, and domain services. No Phaser imports, browser display objects, or direct LocalStorage calls.

Examples:

- `ResourceState`
- `MissionState`
- `MissionDay`
- `Decision`
- `MissionEvent`
- `EndingEvaluator`
- resource transition rules

### Application

Coordinates use cases and feature workflows.

Examples:

- `StartMission`
- `AdvanceMissionDay`
- `InspectFacility`
- `InteractWithFacility`
- `ApplyDecision`
- `ResolveEvent`
- `EvaluateEnding`

### Infrastructure

Implements external boundaries:

- Phaser map and physics adapters;
- validated JSON map loading;
- JSON content repositories;
- asset loading;
- local persistence;
- audio adapter;
- NASA cached-data repository.

### Presentation

Phaser scenes, game objects, camera, HUD, menus, dialogue panels, interaction prompts, animation, visual effects, and input.

## 5. Dependency direction

Preferred dependency flow:

`Presentation → Application → Domain`

`Infrastructure → Application/Domain interfaces`

Domain must not depend on Application, Infrastructure, Phaser, Vite, or DOM.

Scenes should orchestrate use cases and render state. They should not contain resource formulas, decision scoring, or mission scheduling rules.

## 6. Suggested root structure

Adapt it to the actual code; avoid creating empty files just to match a diagram.

```text
src/
├── app/
│   ├── createGame.js
│   ├── gameConfig.js
│   └── registerScenes.js
├── scenes/
│   ├── BootScene.js
│   ├── PreloadScene.js
│   ├── MenuScene.js
│   ├── IntroScene.js
│   ├── OutpostScene.js
│   ├── PauseScene.js
│   └── ResultScene.js
├── features/
│   ├── player/
│   ├── world/
│   ├── interaction/
│   ├── communication/
│   ├── resources/
│   ├── facilities/
│   │   ├── power/
│   │   ├── oxygen/
│   │   ├── greenhouse/
│   │   ├── research/
│   │   └── radiation/
│   ├── missions/
│   ├── decisions/
│   ├── events/
│   ├── ui/
│   ├── audio/
│   └── localization/
├── infrastructure/
│   ├── map-loader/
│   ├── asset-loader/
│   ├── storage/
│   └── nasa-data/
├── shared/
│   ├── constants/
│   ├── events/
│   ├── errors/
│   └── utils/
└── data/
    ├── maps/
    ├── missions/
    ├── events/
    ├── dialogues/
    └── nasa/
```

## 7. Code standards

- ES modules only.
- Prefer small modules and explicit exports.
- Avoid giant Scenes and oversized update loops.
- Avoid circular dependencies.
- Avoid global mutable state.
- Use constants/config for tunable values.
- Use JSDoc for important public interfaces and data contracts.
- Validate JSON content at load time.
- Use seeded randomness for reproducible scenarios.
- Separate feature UI from domain state.
- Keep error messages actionable.
- Do not add patterns that the current scope does not need.

## 8. Vite and scripts

One root `package.json` and one lockfile.

Expected scripts:

- `dev`
- `build`
- `preview`
- `test`
- `test:watch`
- `lint`
- `format`
- `format:check`
- `check`

The exact script definitions should reflect the installed tools. No placeholder command may be marked as working.

Use `import * as Phaser from 'phaser'` if confirmed by the selected Phaser 4 ESM build. Do not load Phaser from CDN once the package is installed locally.

## 9. State management

No external state-management framework is required.

Use a mission state model in the Domain/Application layer. Scenes/UI subscribe to or receive state updates through explicit boundaries. Keep the current mission state in memory; save snapshots to LocalStorage only where required.

Version save data, validate it, and handle corrupted or old saves gracefully.

## 10. Testing

Use Vitest for pure domain logic:

- resource changes and boundaries;
- mission day progression;
- event scheduling and resolution;
- decision consequences;
- ending evaluation;
- save serialization and validation.

Add integration checks for JSON map validation, asset keys, collision setup, and use-case wiring.

Browser verification is required for visual/interaction changes. A successful Vite build is not proof that the game plays correctly.

## 11. Rendering and performance

- Landscape-first 16:9 logical viewport; confirm final resolution against the HUD and art assets.
- Responsive scaling without sprite distortion.
- Nearest-neighbor/pixel-crisp rendering.
- Camera bounds and follow behavior.
- Sensible object depth sorting.
- Avoid creating objects every frame.
- Avoid excessive particles and heavy filters.
- Avoid duplicate asset loads.
- Support keyboard and touch input.
- Test at desktop and mobile viewport sizes.

## 12. Security and deployment

- No secrets in client code or Git.
- Do not expose NASA API keys in browser bundles.
- Prefer curated NASA JSON for the MVP.
- Vercel deployment must use the correct root directory and Vite build output.
- Do not add serverless functions unless explicitly required.

## Stage 2D.1 facility vertical slice (2026-11-12)

- `src/features/facilities/domain/facilityRegistry.js` adapts approved exterior map interaction records to facility entrance definitions. The domain/application modules do not import Phaser.
- `src/features/facilities/presentation/DoorAnimator.js` owns the independent exterior/interior door presentation. The exterior uses the separate `DOR-0005` map sprite and related `DOR-0006` candidate visual in a short cross-fade state sequence. The catalog does not verify these images as animation frames; this remains a development visual pending owner review.
- `src/data/interiors/communication-room.json` is the first facility layout and interaction data. `InteriorScene` renders it with Phaser 4.
- Entry pauses the existing `Game` scene and launches the reusable `Interior` scene. Exit restores the saved exterior position/facing and resumes the same scene, preserving its in-memory state. The resource system does not exist yet.
- Only Communication Room is registered for entry. Other facility interactions remain inspection toasts.
- Additional facilities should continue to use JSON layouts and this reusable Scene, without duplicated per-facility Scenes. Asset provenance/license remains `UNVERIFIED`; monitor/door artwork retains its catalog candidate status.
