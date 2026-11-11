# REVO — Gameplay Design Document

## 1. High-level goal

The player must keep Alpha Base safe and operational for 30 simulated mission days, complete key science and maintenance objectives, and send a final status report to Earth.

The point is not to survive through luck or to maximize every meter. The player learns to make responsible trade-offs between connected systems and the people who depend on them.

## 2. Core gameplay loop

1. **Receive** — N.E.I.L. delivers a short update in the Communication Room.
2. **Explore** — REVO walks around the base and visits relevant facilities.
3. **Inspect** — player checks a terminal, machine, sample, or environmental reading.
4. **Understand** — a short explanation identifies the problem and what may be affected.
5. **Decide** — player selects one of two or three meaningful choices.
6. **Resolve** — the choice changes game state and may trigger an event or follow-up.
7. **Learn** — player sees the outcome and a short "Why?" explanation.
8. **Continue** — mission advances toward the next day or objective.

Keep this loop consistent. Avoid long text dumps and menus that interrupt exploration unnecessarily.

## 3. 30-day structure

Use 30 in-game mission days, not 30 real-time days. A Mars day is commonly called a sol; if the game uses "Sol", explain it once in simple language. The actual game-time compression must be described as a game mechanic.

Suggested chapter pacing:

| Mission days | Chapter | Learning / gameplay focus |
|---|---|---|
| 1–7 | Establish Alpha Base | Learn the facilities, inspect the solar-array and battery system, oxygen and greenhouse, discover how resources connect. |
| 8–15 | Environmental Challenge | A clearly labeled simulated dust event affects visibility and outside activity; decide when to shelter, inspect, or postpone external work. |
| 16–23 | System Challenge | A maintenance problem or equipment malfunction forces prioritization and trade-offs. |
| 24–29 | Mission Readiness | Review supplies, complete research tasks, check crew safety, and prepare the final report. |
| 30 | Final Mission Review | Evaluate the actual base state, show the outcome, explain what the player learned, and prepare a report to Earth. |

Do not make every day a separate lengthy level. Some days can be short status updates; key decision days should have richer interactions.

## 4. Core resources

Keep the primary HUD to three simple, understandable resources:

### POWER

- Collected by the fictional external solar arrays and buffered by battery storage.
- Managed through the indoor Power Control Room.
- Used by life support, communications, research, and other facilities.
- Choices about power distribution create trade-offs.
- Game values are normalized abstractions, not NASA reactor performance measurements.

### OXYGEN / LIFE SUPPORT

- Represents the status of the outpost's breathable-air and environmental-support systems.
- The Oxygen Generation Room is separate from Power Control.
- Power allocation and system maintenance can affect this resource.
- Never present simplified game percentages as real oxygen concentration or astronaut exposure thresholds.

### FOOD

- Represented by available food stock and greenhouse production.
- Greenhouse tasks may require power, maintenance, and time.
- A choice that boosts another system may delay food production.

### Contextual mission states

Do not add too many always-visible bars. Keep these as mission state, event indicators, or objective-specific panels:

- crew safety;
- radiation alert / shelter status;
- outdoor visibility and activity status;
- research progress;
- communication delay / Earth reply status;
- maintenance backlog.

## 5. Facilities and their gameplay roles

### Central Communication Room — main hub

- Main mission-control hall.
- N.E.I.L. terminal and dialogue.
- Crew and facility overview.
- Mission alerts and objectives.
- Earth communication status and delayed replies.
- Player returns here for major mission briefings and final report.

### External Solar Arrays and Battery Storage

- Secured outdoor facility.
- Solar arrays and battery storage are part of the fictional base energy system.
- Their detailed generation, storage, and maintenance rules remain to be specified as child-friendly game abstractions.
- Do not imply REVO values are NASA engineering performance data.

### Indoor Power Control Room

- Controls the distribution of available power.
- Displays demand from life support, communications, research, and other base systems.
- Enables player prioritization choices.
- It is an indoor facility separate from the external arrays and battery storage.

### Oxygen Generation / Life Support Room

- Oxygen-generation equipment, air filtration, and environmental support displays.
- Player inspects status and responds to faults.
- Must remain separate from Power Control.

### Research Lab

- Sample inspection and analysis.
- Research objectives and educational science cards.
- Research may consume power or time, creating opportunity cost.

### Greenhouse

- Food production and crop care.
- Simple tasks suitable for children: inspect plants, identify a problem, allocate resources, choose a response.

### Radiation Shelter

- A protected location used during radiation-related or severe environmental events.
- Explain shielding in age-appropriate language.
- Do not invent shielding percentages, dose thresholds, or medical safety claims.

### Entrance / Airlock

- Controlled transition between habitat and outside map.
- Enables outdoor exploration when conditions allow.
- Environmental events may temporarily restrict outside activity.

## 6. Dust storm rules

The approved design includes external solar arrays and battery storage, with indoor Power Control distributing electricity. No external nuclear reactor is part of the current MVP.

A dust storm can:

- reduce visibility;
- make rover movement or external work difficult;
- delay outdoor maintenance;
- create dust-management tasks for filters and equipment;
- make sheltering or postponing an outdoor task the safer option.

A dust storm's effect on solar generation is an open gameplay rule and must not be implemented until explicitly approved. Do not add nuclear generation to the current MVP.

Every storm event must be labeled as a REVO training simulation unless it uses a specific, traceable NASA observation. Do not present a fictional event as current Mars weather.

## 7. Meaningful decisions

Each major decision should:

- present two or three options;
- identify what each option protects or sacrifices in plain language;
- change at least one meaningful game state;
- avoid a universally dominant option;
- show the consequence immediately or at a scheduled later point;
- include a short explanation of why the result occurred;
- use a source-backed educational fact when relevant.

Do not make choices feel arbitrary. The player should be able to learn a strategy from the consequence.

## 8. Communications and Earth delay

- Earth messages may arrive later than the player's action.
- A delayed reply can be used to teach that Mars–Earth communication is not instantaneous.
- Any compressed wait used for gameplay must be labeled as compressed game time.
- Avoid suggesting the player can call Earth and receive an immediate answer.
- Keep communications fun and readable; avoid long waits that block the player.

## 9. Mission endings

At Day 30, evaluate the actual game state and objectives.

### OUTPOST STABLE

Critical systems are functioning, the crew is safe, essential supplies are adequate, and required mission tasks are complete.

### OUTPOST STABLE — REDUCED OPERATIONS

The base remains safe, but one or more non-critical functions or research goals had to be reduced or delayed.

### OUTPOST AT RISK

One or more critical systems or mission conditions are in an unsafe state. Show what went wrong, explain why, and offer a retry/learning path. Do not use frightening death imagery or humiliating feedback for a child audience.

The final result should include:

- base status;
- key decisions made;
- resources remaining;
- completed research/maintenance tasks;
- one or two lessons learned;
- final report transmission status.

## 10. Replayability

Replayability should come from understandable variations, not arbitrary randomness.

Possible sources:

- alternate event order;
- different starting conditions, clearly labeled as training scenarios;
- multiple valid strategies;
- different research tasks;
- decisions whose delayed consequences become visible later.

Use seeded randomness or fixed scenario fixtures so tests can reproduce outcomes.

## 11. Scope guardrails

For the first complete playable version:

- one cohesive base map;
- one controllable character;
- one central mission loop;
- three primary resources;
- a small number of authored events;
- a limited number of meaningful decisions;
- three ending states;
- no backend, accounts, multiplayer, or runtime AI assistant.

Polish the main loop before adding more rooms, meters, or story branches.
