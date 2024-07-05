export class GameScene5 extends Phaser.Scene {
    constructor() {
        super('GameScene5');
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
        this.playerSpeed = 75;
    }

    preload() {
        //tilesets and map
        this.load.image('tiles', '../assets/tiles/tiles.png');
        this.load.image('tiles2', '../assets/tiles/tiles2.png');
        this.load.image('tiles3', '../assets/tiles/tiles3.png');
        this.load.image('tiles4', '../assets/tiles/tiles4.png');
        this.load.image('tiles6', '../assets/tiles/tiles6.png');
        this.load.tilemapTiledJSON('map5', '../assets/maps/map5.json');
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.seagullOcean = this.sound.add('seagullOcean', { volume: 0.9, loop: true });
        this.seagullOcean.play();

        // Map 
        const map = this.make.tilemap({ key: 'map5', tileWidth: 16, tileHeight: 16, margin: 1, spacing: 1 });
        const tileset6 = map.addTilesetImage('tiles6', 'tiles6');
        const floor = map.createLayer('floor', [tileset6], 0, 0);
        const floor2 = map.createLayer('floor2', [tileset6], 0, 0);
        const walls2 = map.createLayer('walls2', [tileset6], 0, 0);
        const walls = map.createLayer('walls', [tileset6], 0, 0);
        this.spikes = map.createLayer('spikes', [tileset6], 0, 0);
        const objects = map.createLayer('objects', [tileset6], 0, 0);
        const win = map.createLayer('win', [tileset6], 0, 0);

        // Collisions
        walls.setCollisionByExclusion([-1]);
        win.setCollisionByExclusion([-1]);

        // Player 
        this.player = this.physics.add.sprite(36, 296, 'knight', 'knight_f_idle_anim_f0');
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(2);

        // Player animations
        this.anims.fromJSON(this.cache.json.get('knight_anim'));

        //Sword
        this.sword = this.physics.add.sprite(this.player.x, this.player.y, 'sword');
        this.sword.setVisible(false);

        // World bounds
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        //Camera adjustments
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(3);
        this.cameras.main.roundPixels = true;
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        //Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // facing direction flag
        this.playerFacingRight = true;

        // Colliders
        this.physics.add.collider(this.player, walls);

        // player properties
        this.player.maxHealth = 100;
        this.player.health = 100;
        this.player.invincibilityDuration = 1100;
        this.player.lastHitTime = 0;
        this.player.knockback = 20;
        this.player.isDead = false;
        this.playerHasWon = false;

        // Events
        //this.physics.add.overlap(this.player, spikes, this.handlePlayerSpikesOverlap, null, this);

        this.physics.world.on('worldbounds', (body) => {
            body.gameObject.setVelocity(0);
        });

        this.lastLogTime = 0;


        this.overlay = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            3000,
            3000,
            0x000000
        );
        this.overlay.setDepth(3);
        this.overlay.setAlpha(0);

        setTimeout(() => {
            this.tweens.add({
                targets: this.overlay,
                alpha: 0.3,
                duration: 1000,
                ease: 'Linear'
            });
        }, 3000);

        this.credits = [
            'Thank you for playing!',
            'Developers:\n\nKobe Ogang\nAljhu Bangug',
            'Programmer:\n\nKobe Ogang',
            'Lead Level Designer:\n\nAljhu Bangug',
            'Level Designer:\n\nKobe Ogang',
            'UI Designers:\n\nAljhu Bangug\nKobe Ogang',
            'Special Thanks To',
            'All Artists of Public Assets and Music Used in this Game'
        ];

        this.currentCreditIndex = 0;
        this.showNextCredit();

    }

    update(time, delta) {
        if (!this.isAttacking) {
            this.handlePlayerMovement(time, delta);
        } else {
            this.player.body.setVelocity(0);
        }

        this.logCoordinates(time);
    }

    showNextCredit() {
        if (this.currentCreditIndex < this.credits.length) {
            const creditText = this.add.bitmapText(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 + 300,
                'font',
                this.credits[this.currentCreditIndex],
                14
            );
            creditText.setOrigin(0.5, 0);
            creditText.setDepth(4);
            creditText.setAlpha(1);
            creditText.setScrollFactor(0);

            this.tweens.add({
                targets: creditText,
                y: 130,
                duration: 10000,
                ease: 'Linear',
                onComplete: () => {
                    creditText.destroy();
                    this.currentCreditIndex++;
                    this.showNextCredit();
                }
            });
        } else {
            this.time.delayedCall(2000, () => {
                const FinalWinScene = this.scene.get('FinalWinScene');
                FinalWinScene.finalWinMusic.stop();
                this.seagullOcean.stop();
                this.scene.start('MainMenuScene');
            }, [], this);
        }
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
