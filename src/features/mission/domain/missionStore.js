// Authoritative mission state. Pure JavaScript: no Phaser imports (see CLAUDE.md architecture rules).
import { MISSION_1, SOURCE } from './missionConfig.js';

let uid = 0;
const nextId = (p) => `${p}_${++uid}`;

export function barsFromRatio(current, full, segments = 10) {
  if (current == null || !full) return null;
  return Math.max(0, Math.min(segments, Math.round((current / full) * segments)));
}

export function createInitialState(config = MISSION_1) {
  return {
    missionId: config.id,
    phase: 'approvalPending',
    ...config.initial,
    selectedOptionId: null,
    deployment: null,
    dust: { enabled: false, decayPctPerDay: config.rules.dustDecayPctPerDay, accumulatedPct: 0 },
    logbook: [],
    objectives: [{ id: 'restore_power', label: config.objective, done: false }],
    flags: { dustWarned: false, logbookNotified: false }
  };
}

export class MissionStore {
  constructor(config = MISSION_1) {
    this.config = config;
    this.state = createInitialState(config);
    this.subs = new Set();
    this.evSubs = new Set();
  }

  getState() { return this.state; }
  subscribe(fn) { this.subs.add(fn); return () => this.subs.delete(fn); }
  onEvent(fn) { this.evSubs.add(fn); return () => this.evSubs.delete(fn); }
  emit(ev) { this.evSubs.forEach((f) => f(ev)); }
  set(patch) { this.state = { ...this.state, ...patch }; this.subs.forEach((f) => f(this.state)); }
  reset() { this.state = createInitialState(this.config); this.subs.forEach((f) => f(this.state)); }

  // derived values
  currentDay() { return this.state.total_days - this.state.remaining_days + 1; }
  batteryBars() { return barsFromRatio(this.state.battery_current, this.state.battery_capacity, this.config.segments); }
  waterBars() { return barsFromRatio(this.state.water_current, this.state.water_full_at, this.config.segments); }
  option(id) { return this.config.options.find((o) => o.id === id) || null; }

  // Preview of consequences shown BEFORE confirming (no hidden effects).
  previewOption(id) {
    const o = this.option(id);
    if (!o) return null;
    const remainingAfter = this.state.remaining_days - o.days;
    return {
      option: o,
      daysSpent: o.days,
      remainingAfter,
      generationBarsPerDay: o.rewardBarsPerDay,
      batteryAfterKwh: this.config.rules.batteryAppliesGenerationOnDeploy ? null : this.state.battery_current,
      affordable: remainingAfter >= 0
    };
  }

  setPhase(phase) {
    if (phase !== 'approvalPending' && this.config.approvalStatus !== 'APPROVED') return false;
    this.set({ phase });
    return true;
  }

  selectOption(id) {
    if (this.state.phase !== 'decision' || !this.option(id)) return false;
    this.set({ selectedOptionId: id });
    return true;
  }

  clearSelection() { this.set({ selectedOptionId: null }); }

  confirmDeployment() {
    const s = this.state;
    if (this.config.approvalStatus !== 'APPROVED') return null;
    if (s.phase !== 'decision' || !s.selectedOptionId || s.deployment) return null;
    const p = this.previewOption(s.selectedOptionId);
    if (!p || !p.affordable) return null;
    const o = p.option;
    const solBefore = this.currentDay();
    const deployment = { optionId: o.id, name: o.name, panels: o.panels, daysSpent: o.days, generationBarsPerDay: o.rewardBarsPerDay };
    this.set({
      remaining_days: p.remainingAfter,
      deployment,
      phase: 'deploying',
      dust: { ...s.dust, enabled: this.config.rules.dustActiveInMission1Phase }
    });
    this.addLog({ sol: solBefore, type: 'mission_history', title: `Solar grid deployed: ${o.name}`, text: `REVO chose ${o.panelLabel.toLowerCase()} and spent ${o.days} day${o.days > 1 ? 's' : ''}.`, station: 'solar', icon: 'solar', source: SOURCE.FICTION });
    this.addLog({ sol: this.currentDay(), type: 'daily_report', title: 'Daily report: deployment', text: `${o.days} day${o.days > 1 ? 's' : ''} spent. ${p.remainingAfter} days remaining. Battery ${s.battery_current}/${s.battery_capacity} kWh.`, station: 'solar', icon: 'clock', source: SOURCE.SIM });
    this.addLog({ sol: this.currentDay(), type: 'resource_change', title: 'Power generation increased', text: `Design value: +${o.rewardBarsPerDay} power bars per day. Base load indicator: -1. Stored battery is unchanged until the energy rule is approved.`, station: 'solar', icon: 'battery', source: SOURCE.SIM });
    this.addLog({ sol: this.currentDay(), type: 'objective', title: 'Objective progress', text: 'Solar panels deployed. The base can start producing electricity.', station: 'solar', icon: 'check', source: SOURCE.FICTION });
    this.emit({ type: 'notification', level: 'success', title: 'SOLAR GRID DEPLOYED', text: `${o.days} DAY${o.days > 1 ? 'S' : ''} SPENT` });
    return deployment;
  }

