import { describe, it, expect } from 'vitest';
import { MissionStore } from '../src/features/mission/domain/missionStore.js';
import { MISSION_1 } from '../src/features/mission/domain/missionConfig.js';
import { resourceViews, countdownState } from '../src/features/mission/domain/resources.js';
import { neilGuidance, stationGuidance } from '../src/features/neil/neilDialogue.js';

// A test-only approved fixture exercises transitions. The running application keeps MISSION_1 pending approval.
const approvedFixture = { ...MISSION_1, approvalStatus: 'APPROVED', rules: { ...MISSION_1.rules, dustDecayPctPerDay: 0.3 } };
const fresh = () => { const s = new MissionStore(approvedFixture); s.setPhase('decision'); return s; };

describe('initial Mission 1 state', () => {
  it('uses the supplied values', () => {
    const st = new MissionStore().getState();
    expect(st.remaining_days).toBe(10);
    expect(st.battery_current).toBe(25);
    expect(st.battery_capacity).toBe(50);
    expect(st.water_current).toBe(300);
    expect(st.base_load).toBe(5);
    expect(st.oxygen).toBeNull();
    expect(st.food).toBeNull();
  });
  it('keeps supplied gameplay proposals inactive until approval', () => {
    const store = new MissionStore();
    const before = store.getState();
    expect(before.phase).toBe('approvalPending');
    expect(store.selectOption('basic_grid')).toBe(false);
    expect(store.setPhase('decision')).toBe(false);
    expect(store.getState().phase).toBe('approvalPending');
    expect(store.confirmDeployment()).toBeNull();
    store.startDustWarning();
    expect(store.getState().deployment).toBeNull();
    expect(store.getState().remaining_days).toBe(before.remaining_days);
    expect(store.getState().dust.decayPctPerDay).toBeNull();
  });
  it('shows 5/10 battery bars and 10/10 water bars, no invented oxygen or food', () => {
    const v = resourceViews(new MissionStore().getState());
    expect(v.battery.bars).toBe(5);
    expect(v.water.bars).toBe(10);
    expect(v.oxygen.status).toBe('nodata');
    expect(v.food.bars).toBeNull();
  });
});

describe('deployment decision', () => {
  it.each([['emergency_grid', 1, 9, 6], ['basic_grid', 2, 8, 12], ['medium_grid', 3, 7, 18], ['giant_grid', 4, 6, 24]])(
    '%s costs %i day(s) leaving %i with +%i bars/day', (id, days, remaining, reward) => {
      const s = fresh();
      const p = s.previewOption(id);
      expect(p.daysSpent).toBe(days);
      expect(p.generationBarsPerDay).toBe(reward);
      expect(s.getState().remaining_days).toBe(10); // preview has no side effects
      s.selectOption(id);
      const d = s.confirmDeployment();
      expect(d.daysSpent).toBe(days);
      expect(s.getState().remaining_days).toBe(remaining);
      expect(s.getState().phase).toBe('deploying');
    });

  it('allows only one selection and does nothing without one', () => {
    const s = fresh();
    expect(s.confirmDeployment()).toBeNull();
    s.selectOption('basic_grid'); s.selectOption('giant_grid');
    expect(s.getState().selectedOptionId).toBe('giant_grid');
  });

  it('cannot select or confirm outside the decision phase and cannot deploy twice', () => {
    const s = new MissionStore(approvedFixture);
    expect(s.selectOption('basic_grid')).toBe(false);
    s.setPhase('decision'); s.selectOption('basic_grid'); s.confirmDeployment();
    expect(s.confirmDeployment()).toBeNull();
    expect(s.getState().remaining_days).toBe(8);
  });

  it('keeps stored battery unchanged while the energy rule is unapproved', () => {
    const s = fresh(); s.selectOption('basic_grid'); s.confirmDeployment();
    expect(s.getState().battery_current).toBe(25);
  });

  it('writes logbook entries from the real selection', () => {
    const s = fresh(); s.selectOption('medium_grid'); s.confirmDeployment();
    const log = s.getState().logbook;
    expect(log.some((e) => e.type === 'mission_history' && e.title.includes('MEDIUM GRID'))).toBe(true);
    expect(log.some((e) => e.type === 'daily_report' && e.text.includes('7 days remaining'))).toBe(true);
  });
});

describe('phase flow', () => {
  it('only allows sleep after the end phase with a deployment', () => {
    const s = fresh();
    expect(s.canSleep()).toBe(false);
    s.selectOption('basic_grid'); s.confirmDeployment(); s.finishDeployment();
    expect(s.goToSleep()).toBe(false);
    s.startDustWarning(); s.announceLogbook(); s.endPhase();
    expect(s.canSleep()).toBe(true);
    expect(s.goToSleep()).toBe(true);
    expect(s.getState().phase).toBe('complete');
  });

  it('labels the Opportunity fact as NASA and the decay as game simulation', () => {
    const s = fresh(); s.selectOption('basic_grid'); s.confirmDeployment(); s.startDustWarning();
    const log = s.getState().logbook;
    const nasa = log.find((e) => e.type === 'nasa_fact');
    expect(nasa.source).toBe('NASA FACT');
    expect(nasa.text).toContain('Meridiani Planum');
    expect(log.find((e) => e.type === 'neil_note').source).toBe('GAME SIMULATION');
  });

  it('deduplicates discoveries', () => {
    const s = new MissionStore();
    expect(s.addDiscovery({ title: 'A', text: 'x', station: 'solar' })).not.toBeNull();
    expect(s.addDiscovery({ title: 'A', text: 'x', station: 'solar' })).toBeNull();
  });
});

describe('N.E.I.L. and countdown', () => {
  it('speaks from state: briefing text, low battery warning, post-deploy summary', () => {
    const pending = new MissionStore();
    expect(neilGuidance(pending.getState()).text).toContain('awaiting approval');
    const s = new MissionStore(approvedFixture);
    s.setPhase('decision');
    s.set({ battery_current: 5 });
    expect(neilGuidance(s.getState()).severity).toBe('critical');
    const t = new MissionStore(approvedFixture); t.setPhase('decision'); t.selectOption('basic_grid'); t.confirmDeployment();
    expect(neilGuidance(t.getState()).text).toContain('8 days remain');
    expect(stationGuidance('oxygen', t.getState()).text).toContain('not simulated');
  });
  it('countdown turns warning and critical', () => {
    expect(countdownState(10)).toBe('ok');
    expect(countdownState(3)).toBe('warning');
    expect(countdownState(2)).toBe('critical');
  });
});
