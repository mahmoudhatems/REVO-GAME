# REVO — Roadmap and Definition of Done

## 1. Delivery philosophy

Prioritize a small, complete, polished playable loop over a large set of disconnected features. Implement in stages and verify each stage before proceeding.

## 2. Recommended implementation sequence

### Stage 0 — Verify and secure

- Inspect current branch and working tree.
- Inventory files and applications.
- Verify current versions and lockfiles.
- Confirm asset locations and any existing map data; JSON is the approved map format.
- Address the exposed PixelLab credential with owner-led rotation.
- Do not rewrite Git history without approval.

### Stage 1 — Consolidate the application

- Create one root Vite application.
- Migrate the actual root game into the Phaser 4.2.1 application.
- Preserve menus, intro, player, map, controls, audio, pause, and responsive behaviour.
- Remove duplicate active configuration only after verified replacement.

### Stage 2 — Establish architecture and quality tools

- Introduce the feature-based structure gradually.
- Extract domain rules from Phaser scenes.
- Add Vitest, ESLint, and Prettier.
- Add documentation and reproducible scripts.

### Stage 2A — Visual asset forensics and world-building preparation

- Recover and verify the categorized source archive without modifying originals.
- Generate reviewable category contact sheets and a per-file catalog.
- Classify visual semantics conservatively; record license status as `UNVERIFIED` unless sourced.
- Assess coverage for the approved solar-and-battery Alpha Base facilities.
- Produce an exterior map and atlas plan for owner review; do not implement the final map in this stage.

### Stage 2B — Owner asset review and map blueprint (prepared; approval pending)

- Prepare a facility-by-facility shortlist from verified catalog records and keep all art groupings proposed until owner approval.
- Provide a local, read-only gallery and a pixel-level transparency/crop audit for the shortlisted artwork.
- Draft the 80 × 45 tile, 32 px nominal, 16:9 JSON exterior blueprint with nine approved facility footprints, paths, collision rectangles, interaction points, spawn, camera, and decoration zones.
- Keep the archived source art unchanged, licenses `UNVERIFIED`, and the blueprint disconnected from runtime until owner approval.
- Identify gaps honestly: especially battery-storage, power-distribution, oxygen-generation, airlock, and player animation art.

### Stage 3 — Assets and map

- Catalog assets and their licenses.
- Build consistent tilesets.
- Finalize the validated JSON map schema as the single map source of truth.
- Load JSON map data through the Phaser 4 map adapter; Tiled is optional and not required.
- Verify collisions, layers, paths, rooms, and interaction zones.

### Stage 4 — First complete playable loop

- REVO movement and facility interaction.
- N.E.I.L. mission briefing.
- Three core resource states.
- One meaningful decision.
- Visible consequences.
- A child-friendly explanation.
- A retry/replay path.

### Stage 5 — Mission progression

- 30-day mission structure.
- Curated event schedule.
- Power, oxygen, and food trade-offs.
- Dust/weather event.
- Maintenance problem.
- Communication delay.
- Three ending evaluations.

### Stage 6 — Learning and polish

- Knowledge cards and NASA attribution.
- Rewards and mission patches.
- UI and audio polish.
- Responsive/mobile verification.
- Performance pass.

### Stage 7 — Submission readiness

- Test the complete mission.
- Verify NASA facts and dataset credits.
- Verify licensing.
- Deploy and test the public URL.
- Capture actual gameplay evidence.
- Ensure the pitch describes implemented functionality accurately.

## 3. MVP acceptance criteria

The first complete MVP is acceptable when:

- It runs as one root browser application.
- REVO can move in the map.
- Collisions and camera work.
- The player can interact with at least the core facilities.
- The Communication Room acts as the mission hub.
- Power Control and Oxygen Generation are separate.
- External solar arrays and battery storage are represented in the fictional base; a future dust-storm event reduces fictional solar generation and makes stored battery energy more important. Numeric values remain to be designed.
- No external nuclear reactor is part of the current MVP.
- POWER, OXYGEN/LIFE SUPPORT, and FOOD have real state and rules.
- At least one decision has a meaningful trade-off.
- The consequence is visible and explained.
- At least one NASA-backed educational fact is correctly attributed.
- The mission can advance and evaluate an ending.
- A child can retry after an unsuccessful outcome.

## 4. Technical definition of done

For every code task:

- no unexplained console errors;
- all relevant tests pass;
- lint passes;
- build passes;
- no missing asset paths;
- no unhandled promise rejections;
- no secret values in tracked files;
- docs updated if behaviour or architecture changed.

For gameplay/visual tasks, also perform actual browser verification at desktop and, where relevant, mobile sizes.

## 5. Truthful reporting

Every completion report must distinguish:

- implemented;
- partially implemented;
- planned;
- blocked;
- not tested.

A successful build alone does not mean the game is playable or production-ready.

## Stage 2C — First playable Alpha Base world (2026-11-11)

### Implementation record

- Implemented a Phaser-rendered JSON world at `src/data/maps/alpha-base-exterior.json`, 80 × 45 tiles with 32 px nominal pitch and separate Ground, GroundDetails, Paths, Buildings, Walls, Props, SolarArrays, Foreground, Collision, Interactables, and RoomTriggers data.
- Registered all nine approved facility/site interactions and preserved the existing menu/intro/UI flow, character texture and animation behavior, WASD/arrows, responsive touch controls, camera follow, and world bounds.
- Added map schema/asset-reference and interaction-registry automated tests. Runtime asset selection is 27 curated textures rather than the full archive. Source archive remains unchanged.
- Dedicated battery storage, Oxygen Generation equipment, and N.E.I.L. terminal art remain missing and visibly marked as placeholders. Candidate facility art remains candidate. Licenses remain `UNVERIFIED`.

### Verification log

- Automated: `npm test` passed (2 files, 7 tests); `npm run lint` passed; `npm run build` passed. The production bundle reports a chunk-size warning (JavaScript output about 3.48 MB before gzip, 459.79 kB gzip); review further splitting before release. These checks validate code/build, not playability.
- Browser: a live Phaser canvas rendered the map and existing astronaut. Arrow-key input changed the astronaut's facing/position in consecutive captures; the menu and intro were also opened during this browser session. A genuine gameplay capture is saved at `docs/asset-review/stage2c-alpha-base-gameplay.png`. The shared browser used a constrained 356 × 200 CSS viewport (captured scaled to 1280 × 720), so this is not a desktop-composition check. Direct wall/prop collision, facility/solar reachability, E interaction toast, touch-button movement, pause/resume, and menu return remain unverified. Do not treat JSON collision rectangles as proof of collision behavior.
- Not implemented in this stage: 30-day progression, resource simulation, dust-storm mechanics, full NASA API integration, reward/ending systems, or complete facility-specific art.

Stage 2C remains in progress until direct browser checks confirm collision, camera follow, outdoor solar access, interactions, touch controls, and retained menu/intro/scene transitions. Player spawning and keyboard movement were observed; menu and intro loading were observed. The captured screenshot documents the actual Phaser world and player, not the blueprint.
