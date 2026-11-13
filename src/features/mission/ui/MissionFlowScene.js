import * as Phaser from 'phaser';
import { COLORS as C, SIZE, css } from '../../ui/tokens.js';
import { ICON, catKey } from '../../ui/assetKeys.js';
import { T, Panel, Button, ProgressBar } from '../../ui/components/core.js';
import { NeilDialoguePanel, ConfirmationModal } from '../../ui/components/overlays.js';
import { DecisionCard, MissionObjectiveCard, MissionResultCard, LogbookEntry } from '../../ui/components/cards.js';
import { closeOverlay } from '../../ui/overlayManager.js';
import { drawMarsBg } from '../../../utils/ui.js';
import { missionStore } from '../domain/missionStore.js';
import { MISSION_1 } from '../domain/missionConfig.js';
import { NEIL_LINES, deploymentResultLine } from '../../neil/neilDialogue.js';

// Mission 1 six-screen flow, driven only by missionStore.getState().phase.
export class MissionFlowScene extends Phaser.Scene {
  constructor() { super('MissionFlow'); }

  create() {
    this.lastKey = null; this.page = 0;
    this.unsub = missionStore.subscribe((s) => { const k = this.keyOf(s); if (k !== this.lastKey) this.render(); });
    this.scale.on('resize', this.render, this);
    this.events.once('shutdown', () => { this.unsub?.(); this.scale.off('resize', this.render, this); this.timers?.forEach((t) => t.remove()); });
    this.render();
  }

  keyOf(s) { return `${s.phase}|${s.selectedOptionId}`; }
  w() { return this.scale.width; } h() { return this.scale.height; }

  render() {
    this.timers?.forEach((t) => t.remove()); this.timers = [];
    this.tweens.killAll(); this.children.removeAll(true);
    const s = missionStore.getState(); this.lastKey = this.keyOf(s);
    this.add.rectangle(0, 0, this.w(), this.h(), 0x070b14, 1).setOrigin(0).setInteractive().setDepth(-20);
    const fn = { approvalPending: 'approvalPending', briefing: 'briefing', decision: 'decision', deploying: 'deploying', result: 'result', dust: 'dust', logbook: 'logbookUpdate', endphase: 'endPhase', complete: 'complete' }[s.phase];
    this[fn](s);
  }

  approvalPending() {
    const W = this.w(), H = this.h();
    const p = Panel(this, { x: 12, y: 12, w: W - 24, h: H - 24, title: 'MISSION 1: THE BEATING HEART', accent: C.warning, icon: ICON.info });
    p.content.add(T(this, 0, 0, 'MISSION DESIGN AWAITING OWNER APPROVAL', { size: SIZE.lg, color: css(C.warning), wrap: p.innerW }));
    p.content.add(T(this, 0, 42, 'The supplied day counts, battery and water values, power rewards, and dust-decay rule are proposals. They are not active gameplay rules yet. Solar is the primary power source; batteries are storage.', { size: 12, color: css(C.white), wrap: p.innerW, bold: false }));
    p.content.add(T(this, 0, 124, 'No resources are changed and no deployment can be confirmed until the mission values are approved.', { size: 11, color: css(C.muted), wrap: p.innerW, bold: false }));
    p.content.add(Button(this, { x: 0, y: p.innerH - 38, w: Math.min(180, p.innerW), h: 34, label: 'CLOSE', variant: 'secondary', onClick: () => closeOverlay(this) }));
  }

  // shared header: objective + days
  header(s, accent = C.orange) {
    const cw = Math.min(300, this.w() - 16);
    this.add.existing(MissionObjectiveCard(this, { x: 8, y: 8, w: cw, objective: MISSION_1.objective, done: s.objectives[0].done }));
    const dp = Panel(this, { x: this.w() - 8 - 130, y: 8, w: 130, h: 58, accent });
    dp.add(T(this, 12, 9, 'DAYS LEFT', { size: 10, color: css(C.muted) }));
    dp.add(T(this, 12, 26, `${s.remaining_days}/${s.total_days}`, { size: SIZE.lg, color: css(s.remaining_days <= 2 ? C.danger : C.white) }));
    return dp;
  }

  neil(text, o = {}) {
    const w = Math.min(760, this.w() - 16); const h = this.w() < 520 ? 190 : 168;
    const p = NeilDialoguePanel(this, { x: Math.round((this.w() - w) / 2), y: this.h() - h - 8, w, h, onContinue: o.onContinue, onAction: o.onAction });
    p.say({ text, severity: o.severity || 'info', continueLabel: o.continueLabel });
    return p;
  }

