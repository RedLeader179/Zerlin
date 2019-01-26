/*
DroidEntites
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/

//Droid Constants
var DROID_ZERLIN_MOVEMENT = 1; //amount a droid will move when left or right key is pressed
//can potentially add in another zerlin move constant for rolling

//basic droid constants
var BASIC_DROID_SHOOT_INTERVAL = 120;
var BASIC_DROID_X_MOVEMENT_SPEED = 150;
var BASIC_DROID_Y_MOVEMENT_SPEED = 100;
var BASIC_DROID_X_VELOCITY = 0.35;
var BASIC_DROID_Y_VELOCITY = 1;
var BASIC_DROID_ORBITAL_X_OFFSET = 0;
var BASIC_DROID_ORBITAL_Y_OFFSET = -200;
var BASIC_DROID_ZERLIN_MOVE_RIGHT_SPEED = 1;

//random constants ("interesting")
var BASIC_DROID_MAX_RANDOM_TARGET_WIDTH = 40;
var BASIC_DROID_MAX_RANDOM_TARGET_HEIGHT = 40;

//Laser constants
var BASIC_DROID_LASER_SPEED = 100; 
var BASIC_DROID_LASER_LENGTH = 10;
var BASIC_DROID_LASER_WIDTH = 20;
var LASER_ZERLIN_MOVEMENT = 1;

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
        this.radius = 35;
        this.boundCircle = {x: this.x, y: this.y, radius: this.radius};

    }
    /**
     * this method will change the state of each droid such as firing 
     * and moving and will be implemented more in each childDroid
     */
    update() {
        // All droids will move when left or right is pressed but not both at the same time
        if (this.game.keys['KeyD'] && this.game.keys['KeyA']);
        else if (this.game.keys['KeyD']) {
            this.x = this.x - DROID_ZERLIN_MOVEMENT;
        } 
        else if (this.game.keys['KeyA']) {
            this.x = this.x + DROID_ZERLIN_MOVEMENT;
        }

        //check collision with other droids.
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (this != ent && ent instanceof AbstractDroid && this.collide(ent)) {
                //On droid collision, swap velocities
                var tempX = this.deltaX;
                var tempY = this.deltaY;
                this.deltaX = ent.deltaX;
                this.deltaY = ent.deltaY;
                ent.deltaX = tempX;
                ent.deltaY = tempY;
                //may need to shunt droids a little.
            };
        }

        super.update();
    }
    draw() {
        //debug: draw the bounding circle around the droid
        if (this.game.showOutlines) {
            this.game.ctx.beginPath();
            this.game.ctx.strokeStyle = "green";
            this.game.ctx.arc(this.boundCircle.x, 
                this.boundCircle.y, this.boundCircle.radius, 0, Math.PI * 2, false);
            this.game.ctx.stroke();
            this.game.ctx.closePath();
            this.game.ctx.closePath();
            this.game.ctx.restore(); 
        }
        //child droid can choose which animation is the current one 
        // check that animation is not null before drawing.
        if (this.animation) {
            this.animation.drawFrame(this.game.clockTick, this.game.ctx, this.x, this.y);
        }
        super.draw();
    }
    /**
     * this method will remove the droid from the world and add an explosion to the entity list.
     */
    explode() {
        this.removeFromWorld = true;
        //TODO: play droid explosion sound
        this.game.addEntity(new DroidExplosion(this.game, this.x, this.y));
        console.log("droid exploded");
    }
    
}



