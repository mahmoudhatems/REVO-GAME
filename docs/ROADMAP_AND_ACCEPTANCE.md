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
- At this implementation snapshot, dedicated battery storage and Oxygen Generation equipment were missing and visibly marked as placeholders; N.E.I.L. was represented by a terminal placeholder under the then-current decision. The owner has since approved N.E.I.L. as a friendly robot companion, so companion art is missing and the terminal is not its final representation. Candidate facility art remains candidate. Licenses remain `UNVERIFIED`.

### Verification log

- Automated: `npm test` passed (2 files, 7 tests); `npm run lint` passed; `npm run build` passed. The production bundle reports a chunk-size warning (JavaScript output about 3.48 MB before gzip, 459.79 kB gzip); review further splitting before release. These checks validate code/build, not playability.
- Browser: a live Phaser canvas rendered the map and existing astronaut. Arrow-key input changed the astronaut's facing/position in consecutive captures; the menu and intro were also opened during this browser session. A genuine gameplay capture is saved at `docs/asset-review/stage2c-alpha-base-gameplay.png`. The shared browser used a constrained 356 × 200 CSS viewport (captured scaled to 1280 × 720), so this is not a desktop-composition check. Direct wall/prop collision, facility/solar reachability, E interaction toast, touch-button movement, pause/resume, and menu return remain unverified. Do not treat JSON collision rectangles as proof of collision behavior.
- Not implemented in this stage: 30-day progression, resource simulation, dust-storm mechanics, full NASA API integration, reward/ending systems, or complete facility-specific art.

Stage 2C remains in progress until direct browser checks confirm collision, camera follow, outdoor solar access, interactions, touch controls, and retained menu/intro/scene transitions. Player spawning and keyboard movement were observed; menu and intro loading were observed. The captured screenshot documents the actual Phaser world and player, not the blueprint.

## Stage 2D.1 — Communication Room vertical slice (2026-11-12)

### Implemented

- Added a Phaser-independent facility registry and transition factory, plus a small session snapshot.
- Added nearest-entry prompting for the Communication Room. E, Space, and the existing mobile action use the same `PlayerControls.consumeAction()` route; interaction is range-gated and transition-locked.
- Added the southern Communication Room boundary and doorway gap to the exterior JSON collision layer. The door is a separate Phaser image, not baked into a background.
- Added a reusable `InteriorScene` driven by `src/data/interiors/communication-room.json`, with a floor, wall boundaries, door/exit, REVO movement/collision, and three authored interactions.
- Entry pauses and retains the current exterior scene; exit restores the recorded player coordinates/direction and resumes it. The UI pause button can target either world scene.
- N.E.I.L. and communications console are explicitly drawn development placeholders. `EQP-0055` is still classified as a candidate. Door images are candidates, not verified animation frames. Asset licenses remain `UNVERIFIED`.

### Automated verification

- Added tests for proximity range, transition snapshot, layout/catalog references, required interaction IDs, the exterior collision opening, and the interior entry/exit configuration.
- `npm run check` passed on 2026-11-12: ESLint passed; Vitest passed (3 files, 13 tests); Vite production build passed. Vite reported the existing large JavaScript chunk warning (3,494.28 kB minified; 463.30 kB gzip).

### Browser verification and completion gate

- Verified in the live Phaser/Vite browser on 2026-11-12: the existing menu and intro loaded; keyboard start/skip reached the exterior; arrow-key movement reached the Communication Room entrance and its range-gated prompt; E opened the entrance and loaded the interior Scene; REVO moved inside and the N.E.I.L. Terminal proximity prompt appeared. The interior rendered the authored room layout, development placeholders, and candidate status monitor.
- Actual Phaser canvas captures: `docs/screenshots/stage2d1-exterior.png` and `docs/screenshots/stage2d1-communication-room.png`.
- Still unverified: the N.E.I.L./console/status interaction result panel, interior wall/equipment collision behavior, exit back to the exact saved exterior coordinates and facing, mobile action control, pause/resume in both scenes, and audio retention. The browser's constrained viewport also clipped portions of the interior's fixed UI in the captured view; responsive interior framing needs a follow-up check.
- Stage 2D.1 is **partially implemented and not complete** until the remaining interaction, collision, return-state, mobile, pause, and UI-framing checks pass. Automated test/build success does not substitute for those runtime checks.
# Visual rebuild preparation gate (owner-approved 2026-11-12)

The next preparation work is documentation and owner review only: visual audit, facility production backlog, manual PixelLab specifications, animation, VFX/audio, UI, and scale requirements under `docs/visual-rebuild/`. Do not modify runtime, map data, or original art in this preparation phase. Preserve REVO's existing character artwork; current remaining art is temporary/prototype pending review or replacement. N.E.I.L. is the friendly robot companion Navigation & Exploration Intelligence Link, with authored dialogue and no runtime AI chatbot. Prefer free tools; PixelLab use is manual on the website, and generated art requires owner approval plus provenance/license review before integration. Future implementation must remain incremental and preserve JSON map and approved solar/battery architecture.

# Stage 2D.3 � N.E.I.L. companion (2026-11-12)

## Implemented

- Preserved the recovered source pack and copied its 24 individual frames plus four directional sheets unchanged into the runtime asset directory. The four direction sheets are loaded as 64�64 frames; no pose loop is assumed.
- Added Phaser-independent follow/dialogue/tutorial controllers, a collision-aware companion presentation, authored tutorial and Communication Room station dialogue, plus UI bubble presentation.
- Integrated the same companion/dialogue context into the exterior and reusable interior Scene. The briefing terminal now has its own mission-briefing identity; it does not represent N.E.I.L.
- Added automated tests for direction, spawn/follow behavior, reserved points, repeated stability, dialogue advancement/skip and duplicate handling.

## Verification and limits

- Automated status: see final Stage 2D.3 report for the latest lint, test, build, and formatting results; do not treat earlier passing results as validation of subsequent edits.
- Browser status: the menu-to-exterior startup and canvas were previously verified. Dialogue bubble framing required a camera-to-UI coordinate correction; re-run visual/browser acceptance after that fix before claiming the full entry, interaction, exit, and mobile flows.
- All pack frames are 64�64 with alpha; individual direction sheets are 384�64. Stable direction poses only are used. Pose sequence, walk-cycle registration, and FPS remain unverified.
- PixelLab licensing and the missing original raw sheet remain provenance blockers (`UNVERIFIED`). Direct steering can stop at blockers and does not perform route finding.
- Capture only genuine Phaser canvas screenshots; retain Stage 2D.1 captures as historical evidence, not Stage 2D.3 proof.

# Owner-approved direction and data status (2026-11-13)

N.E.I.L.'s approved current role is hybrid: the physical robot companion is retained and also provides deterministic Mission Intelligence System behavior from one authoritative mission state. Solar remains the sole approved power architecture; batteries store energy, and dust storms may reduce solar generation. No nuclear reactor or external LLM is approved. Mission-state ownership, resource rules/values, event-to-state transitions, and the complete alert-to-outcome learning loop remain future implementation work and require approval before coding. The three JSON files in `assets/source/data/` remain unintegrated, untransformed, and pending provenance/semantic validation. This is a current decision/status note; prior stage reports remain historical records.
