export class EpilogueScene extends Phaser.Scene {
    constructor() {
        super('EpilogueScene');
    }

    init(data) {

    }

    preload() {

    }

    create() {
        this.epilogue = this.sound.add('epilogue', {volume: 1.4});
        this.epilogue.play();
        const storyTexts = [
            "You have been exiled by the King",
            "A most grievous fate it doth bring",
            "No home... no coin... no wife and so",
            "No place to rest... no place to go",
            "Except for a dungeon you stumble upon",
            "Rumored to be rich from dusk till dawn",
            "Naturally, you venture within",
            "Determined to claim the wealth therein",
            "To acquire a dwelling and a life so grand",
            "To rise once more in this troubled land"
        ];

        let currentTextIndex = 0;
        const textObject = this.add.bitmapText(this.cameras.main.centerX, this.cameras.main.centerY, 'font', '', 30)
            .setOrigin(0.5)
            .setAlpha(0);

        const showNextText = () => {
            if (currentTextIndex >= storyTexts.length) {
                this.cameras.main.fadeOut(2500, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.epilogue.stop();
                    this.scene.start('GameScene');
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
                hold: 2500,
                onComplete: showNextText
            });
        };

        showNextText();
    }

    update() {
    }

}
