import * as Phaser from "phaser";
import layout from "../data/interiors/communication-room.json";
import { PlayerControls } from "../features/player/presentation/PlayerControls.js";
import { DoorAnimator } from "../features/facilities/presentation/DoorAnimator.js";
import { facilitySession } from "../features/facilities/domain/facilitySession.js";
import { AudioFX } from "../utils/audio.js";
import neilDialogueData from "../data/dialogue/neil-tutorial.json";
import { NeilDialogueController } from "../features/communication/neil/application/NeilDialogueController.js";
import { NeilCompanion } from "../features/communication/neil/presentation/NeilCompanion.js";

const nearestTarget = (targets, position) => {
  let result = null;
  let distance = Number.POSITIVE_INFINITY;
  for (const target of targets) {
    const current = Math.hypot(
      position.x - target.position.x,
      position.y - target.position.y,
    );
    if (current <= target.radiusPx && current < distance) {
      result = target;
      distance = current;
    }
  }
  return result;
};

export class InteriorScene extends Phaser.Scene {
  constructor() {
    super("Interior");
    this.layout = layout;
  }

  init(data) {
    this.transition = data.transition ?? facilitySession.getTransition();
    this.neilDialogue =
      data.neilDialogue ??
      new NeilDialogueController(neilDialogueData.tutorial);
    this.neilTutorial = data.neilTutorial ?? null;
  }

  preload() {
    for (const asset of this.layout.assets) {
      if (!this.textures.exists(asset.assetId))
        this.load.image(asset.assetId, asset.runtimePath);
    }
  }

  create() {
    if (this.transition?.facilityId !== this.layout.facilityId) {
      throw new Error(
        "InteriorScene requires a registered facility transition.",
      );
    }
    const { widthPx, heightPx } = this.layout.dimensions;
    this.transitioning = true;
    this.cameras.main.setBackgroundColor("#17100f");
    this.cameras.main.setBounds(0, 0, widthPx, heightPx);
    this.cameras.main.setRoundPixels(true);
    this.physics.world.setBounds(0, 0, widthPx, heightPx);
    this.renderRoom();
    this.createCollisions();
    this.createPlayer();
    this.createDoor();
    this.createInterface();
    this.cameras.main.startFollow(this.player, true, 0.16, 0.16);
    this.cameras.main.setZoom(
      Math.min(1.5, this.scale.width / widthPx, this.scale.height / heightPx),
    );
    this.controls = new PlayerControls(this, this.player);
    this.controls.direction = "up";
    this.createNeilCompanion();
    this.scale.on("resize", this.resize, this);
    this.events.once("shutdown", () => {
      this.scale.off("resize", this.resize, this);
      this.controls?.destroy();
      this.neilCompanion?.destroy();
    });
    this.input.keyboard.resetKeys();
    this.cameras.main.fadeIn(180, 0, 0, 0);
    this.transitioning = false;
    if (!this.neilDialogue.activeId) {
      this.neilDialogue.show("roomWelcome", { once: true });
    }
    this.scene.bringToTop("UI");
    this.scene.bringToTop("Hud");
  }

  createNeilCompanion() {
    const reservedPoints = [
      ...this.layout.interactables.map((item) => ({
        x: item.position.x,
        y: item.position.y,
        radius: item.radiusPx + 28,
      })),
      {
        x: this.layout.exit.x,
        y: this.layout.exit.y,
        radius: this.layout.exit.interactionRadiusPx + 20,
      },
    ];
    this.neilCompanion = new NeilCompanion(this, {
      x: 410,
      y: 320,
      blockers: this.blockers,
      leader: this.player,
      reservedPoints,
    });
    this.neilCompanion.setLeaderDirection(this.controls.direction);
    this.scene.get("UI")?.setNeilContext({
      companion: this.neilCompanion,
      dialogue: this.neilDialogue,
      tutorial: this.neilTutorial,
      worldScene: this,
    });
  }

