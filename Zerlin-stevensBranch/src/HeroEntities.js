/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/




function Zerlin(game, spritesheet) {
    this.animation = new Animation(spritesheet, 102, 270, 600, 0.1, 6, true, 0.4);
    this.ctx = game.ctx;
    this.movingRight = true;
    // this.armSocketX = ... find exact arm socket location on body image for rotation
    // this.armSocketY = ...
    Entity.call(this, game, 250, 400, 0, 0);
}

Zerlin.prototype = new Entity();
Zerlin.prototype.constructor = Zerlin;

Zerlin.prototype.update = function () {
    this.x += this.game.clockTick * this.deltaX; // ultimately deltaX should always be 0, stays centered
    this.y += this.game.clockTick * this.deltaY;
    // if (this.x > 800) this.x = -230; // not needed for all of our entities. should be allowed to wander offscreen

    Entity.prototype.update.call(this);
}

Zerlin.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);

    Entity.prototype.draw.call(this);
}


// functions for updating the animation and sprite being used
Zerlin.prototype.moveForward = function() {

}

Zerlin.prototype.moveBackward = function() {

}

Zerlin.prototype.standStill = function() {

}

Zerlin.prototype.jump = function() {

}

Zerlin.prototype.slash = function() {

}




function Lightsaber(game, spritesheet) {
    this.image = spritesheet;
    this.ctx = game.ctx;
    this.angle = 0;
    this.armSocketX = 12;//.. find exact arm socket location on body image for rotation
    this.armSocketY = 150;//...
    Entity.call(this, game, 270, 220, 0, 0);
}

Lightsaber.prototype = new Entity();
Lightsaber.prototype.constructor = Lightsaber;

Lightsaber.prototype.update = function () {
    // rotate 
    this.angle += this.game.clockTick * Math.PI / 4;

    Entity.prototype.update.call(this);

}

Lightsaber.prototype.draw = function () {
    this.ctx.save();
    this.ctx.translate(this.x + this.armSocketX, this.y + this.armSocketY);
    this.ctx.rotate(this.angle + Math.PI/2);
    this.ctx.drawImage(this.image, -this.armSocketX, -this.armSocketY);
    this.ctx.restore();
    // this.ctx.drawImage(this.image,
    //                this.x, this.y,
    //                132, 210);
	
}