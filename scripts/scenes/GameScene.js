export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
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
        this.load.tilemapTiledJSON('map', '../assets/maps/map1.json');
        //atlas and animation
        this.load.atlas('knight', '../assets/atlas/knight/knight.png', '../assets/atlas/knight/knight_atlas.json');
        this.load.animation('knight_anim', '../assets/atlas/knight/knight_anim.json');
        this.load.atlas('orc_mini', '../assets/atlas/orc_mini/orc_mini.png', '../assets/atlas/orc_mini/orc_mini_atlas.json');
        this.load.animation('orc_mini_anim', '../assets/atlas/orc_mini/orc_mini_anim.json');
        this.load.atlas('imp', '../assets/atlas/imp/imp.png', '../assets/atlas/imp/imp_atlas.json');
        this.load.animation('imp_anim', '../assets/atlas/imp/imp_anim.json');
        this.load.atlas('coin', '../assets/atlas/coin/coin.png', '../assets/atlas/coin/coin_atlas.json');
        this.load.animation('coin_anim', '../assets/atlas/coin/coin_anim.json');
        this.load.atlas('skeleton', '../assets/atlas/skeleton/skeleton.png', '../assets/atlas/skeleton/skeleton_atlas.json');
        this.load.animation('skeleton_anim', '../assets/atlas/skeleton/skeleton_anim.json');
        this.load.atlas('tiny_zomb', '../assets/atlas/tiny_zomb/tiny_zomb.png', '../assets/atlas/tiny_zomb/tiny_zomb_atlas.json');
        this.load.animation('tiny_zomb_anim', '../assets/atlas/tiny_zomb/tiny_zomb_anim.json');
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
    }

    create() {
        // for counters
        this.score = 0;
        this.coinsCollected = 0;

        // Map
        const map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16, margin: 1, spacing: 1 });
        const tileset = map.addTilesetImage('tiles', 'tiles');
        const tileset2 = map.addTilesetImage('tiles2', 'tiles2');
        const tileset3 = map.addTilesetImage('tiles3', 'tiles3');
        const floor = map.createLayer('floor', [tileset, tileset2, tileset3], 0, 0);
        const floor2 = map.createLayer('floor2', [tileset, tileset2, tileset3], 0, 0);
        const walls2 = map.createLayer('walls2', [tileset, tileset2, tileset3], 0, 0);
        const walls = map.createLayer('walls', [tileset, tileset2, tileset3], 0, 0);
        this.spikes = map.createLayer('spikes', [tileset, tileset2, tileset3], 0, 0);
        const objects = map.createLayer('objects', [tileset, tileset2, tileset3], 0, 0);
        const win = map.createLayer('win', [tileset, tileset2, tileset3], 0, 0);

        // Collisions
        walls.setCollisionByExclusion([-1]);

        // Player
        this.player = this.physics.add.sprite(650, 180, 'knight', 'knight_f_idle_anim_f0');
        this.player.setCollideWorldBounds(true);

        // Potions
        this.spawnRedPotion(472, 246);
        this.spawnRedPotion(712, 216);
        this.spawnYellowPotion(808, 216);

        //enemies group
        this.enemies = this.physics.add.group();

        // enemies
        this.createEnemy('orc_mini', 200, 300);
        this.createEnemy('imp', 215, 330);
        this.createEnemy('imp', 225, 295);
        this.createEnemy('imp', 220, 270);
        this.createEnemy('skeleton', 823, 348);
        this.createEnemy('skeleton', 845, 355);
        this.createEnemy('skeleton', 823, 380);
        this.createEnemy('tiny_zomb', 843, 320);
        this.createEnemy('tiny_zomb', 790, 342);
        this.createEnemy('tiny_zomb', 778, 420);
        this.createEnemy('tiny_zomb', 770, 390);
        this.createEnemy('tiny_zomb', 782, 381);
        this.createEnemy('orc_mini', 680, 589);
        this.createEnemy('imp', 704, 589);

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
        this.physics.add.collider(this.enemies, walls);



        // player properties
        this.player.maxHealth = 100;
        this.player.health = 100;
        this.player.invincibilityDuration = 1600;
        this.player.lastHitTime = 0;
        this.player.knockback = 20;

        // Create health UI
        this.healthUI = [];
        for (let i = 0; i < 5; i++) {
            const heart = this.add.image(480 + i * 20, 210, 'heart_full');
            heart.setScrollFactor(0);
            this.healthUI.push(heart);
        }

        // score text
        this.scoreText = this.add.bitmapText(475, 220, 'font', 'Score: 0', 8);
        this.scoreText.setScrollFactor(0);

        // coins collected text
        this.coinsText = this.add.bitmapText(475, 230, 'font', 'Coins Collected: 0', 8);
        this.coinsText.setScrollFactor(0);

        //Coins
        this.spawnCoin(100, 150);


        // Events
        //this.physics.add.overlap(this.player, spikes, this.handlePlayerSpikesOverlap, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerHit, null, this);
        this.physics.add.overlap(this.sword, this.enemies, this.handleSwordHit, null, this);

        this.physics.world.on('worldbounds', (body) => {
            body.gameObject.setVelocity(0);
        });

        this.lastLogTime = 0;
    }

    update(time, delta) {
        if (!this.isAttacking) {
            this.handlePlayerMovement(time, delta);
        } else {
            this.player.body.setVelocity(0);
        }

        this.enemies.children.iterate((enemy) => {
            this.updateEnemyAI(enemy, this.player);
        });

        this.checkPlayerSpikeOverlap();
        this.logCoordinates(time);
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
        if (this.isDodging) {
            this.dodgeTime -= delta;

            if (this.dodgeTime <= 0) {
                this.isDodging = false;
                this.player.isInvincible = false;
                this.player.body.setMaxVelocity(100);
                this.player.clearTint();
            }
            return;
        }
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
            this.handlePlayerAttack();
        } else if (Phaser.Input.Keyboard.JustDown(this.shiftKey)) {
            this.handlePlayerDodge(time);
        }

        if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) {
            this.player.anims.play('idle', true);
        }
    }

    handlePlayerDodge(time) {
        if (time > this.lastDodgeTime + this.dodgeCooldown) {
            this.isDodging = true;
            this.player.isInvincible = true;
            this.dodgeTime = this.dodgeDuration;
            this.player.body.setMaxVelocity(this.dodgeSpeed);
            this.lastDodgeTime = time;
            this.player.setTintFill(0xffffff);

            //Dodge direction
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
        this.player.body.setVelocity(0);
        this.sword.setVisible(true);

        let swordX = this.player.x;
        let swordY = this.player.y;
        let swordAngle = 0;

        if (this.cursors.left.isDown) {
            swordX -= 21;
            swordY += 6;
            swordAngle = 270;
        } else if (this.cursors.right.isDown) {
            swordX += 21;
            swordY += 6;
            swordAngle = 90;
        } else if (this.cursors.up.isDown) {
            swordY -= 20;
            swordAngle = 0;
        } else if (this.cursors.down.isDown) {
            swordY += 25;
            swordAngle = 180;
        } else {
            if (this.playerFacingRight) {
                swordX += 21;
                swordY += 6;
                swordAngle = 90;
            } else {
                swordX -= 21;
                swordY += 6;
                swordAngle = 270;
            }
        }
        this.sword.setPosition(swordX, swordY);
        this.sword.setAngle(swordAngle);
        // sword hitbox
        this.physics.world.enable(this.sword);
        this.sword.body.setEnable(true);

        this.time.delayedCall(this.attackDuration, () => {
            this.sword.setVisible(false);
            this.sword.body.setEnable(false);
            this.isAttacking = false;
        });
    }

    createEnemy(type, x, y) {
        let enemy;
        switch (type) {
            case 'orc_mini':
                enemy = this.enemies.create(x, y, 'orc_mini', 'orc_warrior_idle_anim_f0');
                enemy.setCollideWorldBounds(true);
                enemy.idleAnimation = 'orc_mini_idle';
                enemy.runAnimation = 'orc_mini_run';
                enemy.chaseDistance = 80;
                enemy.chaseSpeed = 30;
                enemy.health = 100;
                enemy.knockbackDistance = 20;
                enemy.invincibilityDuration = 600;
                enemy.lastHitTime = 0;
                enemy.damage = 20;
                enemy.dying = false;
                enemy.scoreValue = 150;
                break;
            case 'imp':
                enemy = this.enemies.create(x, y, 'imp', 'imp_idle_anim_f0');
                enemy.setCollideWorldBounds(true);
                enemy.idleAnimation = 'imp_idle';
                enemy.runAnimation = 'imp_run';
                enemy.chaseDistance = 145;
                enemy.chaseSpeed = 40;
                enemy.health = 40;
                enemy.knockbackDistance = 20;
                enemy.invincibilityDuration = 600;
                enemy.lastHitTime = 0;
                enemy.damage = 10;
                enemy.dying = false;
                enemy.scoreValue = 100;
                break;
            case 'skeleton':
                enemy = this.enemies.create(x, y, 'skeleton', 'skelet_idle_anim_f0');
                enemy.setCollideWorldBounds(true);
                enemy.idleAnimation = 'skeleton_idle';
                enemy.runAnimation = 'skeleton_run';
                enemy.chaseDistance = 90;
                enemy.chaseSpeed = 35;
                enemy.health = 80;
                enemy.knockbackDistance = 20;
                enemy.invincibilityDuration = 600;
                enemy.lastHitTime = 0;
                enemy.damage = 20;
                enemy.dying = false;
                enemy.scoreValue = 200;
                break;
            case 'tiny_zomb':
                enemy = this.enemies.create(x, y, 'tiny_zomb', 'tiny_zombie_idle_anim_f0');
                enemy.setCollideWorldBounds(true);
                enemy.idleAnimation = 'tiny_zomb_idle';
                enemy.runAnimation = 'tiny_zomb_run';
                enemy.chaseDistance = 110;
                enemy.chaseSpeed = 45;
                enemy.health = 40;
                enemy.knockbackDistance = 20;
                enemy.invincibilityDuration = 600;
                enemy.lastHitTime = 0;
                enemy.damage = 10;
                enemy.dying = false;
                enemy.scoreValue = 180;
                break;
        }
        return enemy;
    }

    updateEnemyAI(enemy, player) {
        const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);

        if (distance < enemy.chaseDistance) {
            // Chase the player
            const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
            const velocityX = Math.cos(angle) * enemy.chaseSpeed;
            const velocityY = Math.sin(angle) * enemy.chaseSpeed;
            enemy.setVelocity(velocityX, velocityY);
            enemy.play(enemy.runAnimation, true);

            if (velocityX < 0) {
                enemy.flipX = true;
            } else {
                enemy.flipX = false;
            }
        } else {
            //Stop chasing 
            enemy.setVelocity(0);
            enemy.play(enemy.idleAnimation, true);
        }
    }

    handleSwordHit(sword, enemy) {
        const currentTime = this.time.now;
        const damage = this.player.attackPower || 20;

        if (currentTime > enemy.lastHitTime + enemy.invincibilityDuration) {
            enemy.health -= damage;
            enemy.lastHitTime = currentTime;

            if (enemy.health <= 0) {
                enemy.dying = true;
                enemy.body.moves = false;
                enemy.body.setVelocity(0, 0);

                this.score += enemy.scoreValue;
                this.scoreText.setText('Score: ' + this.score);

                this.tweens.add({
                    targets: enemy,
                    alpha: 0,
                    duration: 500,
                    ease: 'Power1',
                    onComplete: () => {
                        enemy.destroy();
                    }
                });
            } else {
                enemy.body.moves = false;
                enemy.setCollideWorldBounds(false);  // Disable wall collision temporarily

                const angle = Phaser.Math.Angle.Between(sword.x, sword.y, enemy.x, enemy.y);
                const knockbackX = Math.cos(angle) * enemy.knockbackDistance;
                const knockbackY = Math.sin(angle) * enemy.knockbackDistance;

                this.tweens.add({
                    targets: enemy,
                    x: enemy.x + knockbackX,
                    y: enemy.y + knockbackY,
                    ease: 'Power1',
                    duration: 200,
                    onComplete: () => {
                        enemy.body.moves = true;
                        enemy.setCollideWorldBounds(true);  // Re-enable wall collision
                    }
                });

                enemy.setTintFill(0xff0000);

                this.time.delayedCall(100, () => {
                    enemy.clearTint();
                });
            }
        }
    }


    updateHealthUI() {
        const healthPerHeart = 20;
        for (let i = 0; i < this.healthUI.length; i++) {
            if (this.player.health >= (i + 1) * healthPerHeart) {
                this.healthUI[i].setTexture('heart_full');
            } else if (this.player.health > i * healthPerHeart) {
                this.healthUI[i].setTexture('heart_half');
            } else {
                this.healthUI[i].setTexture('heart_empty');
            }
        }
    }

    handlePlayerHit(player, enemy) {
        const currentTime = this.time.now;

        if (player.isInvincible || currentTime <= player.lastHitTime + player.invincibilityDuration) {
            return;
        }
        if (enemy.dying) {
            return;
        }
        player.health -= enemy.damage;
        player.lastHitTime = currentTime;
        this.updateHealthUI();

        if (player.health <= 0) {
            player.body.moves = false;
            player.body.setVelocity(0, 0);

            this.tweens.add({
                targets: player,
                alpha: 0,
                duration: 500,
                ease: 'Power1',
                onComplete: () => {
                    player.destroy();
                }
            });
        } else {
            player.body.moves = false;
            player.setCollideWorldBounds(false);  // Disable wall collision temporarily

            const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
            const knockbackX = Math.cos(angle) * this.player.knockback;
            const knockbackY = Math.sin(angle) * this.player.knockback;

            this.tweens.add({
                targets: player,
                x: player.x + knockbackX,
                y: player.y + knockbackY,
                ease: 'Power1',
                duration: 100,
                onComplete: () => {
                    player.body.moves = true;
                    player.setCollideWorldBounds(true);  // Re-enable wall collision
                }
            });

            player.setTintFill(0xff0000);

            this.time.delayedCall(100, () => {
                player.clearTint();
            });
        }
    }

    checkPlayerSpikeOverlap() {
        const spikeTile = this.spikes.getTileAtWorldXY(this.player.x, this.player.y, true);

        if (spikeTile && spikeTile.index !== -1) {
            this.handlePlayerSpikesCollision(this.player, spikeTile);
        }
    }

    handlePlayerSpikesCollision(player, spike) {
        const currentTime = this.time.now;
        if (player.isInvincible || currentTime <= player.lastHitTime + player.invincibilityDuration) {
            return;
        }
        player.health -= 10;
        player.lastHitTime = currentTime;
        this.updateHealthUI();

        if (player.health <= 0) {
            player.body.moves = false;
            player.body.setVelocity(0, 0);

            this.tweens.add({
                targets: player,
                alpha: 0,
                duration: 500,
                ease: 'Power1',
                onComplete: () => {
                    player.destroy();
                }
            });
        } else {
            player.body.moves = false;
            player.setCollideWorldBounds(false);  // Disable wall collision temporarily

            const angle = Phaser.Math.Angle.Between(spike.pixelX, spike.pixelY, player.x, player.y);
            const knockbackX = Math.cos(angle) * 20;
            const knockbackY = Math.sin(angle) * 20;

            this.tweens.add({
                targets: player,
                x: player.x + knockbackX,
                y: player.y + knockbackY,
                ease: 'Power1',
                duration: 200,
                onComplete: () => {
                    player.body.moves = true;
                    player.setCollideWorldBounds(true);  // Re-enable wall collision
                }
            });

            player.setTintFill(0xff0000);

            this.time.delayedCall(100, () => {
                player.clearTint();
            });
        }
    }



    spawnCoin(x, y) {
        const coin = this.physics.add.sprite(x, y, 'coin');
        coin.anims.play('coin_spin');
        this.physics.add.overlap(this.player, coin, this.collectCoin, null, this);
    }

    collectCoin(player, coin) {
        coin.destroy();
        this.score += 100;
        this.coinsCollected += 1;
        this.scoreText.setText('Score: ' + this.score);
        this.coinsText.setText('Coins Collected: ' + this.coinsCollected);
    }

    spawnRedPotion(x, y) {
        const redPotion = this.physics.add.sprite(x, y, 'potion_red');
        this.physics.add.overlap(this.player, redPotion, () => {
            this.collectRedPotion(redPotion);
        }, null, this);
    }

    collectRedPotion(potion) {
        if (this.player.health < this.player.maxHealth) {
            potion.destroy();
            this.player.health = this.player.maxHealth;
            this.updateHealthUI();
        } else {
            return;
        }
    }

    spawnBluePotion(x, y) {
        const bluePotion = this.physics.add.sprite(x, y, 'potion_blue');
        this.physics.add.overlap(this.player, bluePotion, () => {
            this.collectBluePotion(bluePotion);
        }, null, this);
    }

    collectBluePotion(potion) {
        potion.destroy();
        this.playerSpeed = 130;
        this.time.delayedCall(this.speedBoostDuration, () => {
            this.playerSpeed = 75;
        });
    }

    spawnYellowPotion(x, y) {
        const yellowPotion = this.physics.add.sprite(x, y, 'potion_yellow');
        this.physics.add.overlap(this.player, yellowPotion, () => {
            this.collectYellowPotion(yellowPotion);
        }, null, this);
    }

    collectYellowPotion(potion) {
        potion.destroy();
        this.player.attackPower = (this.player.attackPower || 20) * 3;
        this.time.delayedCall(this.damageBoostDuration, () => {
            this.player.attackPower /= 2;
        });
    }

}
