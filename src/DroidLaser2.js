class DroidLaser2 extends Entity {
    constructor(game, startX, startY, speed, targetX, targetY, length, width) {
        super(game, startX, startY, 0, 0);
        //console.log("created DroidLaser Entity");

        var distFromStartToTarget = Math.pow(Math.pow(targetX - startX, 2) + Math.pow(targetY - startY, 2), .5);
        var unitVectorDeltaX = ((targetX - startX) / distFromStartToTarget);
        var unitVectorDeltaY = ((targetY - startY) / distFromStartToTarget);

        this.deltaX = unitVectorDeltaX * BASIC_DROID_LASER_SPEED;
        this.deltaY = unitVectorDeltaY * BASIC_DROID_LASER_SPEED;

        this.length = length;
        this.width = width;

        // move laser so tail is touching the starting point upon instantiation, instead of the head
        this.x = this.x + unitVectorDeltaX * this.length;
        this.y = this.y + unitVectorDeltaY * this.length;
        this.tailX = startX;
        this.tailY = startY;
    }
    update() {
        this.removeFromWorld = this.outsideScreen(); // will be removed in GameEngine

        this.x += this.deltaX * this.game.clockTick;
        this.y += this.deltaY * this.game.clockTick;
        this.tailX += this.deltaX * this.game.clockTick;
        this.tailY += this.deltaY * this.game.clockTick;
    
        super.update();
    }
    draw() {
        var ctx = this.game.ctx;
        ctx.save();
        //green outer layer of laser
        ctx.lineWidth = this.width;
        ctx.strokeStyle = "green";
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.tailX, this.tailY);
        ctx.stroke();
        ctx.closePath();

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

}