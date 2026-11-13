# REVO — Alpha Base

> **Learn. Decide. Adapt.**  
> A browser-based Mars outpost mission game for children aged 7–12.

## 1. Project at a glance

REVO is being developed for the **NASA Space Apps Challenge 2026 — Cairo**, in response to the challenge **Build a Junior Astronaut Mission Trainer**.

The project turns real space-exploration constraints into a short, accessible, interactive experience. The player controls REVO, a young astronaut exploring a fictional research outpost near Jezero Crater on Mars. N.E.I.L. (the **Navigation & Exploration Intelligence Link**) is REVO's friendly physical robot companion and a hybrid Mission Intelligence System. It reads authoritative mission state and uses authored, deterministic dialogue and rules to provide alerts, guide decisions, and explain outcomes. Terminals are interfaces; N.E.I.L. is not terminal-only and does not use an external LLM or runtime chatbot.

The player's goal is to keep Alpha Base safe and operational through a 30-day simulated mission, complete science and maintenance objectives, make meaningful trade-offs, and send a final status report to Earth.

**This is an educational training simulation, not a real Mars operations tool and not a NASA-endorsed product.** NASA data and research are used as traceable scientific references, while simplified values and fictional mission events are clearly identified as game mechanics.

## 2. The problem we are addressing

Children often encounter space facts as posters, videos, or simple quizzes. Those formats may explain what astronauts do, but they rarely let a child experience why mission decisions are difficult.

A Mars outpost has competing needs: power must be allocated between essential systems, life support and food must remain available, radiation and environmental hazards must be considered, research competes for limited resources, and communication with Earth is delayed. A decision that helps one system can create a cost somewhere else.

REVO aims to bridge the gap between **scientific accuracy and engaging play**. Children learn by exploring, making choices, seeing consequences, asking why, and trying again.

## 3. The core experience

1. Receive a mission update from N.E.I.L. in the Communication Room.
2. Explore Alpha Base and inspect its facilities.
3. Discover a problem, mission objective, or environmental event.
4. Choose between two or three meaningful options.
5. See how the choice affects the base and its crew.
6. Read or hear a short, age-appropriate explanation grounded in a NASA source.
7. Continue the mission toward Day 30 and receive a final mission assessment.

The core visible resources should remain simple:

- **POWER** — available energy managed by the indoor Power Control Room, with external solar arrays and battery storage in the approved fictional base architecture.
- **OXYGEN / LIFE SUPPORT** — the status of essential breathable-air and environmental support systems.
- **FOOD** — available food and greenhouse production.

Crew safety, radiation events, communications, and research progress are important mission states, but should not all become permanent HUD meters. Keep the interface understandable for ages 7–12.

## 4. Accepted Alpha Base layout

- **Central Communication Room** — the main hub, including N.E.I.L.'s companion interaction area, mission control, communication status, and crew/base overview.
- **External solar arrays and battery storage** — the outdoor collection and storage components of the fictional base energy system.
- **Indoor Power Control Room** — monitors and manages power distribution and storage for the base.
- **Oxygen Generation / Life Support Room** — oxygen production, air circulation, and life-support monitoring.
- **Research Lab** — scientific experiments, sample analysis, and research objectives.
- **Greenhouse** — food production and crop care.
- **Radiation Shelter** — a protected area used during relevant hazard events.
- **Entrance / Airlock** — the controlled access point for entering and leaving the habitat.

Solar arrays and battery storage are part of the current approved design. No external nuclear reactor is part of the current MVP. A future dust-storm event reduces available sunlight and fictional solar generation, making stored battery energy more important; numeric game values remain to be designed.

## 5. Competition context

- Event: NASA Space Apps Challenge 2026 — Cairo local event.
- Challenge: Build a Junior Astronaut Mission Trainer.
- Target audience: children aged 7–12.
- Expected deliverable: a working, browser-playable prototype with a clear and understandable trade-off mechanic.
- Challenge priorities include impact, creativity, validity, relevance, and presentation as stated in the team's competition materials; consult the official event guidance for the final submission requirements.

Official challenge page: https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/

The team is still curating, verifying, and integrating NASA resources. Do not claim that all NASA datasets have already been integrated. Track each dataset and integration status in `docs/NASA_DATA_STRATEGY.md` and `docs/DONKI_REFERENCE.md`.

## 6. Technology direction

