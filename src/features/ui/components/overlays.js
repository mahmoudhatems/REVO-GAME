import { COLORS as C, SIZE, DEPTH, css, STATE_COLOR } from '../tokens.js';
import { ICON, LEVEL_ICON } from '../assetKeys.js';
import { T, Panel, Button } from './core.js';
import { AudioFX } from '../../../utils/audio.js';

// ---------------------------------------------------------------- Modals
export function ConfirmationModal(scene, { title, lines = [], confirmLabel = 'CONFIRM', cancelLabel = 'BACK', onConfirm = () => {}, onCancel = () => {}, kind = 'confirm', infoOnly = false, width = 520 } = {}) {
  const sw = scene.scale.width, sh = scene.scale.height;
  const root = scene.add.container(0, 0).setDepth(DEPTH.modal);
  const blocker = scene.add.rectangle(0, 0, sw, sh, 0x000000, 0.72).setOrigin(0).setInteractive();
  const w = Math.min(width, sw - 24);
  const accent = kind === 'warning' ? C.warning : C.cyan;
  const body = T(scene, 0, 0, lines.join('\n'), { size: SIZE.md, wrap: w - 40, bold: false });
  const h = Math.min(sh - 20, 30 + 24 + body.height + 20 + 56 + 16);
  const p = Panel(scene, { x: Math.round((sw - w) / 2), y: Math.round((sh - h) / 2), w, h, title, accent, icon: kind === 'warning' ? ICON.warning : ICON.info });
  body.setPosition(10, 0); p.content.add(body);
  const bw = infoOnly ? 180 : Math.min(200, (w - 36) / 2);
  const by = h - 56;
  const close = () => { scene.input.keyboard?.off('keydown-ESC', esc); root.destroy(true); };
  const esc = () => { close(); onCancel(); };
  if (!infoOnly) p.add(Button(scene, { x: w / 2 - bw - 6, y: by, w: bw, h: 38, label: cancelLabel, variant: 'secondary', back: true, onClick: () => { close(); onCancel(); } }));
  p.add(Button(scene, { x: infoOnly ? (w - bw) / 2 : w / 2 + 6, y: by, w: bw, h: 38, label: infoOnly ? 'OK' : confirmLabel, onClick: () => { close(); onConfirm(); } }));
  root.add([blocker, p]);
  scene.input.keyboard?.on('keydown-ESC', esc);
  root.close = close;
  return root;
}
export const WarningModal = (scene, o) => ConfirmationModal(scene, { ...o, kind: 'warning' });

// ---------------------------------------------------------------- Notifications
const TTL = { info: 5000, success: 5000, warning: 8000, critical: 0 };

export class NotificationCenter {
  constructor(scene, topOffset = () => 72) {
    this.scene = scene; this.items = []; this.topOffset = topOffset;
  }

  push({ level = 'info', title, text = '', ttl }) {
    const s = this.scene; const w = Math.min(320, s.scale.width - 16);
    const col = STATE_COLOR[level] ?? C.cyan;
    const p = Panel(s, { x: 0, y: 0, w, h: 58, accent: col }).setDepth(DEPTH.modal - 10);
    p.add(s.add.image(8, 14, LEVEL_ICON[level] || ICON.info).setOrigin(0, 0).setScale(1));
    p.add(T(s, 46, 9, title, { size: SIZE.sm, color: css(col), wrap: w - 80 }));
    if (text) p.add(T(s, 46, 29, text, { size: 10, color: css(C.muted), wrap: w - 80, bold: false }));
    const x = T(s, w - 20, 6, 'X', { size: SIZE.sm, color: css(C.muted) });
    const hit = s.add.zone(w - 28, 2, 26, 26).setOrigin(0, 0).setInteractive({ useHandCursor: true });
    hit.on('pointerup', () => this.dismiss(p));
    p.add([x, hit]);
    p.setAlpha(0);
    this.items.push(p);
    if (this.items.length > 3) this.dismiss(this.items[0]);
    this.layout(true);
    const t = ttl ?? TTL[level];
    if (t) p.timer = s.time.delayedCall(t, () => this.dismiss(p));
    if (level === 'warning' || level === 'critical') AudioFX.back?.(); else if (level === 'success') AudioFX.click?.();
    return p;
  }

  dismiss(p) {
    const i = this.items.indexOf(p); if (i < 0) return;
    this.items.splice(i, 1); p.timer?.remove();
    this.scene.tweens.add({ targets: p, alpha: 0, duration: 160, onComplete: () => p.destroy(true) });
    this.layout();
  }

  layout(animateLast = false) {
    const s = this.scene; let y = this.topOffset();
    this.items.forEach((p, i) => {
      const x = s.scale.width - p.w - 8;
      if (animateLast && i === this.items.length - 1) {
        p.setPosition(x + 40, y);
        s.tweens.add({ targets: p, x, alpha: 1, duration: 220 });
      } else { p.setPosition(x, y); p.setAlpha(1); }
      y += 66;
    });
  }
}

