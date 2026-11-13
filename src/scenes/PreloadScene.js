import * as Phaser from "phaser";
import { CHARACTER_SHEET, UI_FONT } from "../config/constants.js";
import { addLogo, goTo } from "../utils/ui.js";
import neilAssets from "../data/assets/neil/neil-assets.json";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  preload() {
    this.started = this.time.now;
    this.layout();
    this.scale.on("resize", this.layout, this);
    this.events.once("shutdown", () =>
      this.scale.off("resize", this.layout, this),
    );

    this.load.on("progress", (p) => {
      this.progress = p;
      this.drawBar();
    });
    this.load.on("loaderror", (f) =>
      console.warn("Asset failed to load:", f.src),
    );
    this.load.spritesheet("character", CHARACTER_SHEET, {
      frameWidth: 42,
      frameHeight: 64,
    });
    for (const direction of Object.values(neilAssets.directions)) {
      this.load.spritesheet(direction.textureKey, direction.runtimePath, {
        frameWidth: neilAssets.frameWidth,
        frameHeight: neilAssets.frameHeight,
      });
    }
  }

  create() {
    this.progress = 1;
    this.drawBar();
    const wait = Math.max(0, 1400 - (this.time.now - this.started));
    this.time.delayedCall(wait + 250, () => goTo(this, "Menu"));
  }

  layout() {
    this.tweens.killAll();
    this.children.removeAll(true);
    const w = this.scale.width,
      h = this.scale.height;
    this.cameras.main.setBackgroundColor("#1b0b07");
    for (let i = 0; i < 50; i++)
      this.add.rectangle(
        Math.random() * w,
        Math.random() * h,
        2,
        2,
        0xff8a3d,
        0.15 + Math.random() * 0.3,
      );

    this.logo = addLogo(
      this,
      w / 2,
      h * 0.4,
      Math.min(w * 0.75, 700),
      h * 0.38,
    );
    this.tweens.add({
      targets: this.logo,
      alpha: 0.65,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.barW = Math.min(w * 0.6, 420);
    this.barX = w / 2 - this.barW / 2;
    this.barY = h * 0.68;
    this.barG = this.add.graphics();
    this.pctText = this.add
      .text(w / 2, this.barY + 34, "0%", {
        fontFamily: UI_FONT,
        fontSize: "18px",
        color: "#ffd23d",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.add
      .text(w / 2, this.barY - 22, "LOADING", {
        fontFamily: UI_FONT,
        fontSize: "14px",
        color: "#ff8a3d",
      })
      .setOrigin(0.5);
    this.drawBar();
  }

  drawBar() {
    if (!this.barG) return;
    const p = this.progress || 0;
    this.barG.clear();
    this.barG.fillStyle(0x000000, 0.5);
    this.barG.fillRect(this.barX, this.barY, this.barW, 16);
    this.barG.fillStyle(0xff8a3d, 1);
    const filled = Math.floor(((this.barW - 6) * p) / 8) * 8;
    this.barG.fillRect(this.barX + 3, this.barY + 3, filled, 10);
    this.barG.lineStyle(3, 0x7c2d12, 1);
    this.barG.strokeRect(this.barX, this.barY, this.barW, 16);
    this.pctText.setText(Math.round(p * 100) + "%");
  }
}
