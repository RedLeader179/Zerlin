/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/




function Zerlin(game, assetManager) {
    this.assetManager = assetManager;
    this.faceRight();
    this.ctx = game.ctx;
    this.direction = 1; // -1 for left, 0 for standing still, 1 for right

    this.armSocketX = 28; //... find exact arm socket location on body image for rotation
    this.armSocketY = 132; //...
    Entity.call(this, game, -this.armSocketX, -this.armSocketY, 0, 0);
}

Zerlin.prototype = new Entity();
Zerlin.prototype.constructor = Zerlin;

Zerlin.prototype.update = function () {
    this.x += this.game.clockTick * this.deltaX; // ultimately deltaX should always be 0, stays centered
    this.y += this.game.clockTick * this.deltaY;

    if (this.game.mouse) {
        if (this.game.mouse.x < 0 && this.facingRight) {
            this.faceLeft();
        } else if (this.game.mouse.x > 0 && !this.facingRight) {
            this.faceRight();
        }
    }
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

Zerlin.prototype.faceRight = function() {
    this.animation = new Animation(this.assetManager.getAsset("../img/Zerlin1 (2).png"), 114, 294, 684, 0.1, 6, true, 1);
    this.x = -this.armSocketX;
    this.facingRight = true;
}

Zerlin.prototype.faceLeft = function() {
    this.animation = new Animation(this.assetManager.getAsset("../img/Zerlin1 (2) left.png"), 114, 294, 684, 0.1, 6, true, 1);
    this.x = -(114 - this.armSocketX);
    this.facingRight = false;
}



//_____________________________________________________________________________________________


function Lightsaber(game, assetManager) {
    this.assetManager = assetManager;
    this.ctx = game.ctx;
    this.angle = 0;
    this.armSocketX = 10;
    this.armSocketY = 147;
    this.saberUp = true;
    Entity.call(this, game, -this.armSocketX, -this.armSocketX, 0, 0);
    this.faceRightUpSaber();
}

Lightsaber.prototype = new Entity();
Lightsaber.prototype.constructor = Lightsaber;

Lightsaber.prototype.update = function () {
    // rotate 
    if (this.game.mouse) {
         // TODO: rotateAndCache if mouse not moved
        this.angle = Math.atan2(this.game.mouse.y, this.game.mouse.x);

        // if (this.angle < 0) { // is this needed?
        //     this.angle += Math.PI * 2;
        // }

        if (this.game.mouse.x < 0 && this.facingRight) {
            if (this.saberUp) {
                this.faceLeftUpSaber();
            } else {
                this.faceLeftDownSaber();
            }        
        } else if (this.game.mouse.x > 0 && !this.facingRight) {
            if (this.saberUp) {
                this.faceRightUpSaber();
            } else {
                this.faceRightDownSaber();
            }
        } else if (this.game.rightClickDown && this.saberUp) {
            console.log("here");
            if (this.game.mouse.x < 0) {
                this.faceLeftDownSaber();
            } else {
                this.faceRightDownSaber();
            }        
        } else if (!this.game.rightClickDown && !this.saberUp) {
            if (this.game.mouse.x < 0) {
                this.faceLeftUpSaber();
            } else {
                this.faceRightUpSaber();
            }
        }
    }

    Entity.prototype.update.call(this);

}

Lightsaber.prototype.draw = function () {
    this.ctx.save();
    // this.ctx.translate(this.x + this.armSocketX, this.y + this.armSocketY);
    this.ctx.rotate(this.angle);
    this.ctx.drawImage(this.image, this.x, this.y);
    this.ctx.restore();
    // this.ctx.drawImage(this.image,
    //                this.x, this.y,
    //                132, 210);
}

Lightsaber.prototype.faceRightUpSaber = function() {
    console.log("faceRightUpSaber");
    this.image = this.assetManager.getAsset("../img/Lightsaber with point of rotation drawn.png");
    this.x = -this.armSocketX;
    this.y = -this.armSocketY;
    this.facingRight = true;
    this.saberUp = true;
};

Lightsaber.prototype.faceLeftUpSaber = function() {
    console.log("faceLeftUpSaber");
    this.image = this.assetManager.getAsset("../img/Lightsaber with point of rotation drawn left.png");
    this.x = -this.armSocketX;
    this.y =  - (204 - this.armSocketY);
    this.facingRight = false;
    this.saberUp = true;
};

Lightsaber.prototype.faceRightDownSaber = function() {
    console.log("faceRightDownSaber");
    this.image = this.assetManager.getAsset("../img/lightsaber upside down.png");
    this.x = -this.armSocketX;
    this.y = -54;
    this.facingRight = true;
    this.saberUp = false;
};

Lightsaber.prototype.faceLeftDownSaber = function() {
    console.log("faceLeftDownSaber");
    this.image = this.assetManager.getAsset("../img/lightsaber upside down left.png");
    this.x = -this.armSocketX;
    this.y = - (202 - 54);
    this.facingRight = false;
    this.saberUp = false;
};


