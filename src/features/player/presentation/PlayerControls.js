import * as Phaser from "phaser";

const DIRECTIONS = [
  ["up", "↑"],
  ["down", "↓"],
  ["left", "←"],
  ["right", "→"],
];

export class PlayerControls {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.held = {
      up: false,
      down: false,
      left: false,
      right: false,
      action: false,
    };
    this.keys = scene.input.keyboard.addKeys({
      up: "UP",
      down: "DOWN",
      left: "LEFT",
      right: "RIGHT",
      w: "W",
      a: "A",
      s: "S",
      d: "D",
    });
    this.actionKey = scene.input.keyboard.addKey("E");
    this.buttons = new Map();
    this.createTouchControls();
    this.mobile = false;
    this.onResize = () => this.layoutTouchControls();
    scene.scale.on("resize", this.onResize);
    this.layoutTouchControls();
  }

  createTouchControls() {
    for (const [direction, label] of DIRECTIONS) {
      const background = this.scene.add
        .rectangle(0, 0, 52, 52, 0x271410, 0.72)
        .setStrokeStyle(2, 0xffb36a, 0.9)
        .setInteractive();
      const text = this.scene.add
        .text(0, 0, label, {
          fontSize: "28px",
          color: "#fff0dc",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
      this.bindHold(background, direction);
      background.setScrollFactor(0).setDepth(20000);
      text.setScrollFactor(0).setDepth(20001);
      this.buttons.set(direction, { background, text });
    }
    this.actionButton = this.scene.add
      .rectangle(0, 0, 66, 58, 0xb96a27, 0.84)
      .setStrokeStyle(3, 0xffd77a, 1)
      .setInteractive();
    this.actionText = this.scene.add
      .text(0, 0, "E  ACT", {
        fontSize: "16px",
        color: "#fff0dc",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.bindHold(this.actionButton, "action");
    this.actionButton.setScrollFactor(0).setDepth(20000);
    this.actionText.setScrollFactor(0).setDepth(20001);
  }

  bindHold(button, direction) {
    const set = (active) => {
      this.held[direction] = active;
      if (direction === "action" && active) this.held.action = true;
      if (direction !== "action")
        button.setFillStyle(0xffa64d, active ? 0.92 : 0.72);
    };
    button.on("pointerdown", (pointer) => {
      pointer.event?.preventDefault?.();
      set(true);
    });
    for (const event of ["pointerup", "pointerupoutside", "pointerout"])
      button.on(event, () => set(false));
  }

  layoutTouchControls() {
    const { width, height } = this.scene.scale;
    this.mobile =
      width < 760 || window.matchMedia?.("(pointer: coarse)").matches === true;
    const visible = this.mobile;
    for (const pair of this.buttons.values()) {
      pair.background.setVisible(visible);
      pair.text.setVisible(visible);
    }
    this.actionButton.setVisible(visible);
    this.actionText.setVisible(visible);
    if (!visible) return;

    const scale = Math.max(
      0.78,
      Math.min(1, Math.min(width / 390, height / 700)),
    );
    const left = 78 * scale;
    const bottom = height - 104 * scale;
    const step = 54 * scale;
    const positions = {
      up: [left, bottom - step],
      down: [left, bottom + step],
      left: [left - step, bottom],
      right: [left + step, bottom],
    };
    for (const [direction, pair] of this.buttons) {
      const [x, y] = positions[direction];
      pair.background.setPosition(x, y).setScale(scale);
      pair.text.setPosition(x, y).setScale(scale);
    }
    this.actionButton
      .setPosition(width - 66 * scale, height - 66 * scale)
      .setScale(scale);
    this.actionText
      .setPosition(this.actionButton.x, this.actionButton.y)
      .setScale(scale);
  }

  update(isIndoor) {
    const speed = 190;
    const body = this.player.body;
    body.setVelocity(0);
    const left = this.keys.left.isDown || this.keys.a.isDown || this.held.left;
    const right =
      this.keys.right.isDown || this.keys.d.isDown || this.held.right;
    const up = this.keys.up.isDown || this.keys.w.isDown || this.held.up;
    const down = this.keys.down.isDown || this.keys.s.isDown || this.held.down;
    const prefix = isIndoor ? "in_" : "out_";
    let moving = false;
    if (left) {
      body.setVelocityX(-speed);
      this.player.anims.play(`${prefix}left`, true);
      moving = true;
    } else if (right) {
      body.setVelocityX(speed);
      this.player.anims.play(`${prefix}right`, true);
      moving = true;
    }
    if (up) {
      body.setVelocityY(-speed);
      if (!moving) this.player.anims.play(`${prefix}up`, true);
      moving = true;
    } else if (down) {
      body.setVelocityY(speed);
      if (!moving) this.player.anims.play(`${prefix}down`, true);
      moving = true;
    }
    if (!moving) this.player.anims.stop();
    if (body.velocity.x !== 0 || body.velocity.y !== 0)
      body.velocity.normalize().scale(speed);
  }

  consumeAction() {
    const pressed =
      Phaser.Input.Keyboard.JustDown(this.actionKey) || this.held.action;
    this.held.action = false;
    return pressed;
  }

  destroy() {
    this.scene.scale.off("resize", this.onResize);
    for (const pair of this.buttons.values()) {
      pair.background.destroy();
      pair.text.destroy();
    }
    this.actionButton.destroy();
    this.actionText.destroy();
  }
}
