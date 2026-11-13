import * as Phaser from 'phaser';
import { COLORS as C, SIZE, css, DEPTH } from '../ui/tokens.js';
import { ICON } from '../ui/assetKeys.js';
import { T, Panel, Button, Tabs, DataReadout, StatusBadge, SectionHeader } from '../ui/components/core.js';
import { EquipmentCard, EquipmentDetailPanel, addSprite } from '../ui/components/cards.js';
import { closeOverlay, openOverlay } from '../ui/overlayManager.js';
import { missionStore } from '../mission/domain/missionStore.js';
import { stationGuidance } from '../neil/neilDialogue.js';
import { STATIONS, STATION_ORDER, stationReadouts, equipmentInfo, inspectTitle } from './stationData.js';

const SEV = { info: C.cyan, success: C.success, warning: C.warning, critical: C.danger };

export class StationScene extends Phaser.Scene {
  constructor() { super('Station'); }

  init(data) { this.stationId = STATIONS[data?.stationId] ? data.stationId : 'habitat'; this.section = 'overview'; this.page = 0; this.selected = null; }

  create() {
    this.keyHandler = () => this.close();
    this.input.keyboard.on('keydown-ESC', this.keyHandler);
    this.unsub = missionStore.subscribe(() => { if (this.sys.isActive()) this.build(); });
    this.scale.on('resize', this.build, this);
    this.events.once('shutdown', () => {
      this.unsub?.(); this.scale.off('resize', this.build, this); this.input.keyboard.off('keydown-ESC', this.keyHandler);
    });
    this.build();
  }

  close() { closeOverlay(this); }

  go(id) { this.stationId = id; this.section = 'overview'; this.page = 0; this.selected = null; this.build(); }

  build() {
    this.children.removeAll(true);
    const sw = this.scale.width, sh = this.scale.height;
    const st = STATIONS[this.stationId]; const s = missionStore.getState();
    this.add.rectangle(0, 0, sw, sh, 0x070b14, 0.96).setOrigin(0).setInteractive();
    const m = sw < 600 ? 4 : 12;
    const W = sw - m * 2, H = sh - m * 2;
    const main = Panel(this, { x: m, y: m, w: W, h: H, title: `${st.name}  //  ALPHA BASE`, accent: st.accent, icon: ICON.tools });
    const ix = main.innerW, iy = main.innerH;
    const close = Button(this, { x: W - 104, y: 2, w: 96, h: 26, label: 'CLOSE', variant: 'secondary', fs: 11, back: true, onClick: () => this.close() });
    main.add(close);

    // station navigation (all seven stations)
    const nav = Tabs(this, { x: 0, y: 0, w: ix, tabs: STATION_ORDER.map((id) => ({ id, label: STATIONS[id].name.split(' ')[0] === 'MAIN' ? 'HABITAT' : STATIONS[id].name.replace(' & ', '/').split(' ')[0] })), active: this.stationId, fs: 10, h: 26, onChange: (id) => this.go(id) });
    main.content.add(nav);
    let y = nav.heightUsed + 8;
    const sections = Tabs(this, { x: 0, y, w: ix, tabs: [{ id: 'overview', label: 'OVERVIEW' }, { id: 'equipment', label: 'EQUIPMENT' }, { id: 'learn', label: 'LEARN' }], active: this.section, fs: 11, h: 26, onChange: (id) => { this.section = id; this.page = 0; this.selected = null; this.build(); } });
    main.content.add(sections);
    y += sections.heightUsed + 8;

    // N.E.I.L. strip (bottom)
    const g = stationGuidance(this.stationId, s);
    const narrow = ix < 560; const actW = g.action ? (narrow ? Math.min(220, ix - 70) : 150) : 0;
    const probe = T(this, 0, 0, g.text, { size: 11, wrap: narrow ? ix - 70 : ix - 58 - actW - 16, bold: false, lineSpacing: 1 }); const th = probe.height; probe.destroy();
    const stripH = Math.max(62, 24 + th + (narrow && g.action ? 40 : 10));
    const strip = this.add.container(0, iy - stripH);
    const sg = this.add.graphics(); sg.fillStyle(C.dgray, 1); sg.fillRect(0, 0, ix, stripH); sg.fillStyle(C.space, 1); sg.fillRect(2, 2, ix - 4, stripH - 4); sg.fillStyle(SEV[g.severity] ?? C.cyan, 1); sg.fillRect(2, 2, 4, stripH - 4);
    strip.add(sg);
    const av = this.add.image(32, 32, g.severity === 'critical' || g.severity === 'warning' ? ICON.neilAlert : ICON.neil);
    strip.add(av);
    strip.add(T(this, 58, 6, 'N.E.I.L.', { size: 9, color: css(C.muted) }));
    strip.add(T(this, 58, 18, g.text, { size: 11, wrap: narrow ? ix - 70 : ix - 58 - actW - 16, bold: false, lineSpacing: 1 }));
    if (g.action) strip.add(Button(this, { x: narrow ? 58 : ix - actW - 6, y: narrow ? stripH - 38 : (stripH - 32) / 2, w: actW, h: 32, label: g.action.label, fs: 10, onClick: () => this.runAction(g.action) }));
    main.content.add(strip);

    const areaH = iy - y - stripH - 8;
    const area = this.add.container(0, y); main.content.add(area);
    if (this.section === 'overview') this.drawOverview(area, st, s, ix, areaH);
    else if (this.section === 'equipment') this.drawEquipment(area, st, s, ix, areaH);
    else this.drawLearn(area, st, ix, areaH);
  }

