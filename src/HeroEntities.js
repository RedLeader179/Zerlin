/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/



var PHI = 1.618;

var zerlinScale = .6;

var zerlinWidth = 114;
var zerlinHeight = 306;
var zerlinArmSocketX = 33;
var zerlinArmSocketY = 146;
var zerlinHorizantalPlacement = 2 - PHI;

var zerlinWalkingFrameSpeed = .16;
var zerlinWalkingFrames = 6;
var zerlinStandingFrameSpeed = .4;
var zerlinStandingFrames = 2;

var somersaultWidth = 462;
var somersaultHeight = 306;
var somersaultFrameSpeed = .1;
var somersaultFrames = 10;

var jumpHeight = 200;
var forceJumpInitialDeltaY = -950;
var jumpInitialDeltaY = -500;
var gravitationalAcceleration = 1000;


function Zerlin(game, assetManager) {
    this.assetManager = assetManager;
    this.facingRight = true;
    this.ctx = game.ctx;
    this.direction = 0; // -1 for left, 0 for standing still, 1 for right
    this.somersaulting = false;
    this.jumping = false;

    // placement of Zerlin on canvas
    this.foundationX = this.ctx.canvas.width * zerlinHorizantalPlacement; // x never changes
    this.foundationY = this.ctx.canvas.height / 2; // y will always be dependent on the platform height

    Entity.call(this, game, this.foundationX - (zerlinScale * zerlinArmSocketX), /* change this */ this.foundationY, 0, 0);

    this.lightsaber = new Lightsaber(game, this.assetManager, this);
    this.createAnimations();
}

Zerlin.prototype = new Entity();
Zerlin.prototype.constructor = Zerlin;

Zerlin.prototype.createAnimations = function() {
    this.standFaceRightAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin standing.png"), 
                                           zerlinWidth, 
                                           zerlinHeight, 
                                           zerlinStandingFrames * zerlinWidth, 
                                           zerlinStandingFrameSpeed, 
                                           zerlinStandingFrames, 
                                           true, 
                                           zerlinScale);
    this.standFaceLeftAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin standing left.png"), 
                                           zerlinWidth, 
                                           zerlinHeight, 
                                           zerlinStandingFrames * zerlinWidth, 
                                           zerlinStandingFrameSpeed, 
                                           zerlinStandingFrames, 
                                           true, 
                                           zerlinScale);
    this.moveRightFaceRightAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin bobbing walking.png"), 
                                           zerlinWidth, 
                                           zerlinHeight, 
                                           zerlinWalkingFrames * zerlinWidth, 
                                           zerlinWalkingFrameSpeed, 
                                           zerlinWalkingFrames, 
                                           true, 
                                           zerlinScale);
    this.moveRightFaceLeftAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin left backwards bobbing walking.png"),
                                           zerlinWidth, 
                                           zerlinHeight, 
                                           zerlinWalkingFrames * zerlinWidth, 
                                           zerlinWalkingFrameSpeed, 
                                           zerlinWalkingFrames, 
                                           true, 
                                           zerlinScale);
    this.moveLeftFaceRightAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin backwards bobbing walking.png"), 
                                           zerlinWidth, 
                                           zerlinHeight, 
                                           zerlinWalkingFrames * zerlinWidth, 
                                           zerlinWalkingFrameSpeed, 
                                           zerlinWalkingFrames, 
                                           true, 
                                           zerlinScale);
    this.moveLeftFaceLeftAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin left bobbing walking.png"), 
                                           zerlinWidth, 
                                           zerlinHeight, 
                                           zerlinWalkingFrames * zerlinWidth, 
                                           zerlinWalkingFrameSpeed, 
                                           zerlinWalkingFrames, 
                                           true, 
                                           zerlinScale);
    this.somersaultingAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin somersault.png"), 
                                           somersaultWidth, 
                                           somersaultHeight, 
                                           somersaultFrames * somersaultWidth, 
                                           somersaultFrameSpeed, 
                                           somersaultFrames, 
                                           false, 
                                           zerlinScale);
}

