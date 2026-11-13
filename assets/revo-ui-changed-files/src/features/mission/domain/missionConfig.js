// Mission 1 "The Beating Heart": supplied design values (mission_1_the_beating_heart.md).
// These are fictional REVO training-simulation values, not NASA measurements.
// Do not change them without owner approval (see docs/UI_UX_DESIGN.md, section "Approved values").

export const SOURCE = Object.freeze({
  NASA: 'NASA FACT',
  FICTION: 'REVO MISSION EVENT',
  SIM: 'GAME SIMULATION'
});

export const MISSION_1 = Object.freeze({
  id: 'mission_1',
  title: 'The Beating Heart',
  station: 'solar',
  objective: 'RESTORE POWER TO ALPHA BASE',
  segments: 10,
  initial: Object.freeze({
    total_days: 10,
    remaining_days: 10,
    battery_current: 25, // kWh
    battery_capacity: 50, // kWh
    water_current: 300, // Liters, shown as 10/10 bars per the mission document
    water_full_at: 300, // Liters that fill the 10-bar meter (document defines no separate capacity)
    base_load: 5, // kWh per sol
    oxygen: null, // no Mission 1 value supplied, never invented
    food: null // no Mission 1 value supplied, never invented
  }),
  // Rules that are NOT approved yet are isolated here so they can be switched without touching UI code.
  rules: Object.freeze({
    // The document says the battery meter "fills up" after deployment but gives no conversion
    // between "power bars per day" and kWh. Until the owner approves one, stored battery stays unchanged.
    batteryAppliesGenerationOnDeploy: false,
    dustDecayPctPerDay: 0.3, // game simulation rule, not a NASA measurement
    dustActiveInMission1Phase: false // dust accumulation starts after the deployment phase
  }),
  options: Object.freeze([
    { id: 'emergency_grid', name: 'EMERGENCY GRID', panels: 1, panelLabel: '1 SMALL PANEL', days: 1, rewardBarsPerDay: 6, risk: 'Base may freeze during severe dust conditions.' },
    { id: 'basic_grid', name: 'BASIC GRID', panels: 2, panelLabel: '2 PANELS', days: 2, rewardBarsPerDay: 12, risk: 'Limited energy for heavy equipment.' },
    { id: 'medium_grid', name: 'MEDIUM GRID', panels: 3, panelLabel: '3 PANELS', days: 3, rewardBarsPerDay: 18, risk: 'Less time remains for other colony infrastructure.' },
    { id: 'giant_grid', name: 'GIANT GRID', panels: 4, panelLabel: '4 MASSIVE PANELS', days: 4, rewardBarsPerDay: 24, risk: 'Leaves less time for greenhouse and shielding development.' }
  ])
});

export const PHASES = Object.freeze(['briefing', 'decision', 'deploying', 'result', 'dust', 'logbook', 'endphase', 'complete']);
