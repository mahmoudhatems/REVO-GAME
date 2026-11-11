# REVO — Stage 2B Asset Selection Review

> **Owner review package. Nothing in this document is approved for final map placement.** Every shortlisted asset retains the catalog approval state and license state; proposed groupings are visual recommendations only.

## Review rules

- Asset IDs, semantic keys, filenames, dimensions, source paths, classifications, and crops come from `src/data/assets/asset-catalog.json`.
- All listed images are canonical original-size assets. The archive is read-only.
- Confidence describes visual suitability for the proposed grouping, not scientific/engineering correctness or owner approval.
- A generic canister, cabinet, or machine is not labeled as a battery, oxygen generator, or power unit unless its appearance/source supports that identity.
- Contact-sheet references point to the relevant category page; the local HTML gallery is a read-only filtering view.

## Facility shortlist

### Central Communication Room

**Overall confidence:** Medium. Generic room modules plus desk/terminal and antenna-like props form a plausible mission-control grouping; none is identified as N.E.I.L. hardware.

| Asset ID | Semantic key | Original filename | Exact source path | Dimensions | Contact sheet | Classification | Suitability and confidence | Approval / license |
|---|---|---|---|---:|---|---|---|---|
| BLD-0001 | `buildings.building_001_100x77.bld-0001` | `Building_001_100x77.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Buildings/Building_001_100x77.png` | 100 × 77 px | [Buildings-01.png](../asset-contact-sheets/Buildings/Buildings-01.png) | CANDIDATE | Generic habitat module candidate; appearance alone does not identify this as the hub. **Confidence:** Low. | pending_owner_approval; UNVERIFIED |
| BLD-0002 | `buildings.building_002_65x72.bld-0002` | `Building_002_65x72.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Buildings/Building_002_65x72.png` | 65 × 72 px | [Buildings-01.png](../asset-contact-sheets/Buildings/Buildings-01.png) | CANDIDATE | Compact equipment/habitat module candidate; exact function is unknown. **Confidence:** Low. | pending_owner_approval; UNVERIFIED |
| EQP-0055 | `tools_equipment.equipment_055_31x35.eqp-0055` | `Equipment_055_31x35.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_055_31x35.png` | 31 × 35 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Visible workstation/console with display; plausible operator station. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| EQP-0058 | `tools_equipment.equipment_058_31x34.eqp-0058` | `Equipment_058_31x34.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_058_31x34.png` | 31 × 34 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Desk and computer silhouette; plausible communication-room workstation. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| EQP-0063 | `tools_equipment.equipment_063_34x48.eqp-0063` | `Equipment_063_34x48.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_063_34x48.png` | 34 × 48 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Dish antenna silhouette; suitable as a proposed exterior communications prop, not proof of a particular system. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| UIC-0042 | `ui_icons.icon_042_19x27.uic-0042` | `Icon_042_19x27.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/UI_Icons/Icon_042_19x27.png` | 19 × 27 px | [UI_Icons-01.png](../asset-contact-sheets/UI_Icons/UI_Icons-01.png) | CANDIDATE | Antenna/radio-wave-like UI symbol; suitable as a proposed communication status icon. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| WAL-0002 | `walls_modular.wall_002_30x24.wal-0002` | `Wall_002_30x24.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Walls_Modular/Wall_002_30x24.png` | 30 × 24 px | [Walls_Modular-01.png](../asset-contact-sheets/Walls_Modular/Walls_Modular-01.png) | CONFIRMED | Straight modular wall segment for a constructed interior. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| WAL-0003 | `walls_modular.wall_003_28x28.wal-0003` | `Wall_003_28x28.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Walls_Modular/Wall_003_28x28.png` | 28 × 28 px | [Walls_Modular-01.png](../asset-contact-sheets/Walls_Modular/Walls_Modular-01.png) | CONFIRMED | Corner wall segment for a constructed interior. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| FLT-0001 | `floor_tiles.floor_001_60x64.flt-0001` | `Floor_001_60x64.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Floor_Tiles/Floor_001_60x64.png` | 60 × 64 px | [Floor_Tiles-01.png](../asset-contact-sheets/Floor_Tiles/Floor_Tiles-01.png) | CONFIRMED | Floor-panel artwork for an interior floor treatment; scale needs validation. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |

