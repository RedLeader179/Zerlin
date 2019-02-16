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
'  -             ---               ',
'f    --         --          d     ',
'   --          -  s       -       ',
'--------n-- ----   ---   -    ----'
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
    				new ParallaxScrollBackground(this.gameEngine, this.gameEngine.assetManager.getAsset('../img/backgroundTrees1.png'), 1, this.gameEngine.camera, 600)];
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
    				new ParallaxScrollBackground(this.gameEngine, this.gameEngine.assetManager.getAsset('../img/city_clouds_left.png'), 1, this.gameEngine.camera, 600)];



    //current level parralax bacgrounds
    this.currentBackground = this.gameEngine.camera.parallaxManager.setParallaxBackgrounds(LEVEL_ONE_BACKGROUNDS);

    // current level layout and its tilesand tile
    this.currentLevel = LEVEL_ONE;

  }




}
