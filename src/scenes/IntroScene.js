import * as Phaser from 'phaser';
import { INTRO_SOURCES } from '../config/constants.js';
import { AudioFX } from '../utils/audio.js';

export class IntroScene extends Phaser.Scene {
  constructor() { super('Intro'); }

  create() {
    AudioFX.stopMusic();
    this.cameras.main.setBackgroundColor('#000000');
    this.finished = false;
    this.cleaned = false;

    const root = document.createElement('div');
    root.style.cssText = 'position:fixed;inset:0;z-index:1000;background:#000;display:flex;align-items:center;justify-content:center;';
    const video = document.createElement('video');
    video.style.cssText = 'width:100%;height:100%;object-fit:contain;background:#000;';
    video.playsInline = true; video.setAttribute('playsinline', ''); video.preload = 'auto';

    let failed = 0;
    INTRO_SOURCES.forEach(([src, type]) => {
      const s = document.createElement('source');
      s.src = src; if (type) s.type = type;
      s.addEventListener('error', () => { if (++failed >= INTRO_SOURCES.length) this.fail(); });
      video.appendChild(s);
    });

    const skip = document.createElement('button');
    skip.textContent = 'SKIP  ⏭  تخطي';
    skip.style.cssText = 'position:absolute;right:16px;bottom:16px;padding:12px 18px;font:bold 16px "Courier New",monospace;color:#ffe9c7;background:#7c2d12;border:3px solid #ff8a3d;cursor:pointer;z-index:2;';
    skip.addEventListener('click', () => this.finish());

    const msg = document.createElement('div');
    msg.style.cssText = 'position:absolute;left:0;right:0;top:45%;text-align:center;color:#ffd23d;font:bold 20px Tahoma,Arial,sans-serif;display:none;padding:0 20px;';
    root.append(video, skip, msg);
    document.body.appendChild(root);

    this.dom = { root, video, msg };
    this.onKey = (e) => { if (['Escape', ' ', 'Enter'].includes(e.key)) this.finish(); };
    window.addEventListener('keydown', this.onKey);

    video.addEventListener('ended', () => this.finish());
    video.addEventListener('error', () => { if (!video.currentSrc) this.fail(); else this.fail(); });
    video.addEventListener('stalled', () => { });

    const p = video.play();
    if (p && p.catch) p.catch(() => { video.muted = true; const q = video.play(); if (q && q.catch) q.catch(() => {}); });

    this.events.once('shutdown', () => this.cleanup());
    this.events.once('destroy', () => this.cleanup());
  }

  fail() {
    if (this.finished || this.failedShown) return;
    this.failedShown = true;
    this.dom.video.style.display = 'none';
    this.dom.msg.style.display = 'block';
    this.dom.msg.textContent = 'تعذّر تشغيل فيديو المقدمة، هنبدأ اللعبة مباشرة...';
    setTimeout(() => this.finish(), 2200);
  }

  finish() {
    if (this.finished) return;
    this.finished = true;
    this.cleanup();
    this.scene.start('Game');
  }

  cleanup() {
    if (this.cleaned) return;
    this.cleaned = true;
    window.removeEventListener('keydown', this.onKey);
    if (this.dom) {
      const v = this.dom.video;
      try { v.pause(); v.removeAttribute('src'); while (v.firstChild) v.removeChild(v.firstChild); v.load(); } catch (e) {}
      this.dom.root.remove();
      this.dom = null;
    }
  }
}
