// Core reusable UI components for REVO (Phaser 4). Every component is a function that returns a Container.
// Layout convention: containers are positioned by their TOP-LEFT corner; interactive areas use child Zones.
import * as Phaser from 'phaser';
import { COLORS as C, STATE_COLOR, FONT, SIZE, DEPTH, css } from '../tokens.js';
import { pixelIcon, iconSize, hasPixelIcon } from '../pixelIcons.js';
import { AudioFX } from '../../../utils/audio.js';

export function T(scene, x, y, str, o = {}) {
  const t = scene.add.text(x, y, str, {
    fontFamily: o.font || FONT.body, fontSize: (o.size || SIZE.md) + 'px', color: o.color || css(C.white),
    fontStyle: o.bold === false ? 'normal' : 'bold', align: o.align || 'left',
    wordWrap: o.wrap ? { width: o.wrap, useAdvancedWrap: false } : undefined, lineSpacing: o.lineSpacing ?? 3
  });
  t.setOrigin(o.ox ?? 0, o.oy ?? 0);
  return t;
}

function zone(scene, w, h, cursor = true) {
  return scene.add.zone(0, 0, w, h).setOrigin(0, 0).setInteractive({ useHandCursor: cursor });
}

// ---------------------------------------------------------------- Panel
export function drawPanelBg(g, w, h, { accent = C.cyan, fill = C.panel, shadow = true } = {}) {
  g.clear();
  if (shadow) { g.fillStyle(C.black, 0.4); g.fillRect(4, 4, w, h); }
  g.fillStyle(C.dgray, 1); g.fillRect(0, 0, w, h);
  g.fillStyle(fill, 1); g.fillRect(3, 3, w - 6, h - 6);
  g.fillStyle(C.white, 0.05); g.fillRect(3, 3, w - 6, 2);
  g.fillStyle(accent, 1);
  for (const [cx, cy, sx, sy] of [[0, 0, 1, 1], [w, 0, -1, 1], [0, h, 1, -1], [w, h, -1, -1]]) {
    g.fillRect(cx + (sx > 0 ? 0 : -10), cy + (sy > 0 ? 0 : -3), 10, 3);
    g.fillRect(cx + (sx > 0 ? 0 : -3), cy + (sy > 0 ? 0 : -10), 3, 10);
  }
}

// PanelHeader is built into Panel (title bar with accent notch and optional right slot).
export function Panel(scene, { x = 0, y = 0, w = 300, h = 200, title = null, accent = C.cyan, fill = C.panel, icon = null, shadow = true } = {}) {
  const c = scene.add.container(x, y);
  const g = scene.add.graphics();
  drawPanelBg(g, w, h, { accent, fill, shadow });
  c.add(g);
  c.w = w; c.h = h; c.accent = accent; c.headerH = 0;
  if (title) {
    c.headerH = 30;
    const hg = scene.add.graphics();
    hg.fillStyle(C.space, 0.9); hg.fillRect(3, 3, w - 6, 27);
    hg.fillStyle(accent, 1); hg.fillRect(3, 3, 5, 27);
    c.add(hg);
    let tx = 16;
    if (icon) { const im = scene.add.image(18, 17, icon).setScale(0.5); im.texture.setFilter?.(Phaser.Textures.FilterMode.NEAREST); c.add(im); tx = 34; }
    c.titleText = T(scene, tx, 8, title, { size: SIZE.sm + 1, color: css(C.white) });
    c.add(c.titleText);
  }
  c.content = scene.add.container(10, c.headerH + 10);
  c.add(c.content);
  c.innerW = w - 20; c.innerH = h - c.headerH - 20;
  return c;
}

export function SectionHeader(scene, { x = 0, y = 0, w = 200, label, color = C.cyan }) {
  const c = scene.add.container(x, y);
  const t = T(scene, 0, 0, label.toUpperCase(), { size: SIZE.sm, color: css(color) });
  const g = scene.add.graphics();
  g.fillStyle(color, 0.5); g.fillRect(t.width + 8, 7, Math.max(0, w - t.width - 8), 2);
  c.add([g, t]);
  return c;
}

