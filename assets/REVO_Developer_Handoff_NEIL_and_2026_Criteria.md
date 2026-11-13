# REVO --- Developer Handoff, N.E.I.L. & NASA Space Apps 2026 Update

**Prepared:** 13 November 2026\
**Purpose:** Working handoff for the REVO developer and coding agent.
This document supersedes the earlier generic NASA data blueprint
wherever the two conflict.

## 1. Project identity

REVO is a browser-based, 2D top-down Mars outpost STEM game for children
aged **7--12**, built for the NASA Space Apps 2026 challenge: **Build a
Junior Astronaut Mission Trainer**.

Official challenge:
https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/

The challenge asks teams to build an interactive game/app where students
run a lunar or Martian outpost and balance **life support, radiation
shielding, power, and food production**, experiencing decisions that can
make a mission succeed or fail.

### Established direction

-   Game: REVO; setting: Mars.
-   Character: REVO, curly orange hair, white/orange astronaut suit.
-   Assistant: N.E.I.L., a digital mission assistant through
    terminal/panel interactions.
-   Audience: ages 7--12.
-   Format: browser-based 2D top-down exploration and survival/strategy.
-   Loop: **Explore → Inspect → Understand → Decide → Resolve → Learn**.
-   Main hub: Communication Room.
-   Planned stations: Oxygen/Life Support, Power Control, Food/Growing,
    Mars exterior.
-   HUD: POWER, OXYGEN, FOOD; shelter readiness and Earth communication
    are mission indicators.
-   Main power source is nuclear energy. Do not make dust storms
    arbitrarily disable the nuclear generator.
-   Visual tone: friendly, cinematic, readable and child-appropriate.
    Among Us was only a readability/animation reference; do not copy its
    identity or assets.
-   Old internal demo target was 60 seconds. **New 2026 submission
    guidance surfaced on Nov 12 says video ≤30 seconds OR up to 7
    slides. Verify the official Project Submission Guide before final
    upload.**

## 2. Last known engineering baseline

Reported in the previous project conversation on 13 November. Verify in
the actual repository; do not assume these paths or statuses are still
current.

  -----------------------------------------------------------------------
  Item                    Last known status       Required agent action
  ----------------------- ----------------------- -----------------------
  Phaser + Vite           Existing                Inspect package.json

  Phaser version          4.1.0                   Verify installed
                                                  version

  JavaScript              Existing                Preserve conventions

  Map / exterior JSON     Implemented             Inspect schema and
                                                  consumers; don't
                                                  replace

  Communication Room      Implemented             Trace current
  entry                                           interaction

  Tests / lint / build    13 checks passed at     Rerun and record exact
                          last checkpoint         commands

  N.E.I.L. integration    Unconfirmed             Audit before
                                                  implementation

  Resource simulation     Unconfirmed             Audit current code

  Dust-storm decision     Pending / unconfirmed   Implement after audit
  mission                                         

  NASA data integration   Pending / unconfirmed   Use verified source and
                                                  cached snapshot
  -----------------------------------------------------------------------

Earlier structure references: `public/assets`, `src/game/scenes`,
systems for player/interactions/resources, and scenes discussed as
Boot/Menu/Outpost/Result. Tiled was optional; PixelLab was an asset
workflow reference. **Inspect the actual repo rather than assuming these
paths.**

## 3. Developer focus --- N.E.I.L.

N.E.I.L. is not a generic chatbot or unrelated chat window. It is the
player's mission-control assistant and must be aware of the actual
mission state.

### Responsibilities

1.  Deliver mission alerts.
2.  Explain what an alert means in simple language for ages 7--12.
3.  Guide the player to the relevant station.
4.  Explain choices without choosing for the player.
5.  React to the player's actual choice and resulting state.
6.  Explain why the result happened.
7.  Present a concise science takeaway and its source.

### Interaction flow

``` text
Mission event / player interaction
              |
              v
      Mission state updated
              |
              v
       N.E.I.L. receives context
              |
              v
     Dialogue / terminal panel
              |
              v
     Player selects an action
              |
              v
      Game rules validate action
              |
              v
       Resource state changes
              |
              v
   N.E.I.L. explains the outcome
              |
              v
       Learning card / source
```

