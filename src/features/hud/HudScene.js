import * as Phaser from 'phaser';
import { COLORS as C, SIZE, css } from '../ui/tokens.js';
import { ICON } from '../ui/assetKeys.js';
import { T, Panel, Button, ResourceMeter } from '../ui/components/core.js';
import { NotificationCenter, InteractionPrompt } from '../ui/components/overlays.js';
import { openOverlay } from '../ui/overlayManager.js';
import { missionStore } from '../mission/domain/missionStore.js';
import { MISSION_1 } from '../mission/domain/missionConfig.js';
import { resourceViews } from '../mission/domain/resources.js';
import { ROOM_TO_STATION, STATIONS } from '../stations/stationData.js';

// Global HUD: always visible over the game world; hides while a full-screen overlay or the pause menu is open.
export class HudScene extends Phaser.Scene {
  constructor() { super('Hud'); }

  create() {
    this.detail = null; this.lastBarsKey = '';
    this.root = this.add.container(0, 0);
    this.notes = new NotificationCenter(this, () => this.barH + 10);
    this.prompt = InteractionPrompt(this);
    this.roomText = T(this, 12, 0, '', { size: 12 }).setBackgroundColor('#000000aa').setPadding(8, 4, 8, 4);
    this.unsubEv = missionStore.onEvent((ev) => { if (ev.type === 'notification') this.notes.push(ev); });
    this.unsubSt = missionStore.subscribe(() => this.refresh(true));
    this.scale.on('resize', this.build, this);
    this.events.once('shutdown', () => { this.unsubEv(); this.unsubSt(); this.scale.off('resize', this.build, this); });
    this.build();
  }

  build() {
    this.root.removeAll(true);
    this.detail = null;
    const w = this.scale.width; const compact = w < 760;
    this.compact = compact;
    const s = missionStore.getState(); const v = resourceViews(s);
    this.barH = compact ? 98 : 58;
    const bar = Panel(this, { x: 4, y: 4, w: w - 8, h: this.barH - 4, accent: C.orange });
    this.root.add(bar);
    this.bar = bar;

    // mission + countdown
    this.mission = T(this, 14, 8, compact ? '' : `MISSION 1: ${MISSION_1.title.toUpperCase()}`, { size: 10, color: css(C.orange) });
    this.objective = T(this, 14, 22, compact ? '' : MISSION_1.objective, { size: 9, color: css(C.muted) });
    this.dayText = T(this, 14, compact ? 14 : 34, 'MISSION LENGTH', { size: SIZE.sm });
    this.remText = T(this, 14 + 90, compact ? 14 : 34, 'PENDING APPROVAL', { size: SIZE.sm, color: css(C.warning) });
    bar.add([this.mission, this.objective, this.dayText, this.remText]);

    // resource meters
    this.meters = {};
    const ids = ['battery', 'oxygen', 'food'];
    const mx0 = compact ? 14 : 250; const my = compact ? 52 : 8; let mx = mx0;
    const segW = w < 480 ? 3 : compact ? 5 : 7;
    ids.forEach((id) => {
      const m = ResourceMeter(this, { x: mx, y: my, view: v[id], segW, segH: 12, onClick: (rid) => this.toggleDetail(rid) });
      this.meters[id] = m; bar.add(m); mx += m.w + (compact ? 6 : 18);
      if (id === 'battery' && v.battery.drain) {
        bar.add(T(this, mx - (compact ? 6 : 18) - 2, my + 28, '-1', { size: 11, color: css(C.warning), ox: 1 }));
      }
    });

    // buttons
    const bw = compact ? 74 : 88; const lw = compact ? 46 : 82; const pw = compact ? 34 : 40; const bh = 30; const by = compact ? 8 : 13;
    let bx = w - 8 - 12 - pw; const btns = [];
    const pause = Button(this, { x: bx, y: by, w: pw, h: bh, label: 'II', fs: 14, variant: 'secondary', onClick: () => this.pause() });
    btns.push(pause); bx -= bw + 8;
    const st = Button(this, { x: bx, y: by, w: bw, h: bh, label: 'STATIONS', fs: 10, onClick: () => this.openStation(this.lastStation || 'habitat') });
    btns.push(st); bx -= (compact ? 38 : 72) + 8;
    const mission = Button(this, { x: bx, y: by, w: compact ? 38 : 72, h: bh, label: compact ? 'M1' : 'MISSION', fs: 9, variant: 'secondary', onClick: () => openOverlay(this, 'MissionFlow') });
    btns.push(mission); bx -= lw + 8;
    const lg = Button(this, { x: bx, y: by, w: lw, h: bh, label: compact ? 'LOG' : 'LOGBOOK', fs: 10, variant: 'secondary', onClick: () => openOverlay(this, 'Logbook') });
    btns.push(lg);
    bar.add(btns);
    this.unread = T(this, lg.x + lw - 6, by - 6, '0', { size: 10, color: css(C.white), ox: 1 }).setBackgroundColor(css(C.danger)).setPadding(4, 1, 4, 1);
    bar.add(this.unread);
    this.refresh(false);
  }

