// Data-driven station definitions. Pure data + pure functions (no Phaser).
// Facility ids match src/data/worldData.js; "water" and "health" have no map room (UI-only dashboards).
// Values that the simulation does not have are shown as NO DATA, never invented.
import { barsFromRatio } from '../mission/domain/missionStore.js';
import { SOURCE } from '../mission/domain/missionConfig.js';

const cat = (n, i) => ({ tex: `cat_Tools_Equipment_${i}` });
const at = (atlas, frame) => ({ atlas, frame });
const PH = { placeholder: true };
const title = (s) => s.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());

// One-line, child-friendly descriptions. They explain purpose only (no numbers).
const D = {
  // water
  closed_loop_water_recycler: 'Cleans used water so the crew can use it again.',
  water_filtration_machine: 'Filters dirt out of water.',
  primary_water_storage_tank: 'The main tank that keeps our water safe.',
  secondary_water_storage_tank: 'A backup tank for extra water.',
  water_purification_filter_cartridge: 'A filter that cleans water. Filters wear out and get replaced.',
  water_pump: 'Pushes water through the pipes.',
  water_distribution_pump: 'Sends clean water to the rooms that need it.',
  water_pipe_straight_segment: 'A straight pipe that carries water.',
  water_pipe_curved_segment: 'A curved pipe that bends water around corners.',
  pipe_elbow_connector: 'Joins two pipes at an angle.',
  pipe_junction_connector: 'Splits one pipe into several.',
  manual_water_valve: 'A valve you can turn to open or close a pipe.',
  water_pressure_gauge: 'A dial that shows how hard the water is pushing.',
  water_quality_monitoring_console: 'A screen that checks if water is clean.',
  water_leak_detector: 'Warns the crew when water is escaping.',
  water_collection_container: 'A container that gathers water.',
  wastewater_processing_unit: 'Treats dirty water before it is recycled.',
  water_recycling_control_panel: 'Buttons and screens that run the recycling system.',
  // solar
  large_solar_panel: 'Turns sunlight into electricity. This one is big.',
  small_solar_panel: 'A small panel that turns sunlight into electricity.',
  connected_solar_panel_array: 'Several panels joined together to make more power.',
  foldable_solar_panel_unit: 'A panel that folds up for transport.',
  battery_storage_unit: 'Stores electricity for when the sun is down.',
  large_energy_storage_battery: 'A big battery that keeps the base running at night.',
  power_inverter: 'Changes electricity so base machines can use it.',
  solar_charge_controller: 'Protects the batteries while they charge.',
  electrical_distribution_cabinet: 'Shares power with different parts of the base.',
  electrical_cable_segments: 'Cables that carry electricity.',
  cable_connectors: 'Plugs that join cables safely.',
  power_junction_box: 'A safe box where cables meet.',
  solar_panel_mounting_frame: 'Holds solar panels at the right angle.',
  solar_panel_cleaning_brush: 'Brushes dust off solar panels.',
  solar_panel_maintenance_tool: 'A tool for fixing and checking panels.',
  small_power_status_indicator: 'A small light that shows power status.',
  // oxygen
  oxygen_generator: 'Makes breathable air for the base.',
  main_oxygen_production_machine: 'The main machine that produces oxygen.',
  oxygen_storage_cylinder: 'Keeps oxygen in a strong tank.',
  multiple_oxygen_cylinder_rack: 'A rack that holds several oxygen tanks.',
  oxygen_distribution_unit: 'Sends oxygen to the rooms.',
  space_heating_unit: 'Warms the base.',
  thermal_regulation_machine: 'Keeps temperatures steady.',
  heating_control_panel: 'Controls the heaters.',
  ventilation_fan: 'Moves air around.',
  air_circulation_unit: 'Keeps air flowing so it stays fresh.',
  oxygen_pipe_segments: 'Pipes that carry oxygen.',
  insulated_pipes: 'Pipes wrapped to stop heat from escaping.',
  anti_freeze_heating_cable: 'A cable that keeps pipes from freezing.',
  pipe_connectors: 'Parts that join pipes together.',
  oxygen_flow_valve: 'A valve that controls oxygen flow.',
  oxygen_pressure_gauge: 'A dial that shows oxygen pressure.',
  oxygen_monitoring_screen: 'A screen that watches the oxygen system.',
  temperature_sensor: 'Measures how warm or cold it is.',
  temperature_monitoring_console: 'A screen that shows temperature information.',
  emergency_heating_module: 'A backup heater for emergencies.'
};

