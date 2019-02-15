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
        
    }
    update() {
        super.update();
    }

    draw() {
        super.draw();
    }
}

/*
* This power up will heal zerlin on pickup
* will look like a red plus sign
*/ 
class HealthPowerUp extends AbstractPowerUp {
    constructor(game, x, y) {
        super(game, x, y);
    }
}

/*
* This power up will make zerlin invincible to a certain amount of time
* perhaps could have some sort of visual effect to show zerlin is 
* invincible, like a white outline, may need to draw another sprite sheet.
*/
class InvincibilityPowerUp extends AbstractPowerUp {
    constructor(game, x, y) {
        super(game, x, y);
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
}

//MultiplyLaserDeflectionPowerUp
//will create multiple lasers that will go at different angles for each
//laser deflected

//SlowTimePowerUp
//will slow down time for a certain amount of time.

//ForcePowerUp
//recharge force power



