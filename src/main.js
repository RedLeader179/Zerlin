/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/


(function () {
	var AM = new AssetManager();

	//AM.queueDownload("../img/basic_droid.png");
	AM.queueDownload("../img/Explosion.png");

	AM.queueDownload("../img/Zerlin bobbing walking.png");
	AM.queueDownload("../img/Zerlin left bobbing walking.png");
	AM.queueDownload("../img/Zerlin backwards bobbing walking.png");
	AM.queueDownload("../img/Zerlin left backwards bobbing walking.png");
	AM.queueDownload("../img/Zerlin standing.png");
	AM.queueDownload("../img/Zerlin standing left.png");
	AM.queueDownload("../img/Zerlin somersault.png");

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

	AM.queueDownload("../img/forestLeftTile.png"); //tiles are 60x60
	AM.queueDownload("../img/forestMiddleTile.png");
	AM.queueDownload("../img/forestRightTile.png");

	AM.downloadAll(function () {
	    var canvas = document.getElementById("gameWorld");
	    var ctx = canvas.getContext("2d");

	    var gameEngine = new GameEngine(AM);
	    gameEngine.init(ctx);
	    gameEngine.start();

	    const parallaxBackgroundManager = new ParallaxBackgroundManager(gameEngine); 
	    parallaxBackgroundManager.addBackgroundImage(
	        new ParallaxBackground(gameEngine, AM.getAsset('../img/backgroundTrees4.png'), 
	        10, 0, 0));
	    parallaxBackgroundManager.addBackgroundImage(
	        new ParallaxBackground(gameEngine, AM.getAsset('../img/backgroundStars.png'), 
	        20, 0, 0));
	    parallaxBackgroundManager.addBackgroundImage(
	        new ParallaxBackground(gameEngine, AM.getAsset('../img/backgroundTrees3.png'), 
	        30, 0, 0));
	    parallaxBackgroundManager.addBackgroundImage(
	        new ParallaxBackground(gameEngine, AM.getAsset('../img/backgroundTrees2.png'), 
	        40, 0, 0));
	    parallaxBackgroundManager.addBackgroundImage(
	        new ParallaxBackground(gameEngine, AM.getAsset('../img/backgroundTrees1.png'), 
	        60, 0, 0));
	    gameEngine.addEntity(parallaxBackgroundManager);
	    
	    gameEngine.addEntity(new Tile(gameEngine, AM.getAsset('../img/forestLeftTile.png'),
	    10, 10, [AM.getAsset('../img/forestLeftTile.png'), 
	             AM.getAsset('../img/forestMiddleTile.png'),
	             AM.getAsset('../img/forestRightTile.png'), '']));

		gameEngine.addEntity(new BasicDroid(gameEngine, AM.getAsset("../img/droid-j-row.png"), 200, 200));

	    // gameEngine.addZerlin(new Zerlin(gameEngine, AM));

	    gameEngine.start();
	    console.log("All Done!");
	});	

	//Todo: do better
	window.addEventListener('load', function () {
	    function sound(src) {
	        this.sound = document.createElement("audio");
	        this.sound.src = src;
	        this.sound.setAttribute("preload", "auto");
	        this.sound.setAttribute("controls", "none");
	        this.sound.style.display = "none";
	        document.body.appendChild(this.sound);
	        this.play = function(){
	          	this.sound.play();
	        }
	        this.stop = function(){
	        	this.sound.pause();
	        }
	    }
	    var backgroundMusic = new sound('../sound/kashyyyk.mp3');
	    backgroundMusic.play();
	});
})();

