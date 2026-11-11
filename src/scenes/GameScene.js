import * as Phaser from 'phaser';
import { TILE, ROWS, COLS, WORLD_W, WORLD_H, FLOOR, DOOR, WALL } from '../config/constants.js';
import { ROOMS, roomById } from '../data/worldData.js';
import { buildGrid } from '../utils/grid.js';

export class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  create() {
    this.toastUntil = 0;
    this.vpad = { up: false, down: false, left: false, right: false, action: false };
    this.cameras.main.setBackgroundColor('#a8381f');
    this.cameras.main.fadeIn(500, 0, 0, 0);
    this.input.addPointer(2);

    this.isMobile = !this.sys.game.device.os.desktop || navigator.userAgent.match(/Android|iPhone|iPad/i) !== null;

    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);

    const built = buildGrid();
    const grid = built.grid;
    this.roomGrid = built.roomGrid;

    const blockers = this.physics.add.staticGroup();
    const g = this.add.graphics();

    // رسم الأرضية وتجهيز اجسام الاصطدام مع الجدران
    for (let ty = 0; ty < ROWS; ty++) {
      for (let tx = 0; tx < COLS; tx++) {
        const cell = grid[ty][tx];
        const px = tx * TILE;
        const py = ty * TILE;

        if (cell === FLOOR) {
          const id = this.roomGrid[ty][tx];
          const base = id ? roomById[id].tint : 0x4a3a30;
          g.fillStyle(base, 1); g.fillRect(px, py, TILE, TILE);
          g.lineStyle(1, 0xffffff, 0.06); g.strokeRect(px, py, TILE, TILE);
        } else if (cell === DOOR) {
          g.fillStyle(0x8a5a2b, 1); g.fillRect(px, py, TILE, TILE);
          g.fillStyle(0xf59e0b, 1); g.fillRect(px + 12, py + 12, 8, 8);
        } else if (cell === WALL) {
          g.fillStyle(0xc2561f, 1); g.fillRect(px, py, TILE, TILE);
          g.lineStyle(2, 0x7c2d12, 1); g.strokeRect(px, py, TILE, TILE);
          const z = this.add.zone(px + TILE / 2, py + TILE / 2, TILE, TILE);
          this.physics.add.existing(z, true); blockers.add(z);
        }
      }
    }

    // إضافة أسماء الغرف فوق المناطق المخصصة
    for (const r of ROOMS) {
      const cx = r.shape === 'circle' ? r.cx : r.x + r.w / 2;
      const cy = r.shape === 'circle' ? r.cy : r.y + r.h / 2;
      this.add.text(cx * TILE, cy * TILE, r.name, {
        fontFamily: 'Arial', fontSize: r.id === 'airlock' ? '13px' : '18px',
        color: '#ff8a3d', fontStyle: 'bold'
      }).setOrigin(0.5);
    }

    // إنشاء اللاعب وضبط الحجم وشريط التصادم
    this.player = this.physics.add.sprite(24 * TILE, 27.5 * TILE, 'character');
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(20, 30);
    this.player.body.setOffset(11, 34);
    this.physics.add.collider(this.player, blockers);

    // تجهيز أنيميشن الاتجاهات المختلفة (داخلية وخارجية)
    if (!this.anims.exists('out_down')) {
      this.anims.create({ key: 'out_down',  frames: this.anims.generateFrameNumbers('character', { frames: [0, 3, 0, 6] }), frameRate: 8, repeat: -1 });
      this.anims.create({ key: 'out_up',    frames: this.anims.generateFrameNumbers('character', { frames: [1, 7, 1, 7] }), frameRate: 8, repeat: -1 });
      this.anims.create({ key: 'out_left',  frames: this.anims.generateFrameNumbers('character', { frames: [2, 8, 2, 9] }), frameRate: 8, repeat: -1 });
      this.anims.create({ key: 'out_right', frames: this.anims.generateFrameNumbers('character', { frames: [4, 5, 4, 10] }), frameRate: 8, repeat: -1 });
      this.anims.create({ key: 'in_down',  frames: this.anims.generateFrameNumbers('character', { frames: [12, 15, 12, 18] }), frameRate: 8, repeat: -1 });
      this.anims.create({ key: 'in_up',    frames: this.anims.generateFrameNumbers('character', { frames: [13, 19, 13, 19] }), frameRate: 8, repeat: -1 });
      this.anims.create({ key: 'in_left',  frames: this.anims.generateFrameNumbers('character', { frames: [14, 20, 14, 21] }), frameRate: 8, repeat: -1 });
      this.anims.create({ key: 'in_right', frames: this.anims.generateFrameNumbers('character', { frames: [16, 17, 16, 22] }), frameRate: 8, repeat: -1 });
    }

    this.cursors = this.input.keyboard.addKeys({ up: 'UP', down: 'DOWN', left: 'LEFT', right: 'RIGHT', w: 'W', a: 'A', s: 'S', d: 'D' });
    this.keyE = this.input.keyboard.addKey('E');

    const cam = this.cameras.main;
    cam.setBounds(0, 0, WORLD_W, WORLD_H);
    cam.startFollow(this.player, true, 0.1, 0.1);

    const updateCameraZoom = () => {
      const w = this.scale.width;
      if (w < 768) cam.setZoom(0.5);
      else cam.setZoom(1.5);
    };
    this.scale.on('resize', updateCameraZoom);
    updateCameraZoom();

    this.hud = this.add.text(0, 0, '', { fontFamily: 'Arial', fontSize: '18px', color: '#ffffff', backgroundColor: '#000000aa', padding: { x: 8, y: 4 } }).setDepth(100);
    this.toast = this.add.text(0, 0, '', { fontFamily: 'Arial', fontSize: '18px', color: '#ffd23d', backgroundColor: '#000000cc', padding: { x: 10, y: 6 } }).setOrigin(0.5, 1).setDepth(100).setVisible(false);

    // تفعيل لوحة تحكم التاتش على الشاشة لأجهزة المحمول
    if (this.isMobile) {
      const createBtn = (label, dir) => {
        const btn = this.add.rectangle(0, 0, 50, 50, 0xffffff, 0.15).setInteractive().setDepth(200);
        const txt = this.add.text(0, 0, label, { fontSize: '28px', color: '#fff' }).setOrigin(0.5).setDepth(201);

        btn.on('pointerdown', () => { this.vpad[dir] = true; btn.setFillStyle(0xffffff, 0.5); });
        btn.on('pointerup', () => { this.vpad[dir] = false; btn.setFillStyle(0xffffff, 0.15); });
        btn.on('pointerout', () => { this.vpad[dir] = false; btn.setFillStyle(0xffffff, 0.15); });
        return { btn, txt };
      };

      this.btnUp = createBtn('↑', 'up');
      this.btnDown = createBtn('↓', 'down');
      this.btnLeft = createBtn('←', 'left');
      this.btnRight = createBtn('→', 'right');

      this.actionBtn = this.add.rectangle(0, 0, 60, 60, 0xffd23d, 0.4).setInteractive().setDepth(200);
      this.actionTxt = this.add.text(0, 0, 'E', { fontSize: '30px', color: '#000', fontStyle: 'bold' }).setOrigin(0.5).setDepth(201);

      this.actionBtn.on('pointerdown', () => { this.vpad.action = true; this.actionBtn.setFillStyle(0xffa000, 0.7); });
      this.actionBtn.on('pointerup', () => { this.vpad.action = false; this.actionBtn.setFillStyle(0xffd23d, 0.4); });
      this.actionBtn.on('pointerout', () => { this.vpad.action = false; this.actionBtn.setFillStyle(0xffd23d, 0.4); });
    }

    this.events.off('resume');
    this.events.on('resume', () => {
      this.input.keyboard.resetKeys();
      this.vpad = { up: false, down: false, left: false, right: false, action: false };
    });

    this.scene.launch('UI');
    this.events.once('shutdown', () => {
      this.scale.off('resize', updateCameraZoom);
      this.events.off('resume');
      this.scene.stop('UI');
      this.scene.stop('Pause');
      this.sound.stopAll();
    });
  }

  // معرفة الغرفة الحالية المستندة لموقع اللاعب
  getCurrentRoom() {
    const tx = Math.floor(this.player.x / TILE);
    const ty = Math.floor(this.player.y / TILE);
    const id = this.roomGrid[ty] && this.roomGrid[ty][tx];
    return id ? roomById[id] : null;
  }

  // التحديث المتكرر للحركة والتفاعل
  update(time) {
    const speed = 200;
    const b = this.player.body;
    b.setVelocity(0);

    const room = this.getCurrentRoom();
    const isOutside = (room && room.id === 'airlock');
    const prefix = isOutside ? 'out_' : 'in_';

    let isMoving = false;

    let moveLeft = this.cursors.left.isDown || this.cursors.a.isDown || this.vpad.left;
    let moveRight = this.cursors.right.isDown || this.cursors.d.isDown || this.vpad.right;
    let moveUp = this.cursors.up.isDown || this.cursors.w.isDown || this.vpad.up;
    let moveDown = this.cursors.down.isDown || this.cursors.s.isDown || this.vpad.down;

    if (moveLeft) { b.setVelocityX(-speed); this.player.anims.play(prefix + 'left', true); isMoving = true; }
    else if (moveRight) { b.setVelocityX(speed); this.player.anims.play(prefix + 'right', true); isMoving = true; }

    if (moveUp) { b.setVelocityY(-speed); if (!isMoving) this.player.anims.play(prefix + 'up', true); isMoving = true; }
    else if (moveDown) { b.setVelocityY(speed); if (!isMoving) this.player.anims.play(prefix + 'down', true); isMoving = true; }

    if (!isMoving) this.player.anims.stop();
    if (b.velocity.x !== 0 || b.velocity.y !== 0) b.velocity.normalize().scale(speed);

    // عند الضغط على زر التفاعل E
    if ((Phaser.Input.Keyboard.JustDown(this.keyE) || this.vpad.action) && room) {
      this.vpad.action = false;
      this.toast.setText('تفاعل: ' + room.name);
      this.toastUntil = time + 1500;
    }

    const cam = this.cameras.main;
    const z = cam.zoom;
    const wv = cam.worldView;
    const s = 1 / z;

    this.hud.setText(room ? room.name : 'CORRIDOR');
    this.hud.setScale(s).setPosition(wv.x + 12 * s, wv.y + 12 * s);

    const toastOffset = this.isMobile ? 120 : 40;
    this.toast.setScale(s).setPosition(wv.x + wv.width / 2, wv.y + wv.height - toastOffset * s).setVisible(time < this.toastUntil);

    if (this.isMobile) {
      const pX = wv.x + 90 * s;
      const pY = wv.y + wv.height - 110 * s;
      const off = 55 * s;

      this.btnUp.btn.setPosition(pX, pY - off).setScale(s);
      this.btnUp.txt.setPosition(pX, pY - off).setScale(s);

      this.btnDown.btn.setPosition(pX, pY + off).setScale(s);
      this.btnDown.txt.setPosition(pX, pY + off).setScale(s);

      this.btnLeft.btn.setPosition(pX - off, pY).setScale(s);
      this.btnLeft.txt.setPosition(pX - off, pY).setScale(s);

      this.btnRight.btn.setPosition(pX + off, pY).setScale(s);
      this.btnRight.txt.setPosition(pX + off, pY).setScale(s);

      const aX = wv.x + wv.width - 60 * s;
      const aY = wv.y + wv.height - 80 * s;
      this.actionBtn.setPosition(aX, aY).setScale(s);
      this.actionTxt.setPosition(aX, aY).setScale(s);
    }
  }
}
