# Animation requirements and source audit

No animation art was generated or modified. Source artwork must be inspected before spritesheet registration; static PNGs and a door cross-fade are not frame animations.

## REVO source findings

- File: `assets/revo.png`; 256 × 256, RGBA with binary alpha (36,441 transparent pixels, 29,095 opaque pixels); runtime is copied to `public/assets/revo.png`.
- Runtime frame declaration: 42 × 64 px. That yields 6 columns × 4 rows = 24 frame slots, with 4 px horizontal remainder (256 − 6×42); inspect sheet padding and cell alignment before crop changes.
- The visible sheet has two visually different outfit rows: top rows show helmet/suit; lower rows show orange-haired uncovered head. `GameScene.createCharacterAnimations()` currently maps outdoor animation keys to frame indices 0–11 and indoor keys to 12–23. This makes indoor/outdoor identity visually inconsistent in the source sheet. Owner's REVO identity remains approved; map corrections or new frames require owner review.
- Keys use repeated frame indices such as `[0,3,0,6]`, `[1,7,1,7]`, `[2,8,2,9]`, `[4,5,4,10]`; they do not establish a conventional cycle, timing, foot contact, or idle. The scene calls `anims.stop()` when idle, so there is no authored idle loop. Footstep timing/sound synchronization is not found in `PlayerControls`.
- Approval: preserve current sheet; do not generate a replacement. First map every cell by direction/outfit/pose and measure its visible bounds. Ask owner only for gaps that cannot be solved by a safe frame mapping.

## Proposed animation deliverables

Fixed-cell transparent PNG sheets; use the same cell dimensions for every frame in a sheet, one direction/state per row or separate named sheet, no embedded labels, and a text manifest. Exact FPS and pivots are starting values to review in browser; animation event frame markers must be selected after inspecting the approved art.

| Asset ID | Character/object and Phaser key | Direction/state | Frames × cell | FPS / loop | Pivot / events | Approval |
|---|---|---|---|---|---|---|
| REVO-AUDIT | Existing player `character`; existing `out_*` / `in_*` keys | 4 directions; audit the top-down and side-looking visual difference before remap | Existing sheet 24 slots, 42 × 64 | Current key frameRate 8 and repeat -1; verify valid frame meanings before retaining | Feet-center around (21, 60) is an initial pivot hypothesis only; confirm pixels. Add footstep marker only after foot-contact frames are identified. | Preserve/owner-approved identity; mapping needs review |
| VIS-051A | N.E.I.L. `neil_idle_*` | Front/back/left/right idle (may mirror left/right only if asymmetry allows and owner approves) | 2–4 frames × 42 × 56 per direction | 4–6 fps, loop | Ground contact point; no sound event | Proposed |
| VIS-051B | N.E.I.L. `neil_walk_*` | 4 directions | 6 frames × 42 × 56 per direction (proposal) | 8 fps, loop | Ground contact; candidate contact frames 0/3, verify after art | Proposed |
| VIS-051C | N.E.I.L. `neil_talk_*` | Front and side first; back only if used by camera | 4 frames × 42 × 56 | 6 fps, loop while authored dialogue line plays | Keep foot pivot fixed; dialogue timing stays data-driven | Proposed |
| VIS-051D | N.E.I.L. `neil_happy`, `neil_think`, `neil_guide_*` | Reactions plus 4-direction guidance | 3–4 frames per one-shot; guide 2–4 frames × 42 × 56 | 6 fps; one-shot reactions, looping guide only when needed | Event at completed gesture for UI cue; no spoken language baked into pixels | Proposed |
| VIS-052 | Facility door `facility-door-open` | One consistent face/orientation; use mirrored/rotated variants only after pivot validation | 5 frames × 64 × 48 | 10 fps, one-shot open; reverse sequence for close | Hinge/base pivot recorded in frame pixels; event after final open frame | Proposed |
| VIS-053 | Solar/control/life-support machinery | `inactive` and `active` state; keep state change legible | 2–4 frames per device × frame size per approved prop (measure source art) | 4–6 fps loop or static state where animation adds no clarity | `active` state must not imply real measurements; optional activation sound marker | Proposed |
| VIS-054 | Warning beacon `warning-beacon` | all-direction/rotating-light effect as sprite or separate VFX | 4–6 frames × 24 × 24 (proposal) | 6 fps loop, only during authored alert | No flashing above comfortable pace; accessibility alternative | Proposed |
| VIS-055 | Console feedback | `console-idle`, `console-active`, `console-confirm` | Keep screen contents code-drawn; 2–3 frame bezel/light animation if art has moving parts | 4–8 fps loop/one-shot | One interaction event per activation; prevent repeated audio spam | Proposed |

`42 × 56`, `64 × 48` and other future cells are canvas recommendations. Final dimensions must be locked only after testing against the approved VIS-001 scale board and actual source art. PixelLab frame order is never assumed; save frame-order proof/contact sheet and run in Phaser before approval.

## Animation QA checklist

- Confirm PNG dimensions, alpha, frame grid, padding and that no pixels cross frame boundaries.
- Inspect each frame at native size on checkerboard and dark/light ground; check black pixels for intentional outline vs unintended background.
- Verify consistent feet/hinge pivot across frames; check that motion does not jitter.
- Confirm frame order and state/direction mapping; test stop/start and scene transitions.
- Verify `repeat` and FPS in runtime; use actual `animationcomplete` for one-shots, not guessed timers.
- Add named event markers only at visually verified frames; synchronize sound without creating repeated events on loop seams.
- Check object/player depth sorting, collision bounds independent of visual animation, and reduced-flash/accessibility behavior.
