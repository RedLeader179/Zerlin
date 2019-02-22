/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/

/*
Assets:
//powerups are capital

-  =  tile
=  =  moving tile
d  =  basic droid
s  =  scatter shot droid
b  =  slow burst droid
f  =  fast burst droid
m  =  multi-shot droid
n  =  sniper droid
H  =  health powerup
F  =  force powerup
I  =  invincibility powerup
X = boss
*/

const LEVEL_ONE_TILE_LAYOUT = [
  '                                 ',
  '                                 ',
  '                                 ',
  '                                 ',
  '                                 ',
  '       b                          ',
  ' s            b    --   d     -s  ',
  '     n       -      B    --       s',
  ' d F    m   I   -     d            -',
  '  H   H  B F    --  n                ',
  '  =    F    F     ===        X      ',
  'f   F --   I      --          d     ',
  ' H  -- I    H    -  s    ===   -       ',
  '-------------------------------------'
];
//I think becuase of the powerup scale, they need to be 2 row higher than where you want it.
//can modify Z_SPAWN_X to make zerlin spawn later in the level.
const MIKE_LEVEL_ONE = [
'                                                                                          I     d  n                               ',
'                                    d                                                              f                               ',
'                                                                    s                        m  d     n                            ',
'                                        d                                                         f                           I    ',
'                                  s            d                            s              -   m                                   ',
'                             d                  f                            n                                                     ',
'               d                                s         d       s         f b         =                                          ',//from ground can force jump to here.
'                                                                             d                               ---                   ',
'                                               f b                          f d        d                              X            ',//halfway of camera height.
'                          d       d                                        d b           s                  ==                     ',
'                                           --------                          d                                                     ',
'                                                                                                                                   ',
'                  -----                               H                   ---                       H F          --                ',
'                                       ----                                                                                        ',
'           ------                             I           -----       ---            -                      ---       --           ',//from ground level, can reg. jump to here.
'                                 -----             ----                        --                   - -                            ',
'                                                                            -                                                      ',
'------------           -- -- ----            --------   --     --- ---------  -- ---- ---------------------------------------------'];
  //   ^      ^- just on screen on start camera location.
  //   |-> Zerlin spawn point.
  //can jump 1 column
  //can roll 2 columns

const LEVEL_THREE_TILE_LAYOUT = [
  '                 ',
  '           d     ',
  '  d   X          ',
  '          --     ',
  '       d       - ',
  '---              ',
  '   --            ',
  '-----------------'
];

const MOVING_TILE_TESTER_LAYOUT = [
  '                 ',
  '                 ',
  '                 ',
  '          --     ',
  '    ==  -      - ',
  '---              ',
  '  ===========    ',
  '-----------------'
];

var OPENING_OVERLAY_TIME = 5;
var OPENING_SCENE_STOP_CAMERA_PAN = 7;
var OPENING_SCENE_FIRST_FADE_OUT_TIME = 10;
var OPENING_MESSAGE = "There is a tremor in the Force on the Dagobah System.\nLegions of mining droids have been unleashed\non the peaceful planet. It's rich core\nof kyber is frail, and the droids are rapidly\ndestroying Dagobah's biosphere.\n\nA lone Jedi dispatched in the outer rim has\nfelt it. A lone warrior against evil...";
var OPENING_MESSAGE_TIME = 10;
const LEVEL_ONE_TEXT = "Here begins a new journey...";
const LEVEL_TRANSITION_TIME = 7;
const LEVEL_TRANSITION_OVERLAY_TIME = 3;


var PAUSE_TIME_AFTER_START_LEVEL = 1.2;

/**
 * Manage scene transitions between levels and cinematics.
 */
class SceneManager2 {

