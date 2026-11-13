import neilAssets from "../../../../data/assets/neil/neil-assets.json";
import { getFollowCommand } from "../application/NeilCompanionController.js";
import { normalizeNeilDirection } from "../domain/NeilDirection.js";

export class NeilCompanion {
  constructor(scene, { x, y, blockers, leader, reservedPoints = [] }) {
    this.scene = scene;
    this.leader = leader;
    this.reservedPoints = reservedPoints;
    this.direction = "south";
    this.velocity = { x: 0, y: 0 };
    this.talking = false;
    const descriptor = neilAssets.directions[this.direction];
    this.sprite = scene.physics.add
      .sprite(x, y, descriptor.textureKey, descriptor.stableFrame)
      .setOrigin(0.5, neilAssets.groundContact.y / neilAssets.frameHeight)
      .setDepth(100 + y + 20);
    this.sprite.setFrame(descriptor.stableFrame);
    this.sprite.body.setSize(22, 18).setOffset(21, 41);
    if (blockers) scene.physics.add.collider(this.sprite, blockers);
    if (leader) scene.physics.add.collider(this.sprite, leader);
    scene.events.once("shutdown", this.destroy, this);
  }

  setTalking(value) {
    this.talking = Boolean(value);
  }

  facePlayer() {
    if (!this.leader) return;
    const dx = this.leader.x - this.sprite.x;
    const dy = this.leader.y - this.sprite.y;
    if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
    this.setDirection(
      Math.abs(dx) > Math.abs(dy)
        ? dx < 0
          ? "west"
          : "east"
        : dy < 0
          ? "north"
          : "south",
    );
  }

  setDirection(direction) {
    if (direction === this.direction) return;
    const descriptor = neilAssets.directions[direction];
    if (!descriptor) return;
    this.direction = direction;
    this.sprite.setTexture(descriptor.textureKey, descriptor.stableFrame);
  }

  update(delta) {
    if (!this.sprite.active || !this.leader?.active) return;
    const command = getFollowCommand({
      companion: { x: this.sprite.x, y: this.sprite.y },
      velocity: this.velocity,
      player: { x: this.leader.x, y: this.leader.y },
      playerDirection: this.leaderDirection ?? "north",
      deltaMs: delta,
      reservedPoints: this.reservedPoints,
      isTalking: this.talking,
      currentDirection: this.direction,
    });
    let vx = command.velocity.x;
    let vy = command.velocity.y;
    if (this.sprite.body.blocked.left || this.sprite.body.blocked.right) vx = 0;
    if (this.sprite.body.blocked.up || this.sprite.body.blocked.down) vy = 0;
    this.velocity = { x: vx, y: vy };
    this.sprite.body.setVelocity(vx, vy);
    if (this.talking) this.facePlayer();
    else this.setDirection(command.direction);
    this.sprite.setDepth(100 + this.sprite.y + 20);
  }

  setLeaderDirection(direction) {
    this.leaderDirection = normalizeNeilDirection(direction);
  }

  destroy() {
    if (!this.scene) return;
    this.scene.events.off("shutdown", this.destroy, this);
    this.sprite?.destroy();
    this.scene = null;
  }
}