// ---------------------------------------------------------------- Buttons
const BTN = {
  action: { bg: C.orange, hi: C.orangeHi, lo: C.orangeLo, text: C.space, border: C.dgray },
  secondary: { bg: C.surface, hi: 0x34506f, lo: C.panel, text: C.white, border: C.cyan },
  danger: { bg: C.danger, hi: 0xff8585, lo: 0xa13a3a, text: C.white, border: C.dgray }
};

export function Button(scene, { x = 0, y = 0, w = 160, h = 40, label = '', onClick = () => {}, variant = 'action', disabled = false, fs, back = false } = {}) {
  const c = scene.add.container(x, y);
  const g = scene.add.graphics();
  const size = fs || Math.max(11, Math.min(18, Math.floor(h * 0.4)));
  const t = T(scene, w / 2, h / 2, label, { size, align: 'center', ox: 0.5, oy: 0.5 });
  const hit = zone(scene, w, h);
  c.add([g, t, hit]);
  c.w = w; c.h = h; c.btnState = disabled ? 'disabled' : 'default'; c.variant = variant;
  const draw = () => {
    const p = BTN[c.variant]; const s = c.btnState;
    g.clear();
    const off = s === 'active' ? 2 : 0;
    if (s !== 'disabled') { g.fillStyle(C.black, 0.45); g.fillRect(4, 4, w, h); }
    const bg = s === 'disabled' ? 0x2a3342 : s === 'hover' ? p.hi : s === 'active' ? p.lo : s === 'selected' ? p.hi : p.bg;
    g.fillStyle(p.border, 1); g.fillRect(off, off, w, h);
    g.fillStyle(bg, 1); g.fillRect(off + 3, off + 3, w - 6, h - 6);
    if (s !== 'disabled') { g.fillStyle(C.white, 0.18); g.fillRect(off + 3, off + 3, w - 6, 3); }
    t.setColor(css(s === 'disabled' ? C.muted : p.text));
    t.setPosition(w / 2 + off, h / 2 + off);
  };
  c.setBtnState = (s) => { c.btnState = s; draw(); };
  c.setDisabled = (d) => c.setBtnState(d ? 'disabled' : 'default');
  c.setSelected = (v) => { if (c.btnState !== 'disabled') c.setBtnState(v ? 'selected' : 'default'); };
  c.setLabel = (l) => t.setText(l);
  c.setLoading = (v) => { c.loading = v; t.setText(v ? 'LOADING...' : c._label || label); c.setBtnState(v ? 'disabled' : 'default'); };
  c._label = label;
  c.setLabel = (l) => { c._label = l; t.setText(l); };
  hit.on('pointerover', () => { if (c.btnState === 'default') { c.setBtnState('hover'); AudioFX.hover?.(); } });
  hit.on('pointerout', () => { if (c.btnState === 'hover' || c.btnState === 'active') c.setBtnState('default'); });
  hit.on('pointerdown', () => { if (c.btnState === 'default' || c.btnState === 'hover') c.setBtnState('active'); });
  hit.on('pointerup', () => {
    if (c.btnState === 'disabled') return;
    c.setBtnState('hover'); AudioFX.init?.(); back ? AudioFX.back?.() : AudioFX.click?.(); onClick();
  });
  c.activate = () => { if (c.btnState !== 'disabled') onClick(); };
  draw();
  return c;
}
export const ActionButton = (s, o) => Button(s, { ...o, variant: 'action' });
export const SecondaryButton = (s, o) => Button(s, { ...o, variant: 'secondary' });
export const DangerButton = (s, o) => Button(s, { ...o, variant: 'danger' });

// ---------------------------------------------------------------- Meters
function meterColor(state) { return state === 'critical' ? C.danger : state === 'warning' ? C.warning : C.cyan; }

