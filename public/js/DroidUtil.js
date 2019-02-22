/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/

/*
* This file contains untilities for droids such as the abstract droid class,
* droid laser entity and droid explosion entity.
*/

//Explosion Constants
const duc = Constants.DroidUtilConstants;

/**
 * This class will serve as the parent for all droid entities
 * and will contain methods and fields that all droids are required to have
 * ***! Movement and Shooting Pattern will be implemented by child droids !***
 */
class AbstractDroid extends Entity {
    constructor(game, startX, startY, deltaX, deltaY) {
        super(game, startX, startY, deltaX, deltaY);
        // if the animations are null, then will just not draw the animations.
        this.idleAnimation = null; //need to add the animation after instantiation.
        this.explosionAnimation = null;
        this.shootAnimation = null;
        this.animation = null;

        //collision radius can be changed after instantiation
        // this.radius = 35;

    }
    /**
     * this method will change the state of each droid such as firing
     * and moving and will be implemented more in each childDroid
     */
    update() {
        super.update();
    }
    draw() {
        var camera = this.sceneManager.camera;
        var dimension = this.boundCircle.radius * 2;
        // only draw if in camera's view
        if (camera.isInView(this, dimension, dimension)) {
        //debug: draw the bounding circle around the droid
            if (duc.DRAW_OUTLINES || duc.DRAW_BOUNDING_CIRCLE) { //todo: use only one
                this.game.ctx.beginPath();
                this.game.ctx.strokeStyle = "green";
                this.game.ctx.arc(this.boundCircle.x - camera.x,
                    this.boundCircle.y, this.boundCircle.radius, 0, Math.PI * 2, false);
                this.game.ctx.stroke();
                this.game.ctx.closePath();
                this.game.ctx.closePath(); // ??
                this.game.ctx.restore();
            }
            //child droid can choose which animation is the current one
            // check that animation is not null before drawing.
            if (this.animation) {
                this.animation.drawFrame(this.game.clockTick, this.game.ctx, this.x - camera.x, this.y);
            }
            super.draw();
        }
    }
    /**
     * this method will remove the droid from the world and add an explosion to the entity list.
     */
    explode() {
        this.removeFromWorld = true;
        //TODO: play droid explosion sound
        this.sceneManager.addEntity(new DroidExplosion(this.game, this.x + (this.animation.scale * this.animation.frameWidth / 2), this.y + (this.animation.scale * this.animation.frameHeight / 2)));
    }
    collideWithDroid(ent) {
        return ent !== null && collideCircleWithCircle(this.boundCircle.x, this.boundCircle.y, this.boundCircle.radius,
            ent.boundCircle.x, ent.boundCircle.y, ent.boundCircle.radius);
    }

}