### Behavior requirements

-   Deterministic and connected to game state.
-   No external LLM/API call required for MVP.
-   Use authored dialogue and rule-based response selection.
-   Short, warm, clear, age-appropriate dialogue; one instruction at a
    time.
-   Never claim a live NASA event exists when using cached or fictional
    training data.
-   Distinguish `NASA DATA`, `TRAINING SIMULATION`, and `GAME STATE`.
-   Do not reveal the optimal answer before the player decides.
-   Avoid a huge branching dialogue tree; build a small reusable
    dialogue/state system.
-   Do not invent what the acronym N.E.I.L. stands for. Preserve the
    name; ask the project owner if an expansion is needed.

### Suggested dialogue states

Proposals for implementation, not previously approved product copy:
`IDLE`, `ALERT`, `EXPLAIN`, `GUIDE_TO_STATION`, `AWAIT_DECISION`,
`PROCESS_ACTION`, `OUTCOME`, `LEARNING`, `MISSION_COMPLETE`.

### Suggested context contract

Illustrative only. Map to the existing state model; do not create a
competing source of truth.

``` js
{
  missionId: "keep-alpha-base-running",
  currentScene: "outpost",
  currentStation: "communication-room",
  activeEvent: {
    id: "dust-event-01",
    type: "dust_storm",
    sourceMode: "training_simulation",
    sourceId: null
  },
  resources: { power: 100, oxygen: 100, food: 100 },
  missionFlags: {
    externalTaskPaused: false,
    shelterChecked: false
  },
  lastPlayerAction: null
}
```

These resource values are examples, not approved game values or NASA
measurements.

### Dialogue data example

``` js
{
  id: "dust-alert-intro",
  state: "ALERT",
  speaker: "NEIL",
  text: "Mission alert! Dust may make outdoor work harder. Let's check the outpost before we continue.",
  next: "dust-alert-choice",
  tags: ["dust", "mission-safety"],
  sourceMode: "training_simulation"
}
```

Keep dialogue content separate from scene code where practical.

## 4. MVP mission --- Keep Alpha Base Running

The mission must demonstrate the challenge, not merely display NASA
facts.

1.  Start in the Communication Room.
2.  N.E.I.L. introduces an environmental/mission alert.
3.  Player inspects the mission terminal.
4.  Player moves to Power Control or the relevant station.
5.  A NASA science card provides context for a real
    measurement/observation.
6.  Player makes a resource/operations decision.
7.  Game rules update shared resource and mission state.
8.  HUD reflects the change.
9.  N.E.I.L. explains the outcome.
10. Learning card summarizes the science and identifies the source.

### Scientific correction

-   A Mars dust-storm event and a solar space-weather event are
    different.
-   **DONKI** is a space-weather source (solar flares, CMEs, SEP
    events). It is not evidence that a Martian dust storm occurred.
-   For Mars dust/environment evidence, prioritize actual Mars mission
    environmental observations, especially **MEDA on Perseverance** for
    the Jezero context when the selected record supports the claim.
-   A previously discussed Opportunity example cited historical dust
    optical depth (`tau`) 10.5 and solar energy 21 Wh in the Meridiani
    Planum context. These are candidate historical evidence only: verify
    original NASA/JPL record, units, date, location, instrument and
    interpretation before displaying. Do not present as current Jezero
    weather or current Mars conditions.
-   If the mission's dust event is fictional, label it **TRAINING
    SIMULATION**. It can be inspired by real Mars science but is not a
    live observation.

### Resource simulation

-   Audit the existing resource model first.
-   Use one authoritative resource state.
-   Define action costs/consequences in one rules module.
-   Clamp values to intended range and validate actions before applying.
-   Make every change visible in HUD and explainable by N.E.I.L.
-   Provide clear win/caution/failure outcome.
-   Test insufficient resource, repeated click, scene re-entry and
    invalid action.
-   Exact initial values, costs, thresholds and win conditions must be
    proposed after repository audit; do not silently invent them.

