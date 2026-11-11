import * as Phaser from "phaser";
import { BootScene } from "./scenes/BootScene.js";
import { PreloadScene } from "./scenes/PreloadScene.js";
import { MenuScene } from "./scenes/MenuScene.js";
import { InstructionsScene, BriefingScene } from "./scenes/PagedScene.js";
import { IntroScene } from "./scenes/IntroScene.js";
import { GameScene } from "./scenes/GameScene.js";
import { UIScene } from "./scenes/UIScene.js";
import { PauseScene } from "./scenes/PauseScene.js";

// إعدادات المحرك وتمرير مصفوفة المشاهد
const config = {
  type: Phaser.AUTO,
  backgroundColor: "#a8381f",
  render: { pixelArt: true, antialias: false, roundPixels: true },
  physics: { default: "arcade" },
  input: { activePointers: 3 },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.NO_CENTER,
    width: "100%",
    height: "100%",
  },
  scene: [
    BootScene,
    PreloadScene,
    MenuScene,
    InstructionsScene,
    BriefingScene,
    IntroScene,
    GameScene,
    UIScene,
    PauseScene,
  ],
};

// بدء تشغيل اللعبة
new Phaser.Game(config);