  renderRoom() {
    const { widthPx, heightPx } = this.layout.dimensions;
    this.add
      .tileSprite(widthPx / 2, heightPx / 2, widthPx, heightPx, "FLT-0001")
      .setDepth(-20);
    const walls = this.add.graphics().setDepth(20);
    walls.fillStyle(0x332824, 1);
    walls.fillRect(0, 0, widthPx, 18);
    walls.fillRect(0, 0, 18, heightPx);
    walls.fillRect(widthPx - 18, 0, 18, heightPx);
    walls.fillRect(0, heightPx - 18, this.layout.collision.exitOpening.x, 18);
    const gapEnd =
      this.layout.collision.exitOpening.x +
      this.layout.collision.exitOpening.width;
    walls.fillRect(gapEnd, heightPx - 18, widthPx - gapEnd, 18);
    walls
      .lineStyle(2, 0xc87b4c, 1)
      .strokeRect(18, 18, widthPx - 36, heightPx - 36);
    for (const [x, y] of [
      [18, 18],
      [widthPx - 18, 18],
      [18, heightPx - 18],
      [widthPx - 18, heightPx - 18],
    ]) {
      this.add.image(x, y, "WAL-0003").setOrigin(0.5).setDepth(21);
    }

    this.add
      .text(widthPx / 2, 42, "ALPHA BASE  /  COMMUNICATIONS", {
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        fontStyle: "bold",
        color: "#fff0dc",
        backgroundColor: "#3b211a",
        padding: { left: 10, right: 10, top: 6, bottom: 6 },
      })
      .setOrigin(0.5)
      .setDepth(1000);
    this.createEquipment();
  }

  createEquipment() {
    for (const item of this.layout.interactables) {
      if (item.assetId) {
        this.add
          .image(item.position.x, item.position.y - 28, item.assetId)
          .setScale(2)
          .setDepth(100 + item.position.y);
      } else {
        const display = this.add.graphics().setDepth(100 + item.position.y);
        display
          .fillStyle(0x252b33, 1)
          .fillRoundedRect(
            item.position.x - 34,
            item.position.y - 40,
            68,
            66,
            5,
          );
        display
          .lineStyle(3, 0xf4a84f, 1)
          .strokeRoundedRect(
            item.position.x - 34,
            item.position.y - 40,
            68,
            66,
            5,
          );
        display
          .fillStyle(0x1b5363, 1)
          .fillRect(item.position.x - 27, item.position.y - 33, 54, 33);
        display
          .fillStyle(0x63d2d0, 0.85)
          .fillRect(item.position.x - 19, item.position.y - 23, 25, 3);
        display
          .fillStyle(0x63d2d0, 0.55)
          .fillRect(item.position.x - 19, item.position.y - 15, 42, 3);
        display
          .fillStyle(0x665042, 1)
          .fillRect(item.position.x - 24, item.position.y + 26, 48, 10);
        if (item.kind === "mission-terminal-placeholder") {
          this.add
            .text(
              item.position.x,
              item.position.y + 2,
              "MISSION BRIEFING\nPLACEHOLDER",
              {
                fontFamily: "Arial, sans-serif",
                fontSize: "8px",
                color: "#fff0dc",
                align: "center",
              },
            )
            .setOrigin(0.5)
            .setDepth(300);
        }
      }
      this.add
        .text(item.position.x, item.position.y + 48, item.title, {
          fontFamily: "Arial, sans-serif",
          fontSize: "10px",
          fontStyle: "bold",
          color: "#fff0dc",
          backgroundColor: "#38221d",
          padding: { left: 5, right: 5, top: 3, bottom: 3 },
          align: "center",
          wordWrap: { width: 154 },
        })
        .setOrigin(0.5)
        .setDepth(1000);
    }
  }

  createCollisions() {
    this.blockers = this.physics.add.staticGroup();
    const { widthPx, heightPx } = this.layout.dimensions;
    const thickness = this.layout.collision.wallThicknessPx;
    const { x: gapX, width: gapWidth } = this.layout.collision.exitOpening;
    const rectangles = [
      { x: 0, y: 0, width: widthPx, height: thickness },
      { x: 0, y: 0, width: thickness, height: heightPx },
      { x: widthPx - thickness, y: 0, width: thickness, height: heightPx },
      { x: 0, y: heightPx - thickness, width: gapX, height: thickness },
      {
        x: gapX + gapWidth,
        y: heightPx - thickness,
        width: widthPx - gapX - gapWidth,
        height: thickness,
      },
      { x: gapX, y: heightPx - 30, width: gapWidth, height: 12 },
    ];
    for (const item of this.layout.interactables) {
      rectangles.push({
        x: item.position.x - 32,
        y: item.position.y - 30,
        width: 64,
        height: 34,
      });
    }
    for (const rectangle of rectangles) {
      const body = this.blockers.create(
        rectangle.x + rectangle.width / 2,
        rectangle.y + rectangle.height / 2,
        "__DEFAULT",
      );
      body
        .setDisplaySize(rectangle.width, rectangle.height)
        .refreshBody()
        .setVisible(false);
    }
  }