**Missing components:** No confirmed room-specific communication console, N.E.I.L. terminal, wall display, or communication-delay feedback set.

**Supplementary art / owner decision:** Owner-approved terminal/dashboard artwork and room signage. Keep N.E.I.L. as authored terminal dialogue, not a drone character.

### External Solar Arrays

**Overall confidence:** High for visual identity; Medium for layout. BLD-0007 is visibly a solar-array structure. EQP panel sprites are smaller visual candidates for repeated array elements; they are not evidence of electrical specifications.

| Asset ID | Semantic key | Original filename | Exact source path | Dimensions | Contact sheet | Classification | Suitability and confidence | Approval / license |
|---|---|---|---|---:|---|---|---|---|
| BLD-0007 | `buildings.building_007_83x69.bld-0007` | `Building_007_83x69.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Buildings/Building_007_83x69.png` | 83 × 69 px | [Buildings-01.png](../asset-contact-sheets/Buildings/Buildings-01.png) | CONFIRMED | Clearly depicts solar panels on a support structure; strongest supplied array asset. **Confidence:** High. | pending_owner_approval; UNVERIFIED |
| EQP-0013 | `tools_equipment.equipment_013_22x35.eqp-0013` | `Equipment_013_22x35.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_013_22x35.png` | 22 × 35 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Small panel-on-stand silhouette; possible supplementary array unit. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| EQP-0019 | `tools_equipment.equipment_019_34x32.eqp-0019` | `Equipment_019_34x32.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_019_34x32.png` | 34 × 32 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Panel-on-stand silhouette; possible repeated array element. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| EQP-0020 | `tools_equipment.equipment_020_26x34.eqp-0020` | `Equipment_020_26x34.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_020_26x34.png` | 26 × 34 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Smaller panel-on-stand silhouette; possible array detail. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |

**Missing components:** No verified cabling/connector kit or reviewed array count/orientation. Small panel props need a scale and repetition review.

**Supplementary art / owner decision:** If the owner wants a larger field than the supplied array art supports, create approved array-extension art and a readable, fictional cable/conduit connection.

### Indoor Power Control

**Overall confidence:** Medium. Control-panel and equipment-rack imagery could support a power-distribution room, but no supplied asset is explicitly named as a power controller.

| Asset ID | Semantic key | Original filename | Exact source path | Dimensions | Contact sheet | Classification | Suitability and confidence | Approval / license |
|---|---|---|---|---:|---|---|---|---|
| BLD-0004 | `buildings.building_004_76x67.bld-0004` | `Building_004_76x67.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Buildings/Building_004_76x67.png` | 76 × 67 px | [Buildings-01.png](../asset-contact-sheets/Buildings/Buildings-01.png) | CANDIDATE | Equipment-rack module candidate; exact function remains unknown. **Confidence:** Low. | pending_owner_approval; UNVERIFIED |
| EQP-0004 | `tools_equipment.equipment_004_28x37.eqp-0004` | `Equipment_004_28x37.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_004_28x37.png` | 28 × 37 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Console with two gauges and status lights; plausible control-panel detail. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| EQP-0006 | `tools_equipment.equipment_006_41x38.eqp-0006` | `Equipment_006_41x38.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_006_41x38.png` | 41 × 38 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Large equipment/console unit with a screen; plausible room machine. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| EQP-0017 | `tools_equipment.equipment_017_50x34.eqp-0017` | `Equipment_017_50x34.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_017_50x34.png` | 50 × 34 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Rack-like machine artwork; may provide a room equipment silhouette. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| EQP-0018 | `tools_equipment.equipment_018_37x34.eqp-0018` | `Equipment_018_37x34.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_018_37x34.png` | 37 × 34 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Cabled paired device; possible connection/detail prop, not verified as power cabling. **Confidence:** Low. | pending_owner_approval; UNVERIFIED |
| WAL-0002 | `walls_modular.wall_002_30x24.wal-0002` | `Wall_002_30x24.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Walls_Modular/Wall_002_30x24.png` | 30 × 24 px | [Walls_Modular-01.png](../asset-contact-sheets/Walls_Modular/Walls_Modular-01.png) | CONFIRMED | Straight wall segment for room construction. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| FLT-0001 | `floor_tiles.floor_001_60x64.flt-0001` | `Floor_001_60x64.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Floor_Tiles/Floor_001_60x64.png` | 60 × 64 px | [Floor_Tiles-01.png](../asset-contact-sheets/Floor_Tiles/Floor_Tiles-01.png) | CONFIRMED | Interior floor-panel candidate; verify against room grid. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |

