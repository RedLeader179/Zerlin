/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/



(function () {
	var AM = new AssetManager();

	AM.queueDownload("../img/Zerlin bobbing walking.png");
	AM.queueDownload("../img/Zerlin left bobbing walking.png");
	AM.queueDownload("../img/Zerlin backwards bobbing walking.png");
	AM.queueDownload("../img/Zerlin left backwards bobbing walking.png");
	AM.queueDownload("../img/Zerlin standing.png");
	AM.queueDownload("../img/Zerlin standing left.png");

	AM.queueDownload("../img/Lightsaber with point of rotation drawn.png");
	AM.queueDownload("../img/Lightsaber with point of rotation drawn left.png");
	AM.queueDownload("../img/lightsaber upside down.png");
	AM.queueDownload("../img/lightsaber upside down left.png");

	AM.queueDownload("../img/Zerlin somersault.png");


	AM.downloadAll(function () {
	    var canvas = document.getElementById("gameWorld");
	    var ctx = canvas.getContext("2d");

	    var gameEngine = new GameEngine();
	    gameEngine.init(ctx);
	    gameEngine.start();
	    
	    gameEngine.addZerlin(new Zerlin(gameEngine, AM));

	    console.log("All Done!");
	});	
})();