/*
* Basic droid that will shoot 1 laser every interval
*/
class BasicDroid extends AbstractDroid {
    constructor(game, spritesheet, startX, startY) {
        //super(gameEngine, x, y, deltaX, deltaY)
        //super(game, startX, startY, BASIC_DROID_X_MOVEMENT_SPEED, 0);
        super(game, startX, startY, 0, 0); //debug

        /* animation fields */
        //Animation(spritesheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
        this.idleAnimation = new Animation(spritesheet, 100, 100, 1400, 0.1, 14, true, 0.5);
        this.animation = this.idleAnimation;
        
        /* animation frame width, height and scale for calculating bounding circle */
        this.frameHeight = this.animation.frameHeight * this.animation.scale;
        this.frameWidth = this.animation.frameWidth * this.animation.scale;
        this.scale = this.animation.scale;

        /* bounding circle fields */
        this.radius = 25;
        this.boundCircle = {radius: this.radius, 
            x: this.x + this.frameWidth * this.scale,
            y: this.y + this.frameHeight * this.scale};

        /* shooting fields */
        this.fire = false;
        this.ticksBeforeFire = BASIC_DROID_SHOOT_INTERVAL

        /* movement fields */
        var targetX = (this.game.surfaceWidth / 2) + BASIC_DROID_ORBITAL_X_OFFSET;
        var targetY = (this.game.surfaceHeight / 2) + BASIC_DROID_ORBITAL_Y_OFFSET;
        this.targetOrbitalPoint = {x: targetX, y: targetY};
        
    }
    /* 
    * every update, the basic droid will move around zerlin entity about 50 to 100 pixels above him.
    * The droid will shoot every interval at the main character (as of now, at the mouse)
    * The droid will set removeFromWorld to true when it collides with lightsaber
    */
    update() {
        //update coordinates so the droid will orbit the center of the canvas

        /* droid movement */
        //this.calcMovement(this.targetOrbitalPoint); //un comment after debug

        /* bounding circle movement */
        this.boundCircle.x = this.x + this.frameWidth * this.scale;
        this.boundCircle.y = this.y + this.frameHeight * this.scale;

        /* droid shooting */
        this.ticksBeforeFire--;
        //will shoot at every interval
        if (this.ticksBeforeFire <= 0 && (!this.fire)) {
            this.ticksBeforeFire = BASIC_DROID_SHOOT_INTERVAL;
            this.fire = true;
            //shoot at specific target
            //this.shoot(this.game.Zerlin.x, this.game.Zerlin.y);

            //shoot randomly in target direction
            // this.shootRandom(this.game.Zerlin.x + 50, 
            //     this.game.Zerlin.y + 50, 
            //     BASIC_DROID_MAX_RANDOM_TARGET_WIDTH,
            //     BASIC_DROID_MAX_RANDOM_TARGET_HEIGHT);
        }
        
        
        super.update();
    }
    draw() {
        super.draw();
        
        
    }
    shoot(targetX, targetY) {
        var droidLaser = new DroidLaser(this.game, this.x + 20, this.y + 20, BASIC_DROID_LASER_SPEED, 
            targetX, targetY, BASIC_DROID_LASER_LENGTH, BASIC_DROID_LASER_WIDTH);
        this.game.addEntity(droidLaser);
        //TODO - play shooting sound
        //console.log("shot laser at X: " + targetX + " Y: " + targetY);
        //set after droid is done firing
        this.fire = false;
    }
    /**
     * Method that will shoot a laser randomly in an area from target point
     * to target point + max argument
     */
    shootRandom(targetX, targetY, maxWidth, maxHeight) {
        var randTargetX = targetX + (maxWidth * Math.random());
        var randTargetY = targetY + ((-maxHeight) * Math.random());
        this.shoot(randTargetX, randTargetY);
    }
    /*
     * calculate movement so that it will try to fly around the location of the 
     * target.
     */
    calcMovement(target) {
        //if the droid is to the left of target point, then increase the deltaX
        //by the x velocity
        if (this.x < target.x) {
            if (this.deltaX < BASIC_DROID_X_MOVEMENT_SPEED)
                this.deltaX += BASIC_DROID_X_VELOCITY;
            
        }
        
        //if the droid is to the right of target point, then decrease the deltaX
        //by the x velocity
        else if (this.x > target.x) {
            if (this.deltaX >= (-BASIC_DROID_X_MOVEMENT_SPEED))
                this.deltaX -= BASIC_DROID_X_VELOCITY;
        }

        //if droid is above the target point, then increase deltaY(down)
        if (this.y < target.y) {
            if (this.deltaY <= BASIC_DROID_Y_MOVEMENT_SPEED)
                this.deltaY += BASIC_DROID_Y_VELOCITY;
        }
        //if the droid is below the target point, then decrease the deltaY(up)
        else if (this.y >= target.y) {
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

        //Droid Laser Fields
        this.color = "green";
        this.secondaryColor = "white";
        this.isDeflected = false;

        var distFromStartToTarget = distance({x: targetX, y: targetY}, {x: this.x, y: this.y});
        var unitVectorDeltaX = ((targetX - startX) / distFromStartToTarget);
        var unitVectorDeltaY = ((targetY - startY) / distFromStartToTarget);

        this.deltaX = unitVectorDeltaX * speed;
        this.deltaY = unitVectorDeltaY * speed;

        this.length = length;
        this.width = width;

        // move laser so tail is touching the starting point upon instantiation, instead of the head
        this.x = this.x + unitVectorDeltaX * this.length;
        this.y = this.y + unitVectorDeltaY * this.length;
        this.tailX = startX;
        this.tailY = startY;
        /* find angle of laser */
        this.angle = this.findAngle(this.x, this.y, this.tailX, this.tailY);
        console.log("Laser angle = %d", this.angle);
        
    }
    update() {
        this.removeFromWorld = this.outsideScreen(); // will be removed in GameEngine

        this.x += this.deltaX * this.game.clockTick;
        this.y += this.deltaY * this.game.clockTick;
        this.tailX += this.deltaX * this.game.clockTick;
        this.tailY += this.deltaY * this.game.clockTick;

        //check zerlin movement and move laser accordingly
        /* when a or d is pressed then move the lasers left or right
        * dont move when both a and d are pressed at the same time
        */
        if (this.game.keys['KeyD'] && this.game.keys['KeyA']);
        else if (this.game.keys['KeyD']) {
            this.x = this.x - LASER_ZERLIN_MOVEMENT;
            this.tailX = this.tailX - LASER_ZERLIN_MOVEMENT;
        } 
        else if (this.game.keys['KeyA']) {
            this.x = this.x + LASER_ZERLIN_MOVEMENT;
            this.tailX = this.tailX + LASER_ZERLIN_MOVEMENT;
        }

        //check collision with droid
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (this != ent && this.isDeflected 
                && ent instanceof AbstractDroid && this.collideWithDroid(ent)) {
                console.log("Collision with droid");
                this.color = "red";
                //explode the droid.
                ent.explode();
                //increment points
            }
        }
    
        super.update();
    }
    draw() {
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
        ctx.strokeStyle = this.color;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.tailX, this.tailY);
        ctx.stroke();
        ctx.closePath();

