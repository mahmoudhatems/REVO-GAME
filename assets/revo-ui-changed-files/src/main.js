import * as Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { InstructionsScene, BriefingScene } from './scenes/PagedScene.js';
import { IntroScene } from './scenes/IntroScene.js';
import { GameScene } from './scenes/GameScene.js';
import { UIScene } from './scenes/UIScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { HudScene } from './features/hud/HudScene.js';
import { StationScene } from './features/stations/StationScene.js';
import { MissionFlowScene } from './features/mission/ui/MissionFlowScene.js';
import { LogbookScene } from './features/logbook/LogbookScene.js';
import { ObjectivesScene, ControlsScene } from './features/pause/InfoScenes.js';

// إعدادات المحرك وتمرير مصفوفة المشاهد
const config = {
  type: Phaser.AUTO,
  backgroundColor: '#a8381f',
  physics: { default: 'arcade' },
  input: { activePointers: 3 },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.NO_CENTER,
    width: '100%',
    height: '100%'
  },
  scene: [BootScene, PreloadScene, MenuScene, InstructionsScene, BriefingScene, IntroScene, GameScene, UIScene, HudScene, PauseScene, StationScene, MissionFlowScene, LogbookScene, ObjectivesScene, ControlsScene]
};

// بدء تشغيل اللعبة
const game = new Phaser.Game(config);
// Test hook: only exposed when the page is opened with ?debug (used by headless UI checks).
if (new URLSearchParams(location.search).has('debug')) window.__REVO_GAME__ = game;
