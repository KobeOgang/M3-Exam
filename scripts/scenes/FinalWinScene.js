export class FinalWinScene extends Phaser.Scene {
    constructor() {
        super('FinalWinScene');
    }

    init(data) {
        this.finalScore = data.score;
        this.finalCoins = data.coins;
        this.nextLevel = data.nextLevel;
        this.currentLevel = data.currentLevel;
    }

    preload() {
        this.load.bitmapFont('font', '../assets/fonts/minogram_6x10.png', '../assets/fonts/minogram_6x10.xml');
    }

    create() {
        this.finalWinMusic = this.sound.add('finalWinMusic', {volume: 1, loop: true});
        this.finalWinMusic.play();

        const storyTexts = [
            "Emerging from the dungeon's depth",
            "With treasures gained and bated breath",
            "The riches now in your possession",
            "Mark the end of your grim repression",
            "No more shadows, no more strife",
            "You've reclaimed your worthy life",
            "With gold and gems, a fortune vast",
            "Return to the surface, free at last",
        ];

        let currentTextIndex = 0;
        const textObject = this.add.bitmapText(this.cameras.main.centerX, this.cameras.main.centerY, 'font', '', 30)
            .setOrigin(0.5)
            .setAlpha(0);

        const showNextText = () => {
            if (currentTextIndex >= storyTexts.length) {
                this.cameras.main.fadeOut(3000, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('GameScene5');
                });
                return;
            }

            textObject.setText(storyTexts[currentTextIndex]);
            currentTextIndex++;

            this.tweens.add({
                targets: textObject,
                alpha: 1,
                duration: 1000,
                ease: 'Power1',
                yoyo: true,
                hold: 3000,
                onComplete: showNextText
            });
        };

        showNextText();
    }
}
