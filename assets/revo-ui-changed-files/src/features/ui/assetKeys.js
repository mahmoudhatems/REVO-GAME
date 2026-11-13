// Central place that maps UI asset needs to loaded texture keys.
// Catalog assets keep their original filenames (public/assets/revo-ui/catalog/...).
import manifest from './catalogManifest.json';

export const catKey = (cat, i) => `cat_${cat}_${i}`;

// Preload every catalog asset that the UI uses.
export function preloadUiAssets(load) {
  for (const [id, a] of Object.entries(manifest)) {
    const [cat, i] = id.split(':');
    load.image(catKey(cat, Number(i)), a.file);
  }
  load.atlas('st_water', 'assets/revo-ui/stations/01_water_recycling_station.png', 'assets/revo-ui/stations/01_water_recycling_station.json');
  load.atlas('st_solar', 'assets/revo-ui/stations/02_solar_power_station.png', 'assets/revo-ui/stations/02_solar_power_station.json');
  load.atlas('st_oxygen', 'assets/revo-ui/stations/03_oxygen_heating_station.png', 'assets/revo-ui/stations/03_oxygen_heating_station.json');
}

// Icon_NNN from UI_Icons by catalog position (verified visually).
export const ICON = Object.freeze({
  info: catKey('UI_Icons', 2), error: catKey('UI_Icons', 4), success: catKey('UI_Icons', 5), logbook: catKey('UI_Icons', 6),
  star: catKey('UI_Icons', 7), warning: catKey('UI_Icons', 8), o2ring: catKey('UI_Icons', 11), o2tank: catKey('UI_Icons', 12),
  batteryLow: catKey('UI_Icons', 13), batteryBolt: catKey('UI_Icons', 14), radiation: catKey('UI_Icons', 15), dust: catKey('UI_Icons', 16),
  neil: catKey('UI_Icons', 20), tools: catKey('UI_Icons', 21), vitals: catKey('UI_Icons', 22), radar: catKey('UI_Icons', 29),
  neilAlert: catKey('UI_Icons', 39), antenna: catKey('UI_Icons', 42), mail: catKey('UI_Icons', 44)
});

export const LEVEL_ICON = Object.freeze({ info: ICON.info, success: ICON.success, warning: ICON.warning, critical: ICON.error });
