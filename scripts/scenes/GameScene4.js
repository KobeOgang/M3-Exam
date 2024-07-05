export class GameScene4 extends Phaser.Scene {
    constructor() {
        super('GameScene4');
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
        this.load.tilemapTiledJSON('map4', '../assets/maps/map4.json');
    }

    create() {
        this.cameras.main.setBackgroundColor('#222222');
        this.doorClose = this.sound.add('doorClose');
        this.doorClose.play();
        this.cameras.main.fadeIn(2000, 0, 0, 0);

        this.gameMusic = this.sound.add('gameMusic', {volume: 0.5, loop: true});
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
        const map = this.make.tilemap({ key: 'map4', tileWidth: 16, tileHeight: 16, margin: 1, spacing: 1 });
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
        this.player = this.physics.add.sprite(128, 62, 'knight', 'knight_f_idle_anim_f0');
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(2);

        // Potions
        this.spawnBluePotion(680, 160);
        this.spawnBluePotion(136, 160);
        this.spawnRedPotion(200, 289);
        this.spawnRedPotion(456, 289);
        this.spawnRedPotion(856, 288);
        this.spawnYellowPotion(472, 400);
        this.spawnBluePotion(88, 672);
        this.spawnRedPotion(856, 608);
        this.spawnYellowPotion(1208, 288);
        this.spawnRedPotion(1416, 288);
        this.spawnRedPotion(1608, 608);
        this.spawnRedPotion(1912, 544);
        this.spawnRedPotion(2008, 320);
        this.spawnYellowPotion(2008, 544);
        this.spawnYellowPotion(1912, 320);
        this.spawnBluePotion(1880, 224);
        this.spawnRedPotion(2264, 224);
        this.spawnRedPotion(2072, 816);

        //Coins    
        this.spawnCoin(280, 585);
        this.spawnCoin(310, 570);
        this.spawnCoin(329, 582);
        this.spawnCoin(376, 596);
        this.spawnCoin(357, 616);
        this.spawnCoin(265, 612);
        this.spawnCoin(286, 621);
        this.spawnCoin(320, 615);
        this.spawnCoin(232, 591);
        this.spawnCoin(240, 557);
        this.spawnCoin(343, 557);
        this.spawnCoin(384, 558);
        this.spawnCoin(230, 742);
        this.spawnCoin(199, 777);
        this.spawnCoin(176, 750);
        this.spawnCoin(441, 768);
        this.spawnCoin(399, 756);
        this.spawnCoin(248, 783);
        this.spawnCoin(451, 764);
        this.spawnCoin(1170, 686);
        this.spawnCoin(1192, 642);
        this.spawnCoin(1159, 627);
        this.spawnCoin(1144, 647);
        this.spawnCoin(2300, 340);
        this.spawnCoin(2277, 360);
        this.spawnCoin(2247, 358);
        this.spawnCoin(2234, 393);
        this.spawnCoin(2279, 406);
        this.spawnCoin(2310, 426);
        this.spawnCoin(2295, 374);
        this.spawnCoin(2242, 413);
        this.spawnCoin(2266, 433);
        this.spawnCoin(2364, 78);
        this.spawnCoin(2345, 773);
        this.spawnCoin(2317, 784);
        this.spawnCoin(2328, 806);
        this.spawnCoin(2367, 811);
        this.spawnCoin(2382, 776);
        this.spawnCoin(2417, 791);
        this.spawnCoin(2435, 774);
        this.spawnCoin(2425, 823);
        this.spawnCoin(2397, 836);
        this.spawnCoin(2355, 839);
        this.spawnCoin(2327, 859);
        this.spawnCoin(2320, 882);
        this.spawnCoin(2343, 907);
        this.spawnCoin(2369, 907);
        this.spawnCoin(2409, 897);
        this.spawnCoin(2397, 877);
        this.spawnCoin(2375, 872);
        this.spawnCoin(2444, 884);
        this.spawnCoin(2525, 810);
        this.spawnCoin(2498, 825);
        this.spawnCoin(2500, 887);
        this.spawnCoin(2493, 814);
        this.spawnCoin(2472, 777);
        this.spawnCoin(2439, 789);
        this.spawnCoin(2467, 835);
        this.spawnCoin(2427, 835);

        //enemies group
        this.enemies = this.physics.add.group();

        // enemies
        this.createEnemy('ogre', 387, 351);
        this.createEnemy('ogre', 277, 414);
        this.createEnemy('orc_mini', 351, 304);
        this.createEnemy('orc_mini', 294, 316);
        this.createEnemy('skeleton', 473, 441);
        this.createEnemy('goblin', 328, 352);
        this.createEnemy('goblin', 313, 360);
        this.createEnemy('tiny_zomb', 339, 370);
        this.createEnemy('tiny_zomb', 319, 385);
        this.createEnemy('skeleton', 187, 464);
        this.createEnemy('imp', 212, 338);
        this.createEnemy('goblin', 289, 197);
        this.createEnemy('goblin', 301, 174);
        this.createEnemy('chort', 957, 311);
        this.createEnemy('chort', 957, 395);
        this.createEnemy('chort', 864, 504);
        this.createEnemy('imp', 920, 346);
        this.createEnemy('imp', 904, 364);
        this.createEnemy('lizard', 858, 325);
        this.createEnemy('tiny_zomb', 855, 432);
        this.createEnemy('tiny_zomb', 877, 447);
        this.createEnemy('tiny_zomb', 842, 456);
        this.createEnemy('ogre', 849, 715);
        this.createEnemy('skeleton', 904, 677);
        this.createEnemy('skeleton', 847, 656);
        this.createEnemy('tiny_zomb', 1132, 654);
        this.createEnemy('tiny_zomb', 1119, 668);
        this.createEnemy('orc_mini', 1184, 354);
        this.createEnemy('orc_mini', 1227, 335);
        this.createEnemy('orc_mini', 1217, 379);
        this.createEnemy('skeleton', 1152, 424);
        this.createEnemy('skeleton', 1179, 439);
        this.createEnemy('chort', 1232, 465);
        this.createEnemy('chort', 1213, 478);
        this.createEnemy('orc_mini', 1414, 348);
        this.createEnemy('orc_mini', 1391, 328);
        this.createEnemy('goblin', 1366, 393);
        this.createEnemy('goblin', 1383, 407);
        this.createEnemy('goblin', 1361, 427);
        this.createEnemy('skeleton', 1005, 181);
        this.createEnemy('skeleton', 1025, 189);
        this.createEnemy('skeleton', 1374, 592);
        this.createEnemy('skeleton', 1405, 605);
        this.createEnemy('tiny_zomb', 1401, 692);
        this.createEnemy('tiny_zomb', 1381, 672);
        this.createEnemy('tiny_zomb', 1352, 681);
        this.createEnemy('demon', 1960, 397);
        this.createEnemy('imp', 2052, 397);
        this.createEnemy('imp', 2039, 397);
        this.createEnemy('goblin', 1882, 397);
        this.createEnemy('goblin', 1864, 397);
        this.createEnemy('ogre', 1962, 339);
        this.createEnemy('ogre', 1962, 464);
        this.createEnemy('orc_mini', 2124, 445);
        this.createEnemy('orc_mini', 2115, 347);
        this.createEnemy('chort', 1807, 342);
        this.createEnemy('chort', 1859, 585);
        this.createEnemy('imp', 1963, 584);
        this.createEnemy('imp', 1977, 608);
        this.createEnemy('skeleton', 2016, 242);
        this.createEnemy('skeleton', 1939, 242);
        this.createEnemy('lizard', 2308, 356);
        this.createEnemy('lizard', 2328, 378);
        this.createEnemy('chort', 1879, 790);
        this.createEnemy('chort', 1905, 804);
        this.createEnemy('chort', 1926, 777);
        this.createEnemy('imp', 1876, 871);
        this.createEnemy('imp', 1891, 900);
        this.createEnemy('imp', 1925, 891);

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
                enemy.hurtSFX = this.sound.add('orcHit', {volume: 1.7});
                enemy.deathSFX = this.sound.add('orcDeath', {volume: 1.7});
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
                enemy.hurtSFX = this.sound.add('impHit', {volume: 1.7});
                enemy.deathSFX = this.sound.add('impDeath', {volume: 1.7});
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
                enemy.hurtSFX = this.sound.add('skeletonHit', {volume: 1.7});
                enemy.deathSFX = this.sound.add('skeletonDeath', {volume: 1.7});
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
                enemy.hurtSFX = this.sound.add('zombHit', {volume: 1.7});
                enemy.deathSFX = this.sound.add('zombDeath', {volume: 1.7});
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
                enemy.hurtSFX = this.sound.add('lizardHit', {volume: 1.7});
                enemy.deathSFX = this.sound.add('lizardDeath', {volume: 1.7});
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
                enemy.hurtSFX = this.sound.add('chortHit', {volume: 1.7});
                enemy.deathSFX = this.sound.add('chortDeath', {volume: 1.7});
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
                enemy.hurtSFX = this.sound.add('goblinHit', {volume: 1.7});
                enemy.deathSFX = this.sound.add('goblinDeath', {volume: 1.7});
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
                enemy.hurtSFX = this.sound.add('ogreHit', {volume: 1.7});
                enemy.deathSFX = this.sound.add('ogreDeath', {volume: 1.7});
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
                enemy.hurtSFX = this.sound.add('demonHit', {volume: 1.7});
                enemy.deathSFX = this.sound.add('demonDeath', {volume: 1.7});
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
            this.death = this.sound.add('playerDeath', {volume: 1.3});
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
                    this.scene.start('GameOverScene', { score: this.score, coins: this.coinsCollected, currentLevel: 'GameScene4' });
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
                    this.scene.start('GameOverScene', { score: this.score, coins: this.coinsCollected, currentLevel: 'GameScene4' });
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
                this.scene.start('FinalWinScene');
            }
        });
    }

}