export function SegmentedMeter(scene, { x = 0, y = 0, segments = 10, segW = 10, segH = 14, gap = 2, value = 0, state = 'ok' } = {}) {
  const c = scene.add.container(x, y);
  const g = scene.add.graphics(); c.add(g);
  c.w = segments * (segW + gap) - gap; c.h = segH;
  c.value = value; c.meterState = state; c.shown = value;
  const draw = () => {
    g.clear();
    const col = meterColor(c.meterState);
    for (let i = 0; i < segments; i++) {
      const sx = i * (segW + gap);
      g.fillStyle(C.dgray, 1); g.fillRect(sx, 0, segW, segH);
      if (c.meterState === 'nodata') { g.fillStyle(C.space, 1); g.fillRect(sx + 2, 2, segW - 4, segH - 4); continue; }
      const on = i < Math.round(c.shown);
      g.fillStyle(on ? col : C.space, 1); g.fillRect(sx + 2, 2, segW - 4, segH - 4);
      if (on) { g.fillStyle(C.white, 0.35); g.fillRect(sx + 2, 2, segW - 4, 3); }
    }
  };
  c.setValue = (v, st = c.meterState, animate = false) => {
    c.meterState = st; const from = c.shown; c.value = v ?? 0;
    if (c._tw) { c._tw.stop(); c._tw = null; }
    if (animate && v != null) {
      c._tw = scene.tweens.addCounter({ from, to: v, duration: 700, onUpdate: (tw) => { c.shown = tw.getValue(); draw(); }, onComplete: () => { c.shown = v; draw(); } });
    } else { c.shown = v ?? 0; draw(); }
  };
  draw();
  return c;
}

export function ProgressBar(scene, { x = 0, y = 0, w = 160, h = 10, value = 0, color = C.cyan } = {}) {
  const c = scene.add.container(x, y); const g = scene.add.graphics(); c.add(g);
  c.w = w; c.h = h;
  c.set = (v, col = color) => {
    g.clear(); g.fillStyle(C.dgray, 1); g.fillRect(0, 0, w, h);
    g.fillStyle(C.space, 1); g.fillRect(2, 2, w - 4, h - 4);
    g.fillStyle(col, 1); g.fillRect(2, 2, Math.floor((w - 4) * Math.max(0, Math.min(1, v)) / 4) * 4, h - 4);
  };
  c.set(value);
  return c;
}

// ---------------------------------------------------------------- Badges, indicators, readouts
export function StatusBadge(scene, { x = 0, y = 0, text = '', state = 'info', size = SIZE.xs } = {}) {
  const c = scene.add.container(x, y);
  const col = STATE_COLOR[state] ?? C.muted;
  const t = T(scene, 6, 3, text, { size, color: css(col) });
  const g = scene.add.graphics();
  g.fillStyle(col, 0.18); g.fillRect(0, 0, t.width + 12, t.height + 6);
  g.lineStyle(2, col, 1); g.strokeRect(1, 1, t.width + 10, t.height + 4);
  c.add([g, t]); c.w = t.width + 12; c.h = t.height + 6;
  return c;
}

export function SystemStatusIndicator(scene, { x = 0, y = 0, label = '', state = 'ok', size = SIZE.sm } = {}) {
  const c = scene.add.container(x, y);
  const col = STATE_COLOR[state] ?? C.muted;
  const g = scene.add.graphics();
  g.fillStyle(C.dgray, 1); g.fillRect(0, 2, 12, 12); g.fillStyle(col, 1); g.fillRect(2, 4, 8, 8); g.fillStyle(C.white, 0.5); g.fillRect(3, 5, 3, 2);
  const t = T(scene, 18, 1, label, { size, color: css(C.white) });
  c.add([g, t]); c.w = 18 + t.width;
  if (state === 'warning' || state === 'critical') scene.tweens.add({ targets: g, alpha: 0.45, duration: 600, yoyo: true, repeat: -1 });
  return c;
}

