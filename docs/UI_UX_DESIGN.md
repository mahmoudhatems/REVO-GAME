# REVO UI/UX Design (Mission 1 build)

Branch `feature/ui-system`. Phaser 4.2.1, scene overlays, pure-JS domain. Child-first: short sentences, large targets, no dead buttons.

## 1. Architecture
- `src/features/mission/domain/*`: pure JS, no Phaser. `missionStore` is the single authoritative mission state (`getState`, `subscribe`, `onEvent`). All HUD, station, flow and logbook screens read only from it.
- `src/features/neil/neilDialogue.js`: deterministic authored N.E.I.L. lines and priority rules. No LLM.
- `src/features/ui/*`: tokens, pixel icons, asset keys, components (`core.js`, `cards.js`, `overlays.js`), `overlayManager.js`.
- Scenes: `Hud` (always on over the world), `Station`, `MissionFlow`, `Logbook`, `Objectives`, `Controls`, rebuilt `Pause`.
- Overlay rule: opening a full-screen overlay pauses `Game` and sets `registry.overlay`; global ESC/P ignores presses while it is set, so the world can never resume under an open overlay.

## 2. Approved values (Mission 1, from `mission_1_the_beating_heart.md`)
10 days, battery 25/50 kWh, water 300 L shown as a full 10-bar meter, base load 5 kWh/sol. Options: Emergency (1 small panel, 1 day, +6 bars/day), Basic (2, 2, +12), Medium (3, 3, +18), Giant (4, 4, +24), each with the supplied risk text. Values live in `missionConfig.js`; do not change them without owner approval.

## 3. Fact labelling
Every learning or log entry carries one label: `NASA FACT` (with reference), `REVO MISSION EVENT` (fiction), or `GAME SIMULATION`. The 0.3% daily dust loss is a game simulation rule. Opportunity operated at Meridiani Planum, not Jezero. Solar arrays are primary power, batteries store only, no nuclear reactor.

## 4. Open items and honest limits
- Bars-to-kWh conversion is undefined: after deployment the stored battery stays 25/50 kWh; generation is shown as a "design value". Switch: `MISSION_1.rules.batteryAppliesGenerationOnDeploy`.
- The "-1" drain indicator beside the power meter is visual only.
- Oxygen, food, radiation, temperature, fitness and flow/filter values have no approved numbers and show `NO DATA`.
- Dust is inactive during the Mission 1 phase (`dustActiveInMission1Phase: false`).

## 5. Screens
HUD (countdown, power with -1 indicator, water, oxygen/food NO DATA, logbook with unread badge, Stations, Pause, resource detail panel, "E" interaction prompt, notifications). Seven stations (Overview / Equipment / Learn tabs, paged equipment grid, detail panel, INSPECT adds a logbook discovery, N.E.I.L. guidance strip, Station Navigation). Mission 1 flow: Briefing, Solar Deployment Decision (confirm modal with consequences), Deployment animation and Feedback, Dust Warning, Logbook Update, End of Phase, Mission 2 gate ("not implemented"). Logbook (7 sections). Pause (Resume, Objectives, Logbook, Settings planned/disabled, Controls, Main Menu with confirmation).

## 6. Station mapping
power -> Solar Power, life -> Oxygen & Heating, central -> Main Habitat, greenhouse -> Greenhouse, radiation -> Radiation Shielding. Water & Recycling and Crew Health & Fitness have no map room; they are reached from the HUD STATIONS button or Station Navigation. No map geometry, collision, trigger or interaction locations were changed.

## 7. Assets
Original catalog files are copied unmodified (original filenames) to `public/assets/revo-ui/catalog/` by `scripts/ui-assets/sync-ui-assets.mjs`; the manifest records `license: UNVERIFIED`, `approval: pending_owner_approval`. Generated station sprite sheets (Water, Solar, Oxygen) are in `public/assets/revo-ui/stations/` (generator in `scripts/station-sprites/`). Textures use nearest-neighbor filtering. Equipment without art shows a yellow `PLACEHOLDER` card (Radiation Monitor, Grow Lights, Crew Health exercise/medical/vitals items).

## 8. Testing
`npm test` (Vitest, 15 domain tests), `npm run build`, and headless-Chrome runtime checks (`?debug` exposes `window.__REVO_GAME__` for tests only). Verified at 1100x700 and 390x760.
