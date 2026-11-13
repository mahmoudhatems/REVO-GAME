# VFX and audio requirements

Requirements are for future polish and are not runtime changes. Use the project-approved free sources/tools named in the owner brief. Check each tool/download's current license and permitted use before including output; the asset register remains `UNVERIFIED` until recorded.

## Effects

| Effect ID | Experience and use | Suggested construction/tool | Constraints / acceptance |
|---|---|---|---|
| FX-001 | Sparse Mars dust motes on ordinary exterior days | PixelGame pixel-art effects or hand-authored Phaser particles | Low density and contrast; do not obscure paths, prompts, or player. Keep generated weather fictional. |
| FX-002 | Foot-level dust puffs on exterior movement | PixelGame or small Phaser particle with authored pixel texture | Trigger at verified REVO foot-contact frames; use rate limit; no continuous smoke trail. |
| FX-003 | Indoor footstep/surface response | Phaser layer tint or tiny authored step spark, usually no particle | Avoid dust inside rooms; preserve player visibility. |
| FX-004 | Dust storm visibility and wind | PHOSPHOR / Pixel FX or Phaser overlay, staged layers | Future mission event only; reduce visual range/readability modestly. Do not claim a real-time Mars forecast. Pair with approved solar-generation gameplay rule. |
| FX-005 | Door open/close cue | Door sprite animation plus small hinge/pressure light cue | Door animation must be verified, not the current candidate-image cross-fade. Keep collision/open gap synchronized. |
| FX-006 | Console and solar inspection confirmation | Tiny pixel sparkle/light pulse or status highlight | One-shot per successful interaction; pair with accessible textual state. |
| FX-007 | Warning beacon | Simple 4–6 frame pixel loop or Phaser-drawn light | Use amber and shape/pattern in addition to red; avoid rapid flashing. |
| FX-008 | Achievement feedback | Phaser UI tween plus one small particle burst | Do not block play; celebratory but not punitive; avoid a new atlas for this alone. |
| FX-009 | Greenhouse irrigation/growth cue | Small droplet or plant highlight | Only when that mechanic exists; do not imply actual crop outcome before state changes. |
| FX-010 | Solar dust accumulation/cleaning | Two static sprite states or a sparse overlay | Explicitly tied to fictional dust-management mechanic; preserve exterior array architecture. |

Potential free tools named in project owner materials: [PixelGame effects](https://pixelgame.io/en/tools/pixel-art-effects/), [Pixel FX](https://github.com/patch-gg/pixelfx), [PHOSPHOR](https://sinopskyd.itch.io/phosphor), and [Pixelorama](https://pixelorama.org/). These are options, not installed dependencies; verify tool and exported asset licensing on intake. Prefer Phaser-authored transient effects when they meet the style requirements.

## Audio list

| Sound ID | Required cue | Timing/mix |
|---|---|---|
| SFX-001 | Outdoor dusty footsteps | Sync to verified stride contacts; soft, low-volume, alternating stereo/variation only if accessible. |
| SFX-002 | Indoor metallic footsteps | Shorter, slightly more resonant than outdoor; do not overlap every frame. |
| SFX-003 | Greenhouse footsteps | Softer/less metallic room variant; add only after room art identifies material. |
| SFX-004 | Door open and door close | One short mechanical/pressure cue each, aligned with door state transition. |
| SFX-005 | Console/select/confirm | Quiet click/tone with distinct success/error feedback. |
| SFX-006 | Warning alert | Gentle, recognizable, non-startling; accessible visual/text companion. |
| SFX-007 | N.E.I.L. communication | Friendly short chirp/voice-like synthesized cue; avoid generated speech/chatbot implication. Dialogue remains authored text/audio. |
| SFX-008 | Dust storm ambience | Soft wind/dust bed with volume controls and no startling peaks; only in authored simulated storm. |
| SFX-009 | Solar panel inspection/maintenance | Small tool/connection cue; no unsupported real machinery claim. |
| SFX-010 | Achievement/reward | Positive restrained confirmation; avoid loud or manipulative reward audio. |

Owner-approved audio sources: [Kenney RPG Audio](https://kenney.nl/assets/rpg-audio), [Kenney Sci-Fi Sounds](https://kenney.nl/assets/sci-fi-sounds), [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds). Confirm current license files and attribution before use. The existing `src/utils/audio.js` synthesizes music/effects with Web Audio; this is temporary prototype sound, not a verified final audio library.

## Technical and accessibility requirements

- Use `AudioFX`/audio feature boundaries; preload a selected small cue set rather than decoding an entire library.
- Provide master/music/effects settings, avoid autoplay assumptions, and preserve mute preferences if settings exist.
- Do not play a sound if browser user-gesture rules prevent it; no unhandled promise rejection.
- Respect one-shots, throttle repeated interaction, and stop/release loops on scene shutdown/pause.
- Keep alert communication available through text/shape as well as color/sound; support reduced motion and low-flash modes.
- Preserve each downloaded asset's source/license document; no paid tool is a requirement and no generated audio job is authorized here.
