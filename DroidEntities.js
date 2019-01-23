/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/
var BASIC_DROID_SHOOT_INTERVAL = 120;
var BASIC_DROID_X_MOVEMENT_SPEED = 150;
var BASIC_DROID_Y_MOVEMENT_SPEED = 100;
var BASIC_DROID_X_VELOCITY = 1;
var BASIC_DROID_Y_VELOCITY = 1;
var BASIC_DROID_ORBITAL_HEIGHT = 200;
//Math is weird, higher the number, lower the speed. couldn't think of anyway to make this work
//possible refinement needed. use a number between 0 and 1 for speed up;
var BASIC_DROID_LASER_SPEED = 1; 
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
        this.ticksBeforeFire = BASIC_DROID_SHOOT_INTERVAL
        
    }
    /* 
    * every update, the basic droid will move around zerlin entity about 50 to 100 pixels above him.
    * The droid will shoot every interval at the main character (as of now, at the mouse)
    * The droid will set removeFromWorld to true when it collides with lightsaber
    */
    update() {
        //draw it so will circle around above zerlin
        this.calcMovement(this.game.entities[0]);
        this.ticksBeforeFire--;
        //will shoot at every interval
        if (this.ticksBeforeFire <= 0 && (!this.fire)) {
            this.ticksBeforeFire = BASIC_DROID_SHOOT_INTERVAL;
            this.fire = true;
            this.shoot(this.game.mouse.x, this.game.mouse.y);
        }
        if (this.game.d) {
            console.log("d pressed");
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
        this.game.addEntity(droidLaser);
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
        this.speed = speed;
        this.targetX = targetX;
        this.targetY = targetY;
        this.length = length;
        this.width = width;

        this.deltaX = this.targetX - this.x;
        this.deltaY = this.targetY - this.y;
        this.slope = (this.deltaY * 1.0) / this.deltaX;
        var newEndPoint = this.extendTargetPoint();
        this.targetX = newEndPoint.x;
        this.targetY = newEndPoint.y;
        this.deltaX = this.targetX - this.x;
        this.deltaY = this.targetY - this.y;
        // console.log("dx = %f, dy = %f", this.deltaX, this.deltaY);
        // console.log("slope = %f", this.slope);
        // console.log("draw from X: %d, Y: %d, TO X: %d, Y: %d", this.x, this.y, this.targetX, this.targetY);

    }
    update() {
        //if laser goes out of bounds then remove from world
        if (this.outsideScreen()) {
            this.removeFromWorld = true;
            //console.log("laser removed from world");
        } else {
            //change the x and y coordinates 

            //Speed formula of lasers, can modify with speed field
            var d = Math.sqrt(Math.pow((this.targetX - this.x), 2) + Math.pow((this.targetY - this.y), 2));
            this.x += (this.deltaX / d) * this.speed;
            this.y += (this.deltaY / d) * this.speed;
            
        }
        super.update();
    }
    draw() {
        var ctx = this.game.ctx;
        //draw a line of size length along a tragectory between start and end points.
        var nextPoint = this.calcNextPoint(this.targetX, this.targetY);
        
        ctx.save();
        //green outer layer of laser
        ctx.lineWidth = this.width;
        ctx.strokeStyle = "green";
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(nextPoint.x, nextPoint.y);
        ctx.stroke();
        ctx.closePath();

        //white inner layer of laser.
        ctx.lineWidth = this.width / 2;
        ctx.strokeStyle = "white";
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(nextPoint.x, nextPoint.y);
        ctx.stroke();
        ctx.closePath();

        ctx.restore();

        
        
    }
    /*
    * this function will extend the target parameters to go past the 
    * borders of the canvas.
    * This is mainly to solve a bug in the calcNextPoint method
    * where when the start point overlappes the end point then it shifts and draws backwards.
    */
    extendTargetPoint() {
        // need to find a point that is accross the canvas boundries 
        // that is also in a line.
        var tempX = this.targetX;
        var tempY = this.targetY;
        //keep suming tempX and tempY by deltaX and deltaY until the temp X or Y
        // is less than 0 or is greater than max width or height.
        while (tempX > -10 && tempX < this.game.surfaceWidth + 10 ||
            tempY > -10 && tempY < this.game.surfaceHeight + 10) {

            tempX += this.deltaX;
            tempY += this.deltaY;
        }
        return {x: tempX, y: tempY};
        
    }
    /*
    * This function will calculate the next point along the path of the 
    * laser tragectory allowing a line to be drawn from the incrementing 
    * x, y to an arbitrary point some length away.
    */
    calcNextPoint(x1, y1) {

        //d is the distance between (x,y) and the target x and y
        var d = Math.sqrt(Math.pow((x1 - this.x), 2) + Math.pow((y1 - this.y), 2));
        //t is the ratio of distances
        var t = this.length / d;
        var xt = (1 - t) * this.x + (t * x1);
        var yt = (1 - t) * this.y + (t * y1);
        // console.log("START X: %f, Y: %f", this.x, this.y);
        // console.log("NEXT X: %f, Y: %f", xt, yt);
        // console.log("TARGET X: %f, Y: %f", x1, y1);
        
        return {x: xt, y: yt};


    }

}



