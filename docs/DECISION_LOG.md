# REVO — Accepted Decisions

This is the decision log for product and technical choices already agreed by the team. New decisions should be appended with date, reason, and affected documents.

## Product decisions

| Area | Accepted decision |
|---|---|
| Game setting | Fictional Mars outpost near Jezero Crater. |
| Main character | REVO, using the team's approved character assets. |
| Assistant (superseded 2026-11-12) | Earlier decision: N.E.I.L. was a digital assistant accessed through screens/terminals/dialogue, not a walking robot. Superseded by the owner-approved visual direction below. |
| N.E.I.L. identity (2026-11-12) | Owner-approved: N.E.I.L. means Navigation & Exploration Intelligence Link and is REVO's friendly robot companion. It guides with authored dialogue; do not use a runtime AI chatbot or misidentify drone art as N.E.I.L. Preserve existing REVO artwork. All other current visuals are temporary/prototype pending review or replacement. |
| Visual production workflow (2026-11-12) | Audit and plan before art production. PixelLab may be used manually through its website only; no API/MCP calls or automated downloads. Prefer free tools; do not require paid plans. Owner approval and provenance/license review are required before generated art enters the game. |
| Main room | Central Communication Room is the central hub and mission-control hall. |
| Mission length | 30 simulated mission days. |
| Player objective | Keep the outpost operational and crew safe, complete science/mission objectives, and transmit a final report to Earth. |
| Core resources | POWER, OXYGEN/LIFE SUPPORT, FOOD. |
| Radiation | A contextual hazard and safety mechanic, not necessarily a permanent fourth HUD meter. |
| Communication delay | A contextual mission mechanic and educational concept; compress time for gameplay only when clearly labeled. |
| Audience | Children aged 7–12. |
| Primary platform | Browser, landscape-first, desktop and mobile support. |

## Accepted map facilities

1. Central Communication Room.
2. External solar arrays and battery storage.
3. Indoor Power Control Room.
4. Oxygen Generation / Life Support Room.
5. Research Lab.
6. Greenhouse.
7. Radiation Shelter.
8. Entrance / Airlock.

## Power architecture decision

- External solar arrays and battery storage are part of the approved MVP energy system.
- Indoor Power Control manages electricity distribution. No external nuclear reactor is part of the current MVP.
- A future dust-storm event reduces available sunlight and fictional solar generation, making stored battery energy more important. Numeric gameplay values remain to be designed; do not present them as NASA engineering measurements.
- Dust storms may also affect visibility, outdoor activity, rover use, maintenance, and dust management.

## Technical decisions

| Area | Current target |
|---|---|
| Engine | Phaser 4.2.1, pinned exactly unless explicitly changed. |
| Language | JavaScript ES Modules. |
| Build | Vite. |
| Map authoring | Validated JSON-driven Phaser 4 map data; Tiled is not a required dependency. |
| Architecture | Pragmatic Feature-Based Clean Architecture. |
| Testing | Vitest plus integration/runtime checks. |
| Quality | ESLint and Prettier. |
| Deployment | Vercel. |

## Design decisions still open

Do not invent these as finalized facts. Propose options and ask the owner when the decision materially affects implementation:

- exact map tile size and total map dimensions after asset inspection;
- precise resource balance values and event probabilities;
- exact number and order of mission events;
- whether the final build uses English only or a full Arabic/English language toggle;
- exact save/checkpoint behaviour;
- whether a rover is fully drivable or only an interactable prop;
- exact team reward/achievement art.

## Change log

- 2026-11-11: consolidated project context; confirmed fission power concept, indoor power control, central communication hub, separate oxygen and research facilities, no solar arrays, 30-day mission and child-first educational objective.
- 2026-11-11: owner-approved Stage 2A update supersedes the prior power-layout decision: external solar arrays and battery storage are included; indoor Power Control distributes electricity; no external nuclear reactor is in the current MVP. Solar generation and storm effects remain to be specified. Updated product, gameplay, asset, and roadmap documentation.
- 2026-11-11: owner-approved Stage 2B clarification: the future dust-storm event reduces available sunlight and solar generation, increasing the importance of stored battery energy. Map architecture is JSON-driven in Phaser 4; Tiled is not a required dependency. Numeric gameplay values remain open. Updated persistent instructions and map/architecture documentation.

# 2026-11-12 � Stage 2D.3 N.E.I.L. pack integration

Owner-approved N.E.I.L. character pack is integrated as the friendly tracked robot companion described by the current product decision. Preserve source files. Use stable directional poses only until frame order and animation timing are verified. The supplied pack's license remains `UNVERIFIED`; approval to integrate the pack does not establish redistribution rights. Keep the briefing terminal a separate facility interface. See the Stage 2D.3 sections in gameplay, architecture, asset-license, and acceptance documentation.

# 2026-11-13 — Owner-approved current product and data decisions

- N.E.I.L. remains the physical robot companion, Navigation & Exploration Intelligence Link, with a hybrid Mission Intelligence System role. The assistant role is authored and deterministic: it reads the one authoritative mission state to provide alerts, guide decisions, and explain outcomes. No external LLM or runtime chatbot is approved. This supersedes earlier terminal-only role recommendations without changing N.E.I.L.'s identity.
- Solar is the only approved power architecture: external arrays generate power, batteries store available energy, and indoor Power Control distributes it. Dust storms may reduce solar generation and affect operations through explicitly authored fictional rules. No nuclear reactor is approved for the current architecture.
- `assets/source/data/final_csa_food.json`, `final_donki.json`, and `final_marstrek_terrain.json` are supplied inputs only. They are not integrated or transformed. Provenance, units, derivations, and geographic metadata remain unverified where absent; distinguish source facts from REVO balancing values.
- These decisions do not create or modify runtime systems, map metadata, or dataset schemas.
