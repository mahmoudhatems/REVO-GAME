import * as Phaser from 'phaser';
import { COLORS as C, css } from '../ui/tokens.js';
import { ICON } from '../ui/assetKeys.js';
import { T, Panel, Button, Tabs } from '../ui/components/core.js';
import { LogbookEntry } from '../ui/components/cards.js';
import { closeOverlay } from '../ui/overlayManager.js';
import { missionStore } from '../mission/domain/missionStore.js';

export const LOGBOOK_SECTIONS = [
  { id: 'mission_history', label: 'MISSION HISTORY', filter: (e) => e.type === 'mission_history' },
  { id: 'daily_report', label: 'DAILY REPORTS', filter: (e) => e.type === 'daily_report' },
  { id: 'resource_change', label: 'RESOURCES', filter: (e) => e.type === 'resource_change' },
  { id: 'discovery', label: 'DISCOVERIES', filter: (e) => e.type === 'discovery' },
  { id: 'neil_note', label: 'N.E.I.L. NOTES', filter: (e) => e.type === 'neil_note' },
  { id: 'nasa_fact', label: 'NASA FACTS', filter: (e) => e.type === 'nasa_fact' },
  { id: 'objective', label: 'OBJECTIVES', filter: (e) => e.type === 'objective' }
];

export class LogbookScene extends Phaser.Scene {
  constructor() { super('Logbook'); }

  init(data) { this.returnToPause = !!data?.returnToPause; this.section = 'mission_history'; this.offset = 0; }

  create() {
    this.esc = () => this.close(); this.input.keyboard.on('keydown-ESC', this.esc);
    this.wheel = (p, o, dx, dy) => { this.offset = Math.max(0, this.offset + Math.sign(dy)); this.build(); };
    this.input.on('wheel', this.wheel);
    this.scale.on('resize', this.build, this);
    this.events.once('shutdown', () => { this.scale.off('resize', this.build, this); this.input.keyboard.off('keydown-ESC', this.esc); this.input.off('wheel', this.wheel); });
    this.build();
    this.timer = this.time.delayedCall(1500, () => missionStore.markAllRead());
  }

  close() { missionStore.markAllRead(); closeOverlay(this, { returnToPause: this.returnToPause }); }

  build() {
    this.children.removeAll(true);
    const W = this.scale.width, H = this.scale.height; const m = W < 600 ? 4 : 12;
    this.add.rectangle(0, 0, W, H, 0x070b14, 0.96).setOrigin(0).setInteractive();
    const p = Panel(this, { x: m, y: m, w: W - 2 * m, h: H - 2 * m, title: 'CAPTAIN\'S LOGBOOK', accent: C.orange, icon: ICON.logbook });
    p.add(Button(this, { x: W - 2 * m - 104, y: 2, w: 96, h: 26, label: 'CLOSE', variant: 'secondary', fs: 11, back: true, onClick: () => this.close() }));
    const tabs = Tabs(this, { x: 0, y: 0, w: p.innerW, tabs: LOGBOOK_SECTIONS.map((s) => ({ id: s.id, label: s.label })), active: this.section, fs: 10, h: 26, onChange: (id) => { this.section = id; this.offset = 0; this.build(); } });
    p.content.add(tabs);
    const y0 = tabs.heightUsed + 10; const areaH = p.innerH - y0;
    const sec = LOGBOOK_SECTIONS.find((s) => s.id === this.section);
    const entries = missionStore.getState().logbook.filter(sec.filter).slice().reverse();
    if (!entries.length) {
      p.content.add(T(this, 0, y0 + 6, 'NOTHING HERE YET.\nEntries appear as you play: deploy solar panels, inspect equipment, learn facts.', { size: 12, color: css(C.muted), wrap: p.innerW, bold: false }));
      return;
    }
    const ew = Math.min(p.innerW, 720); let y = y0; let shown = 0; this.offset = Math.min(this.offset, entries.length - 1);
    for (let i = this.offset; i < entries.length; i++) {
      const le = LogbookEntry(this, { x: 0, y, w: ew, entry: entries[i] });
      if (y + le.h > y0 + areaH - 22 && shown > 0) { le.destroy(true); break; }
      p.content.add(le); y += le.h + 8; shown++;
    }
    p.content.add(T(this, 0, p.innerH - 14, `${entries.length} ENTRIES  -  ${this.offset + 1}-${this.offset + shown} SHOWN`, { size: 9, color: css(C.muted) }));
    p.content.add(Button(this, { x: ew + 10 > p.innerW - 140 ? p.innerW - 140 : ew + 10, y: p.innerH - 30, w: 64, h: 26, label: 'UP', fs: 10, variant: 'secondary', disabled: this.offset === 0, onClick: () => { this.offset = Math.max(0, this.offset - 1); this.build(); } }));
    p.content.add(Button(this, { x: (ew + 10 > p.innerW - 140 ? p.innerW - 140 : ew + 10) + 70, y: p.innerH - 30, w: 64, h: 26, label: 'DOWN', fs: 10, variant: 'secondary', disabled: this.offset + shown >= entries.length, onClick: () => { this.offset++; this.build(); } }));
  }
}