  refresh(animate) {
    if (!this.meters) return;
    const s = missionStore.getState(); const v = resourceViews(s);
    Object.entries(this.meters).forEach(([id, m]) => m.update?.(v[id], animate));
    const n = missionStore.unreadCount();
    this.unread?.setVisible(n > 0).setText(String(n));
    this.dayText?.setText('MISSION LENGTH');
    this.remText?.setText('PENDING APPROVAL').setColor(css(C.warning));
    if (this.detail) this.showDetail(this.detailId);
  }

  toggleDetail(id) {
    if (this.detail && this.detailId === id) { this.detail.destroy(true); this.detail = null; return; }
    this.showDetail(id);
  }

  showDetail(id) {
    this.detail?.destroy(true);
    const v = resourceViews(missionStore.getState())[id]; this.detailId = id;
    const w = Math.min(340, this.scale.width - 16);
    const p = Panel(this, { x: 8, y: this.barH + 4, w, h: 190, title: `${v.label} DETAILS`, accent: C.cyan, icon: ICON.info });
    let y = 0; const cw = p.innerW;
    const rows = [['STATUS', v.status === 'nodata' ? 'NO DATA' : v.status.toUpperCase()], ['VALUE', v.valueText]];
    if (v.production) rows.push(['PRODUCTION', v.production]);
    if (v.consumption) rows.push(['CONSUMPTION', v.consumption]);
    rows.forEach(([a, b]) => { p.content.add(T(this, 0, y, a, { size: 10, color: css(C.muted) })); p.content.add(T(this, 100, y, b, { size: 11, wrap: cw - 100 })); y += 20; });
    const note = v.status === 'nodata' ? 'No approved value exists for this resource in Mission 1, so nothing is shown.'
      : v.drain ? 'The "-1" is a visual drain indicator. Its exact conversion is not defined yet.' : 'Values come from the mission state.';
    const nt = T(this, 0, y + 4, note, { size: 10, color: css(C.muted), wrap: cw, bold: false }); p.content.add(nt);
    p.content.add(Button(this, { x: 0, y: p.innerH - 30, w: 130, h: 28, label: 'OPEN STATION', fs: 10, onClick: () => { this.openStation(v.station); } }));
    p.content.add(Button(this, { x: 138, y: p.innerH - 30, w: 80, h: 28, label: 'CLOSE', fs: 10, variant: 'secondary', back: true, onClick: () => { this.detail?.destroy(true); this.detail = null; } }));
    this.detail = p;
  }

  openStation(id) { this.detail?.destroy(true); this.detail = null; openOverlay(this, 'Station', { stationId: id }); }

  pause() {
    if (this.registry.get('overlay')) return;
    const mgr = this.scene.manager;
    const targetScene = mgr.isActive('Interior') ? 'Interior' : 'Game';
    if (!mgr.isActive(targetScene) || mgr.isPaused(targetScene)) return;
    mgr.pause(targetScene); this.scene.launch('Pause', { targetScene }); this.scene.bringToTop('Pause');
  }

  update() {
    const mgr = this.scene.manager;
    const hidden = !!this.registry.get('overlay') || mgr.isActive('Pause');
    this.root.setVisible(!hidden);
    const interior = mgr.getScene('Interior');
    const game = interior?.sys.isActive() ? interior : mgr.getScene('Game');
    let show = false;
    if (!hidden && game?.getCurrentRoom && game.player) {
      const room = game.getCurrentRoom();
      const sid = room && ROOM_TO_STATION[room.id];
      if (sid) { this.lastStation = sid; this.promptStation = sid; if (this.promptFor !== sid) { this.prompt.setPrompt('E', `OPEN ${STATIONS[sid].name}`, STATIONS[sid].accent); this.promptFor = sid; } show = true; }
      else this.promptFor = null;
    }
    this.prompt.setVisible(show);
    const rm = !hidden && game?.getCurrentRoom && game.player ? game.getCurrentRoom() : null;
    this.roomText.setVisible(!hidden).setText(rm ? rm.name : 'CORRIDOR').setPosition(12, this.scale.height - 34);
    if (show) this.prompt.setPosition(Math.round((this.scale.width - this.prompt.w) / 2), this.scale.height - (this.prompt.h + (this.sys.game.device.os.desktop ? 24 : 120)));
    if (hidden && this.detail) { this.detail.destroy(true); this.detail = null; }
  }
}
