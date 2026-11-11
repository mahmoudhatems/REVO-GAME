# REVO — Accepted Decisions

This is the decision log for product and technical choices already agreed by the team. New decisions should be appended with date, reason, and affected documents.

## Product decisions

| Area | Accepted decision |
|---|---|
| Game setting | Fictional Mars outpost near Jezero Crater. |
| Main character | REVO, using the team's approved character assets. |
| Assistant | N.E.I.L. is a digital assistant accessed through screens/terminals/dialogue, not a walking robot. |
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
- Generation, storage, and dust-storm gameplay rules remain unspecified; do not invent operational values or implement unapproved effects.
- Dust storms may affect visibility, outdoor activity, rover use, maintenance, and dust management. Any effect on fictional solar generation requires a separately approved rule.

## Technical decisions

| Area | Current target |
|---|---|
| Engine | Phaser 4.2.1, pinned exactly unless explicitly changed. |
| Language | JavaScript ES Modules. |
| Build | Vite. |
| Map authoring | Tiled, with one source of truth for map geometry. |
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