const atlasItems = (atlas, frames, tab = 'equipment') =>
  frames.filter((f) => f !== 'exterior_building').map((f) => ({ id: f, name: title(f), desc: D[f] || 'Station equipment.', sprite: at(atlas, f), tab }));

const FRAMES = {
  st_water: ['closed_loop_water_recycler', 'water_filtration_machine', 'primary_water_storage_tank', 'secondary_water_storage_tank', 'water_purification_filter_cartridge', 'water_pump', 'water_distribution_pump', 'water_pipe_straight_segment', 'water_pipe_curved_segment', 'pipe_elbow_connector', 'pipe_junction_connector', 'manual_water_valve', 'water_pressure_gauge', 'water_quality_monitoring_console', 'water_leak_detector', 'water_collection_container', 'wastewater_processing_unit', 'water_recycling_control_panel'],
  st_solar: ['large_solar_panel', 'small_solar_panel', 'connected_solar_panel_array', 'foldable_solar_panel_unit', 'battery_storage_unit', 'large_energy_storage_battery', 'power_inverter', 'solar_charge_controller', 'electrical_distribution_cabinet', 'electrical_cable_segments', 'cable_connectors', 'power_junction_box', 'solar_panel_mounting_frame', 'solar_panel_cleaning_brush', 'solar_panel_maintenance_tool', 'small_power_status_indicator'],
  st_oxygen: ['oxygen_generator', 'main_oxygen_production_machine', 'oxygen_storage_cylinder', 'multiple_oxygen_cylinder_rack', 'oxygen_distribution_unit', 'space_heating_unit', 'thermal_regulation_machine', 'heating_control_panel', 'ventilation_fan', 'air_circulation_unit', 'oxygen_pipe_segments', 'insulated_pipes', 'anti_freeze_heating_cable', 'pipe_connectors', 'oxygen_flow_valve', 'oxygen_pressure_gauge', 'oxygen_monitoring_screen', 'temperature_sensor', 'temperature_monitoring_console', 'emergency_heating_module']
};

const item = (id, name, desc, sprite) => ({ id, name, desc, sprite, tab: 'equipment' });

const NODATA = (label, note) => ({ label, value: 'NO DATA', state: 'nodata', note });

