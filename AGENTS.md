# REVO — Instructions for Coding Agents

All coding agents must read `README.md`, `CLAUDE.md`, and the relevant files under `docs/` before acting. `CLAUDE.md` is the detailed project policy; this file makes the same requirement explicit for agents that recognize `AGENTS.md`.

## Product

REVO is a browser-based, 2D top-down Mars outpost mission game for children aged 7–12, being developed for NASA Space Apps Challenge 2026 Cairo, challenge: **Build a Junior Astronaut Mission Trainer**.

The player's goal is to keep fictional Alpha Base safe and operational through 30 simulated mission days, complete objectives, make meaningful trade-offs, and send a final report to Earth. The game should teach critical thinking, responsibility, teamwork, and problem-solving through play.

## Accepted world layout

- Central Communication Room is the main hub and contains N.E.I.L.'s terminal.
- External Fission Power Unit is outside and secured.
- Indoor Power Control Room manages power distribution.
- Oxygen Generation / Life Support is a separate room.
- Research Lab is separate.
- Greenhouse produces food.
- Radiation Shelter protects the crew during relevant events.
- Entrance / Airlock controls access.
- Current accepted design has no solar arrays or solar generation mechanics.

## Technical direction

- One root application; no duplicate active application under `revo/`.
- Phaser 4.2.1, JavaScript ES Modules, Vite, Tiled.
- Vitest, ESLint, Prettier, Git/GitHub, and Vercel.
- Confirm current repository state before migrating; existing baseline was Phaser 3.80.1 in root plus a separate Phaser 4.0.0/Vite template under `revo/`.
- Use Feature-Based Clean Architecture. Domain must remain independent from Phaser.

## Non-negotiable rules

- Preserve existing work and user changes.
- No destructive Git commands or force pushes.
- Do not claim unrun tests or browser checks passed.
- Do not invent NASA data or scientific claims.
- Distinguish NASA data from educational interpretation and fictional game values.
- Do not treat DONKI events as direct Mars surface dose measurements.
- Do not treat lunar Artemis measurements as Mars measurements.
- Do not show archived NASA data as live.
- No runtime AI chatbot for N.E.I.L.; use authored dialogue data.
- Use supplied assets and Tiled layers; do not replace the playable map with one generated screenshot.
- Record asset licenses and mark unknown status `UNVERIFIED`.
- Every important decision needs a visible consequence and a child-friendly explanation.
- Keep HUD complexity low: POWER, OXYGEN/LIFE SUPPORT, FOOD are the core resources.

## Read first

`docs/PROJECT_BRIEF.md`, `docs/PROJECT_BASELINE.md`, `docs/DECISION_LOG.md`, `docs/GAMEPLAY_DESIGN.md`, `docs/REWARDS_AND_LEARNING.md`, `docs/NASA_DATA_STRATEGY.md`, `docs/DONKI_REFERENCE.md`, `docs/OSDR_DATA_REFERENCE.md`, `docs/MARS_AND_ARTEMIS_DATA.md`, `docs/TECHNICAL_ARCHITECTURE.md`, `docs/ASSET_AND_MAP_PIPELINE.md`, and `docs/ROADMAP_AND_ACCEPTANCE.md`.