**Missing components:** No confirmed power distribution board, labeled breakers, energy-flow display, or room-specific console.

**Supplementary art / owner decision:** Owner-approved power-control panel/room signage and a child-readable distribution display. Any values must be fictional gameplay values.

### Battery Storage

**Overall confidence:** Low. No catalog item is confirmed as a battery. The listed canister/tank-like images are visual analogues only and must not be labeled as battery hardware without owner confirmation.

| Asset ID | Semantic key | Original filename | Exact source path | Dimensions | Contact sheet | Classification | Suitability and confidence | Approval / license |
|---|---|---|---|---:|---|---|---|---|
| BLD-0006 | `buildings.building_006_69x73.bld-0006` | `Building_006_69x73.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Buildings/Building_006_69x73.png` | 69 × 73 px | [Buildings-01.png](../asset-contact-sheets/Buildings/Buildings-01.png) | CANDIDATE | Twin-cylinder module; candidate storage silhouette only, not identified as batteries. **Confidence:** Low. | pending_owner_approval; UNVERIFIED |
| EQP-0001 | `tools_equipment.equipment_001_28x39.eqp-0001` | `Equipment_001_28x39.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_001_28x39.png` | 28 × 39 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Small canister-like equipment; not identified as a battery. **Confidence:** Low. | pending_owner_approval; UNVERIFIED |
| EQP-0068 | `tools_equipment.equipment_068_17x23.eqp-0068` | `Equipment_068_17x23.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_068_17x23.png` | 17 × 23 px | [Tools_Equipment-02.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-02.png) | CANDIDATE | Barrel/canister-like prop; generic storage appearance only. **Confidence:** Low. | pending_owner_approval; UNVERIFIED |
| EQP-0069 | `tools_equipment.equipment_069_15x22.eqp-0069` | `Equipment_069_15x22.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_069_15x22.png` | 15 × 22 px | [Tools_Equipment-02.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-02.png) | CANDIDATE | Small canister-like prop; generic storage appearance only. **Confidence:** Low. | pending_owner_approval; UNVERIFIED |

**Missing components:** A clearly identifiable battery cabinet/storage module, charging/status indicator, and connector artwork are missing.

**Supplementary art / owner decision:** Owner-approved battery cabinet and simple charge/status visual. Do not use generic tanks as a final battery representation.

### Oxygen Generation / Life Support

**Overall confidence:** Low to Medium. The O₂ symbols and a few canister/machine sprites can support a status panel and generic equipment dressing. They do not confirm an oxygen generator or air filter.

