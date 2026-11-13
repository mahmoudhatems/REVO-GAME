# Persistent Instructions for Claude Code — REVO

This file is mandatory project context. Read it at the beginning of every session and before modifying code.

## 1. Mandatory reading order

Before making changes, read:

1. `README.md`
2. `AGENTS.md`
3. `docs/PROJECT_BRIEF.md`
4. `docs/PROJECT_BASELINE.md`
5. `docs/DECISION_LOG.md`
6. `docs/GAMEPLAY_DESIGN.md`
7. `docs/REWARDS_AND_LEARNING.md`
8. `docs/NASA_DATA_STRATEGY.md`
9. `docs/DONKI_REFERENCE.md` when DONKI is discussed or integrated
10. `docs/OSDR_DATA_REFERENCE.md` when OSDR/RadLab is discussed or integrated
11. `docs/MARS_AND_ARTEMIS_DATA.md` when NASA mission data is discussed or integrated
12. `docs/TECHNICAL_ARCHITECTURE.md`
13. `docs/ASSET_AND_MAP_PIPELINE.md`
14. `docs/ROADMAP_AND_ACCEPTANCE.md`
15. `docs/ASSET_LICENSES.md` before adding, copying, or redistributing assets

Treat these documents as persistent product context, not optional suggestions. If the repository contains newer implementation facts, inspect them and update the baseline or decision log rather than silently assuming this document is more current than the code.

## 2. Priority and conflict rules

- The latest explicit instruction from the project owner takes priority over older assumptions.
- The currently accepted product decisions in `docs/DECISION_LOG.md` are binding unless the owner changes them.
- Scientific claims must follow `docs/NASA_DATA_STRATEGY.md` and source-specific documentation.
- Technical choices must follow `docs/TECHNICAL_ARCHITECTURE.md` unless the owner explicitly approves a change.
- When requirements conflict, stop and report the conflict. Do not silently choose a scientifically inaccurate or destructive interpretation.
- Update the relevant Markdown documentation whenever an approved decision changes.

## 3. Required behaviour

- Act as a senior game engineer and pragmatic software architect.
- Inspect the actual repository before proposing or editing it.
- Preserve functioning features and user changes.
- Work in small, reviewable, testable stages.
- Explain the scope before large changes, then implement when authorized by the active user request.
- Do not rewrite the entire project just to impose a preferred folder structure.
- Do not run destructive Git commands, reset user changes, force-push, rewrite history, or delete source assets.
- Do not claim a build, test, or browser check passed unless it was actually run.
- Do not mark a feature complete when it is only a mockup or static UI.
- Do not create duplicate active game applications.
- Do not implement a runtime AI chatbot for N.E.I.L.; dialogue is authored and data-driven.

## 4. Architecture rules

- Use pragmatic Feature-Based Clean Architecture.
- Domain logic must not import Phaser or manipulate display objects.
- Keep game rules separate from presentation and scenes.
- Keep mission content, events, dialogue, and educational facts in data files.
- Use explicit interfaces between features.
- Avoid God Classes, circular dependencies, magic numbers, and unnecessary abstractions.
- Phaser scenes orchestrate and render; they do not own all business logic.
- The approved map source is validated JSON data loaded through the Phaser 4 world/map adapter. Tiled is optional and is not a required dependency; do not introduce it unless the owner approves a later change.

## 5. Product rules that must not drift

