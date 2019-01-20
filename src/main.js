/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/

var AM = new AssetManager();

AM.queueDownload("../img/testBackground2.jpg");
AM.queueDownload("../img/Zerlin1 (2).png");
AM.queueDownload("../img/Lightsaber with point of rotation drawn.png");
AM.queueDownload("../img/star508x374.png");
AM.queueDownload("../img/testStars1.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);

    const parallaxBackgroundManager = new ParallaxBackgroundManager(gameEngine); 
    parallaxBackgroundManager.addBackgroundImage(
        new ParallaxBackground(gameEngine, AM.getAsset('../img/testStars1.png'), 
        2, 0, 0));
    gameEngine.addEntity(parallaxBackgroundManager);
    
    // gameEngine.addEntity(new Layer1(gameEngine, AM.getAsset("../img/testBackground2.jpg")));
    gameEngine.addEntity(new Zerlin(gameEngine, AM.getAsset("../img/Zerlin1 (2).png")));
    gameEngine.addEntity(new Lightsaber(gameEngine, AM.getAsset("../img/Lightsaber with point of rotation drawn.png")));

    
    gameEngine.start();
    console.log("All Done!");
});