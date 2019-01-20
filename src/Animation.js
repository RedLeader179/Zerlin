/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/
class Animation {
	constructor(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
		this.spriteSheet = spriteSheet;
		this.frameWidth = frameWidth;
		this.frameDuration = frameDuration;
		this.frameHeight = frameHeight;
		this.sheetWidth = sheetWidth;
		this.frames = frames;
		this.totalTime = frameDuration * frames;
		this.elapsedTime = 0;
		this.loop = loop;
		this.scale = scale;
	}
	drawFrame(tick, ctx, x, y) {
		this.elapsedTime += tick;
		if (this.isDone()) { // TODO: fix bug with finishing one frame early/late mentioned in class (1/15/19)
			if (this.loop) {
				this.elapsedTime = this.elapsedTime - this.totalTime;
			}
			else {
				// finish animation, remove from screen? set next animation? return?
			}
		}
		var frame = this.currentFrame();
		var xIndex = 0;
		var yIndex = 0;
		xIndex = frame % this.sheetWidth;
		yIndex = Math.floor(frame / this.sheetWidth);
		ctx.drawImage(this.spriteSheet, xIndex * this.frameWidth, yIndex * this.frameHeight, this.frameWidth, this.frameHeight, x, y, this.frameWidth * this.scale, this.frameHeight * this.scale);
	}
	currentFrame() {
		return Math.floor(this.elapsedTime / this.frameDuration);
	}
	isDone() {
		return (this.elapsedTime >= this.totalTime);
	}
}


/**
 * Manage and animate backgrounds.
 */
//add all of the parallax images to be drawn to this class
class ParallaxBackgroundManager extends Entity {
    constructor() {
        super();
        this.parralaxBackgroundsArray = [];
    }
    addBackgroundImage(background) {
        this.parralaxBackgroundsArray.push(background);
    }
    update() {}
    draw() {
        this.parralaxBackgroundsArray.forEach(element => {
            element.update();
            element.draw();
        });
    }
}

// an individual image to be drawn whith its follower
class ParallaxBackground extends Entity {
    constructor(game, backgroundImage, speed, scrollDirection, startX, startY, imageWidth) {
        super(game, startX, startY);
        this.backgroundImage = backgroundImage;
        this.speed = speed;
        this.scrollDirection = scrollDirection;
        this.startX = startX;
        this.imageWidth = imageWidth;
        this.ctx = game.ctx;

        //image 1x leads, 2x follows initially
        if (typeof this.scrollDirection  === 'string') {
            if (this.scrollDirection === 'left') {
                this.scrollDirection = -1;
                this.image1X = this.startX;
                this.image2X = this.imageWidth + this.startX;
            } else { //right
                this.scrollDirection = 1;
                this.image1X = this.startX;
                this.image2X = this.startX - this.imageWidth;
            }
        } else {
            console.log("scroll direction takes in string param 'left' or 'right'");
        }
    }
    update() { // !! Todo: left scroll works but right scroll still wrong
        this.image1X += this.speed * this.scrollDirection; 
        this.image2X += this.speed * this.scrollDirection; 

        if (this.scrollDirection === 1) { //right scroll
            if(this.image1X >= this.imageWidth + this.startX) {
                this.image1X = this.imageWidth - this.startX;
            } else if(this.image2X >= this.imageWidth + this.startX) {
                this.image2X = this.imageWidth - this.startX;
            }
        } else if (this.scrollDirection === -1) { //left scroll
            if (this.image1X <= this.startX - this.imageWidth) { 
                this.image1X = this.startX + this.imageWidth; 
            } else if (this.image2X <= this.startX - this.imageWidth) {
                this.image2X = this.startX + this.imageWidth; 
            }
        }
        // console.log(`this x: ${this.x}    start x: ${this.startX}`);
    }
    draw() {
        this.ctx.drawImage(this.backgroundImage, this.image1X, this.y); 
        this.ctx.drawImage(this.backgroundImage, this.image2X, this.y);
    }
}