  constructor(game) {
    this.game = game;
    this.camera = new Camera(this, 0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
    this.sceneEntities = [];
    this.Zerlin = new Zerlin(this.game, this.camera);
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
  }

  init() {
    this.buildLevels();
    this.startOpeningScene();
    // this.startLevelScene(); //for going strait into the lvl
  }

  buildLevels() {
    var LEVEL_ONE_BACKGROUNDS = [
      new ParallaxScrollBackground(this.game, this, '../img/backgroundTrees4.png', 1, 5200),
      new ParallaxScrollBackground(this.game, this, '../img/backgroundTrees3.png', 1, 2500),
      new ParallaxFloatingBackground(this.game, this, '../img/backgroundStars.png', 1, 1400),
      new ParallaxScrollBackground(this.game, this, '../img/backgroundTrees2.png', 1, 1000),
      new ParallaxScrollBackground(this.game, this, '../img/backgroundTrees1.png', 1, 600)
    ];

    var LEVEL_ONE_TILES = {
      centerTile: '../img/forest_center_tile.png',
      leftTile: '../img/forest_left_tile.png',
      rightTile: '../img/forest_right_tile.png',
      leftRightTile: '../img/forest_both_rounded_tile.png'
    };
    this.levels = [];
    this.level = null;
    this.levelBackgrounds = [];
    this.levels.push(new Level(this.game, this, MIKE_LEVEL_ONE, LEVEL_ONE_BACKGROUNDS, LEVEL_ONE_TILES));
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
    this.sceneEntities.push(new Overlay(this.game, true, OPENING_OVERLAY_TIME));

    // start opening scene music
  }

  openingSceneUpdate() {
    if(!this.canPause && this.game.keys['Enter']) {
      this.startLevelTransitionScene(); //for going strait into the lvl
    }

    this.musicMenu.update();

    this.openingSceneTimer += this.game.clockTick;
    if (this.openingSceneTimer < OPENING_SCENE_STOP_CAMERA_PAN) {
      this.camera.y = -Math.pow(this.openingSceneTimer - OPENING_SCENE_STOP_CAMERA_PAN, 2) * 280;
    } else if (!this.seq1FadeOut && this.openingSceneTimer > OPENING_SCENE_FIRST_FADE_OUT_TIME) {
      this.seq1FadeOut = true;
      this.sceneEntities.push(new Overlay(this.game, false, OPENING_OVERLAY_TIME));
    } else if (!this.seq2 && this.openingSceneTimer > OPENING_OVERLAY_TIME + OPENING_SCENE_FIRST_FADE_OUT_TIME) {
      this.seq2 = true;
      this.sceneEntities.push(new TextScreen(this.game, OPENING_MESSAGE));
      this.sceneEntities.push(new Overlay(this.game, true, OPENING_OVERLAY_TIME));
    } else if (!this.seq2FadeOut && this.openingSceneTimer > OPENING_OVERLAY_TIME + OPENING_SCENE_FIRST_FADE_OUT_TIME + OPENING_MESSAGE_TIME) {
      this.seq2FadeOut = true;
      this.sceneEntities.push(new Overlay(this.game, false, OPENING_OVERLAY_TIME));
    } else if (this.openingSceneTimer > OPENING_OVERLAY_TIME + OPENING_SCENE_FIRST_FADE_OUT_TIME + OPENING_MESSAGE_TIME + OPENING_OVERLAY_TIME) {
      this.startLevelScene();
    }


    for (let i = this.sceneEntities.length - 1; i >= 0; i--) {
      this.sceneEntities[i].update();
      if (this.sceneEntities[i].removeFromWorld) {
        this.sceneEntities.splice(i, 1);
      }
    }
    // if ()

    // if (opening scene timer is finished) {
    // 	this.update = this.levelTransitionUpdate;
    // 	this.draw = this.levelTransitionDraw;
    // 	this.startLevelTransitionScene();
    // 	// this.update = this.levelUpdate;
    // 	// this.draw = this.levelDraw;
    // 	// this.startLevelScene();
    // }
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
    this.sceneEntities.push(new TextScreen(this.game, LEVEL_ONE_TEXT));
    this.sceneEntities.push(new Overlay(this.game, true, LEVEL_TRANSITION_OVERLAY_TIME));
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

    if (!this.startedFinalOverlay && this.levelTransitionTimer > (LEVEL_TRANSITION_TIME - LEVEL_TRANSITION_OVERLAY_TIME)) {
      this.startedFinalOverlay = true;
      this.sceneEntities.push(new Overlay(this.game, false, LEVEL_TRANSITION_OVERLAY_TIME));
    }
    if (this.levelTransitionTimer > LEVEL_TRANSITION_TIME) {
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
    this.droids = [];
    this.lasers = [];
    this.beams = [];
    this.powerups = [];
    this.otherEntities = [];
    this.boss = null;
    this.bossMusicSwitched = false;
    this.bossHealthBar = null;
    this.level.set();
    this.addEntity(new HealthStatusBar(this.game, this, 25, 25)); //put these in scene manager??
    this.addEntity(new ForceStatusBar(this.game, this, 50, 50));
    this.Zerlin.reset();

    this.initiallyPaused = false;
    this.sceneEntities = [];
    //this.sceneEntities.push(new Overlay(this.game, true, PAUSE_TIME_AFTER_START_LEVEL / 2));
    this.startedFinalOverlay = false;

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
            675,
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

    if (!this.initiallyPaused && this.levelSceneTimer > PAUSE_TIME_AFTER_START_LEVEL) {
      this.initiallyPaused = true;
      this.canPause = true;
      this.pause();
      // this.gameEngine.startInput();
    }

    // if (boss for current level is dead) {
    // 	this.level++;
    // 	this.saveProgress();

    // 	this.update = this.levelTransitionUpdate;
    // 	this.draw = this.levelTransitionDraw;
    // 	this.startLevelTransitionScene();
    // }
    if (!this.startedFinalOverlay && !this.Zerlin.isAlive &&
      this.Zerlin.timeOfDeath + this.Zerlin.deathAnimation.totalTime < this.levelSceneTimer) {
      this.startedFinalOverlay = true;
      this.sceneEntities.push(new Overlay(this.game, false, LEVEL_TRANSITION_OVERLAY_TIME));
      this.sceneEntities.push(new GameOverTextScreen(this.game));
      this.stopLevelTime = this.levelSceneTimer + 6;
    }
    if (this.stopLevelTime < this.levelSceneTimer) {
      this.game.audio.endAllSoundFX();
      this.startLevelTransitionScene();
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

  }

  levelCreditsUpdate() {

  }

  levelCreditsDraw() {

  }


  //________________________________________________________
  saveProgress() {

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
    this.game.ctx.font = "70px Times New Roman MS";
    this.game.ctx.fillText("Paused", this.game.surfaceWidth / 2, 200);
    this.game.ctx.restore();
  }
}



class TextScreen {

  constructor(game, message, color) {
    this.game = game;
    this.message = message;
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
    this.game.ctx.font = "30px Times New Roman MS";
    for (let i = 0; i < this.lines; i++) {
      this.game.ctx.fillText(this.linePieces[i], this.game.surfaceWidth / 2, (i + 1) * (this.game.surfaceHeight / 2) / (this.lines + 1) + (this.game.surfaceHeight / 4));
    }
  }
}


class GameOverTextScreen extends TextScreen {

  constructor(game) {
    super(game, "GAME OVER", "red");
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