class DroidLaser extends Entity {
    constructor(game, startX, startY, speed, targetX, targetY, length, width, color, deflectedColor) {
        super(game, startX, startY, 0, 0);
        //console.log("created DroidLaser Entity");

        //Droid Laser Fields
        this.color = color;
        this.deflectedColor = deflectedColor;
        this.secondaryColor = "white";
        this.isDeflected = false;

        var distFromStartToTarget = distance({x: targetX, y: targetY}, {x: this.x, y: this.y});
        var unitVectorDeltaX = ((targetX - startX) / distFromStartToTarget);
        var unitVectorDeltaY = ((targetY - startY) / distFromStartToTarget);

        this.deltaX = unitVectorDeltaX * speed;
        this.deltaY = unitVectorDeltaY * speed;
        this.slope = this.deltaY / this.deltaX;

        this.speed = speed;
        this.length = length;
        this.width = width;

        this.isDeflected = false;

        // move laser so tail is touching the starting point upon instantiation, instead of the head
        this.x = this.x + unitVectorDeltaX * this.length;
        this.y = this.y + unitVectorDeltaY * this.length;
        this.tailX = startX;
        this.tailY = startY;
        this.angle = this.findAngleRadians(this.x, this.y, this.tailX, this.tailY);
    }
    update() {
        // keep track of previous position for collision detection
        this.prevX = this.x;
        this.prevY = this.y;

        this.x += this.deltaX * this.game.clockTick;
        this.y += this.deltaY * this.game.clockTick;
        this.tailX += this.deltaX * this.game.clockTick;
        this.tailY += this.deltaY * this.game.clockTick;

        if (this.isOutsideScreen()) {
            this.removeFromWorld = true;
        }

        super.update();
    }
    draw() {
        var cameraX = this.sceneManager.camera.x;
        // only draw if in camera's view
        if (this.sceneManager.camera.isInView(this, this.length, this.length)) {
            var ctx = this.game.ctx;

            //debug laser
            // ctx.save();
            // ctx.lineWidth = 10;
            // ctx.strokeStyle = this.color;
            // ctx.lineCap = "round";
            // ctx.beginPath();
            // ctx.moveTo(this.x, this.y);
            // ctx.lineTo(this.tailX, this.tailY);
            // ctx.stroke();
            // ctx.closePath();
            // ctx.restore();
            //end debug code

            ctx.save();
            //Outer Layer of laser
            ctx.lineWidth = this.width;
            ctx.strokeStyle = this.isDeflected ? this.deflectedColor : this.color;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(this.x - cameraX, this.y);
            ctx.lineTo(this.tailX - cameraX, this.tailY);
            ctx.stroke();

            //inner layer of laser.
            ctx.lineWidth = this.width / 2;
            ctx.strokeStyle = this.secondaryColor;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(this.x - cameraX, this.y);
            ctx.lineTo(this.tailX - cameraX, this.tailY);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
            super.draw();
        }
    }
    calcSlope(p1, p2) {
        return (p1.y - p2.y) / (p1.x - p2.x);
    }
    isOutsideScreen() {
        var camera = this.sceneManager.camera;
        var left = camera.x;
        var right = camera.x + camera.width;
        var top = camera.y;
        var bottom = camera.y + camera.height;

        return this.tailX < left ||
                this.tailX > right ||
                this.tailY < top ||
                this.tailY > bottom;
    }
    /**
     * this method will return the angle of a line in radians
     */
    findAngleDegrees(x1, y1, x2, y2) {
        var dy = y2 - y1;
        var dx = x2 - x1;
        var theta = Math.atan2(dy, dx); //range (-PI to PI)
        theta *= 180 / Math.PI; //rads to degress, range(-180 to 180)
        if (theta < 0)
            theta = 360 + theta; //range(0 to 360)
        return theta;
    }

    findAngleRadians(x1, y1, x2, y2) {
        return Math.atan2(y1 - y2, x1 - x2);
    }


}






/**
 * this class will just play the droid explosion animation
 * and when the animation is done, this entity will be removed from world
 * TODO: Make the sprite sheet animation able to be passed in for different animations.
 * although if sprite sheet is null then use the static animation.
 */
class DroidExplosion extends Entity {
    constructor(game, x, y, scale, explosionVolume) {
        super(game, x, y, 0, 0);

        this.scale = scale? scale * duc.EXPLOSION_SCALE : duc.EXPLOSION_SCALE;
        this.volume = explosionVolume? explosionVolume : .15;
        var spritesheet = this.game.assetManager.getAsset("../img/Explosion.png");
        //Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, scale)
        this.animation = new Animation(spritesheet, 0, 0, 64, 64,
            duc.EXPLOSION_FRAME_SPEED, 15, false, false, this.scale);

        this.x = x - this.animation.frameWidth * this.scale / 2;
        this.y = y - this.animation.frameHeight * this.scale / 2;
        this.game.audio.playSoundFx(this.game.audio.enemy, 'largeExplosion');
    }
    update() {
        super.update();
        if (this.animation.isDone()) {
            this.removeFromWorld = true;
        }
    }
    draw() {
        // only draw if in camera's view
        if (this.sceneManager.camera.isInView(this, this.animation.frameWidth * this.scale, this.animation.frameHeight * this.scale)) {
            this.animation.drawFrame(this.game.clockTick, this.game.ctx, this.x - this.sceneManager.camera.x, this.y);
            super.draw(this.game.ctx);
        }
    }
}
