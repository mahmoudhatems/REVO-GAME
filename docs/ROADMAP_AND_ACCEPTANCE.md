# REVO — Roadmap and Definition of Done

## 1. Delivery philosophy

Prioritize a small, complete, polished playable loop over a large set of disconnected features. Implement in stages and verify each stage before proceeding.

## 2. Recommended implementation sequence

### Stage 0 — Verify and secure

- Inspect current branch and working tree.
- Inventory files and applications.
- Verify current versions and lockfiles.
- Confirm asset locations and Tiled files.
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

### Stage 3 — Assets and map

- Catalog assets and their licenses.
- Build consistent tilesets.
- Finalize Tiled as map source of truth.
- Load the map in Phaser.
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
- External solar arrays and battery storage are represented in the fictional base; detailed generation rules are approved separately.
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
