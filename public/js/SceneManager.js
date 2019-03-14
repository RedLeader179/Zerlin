/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/

/*
// -  =  tile
// =  =  moving tile
// ~  =  falling tile
// d  =  basic droid
// s  =  scatter shot droid
// b  =  slow burst droid
// f  =  fast burst droid
// m  =  multi-shot droid
// n  =  sniper droid
//
// H  =  health powerup
// F  =  force powerup
// I  =  invincibility powerup
// S  =  split-shot powerup
// T  =  tiny mode powerup
// W  =  homing laser power up
//
// C  =  checkpoint
//
// *  =  leggy droid boss
// X  =  Boss
*/

const smc = Constants.SceneManagerConstants;
const lvlConst = Constants.LevelConstants;

/**
 * Manage scene transitions between levels and cinematics.
 */
class SceneManager2 {

  constructor(game) {
    this.game = game;
    this.camera = new Camera(this, 0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
    this.checkPoint = new CheckPoint(this.game, 0, 0);
    this.sceneEntities = [];
    this.Zerlin = new Zerlin(this.game, this.camera, this);
    this.boss = null;
    this.collisionManager = new CollisionManager(this.game, this);
    /* Edit this to change levels */
    this.levelNumber = 1;
    this.newLevel = true;
    this.canPause = false;
    this.pauseScreen = new PauseScreen(this.game);
    this.musicMenu = new MusicMenu(this.game, 1050, 50, [
      this.game.assetManager.getAsset('../img/music_menu.png'),
      this.game.assetManager.getAsset('../img/music_menu_xmusic.png'),
      this.game.assetManager.getAsset('../img/music_menu_xfx.png')
    ]);
    this.godMode = false;
  }

  init() {
    this.buildLevels();
    document.getElementById("formOverlay").style.display = "none";
    this.startOpeningScene();
    /* skip intro stuff and go strait to the level */
    // this.startLevelScene();
    // this.startCollectionScene();
    // document.getElementById("formOverlay").style.display = "none"; // hide login if not hid in css (curently is)
  }

  buildLevels() {
    var LEVEL_ONE_BACKGROUNDS = [
      new ParallaxScrollBackground(this.game, this, '../img/backgroundTrees4.png', 1, 5200),
      new ParallaxFloatingBackground(this.game, this, '../img/backgroundStars3.png', 1, 5000),
      new ParallaxGodLightBackground(this.game, this, '../img/god light new 3.png', 4500),
      new ParallaxScrollBackground(this.game, this, '../img/backgroundTrees3.png', 1, 2500),
      new ParallaxBirdBackground(this.game, this, '../img/dagobah bat.png', .17, false, 200, 500),
      new ParallaxBirdBackground(this.game, this, '../img/dagobah bat left.png', .45, true, 1300, 500),
      new ParallaxBirdBackground(this.game, this, '../img/dagobah bat.png', .3, false, 2300, 500),
      new ParallaxGodLightBackground(this.game, this, '../img/god light new 2.png', 1900),
      new ParallaxFloatingBackground(this.game, this, '../img/backgroundStars1.png', 1, 1650),
      new ParallaxScrollBackground(this.game, this, '../img/backgroundTrees2.png', 1, 1000),
      new ParallaxGodLightBackground(this.game, this, '../img/god light new 1.png', 800),
      new ParallaxFloatingBackground(this.game, this, '../img/backgroundStars2.png', 1, 800),
      new ParallaxScrollBackground(this.game, this, '../img/backgroundTrees1.png', 1, 600),
    ];
    var LEVEL_ONE_TILES = {
      centerTile: '../img/forest_center_tile.png',
      leftTile: '../img/forest_left_tile.png',
      rightTile: '../img/forest_right_tile.png',
      leftRightTile: '../img/forest_both_rounded_tile.png'
    };

    var CITY_LEVEL_BACKGROUNDS = [
      new ParallaxScrollBackground(this.game, this, '../img/city_background.png', 1, 5200),
      new ParallaxScrollBackground(this.game, this, '../img/city_buildings_back.png', 1, 2500),
      new ParallaxHoverHighwayBackground(this.game, this, '../img/highway layer 2.png', 4000, false),
      new ParallaxHoverHighwayBackground(this.game, this, '../img/highway layer 2 right.png', 4000, true),
      new ParallaxScrollBackground(this.game, this, '../img/city_buildings_middle.png', 1, 1400),
      new ParallaxHoverHighwayBackground(this.game, this, '../img/highway layer 1.png', 1000, false),
      new ParallaxHoverHighwayBackground(this.game, this, '../img/highway layer 1 right.png', 1000, true),
      new ParallaxScrollBackground(this.game, this, '../img/city_buildings_foreground.png', 1, 1000),
      new ParallaxHoverHighwayBackground(this.game, this, '../img/highway layer 3.png', 350, false),
      new ParallaxHoverHighwayBackground(this.game, this, '../img/highway layer 3 right.png', 350, true),
      new ParallaxFloatingBackground(this.game, this, '../img/city_clouds_left.png', 1, 800),
      new ParallaxFloatingBackground(this.game, this, '../img/city_clouds2.png', 1, 12000),
      new ParallaxFloatingBackground(this.game, this, '../img/city_clouds_center.png', 1, 600)
    ];
    var CITY_LEVEL_TILES = {
      centerTile: '../img/city_tile_center.png',
      leftTile: '../img/city_tile_left.png',
      rightTile: '../img/city_tile_right.png',
      leftRightTile: '../img/city_tile_left_right.png'
    };

    var LEVEL_THREE_BACKGROUNDS = [
      new ParallaxScrollBackground(this.game, this, '../img/snow level 0.png', 1, 6000),
      new ParallaxScrollBackground(this.game, this, '../img/snow level 1.png', 1, 4500),
      new ParallaxScrollBackground(this.game, this, '../img/snow level 2.png', 1, 3000),
      new ParallaxScrollBackground(this.game, this, '../img/snow level 3.png', 1, 1500),
      new ParallaxSnowBackground(this.game, this, 2300),
      new ParallaxSnowBackground(this.game, this, 2200),
      new ParallaxSnowBackground(this.game, this, 2100),
      new ParallaxSnowBackground(this.game, this, 1800),
      new ParallaxScrollBackground(this.game, this, '../img/snow level 4.png', 1, 1000),
      new ParallaxSnowBackground(this.game, this, 1500),
      new ParallaxSnowBackground(this.game, this, 1300),
      new ParallaxSnowBackground(this.game, this, 1100),
      new ParallaxSnowBackground(this.game, this, 1000),
      new ParallaxScrollBackground(this.game, this, '../img/snow level 5.png', 1, 500),
      new ParallaxSnowBackground(this.game, this, 800),
      new ParallaxSnowBackground(this.game, this, 700),
      new ParallaxScrollBackground(this.game, this, '../img/snow level 6.png', 1, 250),
      new ParallaxSnowBackground(this.game, this, 600),
      new ParallaxSnowBackground(this.game, this, 500),
      new ParallaxSnowBackground(this.game, this, 400)
    ];
    var LEVEL_THREE_TILES = {
      centerTile: '../img/ice_tile_center.png',
      leftTile: '../img/ice_tile_left.png',
      rightTile: '../img/ice_tile_right.png',
      leftRightTile: '../img/ice_tile_left_right.png'
    };

    this.levels = [];
    this.level = null;
    this.levelBackgrounds = [];
    //this.levels.push(new Level(this.game, this, lvlConst.BOSS_TEST_LAYOUT, LEVEL_ONE_BACKGROUNDS, LEVEL_ONE_TILES));
    this.levels.push(new Level(this.game, this, lvlConst.MIKE_LEVEL_ONE, LEVEL_ONE_BACKGROUNDS, LEVEL_ONE_TILES));
    this.levels.push(new Level(this.game, this, lvlConst.CITY_LEVEL, CITY_LEVEL_BACKGROUNDS, CITY_LEVEL_TILES));
    this.levels.push(new Level(this.game, this, lvlConst.MIKE_LEVEL_THREE, LEVEL_THREE_BACKGROUNDS, LEVEL_THREE_TILES));
  }

  setCheckPoint(checkPoint) {
    this.checkPoint = checkPoint;
  }
  addEntity(entity) {
    // console.log('added entity');
    this.otherEntities.push(entity);
  }

  addDroid(droid) {
    // console.log('added droid');
    this.droids.push(droid);
    // this.otherEntities.push(droid);
  }

  addLaser(laser) {
    // console.log('added laser');
    this.lasers.push(laser);
    // this.otherEntities.push(laser);
  }

  addPowerup(powerup) {
    this.powerups.push(powerup);
  }
  addActivePowerup(powerup) {
    if (this.activePowerups.length == 0) {
      this.activePowerups.push(new PowerupStatusBar(this.game, this, 0, 0, powerup));
    } else {
      var powerupExists = false;
      var pStatusBar;
      for (var i = 0; i < this.activePowerups.length; i++) {
        var activePowerup = this.activePowerups[i].getPowerup();
        if (powerup.constructor.name === activePowerup.constructor.name) {
          powerupExists = true;
          pStatusBar = this.activePowerups[i];
        }
      }
      if (powerupExists) {
        pStatusBar.reset();
      } else {
        this.activePowerups.push(new PowerupStatusBar(this.game, this, 0, 0, powerup));
      }
    }
  }

  pause() { // todo: pause music as well
    if (this.canPause) {
      // this.game.audio.endAllSoundFX();
      this.paused = true;
      this.game.timer.disable();
    }
  }

  unpause() {
    // if (!this.game.audio.soundFxMuted) {
    // 	this.game.audio.unMuteSoundFX();
    // }
    this.paused = false;
    this.game.timer.enable();
  }

  //________________________________________________________
  startOpeningScene() {
    // empty this.sceneEntities array
    // load sceneEntities for openeing scene animation
    this.sequence = 1;
    this.update = this.openingSceneUpdate;
    this.draw = this.openingSceneDraw;
    this.sceneEntities = [];
    this.sceneEntities.push(new ParallaxRotatingBackground(this.game, this, '../img/opening stars.png', 1, 15000));
    this.sceneEntities.push(new ParallaxScrollBackground(this.game, this, '../img/opening oasis 6.png', 1, 15000, 0, -50));
    this.sceneEntities.push(new ParallaxScrollBackground(this.game, this, '../img/opening oasis 5.png', 1, 9500, 0, 30));
    this.sceneEntities.push(new ParallaxScrollBackground(this.game, this, '../img/opening oasis 4.png', 1, 6000, 0, -20));
    this.sceneEntities.push(new ParallaxScrollBackground(this.game, this, '../img/opening oasis 3.png', 1, 2400, 0, -20));
    this.sceneEntities.push(new ParallaxScrollBackground(this.game, this, '../img/opening oasis 2.png', 1, 1300, 0, -265));
    this.sceneEntities.push(new ParallaxScrollBackground(this.game, this, '../img/opening oasis 1.png', 1, 900, 0, -170));
    //constructor(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, scale) {
    this.sceneEntities.push(new ParallaxAnimatedBackground(this.game, this,
      new Animation(this.game.assetManager.getAsset('../img/zerlin at fire.png'), 0, 0, 600, 600, .125, 6, true, false, .5),
      1, 800, 470, 450));
    this.sceneEntities.push(new Overlay(this.game, true, smc.OPENING_OVERLAY_TIME));
    this.game.audio.playSoundFx(this.game.audio.campFire);

    this.seq1EndTime = smc.OPENING_SEQUENCE_1_TIME;
    this.seq2EndTime = this.seq1EndTime + smc.OPENING_MESSAGE_TIME;
    this.seq3EndTime = this.seq2EndTime + smc.OPENING_TITLE_TIME;
    this.seq4EndTime = this.seq3EndTime + smc.OPENING_SEQUENCE_4_TIME;
    this.openingSceneTimer = 0;


    // start opening scene music

    //link up html buttons to try to login or register a user
    this.playGame = false; //for now use button to start the game
    document.getElementById("loginButton").addEventListener('click', () => {
      // }

      //user can't skip opening camera pan down
      if (this.openingSceneTimer > smc.OPENING_SCENE_STOP_CAMERA_PAN) {
        this.playGame = true;
        document.getElementById("formOverlay").style.display = "none";
      }
    });
  }

  openingSceneUpdate() {
    if (!this.canPause && this.game.keys['Enter']) {
      this.game.audio.campFire.stop();
      this.startCollectionScene(); //for going strait into the lvl
      document.getElementById("formOverlay").style.display = "none";
    }

    this.musicMenu.update();

    this.openingSceneTimer += this.game.clockTick;

    // sequence 1: Camera panning down on Zerlin sitting by the fire
    if (this.openingSceneTimer < smc.OPENING_SCENE_CAMERA_PAN_TIME) {
      this.camera.y = -Math.pow(this.openingSceneTimer - smc.OPENING_SCENE_CAMERA_PAN_TIME, 2) * 280;
    } else if (!this.seq1FadingOut && this.openingSceneTimer > this.seq1EndTime - smc.OPENING_OVERLAY_TIME) {
      this.seq1FadingOut = true;
      this.sceneEntities.push(new Overlay(this.game, false, smc.OPENING_OVERLAY_TIME));

    // sequence 2: opening message
    } else if (this.sequence == 1 && this.openingSceneTimer > this.seq1EndTime) {
      this.game.audio.campFire.stop();
      this.sequence = 2;
      this.sceneEntities.pop(); // remove previous overlay
      this.sceneEntities.push(new TextScreen(this.game, smc.OPENING_MESSAGE, "white", smc.OPENING_MESSAGE_TIME));
      this.sceneEntities.push(new Overlay(this.game, true, smc.OPENING_OVERLAY_TIME));
    } else if (!this.seq2FadingOut && this.openingSceneTimer > this.seq2EndTime - smc.OPENING_OVERLAY_TIME) {
      this.seq2FadingOut = true;
      this.sceneEntities.push(new Overlay(this.game, false, smc.OPENING_OVERLAY_TIME));

    // sequence 3: Title
    } else if (this.sequence == 2 && this.openingSceneTimer > this.seq2EndTime) {
      this.sceneEntities.pop(); // remove previous overlay
      this.sequence = 3;
      this.sceneEntities.push(new TextScreen(this.game, "", "white"));
      this.sceneEntities.push(new ParallaxAnimatedBackground(this.game, this,
        new Animation(this.game.assetManager.getAsset('../img/title.png'), 0, 0, 1026, 342, .145, 66, false, false, .5),
        1, 200, (this.game.surfaceWidth - 1026 * .5) / 2, (this.game.surfaceHeight - 342 * .5) / 2));
      this.sceneEntities.push(new Overlay(this.game, true, smc.OPENING_OVERLAY_TIME * .8));
    } else if (!this.seq3FadingOut && this.openingSceneTimer > this.seq3EndTime - smc.OPENING_OVERLAY_TIME) {
      this.seq3FadingOut = true;
      this.sceneEntities.push(new Overlay(this.game, false, smc.OPENING_OVERLAY_TIME * .8));

    // sequence 4: Zerlin takes off in rocket
    } else if (this.sequence == 3 && this.openingSceneTimer > this.seq3EndTime) {
      this.sceneEntities.pop(); // remove previous overlay
      this.sceneEntities.pop(); // remove title
      this.sceneEntities.pop(); // remove title background
      this.sceneEntities.pop(); // remove Zerlin by fire
      this.sequence = 4;
      // this.sceneEntities.pop(); // remove previous title animation
      this.camera.x = 1400;
      this.sceneEntities.push(new ParallaxAnimatedBackground(this.game, this,
        new Animation(this.game.assetManager.getAsset('../img/ship take off.png'), 0, 0, 600, 600, .18, 38, false, false, 1.5),
        1, 800, 470, -150));
      this.sceneEntities.push(new Overlay(this.game, true, smc.OPENING_OVERLAY_TIME));
    } else if (this.sequence == 4) {

      if (!this.playTakeOffSound && this.openingSceneTimer > this.seq3EndTime + .5) {
        this.playTakeOffSound = true;
        this.game.audio.playSoundFx(this.game.audio.shipTakeOff);
      }

      this.seq4CameraPanTimer += this.game.clockTick;
      if (!this.startSeq4CameraPan && this.openingSceneTimer > this.seq4EndTime - smc.OPENING_SCENE_CAMERA_PAN_TIME) {
        this.startSeq4CameraPan = true;
        this.seq4CameraPanTimer = 0;
      } else if (this.startSeq4CameraPan && this.openingSceneTimer <= this.seq4EndTime) {
        this.camera.y = -Math.pow(this.seq4CameraPanTimer, 2) * 280;
      }

      if (!this.addedTwinkleStar && this.seq4CameraPanTimer > 4.7) {
        this.addedTwinkleStar = true;
        this.sceneEntities.push(new ParallaxAnimatedBackground(this.game, this,
          new Animation(this.game.assetManager.getAsset('../img/twinkling star.png'), 0, 0, 64, 64, .05, 14, false, false, .9),
          1, 99999999, 964, 95));
      }

      if (!this.seq4FadingOut && this.openingSceneTimer > this.seq4EndTime - smc.OPENING_OVERLAY_TIME) {
        this.seq4FadingOut = true;
        this.sceneEntities.push(new Overlay(this.game, false, smc.OPENING_OVERLAY_TIME));
      }

      // transition to level
      if (this.openingSceneTimer > this.seq4EndTime) {
        this.startCollectionScene();
      }
    }


    for (let i = this.sceneEntities.length - 1; i >= 0; i--) {
      this.sceneEntities[i].update();
      if (this.sceneEntities[i].removeFromWorld) {
        this.sceneEntities.splice(i, 1);
      }
    }
  }

  openingSceneDraw() {
    for (let i = 0; i < this.sceneEntities.length; i++) {
      this.sceneEntities[i].draw();
    }
    this.musicMenu.draw();

    // click to continue message
    // this.game.ctx.fillStyle = "#777777";
    // this.game.ctx.textAlign = "center";
    // this.game.ctx.font = '20px ' + smc.GAME_FONT;
    // this.game.ctx.fillText("click to continue (but seriously, watch the opening scene)", this.game.surfaceWidth / 2, 600);
  }

  //________________________________________________________
  startLevelTransitionScene() {
    this.game.keys['Enter'] = false;
    this.levelTransitionTimer = 0;
    this.update = this.levelTransitionUpdate;
    this.draw = this.levelTransitionDraw;
    this.canPause = false;

    this.initiallyPaused = false;
    this.sceneEntities = [];

    switch (this.levelNumber) {
      case (1):
        this.sceneEntities.push(new TextScreen(this.game, smc.LEVEL_ONE_TEXT));
        break;
      case (2):
        this.sceneEntities.push(new TextScreen(this.game, smc.LEVEL_TWO_MESSAGE));
        break;
      case (3):
        this.sceneEntities.push(new TextScreen(this.game, smc.LEVEL_THREE_MESSAGE));
        break;
    }

    // this.sceneEntities.push(new TextScreen(this.game, smc.LEVEL_ONE_TEXT));
    this.sceneEntities.push(new Overlay(this.game, true, smc.LEVEL_TRANSITION_OVERLAY_TIME));
    this.startedFinalOverlay = false;
    this.overlayTimer = 0;
  }

  levelTransitionUpdate() {
    if (!this.startedFinalOverlay && this.game.keys['Enter']) {
      this.startedFinalOverlay = true;
      this.sceneEntities.push(new Overlay(this.game, false, smc.LEVEL_TRANSITION_OVERLAY_TIME));
      this.overlayTimer = smc.LEVEL_TRANSITION_OVERLAY_TIME;
    }
    this.musicMenu.update();
    this.overlayTimer -= this.game.clockTick;

    for (let i = this.sceneEntities.length - 1; i >= 0; i--) {
      this.sceneEntities[i].update();
      if (this.sceneEntities[i].removeFromWorld) {
        this.sceneEntities.splice(i, 1);
      }
    }
    if (this.startedFinalOverlay && this.overlayTimer <= 0) {
      this.startLevelScene();
    }
  }

  levelTransitionDraw() {
    for (let i = 0; i < this.sceneEntities.length; i++) {
      this.sceneEntities[i].draw();
    }
    this.musicMenu.draw();

    // click to continue message
    if (!this.startedFinalOverlay) {
      this.game.ctx.fillStyle = "#777777";
      this.game.ctx.textAlign = "center";
      this.game.ctx.font = '20px ' + smc.GAME_FONT;
      this.game.ctx.fillText("press enter to continue", this.game.surfaceWidth / 2, 600);
    }
  }


  //________________________________________________________
  startLevelScene() {
    // empty this.sceneEntities array
    this.levelSceneTimer = 0;
    this.update = this.levelUpdate;
    this.draw = this.levelDraw;
    this.camera.x = 0;
    this.camera.y = 0;

    // load game engine with tiles for current level
    this.level = this.levels[this.levelNumber - 1];
    if (this.newLevel) {
      this.checkPoint = new CheckPoint(this.game, this.camera.width * cc.ZERLIN_POSITION_ON_SCREEN, 0);
    }
    this.newLevel = false; //if this is set to true when the next level is loaded, then reset the checkpoint.
    this.droids = [];
    this.lasers = [];
    this.powerups = [];
    this.otherEntities = [];
    this.activePowerups = [];
    this.boss = null;
    this.bossMusicSwitched = false;
    this.bossHealthBar = null;
    this.level.set();
    this.addEntity(new HealthStatusBar(this.game, this, 25, 25)); //put these in scene manager??
    this.addEntity(new ForceStatusBar(this.game, this, 50, 50));
    this.Zerlin.reset();
    this.wonLevel = false;

    this.initiallyPaused = false;
    this.canPause = false;
    this.sceneEntities = [];
    if (this.levelNumber == 3) {
      this.sceneEntities.push(new ParallaxSnowBackground(this.game, this, 300));
      this.sceneEntities.push(new ParallaxSnowBackground(this.game, this, 200));
      this.sceneEntities.push(new ParallaxSnowBackground(this.game, this, 100));
    }
    this.startedFinalOverlay = false;
    this.startNewScene = false;

    this.game.audio.playSoundFx(this.game.audio.lightsaber, 'lightsaberOn');
    this.game.audio.playSoundFx(this.game.audio.saberHum);
  }

  levelUpdate() {
    this.levelSceneTimer += this.game.clockTick;
    this.musicMenu.update();

    // this.musicMenu.update();
    // if (this.boss && !this.game.audio.bossSongPlaying) {
    //   this.game.audio.playBossSong();
    // }


    if (!this.paused) {
      if (this.boss && !this.bossHealthBar) {
        this.bossHealthBar = new BossHealthStatusBar(
          this.game,
          this.game.surfaceWidth * 0.25,
          680,
          this.boss);
      }
      this.Zerlin.update();
      this.camera.update();
      this.level.update();

      for (var i = this.droids.length - 1; i >= 0; i--) {
        this.droids[i].update();
        if (this.droids[i].removeFromWorld) {
          this.droids.splice(i, 1);
        }
      }
      for (var i = this.lasers.length - 1; i >= 0; i--) {
        this.lasers[i].update();
        if (this.lasers[i].removeFromWorld) {
          this.lasers.splice(i, 1);
        }
      }
      for (var i = this.powerups.length - 1; i >= 0; i--) {
        this.powerups[i].update();
        if (this.powerups[i].removeFromWorld) {
          this.powerups.splice(i, 1);
        }
      }
      for (var i = this.activePowerups.length - 1; i >= 0; i--) {
        this.activePowerups[i].update(i);
        if (this.activePowerups[i].removeFromWorld) {
          this.activePowerups.splice(i, 1);
        }
      }
      for (var i = this.otherEntities.length - 1; i >= 0; i--) {
        this.otherEntities[i].update();
        if (this.otherEntities[i].removeFromWorld) {
          this.otherEntities.splice(i, 1);
        }
      }

      //if the boss has been spawned update him and his health bar
      if (this.boss) {
        this.boss.update();
        if (!this.bossMusicSwitched) {
          this.game.audio.playBossSong();
          this.bossMusicSwitched = true;
        }
      }
      if (this.bossHealthBar) {
        this.bossHealthBar.update();
      }

      this.collisionManager.handleCollisions();

      for (let i = this.sceneEntities.length - 1; i >= 0; i--) {
        this.sceneEntities[i].update();
        if (this.sceneEntities[i].removeFromWorld) {
          this.sceneEntities.splice(i, 1);
        }
      }
    }

    if (!this.initiallyPaused && this.levelSceneTimer > smc.PAUSE_TIME_AFTER_START_LEVEL) {
      this.initiallyPaused = true;
      this.canPause = true;
      this.pause();
    }


    if (this.boss && !this.boss.alive || (this.boss == null && this.level.unspawnedBoss == null
          && this.droids.length == 0 && this.Zerlin.x >= this.level.getLengthAtI(5)) && !this.wonLevel) {
            //also need to check if zerlin is near the end of the level when there is no boss.
      console.log("level won");
      this.canPause = false;
  		this.wonLevel = true;
  		this.boss = null;
  		this.saveProgress();
  		this.startedFinalOverlay = true;
  		this.timeSinceBossDeath = 0;
  		this.sceneEntities.push(new Overlay(this.game, false, smc.LEVEL_COMPLETE_OVERLAY_TIME));
  		for (var i = this.droids.length - 1; i >= 0; i--) {
  			this.droids[i].explode();
  		}
  	}
  	if (this.wonLevel) {
      this.newLevel = true;
  		this.timeSinceBossDeath += this.game.clockTick;
  		if (this.timeSinceBossDeath > smc.LEVEL_COMPLETE_OVERLAY_TIME) {
  			this.levelNumber++;
  			if (this.levelNumber > smc.NUM_LEVELS) {
  				this.startCreditsScene();
  			} else {
  				this.startCollectionScene();
  			}
  		}
  	}
    if (!this.startedFinalOverlay && !this.Zerlin.alive) {
      this.canPause = false;
      if (this.levelSceneTimer > this.Zerlin.timeOfDeath + this.Zerlin.deathAnimation.totalTime) {
        this.startedFinalOverlay = true;
        this.sceneEntities.push(new Overlay(this.game, false, smc.LEVEL_TRANSITION_OVERLAY_TIME));
        this.sceneEntities.push(new GameOverTextScreen(this.game));
        this.stopLevelTime = this.levelSceneTimer + 6;
        //could play death song or something
        this.game.audio.playBackgroundSong();
        this.startNewScene = true;
      }
    }

    if ((this.levelSceneTimer > this.stopLevelTime && this.startNewScene)
     || (!this.Zerlin.alive && this.game.keys['Enter'])) {
      this.game.audio.endAllSoundFX();
      this.startLevelTransitionScene();
      this.startNewScene = false;
    }
  }

  levelDraw() {
    this.camera.draw();
    this.level.draw();
    this.Zerlin.draw();
    for (var i = 0; i < this.droids.length; i++) {
      this.droids[i].draw(this.ctx);
    }
    for (var i = 0; i < this.lasers.length; i++) {
      this.lasers[i].draw(this.ctx);
    }
    if (this.boss) { // draw the boss and health bar if spawned
      this.boss.draw();
    }
    if (this.bossHealthBar) {
      this.bossHealthBar.draw();
    }
    for (var i = 0; i < this.powerups.length; i++) {
      this.powerups[i].draw(this.ctx);
    }
    for (var i = 0; i < this.activePowerups.length; i++) {
      this.activePowerups[i].draw();
    }
    for (var i = 0; i < this.otherEntities.length; i++) {
      this.otherEntities[i].draw(this.ctx);
    }
    for (let i = 0; i < this.sceneEntities.length; i++) {
      this.sceneEntities[i].draw();
    }

    if (this.paused) {
      this.pauseScreen.draw();
    }
    this.musicMenu.draw();
  }

  //________________________________________________________
  startCollectionScene() {
    this.update = this.collectionUpdate;
    this.draw = this.collectionDraw;
    this.sceneEntities = [];
    this.canPause = false;

    this.timer = 0;
    this.collectionScreen = new AttributeCollectionScreen(this.game, this, 5);
    this.sceneEntities.push(this.collectionScreen);
    this.sceneEntities.push(new Overlay(this.game, true, smc.LEVEL_TRANSITION_OVERLAY_TIME));
    this.startedFinalOverlay = false;
    this.overlayTimer = 0;


  }

  collectionUpdate() {
    this.timer += this.game.clockTick;
    this.overlayTimer -= this.game.clockTick;
    for (let i = this.sceneEntities.length - 1; i >= 0; i--) {
      this.sceneEntities[i].update();
      if (this.sceneEntities[i].removeFromWorld) {
        this.sceneEntities.splice(i, 1);
      }
    }

    if (this.collectionScreen.continue && !this.startedFinalOverlay) {
      this.startedFinalOverlay = true;
      this.sceneEntities.push(new Overlay(this.game, false, smc.LEVEL_TRANSITION_OVERLAY_TIME));
      this.overlayTimer = smc.LEVEL_TRANSITION_OVERLAY_TIME;
    }
    if (this.startedFinalOverlay && this.overlayTimer <= 0) {
      this.startLevelTransitionScene();
    }
  }

  collectionDraw() {
    for (let i = 0; i < this.sceneEntities.length; i++) {
      this.sceneEntities[i].draw();
    }
  }


  //________________________________________________________
	startCreditsScene() {
		this.creditsTimer = 0;
		this.update = this.creditsUpdate;
		this.draw = this.creditsDraw;
		this.canPause = false;

		this.initiallyPaused = false;
		this.sceneEntities = [];
		this.sceneEntities.push(new TextScreen(this.game, smc.CREDITS_1));
		this.sceneEntities.push(new Overlay(this.game, true, smc.LEVEL_TRANSITION_OVERLAY_TIME));
		this.startedFinalOverlay = false;
	}

	creditsUpdate() {
		this.creditsTimer += this.game.clockTick;
		for (let i = this.sceneEntities.length - 1; i >= 0; i--) {
			this.sceneEntities[i].update();
			if (this.sceneEntities[i].removeFromWorld) {
				this.sceneEntities.splice(i, 1);
			}
		}

    if (!this.startedOverlay && this.creditsTimer > smc.CREDITS_MESSAGE_1_TIME - smc.LEVEL_TRANSITION_OVERLAY_TIME) {
      this.startedOverlay = true;
      this.sceneEntities.push(new Overlay(this.game, false, smc.LEVEL_TRANSITION_OVERLAY_TIME));
    } else if (!this.startedSecondCreditMessage && this.creditsTimer >= smc.CREDITS_MESSAGE_1_TIME) {
      this.startedSecondCreditMessage = true;
      this.sceneEntities.push(new TextScreen(this.game, smc.CREDITS_2));
      this.sceneEntities.push(new Overlay(this.game, true, smc.LEVEL_TRANSITION_OVERLAY_TIME));
    }
	}

	creditsDraw() {
		for (let i = 0; i < this.sceneEntities.length; i++) {
			this.sceneEntities[i].draw();
		}
	}


  //________________________________________________________
  saveProgress() {

  }

  toggleGodMode() {
    if (this.godMode) {
      this.godMode = false;
      this.Zerlin.godMode = false;
    } else {
      this.godMode = true;
      this.Zerlin.godMode = true;
    }
    this.Zerlin.setHealth();
  }
}




class PauseScreen {
  constructor(game) {
    this.game = game;
    this.overlay = new Overlay(game, true, 1);
    this.overlay.opacity = .5;
  }

