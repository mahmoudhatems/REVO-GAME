# REVO — OSDR, RadLab, and Space-Biology Data Reference

## 1. What OSDR contains

NASA's Open Science Data Repository (OSDR) brings together space-life-science datasets and metadata, including omics, phenotypic, physiological, behavioral, biomedical, bioimaging, environmental telemetry, hardware, and related study information. It includes the GeneLab and Ames Life Sciences Data Archive (ALSDA) collections.

Official overview: https://science.nasa.gov/biological-physical/data/osdr/  
Repository: https://osdr.nasa.gov/  
NASA OSDR API page: https://www.nasa.gov/osdr-api/  
OSDR FAQ: https://science.nasa.gov/reference/osdr-faq/

## 2. Main data families relevant to REVO

### GeneLab / OSDR Biological Data

GeneLab contains spaceflight-relevant biological and omics datasets. Potentially useful educational ideas include how spaceflight conditions are studied in plants, microbes, animals, and human-related research.

Do not turn complex gene-expression or sequencing output into a simplistic claim about astronaut health. Use reviewed summaries and associated publications.

### ALSDA / Life Sciences datasets

ALSDA includes phenotypic, physiological, bioimaging, and behavioral data from space-relevant experiments. These may help explain how scientists study living systems in spaceflight or analog conditions.

### Environmental Data Application (EDA)

NASA describes EDA as supporting visualization of environmental measurements collected from spaceflight experiments. Available categories include temperature, humidity, oxygen, carbon dioxide, and radiation. NASA's FAQ notes that environmental monitoring data are available for the International Space Station and space-biology payloads.

These data are not automatically Mars surface data. Preserve the actual platform and experiment context.

### RadLab

RadLab is a portal intended to provide access to radiation telemetry data from multiple databases maintained by multiple space agencies. It supports inspection, visualization, and programmatic retrieval through an underlying API. NASA's FAQ describes time series and geospatial visualizations of absorbed radiation dose rate and flux from instruments.

Before using a RadLab record, identify:

- spacecraft/mission;
- instrument;
- measurement location/environment;
- data unit;
- time interval;
- whether value is dose, dose rate, flux, or another quantity;
- whether the data are raw, processed, or derived.

Do not label ISS, orbit, or other spacecraft readings as Mars surface measurements.

## 3. Current Biological Data API (BDAPI)

NASA's OSDR Biological Data API supports querying metadata and data from GeneLab and ALSDA datasets through REST and tabular endpoints.

API base:

`https://visualization.osdr.nasa.gov/biodata/api/`

The current tutorial documents version 2:

`https://visualization.osdr.nasa.gov/biodata/api/v2/`

The key query endpoints are:

- `/v2/query/metadata/` — query study/sample metadata.
- `/v2/query/data/` — request compatible tabular data associated with query results.
- `/v2/dataset/{accession}/...` — REST-style traversal of dataset, assay, and sample metadata.

The tutorial explains how metadata fields follow the ISA hierarchy, such as `study.characteristics.organism`, and how accession and file fields can be queried. Query values must be URL-encoded. Use the official tutorial for syntax and the current API landing page for supported output formats and limits.

Official tutorials:

- https://osdr-tutorials.readthedocs.io/en/latest/pages/guides/biological_data_api.html
- https://github.com/nasa/OSDR_Tutorials/blob/main/source/pages/guides/biological_data_api.md
- https://visualization.osdr.nasa.gov/biodata/api/

## 4. Older OSDR public API endpoints

NASA's general API portal also documents older OSDR public endpoints, including:

- Study files: `https://osdr.nasa.gov/osdr/data/osd/files/{OSD_STUDY_ID}`
- Study metadata: `https://osdr.nasa.gov/osdr/data/osd/meta/{OSD_STUDY_ID}`
- Study search: `https://osdr.nasa.gov/osdr/data/search?...`
- Mission list: `https://osdr.nasa.gov/geode-py/ws/api/missions`
- Experiment list: `https://osdr.nasa.gov/geode-py/ws/api/experiments`
- Payload list: `https://osdr.nasa.gov/geode-py/ws/api/payloads`
- Hardware list: `https://osdr.nasa.gov/geode-py/ws/api/hardware`
- Vehicle list: `https://osdr.nasa.gov/geode-py/ws/api/vehicles`
- Subject list: `https://osdr.nasa.gov/geode-py/ws/api/subjects`
- Biospecimen list: `https://osdr.nasa.gov/geode-py/ws/api/biospecimens`

The general NASA portal describes these older routes and response formats. Prefer the current OSDR Biological Data API for new analytical metadata queries when suitable, and verify endpoint status before implementation.

Legacy portal: https://api.nasa.gov/

## 5. What REVO should actually use

The target audience does not need raw research files. Curate a few reliable educational facts, for example:

- scientists monitor how spaceflight affects living systems;
- plants and microbes are studied in space-relevant conditions;
- environmental systems measure oxygen, carbon dioxide, temperature, and humidity;
- radiation instruments measure quantities such as dose rate and particle flux, with context tied to the instrument and environment.

For the game, convert these into brief science cards or research-lab missions. Keep the scientific source separate from the simplified mission effect.

## 6. Data access and privacy

Most OSDR data are publicly accessible, but some astronaut-derived sequence data are controlled access and require authorization. Do not try to bypass access controls or use restricted information.

Do not download enormous raw sequencing datasets for a child-facing game. Use public metadata, reviewed publications, processed summary data where licensed/appropriate, and small curated educational extracts.

## 7. Attribution and limitations

For any OSDR-derived card, record:

- dataset accession (for example, an OSD identifier, only if actually verified);
- study title;
- organism or subject type;
- mission/platform or analog context;
- measurement/assay type;
- processed/raw status;
- source page and publication if available;
- retrieval date;
- limitation statement.

Use a statement such as:

"This science card is based on NASA OSDR research. The study context is shown in the source link; REVO's game effects are simplified educational simulations."

Do not call OSDR an exclusively astronaut-health database. It contains a broad and heterogeneous research portfolio.