// ---------------------------------------------------------------- N.E.I.L. dialogue panel
const SEV = { info: C.cyan, success: C.success, warning: C.warning, critical: C.danger };

export function NeilDialoguePanel(scene, { x = 0, y = 0, w = 640, h = 170, onContinue = () => {}, onAction = () => {} } = {}) {
  const p = Panel(scene, { x, y, w, h, title: 'N.E.I.L.  //  MISSION INTELLIGENCE', accent: C.cyan });
  const compact = w < 520;
  const av = compact ? 72 : 96;
  const frame = scene.add.graphics();
  frame.fillStyle(C.dgray, 1); frame.fillRect(0, 0, av + 8, av + 8); frame.fillStyle(C.space, 1); frame.fillRect(3, 3, av + 2, av + 2);
  const avatar = scene.add.image(4 + av / 2 + 1, 4 + av / 2 + 1, ICON.neil);
  avatar.setScale(av / Math.max(avatar.width, avatar.height) >= 1 ? Math.floor(av / Math.max(avatar.width, avatar.height)) : 1);
  p.content.add([frame, avatar]);
  scene.tweens.add({ targets: avatar, y: avatar.y - 2, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  const tx = av + 22; const tw = p.innerW - tx;
  const text = T(scene, tx, 0, '', { size: compact ? SIZE.sm : SIZE.md, wrap: tw, bold: false });
  const iconSlot = scene.add.container(p.innerW - 14, -2);
  p.content.add([text, iconSlot]);
  let full = ''; let idx = 0; let timer = null; let cont = null; let act = null; let done = true; let cur = {};
  const finish = () => {
    timer?.remove(); timer = null; text.setText(full); done = true; mountButtons();
  };
  const mountButtons = () => {
    cont?.destroy(); act?.destroy();
    const by = p.innerH - 36; const bw = compact ? 120 : 160;
    cont = Button(scene, { x: p.innerW - bw, y: by, w: bw, h: 34, label: cur.continueLabel || 'CONTINUE', fs: 12, onClick: () => onContinue(cur) });
    p.content.add(cont);
    if (cur.action) {
      act = Button(scene, { x: p.innerW - bw - (bw + 10) - 20, y: by, w: bw + 30, h: 34, label: cur.action.label, variant: 'secondary', fs: 11, onClick: () => onAction(cur.action) });
      p.content.add(act);
    }
  };
  p.say = (o) => {
    cur = o; full = o.text; idx = 0; done = false; text.setText('');
    const col = SEV[o.severity] ?? C.cyan;
    p.setAccentColor?.(col);
    avatar.setTexture(o.severity === 'critical' || o.severity === 'warning' ? ICON.neilAlert : ICON.neil);
    iconSlot.removeAll(true);
    cont?.destroy(); act?.destroy(); cont = act = null;
    timer?.remove();
    timer = scene.time.addEvent({ delay: 22, loop: true, callback: () => { idx += 2; text.setText(full.slice(0, idx)); if (idx >= full.length) finish(); } });
  };
  p.skip = () => { if (!done) finish(); };
  const hit = scene.add.zone(0, 0, w, h).setOrigin(0, 0).setInteractive();
  hit.on('pointerup', () => p.skip());
  p.addAt(hit, 1);
  p.isDone = () => done;
  p.once?.('destroy', () => timer?.remove());
  return p;
}

// ---------------------------------------------------------------- Interaction prompt
export function InteractionPrompt(scene) {
  const c = scene.add.container(0, 0).setDepth(DEPTH.panel + 5).setVisible(false);
  const g = scene.add.graphics(); const key = T(scene, 0, 0, 'E', { size: SIZE.lg, color: css(C.space), ox: 0.5, oy: 0.5 });
  const label = T(scene, 0, 0, '', { size: SIZE.sm });
  c.add([g, key, label]);
  c.setPrompt = (k, text, accent = C.cyan) => {
    key.setText(k); label.setText(text);
    const kw = 30; const w = kw + 12 + label.width + 14; const h = 32;
    g.clear(); g.fillStyle(C.black, 0.4); g.fillRect(3, 3, w, h);
    g.fillStyle(C.dgray, 1); g.fillRect(0, 0, w, h); g.fillStyle(C.space, 1); g.fillRect(2, 2, w - 4, h - 4);
    g.fillStyle(accent, 1); g.fillRect(5, 5, kw, h - 10);
    key.setPosition(5 + kw / 2, h / 2); label.setPosition(kw + 14, h / 2 - label.height / 2);
    c.w = w; c.h = h;
  };
  return c;
}
