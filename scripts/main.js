import {MainMenuScene} from './scenes/MainMenuScene.js';
import {GameScene} from './scenes/GameScene.js';
import {GameOverScene} from './scenes/GameOverScene.js';
import { BootScene } from './scenes/BootScene.js';
import { GameBootScene } from './scenes/GameBootScene.js';
import { WinScene } from './scenes/WinScene.js';
import { GameScene2 } from './scenes/GameScene2.js';
import { GameScene3 } from './scenes/GameScene3.js';
import { FinalWinScene } from './scenes/FinalWinScene.js'; 
import { GameScene4 } from './scenes/GameScene4.js';
import { EpilogueScene } from './scenes/EpilogueScene.js';
import { GameScene5 } from './scenes/GameScene5.js';
import { TrailerScene } from './scenes/TrailerScene.js';

var config = {
    type: Phaser.AUTO,
    width: 1400,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    pixelArt: true,
    scene: [BootScene, MainMenuScene, EpilogueScene, GameScene, WinScene, GameBootScene, GameScene2, GameScene3, GameScene4,GameScene5,  GameOverScene, FinalWinScene]
    //scene: [TrailerScene]
};

var game = new Phaser.Game(config);

game.scene.start('BootScene');