  update() {

  }

  draw() {
    var ctx = this.game.ctx;
    this.overlay.draw();
    ctx.save();
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "70px " + smc.GAME_FONT;
    ctx.fillText("Paused", this.game.surfaceWidth / 2, 200);

    //draw each powerup on the right
    //draw each control on the left

    //draw jump control
    var image = this.game.assetManager.getAsset('../img/jump.png');
    ctx.drawImage(image, 50, 10, 35, 35 * image.height/image.width);
    ctx.textAlign = "left";
    ctx.font = "22px " + smc.GAME_FONT;
    ctx.fillText("Regular Jump: W", 100, 40);
    ctx.fillText("Force Jump: Shift + W", 100, 70)

    //draw roll control
    image = this.game.assetManager.getAsset('../img/roll.png');
    ctx.drawImage(image, 40, 125, 50, 50 * image.height/image.width);
    ctx.fillText("Left Roll: A + S", 100, 140);
    ctx.fillText("Right Roll: D + S", 100, 170);

    //draw slash control
    image = this.game.assetManager.getAsset('../img/slash.png');
    ctx.drawImage(image, 40, 200, 50, 50 * image.height/image.width);
    ctx.fillText("Slash: Spacebar", 100, 250);

    //draw crouch control
    image = this.game.assetManager.getAsset('../img/crouch.png');
    ctx.drawImage(image, 40, 300, 40, 40 * image.height/image.width);
    ctx.fillText("Crouch: X", 100, 340);

    //draw flip lightsaber control
    image = this.game.assetManager.getAsset('../img/flip_saber.png');
    ctx.drawImage(image, 35, 390, 50, 50 * image.height/image.width);
    ctx.fillText("Flip Saber: Right Click", 100, 410);

    //draw throw saber control
    image = this.game.assetManager.getAsset('../img/saber_throw.png');
    ctx.drawImage(image, 35, 470, 50, 50 * image.height/image.width);
    ctx.fillText("Throw Saber: Left Click", 100, 495);

    //draw lightning control
    image = this.game.assetManager.getAsset('../img/lightning.png');
    ctx.drawImage(image, 35, 530, 50, 50 * image.height/image.width);
    ctx.fillText("Force Lightning: Shift + LeftClick", 100, 550);
    ctx.fillText("(Hold to Charge)", 100, 570);

    /* Middle Column */
    var middleWidth = this.game.surfaceWidth/2;
    ctx.textAlign = "center";
    //draw pause and skip scene control
    ctx.fillText("Pause/Unpause: Enter", middleWidth, 250);
    ctx.fillText("Skip Scene: Enter", middleWidth, 300);

    /****** Draw Powerup Description ******/
    ctx.textAlign = "left";

    //draw the Health powerup
    var spritesheet = this.game.assetManager.getAsset('../img/powerup_health.png');
    var animation = new Animation(spritesheet, 0, 0, 32, 32, 0.1, 5, true, false, 3);
    animation.drawFrame(this.game.clockTick, ctx, 700, 10);
    ctx.fillText("Health: Fully Heals Zerlin", 800, 60);

    //draw the force powerup
    spritesheet = this.game.assetManager.getAsset('../img/powerup_force.png');
    animation = new Animation(spritesheet, 0, 0, 32, 32, 0.1, 9, true, false, 3);
    animation.drawFrame(this.game.clockTick, ctx, 700, 110);
    ctx.fillText("Force: Fully Recover Force Power", 800, 160);

    //draw the invincibility powerup
    spritesheet = this.game.assetManager.getAsset('../img/powerup_invincibility.png');
    animation = new Animation(spritesheet, 0, 0, 32, 32, 0.1, 9, true, false, 2.5);
    animation.drawFrame(this.game.clockTick, ctx, 705, 210);
    ctx.fillText("Invincibility", 800, 255);

    //draw the split shot powerup
    spritesheet = this.game.assetManager.getAsset('../img/powerup_coin.png');
    animation = new Animation(spritesheet, 0, 0, 126, 126, 0.1, 8, true, false, 0.5)
    animation.drawFrame(this.game.clockTick, ctx, 715, 310);
    ctx.fillText("Split-Shot: Increase Deflected Lasers", 800, 345)

    //draw the tiny mode powerup
    spritesheet = this.game.assetManager.getAsset('../img/powerup_coin_T.png');
    animation = new Animation(spritesheet, 0, 0, 126, 126, 0.1, 8, true, false, 0.5)
    animation.drawFrame(this.game.clockTick, ctx, 715, 400);
    ctx.fillText("Tiny Mode", 800, 435);

    //draw the homing shot powerup
    spritesheet = this.game.assetManager.getAsset('../img/powerup_laser.png');
    animation = new Animation(spritesheet,  0, 0, 165, 159, 0.15, 12, true, false, 0.35);
    animation.drawFrame(this.game.clockTick, ctx, 715, 500);
    ctx.fillText("Homing Deflection:", 800, 525);
    ctx.fillText("Deflected Lasers Seek Nearby Droids", 800, 550);

    //draw the checkpoint
    spritesheet = this.game.assetManager.getAsset('../img/checkpoint.png');
    animation = new Animation(spritesheet, 0, 0, 64, 188, .1, 8, true, false, 0.5);
    animation.drawFrame(this.game.clockTick, ctx, 730, 580);
    ctx.fillText("Checkpoint", 800, 635);

    


    ctx.restore();
  }
}



class TextScreen {
  constructor(game, message, color, duration) {
    this.game = game;
    this.message = message;
    this.duration = duration? duration : 10000 /* arbitrarily long */;
    this.font = '30px';
    this.linePieces = message.split("\n");
    this.lines = this.linePieces.length;
    this.color = color ? color : "white";
    this.timer = 0;
  }

