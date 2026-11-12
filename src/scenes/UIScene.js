import * as Phaser from "phaser";
import { makeButton } from "../utils/ui.js";

export class UIScene extends Phaser.Scene {
  constructor() {
    super("UI");
  }

  create() {
    this.btn = makeButton(this, 0, 0, 46, 40, "II", () => this.togglePause(), {
      fs: 20,
    });
    this.place();
    this.scale.on("resize", this.place, this);
    this.events.once("shutdown", () =>
      this.scale.off("resize", this.place, this),
    );
    this.input.keyboard.on("keydown-ESC", () => this.togglePause());
    this.input.keyboard.on("keydown-P", () => this.togglePause());
  }

  place() {
    this.btn.setPosition(this.scale.width - 36, 34);
    this.btn.input.hitArea.x = 0;
  }

  update() {
    this.btn.setVisible(
      this.scene.isActive("Game") || this.scene.isActive("Interior"),
    );
  }

  togglePause() {
    const targetScene = this.scene.isActive("Interior") ? "Interior" : "Game";
    if (this.scene.isPaused(targetScene)) {
      const p = this.scene.get("Pause");
      if (p && p.handleEsc) p.handleEsc();
    } else if (this.scene.isActive(targetScene)) {
      this.scene.pause(targetScene);
      this.scene.launch("Pause", { targetScene });
    }
  }
}
