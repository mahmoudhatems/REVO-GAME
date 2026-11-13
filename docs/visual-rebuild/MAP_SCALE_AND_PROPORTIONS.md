# Map scale and proportions guide

Recommendations are for review, not accepted geometry changes. Preserve the current JSON map as runtime source of truth; do not alter it during this art-preparation task.

## Measured anchors

| Item | Current verified size/data | Implication |
|---|---|---|
| Logical target | 1280 × 720 (16:9) per architecture | Design safe zones and object visibility for this landscape viewport, then test mobile landscape/desktop ratios. |
| Exterior map | 80 × 45 nominal tiles × 32 px = 2,560 × 1,440 px (16:9) | 2× logical view at 1 world px per logical px; camera follows player through map. |
| REVO | `assets/revo.png` 256 × 256; runtime frame 42 × 64 px; physics body 20 × 30 px with source offset (11,34) | Preserve identity and frame art; rendering frame includes transparent padding. Check body-to-visible bounds before any scale change. |
| Existing exterior building crops | BLD-0001 100 × 77; BLD-0003 73 × 72; BLD-0004 76 × 67; BLD-0005 83 × 77; BLD-0007 83 × 69 | At native scale modules are about 1.1–2.4 REVO frame widths; current facility outlines span 8–15 tiles (256–480 px), so single crops visibly underfill footprints. Assemble modular artwork, don't stretch crops. |
| Existing doors | DOR-0005 60 × 46; DOR-0006 66 × 46; DOR-0009 73 × 35 | Current closed/open candidate pair dimensions differ; they are not frame-aligned animation. Rebuild matched frame after doorway scale is approved. |
| Existing room | 640 × 448 px, 1.43 aspect; entry y330, exit y416; wall 20 px; opening 96 px | Current room is half the logical screen width and is built on 60 × 64 floor texture repeated. Current fixed UI clipped in capture; verify scale/camera before final design. |

## Recommended starting proportions

| Component | Draft proportion at 1280 × 720 logical view | Reason / adjustment gate |
|---|---|---|
| REVO display frame | 42 × 64 px at 1× as initial anchor | Existing frame. Keep foot pivot at measured opaque foot-center, not assumed frame bottom. Need consistent outfit/direction mapping first. |
| N.E.I.L. companion | 36–42 × 48–56 px | Similar ground scale, visibly shorter than REVO, expressive face/display; one clear silhouette. Owner must choose wheeled/legged/hover mobility. |
| Main exterior door opening | 72–96 px clear width × 80–112 px visual height | 1.7–2.3 REVO frame widths; permit the 20 px collision body plus approach clearance. Art frame size and collision opening are independent. |
| Building assembly | 240–400 px width × 160–280 px depth depending role | Multi-part assembly: roughly 4–8 REVO frame widths across; large enough to read as outpost but not fill the whole room footprint. Needs map footprint and camera review. |
| Small facility footprint | 256–320 × 192–256 px | About 0.2–0.25 screen width and 0.27–0.36 screen height; room for silhouette and door. Verify paths/collisions. |
| Communication hub footprint | 384–512 × 256–320 px | Main hub should dominate other facilities but allow readable paths and neighboring sites. Keep its entry prominent. |
| Interior room | 768–960 × 480–600 px starting range | Larger than current 640 × 448 and sufficient for walk lanes, multiple interaction stations and companion. Camera can show whole room at zoom ~0.8–1 or pan modestly. Review against target UI/view. |
| Walkable aisle | 96–128 px minimum clear width; 160 px main central route | 2–3.8 player widths with furniture, gives child comfortable movement and turn-around room. |
| Console/furniture | 64–120 px wide × 32–64 px deep; top surface around REVO waist/torso in low-top view | Show usable interaction face; protect 64 px player approach path. Avoid oversized placeholder panels. |
| Interaction radius | 64–88 px; use smaller 48–64 px for dense consoles | Around 1–1.4 REVO frame heights; show one nearest prompt only. Do not make hidden targets reachable through walls. |
| Camera zoom | 1× on 1280 × 720 logical view; tune 0.8–1.1 where viewport/camera demands | Prefer responsive viewport scaling without changing sprite aspect. Show enough neighboring context while keeping REVO identifiable. |
| N.E.I.L. bubble | 260–360 px wide × 88–132 px high; tail 16–24 px | Keep 2–3 short lines and away from HUD/edges; anchored to robot, code-driven text. |
| Minimap | 210 × 145 px; lower-left safe area | Shows paths/facilities without treating every prop as a marker. UI scale at 1280 × 720. |
| HUD | Top band 56–72 px high; resource cluster 360–520 px total width | Three core resources; BATTERY sub-status. Keep mission objective/day concise and leave play field visible. |

> The 0.2–0.25 screen-width estimates above refer to the actual ratios: 256–320 px is 20–25% of a 1280 px view. All recommended dimensions are draft ranges, not measurements of final art.

## Exterior composition

- Keep central Communication Room as largest visual landmark near map center; use a clear south-facing entrance and a readable hub sign.
- Keep solar panels outside occupied buildings and visible from a navigable main path. Place indoor Battery Storage adjacent to Indoor Power Control; depict a cable/conduit relationship in art/map, while preserving distinct facility spaces.
- Preserve separate Oxygen Generation, Research Lab, Greenhouse, Radiation Shelter, and southern Airlock. Do not place all buildings in one unbroken wall; use controlled negative space and traversable spokes.
- Main path width: 96–128 px (3–4 nominal 32 px cells) for primary routes; secondary routes 64–96 px. Avoid narrow gaps below body width + margin.
- Keep interactive art off door clearances and place trigger points on walkable floor, not behind walls or on top of collision props.
- Decoration clusters: edge/corner rocks, low-contrast dust/craters, occasional signs/lights, explicit solar wiring. Avoid dense prop noise around entrances or minimap objectives.
- Maintain 16:9 world bounds. At 1280 × 720, ensure spawn and objective are framed with landmarks; mobile safe areas must not hide prompts or joystick/action controls.

## Interior composition

- Use distinct facility floor/wall palette per role while maintaining shared trim, light direction and material family.
- Target at least 60% unobstructed floor inside the walkable boundary; provide a clear continuous path from entrance to each primary interaction with 64–96 px approach clearance.
- Put interactive consoles/screens along walls/edges; reserve a central lane. Place N.E.I.L. where the player can approach without blocking the exit or overlapping another prompt.
- Keep visual art bounds and collision separate in JSON; list collision footprints and interaction points alongside each asset placement. Shadows/depth are visual only and must not imply solid collision.
- All room-specific objects use their own art and facility data; no six duplicated Scene implementations and no generic room label pretending to identify equipment.

## Required proportion review before art integration

Create an unscaled comparison board of the actual REVO frame, N.E.I.L. target, doors, one building assembly, console, floor cell, and 1280 × 720 viewport. Test native-size screenshot, mobile landscape viewport, approach clearance, fixed UI and legibility. Get owner approval before changing map footprints, tile pitch, character dimensions, camera zoom, or collision geometry.
