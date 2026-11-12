
import {
  MAP_W,
  MAP_H,
  START,
  OUTSIDE_Y,
  ROOM_ZONES,
  buildWalkMask
} from '../data/baseMap.js';

// ترتيب الـ frames حسب اتجاه الصور في الـ Sprite Sheet
// الخوذة (out): 1 أمام | 2 خلف | 3 يسار | 4,7 مشي أمام | 8 مشي خلف
// 5,6,11,12 يمين | 9,10 يسار
// بدون خوذة (in): 13 أمام | 14 خلف | 15 يسار | 16 مشي أمام | 17,18 يمين
// 19 مشي أمام | 20 مشي خلف | 21 يسار | 22,23,24 يمين

const PLAYER_IDLE_FRAMES = {
  out: { down: 1, up: 2, left: 3, right: 6 },
  in: { down: 13, up: 14, left: 15, right: 18 }
};

const PLAYER_WALK_FRAMES = {
  out: {
    down: [4, 1, 7, 1],
    up: [8, 2],
    left: [9, 3, 10, 3],
    right: [5, 11, 6, 12]
  },
  in: {
    down: [16, 13, 19, 13],
    up: [20, 14],
    left: [21, 15],
    right: [22, 17, 23, 18]
  }
};

// توحيد طول الشخصية لمنع اختلاف الحجم بين الصور
const PLAYER_TARGET_H = 60;

const SPEED = 200;
const HALF_W = 8;
const FOOT_H = 10;