The intended consolidated stack is:

- Phaser **4.2.1** (pin the exact version unless the team explicitly approves a change).
- JavaScript ES Modules.
- Vite.
- JSON-driven Phaser 4 map data; Tiled is not a required dependency.
- Git and GitHub.
- Vitest for unit tests.
- ESLint and Prettier.
- Vercel for browser deployment.
- LocalStorage for lightweight local save data, if implemented.

The supplied project baseline found a Phaser 3.80.1 application in the repository root and a separate, mostly untouched Phaser 4.0.0 + Vite template in `revo/`. The migration must consolidate the actual game into one root application. Read `docs/PROJECT_BASELINE.md` and `docs/TECHNICAL_ARCHITECTURE.md` before changing the project.

Phaser 4.2.1 archive: https://phaser.io/download/release/v4.2.1  
Phaser documentation: https://docs.phaser.io/  
Vite documentation: https://vite.dev/guide/

## 7. NASA data and scientific integrity

The game should use a small, curated selection of authentic NASA data and research rather than trying to integrate every available dataset. The planned source families are:

- **DONKI** — space-weather event records and analyses (CME, CME Analysis, FLR, SEP, IPS, GST, MPC, RBE, HSS, WSA-ENLIL simulations, and notifications).
- **OSDR / GeneLab / ALSDA / RadLab / Environmental Data Application** — space-biology research, astronaut/organism studies, radiation telemetry resources, and selected environmental datasets.
- **Mars surface mission instruments** — especially Perseverance MEDA at Jezero Crater and Curiosity REMS for Martian weather/environmental measurements.
- **Artemis and lunar mission resources** — useful as comparative context for lunar exploration, but do not label lunar data as Mars measurements.
- NASA solar and energy research may inform carefully attributed educational context; it does not validate REVO's fictional system values.

DONKI solar events are not direct measurements of radiation dose at the fictional Alpha Base. Never convert a flare, CME, or SEP record into a claimed Mars-surface dose without a scientifically supported model or measurement. OSDR/RadLab data may be from ISS, spacecraft, other agencies, or analog studies; preserve the exact mission and instrument context.

Read `docs/NASA_DATA_STRATEGY.md`, `docs/DONKI_REFERENCE.md`, and `docs/OSDR_DATA_REFERENCE.md` before integrating NASA data.

## 8. Project documentation

| File | Purpose |
|---|---|
| `CLAUDE.md` | Persistent project instructions for Claude Code. |
| `AGENTS.md` | General instructions for coding agents. |
| `docs/PROJECT_BRIEF.md` | Challenge, problem, solution, audience, and educational purpose. |
| `docs/PROJECT_BASELINE.md` | Snapshot of the repository before consolidation. |
| `docs/GAMEPLAY_DESIGN.md` | Mission loop, 30-day structure, resources, rooms, events, and endings. |
| `docs/REWARDS_AND_LEARNING.md` | Learning outcomes, rewards, achievements, and child-friendly feedback. |
| `docs/NASA_DATA_STRATEGY.md` | Data selection, scientific integrity, provenance, and integration policy. |
| `docs/DONKI_REFERENCE.md` | DONKI event types, catalogs, API notes, and appropriate use. |
| `docs/OSDR_DATA_REFERENCE.md` | OSDR, Biological Data API, RadLab, and Environmental Data Application. |
| `docs/MARS_AND_ARTEMIS_DATA.md` | Mars surface, Artemis, comparative energy research, and communication references. |
| `docs/TECHNICAL_ARCHITECTURE.md` | Target stack, migration rules, Clean Architecture, and project structure. |
| `docs/ASSET_AND_MAP_PIPELINE.md` | Pixel-art asset preparation, JSON map workflow, and Phaser map loading. |
| `docs/ASSET_CATALOG.md` | Recovered asset catalog, contact sheets, classification, and facility coverage. |
| `docs/DECISION_LOG.md` | Accepted product and technical decisions. |
| `docs/ROADMAP_AND_ACCEPTANCE.md` | Implementation order and definition of done. |
| `docs/ASSET_LICENSES.md` | Asset provenance and license tracking. |

## 9. Working principle

Build a small, polished, scientifically honest game loop before expanding the number of systems. A simple choice with a real, understandable consequence is more valuable than many decorative features or complicated meters.

**REVO is not just a Mars map. It is a mission where every decision matters.**
