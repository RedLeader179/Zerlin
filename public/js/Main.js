/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/

/**
 * Manage all assets for this game.
 */
class AssetManager {
  constructor() {
    this.successCount = 0;
    this.errorCount = 0;
    this.cache = [];
    this.downloadQueue = [];
  }
  queueDownload(path) {
    // console.log("Queueing " + path);
    this.downloadQueue.push(path);
  }
  isDone() {
    return this.downloadQueue.length === this.successCount + this.errorCount;
  }
  downloadAll(callback) {
    for (var i = 0; i < this.downloadQueue.length; i++) {
      var img = new Image();
      var that = this;
      var path = this.downloadQueue[i];
      // console.log(path);
      img.addEventListener("load", function() {
        // console.log("Loaded " + this.src);
        that.successCount++;
        if (that.isDone())
          callback();
      });
      img.addEventListener("error", function() {
        console.log("Error loading " + this.src);
        that.errorCount++;
        if (that.isDone())
          callback();
      });
      img.src = path;
      this.cache[path] = img;
    }
  }
  getAsset(path) {
    return this.cache[path];
  }
}

/**
 * Driver function to load all assets for the game and launch
 * the game after completion.
 */
(function() {
  var AM = new AssetManager();

  /********** Zerlin assets ******************/
  AM.queueDownload("../img/Zerlin bobbing walking.png");
  AM.queueDownload("../img/Zerlin left bobbing walking.png");
  AM.queueDownload("../img/Zerlin backwards bobbing walking.png");
  AM.queueDownload("../img/Zerlin left backwards bobbing walking.png");
  AM.queueDownload("../img/Zerlin standing.png");
  AM.queueDownload("../img/Zerlin standing left.png");
  AM.queueDownload("../img/Zerlin somersault.png");
  AM.queueDownload("../img/Zerlin left somersault.png");
  AM.queueDownload("../img/Zerlin falling up.png");
  AM.queueDownload("../img/Zerlin falling down.png");
  AM.queueDownload("../img/Zerlin falling up left.png");
  AM.queueDownload("../img/Zerlin falling down left.png");
  AM.queueDownload("../img/Zerlin slash.png");
  AM.queueDownload("../img/Zerlin slash left.png");
  AM.queueDownload("../img/Zerlin crouch.png");
  AM.queueDownload("../img/Zerlin crouch left.png");
  AM.queueDownload("../img/Zerlin death.png");
  AM.queueDownload("../img/zerlin at fire.png");
  AM.queueDownload("../img/saber up.png");
  AM.queueDownload("../img/saber up left.png");
  AM.queueDownload("../img/saber down.png");
  AM.queueDownload("../img/saber down left.png");



  /********** Boss assets ******************/
  AM.queueDownload("../img/boss flying.png");
  AM.queueDownload("../img/boss flying left.png");
  AM.queueDownload("../img/boss falling.png");
  AM.queueDownload("../img/boss falling left.png");
  AM.queueDownload("../img/beam cannon.png");
  AM.queueDownload("../img/beam cannon left.png");
  AM.queueDownload("../img/boss_helmet.png");



  /********** Powerup assets ******************/
  AM.queueDownload('../img/powerup_health.png');
  AM.queueDownload('../img/powerup_force.png');
  AM.queueDownload('../img/powerup_invincibility.png');


  /********** Droid assets ******************/
  AM.queueDownload("../img/droid-j-row.png");
  AM.queueDownload("../img/leggy_droid.png");
  AM.queueDownload("../img/Droid 1.png");
  AM.queueDownload("../img/Droid 2.png");
  AM.queueDownload("../img/Droid 3.png");
  AM.queueDownload("../img/Droid 4.png");
  AM.queueDownload("../img/Droid 5.png");
  AM.queueDownload("../img/basic_droid.png");


  /********** VisualFX assets ******************/
  AM.queueDownload("../img/Explosion.png");


  /********** Background assets ******************/
  //oasis
  AM.queueDownload('../img/opening stars.png');
  AM.queueDownload('../img/opening oasis 6.png');
  AM.queueDownload('../img/opening oasis 5.png');
  AM.queueDownload('../img/opening oasis 4.png');
  AM.queueDownload('../img/opening oasis 3.png');
  AM.queueDownload('../img/opening oasis 2.png');
  AM.queueDownload('../img/opening oasis 1.png');

  // forest
  AM.queueDownload("../img/backgroundStars.png");
  AM.queueDownload("../img/backgroundTrees1.png");
  AM.queueDownload("../img/backgroundTrees2.png");
  AM.queueDownload("../img/backgroundTrees3.png");
  AM.queueDownload("../img/backgroundTrees4.png");
  AM.queueDownload("../img/god light.png");
  AM.queueDownload("../img/god light (1).png");
  AM.queueDownload("../img/god light (2).png");

  //city --not all downloaded yet.....
  AM.queueDownload('../img/city_background.png');
  AM.queueDownload('../img/city_buildings_back.png');
  AM.queueDownload('../img/city_clouds_left.png');


  //Hoth snow


  /********** Tile assets ******************/
  //forest
  AM.queueDownload("../img/forest_left_tile.png"); //tiles are 100x100
  AM.queueDownload("../img/forest_center_tile.png");
  AM.queueDownload("../img/forest_right_tile.png");
  AM.queueDownload("../img/forest_both_rounded_tile.png");

  //city

  //Hoth snow

  /********** SceneManager assets ******************/
  //music menu
  AM.queueDownload('../img/music_menu.png');
  AM.queueDownload('../img/music_menu_xfx.png');
  AM.queueDownload('../img/music_menu_xmusic.png');






  AM.downloadAll(function() {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
    console.log('all files loaded');

    var gameEngine = new GameEngine(AM);
    gameEngine.init(ctx);

    gameEngine.start();

    console.log("All Done!");
  });
})();