  finishDeployment() {
    if (this.state.phase === 'deploying') this.set({ phase: 'result' });
  }

  startDustWarning() {
    if (!this.config.rules.dustDecayPctPerDay) return;
    if (this.state.flags.dustWarned) { this.set({ phase: 'dust' }); return; }
    this.set({ phase: 'dust', flags: { ...this.state.flags, dustWarned: true } });
    this.addLog({ sol: this.currentDay(), type: 'neil_note', title: 'N.E.I.L.: keep the panels clean', text: 'Dust can cover solar panels and reduce the sunlight they collect. In this simulation, panels lose 0.3% of their output each day without cleaning.', station: 'solar', icon: 'neil', source: SOURCE.SIM });
    this.addLog({ sol: this.currentDay(), type: 'nasa_fact', title: 'NASA fact: Opportunity and dust', text: 'NASA lost contact with the Opportunity rover on June 10, 2018, after a global dust storm blocked sunlight from its solar panels. Opportunity worked in Meridiani Planum, not Jezero Crater.', station: 'solar', icon: 'info', source: SOURCE.NASA, reference: 'NASA Astrobiology: Opportunity rover mission comes to an end (astrobiology.nasa.gov)' });
    this.emit({ type: 'notification', level: 'warning', title: 'DUST ACCUMULATION DETECTED', text: 'SIMULATION RULE: 0.3% PER DAY' });
  }

  announceLogbook() {
    this.set({ phase: 'logbook', flags: { ...this.state.flags, logbookNotified: true } });
    this.emit({ type: 'notification', level: 'info', title: 'NEW LOGBOOK ENTRY', text: 'DAILY POWER REPORT SAVED' });
  }

  endPhase() {
    const objs = this.state.objectives.map((o) => (o.id === 'restore_power' ? { ...o, done: true } : o));
    this.set({ phase: 'endphase', objectives: objs });
    this.emit({ type: 'notification', level: 'success', title: 'SOLAR DEPLOYMENT COMPLETE', text: `${this.state.remaining_days} DAYS REMAINING` });
  }

  canSleep() { return this.state.phase === 'endphase' && !!this.state.deployment; }

  goToSleep() {
    if (!this.canSleep()) return false;
    this.set({ phase: 'complete' });
    return true;
  }

  addLog(entry) {
    const e = { id: nextId('log'), unread: true, ...entry };
    this.set({ logbook: [...this.state.logbook, e] });
    return e;
  }

  addDiscovery({ title, text, station, source = SOURCE.SIM, icon = 'info' }) {
    if (this.state.logbook.some((e) => e.type === 'discovery' && e.title === title)) return null;
    const e = this.addLog({ sol: this.currentDay(), type: 'discovery', title, text, station, icon, source });
    this.emit({ type: 'notification', level: 'info', title: 'NEW LOGBOOK ENTRY', text: title.toUpperCase() });
    return e;
  }

  markAllRead() { this.set({ logbook: this.state.logbook.map((e) => ({ ...e, unread: false })) }); }
  unreadCount() { return this.state.logbook.filter((e) => e.unread).length; }
}

// One shared store for the running game. UI scenes read from this, never from copies.
export const missionStore = new MissionStore();
