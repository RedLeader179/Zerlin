/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/

/*
* Checkpoint is an entity which will modify Zerlins spawn location so that on death, he spawns at that
* location. The checkpoint will be reset on level transition.
*/

const cpc = Constants.CheckPointConstants;

class CheckPoint extends Entity {
    constructor(game, x, y) {
        super(game, x, y);

        this.boundingBox = new BoundingBox(this.x, this.y, cpc.WIDTH, cpc.HEIGHT);
        this.color = 'rgb(57, 255, 20)';
    }

    update() {
        super.update()
    }

    draw() {
        super.draw();
        var cameraX = this.game.sceneManager.camera.x;
        var ctx = this.game.ctx;
        ctx.save();
        
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.boundingBox.x - cameraX, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height); 

        ctx.restore();
    }

    playSound() {
        this.game.audio.playSoundFx(this.game.audio.item, 'itemPowerup');
    }
}