export const STATIONS = {
  habitat: {
    id: 'habitat', name: 'MAIN HABITAT', roomId: 'central', accent: 0xf28c28, hero: cat('', 56),
    blurb: 'The command hub of Alpha Base: crew quarters, mission console and the sleeping pod.',
    equipment: [
      item('mission_console', 'Mission Console', 'Shows the mission and base status.', cat('', 55)),
      item('sleeping_pod', 'Sleeping Pod', 'Where the crew rests to end a day.', cat('', 24)),
      item('supply_shelf', 'Supply Shelf', 'Holds supplies the crew needs.', cat('', 56)),
      item('storage_locker', 'Storage Locker', 'A safe place for gear.', cat('', 53)),
      item('crew_locker', 'Crew Locker', 'Where crew keep their suits and tools.', cat('', 54)),
      item('desk_computer', 'Desk Computer', 'A computer for reports and notes.', cat('', 58)),
      item('comm_tower', 'Comm Tower', 'Sends messages to Earth.', cat('', 63)),
      item('comm_dish', 'Comm Dish', 'A dish that points at Earth.', cat('', 64))
    ],
    facts: [
      { source: SOURCE.FICTION, text: 'Alpha Base is a fictional REVO colony used for this training game.' },
      { source: SOURCE.SIM, text: 'Each sleep ends one day of the 10-day Mission 1 timer.' }
    ]
  },
  radiation: {
    id: 'radiation', name: 'RADIATION SHIELDING', roomId: 'radiation', accent: 0xf2c14e, hero: cat('', 28),
    blurb: 'Where the crew shelters during radiation events.',
    equipment: [
      item('radiation_sign', 'Radiation Sign', 'Warns people to stay careful.', cat('', 28)),
      item('hazard_sign', 'Hazard Sign', 'Marks a danger zone.', cat('', 65)),
      item('hazard_cabinet', 'Hazard Cabinet', 'Stores dangerous items safely.', cat('', 21)),
      item('shelter_pod_dark', 'Shelter Pod', 'A protected pod for the crew.', cat('', 24)),
      item('shelter_pod_hazard', 'Hazard Pod', 'A pod marked for hazard use.', cat('', 25)),
      item('alarm_beacon', 'Alarm Beacon', 'Flashes when something is wrong.', cat('', 29)),
      item('radiation_monitor', 'Radiation Monitor', 'Would show radiation readings.', PH)
    ],
    facts: [{ source: SOURCE.SIM, text: 'No radiation readings exist in this build, so none are shown.' }]
  },
  greenhouse: {
    id: 'greenhouse', name: 'GREENHOUSE', roomId: 'greenhouse', accent: 0x55d68b, hero: cat('', 48),
    blurb: 'Grows plants for food and fresh air.',
    equipment: [
      item('planter_a', 'Planter', 'A box where plants grow.', cat('', 45)),
      item('planter_b', 'Planter Tray', 'A tray for young plants.', cat('', 46)),
      item('planter_c', 'Large Planter', 'A big bed for crops.', cat('', 47)),
      item('terrarium', 'Dome Terrarium', 'A small dome that protects plants.', cat('', 48)),
      item('bio_tube', 'Bio Tube', 'A glass tube for growing things.', cat('', 49)),
      item('water_purifier', 'Water Purifier Tank', 'Cleans water for plants.', cat('', 50)),
      item('grow_lights', 'Grow Lights', 'Would give plants light.', PH)
    ],
    facts: [{ source: SOURCE.SIM, text: 'Crop growth times are game values, not official science data.' }]
  },
  health: {
    id: 'health', name: 'CREW HEALTH & FITNESS', roomId: null, accent: 0x36d6e8, hero: PH,
    blurb: 'A training dashboard about fitness and rest. It does not diagnose or measure anyone.',
    equipment: [
      item('treadmill', 'Exercise Machine', 'Would keep crew muscles and bones strong.', PH),
      item('med_kit', 'Medical Kit', 'Would hold first-aid supplies.', PH),
      item('vitals_scanner', 'Vitals Scanner', 'Would check heart rate and rest.', PH)
    ],
    facts: [{ source: SOURCE.SIM, text: 'Health values are not simulated in Mission 1.' }]
  },
  water: {
    id: 'water', name: 'WATER & RECYCLING', roomId: null, accent: 0x36d6e8, atlas: 'st_water',
    blurb: 'Stores, cleans and recycles the base water.',
    equipment: atlasItems('st_water', FRAMES.st_water),
    facts: [{ source: SOURCE.SIM, text: 'Mission 1 starts with 300 L, shown as a full 10-bar meter. Flow and filter wear are not simulated yet.' }]
  },
  solar: {
    id: 'solar', name: 'SOLAR POWER', roomId: 'power', accent: 0xf2c14e, atlas: 'st_solar',
    blurb: 'Solar arrays are the primary power source. Batteries only store the energy.',
    equipment: atlasItems('st_solar', FRAMES.st_solar),
    facts: [
      { source: SOURCE.FICTION, text: 'Alpha Base uses solar arrays for power and batteries for storage. There is no nuclear reactor.' },
      { source: SOURCE.SIM, text: 'Dust lowers panel output by 0.3% per day in this simulation.' },
      { source: SOURCE.NASA, text: 'NASA lost contact with Opportunity on June 10, 2018, after a dust storm blocked its sunlight. Opportunity worked in Meridiani Planum.' }
    ]
  },
  oxygen: {
    id: 'oxygen', name: 'OXYGEN & HEATING', roomId: 'life', accent: 0x36d6e8, atlas: 'st_oxygen',
    blurb: 'Makes breathable air and keeps the base warm. Both need electricity.',
    equipment: atlasItems('st_oxygen', FRAMES.st_oxygen),
    facts: [{ source: SOURCE.SIM, text: 'Oxygen and temperature values are not simulated yet, so none are shown.' }]
  }
};

