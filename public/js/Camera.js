/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/




var ZERLIN_POSITION_ON_SCREEN = .382; // = (1 - 1/PHI)

class Camera {

	constructor(game, startX, startY, width, height) {
		this.game = game;
		this.x = startX;
		this.y = startY;
		this.width = width;
		this.height = height;
		this.parallaxManager = new ParallaxBackgroundManager(game, this);
	}

	update() {
		this.x = this.game.Zerlin.x - ZERLIN_POSITION_ON_SCREEN * this.width;
		this.parallaxManager.update();
	}

	draw() {
		this.parallaxManager.draw();
	}

	isInView(entity) {
		return entity.x + 100 > this.x &&
			   entity.x - 20 < this.x + this.width &&
			   entity.y + 100 > this.y &&
			   entity.y - 20 < this.y + this.height;
	}

}


//add a method to change out the background images we are looping through
/**
 * Manage and animate backgrounds.
 */
class ParallaxBackgroundManager { 
    
    constructor(game, camera) {
    	this.game = game;
    	this.camera = camera;
        this.parralaxBackgroundLayers = [];

	    this.addBackgroundLayer(
	        new ParallaxScrollBackground(game, game.assetManager.getAsset('../img/backgroundTrees4.png'), 1, camera, 10000));
	    this.addBackgroundLayer(
	        new ParallaxScrollBackground(game, game.assetManager.getAsset('../img/backgroundStars.png'), 1, camera, 5000));
	    this.addBackgroundLayer(
	        new ParallaxScrollBackground(game, game.assetManager.getAsset('../img/backgroundTrees3.png'), 1, camera, 2500));
	    this.addBackgroundLayer(
	        new ParallaxScrollBackground(game, game.assetManager.getAsset('../img/backgroundTrees2.png'), 1, camera, 1200));
	    this.addBackgroundLayer(
	        new ParallaxScrollBackground(game, game.assetManager.getAsset('../img/backgroundTrees1.png'), 1, camera, 600));
    }

    addBackgroundLayer(background) {
    	// background.game = this.game;
        this.parralaxBackgroundLayers.push(background);
    }

    update() {
        this.parralaxBackgroundLayers.forEach(layer => {
        	layer.update();
        });
    }

    draw() {
        this.parralaxBackgroundLayers.forEach(layer => {
        	layer.draw();
        });
    }
}

/*
 * An individual image to be drawn with its follower.
 */
class ParallaxScrollBackground extends Entity {  

    constructor(game, backgroundImage, scale, camera, distanceFromCamera) {
        super(game, 0, 0, 0, 0);
        this.scale = scale; // TODO: integrate scale of image
        this.backgroundImage = backgroundImage;
        this.imageWidth = backgroundImage.width;
        this.camera = camera;

        console.assert(this.imageWidth >= this.camera.width, "Image width must be larger than camera width!");
        console.assert(this.backgroundImage.height >= this.camera.height, "Image height must be larger than camera height!");
        this.distanceFromCamera = distanceFromCamera;

        this.ctx = game.ctx;
        this.imageDistanceFromX = 0;
    }

    update() { 
    	// simulates slower movement for further distances
        this.x = this.camera.x - (this.camera.x * 100 / this.distanceFromCamera);

    	// x moves slower than camera, so update how far image is drawn from x to "keep up" with camera.
        if (this.imageDistanceFromX + (2 * this.imageWidth) + this.x < this.camera.x + this.camera.width) {
        	this.imageDistanceFromX = this.imageDistanceFromX + this.imageWidth;
        } 
        else if (this.imageDistanceFromX + this.x > this.camera.x) {
        	this.imageDistanceFromX = this.imageDistanceFromX - this.imageWidth;
        }
    }

    draw() {
        this.ctx.drawImage(this.backgroundImage, this.imageDistanceFromX + this.x - this.camera.x, this.y); 
        this.ctx.drawImage(this.backgroundImage, this.imageDistanceFromX + this.x + this.imageWidth - this.camera.x, this.y);
    }
}


class ParallaxRotatingBackground extends Entity { 

}



class ParallaxAnimatedBackground extends Entity { 

}



class ParallaxFunctionalBackground extends Entity { 

}



