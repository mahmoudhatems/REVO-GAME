// View-model for the HUD. Reads only authoritative state; null means "no approved value yet".
import { barsFromRatio } from './missionStore.js';

export function resourceViews(state, segments = 10) {
  const batteryBars = barsFromRatio(state.battery_current, state.battery_capacity, segments);
  const waterBars = barsFromRatio(state.water_current, state.water_full_at, segments);
  const stateOf = (bars) => (bars == null ? 'nodata' : bars <= 1 ? 'critical' : bars <= 3 ? 'warning' : 'ok');
  return {
    battery: {
      id: 'battery', label: 'POWER', icon: 'battery', bars: batteryBars, segments,
      valueText: `${state.battery_current}/${state.battery_capacity} kWh`,
      status: stateOf(batteryBars), station: 'solar',
      drain: { label: '-1', detail: `Base computer load: ${state.base_load} kWh per sol. The "-1" is a visual indicator; its exact conversion is not defined yet.` },
      production: state.deployment ? `+${state.deployment.generationBarsPerDay} bars/day (design value)` : null,
      consumption: `${state.base_load} kWh per sol (base load)`
    },
    water: {
      id: 'water', label: 'WATER', icon: 'water', bars: waterBars, segments,
      valueText: `${state.water_current} L`, status: stateOf(waterBars), station: 'water',
      production: null, consumption: null
    },
    oxygen: { id: 'oxygen', label: 'OXYGEN', icon: 'oxygen', bars: null, segments, valueText: 'NO DATA', status: 'nodata', station: 'oxygen', production: null, consumption: null },
    food: { id: 'food', label: 'FOOD', icon: 'food', bars: null, segments, valueText: 'NO DATA', status: 'nodata', station: 'greenhouse', production: null, consumption: null }
  };
}

export function countdownState(remaining, total = 10) {
  if (remaining <= 2) return 'critical';
  if (remaining <= Math.ceil(total * 0.3)) return 'warning';
  return 'ok';
}
