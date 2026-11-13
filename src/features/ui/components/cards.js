import { COLORS as C, STATE_COLOR, SIZE, css } from '../tokens.js';
import { ICON, catKey } from '../assetKeys.js';
import { pixelIcon, hasPixelIcon } from '../pixelIcons.js';
import { T, Panel, Button, StatusBadge, SectionHeader } from './core.js';

// Draws an equipment/asset sprite inside a max box using whole-number scaling where possible.
// ref: { atlas, frame } | { tex } | { placeholder: true }
export function addSprite(scene, ref, cx, cy, maxW, maxH) {
  if (!ref || ref.placeholder) return placeholderSprite(scene, cx, cy, Math.min(maxW, maxH, 48));
  const img = ref.atlas ? scene.add.image(cx, cy, ref.atlas, ref.frame) : scene.add.image(cx, cy, ref.tex);
  const fit = Math.min(maxW / img.width, maxH / img.height);
  img.setScale(fit >= 1 ? Math.floor(fit) : Math.max(0.25, Math.floor(fit * 4) / 4));
  return img;
}

// Clearly-marked temporary art for equipment that has no sprite yet (documented as a missing asset).
export function placeholderSprite(scene, cx, cy, s = 40) {
  const c = scene.add.container(cx, cy); const g = scene.add.graphics();
  g.lineStyle(2, C.warning, 1); g.strokeRect(-s / 2, -s / 2, s, s);
  g.fillStyle(C.warning, 0.12); g.fillRect(-s / 2, -s / 2, s, s);
  c.add([g, T(scene, 0, 0, '?', { size: Math.floor(s * 0.6), color: css(C.warning), ox: 0.5, oy: 0.5 })]);
  c.isPlaceholder = true; c.width = s; c.height = s;
  return c;
}

export function iconFor(scene, name, x, y, px = 2) {
  if (hasPixelIcon(name)) return pixelIcon(scene, name, x, y, px);
  const key = ICON[name];
  const im = scene.add.image(x, y, key).setOrigin(0, 0);
  im.setScale(Math.max(0.5, px / 2));
  return im;
}

// ---------------------------------------------------------------- Equipment
export function EquipmentCard(scene, { x = 0, y = 0, w = 116, h = 112, item, selected = false, onClick = () => {} } = {}) {
  const c = scene.add.container(x, y); const g = scene.add.graphics();
  const hit = scene.add.zone(0, 0, w, h).setOrigin(0, 0).setInteractive({ useHandCursor: true });
  c.add(g);
  const spr = addSprite(scene, item.sprite, w / 2, 40, w - 24, 56);
  const name = T(scene, w / 2, 76, item.name, { size: 10, align: 'center', ox: 0.5, wrap: w - 10, lineSpacing: 0 });
  c.add([spr, name, hit]);
  if (item.sprite?.placeholder) c.add(StatusBadge(scene, { x: 4, y: 3, text: 'PLACEHOLDER', state: 'placeholder', size: 8 }));
  c.itemId = item.id; let sel = selected, hov = false;
  const draw = () => {
    g.clear(); g.fillStyle(C.black, 0.35); g.fillRect(3, 3, w, h);
    g.fillStyle(sel ? C.orange : hov ? C.cyan : C.dgray, 1); g.fillRect(0, 0, w, h);
    g.fillStyle(sel ? 0x2c3550 : C.surface, 1); g.fillRect(3, 3, w - 6, h - 6);
    g.fillStyle(C.space, 0.5); g.fillRect(8, 8, w - 16, 62);
  };
  c.setSelected = (v) => { sel = v; draw(); };
  hit.on('pointerover', () => { hov = true; draw(); }); hit.on('pointerout', () => { hov = false; draw(); });
  hit.on('pointerup', () => onClick(item));
  draw();
  return c;
}