export class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.toastUntil = 0;

    // أزرار اللمس يتم التحكم فيها من UIScene فقط
    this.game.vpad = {
      up: false,
      down: false,
      left: false,
      right: false,
      action: false
    };

    this.vpad = this.game.vpad;

    this.cameras.main.setBackgroundColor('#000000');
    this.cameras.main.fadeIn(500, 0, 0, 0);

    this.isMobile =
      !this.sys.game.device.os.desktop ||
      navigator.userAgent.match(/Android|iPhone|iPad/i) !== null;

    // خريطة القاعدة
    this.add.image(0, 0, 'base_map')
      .setOrigin(0)
      .setDepth(-10);

    // قناع التصادم
    this.mask = buildWalkMask();

    // إنشاء شخصية الرائد
    this.pos = {
      x: START.x,
      y: START.y
    };

    this.player = this.add.sprite(
      this.pos.x,
      this.pos.y,
      'astro_out_1'
    );

    this.player.setOrigin(0.5, 1);
    this.player.facing = 'down';
    this.player.appearance = 'out';
    this.player.moving = false;

    this.createPlayerAnimations();

    // أزرار الكيبورد
    this.cursors = this.input.keyboard.addKeys({
      up: 'UP',
      down: 'DOWN',
      left: 'LEFT',
      right: 'RIGHT',
      w: 'W',
      a: 'A',
      s: 'S',
      d: 'D'
    });

    this.keyE = this.input.keyboard.addKey('E');

    // إعداد الكاميرا
    const cam = this.cameras.main;

    cam.setBounds(0, 0, MAP_W, MAP_H);

    // حساب التكبير بحيث تملأ الخريطة الشاشة بدون تشويه
    const updateCameraZoom = () => {
      const width = this.scale.width;
      const height = this.scale.height;

      if (width <= 0 || height <= 0) return;

      const zoomX = width / MAP_W;
      const zoomY = height / MAP_H;

      // تغطية الشاشة بالكامل مع الحفاظ على نسبة الخريطة
      const zoom = Math.max(zoomX, zoomY);

      cam.setZoom(zoom);
    };

    updateCameraZoom();

    // متابعة الشخصية
    cam.startFollow(this.player, true, 0.12, 0.12);

    // تحديث الكاميرا عند تغيير حجم الشاشة
    this.scale.on('resize', updateCameraZoom);

    // HUD
    this.hud = this.add.text(
      0,
      0,
      '',
      {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#ffffff',
        backgroundColor: '#000000aa',
        padding: {
          x: 8,
          y: 4
        }
      }
    ).setDepth(5000);

    // رسالة التفاعل
    this.toast = this.add.text(
      0,
      0,
      '',
      {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#ffd23d',
        backgroundColor: '#000000cc',
        padding: {
          x: 10,
          y: 6
        }
      }
    )
      .setOrigin(0.5, 1)
      .setDepth(5000)
      .setVisible(false);

    // إعادة ضبط الأزرار عند الرجوع للعبة
    this.events.off('resume');

    this.events.on('resume', () => {
      this.input.keyboard.resetKeys();

      Object.keys(this.vpad).forEach(key => {
        this.vpad[key] = false;
      });
    });

    // تشغيل واجهة المستخدم
    this.scene.launch('UI');

    // تنظيف المشاهد عند إغلاق اللعبة
    this.events.once('shutdown', () => {
      this.scale.off('resize', updateCameraZoom);

      this.events.off('resume');

      Object.keys(this.vpad).forEach(key => {
        this.vpad[key] = false;
      });

      this.scene.stop('UI');
      this.scene.stop('Pause');
      this.sound.stopAll();
    });
  }

  // التأكد من أن النقطة صالحة للمشي
  walkable(x, y) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);

    if (
      ix < 0 ||
      iy < 0 ||
      ix >= MAP_W ||
      iy >= MAP_H
    ) {
      return false;
    }

    return this.mask[iy * MAP_W + ix] === 1;
  }

  // التأكد من أن صندوق القدمين بالكامل على أرض صالحة
  boxFree(x, y) {
    const l = x - HALF_W;
    const r = x + HALF_W;
    const t = y - FOOT_H;
    const b = y - 1;

    const mx = x;
    const my = y - FOOT_H / 2;

    return (
      this.walkable(l, t) &&
      this.walkable(r, t) &&
      this.walkable(l, b) &&
      this.walkable(r, b) &&
      this.walkable(mx, t) &&
      this.walkable(mx, b) &&
      this.walkable(l, my) &&
      this.walkable(r, my)
    );
  }

  // تحديد اسم الغرفة الحالية
  getRoomName() {
    const { x, y } = this.pos;

    if (y > OUTSIDE_Y) {
      return 'AIRLOCK';
    }

    for (const z of ROOM_ZONES) {
      const [x0, y0, x1, y1] = z.box;

      if (
        x >= x0 &&
        x <= x1 &&
        y >= y0 &&
        y <= y1
      ) {
        return z.name;
      }
    }

    return 'CENTRAL HABITAT';
  }

  // إنشاء أنيميشن الحركة
  createPlayerAnimations() {
    for (const [appearance, directions] of Object.entries(PLAYER_WALK_FRAMES)) {
      for (const [direction, indexes] of Object.entries(directions)) {
        const key = `${appearance}_${direction}`;

        if (!this.anims.exists(key)) {
          this.anims.create({
            key,
            frames: indexes.map(index => ({
              key: `astro_${appearance}_${index}`
            })),
            frameRate: 7,
            repeat: -1
          });
        }
      }
    }
  }

  // تحديد صورة الوقوف حسب الاتجاه والمظهر
  getIdleTexture(appearance) {
    return `astro_${appearance}_${PLAYER_IDLE_FRAMES[appearance][this.player.facing]}`;
  }

  update(time, delta) {
    const dt = Math.min(delta, 50) / 1000;
    const p = this.pos;

    // تحديد المظهر حسب مكان الشخصية
    const appearance = p.y > OUTSIDE_Y ? 'out' : 'in';

    this.player.appearance = appearance;

    // قراءة أزرار الحركة
    const moveLeft =
      this.cursors.left.isDown ||
      this.cursors.a.isDown ||
      this.vpad.left;

    const moveRight =
      this.cursors.right.isDown ||
      this.cursors.d.isDown ||
      this.vpad.right;

    const moveUp =
      this.cursors.up.isDown ||
      this.cursors.w.isDown ||
      this.vpad.up;

    const moveDown =
      this.cursors.down.isDown ||
      this.cursors.s.isDown ||
      this.vpad.down;

    // حساب اتجاه الحركة
    let vx = (moveRight ? 1 : 0) - (moveLeft ? 1 : 0);
    let vy = (moveDown ? 1 : 0) - (moveUp ? 1 : 0);

    if (vx !== 0 || vy !== 0) {
      const len = Math.hypot(vx, vy);

      const stepX = (vx / len) * SPEED * dt;
      const stepY = (vy / len) * SPEED * dt;

      // فحص كل محور بشكل مستقل للسماح بالحركة بجانب الحوائط
      if (this.boxFree(p.x + stepX, p.y)) {
        p.x += stepX;
      }

      if (this.boxFree(p.x, p.y + stepY)) {
        p.y += stepY;
      }

      // تحديد اتجاه الشخصية
      const dir =
        vx < 0 ? 'left' :
        vx > 0 ? 'right' :
        vy < 0 ? 'up' :
        'down';

      this.player.facing = dir;
      this.player.moving = true;

      // تشغيل أنيميشن الحركة
      const animation = `${appearance}_${dir}`;
      const cur = this.player.anims.currentAnim;

      if (
        !cur ||
        cur.key !== animation ||
        !this.player.anims.isPlaying
      ) {
        this.player.anims.play(animation, true);
      }

    } else {
      // إيقاف الحركة وإظهار صورة الوقوف
      this.player.moving = false;

      if (this.player.anims.isPlaying) {
        this.player.anims.stop();
      }

      const idle = this.getIdleTexture(appearance);

      if (this.player.texture.key !== idle) {
        this.player.setTexture(idle);
      }
    }

    // توحيد حجم الشخصية وتثبيتها عند القدمين
    this.player.setScale(
      PLAYER_TARGET_H / this.player.frame.realHeight
    );

    this.player.setPosition(p.x, p.y);
    this.player.setDepth(p.y);

    // تحديد الغرفة الحالية
    const roomName = this.getRoomName();

    // التفاعل بزر E أو زر اللمس القادم من UIScene
    if (
      Phaser.Input.Keyboard.JustDown(this.keyE) ||
      this.vpad.action
    ) {
      this.vpad.action = false;

      this.toast.setText('تفاعل: ' + roomName);
      this.toastUntil = time + 1500;
    }

    // تحديث HUD
    const cam = this.cameras.main;
    const wv = cam.worldView;
    const zoom = cam.zoom || 1;

    if (this.hud.text !== roomName) {
      this.hud.setText(roomName);
    }

    // تثبيت حجم HUD بصرياً مهما تغير تكبير الكاميرا
    this.hud.setScale(1 / zoom);

    this.hud.setPosition(
      wv.x + 12 / zoom,
      wv.y + 12 / zoom
    );

    // تحديث رسالة التفاعل
    const toastOffset = this.isMobile ? 120 : 40;

    this.toast.setScale(1 / zoom);

    this.toast
      .setPosition(
        wv.x + wv.width / 2,
        wv.y + wv.height - toastOffset / zoom
      )
      .setVisible(time < this.toastUntil);
  }
}