export const STATION_ORDER = ['habitat', 'radiation', 'greenhouse', 'health', 'water', 'solar', 'oxygen'];
export const ROOM_TO_STATION = Object.freeze({ power: 'solar', life: 'oxygen', central: 'habitat', greenhouse: 'greenhouse', radiation: 'radiation' });
export const stationForRoom = (roomId) => ROOM_TO_STATION[roomId] || null;

const statusOf = (bars) => (bars == null ? 'nodata' : bars <= 1 ? 'critical' : bars <= 3 ? 'warning' : 'ok');

// Overview readouts resolved from the authoritative state.
export function stationReadouts(id, s) {
  const batt = barsFromRatio(s.battery_current, s.battery_capacity);
  const water = barsFromRatio(s.water_current, s.water_full_at);
  const days = { label: 'DAYS LEFT', value: `${s.remaining_days}/${s.total_days}`, state: s.remaining_days <= 2 ? 'critical' : s.remaining_days <= 3 ? 'warning' : 'ok' };
  switch (id) {
    case 'solar': return [
      days,
      { label: 'BATTERY', value: `${s.battery_current}/${s.battery_capacity} kWh`, state: statusOf(batt) },
      { label: 'SOLAR GRID', value: s.deployment ? s.deployment.name : 'NOT DEPLOYED', state: s.deployment ? 'ok' : 'warning' },
      { label: 'GENERATION', value: s.deployment ? `+${s.deployment.generationBarsPerDay} bars/day` : 'NO DATA', state: s.deployment ? 'ok' : 'nodata', note: 'Design value' },
      { label: 'BASE LOAD', value: `${s.base_load} kWh/sol`, state: 'ok' },
      { label: 'DUST', value: s.dust.enabled ? `${s.dust.accumulatedPct}%` : 'NOT ACTIVE', state: s.dust.enabled ? 'warning' : 'nodata', note: 'Simulation rule: 0.3%/day' }
    ];
    case 'water': return [
      days,
      { label: 'STORED WATER', value: `${s.water_current} L`, state: statusOf(water) },
      NODATA('FLOW RATE', 'Not simulated'), NODATA('FILTER WEAR', 'Not simulated')
    ];
    case 'oxygen': return [days, NODATA('OXYGEN LEVEL', 'Not simulated'), NODATA('TEMPERATURE', 'Not simulated'),
      { label: 'POWER SUPPLY', value: `${s.battery_current}/${s.battery_capacity} kWh`, state: statusOf(batt) }];
    case 'greenhouse': return [days, NODATA('FOOD STORED', 'Not simulated'), NODATA('CROP GROWTH', 'Not simulated')];
    case 'radiation': return [days, NODATA('RADIATION LEVEL', 'Not simulated'), NODATA('SHIELD STATUS', 'Not simulated')];
    case 'health': return [days, NODATA('CREW FITNESS', 'Not simulated'), NODATA('REST', 'Not simulated')];
    default: return [days,
      { label: 'MISSION', value: s.phase === 'complete' ? 'COMPLETE' : s.deployment ? 'IN PROGRESS' : 'START', state: 'ok' },
      { label: 'BATTERY', value: `${s.battery_current}/${s.battery_capacity} kWh`, state: statusOf(batt) }];
  }
}

// Equipment state shown in the detail panel. Equipment is never claimed "working" without a simulated basis.
export function equipmentInfo(stationId, it, s, inspected) {
  let statusText = 'STATUS: NO DATA', statusState = 'nodata', live = null;
  if (it.sprite?.placeholder) { statusText = 'NOT IN BUILD'; statusState = 'placeholder'; }
  else if (stationId === 'solar') {
    if (/panel|array/.test(it.id) && !/mounting|cleaning|maintenance/.test(it.id)) {
      statusText = s.deployment ? 'DEPLOYED' : 'NOT DEPLOYED'; statusState = s.deployment ? 'ok' : 'warning';
      if (s.deployment) live = `Grid: ${s.deployment.name}`;
    } else if (/battery/.test(it.id)) { statusText = 'STORING'; statusState = 'ok'; live = `Stored: ${s.battery_current}/${s.battery_capacity} kWh`; }
  } else if (stationId === 'water' && /tank|collection/.test(it.id)) { statusText = 'IN USE'; statusState = 'ok'; live = `Stored: ${s.water_current} L`; }
  return { statusText, statusState, live, inspected };
}

export const inspectTitle = (it) => `Inspected: ${it.name}`;
