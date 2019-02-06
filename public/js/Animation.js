/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/



/*
 * Animate spriteSheets.
//Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, scale) {

 */
class Animation {
    constructor(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, scale) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
	this.reverse = reverse;
	this.scale = scale;
    }


    drawFrame(tick, ctx, x, y) {
        this.scale = this.scale || 1;
        this.elapsedTime += tick;
        if (this.loop) {
            if (this.isDone()) {
                this.elapsedTime = 0;
            }
        } else if (this.isDone()) {
            return;
        }
        var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
        var vindex = 0;
        if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
            index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
            vindex++;
        }
        while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
            index -= Math.floor(this.spriteSheet.width / this.frameWidth);
            vindex++;
        }

        var locX = x;
        var locY = y;
        var offset = vindex === 0 ? this.startX : 0;
        ctx.drawImage(this.spriteSheet,
                    index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                    this.frameWidth, this.frameHeight,
                    locX, locY,
                    this.frameWidth * this.scale,
                    this.frameHeight * this.scale);
    }

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    }

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    }
}


// /**
//  * Tile manager. //not implemented
//  */
// class TileManager extends Entity {
//     constructor(game, tileArray) {
//         super(game, 0, 0, 0, 0);
//         this.leftCornerTile = tileArray[0];
//         this.centerTile = tileArray[1];
//         this.rightTile = tileArray[3];
//         // this.bottomFillerTile = tileArray[4];
//     }
// }
// //Draw a tile of given size.
// class Tile extends Entity {
//     constructor(game, image, startX, startY, tileArray) {
//         super(game, image, startX, startY, 0, 0);
//         this.leftCornerTile = tileArray[0];
//         this.centerTile = tileArray[1];
//         this.rightTile = tileArray[2];
//         this.ctx = game.ctx;
//     }
//     update() {

//     }
//     draw() { //code this with a loop to draw whatever length platform the user wants
//         this.ctx.drawImage(this.leftCornerTile, 40, 640); 
//         this.ctx.drawImage(this.centerTile, 100, 640); 
//         this.ctx.drawImage(this.centerTile, 160, 640);
//         this.ctx.drawImage(this.centerTile, 220, 640); 
//         this.ctx.drawImage(this.centerTile, 280, 640);  
//         this.ctx.drawImage(this.rightTile, 340, 640); 
//     }

// }