  runAction(a) {
    if (a.station) return this.go(a.station);
    if (a.mission) openOverlay(this, 'MissionFlow');
  }

  drawOverview(area, st, s, w, h) {
    const left = Math.min(260, Math.floor(w * 0.4));
    if (st.atlas || st.hero) {
      const bg = this.add.graphics(); bg.fillStyle(C.space, 1); bg.fillRect(0, 0, left, Math.min(h, 200)); area.add(bg);
      const ref = st.atlas ? { atlas: st.atlas, frame: 'exterior_building' } : st.hero;
      area.add(addSprite(this, ref, left / 2, Math.min(h, 200) / 2, left - 16, Math.min(h, 200) - 16));
    }
    area.add(T(this, 0, Math.min(h, 200) + 8, st.blurb, { size: 11, wrap: left, bold: false }));
    const rx = left + 16, rw = w - rx;
    area.add(SectionHeader(this, { x: rx, y: 0, w: rw, label: 'LIVE READOUTS' }));
    const cols = rw >= 420 ? 2 : 1; const cw = Math.floor((rw - (cols - 1) * 10) / cols);
    stationReadouts(this.stationId, s).forEach((r, i) => {
      const cx = rx + (i % cols) * (cw + 10), cy = 26 + Math.floor(i / cols) * 58;
      if (cy + 54 <= h) area.add(DataReadout(this, { x: cx, y: cy, w: cw, label: r.label, value: r.value, state: r.state, note: r.note || '' }));
    });
  }

  drawEquipment(area, st, s, w, h) {
    const items = st.equipment; const detailW = w >= 780 ? 270 : 0; const gw = w - detailW - (detailW ? 12 : 0);
    const cw = 116, ch = 112; const cols = Math.max(1, Math.floor((gw + 8) / (cw + 8)));
    const rows = Math.max(1, Math.floor((h - 40 + 8) / (ch + 8))); const per = cols * rows; const pages = Math.max(1, Math.ceil(items.length / per));
    this.page = Math.min(this.page, pages - 1);
    const insp = (it) => s.logbook.some((e) => e.type === 'discovery' && e.title === inspectTitle(it));
    items.slice(this.page * per, this.page * per + per).forEach((it, i) => {
      const c = EquipmentCard(this, { x: (i % cols) * (cw + 8), y: Math.floor(i / cols) * (ch + 8), w: cw, h: ch, item: it, selected: this.selected?.id === it.id, onClick: (x) => { this.selected = x; this.build(); } });
      area.add(c);
    });
    const by = h - 30;
    area.add(Button(this, { x: 0, y: by, w: 80, h: 28, label: '< PREV', variant: 'secondary', fs: 10, disabled: this.page === 0, onClick: () => { this.page--; this.build(); } }));
    area.add(T(this, 100, by + 14, `PAGE ${this.page + 1}/${pages}  -  ${items.length} ITEMS`, { size: 10, color: css(C.muted), oy: 0.5 }));
    area.add(Button(this, { x: Math.min(gw - 80, 280), y: by, w: 80, h: 28, label: 'NEXT >', variant: 'secondary', fs: 10, disabled: this.page >= pages - 1, onClick: () => { this.page++; this.build(); } }));
    const showDetail = (it) => {
      const dp = EquipmentDetailPanel(this, { x: 0, y: 0, w: detailW || Math.min(300, w - 20), h: Math.min(h, 330), onInspect: (x) => this.inspect(x), onClose: () => { this.selected = null; this.build(); } });
      dp.show(it, it ? equipmentInfo(this.stationId, it, s, insp(it)) : null);
      return dp;
    };
    if (detailW) { const dp = showDetail(this.selected); dp.setPosition(gw + 12, 0); area.add(dp); }
    else if (this.selected) {
      const blocker = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.6).setOrigin(0).setInteractive().setDepth(DEPTH.modal);
      const dp = showDetail(this.selected); dp.setDepth(DEPTH.modal + 1);
      dp.setPosition(Math.round((this.scale.width - dp.w) / 2), Math.round((this.scale.height - dp.h) / 2));
      this.detailLayer = [blocker, dp];
    }
  }

  inspect(it) {
    const added = missionStore.addDiscovery({ title: inspectTitle(it), text: it.desc, station: this.stationId, source: 'GAME SIMULATION', icon: 'info' });
    if (!added) return;
  }

  drawLearn(area, st, w, h) {
    area.add(SectionHeader(this, { x: 0, y: 0, w, label: 'DID YOU KNOW?' }));
    let y = 28;
    st.facts.forEach((f) => {
      const b = StatusBadge(this, { x: 0, y, text: f.source, state: f.source === 'NASA FACT' ? 'success' : f.source === 'GAME SIMULATION' ? 'warning' : 'info' });
      area.add(b);
      const t = T(this, b.w + 10, y, f.text, { size: 12, wrap: w - b.w - 10, bold: false }); area.add(t);
      y += Math.max(t.height, b.h) + 12;
    });
  }
}
