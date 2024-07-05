export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }

    preload() {
        this.load.image('background', '../assets/images/background.png');
        this.load.image('play', '../assets/images/play.png');
        this.load.image('title', '../assets/images/title.png');
        this.load.image('exit', '../assets/images/exit.png');
        this.load.image('reset', '../assets/images/retryy.png');
        this.load.image('menu', '../assets/images/menuu.png');
        this.load.image('next', '../assets/images/nextt.png');
        this.load.image('gameOver', '../assets/images/gameOver.png');

        //images
        this.load.image('sword', '../assets/images/sword.png');
        this.load.image('heart_full', '../assets/images/heart_full.png');
        this.load.image('heart_half', '../assets/images/heart_half.png');
        this.load.image('heart_empty', '../assets/images/heart_empty.png');
        this.load.image('potion_red', '../assets/images/potion_red.png');
        this.load.image('potion_blue', '../assets/images/potion_blue.png');
        this.load.image('potion_yellow', '../assets/images/potion_yellow.png');

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
        this.load.atlas('lizard', '../assets/atlas/lizard/lizard.png', '../assets/atlas/lizard/lizard_atlas.json');
        this.load.animation('lizard_anim', '../assets/atlas/lizard/lizard_anim.json');
        this.load.atlas('chort', '../assets/atlas/chort/chort.png', '../assets/atlas/chort/chort_atlas.json');
        this.load.animation('chort_anim', '../assets/atlas/chort/chort_anim.json');
        this.load.atlas('goblin', '../assets/atlas/goblin/goblin.png', '../assets/atlas/goblin/goblin_atlas.json');
        this.load.animation('goblin_anim', '../assets/atlas/goblin/goblin_anim.json');
        this.load.atlas('ogre', '../assets/atlas/ogre/ogre.png', '../assets/atlas/ogre/ogre_atlas.json');
        this.load.animation('ogre_anim', '../assets/atlas/ogre/ogre_anim.json');
        this.load.atlas('demon', '../assets/atlas/demon/demon.png', '../assets/atlas/demon/demon_atlas.json');
        this.load.animation('demon_anim', '../assets/atlas/demon/demon_anim.json');

        //Audio
        this.load.audio('doorClose', '../assets/audio/SFX/doorClose.wav');
        this.load.audio('coin1', '../assets/audio/SFX/coin1.wav');
        this.load.audio('coin2', '../assets/audio/SFX/coin2.wav');
        this.load.audio('coin3', '../assets/audio/SFX/coin3.wav');
        this.load.audio('coin4', '../assets/audio/SFX/coin4.wav');
        this.load.audio('playerAttack', '../assets/audio/SFX/playerAttack.wav');
        this.load.audio('playerAttack2', '../assets/audio/SFX/playerAttack2.wav');
        this.load.audio('playerAttack3', '../assets/audio/SFX/playerAttack3.wav');
        this.load.audio('playerHurt', '../assets/audio/SFX/playerHurt.wav');
        this.load.audio('potionDrink', '../assets/audio/SFX/potionDrink.wav');
        //this.load.audio('orcHurt', '../assets/audio/SFX/orcHurt.wav');
        this.load.audio('orcHit', '../assets/audio/SFX/orcHit.wav');
        this.load.audio('orcDeath', '../assets/audio/SFX/orcDeath.wav');
        this.load.audio('skeletonHit', '../assets/audio/SFX/skeletonHit.wav');
        this.load.audio('skeletonDeath', '../assets/audio/SFX/skeletonDeath.wav');
        this.load.audio('impHit', '../assets/audio/SFX/impHit.wav');
        this.load.audio('impDeath', '../assets/audio/SFX/impDeath.wav');
        this.load.audio('zombHit', '../assets/audio/SFX/zombHit.wav');
        this.load.audio('zombDeath', '../assets/audio/SFX/zombDeath.wav');
        this.load.audio('goblinHit', '../assets/audio/SFX/goblinHit.wav');
        this.load.audio('goblinDeath', '../assets/audio/SFX/goblinDeath.wav');
        this.load.audio('ogreHit', '../assets/audio/SFX/ogreHit.wav');
        this.load.audio('ogreDeath', '../assets/audio/SFX/ogreDeath.wav');
        this.load.audio('lizardHit', '../assets/audio/SFX/lizardHit.wav');
        this.load.audio('lizardDeath', '../assets/audio/SFX/lizardDeath.wav');
        this.load.audio('demonHit', '../assets/audio/SFX/demonHit.wav');
        this.load.audio('demonDeath', '../assets/audio/SFX/demonDeath.wav');
        this.load.audio('chortHit', '../assets/audio/SFX/chortHit.wav');
        this.load.audio('chortDeath', '../assets/audio/SFX/chortDeath.wav');
        this.load.audio('heal', '../assets/audio/SFX/heal.wav');
        this.load.audio('atkBoost', '../assets/audio/SFX/atkBoost.wav');
        this.load.audio('spdBoost', '../assets/audio/SFX/spdBoost.wav');
        this.load.audio('playerDeath', '../assets/audio/SFX/playerDeath.wav');
        this.load.audio('armorHit', '../assets/audio/SFX/armorHit.wav');
        this.load.audio('exit', '../assets/audio/SFX/exit.wav');
        this.load.audio('seagullOcean', '../assets/audio/SFX/seagullOcean.wav');
        this.load.audio('epilogue', '../assets/audio/BGM/epilogue.ogg');
        this.load.audio('gameMusic', '../assets/audio/BGM/gameMusic.mp3');
        this.load.audio('menuMusic', '../assets/audio/BGM/menuMusic.mp3');
        this.load.audio('winMusic', '../assets/audio/BGM/winMusic.mp3');
        this.load.audio('finalWinMusic', '../assets/audio/BGM/finalWinMusic.mp3');
        this.load.audio('dash', '../assets/audio/SFX/dash.wav');

        //font
        this.load.bitmapFont('font', '../assets/fonts/minogram_6x10.png', '../assets/fonts/minogram_6x10.xml');
        this.load.bitmapFont('font2', '../assets/fonts/square_6x6.png', '../assets/fonts/square_6x6.xml');
    }

    create() {

        this.cameras.main.setZoom(1);

        this.menuMusic = this.sound.add('menuMusic', {volume: 0.5});
        this.menuMusic.play();

        //Background
        this.background = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'background');
        this.background.setOrigin(0, 0);

        //Scaling
        this.background.displayWidth = this.sys.game.config.width;
        this.background.displayHeight = this.sys.game.config.height;

        //Center
        const centerX = this.sys.game.config.width / 2;
        const centerY = this.sys.game.config.height / 2;

        // Title
        const title = this.add.image(centerX, 50, 'title').setOrigin(0.5, 0);
        title.setScale(.5);

        // Play button
        const playButton = this.add.image(centerX, 360, 'play');
        playButton.setOrigin(0.5);
        playButton.setScale(6);
        playButton.setInteractive();
        playButton.on('pointerup', () => {
            //this.menuMusic.stop();
            this.scene.start('GameBootScene', { nextLevel: 'EpilogueScene' });
        });

        // Quit button
        const quitButton = this.add.image(centerX, 440, 'exit');
        quitButton.setOrigin(0.5);
        quitButton.setScale(7);
        quitButton.setInteractive();
        quitButton.on('pointerup', () => {
            this.quitGame();
        });

        const copyright = this.add.bitmapText(centerX, centerY + 260, 'font', '2024 OB GameWorks. All Rights Reserved.', 20).setOrigin(0.5, 0.5);
    }

    quitGame() {
        alert('You exited the game.');
    }

    update() {
        this.background.tilePositionX += 1;
    }
}