  update() {
    this.timer += this.game.clockTick;
    if (this.timer > this.duration) {
      this.removeFromWorld = true;
    }
  }

  draw() {
    this.game.ctx.fillStyle = "black";
    this.game.ctx.fillRect(0, 0, this.game.surfaceWidth, this.game.surfaceHeight);

    this.game.ctx.fillStyle = this.color;
    this.game.ctx.textAlign = "center";
    this.game.ctx.font = this.font + ' ' + smc.GAME_FONT;
    for (let i = 0; i < this.lines; i++) {
      this.game.ctx.fillText(this.linePieces[i], this.game.surfaceWidth / 2, (i + 1) * (this.game.surfaceHeight / 2) / (this.lines + 1) + (this.game.surfaceHeight / 4));
    }
  }
}


class GameOverTextScreen extends TextScreen {
  constructor(game) {
    super(game, "GAME OVER", "red");
    this.font = '80px';
    this.opacity = 0;
    this.deltaOpacity = 1;
  }

  update() {
    super.update();
    this.opacity += this.game.clockTick * this.deltaOpacity;
  }

  draw() {
    this.game.ctx.globalAlpha = this.opacity;
    super.draw();
    this.game.ctx.globalAlpha = 1;
  }
}


class Overlay {

	constructor(game, lighten, timeToFinish) {
		this.game = game;
		this.opacity = lighten ? 1 : 0;
		this.deltaOpacity = 1 / timeToFinish;
		this.lighten = lighten;
		this.timeToFinish = timeToFinish;
		this.timer = 0;
	}