| Asset ID | Semantic key | Original filename | Exact source path | Dimensions | Contact sheet | Classification | Suitability and confidence | Approval / license |
|---|---|---|---|---:|---|---|---|---|
| BLD-0006 | `buildings.building_006_69x73.bld-0006` | `Building_006_69x73.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Buildings/Building_006_69x73.png` | 69 × 73 px | [Buildings-01.png](../asset-contact-sheets/Buildings/Buildings-01.png) | CANDIDATE | Twin-cylinder module candidate for generic life-support equipment; function unverified. **Confidence:** Low. | pending_owner_approval; UNVERIFIED |
| EQP-0001 | `tools_equipment.equipment_001_28x39.eqp-0001` | `Equipment_001_28x39.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_001_28x39.png` | 28 × 39 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Canister-like equipment candidate; not identified as an oxygen cylinder. **Confidence:** Low. | pending_owner_approval; UNVERIFIED |
| EQP-0005 | `tools_equipment.equipment_005_26x37.eqp-0005` | `Equipment_005_26x37.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_005_26x37.png` | 26 × 37 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Enclosed machine/canister with a display; possible life-support machinery dressing only. **Confidence:** Low. | pending_owner_approval; UNVERIFIED |
| EQP-0049 | `tools_equipment.equipment_049_27x33.eqp-0049` | `Equipment_049_27x33.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_049_27x33.png` | 27 × 33 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Transparent-looking vertical container with green contents; function unclear. **Confidence:** Low. | pending_owner_approval; UNVERIFIED |
| UIC-0011 | `ui_icons.icon_011_33x32.uic-0011` | `Icon_011_33x32.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/UI_Icons/Icon_011_33x32.png` | 33 × 32 px | [UI_Icons-01.png](../asset-contact-sheets/UI_Icons/UI_Icons-01.png) | CANDIDATE | Clearly contains an O₂ glyph; suitable as a proposed UI/status symbol, not as machinery. **Confidence:** High for symbol; low for system meaning. | pending_owner_approval; UNVERIFIED |
| UIC-0012 | `ui_icons.icon_012_30x32.uic-0012` | `Icon_012_30x32.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/UI_Icons/Icon_012_30x32.png` | 30 × 32 px | [UI_Icons-01.png](../asset-contact-sheets/UI_Icons/UI_Icons-01.png) | CANDIDATE | O₂-labeled cylinder-like icon; proposed status symbol only. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| WAL-0002 | `walls_modular.wall_002_30x24.wal-0002` | `Wall_002_30x24.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Walls_Modular/Wall_002_30x24.png` | 30 × 24 px | [Walls_Modular-01.png](../asset-contact-sheets/Walls_Modular/Walls_Modular-01.png) | CONFIRMED | Straight wall segment for separate-room construction. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |

**Missing components:** No clearly identified oxygen-generation machinery, air-filtration unit, labeled ductwork, or room-specific control set.

**Supplementary art / owner decision:** Owner-approved generator/filter artwork, vents or ducts, and a readable life-support status terminal. Avoid implying a real measured oxygen concentration.

### Research Lab

**Overall confidence:** Low to Medium. Workstation and shelf-like art could dress a lab. The supplied images do not establish lab equipment, sample identity, or scientific function.

| Asset ID | Semantic key | Original filename | Exact source path | Dimensions | Contact sheet | Classification | Suitability and confidence | Approval / license |
|---|---|---|---|---:|---|---|---|---|
| BLD-0005 | `buildings.building_005_83x77.bld-0005` | `Building_005_83x77.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Buildings/Building_005_83x77.png` | 83 × 77 px | [Buildings-01.png](../asset-contact-sheets/Buildings/Buildings-01.png) | CANDIDATE | Compact enclosed module candidate; exact facility function is unknown. **Confidence:** Low. | pending_owner_approval; UNVERIFIED |
| EQP-0055 | `tools_equipment.equipment_055_31x35.eqp-0055` | `Equipment_055_31x35.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_055_31x35.png` | 31 × 35 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Display workstation candidate for a research terminal. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| EQP-0056 | `tools_equipment.equipment_056_29x35.eqp-0056` | `Equipment_056_29x35.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_056_29x35.png` | 29 × 35 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Shelf-like prop with small objects; contents and purpose are unidentified. **Confidence:** Low. | pending_owner_approval; UNVERIFIED |
| EQP-0058 | `tools_equipment.equipment_058_31x34.eqp-0058` | `Equipment_058_31x34.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_058_31x34.png` | 31 × 34 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Desk/computer candidate for a lab workstation. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| WAL-0002 | `walls_modular.wall_002_30x24.wal-0002` | `Wall_002_30x24.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Walls_Modular/Wall_002_30x24.png` | 30 × 24 px | [Walls_Modular-01.png](../asset-contact-sheets/Walls_Modular/Walls_Modular-01.png) | CONFIRMED | Straight modular wall segment. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| WAL-0003 | `walls_modular.wall_003_28x28.wal-0003` | `Wall_003_28x28.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Walls_Modular/Wall_003_28x28.png` | 28 × 28 px | [Walls_Modular-01.png](../asset-contact-sheets/Walls_Modular/Walls_Modular-01.png) | CONFIRMED | Corner modular wall segment. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| FLT-0001 | `floor_tiles.floor_001_60x64.flt-0001` | `Floor_001_60x64.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Floor_Tiles/Floor_001_60x64.png` | 60 × 64 px | [Floor_Tiles-01.png](../asset-contact-sheets/Floor_Tiles/Floor_Tiles-01.png) | CONFIRMED | Floor-panel candidate; verify scale and repeatability. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |

