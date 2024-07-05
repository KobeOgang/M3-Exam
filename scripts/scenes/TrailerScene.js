export class TrailerScene extends Phaser.Scene {
    constructor() {
        super('TrailerScene');
        this.dodgeDuration = 250;
        this.dodgeSpeed = 250;
        this.dodgeTime = 0;
        this.isDodging = false;
        this.dodgeCooldown = 1000;
        this.lastDodgeTime = 0;
        this.attackDuration = 300;
        this.isAttacking = false;
        this.speedBoostDuration = 5000;
        this.damageBoostDuration = 5000;
        this.playerSpeed = 90;
    }

    preload() {
        //tilesets and map
        this.load.image('tiles', '../assets/tiles/tiles.png');
        this.load.image('tiles2', '../assets/tiles/tiles2.png');
        this.load.image('tiles3', '../assets/tiles/tiles3.png');
        this.load.image('tiles4', '../assets/tiles/tiles4.png');
        this.load.image('tiles6', '../assets/tiles/tiles6.png');
        this.load.tilemapTiledJSON('trailer', '../assets/maps/trailer.json');
        //atlas and animation
        this.load.atlas('knight', '../assets/atlas/knight/knight.png', '../assets/atlas/knight/knight_atlas.json');
        this.load.animation('knight_anim', '../assets/atlas/knight/knight_anim.json');
        //images
        this.load.image('sword', '../assets/images/sword.png');
        this.load.image('heart_full', '../assets/images/heart_full.png');
        this.load.image('heart_half', '../assets/images/heart_half.png');
        this.load.image('heart_empty', '../assets/images/heart_empty.png');
        this.load.image('potion_red', '../assets/images/potion_red.png');
        this.load.image('potion_blue', '../assets/images/potion_blue.png');
        this.load.image('potion_yellow', '../assets/images/potion_yellow.png');
        //font
        this.load.bitmapFont('font', '../assets/fonts/minogram_6x10.png', '../assets/fonts/minogram_6x10.xml');
        this.load.bitmapFont('font2', '../assets/fonts/square_6x6.png', '../assets/fonts/square_6x6.xml');
        this.load.image('background', '../assets/images/background.png');

    }

    create() {
        //Background
        this.background = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'background');
        this.background.setOrigin(0, 0);

    }

    update(time, delta) {
        this.background.tilePositionX += 1;
    }

    logCoordinates(currentTime) {
        const throttleDelay = 3000;

        if (currentTime - this.lastLogTime >= throttleDelay) {
            const x = Math.floor(this.player.x);
            const y = Math.floor(this.player.y);
            console.log(`Coords: (${x}, ${y})`);
            this.lastLogTime = currentTime;
        }
    }

    handlePlayerMovement(time, delta) {
        this.player.body.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-this.playerSpeed);
            this.player.anims.play('run', true);
            this.player.flipX = true;
            this.playerFacingRight = false;
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(this.playerSpeed);
            this.player.anims.play('run', true);
            this.player.flipX = false;
            this.playerFacingRight = true;
        }

        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-this.playerSpeed);
            this.player.anims.play('run', true);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(this.playerSpeed);
            this.player.anims.play('run', true);
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
            return;
        } else if (Phaser.Input.Keyboard.JustDown(this.shiftKey)) {
            return;
        }

        if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) {
            this.player.anims.play('idle', true);
        }
    }

}
