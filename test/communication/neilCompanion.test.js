import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import neilAssets from "../../src/data/assets/neil/neil-assets.json";
import neilDialogue from "../../src/data/dialogue/neil-tutorial.json";
import { NeilDialogueController } from "../../src/features/communication/neil/application/NeilDialogueController.js";
import {
  getFollowCommand,
  getFollowTarget,
  getInitialNeilPosition,
  NEIL_FOLLOW_DISTANCE,
  NEIL_MAX_SPEED,
  NEIL_MIN_PLAYER_GAP,
} from "../../src/features/communication/neil/application/NeilCompanionController.js";
import { NeilTutorialController } from "../../src/features/communication/neil/application/NeilTutorialController.js";
import { directionFromVector } from "../../src/features/communication/neil/domain/NeilDirection.js";
import { NEIL_STATE } from "../../src/features/communication/neil/domain/NeilState.js";

describe("N.E.I.L. companion assets and behavior", () => {
  it("registers four distinct, static directional frames from the approved pack", () => {
    expect(Object.keys(neilAssets.directions)).toEqual([
      "south",
      "west",
      "east",
      "north",
    ]);
    expect(neilAssets.licenseStatus).toBe("UNVERIFIED");
    expect(neilAssets.sequenceStatus).toBe("pose_sequence_unverified");
    for (const [direction, asset] of Object.entries(neilAssets.directions)) {
      expect(asset.stableFrame).toBe(0);
      expect(existsSync(resolve("public", asset.runtimePath))).toBe(true);
      expect(
        existsSync(
          resolve(
            "assets/source/NEIL_Sprite_Pack/game_ready/frames",
            asset.sourceFrame,
          ),
        ),
      ).toBe(true);
      expect(direction).toBe(asset.sourceFrame.split("_")[1]);
    }
  });

  it("spawns behind REVO at the configured distance and uses real directional views", () => {
    const spawn = getInitialNeilPosition({ x: 100, y: 100 }, "north");
    expect(spawn).toEqual({ x: 72, y: 188 });
    expect(directionFromVector(-20, 2)).toBe("west");
    expect(directionFromVector(20, 2)).toBe("east");
    expect(directionFromVector(2, -20)).toBe("north");
    expect(directionFromVector(2, 20)).toBe("south");
    expect(directionFromVector(0, 0, "west")).toBe("west");
    expect(getFollowTarget({ x: 100, y: 100 }, "up")).toEqual({
      x: 100,
      y: 196,
    });
  });

  it("keeps a minimum follow gap, avoids reserved approach points, and stays stationary near its target", () => {
    const player = { x: 300, y: 300 };
    const clearTarget = getFollowTarget(player, "north");
    expect(Math.hypot(clearTarget.x - player.x, clearTarget.y - player.y)).toBe(
      NEIL_FOLLOW_DISTANCE,
    );
    expect(NEIL_FOLLOW_DISTANCE).toBeGreaterThan(NEIL_MIN_PLAYER_GAP);
    const reservedTarget = getFollowTarget(player, "north", [
      { x: 300, y: 396, radius: 50 },
    ]);
    expect(reservedTarget).not.toEqual(clearTarget);

    const settled = getFollowCommand({
      companion: clearTarget,
      player,
      playerDirection: "north",
      deltaMs: 16,
    });
    expect(settled.state).toBe(NEIL_STATE.IDLE);
    expect(settled.velocity).toEqual({ x: 0, y: 0 });
  });

  it("transitions to following smoothly and remains stable across repeated updates", () => {
    const player = { x: 300, y: 300 };
    let companion = { x: 100, y: 300 };
    let velocity = { x: 0, y: 0 };
    let command;
    for (let i = 0; i < 120; i++) {
      command = getFollowCommand({
        companion,
        velocity,
        player,
        playerDirection: "north",
        deltaMs: 16,
      });
      expect(Number.isFinite(command.velocity.x)).toBe(true);
      expect(Number.isFinite(command.velocity.y)).toBe(true);
      expect(
        Math.hypot(command.velocity.x, command.velocity.y),
      ).toBeLessThanOrEqual(NEIL_MAX_SPEED + 0.01);
      companion = {
        x: companion.x + command.velocity.x * 0.016,
        y: companion.y + command.velocity.y * 0.016,
      };
      velocity = command.velocity;
    }
    expect(command.state).toBe(NEIL_STATE.FOLLOWING);
    expect(command.direction).toBe("east");
  });
});

describe("N.E.I.L. authored dialogue and tutorial", () => {
  it("advances through welcome and movement guidance without blocking the movement state", () => {
    const dialogue = new NeilDialogueController(neilDialogue.tutorial);
    const tutorial = new NeilTutorialController(dialogue);
    expect(tutorial.start()).toBe(true);
    expect(dialogue.activeId).toBe("welcome");
    tutorial.advance();
    expect(dialogue.activeId).toBe("movement");
    tutorial.advance();
    expect(dialogue.activeId).toBeNull();
    expect(tutorial.awaitingMovement).toBe(true);
    expect(tutorial.onPlayerMoved()).toBe(true);
    expect(dialogue.activeId).toBe("exploration");
  });

  it("shows the Communication Room hint once and supports Skip Tutorial", () => {
    const dialogue = new NeilDialogueController(neilDialogue.tutorial);
    const tutorial = new NeilTutorialController(dialogue);
    tutorial.start();
    tutorial.advance();
    tutorial.advance();
    tutorial.onPlayerMoved();
    tutorial.advance();
    expect(tutorial.onCommunicationEntranceNearby()).toBe(true);
    expect(dialogue.activeId).toBe("communicationEntrance");
    tutorial.advance();
    expect(tutorial.onCommunicationEntranceNearby()).toBe(false);
    tutorial.skip();
    expect(tutorial.skipped).toBe(true);
    expect(dialogue.activeId).toBeNull();
    expect(tutorial.onCommunicationEntranceNearby()).toBe(false);
  });

  it("deduplicates authored tutorial lines while allowing repeatable station dialogue", () => {
    const dialogue = new NeilDialogueController(neilDialogue.tutorial);
    expect(dialogue.show("welcome", { once: true })).toBe(true);
    dialogue.hide();
    expect(dialogue.show("welcome", { once: true })).toBe(false);
    expect(dialogue.show("communicationsConsole")).toBe(true);
    dialogue.hide();
    expect(dialogue.show("communicationsConsole")).toBe(true);
  });
});