Zerlin.prototype.update = function () {
    this.x += this.game.clockTick * this.deltaX; // ultimately deltaX should always be 0, stays centered, move everything else
    this.y += this.game.clockTick * this.deltaY;

    
    // change sprite on any of these conditions
    if (this.game.mouse.x < this.foundationX && this.facingRight) {
        this.faceLeft();
    } 
    else if (this.game.mouse.x > this.foundationX && !this.facingRight) {
        this.faceRight();
    }
    else if (this.game.keys['KeyD'] && this.game.keys['KeyF']) {
        this.somersaulting = true;
        this.x = this.foundationX - zerlinScale * (somersaultWidth / 2);
        this.lightsaber.hidden = true;
    }
    else if (this.game.keys['Space'] && this.game.keys['KeyV'] && !this.jumping) {
        this.jumping = true;
        this.deltaY = forceJumpInitialDeltaY;
    }
    else if (this.game.keys['Space'] && !this.jumping) {
        this.jumping = true;
        this.deltaY = jumpInitialDeltaY;
    }
    else if (!this.game.keys['KeyD'] && !this.game.keys['KeyA'] && this.direction !== 0) {
        this.direction = 0;
    }
    else if (this.game.keys['KeyD'] && this.game.keys['KeyA']) { // force jump
        // what to do if both pressed? stand still?
    }
    else if (this.game.keys['KeyD'] && !this.game.keys['KeyA'] && this.direction !== 1) {
        this.direction = 1;
    }
    else if (!this.game.keys['KeyD'] && this.game.keys['KeyA'] && this.direction !== -1) {
        this.direction = -1;
    }

    if (this.somersaulting) {
        // check if animation is done (can't call animation.isDone() because it does not have latest clockTick yet)
        if ((this.somersaultingAnimation.elapsedTime  + this.game.clockTick) >= this.somersaultingAnimation.totalTime) {
            this.somersaultingAnimation.elapsedTime = 0;
            this.somersaulting = false;
            
            // reposition Zerlin (x & y)
            if (this.facingRight) {
                this.faceRight();
            } else {
                this.faceLeft();
            }
            this.lightsaber.hidden = false;
        }
    }
    else if (this.jumping) {
        // check if jump is done
            // this.jumping = false;

        // var height = jumpHeight * (-4 * (jumpTime * jumpTime - jumpTime));
        this.deltaY += gravitationalAcceleration * this.game.clockTick;
    }
    this.lightsaber.update();
    Entity.prototype.update.call(this);
}

Zerlin.prototype.draw = function () {
    if (this.somersaulting) {
        this.animation = this.somersaultingAnimation;
    }
    else if (this.facingRight) {
        if (this.direction === -1) {
            this.animation = this.moveLeftFaceRightAnimation;
        } else if (this.direction === 0) {
            this.animation = this.standFaceRightAnimation;
        } else if (this.direction === 1) {
            this.animation = this.moveRightFaceRightAnimation;
        }
    } 
    else { // facing left
        if (this.direction === -1) {
            this.animation = this.moveLeftFaceLeftAnimation;
        } else if (this.direction === 0) {
            this.animation = this.standFaceLeftAnimation;
        } else if (this.direction === 1) {
            this.animation = this.moveRightFaceLeftAnimation;
        }
    }
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    this.lightsaber.draw();
    Entity.prototype.draw.call(this);
}


// functions for updating the animation and sprite being used

Zerlin.prototype.faceRight = function() {
    this.facingRight = true;
    if (!this.somersaulting) {
        this.x = this.foundationX - zerlinScale * zerlinArmSocketX;  
    }
    
}

Zerlin.prototype.faceLeft = function() {
    this.facingRight = false;
    if (!this.somersaulting) {
        this.x = this.foundationX - zerlinScale * (zerlinWidth - zerlinArmSocketX);
    }
}

Zerlin.prototype.jump = function() {

}

Zerlin.prototype.slash = function() {

}








//_____________________________________________________________________________________________






var upSaberImageWidth = 126;
var upSaberImageHeight = 204;
var downSaberImageWidth = 126;
var downSaberImageHeight = 198;

var rightSaberXAxis = 10;
var leftSaberXAxis = 10;
var upSaberYAxis = 147;
var downSaberYAxis = 51;


function Lightsaber(game, assetManager, Zerlin) {
    this.assetManager = assetManager;
    this.ctx = game.ctx;
    this.angle = 0;
    this.Zerlin = Zerlin;
    this.hidden = false;
    Entity.call(this, game, 
                0, 0, // will be set in faceRightUpSaber()
                0, 0);
    this.faceRightUpSaber();
}