	update() {
		this.timer += this.game.clockTick;
		if (this.lighten) {
			this.opacity -= this.game.clockTick * this.deltaOpacity;
		} else {
			this.opacity += this.game.clockTick * this.deltaOpacity;
		}

		if (this.lighten && this.opacity <= 0) {
			this.removeFromWorld = true;
		}
	}

	draw() {
		this.game.ctx.fillStyle = 'rgb(0,0,0)';
		this.game.ctx.globalAlpha = this.opacity;
		this.game.ctx.fillRect(0, 0, this.game.surfaceWidth, this.game.surfaceHeight);
		this.game.ctx.globalAlpha = 1;
	}

}

class AttributeCollectionScreen {
  constructor(game, SceneManager, tokensOffered) {
    this.game = game;
    this.SceneManager = SceneManager;
    this.tokens = tokensOffered;
    this.timer = 0;

    this.forceHandImg = this.game.assetManager.getAsset('../img/force hand.png');
    this.healthHeartImg = this.game.assetManager.getAsset('../img/health heart.png');
    this.plusMinusImg = this.game.assetManager.getAsset('../img/plus minus.png');
    this.tokenImg = this.game.assetManager.getAsset('../img/token.png');
  }

  update() {
    this.timer += this.game.clockTick;

    if (this.game.keys['leftClick']) {
      var clickPoint = this.game.mouse;

      if (this.plusForce(clickPoint)) {
        // console.log("+ F");
        if (this.tokens > 0) {
          this.SceneManager.Zerlin.maxForce += smc.TOKEN_VALUE;
          this.tokens--;
        }
      } else if (this.minusForce(clickPoint)) {
        // console.log("- F");
        if (this.SceneManager.Zerlin.maxForce >= smc.TOKEN_VALUE) {
          this.SceneManager.Zerlin.maxForce -= smc.TOKEN_VALUE;
          this.tokens++;
        }
      } else if (this.plusHealth(clickPoint)) {
        // console.log("+ H");
        if (this.tokens > 0) {
          this.SceneManager.Zerlin.maxHealth += smc.TOKEN_VALUE;
          this.tokens--;
        }
      } else if (this.minusHealth(clickPoint)) {
        // console.log("- H");
        if (this.SceneManager.Zerlin.maxHealth >= smc.TOKEN_VALUE + 1) {
          this.SceneManager.Zerlin.maxHealth -= smc.TOKEN_VALUE;
          this.tokens++;
        }
      } else if (this.pressContinue(clickPoint)) {
        // console.log("cont");
        if (this.enableContinue) {
          this.continue = true;
        }
      }
      this.game.keys['leftClick'] = false;
    }

    this.enableContinue = this.tokens === 0;
  }