export function DataReadout(scene, { x = 0, y = 0, w = 140, label = '', value = '', unit = '', state = 'ok', note = '' } = {}) {
  const c = scene.add.container(x, y);
  const g = scene.add.graphics();
  g.fillStyle(C.space, 1); g.fillRect(0, 0, w, 46); g.fillStyle(C.dgray, 1); g.fillRect(0, 0, w, 2); g.fillRect(0, 44, w, 2);
  const l = T(scene, 8, 5, label.toUpperCase(), { size: SIZE.xs, color: css(C.muted) });
  const col = state === 'nodata' ? C.muted : (STATE_COLOR[state] ?? C.cyan);
  const v = T(scene, 8, 19, String(value), { size: SIZE.lg, color: css(col) });
  const u = T(scene, 8 + v.width + 4, 26, unit, { size: SIZE.xs, color: css(C.muted) });
  const n = T(scene, w - 6, 5, note, { size: 9, color: css(C.muted), ox: 1 });
  c.add([g, l, v, u, n]); c.w = w; c.h = 46;
  c.setReadout = (val, st = state) => { v.setText(String(val)); v.setColor(css(st === 'nodata' ? C.muted : (STATE_COLOR[st] ?? C.cyan))); u.setX(8 + v.width + 4); };
  return c;
}

// ---------------------------------------------------------------- Tooltip
export function attachTooltip(scene, obj, textOrFn) {
  if (!scene._tip) {
    const bg = scene.add.graphics().setDepth(DEPTH.tooltip).setScrollFactor(0);
    const tx = T(scene, 0, 0, '', { size: SIZE.xs + 1, wrap: 260 }).setDepth(DEPTH.tooltip + 1).setScrollFactor(0);
    bg.setVisible(false); tx.setVisible(false);
    scene._tip = { bg, tx };
    scene.events.once('shutdown', () => { scene._tip = null; });
  }
  const { bg, tx } = scene._tip;
  const show = (p) => {
    const s = typeof textOrFn === 'function' ? textOrFn() : textOrFn;
    if (!s) return;
    tx.setText(s);
    const w = tx.width + 16, h = tx.height + 12;
    const px = Math.min(Math.max(8, p.x + 14), scene.scale.width - w - 8);
    const py = Math.min(Math.max(8, p.y + 18), scene.scale.height - h - 8);
    bg.clear(); bg.fillStyle(C.dgray, 1); bg.fillRect(px, py, w, h); bg.fillStyle(C.space, 1); bg.fillRect(px + 2, py + 2, w - 4, h - 4);
    tx.setPosition(px + 8, py + 6); bg.setVisible(true); tx.setVisible(true);
  };
  obj.on('pointerover', (p) => show(p));
  obj.on('pointermove', (p) => { if (bg.visible) show(p); });
  obj.on('pointerout', () => { bg.setVisible(false); tx.setVisible(false); });
  obj.on('pointerdown', () => { bg.setVisible(false); tx.setVisible(false); });
}
export const Tooltip = attachTooltip;

// ---------------------------------------------------------------- Resource meter (HUD)
export function ResourceMeter(scene, { x = 0, y = 0, view, onClick, segW = 8, segH = 14, compact = false } = {}) {
  const c = scene.add.container(x, y);
  const iconName = { battery: 'battery', water: 'drop', oxygen: 'oxygen', food: 'food' }[view.id] || 'battery';
  const ic = pixelIcon(scene, iconName, 0, 0, 2);
  const isz = iconSize(iconName);
  const label = T(scene, isz.w * 2 + 8, 0, view.label, { size: SIZE.xs, color: css(C.muted) });
  const meter = SegmentedMeter(scene, { x: isz.w * 2 + 8, y: 14, segments: view.segments, segW, segH, gap: 2 });
  const value = T(scene, isz.w * 2 + 8, 14 + segH + 3, view.valueText, { size: SIZE.xs + 1, color: css(C.white) });
  const hit = zone(scene, meter.w + isz.w * 2 + 12, 44);
  c.add([ic, label, meter, value, hit]);
  c.w = meter.w + isz.w * 2 + 12; c.h = 44; c.meter = meter;
  c.update = (v, animate = false) => {
    value.setText(v.valueText);
    meter.setValue(v.bars, v.status, animate);
    value.setColor(css(v.status === 'critical' ? C.danger : v.status === 'warning' ? C.warning : v.status === 'nodata' ? C.muted : C.white));
  };
  c.update(view);
  hit.on('pointerup', () => { AudioFX.click?.(); onClick?.(view.id); });
  hit.on('pointerover', () => { label.setColor(css(C.cyan)); });
  hit.on('pointerout', () => { label.setColor(css(C.muted)); });
  c.hit = hit;
  return c;
}

