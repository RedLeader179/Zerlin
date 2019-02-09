/*
DroidEntites
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/

//Droid Constants
var DROID_ZERLIN_MOVEMENT = 2.5; //amount a droid will move when left or right key is pressed
//can potentially add in another zerlin move constant for rolling

//basic droid constants
var BASIC_DROID_SHOOT_INTERVAL = .5;
var BASIC_DROID_X_MOVEMENT_SPEED = 150;
var BASIC_DROID_Y_MOVEMENT_SPEED = 100;
var BASIC_DROID_X_ACCELERATION = 60;
var BASIC_DROID_Y_ACCELERATION = 60;
var BASIC_DROID_ORBITAL_X_OFFSET = 200;
var BASIC_DROID_ORBITAL_Y_OFFSET = -200;
var BASIC_DROID_ORBITAL_HEIGHT = 300; // just to make testing easier
var BASIC_DROID_ZERLIN_MOVE_RIGHT_SPEED = 1;

//Laser constants
var BASIC_DROID_LASER_SPEED = 400; 
var BASIC_DROID_LASER_LENGTH = 10;
var BASIC_DROID_LASER_WIDTH = 10;
var LASER_ZERLIN_MOVEMENT = 2.5;

//Explosion Constants
var EXPLOSION_SCALE = 2;

//Leggy Droid
var LEGGY_DROID_SHOOT_INTERVAL = 2;
var LEGGY_DROID_LASER_SPEED = 280; 
var LEGGY_DROID_LASER_LENGTH = 35;
var LEGGY_DROID_LASER_WIDTH = 12;


//Beam Droid
var BEAM_DROID_SHOOT_INTERVAL = 3;
var BEAM_DROID_SHOOT_DURATION = 2;
var BEAM_DROID_LASER_WIDTH = 12;
var BEAM_HP_PER_SECOND = 3;
var BEAM_ANGLE_ACCELERATION_RADIANS = Math.PI / 5;

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
        this.boundCircle = new BoundingCircle(this.x, this.y, this.radius);

    }
    /**
     * this method will change the state of each droid such as firing 
     * and moving and will be implemented more in each childDroid
     */
    update() {
        // All droids will move when left or right is pressed but not both at the same time
        if (this.game.keys['KeyD'] && this.game.keys['KeyA']);
        super.update();
    }
    draw() {
        var camera = this.game.camera;
        var dimension = this.boundCircle.radius * 2;
        // only draw if in camera's view
        if (camera.isInView(this, dimension, dimension)) {
        //debug: draw the bounding circle around the droid
            if (this.game.showOutlines) {
                this.game.ctx.beginPath();
                this.game.ctx.strokeStyle = "green";
                this.game.ctx.arc(this.boundCircle.x - camera.x, 
                    this.boundCircle.y, this.boundCircle.radius, 0, Math.PI * 2, false);
                this.game.ctx.stroke();
                this.game.ctx.closePath();
                this.game.ctx.closePath();
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
        this.game.addEntity(new DroidExplosion(this.game, this.x + (this.animation.scale * this.animation.frameWidth / 2), this.y + (this.animation.scale * this.animation.frameHeight / 2)));

        /********** Call sound engine to play explosion sound ************* */
        this.game.audio.enemy.play('largeExplosion');
        console.log("droid exploded");
    }
    collideWithDroid(ent) {
        return ent !== null && collideCircleWithCircle(this.boundCircle.x, this.boundCircle.y, this.boundCircle.radius,
            ent.boundCircle.x, ent.boundCircle.y, ent.boundCircle.radius);
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
//Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, scale)
    this.idleAnimation = new Animation(spritesheet, 0, 0, 100, 100, 0.1, 14, true, false, .5);
        this.animation = this.idleAnimation;

        /* bounding circle fields */
        this.radius = (this.animation.frameWidth / 2) * this.animation.scale;
        this.boundCircle = {radius: this.radius, 
            x: this.x + (this.animation.frameWidth * this.animation.scale) / 2,
            y: this.y + (this.animation.frameHeight * this.animation.scale) / 2};

        /* shooting fields */
        this.fire = false;
        this.secondsBeforeFire = BASIC_DROID_SHOOT_INTERVAL;

        /* movement fields */
        var targetX = (this.game.surfaceWidth / 2) - BASIC_DROID_ORBITAL_X_OFFSET;
        var targetY = (this.game.surfaceHeight / 2) + BASIC_DROID_ORBITAL_Y_OFFSET;
        this.targetOrbitalPointLeft = {x: targetX, y: targetY};
        
        targetX = (this.game.surfaceWidth / 2) + BASIC_DROID_ORBITAL_X_OFFSET;
        this.targetOrbitalPointRight = {x: targetX, y: targetY};
        
    }
    /* 
    * every update, the basic droid will move around zerlin entity about 50 to 100 pixels above him.
    * The droid will shoot every interval at the main character (as of now, at the mouse)
    * The droid will set removeFromWorld to true when it collides with lightsaber
    */
    update() {
        //update coordinates so the droid will orbit the center of the canvas

        /* droid movement */
        this.targetOrbitalPointLeft.x = this.game.Zerlin.x - BASIC_DROID_ORBITAL_X_OFFSET;
        //add 200 so that the droids uses up all the canvas becuase when targeting Zerlin, 
        //doesn't use all of the canvas
        this.targetOrbitalPointRight.x = this.game.Zerlin.x + BASIC_DROID_ORBITAL_X_OFFSET + 200;
        this.calcMovement(this.targetOrbitalPointLeft, this.targetOrbitalPointRight); //un comment after debug

        /* bounding circle movement */
        this.boundCircle.x = this.x + (this.animation.frameWidth * this.animation.scale) / 2;
        this.boundCircle.y = this.y + (this.animation.frameHeight * this.animation.scale) / 2;

        /* droid shooting */
        this.secondsBeforeFire -= this.game.clockTick;
        //will shoot at every interval
        if (this.secondsBeforeFire <= 0 && (!this.fire)) {
            this.secondsBeforeFire = BASIC_DROID_SHOOT_INTERVAL;
            this.fire = true;
            //shoot at specific target
            // this.shoot(this.game.Zerlin.x, 
            //     this.game.Zerlin.y);
            // this.shoot(this.game.Zerlin.boundingbox.x + this.game.Zerlin.boundingbox.width/2, 
            //     this.game.Zerlin.boundingbox.y + this.game.Zerlin.boundingbox.height/2);

            //shoot randomly in target direction
            this.shootRandom(this.game.Zerlin.boundingbox.x + this.game.Zerlin.boundingbox.width/2, 
                this.game.Zerlin.boundingbox.y + this.game.Zerlin.boundingbox.height/2,
                this.game.Zerlin.boundingbox.width,
                this.game.Zerlin.boundingbox.height);
        }
        
        
        super.update();
    }
    draw() {
        super.draw();
        
        
    }
    shoot(targetX, targetY) {
        var droidLaser = new DroidLaser(this.game, this.x + 20, this.y + 20, BASIC_DROID_LASER_SPEED, 
            targetX, targetY, BASIC_DROID_LASER_LENGTH, BASIC_DROID_LASER_WIDTH);
        this.game.addLaser(droidLaser);
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
        var randTargetX = targetX + (maxWidth * Math.random()) - (maxWidth * Math.random());
        var randTargetY = targetY + (maxHeight * Math.random()) - (maxHeight * Math.random());
        this.shoot(randTargetX, randTargetY);
    }
    /*
     * calculate movement so that it will try to fly around the location of the 
     * target.
     */
    calcMovement(targetLeft, targetRight) {

        //if the droid is to the left of targetRight and right of targetLeft
        if (this.x <= targetRight.x && this.x >= targetLeft.x) {
            //if the droid is moving right, then increase x velocity
            if (this.deltaX >= 0) {
                if (this.deltaX < BASIC_DROID_X_MOVEMENT_SPEED)
                    this.deltaX += BASIC_DROID_X_ACCELERATION * this.game.clockTick;
            }
            //if the droid is moving left, then decrease x velocity
            if (this.deltaX < 0) {
                if (this.deltaX >= (-BASIC_DROID_X_MOVEMENT_SPEED))
                    this.deltaX -= BASIC_DROID_X_ACCELERATION * this.game.clockTick;
            }
        }
            
        //if the droid is to the left of targetLeft, then increase X velocity
        if (this.x < targetLeft.x) {
            if (this.deltaX < BASIC_DROID_X_MOVEMENT_SPEED)
                this.deltaX += BASIC_DROID_X_ACCELERATION * this.game.clockTick;
        }
        //if the droid is to the right of targetRight, then decrease X velocity
        if (this.x > targetRight.x) {
            if (this.deltaX >= (-BASIC_DROID_X_MOVEMENT_SPEED))
                this.deltaX -= BASIC_DROID_X_ACCELERATION * this.game.clockTick;
        }
        

        //if droid is above the target point, then increase deltaY(down)
        if (this.y < targetRight.y) {
            if (this.deltaY <= BASIC_DROID_Y_MOVEMENT_SPEED)
                this.deltaY += BASIC_DROID_Y_ACCELERATION * this.game.clockTick;
        }
        //if the droid is below the target point, then decrease the deltaY(up)
        else if (this.y >= targetRight.y) {
            if (this.deltaY >= (-BASIC_DROID_Y_MOVEMENT_SPEED)) 
                this.deltaY -= BASIC_DROID_Y_ACCELERATION * this.game.clockTick;
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
        this.deflectedColor = "blue";
        this.secondaryColor = "white";
        this.isDeflected = false; //set to false TODO

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
        var cameraX = this.game.camera.x;
        // only draw if in camera's view
        if (this.game.camera.isInView(this, this.length, this.length)) {
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
        var camera = this.game.camera;
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
    constructor(game, x, y) {
        super(game, x, y, 0, 0);
        
        var spritesheet = this.game.assetManager.getAsset("../img/Explosion.png");
//Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, scale)
    this.animation = new Animation(spritesheet, 0, 0, 64, 64, 0.2, 15, false, false, EXPLOSION_SCALE); 

        this.x = x - this.animation.frameWidth * this.animation.scale / 2;
        this.y = y - this.animation.frameHeight * this.animation.scale / 2;
    }
    update() {
        super.update();
        if (this.animation.isDone()) {
            this.removeFromWorld = true;
        }
    }
    draw() {
        // only draw if in camera's view
        if (this.game.camera.isInView(this, this.animation.frameWidth * this.animation.scale, this.animation.frameHeight * this.animation.scale)) {
            this.animation.drawFrame(this.game.clockTick, this.game.ctx, this.x - this.game.camera.x, this.y);
            super.draw(this.game.ctx);
        }
    }
}


/*
* Long legged droid that will shoot 3 scattered burst lasers every interval 
*/
class LeggyDroid extends AbstractDroid {
    constructor(game, spritesheet, startX, startY) {
        //super(gameEngine, x, y, deltaX, deltaY)
        //super(game, startX, startY, BASIC_DROID_X_MOVEMENT_SPEED, 0);
        super(game, startX, startY, 0, 0); //debug

        /* animation fields */
//Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, scale)
    this.idleAnimation = new Animation(spritesheet, 0, 0, 315, 620, 0.2, 4, true, false, .2);
        this.animation = this.idleAnimation;

        /* bounding circle fields */
        this.radius = ((this.animation.frameWidth + this.animation.frameHeight) / 4) * this.animation.scale;
        this.boundCircle = {radius: this.radius, 
            x: this.x + (this.animation.frameWidth * this.animation.scale) / 2,
            y: this.y + (this.animation.frameHeight * this.animation.scale) / 2};

        /* shooting fields */
        this.fire = false;
        this.secondsBeforeFire = BASIC_DROID_SHOOT_INTERVAL;

        /* movement fields */
        var targetX = (this.game.surfaceWidth / 2) + BASIC_DROID_ORBITAL_X_OFFSET;
        var targetY = (this.game.surfaceHeight / 2) + BASIC_DROID_ORBITAL_Y_OFFSET;
        this.targetOrbitalPoint = {x: targetX, y: BASIC_DROID_ORBITAL_HEIGHT};
    }
    /* 
    * every update, the droid will move around zerlin entity about 50 to 100 pixels above him.
    * The droid will shoot every interval at the main character (as of now, at the mouse)
    * The droid will set removeFromWorld to true when it collides with lightsaber
    */
    update() {
        //update coordinates so the droid will orbit the center of the canvas

        /* droid movement */
        this.targetOrbitalPoint.x = this.game.Zerlin.x;
        this.calcMovement(this.targetOrbitalPoint); //un comment after debug

        /* bounding circle movement */
        this.boundCircle.x = this.x + (this.animation.frameWidth * this.animation.scale) / 2;
        this.boundCircle.y = this.y + (this.animation.frameHeight * this.animation.scale) / 2;

        /* droid shooting */
        this.secondsBeforeFire -= this.game.clockTick;
        //will shoot at every interval
        if (this.secondsBeforeFire <= 0 && (!this.fire)) {
            this.secondsBeforeFire = LEGGY_DROID_SHOOT_INTERVAL;
            this.fire = true;
            //shoot at specific target
            //this.shoot(this.game.Zerlin.x, this.game.Zerlin.y);

            //shoot randomly in target direction
            this.shootRandom(this.game.Zerlin.x, 
                this.game.Zerlin.y, 
                this.game.Zerlin.animation.frameWidth,
                this.game.Zerlin.animation.frameHeight);
            this.shoot(this.game.Zerlin.x + 350, 
                this.game.Zerlin.y);
            this.shoot(this.game.Zerlin.x + -350, 
                this.game.Zerlin.y);
            
            /************  For testing     ************** */
            this.game.audio.enemy.play('bowcasterShoot');
            
        }
         
        super.update();
    }
    draw() {
        super.draw();
    }
    shoot(targetX, targetY) {
        var droidLaser = new DroidLaser(this.game, this.x + 20, this.y + 50, LEGGY_DROID_LASER_SPEED, 
            targetX, targetY, LEGGY_DROID_LASER_LENGTH, LEGGY_DROID_LASER_WIDTH);
        droidLaser.color = "orange";
        droidLaser.deflectedColor = "orange";
        droidLaser.secondaryColor = "red";
        this.game.addLaser(droidLaser);
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
                this.deltaX += BASIC_DROID_X_ACCELERATION * this.game.clockTick;

        }
        
        //if the droid is to the right of target point, then decrease the deltaX
        //by the x velocity
        else if (this.x > target.x) {
            if (this.deltaX >= (-BASIC_DROID_X_MOVEMENT_SPEED))
                this.deltaX -= BASIC_DROID_X_ACCELERATION * this.game.clockTick;
        }

        //if droid is above the target point, then increase deltaY(down)
        if (this.y < target.y) {
            if (this.deltaY <= BASIC_DROID_Y_MOVEMENT_SPEED)
                this.deltaY += BASIC_DROID_Y_ACCELERATION * this.game.clockTick;
        }
        //if the droid is below the target point, then decrease the deltaY(up)
        else if (this.y >= target.y) {
            if (this.deltaY >= (-BASIC_DROID_Y_MOVEMENT_SPEED)) 
                this.deltaY -= BASIC_DROID_Y_ACCELERATION * this.game.clockTick;
        }      

        //after calculating change in x and y then increment x and y by delta x and delta y
        // this.x += this.game.clockTick * (Math.random() * this.deltaX);
        // this.y += this.game.clockTick * (Math.random() * this.deltaY);
        this.x += this.game.clockTick * this.deltaX;
        this.y += this.game.clockTick * this.deltaY;    
    }
}








class BeamDroid extends AbstractDroid {

    constructor(game, spritesheet, startX, startY) {
        //super(gameEngine, x, y, deltaX, deltaY)
        //super(game, startX, startY, BASIC_DROID_X_MOVEMENT_SPEED, 0);
        super(game, startX, startY, 0, 0); //debug

        /* animation fields */
        //Animation(spritesheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
        this.idleAnimation = new Animation(spritesheet, 0, 0, 100, 100, 0.1, 14, true, false, .5);
        this.animation = this.idleAnimation;
        this.beamAngle = Math.atan2(550, this.game.camera.width * ZERLIN_POSITION_ON_SCREEN);
        this.beamAngleDelta = 0;

        /* bounding circle fields */
        this.radius = (this.animation.frameWidth / 2) * this.animation.scale;
        this.boundCircle = {radius: this.radius, 
            x: this.x + (this.animation.frameWidth * this.animation.scale) / 2,
            y: this.y + (this.animation.frameHeight * this.animation.scale) / 2};

        /* shooting fields */
        this.shooting = false;
        this.secondsBeforeFire = BEAM_DROID_SHOOT_INTERVAL;

        /* movement fields */
        var targetOrbitalX = (this.game.surfaceWidth / 2) + BASIC_DROID_ORBITAL_X_OFFSET;
        var targetOrbitalY = (this.game.surfaceHeight / 2) + BASIC_DROID_ORBITAL_Y_OFFSET;
        this.targetOrbitalPoint = {x: targetOrbitalX, y: targetOrbitalY};
    }

    update() { 

        /* droid movement */
        this.targetOrbitalPoint.x = this.game.Zerlin.x;
        this.calcMovement(this.targetOrbitalPoint); //un comment after debug

        /* bounding circle movement */
        this.boundCircle.x = this.x + (this.animation.frameWidth * this.animation.scale) / 2;
        this.boundCircle.y = this.y + (this.animation.frameHeight * this.animation.scale) / 2;

        /* droid shooting */
        this.secondsBeforeFire -= this.game.clockTick;
        this.setBeamAngle();
        if (this.secondsBeforeFire <= 0 && !this.shooting) {
            this.shoot();
        }

        if (this.shooting) {
            this.shootingTime -= this.game.clockTick;
            if (this.shootingTime <= 0) {
                this.shooting = false;
                this.beam.removeFromWorld = true;
                this.game.audio.beam.stop();
                this.beam = null;
            }
        }
        
        super.update();
    }

    draw() {
        super.draw();
    }

    setBeamAngle() {
        var angleToZerlin = Math.atan2(this.game.Zerlin.y - 150 - this.boundCircle.y, this.game.Zerlin.x - this.boundCircle.x);
        var angleDiff = this.shaveRadians(angleToZerlin - this.beamAngle);
        if (angleDiff > Math.PI) {
            // rotate beam clockwise
            this.beamAngleDelta -= BEAM_ANGLE_ACCELERATION_RADIANS * this.game.clockTick;
        } else {
            // rotate beam counterclockwise
            this.beamAngleDelta += BEAM_ANGLE_ACCELERATION_RADIANS * this.game.clockTick; 
        }
        this.beamAngleDelta *= .97; // zero in on target
        this.beamAngle += this.beamAngleDelta * this.game.clockTick;
    }

    /*
     * Converts an angle to inside range [0, Math.PI * 2).
     */
    shaveRadians(angle) {
        var newAngle = angle;
        while (newAngle >= Math.PI * 2) {
            newAngle -= Math.PI * 2;
        }
        while (newAngle < 0) {
            newAngle += Math.PI * 2;
        }
        return newAngle;
    }

    shoot() {
        this.beam = new Beam(this);
        this.game.beams.push(this.beam);
        this.secondsBeforeFire = BEAM_DROID_SHOOT_INTERVAL;
        this.shooting = true;
        this.shootingTime = BEAM_DROID_SHOOT_DURATION;
        this.game.audio.beam.play();
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
                this.deltaX += BASIC_DROID_X_ACCELERATION * this.game.clockTick;

        }
        
        //if the droid is to the right of target point, then decrease the deltaX
        //by the x velocity
        else if (this.x > target.x) {
            if (this.deltaX >= (-BASIC_DROID_X_MOVEMENT_SPEED))
                this.deltaX -= BASIC_DROID_X_ACCELERATION * this.game.clockTick;
        }

        //if droid is above the target point, then increase deltaY(down)
        if (this.y < target.y) {
            if (this.deltaY <= BASIC_DROID_Y_MOVEMENT_SPEED)
                this.deltaY += BASIC_DROID_Y_ACCELERATION * this.game.clockTick;
        }
        //if the droid is below the target point, then decrease the deltaY(up)
        else if (this.y >= target.y) {
            if (this.deltaY >= (-BASIC_DROID_Y_MOVEMENT_SPEED)) 
                this.deltaY -= BASIC_DROID_Y_ACCELERATION * this.game.clockTick;
        }      

        //after calculating change in x and y then increment x and y by delta x and delta y
        // this.x += this.game.clockTick * (Math.random() * this.deltaX);
        // this.y += this.game.clockTick * (Math.random() * this.deltaY);
        this.x += this.game.clockTick * this.deltaX;
        this.y += this.game.clockTick * this.deltaY;
    }

    explode() {
        super.explode();
        if (this.beam) {
            this.beam.removeFromWorld = true;
            this.game.audio.beam.stop();
        }
    }
}

class Beam {
    constructor(shootingDroid) {
        this.game = shootingDroid.game;
        this.shootingDroid = shootingDroid;
        this.segments = [];
        this.segments.push({x: shootingDroid.boundCircle.x, y: shootingDroid.boundCircle.y, angle: 0});
    }

    update() {
        this.segments[0].x = this.shootingDroid.boundCircle.x;
        this.segments[0].y = this.shootingDroid.boundCircle.y;
        this.segments[0].angle = this.shootingDroid.beamAngle;

        // collision manager detects end of beam segements and adds new ones if deflected.
    }

    draw() {
        var cameraX = this.game.camera.x; // just draw beams without checking camera?
        var ctx = this.game.ctx;
        ctx.save();
        for (let i = 0; i < this.segments.length; i++) {
            var segment = this.segments[i];

            //Outer Layer of beam
            ctx.lineWidth = BEAM_DROID_LASER_WIDTH;
            ctx.strokeStyle = "purple";
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(segment.x - cameraX, segment.y);
            ctx.lineTo(segment.endX - cameraX, segment.endY);
            ctx.stroke();
        }

        // two loops so all inner beams are always on top of all outer beams
        for (let i = 0; i < this.segments.length; i++) {
            var segment = this.segments[i];

            //inner layer of beam.
            ctx.lineWidth = BEAM_DROID_LASER_WIDTH / 2;
            ctx.strokeStyle = "white";
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(segment.x - cameraX, segment.y);
            ctx.lineTo(segment.endX - cameraX, segment.endY);
            ctx.stroke();
            ctx.closePath();
        } 

        ctx.restore(); 
    }
}