**Missing components:** No confirmed laboratory bench, sample container set, microscope/analysis instrument, or lab signage.

**Supplementary art / owner decision:** Owner-approved science bench, sample containers, and a clear analysis instrument. Keep any NASA-linked science content separately sourced and attributed.

### Greenhouse

**Overall confidence:** Medium to High. BLD-0003 visibly resembles a glazed dome habitat. EQP-0045 through EQP-0048 visibly show plant trays/planters and are the strongest supplied food-production candidates.

| Asset ID | Semantic key | Original filename | Exact source path | Dimensions | Contact sheet | Classification | Suitability and confidence | Approval / license |
|---|---|---|---|---:|---|---|---|---|
| BLD-0003 | `buildings.building_003_73x72.bld-0003` | `Building_003_73x72.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Buildings/Building_003_73x72.png` | 73 × 72 px | [Buildings-01.png](../asset-contact-sheets/Buildings/Buildings-01.png) | CANDIDATE | Glazed dome with green interior; visually suitable as a greenhouse-module candidate. **Confidence:** High. | pending_owner_approval; UNVERIFIED |
| EQP-0045 | `tools_equipment.equipment_045_33x34.eqp-0045` | `Equipment_045_33x34.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_045_33x34.png` | 33 × 34 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Small planted tray/display. **Confidence:** High for plant tray; medium for greenhouse use. | pending_owner_approval; UNVERIFIED |
| EQP-0046 | `tools_equipment.equipment_046_32x34.eqp-0046` | `Equipment_046_32x34.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_046_32x34.png` | 32 × 34 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Two-tier planted tray/display. **Confidence:** High for plant tray; medium for greenhouse use. | pending_owner_approval; UNVERIFIED |
| EQP-0047 | `tools_equipment.equipment_047_30x34.eqp-0047` | `Equipment_047_30x34.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_047_30x34.png` | 30 × 34 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Planted tray. **Confidence:** High for plant tray; medium for greenhouse use. | pending_owner_approval; UNVERIFIED |
| EQP-0048 | `tools_equipment.equipment_048_33x33.eqp-0048` | `Equipment_048_33x33.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Tools_Equipment/Equipment_048_33x33.png` | 33 × 33 px | [Tools_Equipment-01.png](../asset-contact-sheets/Tools_Equipment/Tools_Equipment-01.png) | CANDIDATE | Enclosed planted tray/container. **Confidence:** High for plant tray; medium for greenhouse use. | pending_owner_approval; UNVERIFIED |
| GLS-0011 | `panels_glass.panel_011_70x49.gls-0011` | `Panel_011_70x49.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Panels_Glass/Panel_011_70x49.png` | 70 × 49 px | [Panels_Glass-01.png](../asset-contact-sheets/Panels_Glass/Panels_Glass-01.png) | CANDIDATE | Large framed panel candidate; possible greenhouse frame/window detail, not a full glass wall. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |

**Missing components:** No verified crop growth stages, harvesting tools, seed packs, or complete interior greenhouse kit.

**Supplementary art / owner decision:** Owner approval of the dome and tray roles; consider additional crop stages or harvesting art if the planned interaction needs them.

### Radiation Shelter