export function EquipmentDetailPanel(scene, { x = 0, y = 0, w = 260, h = 300, onInspect = () => {}, onClose = () => {} } = {}) {
  const p = Panel(scene, { x, y, w, h, title: 'EQUIPMENT DETAILS', accent: C.orange });
  p.show = (item, info) => {
    p.content.removeAll(true);
    const cw = p.innerW; let yy;
    if (!item) {
      p.content.add(T(scene, 0, 4, 'SELECT AN EQUIPMENT CARD\nTO SEE WHAT IT DOES.', { size: SIZE.sm, color: css(C.muted), wrap: cw }));
      return;
    }
    const bgs = scene.add.graphics(); bgs.fillStyle(C.space, 1); bgs.fillRect(0, 0, cw, 84); p.content.add(bgs);
    p.content.add(addSprite(scene, item.sprite, cw / 2, 42, cw - 20, 72));
    yy = 92;
    const nm = T(scene, 0, yy, item.name.toUpperCase(), { size: SIZE.md, color: css(C.orange), wrap: cw }); p.content.add(nm); yy += nm.height + 6;
    const ds = T(scene, 0, yy, item.desc, { size: SIZE.sm, wrap: cw }); p.content.add(ds); yy += ds.height + 8;
    const b = StatusBadge(scene, { x: 0, y: yy, text: info.statusText, state: info.statusState }); p.content.add(b);
    if (item.sprite?.placeholder) p.content.add(StatusBadge(scene, { x: b.w + 6, y: yy, text: 'PLACEHOLDER ART', state: 'placeholder' }));
    yy += b.h + 6;
    if (info.live) { const lv = T(scene, 0, yy, info.live, { size: SIZE.sm, color: css(C.cyan), wrap: cw }); p.content.add(lv); yy += lv.height + 6; }
    const by = Math.max(yy + 4, p.innerH - 40);
    const bw = Math.floor((cw - 8) / 2);
    const ins = Button(scene, { x: 0, y: by, w: bw, h: 34, label: info.inspected ? 'IN LOGBOOK' : 'INSPECT', disabled: info.inspected, fs: 12, onClick: () => onInspect(item) });
    const cl = Button(scene, { x: bw + 8, y: by, w: bw, h: 34, label: 'CLOSE', variant: 'secondary', fs: 12, back: true, onClick: onClose });
    p.content.add([ins, cl]);
  };
  p.show(null);
  return p;
}

// ---------------------------------------------------------------- Decision card (Mission 1)
export function DecisionCard(scene, { x = 0, y = 0, w = 210, h = 330, option, selected = false, disabled = false, onSelect = () => {} } = {}) {
  const c = scene.add.container(x, y); const g = scene.add.graphics();
  const hit = scene.add.zone(0, 0, w, h).setOrigin(0, 0).setInteractive({ useHandCursor: !disabled });
  c.add(g); c.optionId = option.id; let sel = selected, hov = false, dis = disabled;
  const k = Math.max(0.8, Math.min(1.15, w / 210));
  const fs = (n) => Math.round(n * k);
  // illustration: N panels using the original catalog solar sprites
  const ill = scene.add.container(0, 0); c.add(ill);
  const pw = Math.min(46, (w - 20) / option.panels - 4);
  const texKey = option.panels === 1 ? catKey('Tools_Equipment', 13) : catKey('Tools_Equipment', 19);
  const probe = scene.textures.get(texKey).getSourceImage();
  const sc = Math.max(1, Math.floor(Math.min(pw / probe.width * (option.panels === 1 ? 2.2 : 1.9), (h * 0.3) / probe.height, (w - 28) / (option.panels * probe.width))));
  const total = option.panels * probe.width * sc * 0.92;
  for (let i = 0; i < option.panels; i++) {
    const im = scene.add.image(w / 2 - total / 2 + (i + 0.5) * (total / option.panels), h * 0.2, texKey).setScale(sc);
    ill.add(im);
  }
  const nm = T(scene, w / 2, h * 0.37, option.name, { size: fs(14), color: css(C.orange), ox: 0.5 });
  const pl = T(scene, w / 2, h * 0.37 + fs(18), option.panelLabel, { size: fs(11), color: css(C.muted), ox: 0.5 });
  const rows = scene.add.container(0, h * 0.37 + fs(40));
  rows.add(T(scene, 12, 0, `TIME   -${option.days} DAY${option.days > 1 ? 'S' : ''}`, { size: fs(13), color: css(C.warning) }));
  rows.add(T(scene, 12, fs(20), `POWER  +${option.rewardBarsPerDay} BARS/DAY`, { size: fs(13), color: css(C.cyan) }));
  const risk = T(scene, 12, fs(46), option.risk, { size: fs(11), wrap: w - 24, color: css(C.white), bold: false });
  rows.add(risk);
  const btn = Button(scene, { x: 12, y: h - 46, w: w - 24, h: 34, label: sel ? 'SELECTED' : 'SELECT', fs: fs(13), onClick: () => { if (!dis) onSelect(option.id); } });
  btn.hit?.destroy?.();
  const ribbon = StatusBadge(scene, { x: w - 78, y: 6, text: 'SELECTED', state: 'ok', size: 9 }); ribbon.setVisible(sel);
  c.add([nm, pl, rows, btn, ribbon, hit]);
  const draw = () => {
    g.clear(); g.fillStyle(C.black, 0.4); g.fillRect(5, 5, w, h);
    g.fillStyle(sel ? C.orange : hov && !dis ? C.cyan : C.dgray, 1); g.fillRect(0, 0, w, h);
    g.fillStyle(dis ? 0x151d2b : sel ? 0x2b3350 : C.panel, 1); g.fillRect(4, 4, w - 8, h - 8);
    g.fillStyle(C.space, 1); g.fillRect(10, 10, w - 20, h * 0.3);
    g.fillStyle(0x7c2d12, 0.35); g.fillRect(10, 10 + h * 0.3 - 6, w - 20, 6); // dusty ground strip
    btn.setLabel(sel ? 'SELECTED' : dis ? 'NOT ENOUGH DAYS' : 'SELECT');
    btn.setBtnState(dis ? 'disabled' : sel ? 'selected' : 'default');
    ribbon.setVisible(sel);
    c.setAlpha(dis ? 0.6 : 1);
  };
  c.setSelected = (v) => { sel = v; draw(); };
  c.setDisabled = (v) => { dis = v; draw(); };
  hit.on('pointerover', () => { hov = true; draw(); }); hit.on('pointerout', () => { hov = false; draw(); });
  hit.on('pointerup', () => { if (!dis) onSelect(option.id); });
  draw();
  c.w = w; c.h = h;
  return c;
}