## 5. NASA data strategy

Goal: at least one real NASA source materially supports the game. Do not
connect every API just to list them.

  ------------------------------------------------------------------------
  Priority          Source            Role               Notes
  ----------------- ----------------- ------------------ -----------------
  P0                Mars              Mars               Most relevant to
                    environmental     dust/environment   Mars dust mission
                    data (MEDA /      science card and   
                    Perseverance or   scenario grounding 
                    verified                             
                    Opportunity                          
                    record)                              

  P0                Mars Trek         Verify terrain/map Map reference or
                                      context            small layer, not
                                                         full GIS

  P1                DONKI             Space-weather      Not Mars dust
                                      learning event     data or direct
                                                         Mars dose

  P1                RadLab            Radiation          Preserve
                                      measurement        spacecraft,
                                      learning card      instrument,
                                                         timestamp, units;
                                                         ISS is not Mars
                                                         surface

  P1                CSA               Food-growing       Supports simple
                    food-production   education          growing station
                    toolkit                              

  P2                OSDR              One verified       Check study
                                      space-biology      context,
                                      learning card      organism,
                                                         methods, findings

  P2                APOD / rover      Optional polish    Not required for
                    photos                               core loop
  ------------------------------------------------------------------------

### Data handling rules

-   Inspect official response schema before mapping fields.
-   Keep raw API response separate from normalized game model.
-   Record source URL, retrieval timestamp, record timestamp, units,
    instrument and location/context.
-   Cache a small validated record so demo does not depend on live
    network.
-   Label cached data with actual record date.
-   Label fictional fallback as training simulation.
-   Never fabricate "live NASA" data.
-   Never imply ISS radiation data is a Mars reading.
-   Never convert an event notification into a numerical Mars radiation
    dose without a valid model and evidence.

## 6. 2026 challenge and judging update

### Challenge requirements

The official challenge requires an interactive game/app where students
run a lunar or Martian outpost and balance: - life support; - radiation
shielding; - power; - food production.

A static educational map or chatbot alone would not fully demonstrate
these trade-offs.

Official challenge:
https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/

### Five judging criteria

  -----------------------------------------------------------------------
  Criterion                           What REVO must demonstrate
  ----------------------------------- -----------------------------------
  Impact                              Children gain useful understanding
                                      of human exploration and mission
                                      decisions

  Creativity                          Distinctive interactive Mars
                                      outpost experience, N.E.I.L.
                                      integrated as mission guide

  Validity                            Correct science, traceable
                                      NASA/partner sources, honest
                                      units/context, functional
                                      implementation

  Relevance                           Real outpost trade-offs across life
                                      support, radiation shielding, power
                                      and food

  Presentation                        Polished, concise, accessible demo
                                      and clear project explanation
  -----------------------------------------------------------------------

Do not claim numeric weighting unless the official 2026 guide explicitly
provides it.

### Dates and submission

As of 13 November 2026: - Hackathon: **14--15 November 2026**. -
Submission opens **14 November at 9:00 AM local time**. - Official site
says submission closes **15 November at 11:59 PM local time**. -
Official 2026 site: https://www.spaceappschallenge.org/2026/

### Newly surfaced submission guidance --- confirm against official guide

A NASA Space Apps community answer dated 12 November 2026 says: - demo:
video **30 seconds or less** OR up to **7 slides**; - project page
explains what was built and how NASA data was used; - include demo link
and declare AI tools; - project should be in English; non-English video
needs English subtitles; - test public links in a private/incognito
window; - submit before deadline.

This is a community response, not a substitute for the official Project
Submission Guide. Check official Resources/team dashboard as the guide
is expected on 13 November:
https://www.spaceappschallenge.org/resources/

**Do not use the old 60-second target as the submission rule until the
official 2026 guide is checked.** A 60-second internal walkthrough can
still be useful, but the submission artifact may have a stricter
30-second limit.

### Submission readiness

-   English project description.
-   Working project/demo link with public access.
-   Demo within official format limit.
-   NASA/Space Agency Partner data/resource identified and explained.
-   AI tools declared accurately.
-   Credits and references included.
-   Team members correctly listed/registered.
-   Submit through team Project tab before deadline.

