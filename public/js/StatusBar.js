/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/

/* 
* This File will contain a status bar.
* the status bars currently will be health and force
*/

const STATUS_BAR_LENGTH = 0.25 // width of the canvas to use
const STATUS_BAR_WIDTH = 20;
const STATUS_BAR_DISPLAY_TEXT = true;

//when the current is less than or equal to the maxSize * CriticalAmount 
//then start alerting the user by using some graphics.
const STATUS_BAR_CRITICAL_AMOUNT = 0.2; //when the current is at 1/5 the maxSize
const STATUS_BAR_CRITICAL_FLASH_INTERVAL = 0.5;
const HEALTH_BAR_HAS_CRITICAL_STATE = true;
const FORCE_BAR_HAS_CRITICAL_STATE = false;

/*
* all status bars will extend from this class.
* Status bars dont move from their position on the canvas.
* The status bar will be in the game engine update loop and will track
* numbers specified in each child status bar.
* 
* each status bar needs to be able to display numbers if needed of the 
* current number / the max of that number.
*
* draw the background lighter bar the full length of the bar, this bar does not change.
* draw a darker foreground on top of the lighter bar, this bar length is 
* equal to (maxLength / maxSize) / currentSize
*/
class AbstractStatusBar extends Entity {
    constructor(game, x, y, hasCriticalState) {
        super(game, x, y, 0, 0);
        this.displayText = STATUS_BAR_DISPLAY_TEXT;
        this.hasCriticalState = hasCriticalState; //does the bar flash when it gets low.
        this.maxSize = 0; //the numeric size of the status bar.
        //the length of the status bar is a quarter of the canvas.
        this.maxLength = this.game.surfaceWidth * STATUS_BAR_LENGTH; 
        //current value of the status bar
        this.current = this.maxSize;
        //default to white, alpha is between 1 (opaque) to 0 (transparent)
        this.backgroundColor = 'rgba(255, 255, 255, 1)';
        //default to gray
        this.foregroundColor = 'rgba(126, 126, 126, 1)';
        //the color when the bar is in critical condition
        this.criticalBackgroundColor = 'rgba(255, 255, 255, 1)';
        this.criticalForegroundColor = 'rgba(126, 126, 126, 1)';
        this.flashCritical = false; //toggle boolean
        this.secondsBeforeFlash = STATUS_BAR_CRITICAL_FLASH_INTERVAL;
    }

    update() {
        super.update();
        this.setCurrent();
        this.setMaxSize();

        //flash critical color
        this.secondsBeforeFlash -= this.game.clockTick;
        //toggle flash critical state every time interval
        if (this.secondsBeforeFlash <= 0) {
            this.secondsBeforeFlash = STATUS_BAR_CRITICAL_FLASH_INTERVAL;
            if (this.flashCritical)
                this.flashCritical = false;
            else 
                this.flashCritical = true;
        }
    }

    draw() {   
        super.draw();
        var ctx = this.game.ctx;

        var colorForeground = this.foregroundColor;
        var colorBackground = this.backgroundColor;
        if (this.hasCriticalState && this.current <= STATUS_BAR_CRITICAL_AMOUNT * this.maxSize) {
            //paint the critical state
            if (this.flashCritical) {
                colorForeground = this.criticalForegroundColor;
                colorBackground = this.criticalBackgroundColor;
            }

        }

        //draw the background status bar
        ctx.save();
        ctx.lineWidth = STATUS_BAR_WIDTH;
        ctx.strokeStyle = colorBackground;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.maxLength, this.y);
        ctx.stroke();
        ctx.closePath();
        
        if (this.current > 0) {
            //draw the foreground status bar over the background status bar
            ctx.strokeStyle = colorForeground;
            //ctx.lineCap = butt;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + ((this.maxLength / this.maxSize) * this.current), this.y);
            ctx.stroke();
            ctx.closePath();

        }

        //draw the text of the status bar current/maxSize
        if (this.displayText) {
            ctx.fillText(`${this.current} / ${this.maxSize}`, this.x + this.maxLength/2, 
                this.y + STATUS_BAR_WIDTH*0.20);
        }
        
        ctx.restore();

        
    }

    /*
    * This method will be overwritten by the child classes and will set the current value 
    * of the status bar every update. for example, a status bar could set the current value to
    * an entities health.
    */
    setCurrent() {
        throw new Error("AbstractStatusBar can't be instantiated");
    }

    //set the max size of the status bar, allows dynamic changing of the max size of the bar
    setMaxSize() {
        throw new Error("AbstractStatusBar can't be instantiated");
    }
}


/*
* This class is the health status bar.
* This bar will keep track of zerlins health and display it for the
* player to see the a visual representation of the current health.
*/ 
class HealthStatusBar extends AbstractStatusBar {
    constructor(game, x, y) {
        super(game, x, y, HEALTH_BAR_HAS_CRITICAL_STATE);
        this.foregroundColor = "rgba(255, 0, 0, 1)"; //red
        this.backgroundColor = "rgba(255, 126, 126, 1)"; //light red
        //critical colors
        this.criticalForegroundColor = 'rgba(255, 128, 0, 1)'; //orange
        this.criticalBackgroundColor = 'rgba(255, 165, 70, 1)'; //light orange

        this.maxSize = this.game.Zerlin.maxHealth;
        this.current = this.game.Zerlin.currentHealth;
    }
    /* method that will check the current health of zerlin then draw the status bar
    * with the new current health */
    setCurrent() {
        this.current = this.game.Zerlin.currentHealth;
        //this.current = 3;
        /* DELETE AFTER DEBUG */
        // this.int -= this.game.clockTick;
        // if (this.int <= 0) {
        //     this.current--;
        //     this.int = STATUS_BAR_CRITICAL_FLASH_INTERVAL;
        // }
        // if (this.current < 0) {
        //     this.current = 10;
        // }

    }
    setMaxSize() {
        this.maxSize = this.game.Zerlin.maxHealth;
    }
}

/* 
* This class is the force status bar
* this bar will keep track of the amount of force power zerlin has and 
* will display a visual representation of the current amount of force power
* for the player to see.
*/
class ForceStatusBar extends AbstractStatusBar {
    constructor(game, x, y) {
        super(game, x, y, FORCE_BAR_HAS_CRITICAL_STATE);
        this.foregroundColor = "rgba(0, 0, 255, 1)"; //blue
        this.backgroundColor = "rgba(126, 126, 255, 1)"; //light blue
        this.maxSize = this.game.Zerlin.maxForce;
        this.current = this.game.Zerlin.currentForce;
    }

    /*
    * This method will be used to check the current force power of zerlin
    * 
    */
    setCurrent() {
        this.current = this.game.Zerlin.currentForce;
    }
    setMaxSize() {
        this.maxSize = this.game.Zerlin.maxForce;
    }
}