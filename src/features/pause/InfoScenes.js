import * as Phaser from 'phaser';
import { COLORS as C, css } from '../ui/tokens.js';
import { ICON } from '../ui/assetKeys.js';
import { T, Panel, Button } from '../ui/components/core.js';
import { MissionObjectiveCard } from '../ui/components/cards.js';
import { closeOverlay } from '../ui/overlayManager.js';
import { missionStore } from '../mission/domain/missionStore.js';
import { MISSION_1 } from '../mission/domain/missionConfig.js';

class InfoBase extends Phaser.Scene {
  init(data) { this.returnToPause = !!data?.returnToPause; }
  create() {
    this.esc = () => closeOverlay(this, { returnToPause: this.returnToPause }); this.input.keyboard.on('keydown-ESC', this.esc);
    this.scale.on('resize', this.build, this);
    this.events.once('shutdown', () => { this.scale.off('resize', this.build, this); this.input.keyboard.off('keydown-ESC', this.esc); });
    this.build();
  }
  frame(title, icon) {
    this.children.removeAll(true);
    const W = this.scale.width, H = this.scale.height; const w = Math.min(640, W - 16), h = Math.min(H - 16, 460);
    this.add.rectangle(0, 0, W, H, 0x000000, 0.85).setOrigin(0).setInteractive();
    const p = Panel(this, { x: Math.round((W - w) / 2), y: Math.round((H - h) / 2), w, h, title, accent: C.cyan, icon });
    p.content.add(Button(this, { x: 0, y: p.innerH - 34, w: 120, h: 32, label: 'BACK', variant: 'secondary', back: true, fs: 12, onClick: () => this.esc() }));
    return p;
  }
}

export class ObjectivesScene extends InfoBase {
  constructor() { super('Objectives'); }
  build() {
    const p = this.frame('OBJECTIVES', ICON.star); const s = missionStore.getState();
    p.content.add(T(this, 0, 0, `MISSION 1: ${MISSION_1.title.toUpperCase()}`, { size: 12, color: css(C.orange) }));
    s.objectives.forEach((o, i) => p.content.add(MissionObjectiveCard(this, { x: 0, y: 24 + i * 66, w: p.innerW, objective: o.label, done: o.done })));
    p.content.add(T(this, 0, 24 + s.objectives.length * 66 + 6, `DAYS LEFT: ${s.remaining_days}/${s.total_days}\nBattery: ${s.battery_current}/${s.battery_capacity} kWh`, { size: 12, color: css(C.muted), bold: false }));
  }
}

export class ControlsScene extends InfoBase {
  constructor() { super('Controls'); }
  build() {
    const p = this.frame('CONTROLS', ICON.info);
    const rows = [['W A S D / ARROWS', 'Move'], ['E', 'Interact / open a station'], ['ESC or P', 'Pause menu / close a screen'], ['MOUSE / TOUCH', 'Press buttons and cards'], ['STATIONS BUTTON', 'Open any station dashboard']];
    rows.forEach(([k, v], i) => { p.content.add(T(this, 0, i * 30, k, { size: 12, color: css(C.orange) })); p.content.add(T(this, Math.min(220, p.innerW * 0.5), i * 30, v, { size: 12, bold: false, wrap: p.innerW * 0.5 - 6 })); });
  }
}
