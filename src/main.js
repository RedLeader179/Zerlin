/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/




var AM = new AssetManager();

// AM.queueDownload("../img/testBackground2.jpg");
AM.queueDownload("../img/Zerlin1 (2).png");
AM.queueDownload("../img/Zerlin1 (2) left.png");
AM.queueDownload("../img/Lightsaber with point of rotation drawn.png");
AM.queueDownload("../img/Lightsaber with point of rotation drawn left.png");
AM.queueDownload("../img/lightsaber upside down.png");
AM.queueDownload("../img/lightsaber upside down left.png");
// AM.queueDownload("../img/lightsaber upside down left.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    
    // gameEngine.addEntity(new Layer1(gameEngine, AM.getAsset("../img/testBackground2.jpg")));
    gameEngine.addEntity(new Zerlin(gameEngine, AM));
    gameEngine.addEntity(new Lightsaber(gameEngine, AM));

    console.log("All Done!");
});