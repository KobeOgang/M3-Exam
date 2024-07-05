export class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.finalScore = data.score;
        this.finalCoins = data.coins;
        this.currentLevel = data.currentLevel;
    }

    preload(){
        this.load.image('background', '../assets/images/background.png');
        this.load.image('gameOver', '../assets/images/gameOver.png');
        this.load.image('again', '../assets/images/restart.png');
        this.load.image('leave', '../assets/images/leave.png');
        this.load.bitmapFont('font', '../assets/fonts/minogram_6x10.png', '../assets/fonts/minogram_6x10.xml');
        this.load.audio('winMusic', '../assets/audio/BGM/winMusic.mp3');
    }

    create() {
        this.cameras.main.fadeIn(3000, 0, 0, 0);

        //Music
        this.gameOver = this.sound.add('winMusic', { volume: 1.2, loop: true });
        this.gameOver.play();


        // Game Over text
        const gameOverText = this.add.image(this.sys.game.config.width / 2, 130, 'gameOver');
        gameOverText.setScale(1.5); 

        // Score
        const scoreText = this.add.bitmapText(this.sys.game.config.width / 2, 240, 'font', 'Score: ' + this.finalScore, 25).setOrigin(0.5, 0.5).setAlpha(0);

        // Coins collected
        const coinsText = this.add.bitmapText(this.sys.game.config.width / 2, 270, 'font', 'Coins Collected: ' + this.finalCoins, 25).setOrigin(0.5, 0.5).setAlpha(0);

        // Retry button
        const retryButton = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 140, 'again').setAlpha(0);
        retryButton.setScale(4);
        retryButton.setInteractive();
        retryButton.on('pointerup', () => {  
            this.gameOver.stop();
            this.scene.start('GameBootScene', { nextLevel: this.currentLevel });
        });
        
        // Main Menu button
        const menuButton = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 210, 'leave').setAlpha(0);
        menuButton.setScale(4);
        menuButton.setInteractive();
        menuButton.on('pointerup', () => {
            this.gameOver.stop();
            this.scene.start('MainMenuScene');
        });

        this.tweens.add({
            targets: scoreText,
            alpha: 1,
            duration: 1000,
            delay: 1000
        });

        this.tweens.add({
            targets: coinsText,
            alpha: 1,
            duration: 1000,
            delay: 2000
        });

        this.tweens.add({
            targets: retryButton,
            alpha: 1,
            duration: 1000,
            delay: 3000
        });

        this.tweens.add({
            targets: menuButton,
            alpha: 1,
            duration: 1000,
            delay: 4000
        });
    }
}
