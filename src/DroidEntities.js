/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/
var BASIC_DROID_SHOOT_INTERVAL = 2;
var BASIC_DROID_X_MOVEMENT_SPEED = 150;
var BASIC_DROID_Y_MOVEMENT_SPEED = 100;
var BASIC_DROID_X_VELOCITY = 1;
var BASIC_DROID_Y_VELOCITY = 1;
var BASIC_DROID_ORBITAL_HEIGHT = 0;
//Math is weird, higher the number, lower the speed. couldn't think of anyway to make this work
//possible refinement needed. use a number between 0 and 1 for speed up;
var BASIC_DROID_LASER_SPEED = 100; 
var BASIC_DROID_LASER_LENGTH = 10;
var BASIC_DROID_LASER_WIDTH = 10;
/*
* Basic droid that will shoot 1 laser every interval
*/
class BasicDroid extends Entity {
    constructor(game, spritesheet, startX, startY) {
        //super(gameEngine, x, y, deltaX, deltaY)
        super(game, startX, startY, BASIC_DROID_X_MOVEMENT_SPEED, 0);
        //Animation(spritesheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
        this.animation = new Animation(spritesheet, 27, 33, 182, 0.5, 3, true, 1);
        this.ctx = game.ctx;
        this.fire = false;
        this.secondsBeforeFire = BASIC_DROID_SHOOT_INTERVAL;
        
    }
    /* 
    * every update, the basic droid will move around zerlin entity about 50 to 100 pixels above him.
    * The droid will shoot every interval at the main character (as of now, at the mouse)
    * The droid will set removeFromWorld to true when it collides with lightsaber
    */
    update() {
        //draw it so will circle around above zerlin
        this.calcMovement(this.game.Zerlin);
        this.secondsBeforeFire -= this.game.clockTick;
        //will shoot at every interval
        if (this.secondsBeforeFire <= 0 && (!this.fire)) {
            this.secondsBeforeFire = BASIC_DROID_SHOOT_INTERVAL;
            this.fire = true;
            this.shoot(this.game.mouse.x, this.game.mouse.y);
        }
        if (this.game.keys['KeyD']) {
            this.x = this.x - 1;
        }

        super.update();
    }
    draw() {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        super.draw(this);
        // Entity.prototype.draw.call(this);
    }
    shoot(targetX, targetY) {
        var droidLaser = new DroidLaser(this.game, this.x + 20, this.y + 20, BASIC_DROID_LASER_SPEED, 
            targetX, targetY, BASIC_DROID_LASER_LENGTH, BASIC_DROID_LASER_WIDTH);
        this.game.addLaser(droidLaser);
        //TODO - play shooting sound
        console.log("shot laser at X: " + targetX + " Y: " + targetY);
        //set after droid is done firing
        this.fire = false;
    }
    /*
     * calculate movement so that it will try to fly around the location of the 
     * entity.
     */
    calcMovement(entity) {
        //if the droid is to the left of zerlin, then increase the deltaX
        //by the x velocity
        if (this.x < entity.x) {
            if (this.deltaX < BASIC_DROID_X_MOVEMENT_SPEED)
                this.deltaX += BASIC_DROID_X_VELOCITY;
            
        }
        
        //if the droid is to the right of zerlin, then decrease the deltaX
        //by the x velocity
        else if (this.x > entity.x) {
            if (this.deltaX >= (-BASIC_DROID_X_MOVEMENT_SPEED))
                this.deltaX -= BASIC_DROID_X_VELOCITY;
        }

        //if droid is above the oribital height, then increase deltaY(down)
        if (this.y < entity.y - BASIC_DROID_ORBITAL_HEIGHT) {
            if (this.deltaY <= BASIC_DROID_Y_MOVEMENT_SPEED)
                this.deltaY += BASIC_DROID_Y_VELOCITY;
        }
        //if the droid is below the orbital height, then decrease the deltaY(up)
        else if (this.y >= entity.y - BASIC_DROID_ORBITAL_HEIGHT) {
            if (this.deltaY >= (-BASIC_DROID_Y_MOVEMENT_SPEED)) 
                this.deltaY -= BASIC_DROID_Y_VELOCITY;
        }      

        //after calculating change in x and y then increment x and y by delta x and delta y
        // this.x += this.game.clockTick * (Math.random() * this.deltaX);
        // this.y += this.game.clockTick * (Math.random() * this.deltaY);
        this.x += this.game.clockTick * this.deltaX;
        this.y += this.game.clockTick * this.deltaY;
        
        
    }
}



