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
AM.queueDownload("../img/stars.png");
AM.queueDownload("../img/backgroundTrees1.png");
AM.queueDownload("../img/backgroundTrees2.png");
AM.queueDownload("../img/backgroundTrees3.png");
AM.queueDownload("../img/backgroundTrees4.png");
AM.queueDownload("../img/droid-j-row.png");


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
        6, 0, 0));
    parallaxBackgroundManager.addBackgroundImage(
        new ParallaxBackground(gameEngine, AM.getAsset('../img/backgroundTrees1.png'), 
        8, 0, 0));
    gameEngine.addEntity(parallaxBackgroundManager);
    

    gameEngine.addEntity(new DroidJosh(gameEngine, AM.getAsset("../img/droid-j-row.png")));
    // gameEngine.addEntity(new Layer1(gameEngine, AM.getAsset("../img/testBackground2.jpg")));
    // gameEngine.addEntity(new Zerlin(gameEngine, AM.getAsset("../img/Zerlin1 (2).png")));
    // gameEngine.addEntity(new Lightsaber(gameEngine, AM.getAsset("../img/Lightsaber with point of rotation drawn.png")));

    
    gameEngine.start();
    console.log("All Done!");
});


class DroidJosh extends Entity {
    constructor(game, spritesheet) {
        super(game, 50, 50, 0, 0);
        this.animation = new Animation(spritesheet, 100, 100, 1400, 0.1, 14, true, 1);
        this.ctx = game.ctx;
    }
    update() {
        // this.x += this.game.clockTick * this.deltaX;
        // this.y += this.game.clockTick * this.deltaY;
    }
    draw() {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
}