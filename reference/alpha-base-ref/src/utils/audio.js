export const AudioFX = {
  ctx: null, master: null, music: null, timer: null,
  vol: 0.6, muted: false,

  // تهيئة سياق الصوت برمجياً
  init() {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.connect(this.ctx.destination);
        this.apply();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
    } catch (e) { }
  },
  apply() { if (this.master) this.master.gain.value = this.muted ? 0 : this.vol; },
  setVol(v) { this.vol = Math.max(0, Math.min(1, v)); if (this.vol > 0) this.muted = false; this.apply(); },
  toggleMute() { this.muted = !this.muted; this.apply(); },
  icon() { return this.muted || this.vol === 0 ? '🔇' : '🔊'; },

  // إرسال صوت قصير (Blip) للتحركات والأزرار
  blip(freq, dur, type, gain) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type || 'square'; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(gain || 0.12, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + 0.02);
  },
  hover() { this.blip(660, 0.05, 'square', 0.04); },
  click() { this.blip(440, 0.07, 'square', 0.1); setTimeout(() => this.blip(880, 0.09, 'square', 0.08), 60); },
  back()  { this.blip(520, 0.08, 'square', 0.08); setTimeout(() => this.blip(330, 0.1, 'square', 0.08), 60); },

  // تشغيل الموسيقى التوليدية للمحيط المريخي
  startMusic() {
    if (!this.ctx || this.music) return;
    const c = this.ctx;
    const out = c.createGain(); out.gain.value = 0; out.connect(this.master);
    out.gain.linearRampToValueAtTime(0.5, c.currentTime + 2);
    const d1 = c.createOscillator(), d2 = c.createOscillator();
    d1.type = 'sine'; d1.frequency.value = 55;
    d2.type = 'triangle'; d2.frequency.value = 82.4;
    const dg = c.createGain(); dg.gain.value = 0.22;
    d1.connect(dg); d2.connect(dg); dg.connect(out); d1.start(); d2.start();
    const notes = [220, 261.6, 329.6, 392, 329.6, 261.6, 293.7, 196];
    let i = 0;
    this.timer = setInterval(() => {
      if (!this.ctx) return;
      const t = c.currentTime;
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'triangle'; o.frequency.value = notes[i++ % notes.length];
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.16, t + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
      o.connect(g); g.connect(out); o.start(t); o.stop(t + 1.7);
    }, 900);
    this.music = { out, oscs: [d1, d2] };
  },
  stopMusic() {
    clearInterval(this.timer); this.timer = null;
    if (!this.music || !this.ctx) { this.music = null; return; }
    const m = this.music; this.music = null;
    const t = this.ctx.currentTime;
    m.out.gain.cancelScheduledValues(t);
    m.out.gain.setValueAtTime(m.out.gain.value, t);
    m.out.gain.linearRampToValueAtTime(0, t + 0.4);
    setTimeout(() => { m.oscs.forEach(o => { try { o.stop(); } catch (e) {} }); m.out.disconnect(); }, 500);
  }
};