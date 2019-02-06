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
        console.log("Queueing " + path);
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
            console.log(path);
            img.addEventListener("load", function () {
                console.log("Loaded " + this.src);
                that.successCount++;
                if (that.isDone())
                    callback();
            });
            img.addEventListener("error", function () {
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
(function () {
	var AM = new AssetManager();

	AM.queueDownload("../img/basic_droid.png");
	AM.queueDownload("../img/Explosion.png");

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

	AM.queueDownload("../img/Lightsaber with point of rotation drawn.png");
	AM.queueDownload("../img/Lightsaber with point of rotation drawn left.png");
	AM.queueDownload("../img/lightsaber upside down.png");
	AM.queueDownload("../img/lightsaber upside down left.png");

	AM.queueDownload("../img/backgroundStars.png");
	AM.queueDownload("../img/backgroundTrees1.png");
	AM.queueDownload("../img/backgroundTrees2.png");
	AM.queueDownload("../img/backgroundTrees3.png");
	AM.queueDownload("../img/backgroundTrees4.png");
	AM.queueDownload("../img/droid-j-row.png");

	AM.queueDownload("../img/forest_left_tile.png"); //tiles are 60x60
	AM.queueDownload("../img/forest_center_tile.png");
	AM.queueDownload("../img/forest_right_tile.png");
	AM.queueDownload("../img/forest_both_rounded_tile.png");

	AM.queueDownload("../img/leggy_droid.png");


	AM.downloadAll(function () {
	    var canvas = document.getElementById("gameWorld");
		var ctx = canvas.getContext("2d");
		
	    var gameEngine = new GameEngine(AM);
	    gameEngine.init(ctx);


		// gameEngine.addDroid(new BasicDroid(gameEngine, AM.getAsset("../img/droid-j-row.png"), 1020, 166));
		// gameEngine.addDroid(new BasicDroid(gameEngine, AM.getAsset("../img/droid-j-row.png"), 111, 255));
		// gameEngine.addDroid(new BasicDroid(gameEngine, AM.getAsset("../img/droid-j-row.png"), 610, 220));
		// gameEngine.addDroid(new BasicDroid(gameEngine, AM.getAsset("../img/droid-j-row.png"), 493, 360));
		// gameEngine.addDroid(new BasicDroid(gameEngine, AM.getAsset("../img/droid-j-row.png"), 968, 9));

		// //alternative basic droid
		// let basic_droid = new BasicDroid(gameEngine, AM.getAsset("../img/basic_droid.png"), 420, 89);
		// // constructor(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
		// let basic_droid_anime = new Animation(AM.getAsset("../img/basic_droid.png"), 30.5, 34, 183, 0.1, 6, true, 1.5);
		// basic_droid.idleAnimation = basic_droid_anime;
		// basic_droid.animation = basic_droid.idleAnimation;
		// gameEngine.addDroid(basic_droid);

		// gameEngine.addDroid(new LeggyDroid(gameEngine, AM.getAsset("../img/leggy_droid.png"), 500, 20));
		// gameEngine.addDroid(new LeggyDroid(gameEngine, AM.getAsset("../img/leggy_droid.png"), 300, 40));
		// gameEngine.addDroid(new LeggyDroid(gameEngine, AM.getAsset("../img/leggy_droid.png"), 800, 200));


		gameEngine.start();

		document.getElementById("playMusic").addEventListener("click", () => {
			gameEngine.unPauseAudio();
		})

		document.getElementById("pauseMusic").addEventListener("click", () => {
			gameEngine.pauseAudio();
		})

	    console.log("All Done!");
	});	
})();