## 7. Developer work plan

### Sprint 0 --- Repository audit (first coding-agent task)

1.  Inspect repository, package.json, scripts, README and branch.
2.  Identify scene flow and game-state architecture.
3.  Find map/exterior JSON and Communication Room entry.
4.  Identify interaction, HUD, resource, dialogue and scene-transition
    code.
5.  Run existing tests, lint and build.
6.  Report exact files, commands, results and risks.
7.  **Do not edit during audit.**

Audit output: concise implementation map and smallest safe change plan.

### Sprint 1 --- N.E.I.L. vertical slice

1.  Reuse existing Communication Room interaction.
2.  Add/complete terminal panel for N.E.I.L. messages.
3.  Add compact dialogue/state controller.
4.  Connect dialogue to actual mission state.
5.  Add one player choice.
6.  Ensure choice invokes game rules, not only UI animation.
7.  Add outcome response and learning card.
8.  Test keyboard/mouse and scene lifecycle.

### Sprint 2 --- Resource simulation

1.  Audit existing resource code.
2.  Implement one authoritative resource state only if missing.
3.  Add deterministic action validation/effects.
4.  Connect HUD to state.
5.  Add simple mission result calculation.
6.  Test insufficient resource, repeated click, scene re-entry and
    invalid action.

### Sprint 3 --- NASA evidence

1.  Select one verified Mars environmental observation.
2.  Record source URL, date, instrument, unit, location and meaning.
3.  Build normalized local snapshot.
4.  Add visible source/evidence card.
5.  Keep a training-simulation fallback.
6.  No network dependency during gameplay.

### Sprint 4 --- Polish

-   Fix interaction feedback/loading states.
-   Ensure N.E.I.L. dialogue is readable and doesn't obscure game.
-   Confirm resource changes are visible.
-   Confirm no softlocks.
-   Run build/lint/tests.
-   Capture official-format demo.

## 8. Coding agent operating rules

1.  Audit before edits; never assume paths or architecture.
2.  Preserve working code. Do not rewrite map, exterior JSON or
    Communication Room entry unless a verified bug requires it.
3.  No framework migration or unnecessary dependencies.
4.  Use installed Phaser version and existing Vite setup.
5.  Keep changes incremental and focused.
6.  Before editing, list exact files to change and why.
7.  After editing, report files changed, behavior and tests/build run.
8.  Never claim a feature is complete unless it works in-game.
9.  Never fabricate NASA data, URLs, instrument names, units or live API
    status.
10. Do not invent N.E.I.L.'s acronym expansion or unapproved lore.
11. No external LLM chatbot for MVP; N.E.I.L. is deterministic and
    in-game.
12. No extra missions before the first mission loop works end-to-end.
13. If architecture is unclear, stop and ask instead of creating a
    parallel system.
14. Follow current JavaScript conventions.
15. Every player choice must produce a real, testable game-state
    consequence.

## 9. Master prompt for the coding agent

Copy everything inside this block and provide the repository/workspace
to the agent.