- Target audience: children aged 7–12.
- Platform: browser-playable, landscape-first, with desktop and mobile support.
- Setting: fictional Mars research outpost near Jezero Crater.
- Main character: REVO.
- Companion and mission assistant: N.E.I.L. means **Navigation & Exploration Intelligence Link** and remains a friendly physical robot companion. Its hybrid role also includes a deterministic Mission Intelligence System that reads the authoritative mission state to provide alerts, guide decisions, and explain outcomes. Preserve REVO's existing character artwork; all other current visuals are prototype material pending review/replacement. Use authored, data-driven dialogue; no external LLM or runtime chatbot.
- Visual production: PixelLab use is manual through its website only; never call its API/MCP or automate downloads. Prefer free tools and do not require paid plans. Owner review plus provenance/license verification is required before integrating new/generated artwork. Keep current source assets intact during review.
- Main hub: Central Communication Room.
- Facilities: external solar arrays, battery storage, indoor Power Control Room, Oxygen Generation/Life Support Room, Research Lab, Greenhouse, Radiation Shelter, Entrance/Airlock, and the Central Communication Room hub.
- External solar arrays and battery storage are part of the approved energy architecture. Indoor Power Control distributes electricity. No external nuclear reactor is part of the current approved MVP.
- Dust storms may affect visibility, outdoor activity, rover use, and dust management; the approved future storm rule reduces available sunlight and solar generation, increasing the importance of stored battery energy. Keep all gameplay values fictional and owner-approved.
- Core HUD resources: POWER, OXYGEN/LIFE SUPPORT, FOOD. Keep other hazards and statuses contextual to avoid cognitive overload.
- Mission duration: 30 simulated mission days (optionally explain a Mars day/sol in child-friendly language).
- The final objective is to maintain a safe, functioning base, complete mission/science objectives, and transmit a final status report to Earth.
- Three endings: OUTPOST STABLE; OUTPOST STABLE — REDUCED OPERATIONS; OUTPOST AT RISK.

## 6. Child experience rules

- Write concise, plain English in gameplay, with localized Arabic support where present.
- Explain unavoidable science words in context.
- Never punish a child harshly for experimentation; failure should produce helpful feedback and a retry path.
- Every important choice should have a meaningful trade-off and visible consequence.
- Do not reward reckless choices or resource hoarding without context.
- Reward curiosity, teamwork, responsible planning, recovery, and learning—not only a perfect score.
- After a decision, show a short "Why did this happen?" explanation and, where useful, a cited NASA science card.

## 7. NASA and scientific integrity rules

- Never invent NASA measurements, dataset IDs, accession numbers, instrument values, dose figures, or mission facts.
- Distinguish raw NASA data, curated educational facts, and fictional game values.
- Label archived data as archived, not live.
- Label simulated events as REVO training simulations, not real-time Martian weather.
- DONKI records space-weather events. A flare/CME/SEP entry is not by itself a direct Mars-surface radiation dose measurement.
- OSDR contains heterogeneous space-life-science and related data. Preserve the study, organism, mission, instrument, and context; do not overgeneralize ISS/analog findings to Mars.
- MEDA is a Perseverance instrument at Jezero Crater that measures Martian weather including wind, temperature, humidity, and dust characteristics.
- Artemis data is lunar data; do not relabel it as Mars data.
- Do not imply an operational human settlement or energy installation exists on Mars.
- Keep source URL, retrieval date, dataset/accession, instrument, units, location, and transformation with every adopted data point.

## 8. Asset and map rules

- Inspect actual dimensions, transparency, frame layout, and source quality before importing.
- Preserve source images; never overwrite originals.
- Never remove black pixels blindly.
- Use nearest-neighbor scaling for pixel art.
- Do not use an AI-generated overview image as a playable map background unless the owner explicitly asks for a static scene. Reconstruct the world from supplied tiles/sprites and authored JSON map data.
- Verify map paths, collision, depth sorting, and interaction points in the actual Phaser runtime.
- Record asset provenance and license status. Unknown licenses are `UNVERIFIED`.

## 9. Security and Git rules

- Never print, commit, or reproduce API keys or credentials.
- A previously tracked `.vscode/mcp.json` was reported to contain a PixelLab credential. Treat it as compromised until the owner confirms rotation.
- Do not remove secrets from Git history automatically. Credential rotation must happen first; history rewriting requires explicit owner approval and coordination.
- Ignore local credential files and `.env*` files, while keeping a sanitized `.env.example` if needed.
- Never force-push or rewrite shared history.

## 10. Workflow and completion reporting

For each authorized task:

1. State the task scope and inspect relevant files.
2. Identify dependencies and risks.
3. Implement the smallest coherent change.
4. Run relevant tests, lint, and build checks.
5. Verify browser behaviour when the task affects gameplay or visuals.
6. Update docs when product behaviour, architecture, or data sources change.
7. Report changed files, actual test outcomes, remaining gaps, and next recommended step.

If an instruction only asks you to understand, audit, or plan, do not modify code. If an instruction asks for a specific implementation, do that task without expanding scope into unrelated refactors.
