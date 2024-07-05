export class GameScene3 extends Phaser.Scene {
    constructor() {
        super('GameScene3');
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
        this.boostedMaxVelocity = 155;
        this.normalMaxVelocity = 75;
        this.isSpeedBoostActive = false;
    }

    preload() {
        //tilesets and map
        this.load.image('tiles', '../assets/tiles/tiles.png');
        this.load.image('tiles2', '../assets/tiles/tiles2.png');
        this.load.image('tiles3', '../assets/tiles/tiles3.png');
        this.load.image('tiles5', '../assets/tiles/tiles5.png');
        this.load.tilemapTiledJSON('map3', '../assets/maps/map3.json');
    }

    create() {
        this.cameras.main.setBackgroundColor('#222222');
        this.doorClose = this.sound.add('doorClose');
        this.doorClose.play();
        this.cameras.main.fadeIn(2000, 0, 0, 0);

        this.gameMusic = this.sound.add('gameMusic', { volume: 0.5, loop: true });
        this.gameMusic.play();

        //SFX
        this.coinSounds = [
            this.sound.add('coin1', { volume: 1 }),
            this.sound.add('coin2', { volume: 1 }),
            this.sound.add('coin3', { volume: 1 }),
            this.sound.add('coin4', { volume: 1 })
        ];

        this.swordSounds = [
            this.sound.add('playerAttack', { volume: 1.5 }),
            this.sound.add('playerAttack2', { volume: 1.5 }),
            this.sound.add('playerAttack3', { volume: 1.5 })
        ];

        this.potionDrink = this.sound.add('potionDrink');
        this.hurt = this.sound.add('playerHurt');

        // for counters
        this.score = 0;
        this.coinsCollected = 0;

        // Map
        const map = this.make.tilemap({ key: 'map3', tileWidth: 16, tileHeight: 16, margin: 1, spacing: 1 });
        const tileset = map.addTilesetImage('tiles', 'tiles');
        const tileset2 = map.addTilesetImage('tiles2', 'tiles2');
        const tileset3 = map.addTilesetImage('tiles3', 'tiles3');
        const tileset5 = map.addTilesetImage('tiles5', 'tiles5');
        const floor = map.createLayer('floor', [tileset, tileset2, tileset3, tileset5], 0, 0);
        const floor2 = map.createLayer('floor2', [tileset, tileset2, tileset3, tileset5], 0, 0);
        const walls2 = map.createLayer('walls2', [tileset, tileset2, tileset3, tileset5], 0, 0);
        const walls = map.createLayer('walls', [tileset, tileset2, tileset3, tileset5], 0, 0);
        this.spikes = map.createLayer('spikes', [tileset, tileset2, tileset3, tileset5], 0, 0);
        const objects = map.createLayer('objects', [tileset, tileset2, tileset3, tileset5], 0, 0);
        const win = map.createLayer('win', [tileset, tileset2, tileset3, tileset5], 0, 0);

        // Collisions
        walls.setCollisionByExclusion([-1]);
        win.setCollisionByExclusion([-1]);

        // Player
        this.player = this.physics.add.sprite(480, 69, 'knight', 'knight_f_idle_anim_f0');
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(2);

        // Potions
        this.spawnRedPotion(392, 159);
        this.spawnBluePotion(104, 159);
        this.spawnRedPotion(136, 559);
        this.spawnYellowPotion(232, 559);
        this.spawnRedPotion(136, 831);
        this.spawnYellowPotion(840, 543);

        //Coins
        this.spawnCoin(760, 169);
        this.spawnCoin(746, 149);
        this.spawnCoin(773, 151);
        this.spawnCoin(810, 152);
        this.spawnCoin(801, 183);
        this.spawnCoin(741, 165);
        this.spawnCoin(738, 133);
        this.spawnCoin(829, 150);
        this.spawnCoin(426, 181);
        this.spawnCoin(437, 358);
        this.spawnCoin(544, 386);
        this.spawnCoin(285, 241);
        this.spawnCoin(168, 220);
        this.spawnCoin(248, 873);
        this.spawnCoin(267, 862);
        this.spawnCoin(295, 855);
        this.spawnCoin(312, 878);
        this.spawnCoin(294, 901);
        this.spawnCoin(249, 907);
        this.spawnCoin(228, 886);
        this.spawnCoin(266, 887);
        this.spawnCoin(760, 711);
        this.spawnCoin(775, 677);
        this.spawnCoin(806, 706);
        this.spawnCoin(788, 731);
        this.spawnCoin(736, 569);
        this.spawnCoin(568, 647);
        this.spawnCoin(440, 589);
        this.spawnCoin(278, 710);
        this.spawnCoin(186, 646);
        this.spawnCoin(184, 438);

        //enemies group
        this.enemies = this.physics.add.group();

        // enemies
        this.createEnemy('orc_mini', 422, 397);
        this.createEnemy('orc_mini', 537, 395);
        this.createEnemy('orc_mini', 489, 386);
        this.createEnemy('goblin', 425, 345);
        this.createEnemy('goblin', 471, 356);
        this.createEnemy('goblin', 505, 356);
        this.createEnemy('goblin', 553, 338);
        this.createEnemy('skeleton', 185, 245);
        this.createEnemy('skeleton', 204, 273);
        this.createEnemy('ogre', 297, 532);
        this.createEnemy('skeleton', 296, 370);
        this.createEnemy('skeleton', 71, 629);
        this.createEnemy('chort', 185, 697);
        this.createEnemy('chort', 185, 617);
        this.createEnemy('lizard', 183, 425);
        this.createEnemy('tiny_zomb', 151, 380);
        this.createEnemy('tiny_zomb', 246, 386);
        this.createEnemy('imp', 231, 476);
        this.createEnemy('imp', 219, 465);
        this.createEnemy('goblins', 157, 615);
        this.createEnemy('goblins', 208, 604);
        this.createEnemy('chort', 202, 852);
        this.createEnemy('chort', 216, 877);
        this.createEnemy('imp', 186, 905);
        this.createEnemy('imp', 165, 896);
        this.createEnemy('imp', 200, 845);
        this.createEnemy('imp', 166, 872);
        this.createEnemy('imp', 121, 890);
        this.createEnemy('tiny_zomb', 517, 554);
        this.createEnemy('tiny_zomb', 492, 576);
        this.createEnemy('tiny_zomb', 518, 587);
        this.createEnemy('ogre', 829, 694);
        this.createEnemy('orc_mini', 676, 880);
        this.createEnemy('orc_mini', 661, 902);

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
        this.physics.add.collider(this.player, win, this.playerWin, null, this);

        // player properties
        this.player.maxHealth = 100;
        this.player.health = 100;
        this.player.invincibilityDuration = 1100;
        this.player.lastHitTime = 0;
        this.player.knockback = 20;
        this.player.isDead = false;
        this.playerHasWon = false;

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
                this.player.body.setMaxVelocity(this.player.playerSpeed);
                this.player.clearTint();

                if (!this.isSpeedBoostActive) {
                    this.player.body.setMaxVelocity(this.boostedMaxVelocity);
                }
            }
            return;
        }
        this.player.body.setVelocity(0);
        this.player.playerSpeed = this.player.playerSpeed || 75;

        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-this.player.playerSpeed);
            this.player.anims.play('run', true);
            this.player.flipX = true;
            this.playerFacingRight = false;
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(this.player.playerSpeed);
            this.player.anims.play('run', true);
            this.player.flipX = false;
            this.playerFacingRight = true;
        }

        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-this.player.playerSpeed);
            this.player.anims.play('run', true);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(this.player.playerSpeed);
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
            this.dash = this.sound.add('dash');
            this.dash.play();
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

        var randomSound = Phaser.Math.RND.pick(this.swordSounds);
        randomSound.play();

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
                enemy.hurtSFX = this.sound.add('orcHit', { volume: 1.7 });
                enemy.deathSFX = this.sound.add('orcDeath', { volume: 1.7 });
                break;
            case 'imp':
                enemy = this.enemies.create(x, y, 'imp', 'imp_idle_anim_f0');
                enemy.setCollideWorldBounds(true);
                enemy.idleAnimation = 'imp_idle';
                enemy.runAnimation = 'imp_run';
                enemy.chaseDistance = 130;
                enemy.chaseSpeed = 40;
                enemy.health = 40;
                enemy.knockbackDistance = 20;
                enemy.invincibilityDuration = 600;
                enemy.lastHitTime = 0;
                enemy.damage = 10;
                enemy.dying = false;
                enemy.scoreValue = 100;
                enemy.hurtSFX = this.sound.add('impHit', { volume: 1.7 });
                enemy.deathSFX = this.sound.add('impDeath', { volume: 1.7 });
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
                enemy.hurtSFX = this.sound.add('skeletonHit', { volume: 1.7 });
                enemy.deathSFX = this.sound.add('skeletonDeath', { volume: 1.7 });
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
                enemy.hurtSFX = this.sound.add('zombHit', { volume: 1.7 });
                enemy.deathSFX = this.sound.add('zombDeath', { volume: 1.7 });
                break;
            case 'lizard':
                enemy = this.enemies.create(x, y, 'lizard', 'lizard_m_idle_anim_f0');
                enemy.setCollideWorldBounds(true);
                enemy.idleAnimation = 'lizard_idle';
                enemy.runAnimation = 'lizard_run';
                enemy.chaseDistance = 95;
                enemy.chaseSpeed = 70;
                enemy.health = 40;
                enemy.knockbackDistance = 20;
                enemy.invincibilityDuration = 600;
                enemy.lastHitTime = 0;
                enemy.damage = 10;
                enemy.dying = false;
                enemy.scoreValue = 235;
                enemy.hurtSFX = this.sound.add('lizardHit', { volume: 1.7 });
                enemy.deathSFX = this.sound.add('lizardDeath', { volume: 1.7 });
                break;
            case 'chort':
                enemy = this.enemies.create(x, y, 'chort', 'chort_idle_anim_f0');
                enemy.setCollideWorldBounds(true);
                enemy.idleAnimation = 'chort_idle';
                enemy.runAnimation = 'chort_run';
                enemy.chaseDistance = 80;
                enemy.chaseSpeed = 45;
                enemy.health = 80;
                enemy.knockbackDistance = 20;
                enemy.invincibilityDuration = 600;
                enemy.lastHitTime = 0;
                enemy.damage = 20;
                enemy.dying = false;
                enemy.scoreValue = 200;
                enemy.hurtSFX = this.sound.add('chortHit', { volume: 1.7 });
                enemy.deathSFX = this.sound.add('chortDeath', { volume: 1.7 });
                break;
            case 'goblin':
                enemy = this.enemies.create(x, y, 'goblin', 'goblin_idle_anim_f0');
                enemy.setCollideWorldBounds(true);
                enemy.idleAnimation = 'goblin_idle';
                enemy.runAnimation = 'goblin_run';
                enemy.chaseDistance = 95;
                enemy.chaseSpeed = 55;
                enemy.health = 40;
                enemy.knockbackDistance = 20;
                enemy.invincibilityDuration = 600;
                enemy.lastHitTime = 0;
                enemy.damage = 10;
                enemy.dying = false;
                enemy.scoreValue = 80;
                enemy.hurtSFX = this.sound.add('goblinHit', { volume: 1.7 });
                enemy.deathSFX = this.sound.add('goblinDeath', { volume: 1.7 });
                break;
            case 'ogre':
                enemy = this.enemies.create(x, y, 'ogre', 'ogre_idle_anim_f0');
                enemy.setCollideWorldBounds(true);
                enemy.idleAnimation = 'ogre_idle';
                enemy.runAnimation = 'ogre_run';
                enemy.chaseDistance = 90;
                enemy.chaseSpeed = 27;
                enemy.health = 160;
                enemy.knockbackDistance = 20;
                enemy.invincibilityDuration = 600;
                enemy.lastHitTime = 0;
                enemy.damage = 30;
                enemy.dying = false;
                enemy.scoreValue = 310;
                enemy.hurtSFX = this.sound.add('ogreHit', { volume: 1.7 });
                enemy.deathSFX = this.sound.add('ogreDeath', { volume: 1.7 });
                break;
            case 'demon':
                enemy = this.enemies.create(x, y, 'demon', 'big_demon_idle_anim_f0');
                enemy.setCollideWorldBounds(true);
                enemy.idleAnimation = 'demon_idle';
                enemy.runAnimation = 'demon_run';
                enemy.chaseDistance = 150;
                enemy.chaseSpeed = 27;
                enemy.health = 380;
                enemy.knockbackDistance = 20;
                enemy.invincibilityDuration = 600;
                enemy.lastHitTime = 0;
                enemy.damage = 40;
                enemy.dying = false;
                enemy.scoreValue = 400;
                enemy.hurtSFX = this.sound.add('demonHit', { volume: 1.7 });
                enemy.deathSFX = this.sound.add('demonDeath', { volume: 1.7 });
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
                enemy.deathSFX.play();

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
                enemy.setCollideWorldBounds(false);
                enemy.hurtSFX.play();

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
                        enemy.setCollideWorldBounds(true);
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
        if (this.player.isDead) {
            return;
        }
        player.health -= enemy.damage;
        player.lastHitTime = currentTime;
        this.updateHealthUI();

        if (player.health <= 0) {
            this.player.isDead = true;
            player.body.moves = false;
            player.body.setVelocity(0, 0);
            this.death = this.sound.add('playerDeath', { volume: 1.3 });
            this.death.play();

            const screenOverlay = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2,
                this.cameras.main.width + 4000, this.cameras.main.height + 2000, 0x000000);
            screenOverlay.setAlpha(0);
            screenOverlay.setDepth(4);

            this.tweens.add({
                targets: screenOverlay,
                alpha: 1,
                duration: 2000,
                ease: 'Power1',
                onComplete: () => {
                    this.gameMusic.stop();
                    this.scene.start('GameOverScene', { score: this.score, coins: this.coinsCollected, currentLevel: 'GameScene3' });
                }
            });
        } else {
            player.body.moves = false;
            player.setCollideWorldBounds(false);
            this.hurt.play();
            this.armorHit = this.sound.add('armorHit', { volume: 1 });
            this.armorHit.play();

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
                    player.setCollideWorldBounds(true);
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
        if (this.player.isDead) {
            return;
        }
        player.health -= 10;
        player.lastHitTime = currentTime;
        this.updateHealthUI();

        if (player.health <= 0) {
            this.player.isDead = true;
            player.body.moves = false;
            player.body.setVelocity(0, 0);
            this.death = this.sound.add('playerDeath', { volume: 1.3 });
            this.death.play();

            const screenOverlay = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2,
                this.cameras.main.width + 700, this.cameras.main.height + 700, 0x000000);
            screenOverlay.setDepth(4);
            screenOverlay.setAlpha(0);

            this.tweens.add({
                targets: screenOverlay,
                alpha: 1,
                duration: 2000,
                ease: 'Power1',
                onComplete: () => {
                    this.death.stop();
                    this.gameMusic.stop();
                    this.scene.start('GameOverScene', { score: this.score, coins: this.coinsCollected, currentLevel: 'GameScene3' });
                }
            });
        } else {
            player.body.moves = false;
            player.setCollideWorldBounds(false);
            this.hurt.play();

            const angle = Phaser.Math.Angle.Between(spike.pixelX, spike.pixelY, player.x, player.y);
            const knockbackX = Math.cos(angle) * 5;
            const knockbackY = Math.sin(angle) * 5;

            this.tweens.add({
                targets: player,
                x: player.x + knockbackX,
                y: player.y + knockbackY,
                ease: 'Power1',
                duration: 200,
                onComplete: () => {
                    player.body.moves = true;
                    player.setCollideWorldBounds(true);
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
        var randomCoinSound = Phaser.Math.RND.pick(this.coinSounds);
        randomCoinSound.play();
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
            this.heal = this.sound.add('heal');
            this.heal.play();
            this.potionDrink.play();
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
        this.spdBoost = this.sound.add('spdBoost');
        this.spdBoost.play();
        this.potionDrink.play();
        potion.destroy();
        this.isSpeedBoostActive = true;
        const originalSpeed = this.player.playerSpeed;
        this.player.playerSpeed = this.boostedMaxVelocity;
        this.time.delayedCall(this.speedBoostDuration, () => {
            this.isSpeedBoostActive = false;
            this.player.playerSpeed = originalSpeed;
            console.log("Current speed:", this.player.playerSpeed);
            if (!this.isDodging) {
                this.player.body.setMaxVelocity(originalSpeed);
            }
        });
        console.log("Speed boost collected! Current speed:", this.player.playerSpeed);
    }

    spawnYellowPotion(x, y) {
        const yellowPotion = this.physics.add.sprite(x, y, 'potion_yellow');
        this.physics.add.overlap(this.player, yellowPotion, () => {
            this.collectYellowPotion(yellowPotion);
        }, null, this);
    }

    collectYellowPotion(potion) {
        this.atkBoost = this.sound.add('atkBoost');
        this.atkBoost.play();
        this.potionDrink.play();
        potion.destroy();
        this.player.attackPower = (this.player.attackPower || 20) * 2;
        this.time.delayedCall(this.damageBoostDuration, () => {
            this.player.attackPower /= 2;
        });
    }

    playerWin(player, tile) {
        //this.gameMusic.stop();
        if (this.playerHasWon) {
            return;
        }
    
        this.playerHasWon = true;
        this.exit = this.sound.add('exit', { volume: 1.2 });
        this.exit.play();
        const screenOverlay = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2,
            this.cameras.main.width + 4000, this.cameras.main.height + 2000, 0x000000);
        screenOverlay.setAlpha(0);
        screenOverlay.setDepth(4);

        this.tweens.add({
            targets: screenOverlay,
            alpha: 1,
            duration: 2000,
            ease: 'Power1',
            onComplete: () => {
                this.gameMusic.stop();
                this.scene.start('WinScene', { score: this.score, coins: this.coinsCollected, nextLevel: 'GameScene4', currentLevel: 'GameScene3' });
            }
        });
    }

}
