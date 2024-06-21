export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.dodgeDuration = 200; // Dodge duration in milliseconds
        this.dodgeSpeed = 240; // Dodge speed
        this.dodgeTime = 0; // Time when dodge started
        this.isDodging = false; // Dodge state
        this.dodgeCooldown = 1000; // Dodge cooldown in milliseconds
        this.lastDodgeTime = 0; // Last time the player dodged
        this.attackDuration = 300; // Attack duration in milliseconds
        this.isAttacking = false; // Attack state
    }

    preload() {
        // Load the tilesets and map
        this.load.image('tiles', '../assets/tiles/tiles.png');
        this.load.image('tiles2', '../assets/tiles/tiles2.png');
        this.load.tilemapTiledJSON('map', '../assets/maps/map1.json');
        // Load the atlas and animation JSON
        this.load.atlas('knight', '../assets/atlas/knight/knight.png', '../assets/atlas/knight/knight_atlas.json'); 
        this.load.animation('knight_anim', '../assets/atlas/knight/knight_anim.json'); 
        this.load.image('sword', '../assets/images/sword.png'); // Load the sword image
    }

    create() {
        // Background color
        this.cameras.main.setBackgroundColor('#a2d2ff');

        // Map
        const map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16, margin: 1, spacing: 1 });
        const tileset = map.addTilesetImage('tiles', 'tiles');
        const tileset2 = map.addTilesetImage('tiles22', 'tiles2');
        const floor = map.createLayer('floor', tileset, 0, 0);
        const walls = map.createLayer('walls', tileset2, 0, 0);

        // Collisions
        walls.setCollisionByExclusion([-1]);

        // Player
        this.player = this.physics.add.sprite(100, 100, 'knight', 'knight_f_idle_anim_f0');
        this.player.setCollideWorldBounds(true);

        // Player animations
        this.anims.fromJSON(this.cache.json.get('knight_anim'));

        // Sword
        this.sword = this.physics.add.sprite(this.player.x, this.player.y, 'sword');
        this.sword.setVisible(false);

        // World bounds
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Camera adjustments
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(3);
        this.cameras.main.roundPixels = true;
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Track the player's facing direction
        this.playerFacingRight = true;

        // Colliders
        this.physics.add.collider(this.player, walls);
    }

    update(time, delta) {
        if (!this.isAttacking) {
            this.handlePlayerMovement(time, delta);
        } else {
            this.player.body.setVelocity(0); // Ensure player velocity is zero during attack
        }
    }

    handlePlayerMovement(time, delta) {
        if (this.isDodging) {
            // Reduce dodge time
            this.dodgeTime -= delta;

            // If dodge time is over, end dodge
            if (this.dodgeTime <= 0) {
                this.isDodging = false;
                this.player.body.setMaxVelocity(100); // Reset to normal speed
                this.player.clearTint(); // Remove the tint
            }

            return;
        }

        this.player.body.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-100);
            this.player.anims.play('run', true);
            this.player.flipX = true;
            this.playerFacingRight = false; // Update facing direction
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(100);
            this.player.anims.play('run', true);
            this.player.flipX = false;
            this.playerFacingRight = true; // Update facing direction
        }

        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-100);
            this.player.anims.play('run', true);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(100);
            this.player.anims.play('run', true);
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
            this.handlePlayerAttack();
        } else if (Phaser.Input.Keyboard.JustDown(this.shiftKey)) {
            this.handlePlayerDodge(time);
        }

        if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) {
            this.player.anims.play('idle', true);
        }

        //this.updateSwordPosition(); // Update the sword position based on the player's facing direction
    }

        handlePlayerDodge(time) {
            if (time > this.lastDodgeTime + this.dodgeCooldown) {
                this.isDodging = true;
                this.dodgeTime = this.dodgeDuration;
                this.player.body.setMaxVelocity(this.dodgeSpeed); // Increase speed during dodge
                this.lastDodgeTime = time;
                this.player.setTintFill(0xffffff); // Set the player tint to white during dodge

                // Dodge direction
                if (this.cursors.left.isDown) {
                    this.player.body.setVelocityX(-this.dodgeSpeed);
                } else if (this.cursors.right.isDown) {
                    this.player.body.setVelocityX(this.dodgeSpeed);
                }

                if (this.cursors.up.isDown) {
                    this.player.body.setVelocityY(-this.dodgeSpeed);
                } else if (this.cursors.down.isDown) {
                    this.player.body.setVelocityY(this.dodgeSpeed);
                }
            }
        }

    handlePlayerAttack() {
        this.isAttacking = true;
        this.player.body.setVelocity(0); // Stop player movement
        this.sword.setVisible(true);

        let swordX = this.player.x;
        let swordY = this.player.y;
        let swordAngle = 0;

        if (this.cursors.left.isDown) {
            swordX -= 21;
            swordY += 6;
            swordAngle = 270; // Pointing left
        } else if (this.cursors.right.isDown) {
            swordX += 21;
            swordY += 6;
            swordAngle = 90; // Pointing right
        } else if (this.cursors.up.isDown) {
            swordY -= 16;
            swordAngle = 0; // Pointing up
        } else if (this.cursors.down.isDown) {
            swordY += 25;
            swordAngle = 180; // Pointing down
        } else {
            // Default to facing direction
            if (this.playerFacingRight) {
                swordX += 21;
                swordY += 6;
                swordAngle = 90; // Pointing right
            } else {
                swordX -= 21;
                swordY += 6;
                swordAngle = 270; // Pointing left
            }
        }

        this.sword.setPosition(swordX, swordY);
        this.sword.setAngle(swordAngle);

        // Set a timer to hide the sword after the attack duration
        this.time.delayedCall(this.attackDuration, () => {
            this.sword.setVisible(false);
            this.isAttacking = false;
        });
    }

    updateSwordPosition() {
        if (this.isAttacking) {
            if (this.playerFacingRight) {
                this.sword.setPosition(this.player.x + this.player.width / 2, this.player.y);
            } else {
                this.sword.setPosition(this.player.x - this.player.width / 2, this.player.y);
            }
        }
    }
}