Lightsaber.prototype = new Entity();
Lightsaber.prototype.constructor = Lightsaber;

Lightsaber.prototype.update = function () {
    // rotate 
    if (this.game.mouse) {
         // TODO: rotateAndCache if mouse not moved
        this.angle = Math.atan2(this.game.mouse.y - (this.y + (this.armSocketY * zerlinScale)), 
                                this.game.mouse.x - (this.x + (this.armSocketX * zerlinScale)));

        // if (this.angle < 0) { // is this needed?
        //     this.angle += Math.PI * 2;
        // }


    // change sprite on any of these conditions
        if (this.game.mouse.x < this.Zerlin.foundationX && this.facingRight) {
            if (this.saberUp) {
                this.faceLeftUpSaber();
            } else {
                this.faceLeftDownSaber();
            }        
        } 
        else if (this.game.mouse.x > this.Zerlin.foundationX && !this.facingRight) {
            if (this.saberUp) {
                this.faceRightUpSaber();
            } else {
                this.faceRightDownSaber();
            }
        } 
        else if (this.game.rightClickDown && this.saberUp) {
            if (this.game.mouse.x < this.Zerlin.foundationX) {
                this.faceLeftDownSaber();
            } else {
                this.faceRightDownSaber();
            }        
        } else if (!this.game.rightClickDown && !this.saberUp) {
            if (this.game.mouse.x < this.Zerlin.foundationX) {
                this.faceLeftUpSaber();
            } else {
                this.faceRightUpSaber();
            }
        }
    }

    this.x = this.Zerlin.foundationX - (this.armSocketX * zerlinScale), 
    this.y = this.Zerlin.y + (zerlinArmSocketY * zerlinScale) - (this.armSocketY * zerlinScale);

    Entity.prototype.update.call(this);

}

Lightsaber.prototype.draw = function () {
    if (!this.hidden) {
        this.ctx.save();
        this.ctx.translate(this.x + (this.armSocketX * zerlinScale), this.y + (this.armSocketY * zerlinScale));
        this.ctx.rotate(this.angle);
        this.ctx.drawImage(this.image,
                           0,
                           0,
                           this.width,
                           this.height,
                           -(this.armSocketX * zerlinScale),
                           -(this.armSocketY * zerlinScale),
                           zerlinScale * this.width,
                           zerlinScale * this.height);
        this.ctx.restore();
    }
}

Lightsaber.prototype.faceRightUpSaber = function() {
    console.log("faceRightUpSaber");
    this.image = this.assetManager.getAsset("../img/Lightsaber with point of rotation drawn.png");
    this.width = upSaberImageWidth;
    this.height = upSaberImageHeight;
    this.armSocketX = rightSaberXAxis;
    this.armSocketY = upSaberYAxis;

    this.facingRight = true;
    this.saberUp = true;
};

Lightsaber.prototype.faceLeftUpSaber = function() {
    console.log("faceLeftUpSaber");
    this.image = this.assetManager.getAsset("../img/Lightsaber with point of rotation drawn left.png");
    this.width = upSaberImageWidth;
    this.height = upSaberImageHeight;
    this.armSocketX = leftSaberXAxis;
    this.armSocketY = this.height - upSaberYAxis;

    this.facingRight = false;
    this.saberUp = true;
};

Lightsaber.prototype.faceRightDownSaber = function() {
    console.log("faceRightDownSaber");
    this.image = this.assetManager.getAsset("../img/lightsaber upside down.png");
    this.width = downSaberImageWidth;
    this.height = downSaberImageHeight;
    this.armSocketX = rightSaberXAxis;
    this.armSocketY = downSaberYAxis;

    this.facingRight = true;
    this.saberUp = false;
};

Lightsaber.prototype.faceLeftDownSaber = function() {
    console.log("faceLeftDownSaber");
    this.image = this.assetManager.getAsset("../img/lightsaber upside down left.png");
    this.width = downSaberImageWidth;
    this.height = downSaberImageHeight;
    this.armSocketX = leftSaberXAxis;
    this.armSocketY = this.height - downSaberYAxis;

    this.facingRight = false;
    this.saberUp = false;
};


