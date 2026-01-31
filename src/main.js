import { Game } from './scenes/Game.js';

const config = {
    type: Phaser.AUTO,
    title: 'Overlord Rising',
    description: 'Idle Clicker RPG',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#1a1a2e',
    scene: [
        Game
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            