/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/

const LEVEL_ONE_TILE_LAYOUT = [
'       b                          ',
' s            b    --   d     -s  ',
'            -      B    --       s',
' d     m      -     d            -',
'       B     --  n                ',
'  =             ===               ',
'f    --         --          d     ',
'   --          -  s       -       ',
'--------n-- ----   ---  ====  ----'
]

const LEVEL_THREE_TILE_LAYOUT = [
'                 ',
'                 ',
'      X          ',
'          --     ',
'    ==  -      - ',
'---              ',
'   --            ',
'-----------------'
]

const MOVING_TILE_TESTER_LAYOUT = [
'                 ',
'                 ',
'                 ',
'          --     ',
'    ==  -      - ',
'---              ',
'  ===========    ',
'-----------------'
]


class SceneManager {
  constructor(game) {
    this.gameEngine = game;

    /**
     *  Add level background constants here
     */
    //level one constants
    const LEVEL_ONE_BACKGROUNDS = [
      new ParallaxScrollBackground(this.gameEngine, this.gameEngine.assetManager.getAsset('../img/backgroundTrees4.png'), 1, this.gameEngine.camera, 5200),
      new ParallaxScrollBackground(this.gameEngine, this.gameEngine.assetManager.getAsset('../img/backgroundTrees3.png'), 1, this.gameEngine.camera, 2500),
      new ParallaxFloatingBackground(this.gameEngine, this.gameEngine.assetManager.getAsset('../img/backgroundStars.png'), 1, this.gameEngine.camera, 1400),
      new ParallaxScrollBackground(this.gameEngine, this.gameEngine.assetManager.getAsset('../img/backgroundTrees2.png'), 1, this.gameEngine.camera, 1000),
      new ParallaxScrollBackground(this.gameEngine, this.gameEngine.assetManager.getAsset('../img/backgroundTrees1.png'), 1, this.gameEngine.camera, 600)
    ];
    const LEVEL_ONE = new Level(this.gameEngine, LEVEL_ONE_TILE_LAYOUT, {
      centerTile: this.gameEngine.assetManager.getAsset('../img/forest_center_tile.png'),
      leftTile: this.gameEngine.assetManager.getAsset('../img/forest_left_tile.png'),
      rightTile: this.gameEngine.assetManager.getAsset('../img/forest_right_tile.png'),
      leftRightTile: this.gameEngine.assetManager.getAsset('../img/forest_both_rounded_tile.png')
    });

    //level 2 constants
    const LEVEL_TWO_BACKGROUNDS = [
      new ParallaxScrollBackground(this.gameEngine, this.gameEngine.assetManager.getAsset('../img/city_background.png'), 1, this.gameEngine.camera, 5200),
      new ParallaxScrollBackground(this.gameEngine, this.gameEngine.assetManager.getAsset('../img/city_buildings_back.png'), 1, this.gameEngine.camera, 2500),
      new ParallaxScrollBackground(this.gameEngine, this.gameEngine.assetManager.getAsset('../img/city_clouds_left.png'), 1, this.gameEngine.camera, 600)
    ];


    //current level parralax bacgrounds
    this.currentBackground = this.gameEngine.camera.parallaxManager.setParallaxBackgrounds(LEVEL_ONE_BACKGROUNDS);

    // current level layout and its tilesand tile
    this.currentLevel = LEVEL_ONE;

    //music menu
    this.musicMenu = new MusicMenu(this.gameEngine, 1050, 50, [
      this.gameEngine.assetManager.getAsset('../img/music_menu.png'),
      this.gameEngine.assetManager.getAsset('../img/music_menu_xmusic.png'),
      this.gameEngine.assetManager.getAsset('../img/music_menu_xfx.png')
    ]);

  }

  update() {
    this.musicMenu.update();
  }

  draw() {
    this.musicMenu.draw();
  }
}

/**
* Class that holds a music menu to control the play and pause music backgrounds
* and the sound fx. Also can pause and play music using the sound engine.
*/
class MusicMenu {
  constructor(game, xPosition, yPosition, images) {
    this.gameEngine = game;
    this.x = xPosition;
    this.y = yPosition;
    this.menu = images[0];
    this.xMusic = images[1];
    this.xFx = images[2];

    this.ctx = this.gameEngine.ctx //not needed
    this.xMusicChecked = false;
    this.xFxChecked = false;

  }

  update() {
    let clickXandY = this.gameEngine.click;
    let changeInState = false;
    if (clickXandY != null) {
      // console.log(clickXandY);
      //music x
      if (
        clickXandY.x >= this.x + 10 &&
        clickXandY.x <= this.x + 70 &&
        clickXandY.y >= this.y + 10 &&
        clickXandY.y <= this.y + 20
      ) {
        changeInState = true;
        this.xMusicChecked = !this.xMusicChecked;
        // console.log("music checked", this.xMusicChecked);
      }
      //fx x
      if (
        clickXandY.x >= this.x + 10 &&
        clickXandY.x <= this.x + 70 &&
        clickXandY.y >= this.y + 22 &&
        clickXandY.y <= this.y + 33
      ) {
        changeInState = true;
        this.xFxChecked = !this.xFxChecked;
        // console.log("fx checked", this.xFxChecked);
      }
    }

    //play and pause pause audio if previous state has changed
    if (changeInState) {
      if (this.xMusicChecked) {
        this.gameEngine.audio.pauseBackgroundMusic();
      } else {
        this.gameEngine.audio.unPauseBackgroundMusic();
      }
      //play or pause sound fx
      if (this.xFxChecked) {
        this.gameEngine.audio.muteSoundFX();
      } else {
        this.gameEngine.audio.unMuteSoundFX();
      }
    }
  }

  draw() {
    //draw music music menu background
    this.ctx.drawImage(this.menu, this.x, this.y);
    if (this.xMusicChecked) {
      this.ctx.drawImage(this.xMusic, this.x, this.y);
    }
    if (this.xFxChecked) {
      this.ctx.drawImage(this.xFx, this.x, this.y);
    }
  }
}