**Overall confidence:** Low to Medium. Modular heavy walls/doors can define an enclosed room, and UIC-0015 is a radiation trefoil symbol. This does not establish shielding performance or a dedicated shelter kit.

| Asset ID | Semantic key | Original filename | Exact source path | Dimensions | Contact sheet | Classification | Suitability and confidence | Approval / license |
|---|---|---|---|---:|---|---|---|---|
| DOR-0005 | `doors_walls.door_005_60x46.dor-0005` | `Door_005_60x46.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Doors_Walls/Door_005_60x46.png` | 60 × 46 px | [Doors_Walls-01.png](../asset-contact-sheets/Doors_Walls/Doors_Walls-01.png) | CANDIDATE | Heavy framed double-door artwork; possible protected-room entrance. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| DOR-0006 | `doors_walls.door_006_66x46.dor-0006` | `Door_006_66x46.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Doors_Walls/Door_006_66x46.png` | 66 × 46 px | [Doors_Walls-01.png](../asset-contact-sheets/Doors_Walls/Doors_Walls-01.png) | CANDIDATE | Related open/frame door variant; possible entrance state. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| WAL-0001 | `walls_modular.wall_001_29x28.wal-0001` | `Wall_001_29x28.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Walls_Modular/Wall_001_29x28.png` | 29 × 28 px | [Walls_Modular-01.png](../asset-contact-sheets/Walls_Modular/Walls_Modular-01.png) | CONFIRMED | Modular corner wall piece. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| WAL-0002 | `walls_modular.wall_002_30x24.wal-0002` | `Wall_002_30x24.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Walls_Modular/Wall_002_30x24.png` | 30 × 24 px | [Walls_Modular-01.png](../asset-contact-sheets/Walls_Modular/Walls_Modular-01.png) | CONFIRMED | Straight modular wall piece. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| WAL-0003 | `walls_modular.wall_003_28x28.wal-0003` | `Wall_003_28x28.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Walls_Modular/Wall_003_28x28.png` | 28 × 28 px | [Walls_Modular-01.png](../asset-contact-sheets/Walls_Modular/Walls_Modular-01.png) | CONFIRMED | Modular corner/transition wall piece. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| UIC-0015 | `ui_icons.icon_015_32x32.uic-0015` | `Icon_015_32x32.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/UI_Icons/Icon_015_32x32.png` | 32 × 32 px | [UI_Icons-01.png](../asset-contact-sheets/UI_Icons/UI_Icons-01.png) | CANDIDATE | Radiation trefoil icon; suitable for proposed shelter signage/UI only. **Confidence:** High for symbol; low for safety function. | pending_owner_approval; UNVERIFIED |
| FLT-0001 | `floor_tiles.floor_001_60x64.flt-0001` | `Floor_001_60x64.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Floor_Tiles/Floor_001_60x64.png` | 60 × 64 px | [Floor_Tiles-01.png](../asset-contact-sheets/Floor_Tiles/Floor_Tiles-01.png) | CONFIRMED | Interior floor-panel candidate. **Confidence:** Low. | pending_owner_approval; UNVERIFIED |

**Missing components:** No dedicated shelter module/interior, verified shielding material, or shelter-specific status/occupancy indicator.

**Supplementary art / owner decision:** Owner-approved shelter signage/interior cues. Any safety explanation must avoid invented dose or shielding values.

### Southern Entrance / Airlock

**Overall confidence:** Medium to High. Several door assets visibly show framed/hatch-style access structures. They are candidates for an airlock assembly; no state sequence or passability is encoded in the art.

