/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/

class DroidJosh extends Entity {
    constructor(game, spritesheet) {
        super(game, 50, 50, 10, 4);
        this.animation = new Animation(spritesheet, 100, 100, 1400, 0.1, 14, true, 1);
        this.ctx = game.ctx;
    }
    update() {
        this.x += this.game.clockTick * this.deltaX;
        this.y += this.game.clockTick * this.deltaY;
    }
    draw() {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
}


class Chewbacca extends Entity {
    constructor(game, spritesheet) {
        super(game, 150, 511, 0, 0);
        //animation 
        //(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
        this.animation = new Animation(spritesheet, 30, 72, 150, 0.35, 4, true, 1.9);
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