class DroidLaser extends Entity {
    constructor(game, startX, startY, speed, targetX, targetY, length, width) {
        super(game, startX, startY, 0, 0);
        //console.log("created DroidLaser Entity");

        var distFromStartToTarget = Math.pow(Math.pow(targetX - startX, 2) + Math.pow(targetY - startY, 2), .5);
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
    }
    update() {
        // keep track of previous position for collision detection
        this.prevX = this.x;
        this.prevY = this.y;
        this.x += this.deltaX * this.game.clockTick;
        this.y += this.deltaY * this.game.clockTick;
        this.tailX += this.deltaX * this.game.clockTick;
        this.tailY += this.deltaY * this.game.clockTick;

        if (this.isCollidedWithSaber()) {
            this.deflect();
        }

        if (this.isOutsideScreen()) {
            this.removeFromWorld = true;
        }
        super.update();
    }
    draw() {
        var ctx = this.game.ctx;
        ctx.save();
        //green outer layer of laser
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.isDeflected ? "blue" : "green";
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.tailX, this.tailY);
        ctx.stroke();

        //white inner layer of laser.
        ctx.lineWidth = this.width / 2;
        ctx.strokeStyle = "white";
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.tailX, this.tailY);
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
        super.draw()
    }
    isCollidedWithSaber() {
        var lightsaber = this.game.Zerlin.lightsaber;
        if (lightsaber.hidden) {
            return false;
        }
        // decrease miss percentage by also checking previous blade
        return this.isCollidedWithLine(lightsaber.bladeCollar, lightsaber.bladeTip) ||
                this.isCollidedWithLine(lightsaber.prevBladeCollar, lightsaber.prevBladeTip);
    }
    isCollidedWithLine(p1, p2) {
        // TODO: possibly change segment intersection using clockwise check (more elegant)

        // laser's point-slope equation
        var m1 = this.slope;
        var b1 = this.y - m1 * this.x;

        // other's point-slope equation
        var m2 = this.calcSlope(p1, p2);
        var b2 = p2.y - m2 * p2.x;

        var parallel = m1 === m2;
        if (!parallel) {
            var intersection = {};

            // set point slope equations of each equal to eachother
            // 1. mx + b = nx + c 
            // 2. (m - n)x = c - b
            // 3. x = (c - b) / (m - n)
            intersection.x = (b2 - b1) / (m1 - m2);

            // plug in x to one equation to find y
            intersection.y = m1 * intersection.x + b1;
            return this.isPointOnSegment(intersection, {p1: this, p2: {x: this.prevX, y: this.prevY}}) 
                    && this.isPointOnSegment(intersection, {p1: p1, p2: p2});

        } else { // can't collide if parallel.
            return false;
        }
    }
    calcSlope(p1, p2) {
        return (p1.y - p2.y) / (p1.x - p2.x);
    }
    isPointOnSegment(pt, segment) {
        return (pt.x >= Math.min(segment.p1.x, segment.p2.x))
            && (pt.x <= Math.max(segment.p1.x, segment.p2.x))
            && (pt.y >= Math.min(segment.p1.y, segment.p2.y))
            && (pt.y <= Math.max(segment.p1.y, segment.p2.y));
    }
    deflect() {
        this.isDeflected = true;

        var saberAngle = this.game.Zerlin.lightsaber.getSaberAngle();
        var laserAngle = Math.atan2(this.y - this.prevY, this.x - this.prevX);
        var newLaserAngle = 2 * saberAngle - laserAngle;
        var unitVectorDeltaX = Math.cos(newLaserAngle);
        var unitVectorDeltaY = Math.sin(newLaserAngle);
        this.deltaX = unitVectorDeltaX * this.speed;
        this.deltaY = unitVectorDeltaY * this.speed;
        this.slope = this.deltaY / this.deltaX;

        // move laser so tail is touching the deflection point, instead of the head
        this.tailX = this.x; // TODO: change to deflection point
        this.tailY = this.y;
        this.x = this.x + unitVectorDeltaX * this.length;
        this.y = this.y + unitVectorDeltaY * this.length;
    }
    isOutsideScreen() {
        return this.tailX < 0 ||
                this.tailX > this.game.ctx.canvas.width ||
                this.tailY < 0 ||
                this.tailY > this.game.ctx.canvas.height;
    }

}