        //inner layer of laser.
        ctx.lineWidth = this.width / 2;
        ctx.strokeStyle = this.secondaryColor;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.tailX, this.tailY);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();

        super.draw()
    }

    /**
     * This method will return a boolean if there is a collision between the laser segment and
     * the droid.
     * @param {AbstractDroid} otherDroid the droid to check collision with
     */
    collideWithDroid(otherDroid) {
        return collideLineWithCircle(this.x, this.y, this.tailX, this.tailY, otherDroid.boundCircle.x,
            otherDroid.boundCircle.y, otherDroid.boundCircle.radius);
        
    }
    /**
     * this method will return the angle of a line in radians 
     */
    findAngle(x1, y1, x2, y2) {
        var dy = y2 - y1;
        var dx = x2 - x1;
        var theta = Math.atan2(dy, dx); //range (-PI to PI)
        theta *= 180 / Math.PI; //rads to degress, range(-180 to 180)
        if (theta < 0) 
            theta = 360 + theta; //range(0 to 360)
        return theta;
    }

}

/**
 * this class will just play the droid explosion animation
 * and when the animation is done, this entity will be removed from world
 */
class DroidExplosion extends Entity {
    constructor(game, x, y) {
        super(game, x, y, 0, 0);
        
        var spritesheet = this.game.assetManager.getAsset("../img/Explosion.png");
        //Animation(spritesheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
        this.animation = new Animation(spritesheet, 64, 64, 256, 0.2, 15, false, 0.8);
    }
    update() {
        super.update();
        if (this.animation.isDone()) {
            this.removeFromWorld = true;
        }
    }
    draw() {
        this.animation.drawFrame(this.game.clockTick, this.game.ctx, this.x, this.y);
        super.draw(this.game.ctx);
    }
}