| Asset ID | Semantic key | Original filename | Exact source path | Dimensions | Contact sheet | Classification | Suitability and confidence | Approval / license |
|---|---|---|---|---:|---|---|---|---|
| DOR-0005 | `doors_walls.door_005_60x46.dor-0005` | `Door_005_60x46.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Doors_Walls/Door_005_60x46.png` | 60 × 46 px | [Doors_Walls-01.png](../asset-contact-sheets/Doors_Walls/Doors_Walls-01.png) | CANDIDATE | Heavy framed double-door form; proposed outer or inner access door. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| DOR-0006 | `doors_walls.door_006_66x46.dor-0006` | `Door_006_66x46.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Doors_Walls/Door_006_66x46.png` | 66 × 46 px | [Doors_Walls-01.png](../asset-contact-sheets/Doors_Walls/Doors_Walls-01.png) | CANDIDATE | Matching open/frame variant; proposed alternate state, pending verification. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| DOR-0009 | `doors_walls.door_009_73x35.dor-0009` | `Door_009_73x35.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Doors_Walls/Door_009_73x35.png` | 73 × 35 px | [Doors_Walls-01.png](../asset-contact-sheets/Doors_Walls/Doors_Walls-01.png) | CANDIDATE | Wide framed doorway with central door panels; candidate entrance assembly. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| DOR-0010 | `doors_walls.door_010_81x35.dor-0010` | `Door_010_81x35.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Doors_Walls/Door_010_81x35.png` | 81 × 35 px | [Doors_Walls-01.png](../asset-contact-sheets/Doors_Walls/Doors_Walls-01.png) | CANDIDATE | Wide doorway with central opening; candidate alternate doorway state. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| DOR-0017 | `doors_walls.door_017_42x46.dor-0017` | `Door_017_42x46.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Doors_Walls/Door_017_42x46.png` | 42 × 46 px | [Doors_Walls-01.png](../asset-contact-sheets/Doors_Walls/Doors_Walls-01.png) | CANDIDATE | Compact reinforced door/hatch form. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| DOR-0018 | `doors_walls.door_018_42x46.dor-0018` | `Door_018_42x46.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Doors_Walls/Door_018_42x46.png` | 42 × 46 px | [Doors_Walls-01.png](../asset-contact-sheets/Doors_Walls/Doors_Walls-01.png) | CANDIDATE | Related open/alternate reinforced door form. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| WAL-0002 | `walls_modular.wall_002_30x24.wal-0002` | `Wall_002_30x24.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Walls_Modular/Wall_002_30x24.png` | 30 × 24 px | [Walls_Modular-01.png](../asset-contact-sheets/Walls_Modular/Walls_Modular-01.png) | CONFIRMED | Straight modular wall piece to join the selected doorway to a room boundary. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |

**Missing components:** No verified paired inner/outer airlock sequence, pressure-cycle UI, or clear exterior threshold strip.

**Supplementary art / owner decision:** Owner-approved open/closed door pairing and a simple child-readable airlock status display if gameplay needs a cycle interaction.

## Shared map assets

### Shared Player Character

**Overall confidence:** Medium. The original sheet contains astronaut poses in suit and non-suit variants. These are map-wide character candidates, not facility art.

| Asset ID | Semantic key | Original filename | Exact source path | Dimensions | Contact sheet | Classification | Suitability and confidence | Approval / license |
|---|---|---|---|---:|---|---|---|---|
| AST-0001 | `astronaut.astronaut_001_36x61.ast-0001` | `Astronaut_001_36x61.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Astronaut/Astronaut_001_36x61.png` | 36 × 61 px | [Astronaut-01.png](../asset-contact-sheets/Astronaut/Astronaut-01.png) | CONFIRMED | Front-facing suited astronaut pose candidate for REVO. **Confidence:** Medium. | pending_owner_approval; UNVERIFIED |
| AST-0009 | `astronaut.astronaut_009_32x60.ast-0009` | `Astronaut_009_32x60.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Astronaut/Astronaut_009_32x60.png` | 32 × 60 px | [Astronaut-01.png](../asset-contact-sheets/Astronaut/Astronaut-01.png) | CONFIRMED | Side-facing suited pose candidate from a different source-sheet row; animation role is not verified. **Confidence:** Low. | pending_owner_approval; UNVERIFIED |
| AST-0010 | `astronaut.astronaut_010_31x59.ast-0010` | `Astronaut_010_31x59.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Astronaut/Astronaut_010_31x59.png` | 31 × 59 px | [Astronaut-01.png](../asset-contact-sheets/Astronaut/Astronaut-01.png) | CONFIRMED | Side-facing suited pose candidate; trimmed dimensions differ from adjacent poses. **Confidence:** Low. | pending_owner_approval; UNVERIFIED |
| AST-0011 | `astronaut.astronaut_011_31x59.ast-0011` | `Astronaut_011_31x59.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Astronaut/Astronaut_011_31x59.png` | 31 × 59 px | [Astronaut-01.png](../asset-contact-sheets/Astronaut/Astronaut-01.png) | CONFIRMED | Side-facing suited pose candidate; trimmed dimensions differ from adjacent poses. **Confidence:** Low. | pending_owner_approval; UNVERIFIED |
| AST-0012 | `astronaut.astronaut_012_31x60.ast-0012` | `Astronaut_012_31x60.png` | `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/Astronaut/Astronaut_012_31x60.png` | 31 × 60 px | [Astronaut-01.png](../asset-contact-sheets/Astronaut/Astronaut-01.png) | CONFIRMED | Side-facing suited pose candidate; trimmed dimensions differ from adjacent poses. **Confidence:** Low. | pending_owner_approval; UNVERIFIED |

