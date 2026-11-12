
import { BootScene } from './scenes/BootScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { InstructionsScene, BriefingScene } from './scenes/PagedScene.js';
import { IntroScene } from './scenes/IntroScene.js';
import { GameScene } from './scenes/GameScene.js';
import { UIScene } from './scenes/UIScene.js';
import { PauseScene } from './scenes/PauseScene.js';

// إعدادات محرك Phaser
const config = {
  type: Phaser.AUTO,

  backgroundColor: '#000000',

  input: {
    activePointers: 3
  },

  scale: {
    // تغيير أبعاد اللعبة تلقائياً حسب حجم الشاشة
    mode: Phaser.Scale.RESIZE,

    autoCenter: Phaser.Scale.CENTER_BOTH,

    parent: 'game-container',

    // الأبعاد الأساسية قبل أول عملية Resize
    width: 1280,
    height: 720
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
    PauseScene
  ]
};

// تشغيل اللعبة
const game = new Phaser.Game(config);

export default game;
