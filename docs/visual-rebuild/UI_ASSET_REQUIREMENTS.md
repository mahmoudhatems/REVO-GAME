# UI visual requirements

The game targets children aged 7–12, browser-first, landscape. UI should be high contrast, concise, keyboard/touch legible, and largely code-drawn. Keep final resource concepts to POWER, OXYGEN and FOOD; BATTERY is a power sub-status. No MMORPG health/mana bars or excessive inventory hotbar.

| UI ID | Element | Recommendation | Art vs code | Acceptance |
|---|---|---|---|---|
| UI-001 | Bottom-left minimap | Approximately 210 × 145 px at 1280 × 720 logical size (review safe-area); simple Mars/paths view, REVO marker and 8 facility markers, north/orientation cue only if needed | Phaser-drawn frame/markers; approved map geometry data | Readable at minimum supported mobile landscape size; does not cover movement; no GTA branding or copied layout art. |
| UI-002 | Player/facility map markers | 12–18 px markers, distinct shapes for player, facility, objective, hazard | Code-drawn vector/pixel primitive or reviewed icon | Shape plus color; label on focus; markers map to stable IDs. |
| UI-003 | Objective panel | Compact top-left/top-center, max two active tasks, one-line short description | Code-driven text and icons | Hides optional detail; supports focus and readable wrap. |
| UI-004 | POWER / BATTERY | One power meter/status with battery reserve as a labeled secondary segment/value | Code-driven; source icons optional | Clearly distinguishes generation, storage and distribution without reactor imagery. Values are fictional when simulated. |
| UI-005 | OXYGEN and FOOD | Two compact status meters with short labels, icons, state text | Code-driven | Do not present as NASA-measured values; no unlabeled red/green-only states. |
| UI-006 | Crew safety | Contextual warning/status panel, not a permanent fourth meter | Code-driven with approved warning icon | Appears only when relevant; clear next action; no shielding efficacy claim. |
| UI-007 | Mission day | Small “DAY N / 30” chip in stable top bar | Code-driven | Sol/day definition available in child-friendly help; day advances only in actual mission logic. |
| UI-008 | Interaction prompt | Contextual facility/object name + one action line; desktop key and mobile button label selected by input mode | Code-driven | Single nearest action, range-gated, no prompt competition, transition lock. |
| UI-009 | Tutorial prompt | Short dismissible hint panel with one instruction | Code-driven | Never blocks essential movement/action; context-aware and localizable. |
| UI-010 | N.E.I.L. speech bubble | Rounded compact bubble with visible tail toward N.E.I.L.; max 2–3 short lines; optional 36 × 36 or 48 × 48 portrait | Phaser UI component; robot portrait uses approved N.E.I.L. art | Tail tracks companion; text authored and data-driven; no generated text baked into image. |
| UI-011 | Mission notification | Small, timed banner with icon, title and one-sentence consequence | Code-driven; tiny icon artwork only if needed | Does not obscure route or player; screen-reader/accessibility text equivalent where supported. |
| UI-012 | Achievement badge | 48 × 48 px icon with name/reason in panel | Pixel art badge optional; layout/text code-driven | Reward curiosity/teamwork/responsibility as well as outcomes; no score-only moral. |
| UI-013 | Mission score/report | Final status, important decisions, three resource states, objective completion and learning notes | Code-driven report card; optional frame treatment | Clearly marks fictional values; printable/shareable only after privacy review. |
| UI-014 | Pause/settings | Clear Resume, Audio, Accessibility, Return actions | Code-driven | Keyboard and touch reachable; scene target must not lose mission state. |

## Visual system

- 1280 × 720 logical viewport; landscape first. Keep a 48 px minimum edge safety margin on desktop, adjusted for touch safe areas.
- Main text 22–28 px; standard UI 18–22 px; secondary labels 16–18 px at 1× logical scale. Avoid current 8–14 px scene labels for critical action.
- Use navy/dark translucent panels over Mars ground, light text, cyan as informational accent, yellow-orange as warning/interaction accent. Keep semantic color consistent and pair with words/icons.
- Use no more than three persistent information clusters: mission/objective, resource HUD, minimap. Relegate crew safety, communication delay, science fact and warning detail to contextual cards.
- Avoid sprite sheets for static UI panels if Phaser geometry/text can provide crisp borders, localization and resize behavior. Use artwork only for meaningful icons/character portraits/badges.
- Do not bake labels, numbers, language-specific words, NASA marks or resource values into PixelLab images.

## UI image candidates and gaps

Existing UI_Elements (123) and UI_Icons (50) are source candidates, not approved final UI. Catalog labels/unknown symbols need owner visual review; use current catalog IDs only after matching the actual glyph and license evidence. `UIC-0011` / `UIC-0012` O₂ visuals are proposed symbols, not machine art. No minimap or final HUD art is confirmed. Existing code UI and current font ownership/license also require audit; current scene uses Arial-like system fonts and Web Audio synthesis.

## Interaction states

For every reusable button/control, define normal, focus/keyboard, hover/mouse, pressed, disabled, busy, success, and error states. Mobile controls require touch-size testing and text action equivalent. Apply reduced motion for pulsing arrows/badges and never use rapid flashes. Keep dialogue separate from HUD business state.