  // ---- Screen 1: Briefing
  briefing(s) {
    const W = this.w(), H = this.h();
    const g = this.add.graphics();
    g.fillStyle(0x0b1220, 1); g.fillRect(0, 0, W, H);
    g.fillStyle(0x121c30, 1); g.fillEllipse?.(W / 2, H * 0.9, W * 1.1, H * 0.9);
    g.lineStyle(4, C.dgray, 1); g.strokeEllipse?.(W / 2, H * 0.9, W * 1.1, H * 0.9);
    for (let i = 0; i < 40; i++) this.add.rectangle(Math.random() * W, Math.random() * H * 0.5, 2, 2, 0x8493a8, 0.5);
    this.header(s);
    const base = H * 0.46;
    const chr = this.add.sprite(W * 0.34, base, 'character', 12).setScale(Math.max(2, Math.min(4, Math.floor(H / 200))));
    const neilX = W * 0.66;
    const ped = this.add.graphics(); ped.fillStyle(C.dgray, 1); ped.fillRect(neilX - 34, base + 20, 68, 14); ped.fillStyle(C.surface, 1); ped.fillRect(neilX - 30, base + 22, 60, 8);
    ped.fillStyle(C.cyan, 1); ped.fillRect(neilX - 16, base + 24, 32, 3);
    const nl = this.add.image(neilX, base - 12, ICON.neil).setScale(Math.max(2, Math.floor(H / 220)));
    this.tweens.add({ targets: nl, y: nl.y - 3, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.add.existing(T(this, neilX, base + 46, 'N.E.I.L. DOCKED', { size: 10, color: css(C.cyan), ox: 0.5 }));
    this.add.existing(T(this, W * 0.34, base + 46 + chr.displayHeight / 2 - 20, 'REVO', { size: 10, color: css(C.orange), ox: 0.5 }));
    this.neil(NEIL_LINES.briefing, { continueLabel: 'START MISSION', onContinue: () => missionStore.setPhase('decision') });
  }

  // ---- Screen 2: Solar Deployment Decision
  decision(s) {
    const W = this.w(), H = this.h();
    drawMarsBg(this);
    this.header(s);
    const crate = this.textures.exists(catKey('Tools_Equipment', 59)); if (crate && W > 700) { this.add.image(40, H - 50, catKey('Tools_Equipment', 59)).setScale(2); this.add.image(W - 50, H - 56, catKey('Tools_Equipment', 66)).setScale(2); }
    this.add.existing(T(this, W / 2, 20, 'CHOOSE YOUR SOLAR GRID', { size: SIZE.lg, ox: 0.5 }));
    this.add.existing(T(this, W / 2, 44, `You have ${s.remaining_days} days. Each grid costs days and makes power.`, { size: 11, color: css(C.muted), ox: 0.5, bold: false }));
    const opts = MISSION_1.options;
    const availH = H - 76 - 74;
    const ch = Phaser.Math.Clamp(availH, 270, 340); const cw = Math.min(230, Math.floor((W - 24 - 30) / 4));
    const per = Math.max(1, Math.min(4, Math.floor((W - 24 + 10) / (Math.max(cw, 190) + 10)))); const w1 = per === 4 ? cw : Math.min(230, Math.floor((W - 24 - (per - 1) * 10) / per));
    const pages = Math.ceil(opts.length / per); this.page = Math.min(this.page, pages - 1);
    const rowW = per * w1 + (per - 1) * 10; const x0 = Math.round((W - rowW) / 2); const y0 = 70;
    opts.slice(this.page * per, this.page * per + per).forEach((o, i) => {
      const dis = missionStore.previewOption(o.id)?.affordable === false;
      this.add.existing(DecisionCard(this, { x: x0 + i * (w1 + 10), y: y0, w: w1, h: Math.min(ch, availH), option: o, selected: s.selectedOptionId === o.id, disabled: dis, onSelect: (id) => missionStore.selectOption(id) }));
    });
    const by = H - 62;
    if (pages > 1) {
      this.add.existing(Button(this, { x: 8, y: by, w: 60, h: 36, label: '<', variant: 'secondary', disabled: this.page === 0, onClick: () => { this.page--; this.render(); } }));
      this.add.existing(Button(this, { x: 76, y: by, w: 60, h: 36, label: '>', variant: 'secondary', disabled: this.page >= pages - 1, onClick: () => { this.page++; this.render(); } }));
    }
    const sel = s.selectedOptionId; const prev = sel ? missionStore.previewOption(sel) : null;
    this.add.existing(T(this, W / 2, by - 4, prev ? `${prev.option.name}: -${prev.daysSpent} day${prev.daysSpent > 1 ? 's' : ''}, +${prev.generationBarsPerDay} bars/day` : 'SELECT A GRID TO CONTINUE', { size: 12, color: css(prev ? C.cyan : C.muted), ox: 0.5 }));
    this.add.existing(Button(this, { x: Math.round(W / 2 - 110), y: by + 14, w: 220, h: 36, label: 'CONFIRM DEPLOYMENT', disabled: !prev, fs: 12, onClick: () => this.confirm(prev) }));
  }

  confirm(p) {
    const o = p.option;
    ConfirmationModal(this, {
      title: `DEPLOY ${o.name}?`, confirmLabel: 'DEPLOY', cancelLabel: 'BACK',
      lines: [`Panels: ${o.panelLabel}`, `Time cost: ${o.days} day${o.days > 1 ? 's' : ''} (${p.remainingAfter} of ${missionStore.getState().total_days} days will remain)`, `Power: +${o.rewardBarsPerDay} bars per day (design value)`, `Risk: ${o.risk}`, '', 'This choice cannot be undone.'],
      onConfirm: () => missionStore.confirmDeployment()
    });
  }

  // ---- Screen 3a: Deployment animation, 3b: Feedback
  deploying(s) {
    const W = this.w(), H = this.h(); drawMarsBg(this); this.header(s);
    const d = s.deployment; const key = catKey('Tools_Equipment', d.panels === 1 ? 13 : 19);
    const n = d.panels; const probe = this.textures.get(key).getSourceImage();
    const sc = Math.max(1, Math.floor(Math.min(W / (n + 1) / probe.width, 4)));
    this.add.existing(T(this, W / 2, H * 0.22, 'DEPLOYING SOLAR GRID...', { size: SIZE.lg, ox: 0.5 }));
    const ld = this.add.container(W / 2, H * 0.3); ld.add(T(this, 0, 0, '', { size: 10 }));
    for (let i = 0; i < n; i++) {
      const im = this.add.image(W / 2 + (i - (n - 1) / 2) * (probe.width * sc + 12), H * 0.5, key).setScale(sc).setAlpha(0);
      im.y += 20; this.tweens.add({ targets: im, alpha: 1, y: im.y - 20, duration: 450, delay: 300 + i * 650 });
    }
    const total = 300 + n * 650 + 700;
    const pb = ProgressBar(this, { x: W / 2 - 120, y: H * 0.7, w: 240, h: 12, value: 0 });
    this.add.existing(pb); this.tweens.addCounter({ from: 0, to: 1, duration: total, onUpdate: (t) => pb.set(t.getValue()) });
    this.timers.push(this.time.delayedCall(total, () => missionStore.finishDeployment()));
  }

  result(s) {
    const W = this.w(); drawMarsBg(this); this.header(s, C.success);
    const d = s.deployment;
    const rw = Math.min(420, W - 16);
    const card = MissionResultCard(this, { x: Math.round((W - rw) / 2), y: 74, w: rw, title: 'SOLAR GRID ONLINE', rows: [
      { label: 'GRID', value: d.name, state: 'ok' }, { label: 'TIME SPENT', value: `${d.daysSpent} DAY${d.daysSpent > 1 ? 'S' : ''}`, state: 'warning' },
      { label: 'DAYS REMAINING', value: `${s.remaining_days}/${s.total_days}`, state: 'ok' }, { label: 'POWER GENERATION', value: `+${d.generationBarsPerDay} BARS/DAY`, state: 'info' },
      { label: 'BATTERY', value: `${s.battery_current}/${s.battery_capacity} kWh`, state: 'ok' }
    ], footer: 'Generation is a design value. Battery change per day is not defined yet.' });
    this.add.existing(card);
    this.neil(deploymentResultLine(s), { severity: 'success', continueLabel: 'CONTINUE', onContinue: () => missionStore.startDustWarning() });
  }

  // ---- Screen 4: Dust warning
  dust(s) {
    const W = this.w(), H = this.h(); this.cameras.main.setBackgroundColor('#2a1408'); this.header(s, C.warning);
    for (let i = 0; i < 30; i++) { const d = this.add.rectangle(Math.random() * W, Math.random() * H * 0.6, 6 + Math.random() * 10, 3, 0xe0793a, 0.25); this.tweens.add({ targets: d, x: d.x + 200, duration: 3000 + Math.random() * 3000, repeat: -1, onRepeat: () => { d.x = -20; } }); }
    const rw = Math.min(560, W - 16); const x = Math.round((W - rw) / 2);
    const p = Panel(this, { x, y: 74, w: rw, h: 176, title: 'DUST ACCUMULATION', accent: C.warning, icon: ICON.dust });
    p.content.add(T(this, 0, 0, 'SIMULATION RULE', { size: 10, color: css(C.warning) }));
    p.content.add(T(this, 0, 16, 'Panels lose 0.3% of their output each day until cleaned.', { size: 12, wrap: p.innerW, bold: false }));
    p.content.add(T(this, 0, 52, 'DUST ON PANELS', { size: 10, color: css(C.muted) }));
    p.content.add(ProgressBar(this, { x: 0, y: 68, w: p.innerW, h: 12, value: 0, color: C.warning }));
    p.content.add(T(this, 0, 86, 'Not active yet: dust starts after this deployment phase.', { size: 10, color: css(C.muted), wrap: p.innerW, bold: false }));
    this.add.existing(p);
    const nasa = Panel(this, { x, y: 74 + 176 + 10, w: rw, h: 92, title: 'NASA FACT', accent: C.cyan });
    nasa.content.add(T(this, 0, 0, NEIL_LINES.dustNasa, { size: 11, wrap: nasa.innerW, bold: false }));
    this.add.existing(nasa);
    this.neil(NEIL_LINES.dust, { severity: 'warning', continueLabel: 'CONTINUE', onContinue: () => missionStore.announceLogbook() });
  }

  // ---- Screen 5: Logbook update
  logbookUpdate(s) {
    const W = this.w(), H = this.h(); drawMarsBg(this); this.header(s);
    const rw = Math.min(520, W - 16); const x = Math.round((W - rw) / 2);
    this.add.existing(T(this, W / 2, 74, 'NEW LOGBOOK ENTRIES', { size: SIZE.lg, ox: 0.5 }));
    let y = 104; const maxY = H - 190 - 16;
    s.logbook.slice(-3).forEach((e) => { const le = LogbookEntry(this, { x, y, w: rw, entry: e }); if (y + le.h <= maxY) { this.add.existing(le); y += le.h + 8; } else le.destroy(true); });
    this.neil(NEIL_LINES.logbook, { continueLabel: 'CONTINUE', onContinue: () => { missionStore.markAllRead(); missionStore.endPhase(); } });
  }

  // ---- Screen 6: End of phase
  endPhase(s) {
    const W = this.w(), H = this.h(); drawMarsBg(this); this.header(s, C.success);
    const rw = Math.min(440, W - 16); const d = s.deployment;
    const card = MissionResultCard(this, { x: Math.round((W - rw) / 2), y: 74, w: rw, title: 'PHASE COMPLETE', rows: [
      { label: 'OBJECTIVE', value: 'POWER RESTORED', state: 'ok' }, { label: 'SOLAR GRID', value: d.name, state: 'ok' },
      { label: 'DAYS REMAINING', value: `${s.remaining_days}/${s.total_days}`, state: 'info' }, { label: 'BATTERY', value: `${s.battery_current}/${s.battery_capacity} kWh`, state: 'ok' }
    ], footer: 'Mission 1 ends here. The next mission is not part of this build.' });
    this.add.existing(card);
    this.add.existing(Button(this, { x: Math.round((W - 260) / 2), y: Math.min(H - 70, 74 + card.h + 24), w: 260, h: 44, label: 'GO TO SLEEP POD', fs: 14, onClick: () => missionStore.goToSleep() }));
  }

  // ---- Gate: Mission 2 not implemented
  complete() {
    const W = this.w(), H = this.h(); this.cameras.main.setBackgroundColor('#000000');
    this.add.rectangle(0, 0, W, H, 0x000000, 1).setOrigin(0).setInteractive();
    this.add.existing(T(this, W / 2, H * 0.32, 'DAY ENDS. REVO SLEEPS.', { size: SIZE.xl, ox: 0.5 }));
    this.add.existing(T(this, W / 2, H * 0.32 + 44, 'MISSION 2 IS NOT IMPLEMENTED YET', { size: SIZE.lg, color: css(C.warning), ox: 0.5, wrap: W - 24, align: 'center' }));
    this.add.existing(Button(this, { x: Math.round((W - 240) / 2), y: H * 0.55, w: 240, h: 44, label: 'RETURN TO BASE', onClick: () => closeOverlay(this) }));
  }
}
