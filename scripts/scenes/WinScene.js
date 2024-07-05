export class WinScene extends Phaser.Scene {
    constructor() {
        super('WinScene');
    }

    init(data) {
        this.finalScore = data.score;
        this.finalCoins = data.coins;
        this.nextLevel = data.nextLevel;
        this.currentLevel = data.currentLevel;
    }

    preload() {
        this.load.image('background', '../assets/images/background.png');
        this.load.image('win', '../assets/images/win.png');
        this.load.image('reset', '../assets/images/retryy.png');
        this.load.image('menu', '../assets/images/menuu.png');
        this.load.image('next', '../assets/images/nextt.png');
    }

    create() {
        this.cameras.main.fadeIn(3000, 0, 0, 0);

        //Music
        this.winMusic = this.sound.add('winMusic', { volume: 1.2, loop: true });
        this.winMusic.play();

        // Win text
        const winText = this.add.image(this.sys.game.config.width / 2, 130, 'win');

        // Score
        const scoreText = this.add.bitmapText(this.sys.game.config.width / 2, 240, 'font', 'Score: ' + this.finalScore, 25).setOrigin(0.5, 0.5).setAlpha(0);

        // Coins collected
        const coinsText = this.add.bitmapText(this.sys.game.config.width / 2, 270, 'font', 'Coins Collected: ' + this.finalCoins, 25).setOrigin(0.5, 0.5).setAlpha(0);


        // Next level button
        const nextButton = this.add.image(this.sys.game.config.width / 2, 400, 'next').setAlpha(0);
        nextButton.setScale(4);
        nextButton.setInteractive();
        nextButton.on('pointerup', () => {
            this.winMusic.stop();
            this.scene.start('GameBootScene', { nextLevel: this.nextLevel });
        });

        // Retry button
        const retryButton = this.add.image(this.sys.game.config.width / 2, 470, 'reset').setAlpha(0);
        retryButton.setScale(4);
        retryButton.setInteractive();
        retryButton.on('pointerup', () => {
            this.winMusic.stop();
            this.scene.start('GameBootScene', { nextLevel: this.currentLevel });
        });

        // Main Menu button
        const menuButton = this.add.image(this.sys.game.config.width / 2, 540, 'menu').setAlpha(0);
        menuButton.setScale(4);
        menuButton.setInteractive();
        menuButton.on('pointerup', () => {
            this.winMusic.stop();
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
            targets: nextButton,
            alpha: 1,
            duration: 1000,
            delay: 3000
        });

        this.tweens.add({
            targets: retryButton,
            alpha: 1,
            duration: 1000,
            delay: 4000
        });

        this.tweens.add({
            targets: menuButton,
            alpha: 1,
            duration: 1000,
            delay: 5000
        });
    }


    update() {

    }

}
