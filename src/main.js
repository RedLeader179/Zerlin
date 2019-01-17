/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/




var AM = new AssetManager();

AM.queueDownload("../img/testBackground.jpeg");
AM.queueDownload("../img/Zerlin1 (2).png");
AM.queueDownload("../img/Lightsaber.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    
    gameEngine.addEntity(new Layer1(gameEngine, AM.getAsset("../img/testBackground.jpeg")));
    gameEngine.addEntity(new Zerlin(gameEngine, AM.getAsset("../img/Zerlin1 (2).png")));
    gameEngine.addEntity(new Lightsaber(gameEngine, AM.getAsset("../img/Lightsaber.png")));

    console.log("All Done!");
});