// ---------------------------------------------------------------- Objective / result cards
export function MissionObjectiveCard(scene, { x = 0, y = 0, w = 280, objective, done = false, label = 'OBJECTIVE' } = {}) {
  const p = Panel(scene, { x, y, w, h: 58, accent: done ? C.success : C.orange });
  p.add(pixelIcon(scene, 'star', 12, 14, 2));
  p.add(T(scene, 46, 9, label + (done ? ' COMPLETE' : ''), { size: 10, color: css(done ? C.success : C.muted) }));
  p.add(T(scene, 46, 26, objective, { size: SIZE.sm, color: css(C.white), wrap: w - 56 }));
  return p;
}

export function MissionResultCard(scene, { x = 0, y = 0, w = 380, title, rows = [], accent = C.success, footer = null } = {}) {
  const rh = 26; const h = 62 + rows.length * rh + (footer ? 44 : 0) + 16;
  const p = Panel(scene, { x, y, w, h, accent });
  p.add(T(scene, w / 2, 14, title, { size: SIZE.xl - 4, color: css(accent), ox: 0.5 }));
  rows.forEach((r, i) => {
    const yy = 56 + i * rh;
    const g = scene.add.graphics(); g.fillStyle(i % 2 ? C.panel : C.space, 1); g.fillRect(12, yy, w - 24, rh - 2); p.add(g);
    p.add(T(scene, 20, yy + 5, r.label, { size: SIZE.sm, color: css(C.muted) }));
    p.add(T(scene, w - 20, yy + 5, r.value, { size: SIZE.sm, color: css(STATE_COLOR[r.state] ?? C.white), ox: 1 }));
  });
  if (footer) p.add(T(scene, w / 2, h - 44, footer, { size: 10, color: css(C.muted), ox: 0.5, wrap: w - 30, align: 'center' }));
  p.h = h;
  return p;
}

// ---------------------------------------------------------------- Logbook entry
const SRC_STATE = { 'NASA FACT': 'nasa', 'REVO MISSION EVENT': 'fiction', 'GAME SIMULATION': 'sim' };
export function LogbookEntry(scene, { x = 0, y = 0, w = 420, entry } = {}) {
  const c = scene.add.container(x, y); const g = scene.add.graphics(); c.add(g);
  const ic = iconFor(scene, { solar: 'solar', clock: 'clock', battery: 'battery', check: 'success', neil: 'neil', info: 'info' }[entry.icon] || 'info', 12, 12, 2);
  const sol = T(scene, 54, 8, `SOL ${entry.sol}`, { size: 10, color: css(C.muted) });
  const title = T(scene, 54, 22, entry.title, { size: SIZE.sm + 1, color: css(C.orange), wrap: w - 66 });
  const text = T(scene, 54, 22 + title.height + 4, entry.text, { size: SIZE.sm, wrap: w - 66, bold: false });
  let yy = 22 + title.height + 4 + text.height + 6;
  c.add([ic, sol, title, text]);
  if (entry.reference) { const ref = T(scene, 54, yy, 'SOURCE: ' + entry.reference, { size: 9, color: css(C.muted), wrap: w - 66, bold: false }); c.add(ref); yy += ref.height + 4; }
  const b1 = StatusBadge(scene, { x: 54, y: yy, text: entry.source, state: SRC_STATE[entry.source] || 'info', size: 9 });
  c.add(b1);
  if (entry.station) c.add(StatusBadge(scene, { x: 54 + b1.w + 6, y: yy, text: entry.station.toUpperCase(), state: 'nodata', size: 9 }));
  const h = yy + 30;
  g.fillStyle(C.black, 0.3); g.fillRect(3, 3, w, h);
  g.fillStyle(entry.unread ? C.orange : C.dgray, 1); g.fillRect(0, 0, w, h);
  g.fillStyle(C.panel, 1); g.fillRect(3, 3, w - 6, h - 6);
  if (entry.unread) c.add(StatusBadge(scene, { x: w - 58, y: 6, text: 'NEW', state: 'warning', size: 9 }));
  c.w = w; c.h = h;
  return c;
}

export { SectionHeader };
