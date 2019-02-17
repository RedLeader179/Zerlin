/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/

const puc = Constants.PowerUpConstants;

/*
* All powerups will extend from this class, 
* 
*/ 
class AbstractPowerUp extends Entity {
    constructor(game, x, y) {
        super(game, x, y, 0, 0);
        this.animation = null;
        this.boundCircle = {radius: 0, x: 0, y: 0};
        
    }
    update() {
        super.update();
    }

    draw() {
        var camera = this.game.camera;
        var dimension = this.boundCircle.radius * 2;
        // only draw if in camera's view
        if (camera.isInView(this, dimension, dimension)) {
        //debug: draw the bounding circle around the droid
            if (this.game.showOutlines ) {
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
    effect() {
        throw new Error("Can't instantiate AbstractPowerUp");
    }
}
//Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, scale)

/*
* This power up will heal zerlin on pickup
* will look like a red plus sign
*/ 
class HealthPowerUp extends AbstractPowerUp {
    constructor(game, spritesheet, x, y) {
        super(game, x, y);
        this.animation = new Animation(spritesheet, 0, 0, 32, 32, 0.1, 5, true, false, puc.HEALTH_SCALE);

        /* bounding circle fields */
        this.radius = (this.animation.frameWidth / 2) * this.animation.scale;
        this.boundCircle = {radius: this.radius, 
            x: this.x + this.radius,
            y: this.y + this.radius};

        
    }
    //heal zerlin to max hp or a certain amount.
    effect() {
        var zerlin = this.game.Zerlin;
        zerlin.currentHealth += puc.RECOVER_HEALTH_AMOUNT;
        //can't heal past max health
        if (zerlin.currentHealth > zerlin.maxHealth) {
            zerlin.currentHealth = zerlin.maxHealth;
        }
    }
}

/*
* Force powerup will recover zerlins force power on pickup.
*/
class ForcePowerUp extends AbstractPowerUp {
    constructor(game, spritesheet, x, y) {
        super(game, x, y);
        this.animation = new Animation(spritesheet, 0, 0, 32, 32, 0.1, 9, true, false, puc.FORCE_SCALE);

        /* bounding circle */
        this.radius = (this.animation.frameWidth / 2) * this.animation.scale;
        this.boundCircle = {radius: this.radius, 
            x: this.x + this.radius,
            y: this.y + this.radius};
    }

    //recover zerlin's force power to max or a certain amount
    effect() {
        var zerlin = this.game.Zerlin;
        zerlin.currentForce += puc.RECOVER_FORCE_AMOUNT;
        if (zerlin.currentForce > zerlin.maxForce) {
            zerlin.currentForce = zerlin.maxForce;
        }

    }
}

/*
* This power up will make zerlin invincible to a certain amount of time
* perhaps could have some sort of visual effect to show zerlin is 
* invincible, like a white outline, may need to draw another sprite sheet.
* circle bounding box that has some alpha to make the force field transparent.
*/
class InvincibilityPowerUp extends AbstractPowerUp {
    constructor(game, x, y) {
        super(game, x, y);
    }

    effect() {

    }
}

/*
* This power up will make the deflected laser automatically 
* go to the nearest droid
*/
class HomingLaserDeflectionPowerUp extends AbstractPowerUp {
    constructor(game, x, y) {
        super(game, x, y);
    }

    effect() {
        
    }
}

//MultiplyLaserDeflectionPowerUp
//will create multiple lasers that will go at different angles for each
//laser deflected

//SlowTimePowerUp
//will slow down time for a certain amount of time.

//ForcePowerUp
//recharge force power





