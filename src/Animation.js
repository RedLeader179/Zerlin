/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/
/*
 * Animate spriteSheets.
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
    constructor(game) {
        super(game, 0, 0);
        this.scrollDirection = 0; // change to 0 by default
        this.parralaxBackgroundsArray = [];
    }
    addBackgroundImage(background) {
        this.parralaxBackgroundsArray.push(background);
    }
    update() {
        // console.log(`right: ${this.game.moveRight} left: ${this.game.moveRight}`);
        if(this.game.moveRight)  {
            console.log('right');
            this.scrollDirection = 1;
        } else if (this.game.moveLeft) {
            this.scrollDirection = -1;
            console.log('left');
        } else if (!this.game.moveLeft || !this.game.moveRight) {
            this.scrollDirection = 0;
            // console.log('stop');
        }  
    }
    draw() {
        // console.log('direction: ' + this.scrollDirection);
        this.parralaxBackgroundsArray.forEach(element => {
            element.scrollDirection = this.scrollDirection;
            element.update();
            element.draw();
        });
    }
}

// an individual image to be drawn with its follower
class ParallaxBackground extends Entity {  
    constructor(game, backgroundImage, speed, startX, startY) {
        super(game, startX, startY);
        this.backgroundImage = backgroundImage;
        this.speed = speed;
        this.startX = startX;
        this.imageWidth = this.backgroundImage.width;

        this.ctx = game.ctx;
        //setup initially for background to scroll to the left
        this.scrollDirection = -1;
        this.image1X = this.startX;
        this.image2X = this.startX + this.imageWidth;
    }
    update() { 
        if (this.scrollDirection === 1) { //right scroll
            if(this.image1X === this.imageWidth + this.startX) {
                this.image1X = this.startX - this.imageWidth;
            } else if(this.image2X >= this.imageWidth + this.startX) {
                this.image2X = this.startX - this.imageWidth;
            }
        } else if (this.scrollDirection === -1) { //left scroll
            if (this.image1X === this.startX - this.imageWidth) { 
                this.image1X = this.startX + this.imageWidth; 
            } else if (this.image2X === this.startX - this.imageWidth) {
                this.image2X = this.startX + this.imageWidth; 
            }
        }
        //move images left or right
        this.image1X += this.speed * this.scrollDirection; 
        this.image2X += this.speed * this.scrollDirection; 
    }
    draw() {
        this.ctx.drawImage(this.backgroundImage, this.image1X, this.y); 
        this.ctx.drawImage(this.backgroundImage, this.image2X, this.y);
    }
}






