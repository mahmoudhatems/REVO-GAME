// N.E.I.L. (Navigation & Exploration Intelligence Link): authored, deterministic dialogue.
// No LLM, no generated readings. Every line reads from the authoritative mission state.
import { barsFromRatio } from '../mission/domain/missionStore.js';

export const NEIL_LINES = Object.freeze({
  briefing:
    'REVO, the base is a cold piece of metal right now. Without electricity, we can\'t generate air or turn on the heaters. You have exactly 10 days to set up everything. How many days will you invest in deploying the solar panels?',
  decision:
    'Pick a solar grid. A bigger grid makes more power every day, but it uses more of your 10 days. Check each card before you confirm.',
  dust:
    'Mars dust can cover solar panels and reduce how much sunlight they collect. We need to keep our panels clean so the base can keep producing electricity.',
  dustNasa:
    'NASA\'s Opportunity rover stopped communicating after a major dust storm in 2018. It worked in Meridiani Planum, a different place from our Jezero Crater base.',
  logbook: 'I saved today\'s power report in your logbook. Open it any time from the pause menu.'
});

// Result line is built from the real deployment so it never claims something that did not happen.
export function deploymentResultLine(state) {
  const d = state.deployment;
  if (!d) return 'No solar grid has been deployed yet.';
  return `${d.name} is online. It used ${d.daysSpent} day${d.daysSpent > 1 ? 's' : ''}, so ${state.remaining_days} days remain. The grid is designed to add ${d.generationBarsPerDay} power bars per day.`;
}

// Priority-ordered, deterministic rules. Returns { text, severity, action? }.
export function neilGuidance(state, ctx = {}) {
  const battery = barsFromRatio(state.battery_current, state.battery_capacity);
  const water = barsFromRatio(state.water_current, state.water_full_at);

  if (battery != null && battery <= 2) {
    return { severity: 'critical', text: 'Battery is very low. Without power we cannot run air or heaters. Check the Solar Power Station now.', action: { label: 'OPEN SOLAR POWER', station: 'solar' } };
  }
  if (water != null && water <= 2) {
    return { severity: 'warning', text: 'Water is running low. Visit the Water & Recycling Station to check storage and filters.', action: { label: 'OPEN WATER STATION', station: 'water' } };
  }
  if (state.dust.enabled && state.dust.accumulatedPct > 0) {
    return { severity: 'warning', text: 'Dust is building up on the solar panels. Cleaning them keeps the power coming.', action: { label: 'OPEN SOLAR POWER', station: 'solar' } };
  }
  if (state.phase === 'briefing') return { severity: 'info', text: NEIL_LINES.briefing };
  if (state.phase === 'decision') return { severity: 'info', text: NEIL_LINES.decision };
  if (state.deployment) return { severity: 'success', text: deploymentResultLine(state) };
  return { severity: 'info', text: 'All systems we can see look steady. Pick a station and inspect its equipment.' };
}

// Short contextual hint for a station dashboard. Never states readings that the simulation does not have.
export function stationGuidance(stationId, state) {
  const base = neilGuidance(state);
  if (base.severity === 'critical' || base.severity === 'warning') return base;
  switch (stationId) {
    case 'solar':
      return state.deployment
        ? { severity: 'success', text: deploymentResultLine(state) }
        : { severity: 'info', text: 'No solar grid is deployed yet. Deploy panels to start producing electricity for Alpha Base.', action: { label: 'DEPLOY SOLAR PANELS', mission: 'decision' } };
    case 'water':
      return { severity: 'info', text: 'Mission 1 starts with 300 liters, shown as a full meter. Detailed water flow and filter wear are not simulated yet.' };
    case 'oxygen':
      return { severity: 'info', text: 'Oxygen and heating need electricity first. Oxygen levels and production rates are not simulated yet, so none are shown.' };
    case 'greenhouse':
      return { severity: 'info', text: 'Plants will make food later in the mission. Growth times here are game values, not official science data.' };
    case 'radiation':
      return { severity: 'info', text: 'Shielding protects the crew. Radiation values here are training simulation, not live NASA measurements.' };
    case 'habitat':
      return { severity: 'info', text: 'This is our command hub. You can end a day at the sleeping pod when the mission allows it.' };
    case 'health':
      return { severity: 'info', text: 'Healthy crew, steady missions. This screen teaches about fitness and rest and does not diagnose anything.' };
    default:
      return base;
  }
}
