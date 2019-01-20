/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/
class Zerlin extends Entity {
    constructor(game, spritesheet) {
        super(game, 250, 250, 0, 0);
        this.animation = new Animation(spritesheet, 102, 270, 600, 0.1, 6, true, 1);
        this.ctx = game.ctx;
        this.movingRight = true;
        // this.armSocketX = ... find exact arm socket location on body image for rotation
        // this.armSocketY = ...
    }
    update() {
        this.x += this.game.clockTick * this.deltaX; // ultimately deltaX should always be 0, stays centered
        this.y += this.game.clockTick * this.deltaY;
        // if (this.x > 800) this.x = -230; // not needed for all of our entities. should be allowed to wander offscreen
    }
    draw() {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    
    }
    // functions for updating the animation and sprite being used
    moveForward() {
    }
    moveBackward() {
    }
    standStill() {
    }
    jump() {
    }
    slash() {
    }
}

class Lightsaber extends Entity {
    constructor(game, spritesheet) {
        super(game, 270, 220, 0, 0);
        this.image = spritesheet;
        this.ctx = game.ctx;
        this.angle = 0;
        this.armSocketX = 12; //.. find exact arm socket location on body image for rotation
        this.armSocketY = 150; //...
    }
    update() {
        // rotate 
        this.angle += this.game.clockTick * Math.PI / 4;
    }
    draw() {
        this.ctx.save();
        this.ctx.translate(this.x + this.armSocketX, this.y + this.armSocketY);
        this.ctx.rotate(this.angle + Math.PI / 2);
        this.ctx.drawImage(this.image, -this.armSocketX, -this.armSocketY);
        this.ctx.restore();
        // this.ctx.drawImage(this.image,
        //                this.x, this.y,
        //                132, 210);
    }
}



