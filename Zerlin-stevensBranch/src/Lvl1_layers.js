/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/




function Layer1(game, image) {
	// animation not needed for background layers
	this.image = image;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 0, -20, 0);
}

Layer1.prototype = new Entity();
Layer1.prototype.constructor = Layer1;

Layer1.prototype.update = function () {
    this.x += this.game.clockTick * this.deltaX;
    this.y += this.game.clockTick * this.deltaY; // ultimately deltaY should always be 0 (does not move vertically)
    // if (this.x > 800) this.x = -230; // add logic here to prevent scrolling off edge of map ?

    Entity.prototype.update.call(this);
}

Layer1.prototype.draw = function () {
    this.ctx.drawImage(this.image,
                   this.x, this.y,
                   2800, 700);
}