``` text
You are the senior game engineer collaborating with me on REVO, our NASA Space Apps Challenge 2026 project.

PROJECT
REVO is a browser-based 2D top-down Mars outpost STEM game for children aged 7–12. It responds to the official challenge “Build a Junior Astronaut Mission Trainer”. Players experience real outpost trade-offs involving life support, radiation awareness/shielding, power and food production.

KNOWN STACK
- Phaser 4.1.0 (verify in package.json)
- JavaScript
- Vite
- Existing project, not greenfield
- Existing map/exterior JSON
- Existing Communication Room entry interaction
- Last checkpoint reported 13 tests/lint/build checks passed; rerun and verify.

GAME DESIGN
- Main character: REVO, curly orange hair, white/orange astronaut suit.
- N.E.I.L. is the in-game digital mission assistant, presented through terminal/panel interactions.
- Main hub: Communication Room.
- Planned stations: Power Control, Oxygen/Life Support, Food/Growing and Mars exterior.
- HUD: POWER, OXYGEN, FOOD; shelter readiness and Earth communication are mission indicators.
- Nuclear energy is the agreed main power source. Do not make dust storms disable nuclear power by default.
- Core loop: Explore → Inspect → Understand → Decide → Resolve → Learn.
- First mission: “Keep Alpha Base Running”.

FIRST TASK — AUDIT ONLY. DO NOT EDIT FILES.
1. Inspect relevant repository structure.
2. Read package.json, scripts, README, scene setup and state-management code.
3. Find map/exterior JSON and Communication Room entry.
4. Find player, interaction, HUD, resource, dialogue, mission and scene-transition modules.
5. Run existing test, lint and build commands.
6. Report exact stack/version, architecture/scene flow, implemented features with file paths, missing features, commands/results, risks and smallest safe plan.
7. Do not rewrite working systems or assume anything not verified.

AFTER I APPROVE THE AUDIT, IMPLEMENT IN SMALL STEPS.

PRIORITY 1 — N.E.I.L.
N.E.I.L. is not a generic chatbot. It is a deterministic, rule-based mission assistant connected to actual game state. No external LLM/API is needed for MVP.
It must deliver alerts, explain events in child-friendly language, guide the player to stations, present choices without revealing the answer, react to the selected action, explain actual outcomes, and show a short science takeaway with source.
Use a compact dialogue/state system. Reuse existing architecture. Do not create a second source of truth. Do not invent what N.E.I.L. stands for.

PRIORITY 2 — FIRST COMPLETE MISSION LOOP
Build Communication Room entry → N.E.I.L. alert → terminal inspection → station visit → science/evidence card → player decision → validated shared-state change → HUD update → N.E.I.L. outcome explanation → mission result/learning card.

PRIORITY 3 — RESOURCE SYSTEM
Inspect existing resource code first. If needed, implement one authoritative resource model and deterministic action rules. Propose values/costs/thresholds explicitly before hardcoding. Clamp values, validate actions, prevent duplicate execution, and test insufficient resources and scene re-entry.

NASA SCIENCE RULES
- Prefer verified Mars environmental evidence (e.g. Perseverance MEDA) for Mars dust/environment scenarios.
- DONKI is space-weather data, not Mars dust-storm detection.
- RadLab ISS readings are not Mars surface radiation measurements.
- Opportunity historical measurements must preserve date, location, instrument and unit; do not present them as current Jezero conditions.
- Fictional events must be labelled TRAINING SIMULATION.
- Cached NASA records must show their actual record date.
- Never invent NASA measurements or claim a live API call succeeded if it did not.
- Keep raw response separate from normalized game model.
- Prefer a validated local snapshot; no network dependency during gameplay.

IMPLEMENTATION RULES
- Preserve existing map, exterior JSON and Communication Room entry unless a real bug requires a change.
- No framework migration, unnecessary packages or unrelated refactor.
- Before each implementation step, list exact files to change and why.
- Implement one vertical slice at a time.
- After each step, run relevant tests/lint/build.
- Report exact files changed, user-visible behavior, test results and remaining issues.
- If a key design decision is missing, ask me instead of inventing it.
- Do not claim completion without verifying behavior.

Start with the audit only. Return the audit report and wait for my approval before changing code.
```

## 10. Official references

-   2026 event: https://www.spaceappschallenge.org/2026/
-   Official challenge:
    https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/
-   Official resources/guides:
    https://www.spaceappschallenge.org/resources/
-   NASA Open APIs: https://api.nasa.gov/
-   DONKI: https://ccmc.gsfc.nasa.gov/tools/DONKI/
-   OSDR: https://osdr.nasa.gov/bio/repo/
-   RadLab API: https://visualization.osdr.nasa.gov/radlab/gui/data-api/
-   Mars Trek: https://trek.nasa.gov/mars/
-   CSA Food Production:
    https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/

## Final engineering principle

**Do not make REVO bigger. Make its first mission real.**

The next milestone is a complete playable loop in which N.E.I.L.
explains a source-grounded event, the player makes a meaningful choice,
the shared game state changes, and the player understands why.
