import * as Phaser from 'phaser';
import { COLORS as C, css } from '../features/ui/tokens.js';
import { ICON } from '../features/ui/assetKeys.js';
import { T, Panel, Button } from '../features/ui/components/core.js';
import { ConfirmationModal } from '../features/ui/components/overlays.js';
import { openOverlay } from '../features/ui/overlayManager.js';
import { AudioFX } from '../utils/audio.js';

export class PauseScene extends Phaser.Scene {
  constructor() { super('Pause'); }

  init(data) { this.targetScene = data.targetScene ?? 'Game'; }

  create() {
    this.modal = null;
    this.build();
    this.scale.on('resize', this.build, this);
    this.events.once('shutdown', () => this.scale.off('resize', this.build, this));
  }

  handleEsc() { if (this.modal) { this.modal.close(); this.modal = null; } else this.resume(); }

  resume() { this.scene.resume(this.targetScene); this.scene.stop(); }

  exitToMenu() {
    this.sound.stopAll();
    AudioFX.stopMusic();
    this.scene.stop('Hud');
    this.scene.stop('UI');
    this.scene.stop('Game');
    this.scene.stop('Interior');
    this.scene.start('Menu');
  }

  open(key) { openOverlay(this, key, { returnToPause: true }); }

  build() {
    this.children.removeAll(true);
    const W = this.scale.width, H = this.scale.height;
    this.add.rectangle(0, 0, W, H, 0x000000, 0.72).setOrigin(0).setInteractive();
    const w = Math.min(W - 16, 380); const bh = 38; const gap = 8; const n = 6;
    const h = Math.min(H - 16, 30 + 20 + n * (bh + gap) + 56);
    const p = Panel(this, { x: Math.round((W - w) / 2), y: Math.round((H - h) / 2), w, h, title: 'PAUSED', accent: C.orange, icon: ICON.info });
    const bw = p.innerW; let y = 0;
    p.content.add(T(this, 0, y, 'MISSION 1  -  APPROVAL PENDING', { size: 11, color: css(C.muted) })); y += 22;
    const add = (label, fn, o = {}) => { p.content.add(Button(this, { x: 0, y, w: bw, h: bh, label, onClick: fn, fs: 13, ...o })); y += bh + gap; };
    add('RESUME', () => this.resume());
    add('OBJECTIVES', () => this.open('Objectives'), { variant: 'secondary' });
    add('LOGBOOK', () => this.open('Logbook'), { variant: 'secondary' });
    add('SETTINGS (PLANNED)', () => {}, { variant: 'secondary', disabled: true });
    add('CONTROLS', () => this.open('Controls'), { variant: 'secondary' });
    add('MAIN MENU', () => {
      this.modal = ConfirmationModal(this, {
        title: 'RETURN TO MAIN MENU?', lines: ['Leaving the current mission will lose your progress.', 'الرجوع للقائمة الرئيسية؟ التقدم اللي وصلتله هيتفقد.'],
        confirmLabel: 'YES, LEAVE', cancelLabel: 'STAY', kind: 'warning', onConfirm: () => this.exitToMenu(), onCancel: () => { this.modal = null; }
      });
    }, { variant: 'danger', back: true });
  }
}

