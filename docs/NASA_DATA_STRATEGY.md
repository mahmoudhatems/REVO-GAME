# REVO — NASA Data Strategy and Scientific Integrity

## 1. Purpose

NASA data is not decoration. It is the evidence base behind selected educational scenarios and knowledge cards. Use a small number of relevant, traceable sources well rather than integrating many datasets superficially.

The team is still researching and curating NASA resources. A source listed in this file is a candidate source, not proof that it has already been downloaded, validated, or integrated.

## 2. Data categories

Every science-related game element must be classified as one of:

1. **NASA source observation/data** — a value or record directly obtained from an identified NASA dataset or instrument product.
2. **Curated educational fact** — a short, reviewed statement derived from one or more NASA sources.
3. **REVO simulation parameter** — a simplified game value chosen for playability, not an actual NASA measurement.
4. **Fictional scenario** — a story event created for REVO, clearly labeled as a training simulation.

Never present category 3 or 4 as category 1.

## 3. Priority sources for the Mars setting

### A. Perseverance MEDA — highest relevance for Jezero environmental context

MEDA measures Martian weather, including wind speed/direction, temperature, humidity, and dust particle amount/size. It is on Perseverance at Jezero Crater.

Potential game uses:

- explain why outdoor conditions are monitored;
- create a weather-status screen;
- ground a training event involving wind or dust;
- teach that environmental measurements help mission planning.

MEDA page: https://science.nasa.gov/mission/mars-2020-perseverance/science-instruments/
Perseverance mission: https://science.nasa.gov/mission/mars-2020-perseverance/

### B. Curiosity REMS — additional Mars weather context

REMS measures atmospheric pressure, temperature, humidity, wind, and ultraviolet radiation and provides daily/seasonal Martian weather reports.

Potential uses:

- compare environmental observations;
- explain weather monitoring;
- use a clearly identified historical/archived Martian weather example.

Source: https://science.nasa.gov/mission/msl-curiosity/science-instruments/

### C. DONKI — space-weather context

DONKI records solar and interplanetary space-weather events, analyses, model results, notifications, and linked event relationships. Its records can support educational scenarios about solar activity and space-weather monitoring.

Critical limitation: a DONKI flare/CME/SEP event is not automatically a radiation-dose measurement at the Martian surface or at Jezero. Do not convert event presence, class, speed, or model output into an invented Mars crew dose or a precise shelter threshold.

See `DONKI_REFERENCE.md`.

### D. OSDR / GeneLab / ALSDA / RadLab

OSDR provides space-life-science datasets and associated metadata, including human, animal, plant, microbial, physiological, behavioral, biomedical, imaging, and environmental research. RadLab provides access to radiation telemetry data from multiple databases and agencies. The Environmental Data Application covers environmental monitoring datasets, including ISS and space-biology payload data.

Use these to teach broad, carefully qualified ideas about living systems, spaceflight research, environmental monitoring, and radiation measurement. Preserve the actual organism, mission, instrument, and experimental context. Do not present ISS or analog data as direct Mars crew measurements.

See `OSDR_DATA_REFERENCE.md`.

### E. Artemis / lunar data

Artemis resources are valuable because the challenge explicitly mentions lunar exploration and because lunar operations teach relevant outpost constraints. However, REVO is set on Mars. Label Artemis information as lunar data and use it as a comparison, not as Mars environmental data.

See `MARS_AND_ARTEMIS_DATA.md`.

### F. NASA fission surface power research (not selected for current REVO MVP)

NASA/DOE have studied fission surface power systems for lunar exploration and future Mars mission architectures. This is comparative research only; the current approved REVO MVP uses fictional external solar arrays and battery storage, not a fission unit. The source does not establish that an operational human Mars outpost or fission plant exists today.

Source: https://www.nasa.gov/humans-in-space/fission-system-to-power-exploration-on-the-moons-surface-and-beyond/

## 4. Required provenance schema

Every adopted data point or curated fact must have a machine-readable record with as many fields as are available:

```json
{
  "id": "unique-local-id",
  "title": "Human-readable title",
  "sourceOrganization": "NASA / CCMC / mission team",
  "sourceProduct": "MEDA / REMS / DONKI / OSDR / etc.",
  "datasetId": null,
  "accession": null,
  "mission": null,
  "instrument": null,
  "location": null,
  "measurementDate": null,
  "retrievedAt": "ISO-8601 timestamp",
  "value": null,
  "unit": null,
  "rawOrProcessed": "unknown | raw | processed | curated",
  "isLive": false,
  "educationalSummary": "Short reviewed explanation",
  "gameTranslation": "Clearly labeled simplified game effect",
  "limitations": [],
  "sourceUrl": "https://..."
}
```

Do not fill unknown fields with guesses. Use `null` or `unknown`.

## 5. Data processing rules

1. Locate the original source and current documentation.
2. Confirm the source covers the intended phenomenon, location, mission, and time period.
3. Download a small relevant sample or metadata record.
4. Record units and timestamps.
5. Preserve the original file separately from transformed data.
6. Create a reviewed, child-readable summary.
7. Document any transformation, normalization, or compression.
8. Add a source credit inside the game.
9. Add tests for any transformation used by game logic.

Never turn raw scientific data into game effects without an explicit, reviewed mapping.

## 6. Static versus live data

For the hackathon MVP, prefer curated, cached, historical NASA data embedded in local JSON.

- Label it `ARCHIVED NASA DATA` or `NASA RESEARCH REFERENCE`.
- Never call cached information live.
- Fictional event scheduling must say `REVO TRAINING SIMULATION`.
- If live access is added later, show the retrieval timestamp and an explicit stale-data fallback.
- Do not block gameplay because a NASA endpoint is unavailable.

## 7. Scientific review questions

Before adding any data-driven mechanic, answer:

- What exactly did the instrument or dataset measure?
- Where was it measured?
- When was it measured?
- Is the data raw, processed, modeled, or interpreted?
- Does the source support the game statement?
- What is being simplified for a child?
- Is the game effect a simulation parameter rather than a measured value?
- Is the source credited in the game?

## 8. Prohibited claims

- Do not say DONKI is a direct Mars surface radiation dosimeter.
- Do not treat a solar flare as a measured astronaut dose.
- Do not reuse ISS oxygen/CO2 telemetry as if it came from Jezero.
- Do not use lunar Artemis measurements as Mars conditions.
- Do not say NASA has deployed a human Mars power installation.
- Do not imply that a fictional dust storm is happening on Mars now.
- Do not invent NASA values, dates, accession IDs, instrument readings, or thresholds.

## 9. Attribution

Every in-game science card or relevant credits screen should include:

- NASA or the responsible source organization;
- mission/instrument or dataset name;
- source URL;
- date or archive context where relevant;
- a statement such as: "REVO uses this source as an educational reference. Game values and events may be simplified or simulated."

Review source terms and attribution rules before redistributing large raw datasets or images.
