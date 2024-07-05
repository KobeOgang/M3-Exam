export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.image('background', '../assets/images/background.png');
        this.load.image('loading', '../assets/images/loading.png');
        this.load.bitmapFont('font', '../assets/fonts/minogram_6x10.png', '../assets/fonts/minogram_6x10.xml');
        this.load.atlas('knight', '../assets/atlas/knight/knight.png', '../assets/atlas/knight/knight_atlas.json');
        this.load.animation('knight_anim', '../assets/atlas/knight/knight_anim.json');
    }

    create() {
        //Background
        this.background = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'background');
        this.background.setOrigin(0, 0);

        const centerX = this.sys.game.config.width / 2;
        const centerY = this.sys.game.config.height / 2;

        // Loading text
        const loading = this.add.image(centerX, centerY - 50, 'loading').setOrigin(0.5);
        loading.setScale(1.5);
        
        // Running man
        const player = this.add.sprite(centerX, centerY + 100, 'knight');
        player.setScale(4);
        player.anims.play('run');

        //Click start for bypassing audio bug
        this.time.delayedCall(1000, () => {
            const startText = this.add.bitmapText(centerX, centerY + 220, 'font', 'Click to Start', 18).setOrigin(0.5, 0.5);

            this.input.once('pointerdown', () => {
                this.scene.start('MainMenuScene');
            });
        });
    }
}