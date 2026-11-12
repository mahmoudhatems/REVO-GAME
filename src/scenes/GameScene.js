import * as Phaser from "phaser";
import mapData from "../data/maps/alpha-base-exterior.json";
import assetCatalog from "../data/assets/asset-catalog.json";
import { validateMapData } from "../features/world/data/mapSchema.js";
import { MapLayerRenderer } from "../features/world/render/MapLayerRenderer.js";
import {
  findNearestInteraction,
  getContainingFacility,
} from "../features/world/application/interactionRegistry.js";
import { PlayerControls } from "../features/player/presentation/PlayerControls.js";
import { AudioFX } from "../utils/audio.js";
import { getExteriorFacilityEntrances } from "../features/facilities/domain/facilityRegistry.js";
import { facilitySession } from "../features/facilities/domain/facilitySession.js";
import {
  beginFacilityTransition,
  getFacilityPrompt,
} from "../features/facilities/application/facilityInteraction.js";
import { DoorAnimator } from "../features/facilities/presentation/DoorAnimator.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
    this.map = mapData;
  }

  preload() {
    const validation = validateMapData(this.map, assetCatalog);
    if (!validation.valid)
      throw new Error(
        `Alpha Base map failed validation: ${validation.errors.join("; ")}`,
      );
    for (const asset of this.map.assets) {
      if (!this.textures.exists(asset.assetId))
        this.load.image(asset.assetId, asset.runtimePath);
    }
    this.load.image("DOR-0006", "assets/facilities/DOR-0006.png");
  }

  create() {
    const { widthPx, heightPx } = this.map.dimensions;
    this.toastUntil = 0;
    this.cameras.main.setBackgroundColor("#a9472c");
    this.cameras.main.fadeIn(350, 0, 0, 0);
    this.physics.world.setBounds(0, 0, widthPx, heightPx);

    this.mapRenderer = new MapLayerRenderer(this, this.map);
    this.mapRenderer.render();
    this.createCollisions();
    this.createPlayer();
    this.facilityEntrances = getExteriorFacilityEntrances(this.map);
    this.createCommunicationDoorAnimator();
    this.createHud();
    this.configureCamera();
    this.inputControls = new PlayerControls(this, this.player);
    this.scene.launch("UI");

    this.onResize = () => this.configureCamera();
    this.scale.on("resize", this.onResize);
    this.events.once("resume", () => this.input.keyboard.resetKeys());
    this.events.once("shutdown", () => this.shutdown());
  }

  createCollisions() {
    this.blockers = this.physics.add.staticGroup();
    for (const rectangle of this.map.layers.Collision) {
      const body = this.blockers.create(
        rectangle.x + rectangle.width / 2,
        rectangle.y + rectangle.height / 2,
        "__DEFAULT",
      );
      body
        .setDisplaySize(rectangle.width, rectangle.height)
        .refreshBody()
        .setVisible(false);
      body.setData("collisionId", rectangle.id);
      body.setData("collisionSource", rectangle.source);
    }
  }

  createCommunicationDoorAnimator() {
    const closed = this.mapRenderer.doors.get("communication:south");
    if (!closed || !this.textures.exists("DOR-0006")) return;
    const open = this.add
      .image(closed.x, closed.y, "DOR-0006")
      .setOrigin(closed.originX, closed.originY)
      .setAngle(closed.angle)
      .setDepth(closed.depth + 1)
      .setVisible(false);
    this.communicationDoorAnimator = new DoorAnimator(this, { closed, open });
  }

  createPlayer() {
    const { tileSizePx } = this.map.coordinateSystem;
    const { tile } = this.map.playerSpawn;
    this.player = this.physics.add.sprite(
      (tile.x + 0.5) * tileSizePx,
      (tile.y + 0.5) * tileSizePx,
      "character",
    );
    this.player.setDepth(100 + this.player.y);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(20, 30);
    this.player.body.setOffset(11, 34);
    this.physics.add.collider(this.player, this.blockers);
    this.createCharacterAnimations();
  }

  createCharacterAnimations() {
    const animations = [
      ["out_down", [0, 3, 0, 6]],
      ["out_up", [1, 7, 1, 7]],
      ["out_left", [2, 8, 2, 9]],
      ["out_right", [4, 5, 4, 10]],
      ["in_down", [12, 15, 12, 18]],
      ["in_up", [13, 19, 13, 19]],
      ["in_left", [14, 20, 14, 21]],
      ["in_right", [16, 17, 16, 22]],
    ];
    for (const [key, frames] of animations) {
      if (!this.anims.exists(key)) {
        this.anims.create({
          key,
          frames: this.anims.generateFrameNumbers("character", { frames }),
          frameRate: 8,
          repeat: -1,
        });
      }
    }
  }

  createHud() {
    const hudStyle = {
      fontFamily: "Arial, sans-serif",
      fontSize: "15px",
      color: "#fff2df",
      backgroundColor: "#301712",
      padding: { left: 10, right: 10, top: 7, bottom: 7 },
    };
    this.hud = this.add
      .text(14, 14, "ALPHA BASE - OUTDOOR TRAINING", hudStyle)
      .setScrollFactor(0)
      .setDepth(30000);
    this.prompt = this.add
      .text(14, 54, "Explore the base. Move with WASD or the arrow keys.", {
        ...hudStyle,
        fontSize: "13px",
        color: "#ffd77a",
      })
      .setScrollFactor(0)
      .setDepth(30000);
    this.toast = this.add
      .text(0, 0, "", {
        ...hudStyle,
        fontSize: "15px",
        wordWrap: { width: Math.min(640, this.scale.width - 36) },
        align: "center",
      })
      .setOrigin(0.5, 1)
      .setScrollFactor(0)
      .setDepth(30001)
      .setVisible(false);
  }

  configureCamera() {
    const camera = this.cameras.main;
    const { widthPx, heightPx } = this.map.dimensions;
    const zoom = this.scale.width < 760 ? 0.62 : 1;
    camera.setBounds(0, 0, widthPx, heightPx);
    camera.setZoom(zoom);
    camera.setRoundPixels(true);
    if (this.player) camera.startFollow(this.player, true, 0.12, 0.12);
  }

  showToast(interaction) {
    this.toast.setText(`${interaction.title}\n${interaction.message}`);
    this.toast
      .setPosition(this.scale.width / 2, this.scale.height - 18)
      .setVisible(true);
    this.toastUntil = this.time.now + 3200;
  }

  update(time) {
    if (!this.player || !this.inputControls) return;
    const facility = getContainingFacility(
      this.map.layers.RoomTriggers,
      this.player,
      this.map.coordinateSystem.tileSizePx,
    );
    const indoors =
      facility && !["solar-arrays", "airlock"].includes(facility.facilityId);
    this.inputControls.update(Boolean(indoors), !this.transitioning);

    const nearest = findNearestInteraction(
      this.map.layers.Interactables,
      this.player,
      this.map.coordinateSystem.tileSizePx,
    );
    const entrance = getFacilityPrompt(this.facilityEntrances, this.player);
    if (this.inputControls.consumeAction() && !this.transitioning) {
      if (entrance?.entrance.facilityId === "communication") {
        this.enterFacility(entrance.entrance);
      } else if (nearest) this.showToast(nearest.interaction);
      else {
        this.toast.setText(
          "Walk closer to a facility or the solar array to inspect it.",
        );
        this.toast
          .setPosition(this.scale.width / 2, this.scale.height - 18)
          .setVisible(true);
        this.toastUntil = time + 2200;
      }
    }

    const currentName = facility?.facilityId
      ? this.map.facilities.find((item) => item.id === facility.facilityId)
          ?.name
      : "ALPHA BASE EXTERIOR";
    this.hud.setText(currentName ?? "ALPHA BASE EXTERIOR");
    this.prompt.setText(
      this.transitioning
        ? "OPENING COMMUNICATION ROOM..."
        : entrance?.entrance.facilityId === "communication"
          ? `${entrance.entrance.name}\nPRESS E / SPACE / ACT TO ENTER`
          : nearest
            ? "E / ACT - INSPECT NEARBY FACILITY"
            : "WASD / ARROWS TO MOVE - E TO INSPECT",
    );
    this.toast.setVisible(time < this.toastUntil);
    this.player.setDepth(100 + this.player.y + 32);
  }

  enterFacility(entrance) {
    if (this.transitioning || !this.communicationDoorAnimator) return;
    const transition = beginFacilityTransition(entrance.facilityId, {
      x: this.player.x,
      y: this.player.y,
      direction: this.inputControls.direction,
    });
    if (!transition) return;
    this.transitioning = true;
    this.player.body.setVelocity(0);
    AudioFX.blip(220, 0.12, "triangle", 0.14);
    this.communicationDoorAnimator.play(true, () => {
      facilitySession.saveTransition(transition);
      this.scene.launch("Interior", { transition });
      this.scene.pause("Game");
    });
  }

  finishFacilityReturn(returnContext) {
    this.player.setPosition(returnContext.x, returnContext.y);
    this.player.body.setVelocity(0);
    this.inputControls.direction = returnContext.direction ?? "down";
    this.input.keyboard.resetKeys();
    this.cameras.main.fadeIn(180, 0, 0, 0);
    this.transitioning = true;
    AudioFX.blip(330, 0.1, "triangle", 0.12);
    this.communicationDoorAnimator.play(false, () => {
      this.transitioning = false;
      facilitySession.clearTransition();
    });
  }

  shutdown() {
    this.scale.off("resize", this.onResize);
    this.inputControls?.destroy();
    this.scene.stop("UI");
    this.scene.stop("Pause");
    this.sound.stopAll();
  }
}