**Missing components:** The extracted crops have variable trimmed dimensions. A consistent walk loop, direction mapping, frame registration, and suit variant choice have not been approved.

**Supplementary art / owner decision:** Owner approval of the REVO appearance, plus alignment/sequence metadata if these poses are used as an animation. Do not infer frame order from filename order.

## Shared construction candidates

The wall, floor, glazing, and doorway pieces are cropped sprites, not room-sized structures. Proposed room footprints in the blueprint must be assembled from selected repeats and checked for seam fit; the current shortlist does not establish an approved building kit. Contact sheets and exact source metadata are in the asset rows above.

## Shortlist transparency and animation audit

The pixel audit covers 47 selected original-size PNGs. Every file contains transparent pixels and none is fully opaque. Ten files contain some pure-black opaque pixels: the five astronaut poses (11.46–13.94% of each image) and five door/UI sprites (0.04–0.43%). Visual inspection of the astronaut contact sheet and crop shows these pixels as dark outlines/shading, not a black rectangular background; the UI/door percentages are sparse detail pixels. Non-transparent bounds are reported per asset in the audit CSV. All 47 manifest crop rectangles fit within their 256×256 source sheets and match extracted crop dimensions.

Each selected PNG is a static crop, not an animated file. Five astronaut crops are drawn from a 24-pose original sheet; the available catalog crop layout does not establish frame order, stable registration, or a loop. Door variants are not validated animation frames. No destructive extraction or editing was performed.

## Proposed exterior map

The companion [human-readable map blueprint](./MAP_BLUEPRINT.md) and [machine-readable draft](./alpha-base-exterior-blueprint.json) propose an 80×45 tile world at a nominal 32 px pitch (2560×1440 px, 16:9). Coordinates are planning positions only. Solar stays outdoors; battery storage and power distribution stay indoors; a future dust storm reduces fictional solar generation and raises the value of stored battery energy.

## Licensing and source status

All shortlisted assets currently have catalog license status `UNVERIFIED`. The project still needs creator/source records, applicable PixelLab plan or generation terms, modification/redistribution permissions, attribution requirements, and any source-sheet provenance. Do not infer commercial permission from availability or generation. See `docs/ASSET_LICENSES.md`.

## Supporting review files

- [Read-only visual gallery](./index.html)
- [Stable shortlisted asset IDs](./shortlisted-asset-ids.json)
- [Shortlisted transparency/crop audit](./shortlisted-asset-audit.csv)
- [Human-readable map blueprint](./MAP_BLUEPRINT.md)
- [Proposed exterior blueprint JSON](./alpha-base-exterior-blueprint.json)
- [Stage 2A full catalog](../../src/data/assets/asset-catalog.json)
- [Stage 2A contact-sheet index](../asset-contact-sheets/contact-sheet-index.csv)

No Phaser Scene, runtime map loader, gameplay system, or source asset is changed by this review package.