// ---------------------------------------------------------------- Tabs / station navigation
export function Tabs(scene, { x = 0, y = 0, w = 400, tabs = [], active = null, onChange = () => {}, h = 30, vertical = false, fs = SIZE.sm } = {}) {
  const c = scene.add.container(x, y);
  const items = [];
  let cx = 0, cy = 0;
  tabs.forEach((tab) => {
    const probe = T(scene, 0, 0, tab.label, { size: fs }); const tw = vertical ? w : probe.width + 22; probe.destroy();
    if (!vertical && cx + tw > w && cx > 0) { cx = 0; cy += h + 6; }
    const t = StationTab(scene, { x: cx, y: cy, w: tw, h, label: tab.label, fs });
    t.tabId = tab.id; t.hit.on('pointerup', () => { if (c.activeId !== tab.id) { c.setActive(tab.id); onChange(tab.id); } });
    c.add(t); items.push(t);
    if (vertical) cy += h + 6; else cx += tw + 6;
  });
  c.heightUsed = cy + h; c.items = items;
  c.setActive = (id) => { c.activeId = id; items.forEach((t) => t.setActive(t.tabId === id)); };
  c.setActive(active ?? tabs[0]?.id);
  return c;
}
export const StationNavigation = Tabs;

export function StationTab(scene, { x = 0, y = 0, w = 100, h = 30, label = '', fs = SIZE.sm } = {}) {
  const c = scene.add.container(x, y); const g = scene.add.graphics();
  const t = T(scene, w / 2, h / 2, label, { size: fs, align: 'center', ox: 0.5, oy: 0.5 });
  const hit = zone(scene, w, h);
  c.add([g, t, hit]); c.hit = hit; let act = false, hov = false;
  const draw = () => {
    g.clear(); g.fillStyle(C.dgray, 1); g.fillRect(0, 0, w, h);
    g.fillStyle(act ? C.surface : hov ? 0x1d2c42 : C.space, 1); g.fillRect(2, 2, w - 4, h - 4);
    if (act) { g.fillStyle(C.orange, 1); g.fillRect(2, h - 5, w - 4, 3); }
    t.setColor(css(act ? C.white : hov ? C.cyan : C.muted));
  };
  c.setActive = (v) => { act = v; draw(); };
  hit.on('pointerover', () => { hov = true; draw(); }); hit.on('pointerout', () => { hov = false; draw(); });
  draw();
  return c;
}

// ---------------------------------------------------------------- Loading indicator
export function LoadingIndicator(scene, { x = 0, y = 0, size = 8 } = {}) {
  const c = scene.add.container(x, y); const g = scene.add.graphics(); c.add(g);
  let step = 0;
  const draw = () => {
    g.clear();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2; const on = (i - step + 8) % 8;
      g.fillStyle(on < 3 ? C.cyan : C.dgray, on < 3 ? 1 - on * 0.3 : 1);
      g.fillRect(Math.round(Math.cos(a) * size * 1.6) - size / 2, Math.round(Math.sin(a) * size * 1.6) - size / 2, size, size);
    }
  };
  c.timer = scene.time.addEvent({ delay: 110, loop: true, callback: () => { step = (step + 1) % 8; draw(); } });
  draw();
  c.once?.('destroy', () => c.timer.remove());
  return c;
}
