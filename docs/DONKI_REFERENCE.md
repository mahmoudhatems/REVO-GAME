# REVO — DONKI Resource Reference

## 1. What DONKI is

DONKI is the **Database of Notifications, Knowledge, Information**, maintained by NASA's Community Coordinated Modeling Center (CCMC). It organizes space-weather observations, analyses, model outputs, notifications, reports, and relationships between events. The primary current catalog is M2M_CATALOG, associated with the Moon-to-Mars Space Weather Analysis Office.

Official portal: https://ccmc.gsfc.nasa.gov/DONKI/  
Introduction and guide: https://ccmc.gsfc.nasa.gov/DONKI/guide/  
Data reference: https://ccmc.gsfc.nasa.gov/DONKI/guide/data-reference/  
CCMC public APIs: https://ccmc.gsfc.nasa.gov/tools/API/

## 2. DONKI event resources

The current DONKI event families documented by NASA/CCMC include:

| Endpoint / type | Meaning | Potential REVO use | Important limitation |
|---|---|---|---|
| `CME` | Coronal Mass Ejection event records. | Explain large eruptions of solar material and space-weather alerts. | Does not directly provide a Mars crew radiation dose. |
| `CMEAnalysis` | Analysis parameters for CMEs. | Optional advanced context for an educational event card. | Model/analysis parameters require expert context; not a child-facing dose. |
| `GST` | Geomagnetic Storm records. | Explain effects of space weather on Earth's magnetosphere and communication/technology context. | Geomagnetic storm indices are Earth-focused; do not apply directly to Mars surface. |
| `IPS` | Interplanetary Shock records. | Explain traveling disturbances in interplanetary space. | Not a local Mars radiation-dose measurement. |
| `FLR` | Solar Flare records. | Solar activity alert and science card. | Flare class is not a crew dose. |
| `SEP` | Solar Energetic Particle events. | Explain energetic particles and why space-weather monitoring matters. | A SEP event record alone is not a surface dose at Jezero. |
| `MPC` | Magnetopause Crossing records. | Advanced space-weather context. | Magnetopause is not the Martian surface environment; context must be precise. |
| `RBE` | Radiation Belt Enhancement records. | Explain radiation-belt phenomena in the relevant planetary environment. | Do not reinterpret an Earth radiation-belt record as Mars surface conditions. |
| `HSS` | High Speed Stream records. | Explain solar-wind streams and space-weather context. | Not a direct Mars surface dose. |
| `WSAEnlilSimulations` | WSA-ENLIL+Cone model simulation records. | Optional model context and event timing. | Model output is not a direct observation; preserve model context and limitations. |
| `notifications` | DONKI notification records linking event types and reports. | Build a curated alert/news item with source links. | A notification is not itself a measured dose. |

NASA's current DONKI event and data-reference pages should be checked before using any endpoint or field. The table describes resource families, not an assertion that every endpoint is required by the game.

## 3. Catalogs

DONKI documents these catalogs:

- `M2M_CATALOG` — primary catalog; main space-weather events, analyses, model results, notifications, and reports.
- `WINSLOW_MESSENGER_ICME_CATALOG` — historic ICME arrival information observed by MESSENGER at Mercury; not Mars-local data.
- `SWPC_ANNEX_CME_CATALOG` — operational CME records used in a CCMC/NOAA SWPC validation study.
- `SEPVAL_CME_CATALOG` — flare/CME inputs used in SEP validation work.
- `MAVEN_EUVM_FLARE_CATALOG` — quick-look flare catalog from MAVEN's Extreme Ultraviolet Monitor. NASA/CCMC notes that official MAVEN/EUVM products should be used for analysis or publication.
- `ALL` — all catalogs available to the selected DONKI feature, where supported.

Use `M2M_CATALOG` as the starting point for current Moon-to-Mars Space Weather Analysis Office event examples unless a specific historical catalog is needed.

## 4. API migration note — important for 2026

CCMC announced a DONKI application/API migration effective **30 September 2026**. The current DONKI web application is at:

`https://ccmc.gsfc.nasa.gov/DONKI/`

The CCMC announcement describes the new public data API base as:

`https://ccmc.gsfc.nasa.gov/DONKI-API/get/`

It also states that old DONKI web URLs using the former `kauai.ccmc.gsfc.nasa.gov` host should be updated to the current `ccmc.gsfc.nasa.gov` host. Endpoint paths and input/response formats were stated to remain unchanged for the migration. Use the current CCMC API reference/interactive documentation to confirm exact paths, parameters, and schemas before coding. Do not hard-code an old host from a tutorial.

Official announcement: https://ccmc.gsfc.nasa.gov/news/major-updates/  
Current API docs directory: https://ccmc.gsfc.nasa.gov/tools/API/  
Current DONKI guide: https://ccmc.gsfc.nasa.gov/DONKI/guide/

NASA's general APIs portal still publishes legacy examples under `https://api.nasa.gov/DONKI/...`. Treat those as legacy/reference examples and verify the current CCMC base before building a new integration.

## 5. Typical date query concepts

DONKI resources commonly use a date interval with `startDate` and `endDate` in `YYYY-MM-DD` form. Some resources accept additional filters; examples documented in older API references include `mostAccurateOnly`, `completeEntryOnly`, `speed`, `halfAngle`, `catalog`, `keyword`, and resource-specific fields.

Do not assume every parameter applies to every resource. Inspect the live API schema before requesting data.

## 6. Recommended REVO usage

DONKI should be a supporting science source, not the entire game's hazard engine.

Recommended MVP pattern:

1. Select one or two verified, explainable DONKI records (for example, a solar flare or SEP-related alert) after reviewing the data and linked event context.
2. Save the record's source URL, event date, type, catalog, and relevant fields in a curated local JSON record.
3. Write a child-friendly science card explaining the event.
4. If used as a scenario inspiration, label the gameplay consequence as a REVO training simulation.
5. Do not translate the record directly into a numerical Mars surface dose or a fixed radiation shelter threshold.

Use direct Mars environmental data (such as MEDA) for dust, wind, and local weather teaching. Use a suitable radiation telemetry source and preserve its spacecraft, instrument, orbit, and environment when teaching dose measurements.

## 7. Example local provenance object

```json
{
  "id": "donki-example-001",
  "source": "NASA CCMC DONKI",
  "resource": "FLR",
  "catalog": "M2M_CATALOG",
  "eventDate": null,
  "retrievedAt": null,
  "sourceUrl": null,
  "rawFieldsUsed": [],
  "educationalSummary": "A reviewed explanation for children.",
  "gameScenario": "REVO TRAINING SIMULATION",
  "marsSurfaceDose": null,
  "limitations": [
    "DONKI event record is not a direct Mars surface radiation-dose measurement."
  ]
}
```

Fill only fields actually returned by the selected record. Do not use placeholder values in a released data file.

## 8. DONKI references

- DONKI overview: https://ccmc.gsfc.nasa.gov/tools/DONKI/
- DONKI events: https://ccmc.gsfc.nasa.gov/DONKI/events/
- DONKI data reference: https://ccmc.gsfc.nasa.gov/DONKI/guide/data-reference/
- DONKI introduction: https://ccmc.gsfc.nasa.gov/DONKI/guide/
- CCMC API portal: https://ccmc.gsfc.nasa.gov/tools/API/
- September 2026 API migration announcement: https://ccmc.gsfc.nasa.gov/news/major-updates/
- NASA legacy API catalog: https://api.nasa.gov/