  createPlayer() {
    const { x, y } = this.layout.entry;
    this.player = this.physics.add.sprite(x, y, "character");
    this.player.setDepth(100 + y);
    this.player.body.setSize(20, 30);
    this.player.body.setOffset(11, 34);
    this.physics.add.collider(this.player, this.blockers);
  }

  createDoor() {
    const { widthPx, heightPx } = this.layout.dimensions;
    const x = widthPx / 2;
    const y = heightPx;
    const closed = this.add
      .image(x, y, "DOR-0005")
      .setOrigin(0.5, 1)
      .setDepth(100 + y);
    const open = this.add
      .image(x, y, "DOR-0006")
      .setOrigin(0.5, 1)
      .setDepth(101 + y)
      .setVisible(true);
    closed.setVisible(false);
    this.doorAnimator = new DoorAnimator(this, { closed, open });
  }

  createInterface() {
    const style = {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#fff0dc",
      backgroundColor: "#281914",
      padding: { left: 9, right: 9, top: 6, bottom: 6 },
    };
    this.titleText = this.add
      .text(14, 14, this.layout.title, style)
      .setScrollFactor(0)
      .setDepth(30000);
    this.prompt = this.add
      .text(14, 56, "WASD / ARROWS TO MOVE", { ...style, color: "#ffd77a" })
      .setScrollFactor(0)
      .setDepth(30000);
    this.toast = this.add
      .text(this.scale.width / 2, this.scale.height - 20, "", {
        ...style,
        fontSize: "16px",
        wordWrap: { width: Math.min(620, this.scale.width - 40) },
        align: "center",
      })
      .setOrigin(0.5, 1)
      .setScrollFactor(0)
      .setDepth(30001)
      .setVisible(false);
    this.toastUntil = 0;
  }

  resize() {
    this.cameras.main.setZoom(
      Math.min(
        1.5,
        this.scale.width / this.layout.dimensions.widthPx,
        this.scale.height / this.layout.dimensions.heightPx,
      ),
    );
    this.toast?.setPosition(this.scale.width / 2, this.scale.height - 20);
  }

  update(time, delta) {
    if (!this.player || !this.controls) return;
    this.controls.update(true, !this.transitioning);
    this.neilCompanion?.setLeaderDirection(this.controls.direction);
    this.neilCompanion?.update(delta);
    const exitDistance = Math.hypot(
      this.player.x - this.layout.exit.x,
      this.player.y - this.layout.exit.y,
    );
    const atExit = exitDistance <= this.layout.exit.interactionRadiusPx;
    const target = atExit
      ? null
      : nearestTarget(this.layout.interactables, this.player);
    const actionPressed = this.controls.consumeAction();
    if (actionPressed && this.neilDialogue.activeId) {
      this.scene.get("UI")?.neilBubble?.handleAction();
      return;
    }
    if (actionPressed && !this.transitioning) {
      if (atExit) this.exitInterior();
      else if (target) this.showMessage(target);
    }
    this.prompt.setText(
      this.transitioning
        ? "CLOSING COMMUNICATION ROOM..."
        : atExit
          ? "EXIT TO ALPHA BASE\nPRESS E / SPACE / ACT TO LEAVE"
          : target
            ? `${target.title}\nPRESS E / SPACE / ACT TO INTERACT`
            : "EXPLORE THE ROOM - MOVE WITH WASD / ARROWS",
    );
    this.toast.setVisible(time < this.toastUntil);
    this.player.setDepth(100 + this.player.y);
  }

  showMessage(target) {
    if (target.dialogueId && this.neilDialogue.show(target.dialogueId)) return;
    this.toast.setText(`${target.title}\n${target.message}`);
    this.toastUntil = this.time.now + 5200;
    this.toast.setVisible(true);
  }

  exitInterior() {
    if (this.transitioning) return;
    this.transitioning = true;
    this.neilDialogue.hide();
    this.player.body.setVelocity(0);
    AudioFX.blip(260, 0.12, "triangle", 0.14);
    this.doorAnimator.play(false, () => {
      this.cameras.main.fadeOut(180, 0, 0, 0);
      this.time.delayedCall(190, () => {
        const context = this.transition.returnContext;
        this.scene.get("UI")?.clearNeilContext();
        this.scene.stop("Interior");
        const exterior = this.scene.get("Game");
        exterior.finishFacilityReturn(context);
        this.scene.resume("Game");
      });
    });
  }
}
