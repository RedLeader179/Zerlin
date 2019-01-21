/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/

var AM = new AssetManager();

AM.queueDownload("../img/Zerlin1 (2).png");
AM.queueDownload("../img/Lightsaber with point of rotation drawn.png");

AM.queueDownload("../img/stars.png");
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

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);

    const parallaxBackgroundManager = new ParallaxBackgroundManager(gameEngine); 
    parallaxBackgroundManager.addBackgroundImage(
        new ParallaxBackground(gameEngine, AM.getAsset('../img/backgroundTrees4.png'), 
        2, 0, 0));
    parallaxBackgroundManager.addBackgroundImage(
        new ParallaxBackground(gameEngine, AM.getAsset('../img/stars.png'), 
        3, 0, 0));
    parallaxBackgroundManager.addBackgroundImage(
        new ParallaxBackground(gameEngine, AM.getAsset('../img/backgroundTrees3.png'), 
        4, 0, 0));
    parallaxBackgroundManager.addBackgroundImage(
        new ParallaxBackground(gameEngine, AM.getAsset('../img/backgroundTrees2.png'), 
        5, 0, 0));
    parallaxBackgroundManager.addBackgroundImage(
        new ParallaxBackground(gameEngine, AM.getAsset('../img/backgroundTrees1.png'), 
        6, 0, 0));
    gameEngine.addEntity(parallaxBackgroundManager);
    
    gameEngine.addEntity(new DroidJosh(gameEngine, AM.getAsset("../img/droid-j-row.png")));
    
    gameEngine.addEntity(new Tile(gameEngine, AM.getAsset('../img/forestLeftTile.png'),
    10, 10, [AM.getAsset('../img/forestLeftTile.png'), 
             AM.getAsset('../img/forestMiddleTile.png'),
             AM.getAsset('../img/forestRightTile.png'), '']));
    
    gameEngine.start();
    console.log("All Done!");
});

