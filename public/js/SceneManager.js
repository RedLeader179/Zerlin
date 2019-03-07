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
    this.levelNumber = 1;
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
    //this.startOpeningScene();
    /* skip intro stuff and go strait to the level */
     this.startLevelScene();
    // document.getElementById("formOverlay").style.display = "none"; // hide login if not hid in css (curently is)
  }

  buildLevels() {
    var LEVEL_ONE_BACKGROUNDS = [
      new ParallaxScrollBackground(this.game, this, '../img/backgroundTrees4.png', 1, 5200),
      new ParallaxScrollBackground(this.game, this, '../img/backgroundTrees3.png', 1, 2500),
      new ParallaxFloatingBackground(this.game, this, '../img/backgroundStars.png', 1, 1400),
      new ParallaxScrollBackground(this.game, this, '../img/backgroundTrees2.png', 1, 1000),
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
      new ParallaxScrollBackground(this.game, this, '../img/city_buildings_middle.png', 1, 1400),
      new ParallaxScrollBackground(this.game, this, '../img/city_buildings_foreground.png', 1, 1000),
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
    this.levels.push(new Level(this.game, this, lvlConst.BOSS_TEST_LAYOUT, LEVEL_ONE_BACKGROUNDS, LEVEL_ONE_TILES));
    //this.levels.push(new Level(this.game, this, lvlConst.MIKE_LEVEL_ONE, LEVEL_ONE_BACKGROUNDS, LEVEL_ONE_TILES));
    //this.levels.push(new Level(this.game, this, lvlConst.CITY_LEVEL, CITY_LEVEL_BACKGROUNDS, CITY_LEVEL_TILES));
    //0this.levels.push(new Level(this.game, this, lvlConst.MIKE_LEVEL_THREE, LEVEL_THREE_BACKGROUNDS, LEVEL_THREE_TILES));
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
  addBeam(beam) {
    this.beams.push(beam);
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
  // startLoginScene() {
  // 	// load login sceneEntities to array
  // 	this.update = this.loginUpdate;
  // 	this.draw = this.loginDraw;
  // 	}

  // 	loginUpdate() {
  // 		for (let i = 0; i < this.sceneEntities.length; i++) {
  // 			this.sceneEntities.update();
  // 		}

  // 		// after user presses 'enter'
  // 		if (new account) {
  // 			this.level = 1;
  // 			this.update = this.openingSceneUpdate;
  // 			this.draw = this.openingSceneDraw;
  // 			this.startOpeningScene();
  // 		} else if (has account) {
  // 			this.level = account.level;
  // 			this.update = this.levelUpdate;
  // 			this.draw = this.levelDraw;
  // 			this.startOpeningScene();
  // 		}
  // 	}

  // 	loginDraw() {
  // 		for (let i = 0; i < this.sceneEntities.length; i++) {
  // 			this.sceneEntities.draw();
  // 		}
  // 	}

  //________________________________________________________
  startOpeningScene() {
    // empty this.sceneEntities array
    // load sceneEntities for openeing scene animation
    this.openingSceneTimer = 0;
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

    // start opening scene music

    //link up html buttons to try to login or register a user
    this.playGame = false; //for now use button to start the game
    document.getElementById("loginButton").addEventListener('click', () => {
      //do user validation here
      // if (fields not blank) {
      //   if (is user or can register) {
      //     set playGame to true
      //     hide login form
      //   } else {
      //     prompt bad info
      //   }
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
      this.startLevelTransitionScene(); //for going strait into the lvl
      document.getElementById("formOverlay").style.display = "none";
    }

    this.musicMenu.update();

    this.openingSceneTimer += this.game.clockTick;

    // To start game with login screen
    // //play the sweet rotating stars until the user clicks play or logs in
    // if (!this.playGame && this.openingSceneTimer < smc.OPENING_SCENE_STOP_CAMERA_PAN) {
    //   this.camera.y = -Math.pow(this.openingSceneTimer - smc.OPENING_SCENE_STOP_CAMERA_PAN, 2) * 280;
    // } else if (this.playGame) {
    //   //reset the openingSceneTimer ??? to get final transition scene back?
    //   if (!this.seq1FadeOut && this.openingSceneTimer > smc.OPENING_SCENE_FIRST_FADE_OUT_TIME) {
    //     this.seq1FadeOut = true;
    //     this.sceneEntities.push(new Overlay(this.game, false, smc.OPENING_OVERLAY_TIME));
    //   } else if (!this.seq2 && this.openingSceneTimer > smc.OPENING_OVERLAY_TIME + smc.OPENING_SCENE_FIRST_FADE_OUT_TIME) {
    //     this.seq2 = true;
    //     this.sceneEntities.push(new TextScreen(this.game, smc.OPENING_MESSAGE));
    //     this.sceneEntities.push(new Overlay(this.game, true, smc.OPENING_OVERLAY_TIME));
    //   } else if (!this.seq2FadeOut && this.openingSceneTimer > smc.OPENING_OVERLAY_TIME + smc.OPENING_SCENE_FIRST_FADE_OUT_TIME + smc.OPENING_MESSAGE_TIME) {
    //     this.seq2FadeOut = true;
    //     this.sceneEntities.push(new Overlay(this.game, false, smc.OPENING_OVERLAY_TIME));
    //   } else if (this.openingSceneTimer > smc.OPENING_OVERLAY_TIME + smc.OPENING_SCENE_FIRST_FADE_OUT_TIME + smc.OPENING_MESSAGE_TIME + smc.OPENING_OVERLAY_TIME) {
    //     this.startLevelScene();
    //   }
    // }

    // to auto play intro scene bit as steven had it and then go to the level
    if (this.openingSceneTimer < smc.OPENING_SCENE_STOP_CAMERA_PAN) {
      this.camera.y = -Math.pow(this.openingSceneTimer - smc.OPENING_SCENE_STOP_CAMERA_PAN, 2) * 280;
    } else if (!this.seq1FadeOut && this.openingSceneTimer > smc.OPENING_SCENE_FIRST_FADE_OUT_TIME) {
      this.seq1FadeOut = true;
      this.sceneEntities.push(new Overlay(this.game, false, smc.OPENING_OVERLAY_TIME));
    } else if (!this.seq2 && this.openingSceneTimer > smc.OPENING_OVERLAY_TIME + smc.OPENING_SCENE_FIRST_FADE_OUT_TIME) {
      this.seq2 = true;
      this.sceneEntities.push(new TextScreen(this.game, smc.OPENING_MESSAGE));
      this.sceneEntities.push(new Overlay(this.game, true, smc.OPENING_OVERLAY_TIME));
    } else if (!this.seq2FadeOut && this.openingSceneTimer > smc.OPENING_OVERLAY_TIME + smc.OPENING_SCENE_FIRST_FADE_OUT_TIME + smc.OPENING_MESSAGE_TIME) {
      this.seq2FadeOut = true;
      this.sceneEntities.push(new Overlay(this.game, false, smc.OPENING_OVERLAY_TIME));
    } else if (this.openingSceneTimer > smc.OPENING_OVERLAY_TIME + smc.OPENING_SCENE_FIRST_FADE_OUT_TIME + smc.OPENING_MESSAGE_TIME + smc.OPENING_OVERLAY_TIME) {
      this.startLevelScene();
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
  }

  //________________________________________________________
  startLevelTransitionScene() {
    this.levelTransitionTimer = 0;
    this.update = this.levelTransitionUpdate;
    this.draw = this.levelTransitionDraw;
    this.canPause = false;

    this.initiallyPaused = false;
    this.sceneEntities = [];
    this.sceneEntities.push(new TextScreen(this.game, smc.LEVEL_ONE_TEXT));
    this.sceneEntities.push(new Overlay(this.game, true, smc.LEVEL_TRANSITION_OVERLAY_TIME));
    this.startedFinalOverlay = false;
  }

  levelTransitionUpdate() {
    if (!this.canPause && this.game.keys['Enter']) {
      this.startLevelScene();
    }

    this.musicMenu.update();

    this.levelTransitionTimer += this.game.clockTick;
    for (let i = this.sceneEntities.length - 1; i >= 0; i--) {
      this.sceneEntities[i].update();
      if (this.sceneEntities[i].removeFromWorld) {
        this.sceneEntities.splice(i, 1);
      }
    }

    if (!this.startedFinalOverlay && this.levelTransitionTimer > (smc.LEVEL_TRANSITION_TIME - smc.LEVEL_TRANSITION_OVERLAY_TIME)) {
      this.startedFinalOverlay = true;
      this.sceneEntities.push(new Overlay(this.game, false, smc.LEVEL_TRANSITION_OVERLAY_TIME));
    }
    if (this.levelTransitionTimer > smc.LEVEL_TRANSITION_TIME) {
      this.startLevelScene();
    }
  }

  levelTransitionDraw() {
    for (let i = 0; i < this.sceneEntities.length; i++) {
      this.sceneEntities[i].draw();
    }
    this.musicMenu.draw();
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
      this.checkPoint = new CheckPoint(this.game, 0, 0);
    }
    this.newLevel = false; //if this is set to true when the next level is loaded, then reset the checkpoint.
    this.droids = [];
    this.lasers = [];
    this.beams = [];
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
      // this.gameEngine.startInput();
    }


    if (this.boss && !this.boss.alive || (this.boss == null && this.level.unspawnedBoss == null
          && this.droids.length == 0 && this.Zerlin.x >= this.level.getLengthAtI(5)) && !this.wonLevel) {
            //also need to check if zerlin is near the end of the level when there is no boss.
      console.log("level won");
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
  				this.startLevelTransitionScene();
  			}
  		}
  	}
    if (!this.startedFinalOverlay && !this.Zerlin.alive &&
      this.Zerlin.timeOfDeath + this.Zerlin.deathAnimation.totalTime < this.levelSceneTimer) {
      this.canPause = false;
      this.startedFinalOverlay = true;
      this.sceneEntities.push(new Overlay(this.game, false, smc.LEVEL_TRANSITION_OVERLAY_TIME));
      this.sceneEntities.push(new GameOverTextScreen(this.game));
      this.stopLevelTime = this.levelSceneTimer + 6;
      //could play death song or something
      this.game.audio.playBackgroundSong();
      this.startNewScene = true;
    }
    if (this.stopLevelTime < this.levelSceneTimer && this.startNewScene ||
        (!this.canPause && this.game.keys['Enter'])) {
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
  startGameOverScene() {

  }

  levelGameOverUpdate() {

  }

  levelGameOverDraw() {

  }


  //________________________________________________________
	startCreditsScene() {
		this.creditsTimer = 0;
		this.update = this.creditsUpdate;
		this.draw = this.creditsDraw;
		this.canPause = false;

		this.initiallyPaused = false;
		this.sceneEntities = [];
		this.sceneEntities.push(new TextScreen(this.game, smc.CREDITS));
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
    this.overlay.draw();
    this.game.ctx.save();
    this.game.ctx.fillStyle = "white";
    this.game.ctx.textAlign = "center";
    this.game.ctx.font = "70px " + smc.GAME_FONT;
    this.game.ctx.fillText("Paused", this.game.surfaceWidth / 2, 200);
    this.game.ctx.restore();
  }
}



class TextScreen {
  constructor(game, message, color) {
    this.game = game;
    this.message = message;
    this.font = '30px';
    this.linePieces = message.split("\n");
    this.lines = this.linePieces.length;
    this.color = color ? color : "white";
  }

  update() {

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
