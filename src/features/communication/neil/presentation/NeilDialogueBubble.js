import neilAssets from "../../../../data/assets/neil/neil-assets.json";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export class NeilDialogueBubble {
  constructor(scene, { companion, dialogue, tutorial, worldScene }) {
    this.scene = scene;
    this.worldScene = worldScene;
    this.companion = companion;
    this.dialogue = dialogue;
    this.tutorial = tutorial;
    this.lastId = null;
    this.width = 360;
    this.height = 136;
    this.container = scene.add
      .container(0, 0)
      .setScrollFactor(0)
      .setDepth(32000)
      .setVisible(false);
    this.panel = scene.add.graphics();
    this.portrait = scene.add
      .image(29, 30, neilAssets.directions.south.textureKey, 0)
      .setOrigin(0.5);
    this.portrait.setScale(0.58);
    this.speaker = scene.add.text(58, 13, "N.E.I.L.", {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      fontStyle: "bold",
      color: "#70e4e2",
    });
    this.message = scene.add.text(58, 38, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#fff1dc",
      lineSpacing: 3,
      wordWrap: { width: 278 },
    });
    this.nextButton = this.createButton(226, 101, 108, "NEXT", () =>
      this.handleAction(),
    );
    this.skipButton = this.createButton(68, 101, 142, "SKIP TUTORIAL", () =>
      this.tutorial?.skip(),
    );
    this.container.add([
      this.panel,
      this.portrait,
      this.speaker,
      this.message,
      this.skipButton,
      this.nextButton,
    ]);
    this.scaleListener = () => this.layout();
    scene.scale.on("resize", this.scaleListener);
    this.updateListener = () => this.sync();
    scene.events.on("update", this.updateListener);
    scene.events.once("shutdown", this.destroy, this);
    this.layout();
  }

  createButton(x, y, width, label, onClick) {
    const background = this.scene.add
      .rectangle(x, y + 12, width, 30, 0x174453, 1)
      .setStrokeStyle(1, 0x65d9da, 1)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", onClick);
    const text = this.scene.add
      .text(x, y + 12, label, {
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
        fontStyle: "bold",
        color: "#ffffff",
      })
      .setOrigin(0.5);
    return this.scene.add.container(0, 0, [background, text]);
  }

  handleAction() {
    if (!this.dialogue.activeId) return false;
    if (this.typingTarget) {
      const fullText = this.typingTarget.fullText;
      this.scene.tweens.killTweensOf(this.typingTarget);
      this.typingTarget = null;
      this.message.setText(fullText);
      return true;
    }
    if (this.tutorial?.activeStep) this.tutorial.advance();
    else this.dialogue.hide();
    return true;
  }

  sync() {
    const id = this.dialogue.activeId;
    if (!id) {
      this.lastId = null;
      this.container.setVisible(false);
      this.companion?.setTalking(false);
      if (this.typingTarget) {
        this.scene.tweens.killTweensOf(this.typingTarget);
        this.typingTarget = null;
      }
      return;
    }
    if (id !== this.lastId) {
      this.lastId = id;
      this.startTypewriter(this.dialogue.currentLine ?? "");
      this.nextButton.setVisible(true);
      this.skipButton.setVisible(Boolean(this.tutorial?.activeStep));
      this.companion?.setTalking(true);
    }
    this.container.setVisible(true);
    this.layout();
  }

  startTypewriter(fullText) {
    if (this.typingTarget) this.scene.tweens.killTweensOf(this.typingTarget);
    this.typingTarget = { progress: 0, fullText };
    this.message.setText("");
    this.scene.tweens.add({
      targets: this.typingTarget,
      progress: fullText.length,
      duration: Math.min(1800, Math.max(450, fullText.length * 20)),
      onUpdate: () => {
        if (this.typingTarget) {
          this.message.setText(
            fullText.slice(0, Math.floor(this.typingTarget.progress)),
          );
        }
      },
      onComplete: () => {
        this.message.setText(fullText);
        this.typingTarget = null;
      },
    });
  }

  layout() {
    if (!this.container) return;
    const viewportWidth = this.scene.scale.width;
    const viewportHeight = this.scene.scale.height;
    this.width = Math.max(220, Math.min(360, viewportWidth - 24));
    this.message.setWordWrapWidth(this.width - 78);
    const camera = this.worldScene.cameras.main;
    // UI scene coordinates are canvas pixels. Camera.matrixCombined also
    // includes Phaser's renderer transform and can overshoot this coordinate
    // space when the world camera is zoomed or the game is letterboxed.
    const screenX =
      camera.x + (this.companion.sprite.x - camera.scrollX) * camera.zoom;
    const screenY =
      camera.y + (this.companion.sprite.y - camera.scrollY) * camera.zoom;
    const left = clamp(
      screenX - this.width / 2,
      12,
      viewportWidth - this.width - 12,
    );
    const above = screenY > this.height + 22;
    const top = above
      ? Math.max(12, screenY - this.height - 18)
      : Math.min(viewportHeight - this.height - 12, screenY + 18);
    this.container.setPosition(left, top);
    this.panel.clear();
    this.panel.fillStyle(0x0c2434, 0.97);
    this.panel.fillRoundedRect(0, 0, this.width, this.height, 10);
    this.panel.lineStyle(3, 0x43c8d3, 1);
    this.panel.strokeRoundedRect(0, 0, this.width, this.height, 10);
    const tailX = clamp(screenX - left, 22, this.width - 22);
    this.panel.fillStyle(0x0c2434, 0.97);
    this.panel.fillTriangle(
      tailX - 10,
      above ? this.height - 1 : 1,
      tailX + 10,
      above ? this.height - 1 : 1,
      tailX,
      above ? this.height + 15 : -15,
    );
    this.panel.lineStyle(2, 0x43c8d3, 1);
    this.panel.lineBetween(
      tailX - 9,
      above ? this.height : 0,
      tailX,
      above ? this.height + 14 : -14,
    );
    this.panel.lineBetween(
      tailX,
      above ? this.height + 14 : -14,
      tailX + 9,
      above ? this.height : 0,
    );
  }

  destroy() {
    this.scene.scale.off("resize", this.scaleListener);
    this.scene.events.off("update", this.updateListener);
    this.scene.events.off("shutdown", this.destroy, this);
    this.scene.tweens.killTweensOf(this.typingTarget);
    this.container?.destroy(true);
    this.worldScene = null;
    this.companion = null;
    this.scene = null;
  }
}
