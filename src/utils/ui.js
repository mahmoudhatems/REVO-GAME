import { UI_FONT } from '../config/constants.js';
import { AudioFX } from './audio.js';

import * as Phaser from 'phaser';

export const clamp = Phaser.Math.Clamp;

// رسم خلفية سماء وكثبان المريخ ومبنى القاعدة
export function drawMarsBg(scene) {
  const w = scene.scale.width, h = scene.scale.height;
  scene.cameras.main.setBackgroundColor('#1b0b07');
  const g = scene.add.graphics().setDepth(-10);
  const bands = [0x12060f, 0x1d0a12, 0x2b0e12, 0x3f1511, 0x5a1d12, 0x7a2a14, 0x9a3a18, 0xb94e1c];
  const horizon = h * 0.8, bh = horizon / bands.length;
  bands.forEach((c, i) => { g.fillStyle(c, 1); g.fillRect(0, Math.floor(i * bh), w, Math.ceil(bh) + 1); });

  for (let i = 0; i < 70; i++) {
    const s = scene.add.rectangle(Math.random() * w, Math.random() * horizon * 0.7, 2, 2, 0xffffff, 0.3 + Math.random() * 0.6).setDepth(-9);
    scene.tweens.add({ targets: s, alpha: 0.1, duration: 800 + Math.random() * 1800, yoyo: true, repeat: -1, delay: Math.random() * 1500 });
  }
  g.fillStyle(0x7c2d12, 1);
  for (let x = 0; x < w; x += 8) {
    const y = horizon - 14 + Math.sin(x * 0.012) * 12 + Math.sin(x * 0.031) * 5;
    g.fillRect(x, Math.floor(y / 4) * 4, 8, h);
  }
  g.fillStyle(0x4a1608, 1);
  for (let x = 0; x < w; x += 8) {
    const y = horizon + 14 + Math.sin(x * 0.008 + 2) * 14 + Math.sin(x * 0.04) * 4;
    g.fillRect(x, Math.floor(y / 4) * 4, 8, h);
  }
  const bx = w * 0.84, by = horizon + 6;
  g.fillStyle(0x2a0f08, 1);
  for (let r = 0; r < 6; r++) { const half = Math.floor(Math.sqrt(36 - r * r) * 5); g.fillRect(bx - half, by - r * 5 - 5, half * 2, 5); }
  g.fillRect(bx - 34, by, 68, 8);
  g.fillStyle(0xf59e0b, 1); g.fillRect(bx - 4, by - 8, 8, 8);

  for (let i = 0; i < 14; i++) {
    const d = scene.add.rectangle(Math.random() * w, horizon * (0.5 + Math.random() * 0.6), 6 + Math.random() * 10, 3, 0xe0793a, 0.15).setDepth(-8);
    scene.tweens.add({ targets: d, x: d.x + 120 + Math.random() * 200, duration: 6000 + Math.random() * 6000, repeat: -1, onRepeat: () => { d.x = -20; } });
  }
}

// إضافة شعار اللعبة أو نص احتياطي بنفس النسبة
export function addLogo(scene, x, y, maxW, maxH) {
  if (scene.textures.exists('logo')) {
    const img = scene.add.image(x, y, 'logo');
    const s = Math.min(maxW / img.width, maxH / img.height);
    img.setScale(s);
    return img;
  }
  return scene.add.text(x, y, 'THE REVO', {
    fontFamily: UI_FONT, fontSize: Math.floor(Math.min(maxH * 0.6, maxW / 6)) + 'px',
    color: '#ff8a3d', fontStyle: 'bold', stroke: '#7c2d12', strokeThickness: 6
  }).setOrigin(0.5);
}

// دالة تفاعلية موحدة لبناء الأزرار المصممة للبكسل
export function makeButton(scene, x, y, w, h, label, cb, opts = {}) {
  const fs = opts.fs || Math.floor(h * 0.4);
  const c = scene.add.container(x, y);
  const bg = scene.add.graphics();
  const draw = (hover) => {
    bg.clear();
    bg.fillStyle(0x000000, 0.45); bg.fillRect(-w / 2 + 4, -h / 2 + 4, w, h);
    bg.fillStyle(hover ? 0xc2561f : 0x7c2d12, 1); bg.fillRect(-w / 2, -h / 2, w, h);
    bg.lineStyle(3, hover ? 0xffd23d : 0xff8a3d, 1); bg.strokeRect(-w / 2, -h / 2, w, h);
    bg.fillStyle(0xffffff, hover ? 0.16 : 0.07); bg.fillRect(-w / 2 + 3, -h / 2 + 3, w - 6, h * 0.28);
  };
  draw(false);
  const t = scene.add.text(0, 0, label, {
    fontFamily: opts.font || UI_FONT, fontSize: fs + 'px', color: '#ffe9c7', fontStyle: 'bold', align: 'center'
  }).setOrigin(0.5);
  c.add([bg, t]);
  c.label = t;
  c.setSize(w, h).setInteractive({ useHandCursor: true });
  c.on('pointerover', () => { draw(true); t.setColor('#ffffff'); c.y = y - 2; AudioFX.hover(); });
  c.on('pointerout',  () => { draw(false); t.setColor('#ffe9c7'); c.y = y; });
  c.on('pointerdown', () => { c.y = y + 2; });
  c.on('pointerup', () => { c.y = y; AudioFX.init(); opts.back ? AudioFX.back() : AudioFX.click(); cb(); });
  return c;
}

// عناصر التحكم في رفع وخفض وكتم الصوت
export function addSoundControls(scene) {
  const w = scene.scale.width, h = scene.scale.height;
  const y = h - 28, bw = 40, bh = 34;
  let mute;
  const refresh = () => { mute.label.setText(AudioFX.icon()); };
  makeButton(scene, w - 28 - bw * 2 - 16, y, bw, bh, '−', () => { AudioFX.setVol(AudioFX.vol - 0.15); refresh(); }, { fs: 22 });
  makeButton(scene, w - 28 - bw - 8, y, bw, bh, '+', () => { AudioFX.setVol(AudioFX.vol + 0.15); refresh(); }, { fs: 22 });
  mute = makeButton(scene, w - 28, y, bw, bh, AudioFX.icon(), () => { AudioFX.toggleMute(); refresh(); }, { fs: 18 });
}

// دالة الانتقال بسلاسة بين المشاهد باستخدام الفيد (Fade Out)
export function goTo(scene, key, data) {
  const cam = scene.cameras.main;
  if (scene._leaving) return;
  scene._leaving = true;
  cam.fadeOut(220, 0, 0, 0);
  cam.once('camerafadeoutcomplete', () => scene.scene.start(key, data));
}