  draw() {
    this.game.ctx.fillStyle = "black";
    this.game.ctx.fillRect(0, 0, this.game.surfaceWidth, this.game.surfaceHeight);

    var oneThirdWidth = this.game.surfaceWidth / 3;
    
    //health
    this.game.ctx.drawImage(this.healthHeartImg, 0, 0, 64, 64, oneThirdWidth - 50, 450, 100, 100);
    this.game.ctx.drawImage(this.plusMinusImg, 0, 0, 74, 30, oneThirdWidth - 75, 550, 150, 60);

    var healthHeight = this.SceneManager.Zerlin.maxHealth * 3;
    this.game.ctx.fillStyle = "#ff0000";
    this.game.ctx.fillRect(oneThirdWidth - 30, 430, 60, -healthHeight - 10);
    this.game.ctx.fillStyle = "#ff8888";
    this.game.ctx.fillRect(oneThirdWidth - 23, 430, 46, -healthHeight - 5);
    this.game.ctx.fillStyle = "#ffffff";
    this.game.ctx.fillRect(oneThirdWidth - 16, 430, 32, -healthHeight);

    //force
    this.game.ctx.drawImage(this.forceHandImg, 0, 0, 64, 64, 2 * oneThirdWidth - 50, 450, 100, 100);
    this.game.ctx.drawImage(this.plusMinusImg, 0, 0, 74, 30, 2 * oneThirdWidth - 75, 550, 150, 60);

    var forceHeight = this.SceneManager.Zerlin.maxForce * 5;
    this.game.ctx.fillStyle = "#0000ff";
    this.game.ctx.fillRect(2 * oneThirdWidth - 30, 430, 60, -forceHeight - 10);
    this.game.ctx.fillStyle = "#8888ff";
    this.game.ctx.fillRect(2 * oneThirdWidth - 23, 430, 46, -forceHeight - 5);
    this.game.ctx.fillStyle = "#ffffff";
    this.game.ctx.fillRect(2 * oneThirdWidth - 16, 430, 32, -forceHeight);

    // tokens
    this.game.ctx.fillStyle = "yellow";
    this.game.ctx.font =  '40px ' + smc.GAME_FONT;
    this.game.ctx.fillText("Tokens Available (spend them wisely):", 250, 75);
    this.game.ctx.fillStyle = "yellow";
    for (let i = 0; i < this.tokens; i++) {
      this.game.ctx.drawImage(this.tokenImg, 0, 0, 64, 64, (i * 40) + 250, 100 + 7 * Math.sin(2 * (this.timer + i*.7)) , 40, 40);
    }

    // continue box
    this.game.ctx.fillStyle = this.continue? "#777777" : "#ffffff";
    this.game.ctx.fillRect(this.game.surfaceWidth/2 - 50, 625, 100, 50);

    this.game.ctx.fillStyle = this.enableContinue? "#000000" : "#aaaaaa";
    this.game.ctx.textAlign = "center";
    this.game.ctx.font =  '25px ' + smc.GAME_FONT;
    this.game.ctx.fillText("continue", this.game.surfaceWidth/2, 650);

  }

  plusForce(point) {
    return point.x >= 2 * this.game.surfaceWidth / 3 
        && point.x <= 2 * this.game.surfaceWidth / 3 + 75
        && point.y >= 550
        && point.y <= 610;
  }

  minusForce(point) {
    return point.x >= 2 * this.game.surfaceWidth / 3 - 75
        && point.x < 2 * this.game.surfaceWidth / 3
        && point.y >= 550
        && point.y <= 610;
  }

  plusHealth(point) {
    return point.x >= this.game.surfaceWidth / 3 
        && point.x <= this.game.surfaceWidth / 3 + 75
        && point.y >= 550
        && point.y <= 610;
  }

  minusHealth(point) {
    return point.x >= this.game.surfaceWidth / 3 - 75
        && point.x < this.game.surfaceWidth / 3
        && point.y >= 550
        && point.y <= 610;
  }

  pressContinue(point) {
    return point.x >= this.game.surfaceWidth/2 - 50 
        && point.x <= this.game.surfaceWidth/2 + 50
        && point.y >= 625
        && point.y <= 675;
  }
}
