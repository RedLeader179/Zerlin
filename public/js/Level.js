/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/


/*
Assets:
//powerups are capital

-  =  tile
d  =  basic droid
s  =  scatter shot droid
b  =  beam droid
H  =  health powerup
F =   force powerup

*/

const lc = Constants.LevelConstants;

class Level {
    constructor(game, levelLayout, tileImages) {
        this.game = game;
        this.levelLayout = levelLayout;

        this.tileImages = tileImages;
        console.assert(tileImages.centerTile.width === tileImages.leftTile.width);
        console.assert(tileImages.leftTile.width === tileImages.rightTile.width);
        this.tileWidth = tileImages.centerTile.width;
        this.tileHeight = tileImages.centerTile.height;
        this.ctx = game.ctx;
        this.tiles = [];
        this.unspawnedDroids = []; // when spawned, pass to game engine
        this.unspawnedPowerups = [];

        this.length = this.levelLayout[0].length * this.tileWidth;
        this._parseLevel();
    }

    _parseLevel() {
        var rows = this.levelLayout.length;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < this.levelLayout[i].length; j++) {
                if (this.levelLayout[i][j] === ' ') {
                    continue;
                }
                else if (this.levelLayout[i][j] === '-') { // tile
                    var image = this.tileImages.centerTile;
                    if (this.levelLayout[i][j - 1] !== '-' && this.levelLayout[i][j + 1] !== '-') {
                        image = this.tileImages.leftRightTile;
                    }
                    else if (this.levelLayout[i][j - 1] !== '-') {
                        image = this.tileImages.leftTile;
                    } else if (this.levelLayout[i][j + 1] !== '-') {
                        image = this.tileImages.rightTile;
                    }
                    var tile = new Tile(this.game, image, j * this.tileWidth, i * this.game.camera.height / rows);
                    this.tiles.push(tile);
                }
                else if (this.levelLayout[i][j] === 'd') { // basic droid
                    this.unspawnedDroids.push(new BasicDroid(this.game, this.game.assetManager.getAsset("../img/droid-j-row.png"), j * this.tileWidth, i * this.game.camera.height / rows));
                }
                else if (this.levelLayout[i][j] === 's') { // scatter shot droid
                    this.unspawnedDroids.push(new LeggyDroid(this.game, this.game.assetManager.getAsset("../img/leggy_droid.png"), j * this.tileWidth, i * this.game.camera.height / rows));
                }
                else if (this.levelLayout[i][j] === 'B') { // beam shot droid
                    this.unspawnedDroids.push(new BeamDroid(this.game, this.game.assetManager.getAsset("../img/droid-j-row.png"), j * this.tileWidth, i * this.game.camera.height / rows));
                }
                else if (this.levelLayout[i][j] === 'b') { // slow burst droid
                    this.unspawnedDroids.push(new SlowBurstDroid(this.game, this.game.assetManager.getAsset("../img/droid-j-row.png"), j * this.tileWidth, i * this.game.camera.height / rows));
                }
                else if (this.levelLayout[i][j] === 'f') { // fast burst droid
                    this.unspawnedDroids.push(new FastBurstDroid(this.game, this.game.assetManager.getAsset("../img/droid-j-row.png"), j * this.tileWidth, i * this.game.camera.height / rows));
                }
                else if (this.levelLayout[i][j] === 'n') { // sniper droid
                    this.unspawnedDroids.push(new SniperDroid(this.game, this.game.assetManager.getAsset("../img/droid-j-row.png"), j * this.tileWidth, i * this.game.camera.height / rows));
                }
                else if (this.levelLayout[i][j] === 'm') { // multishot droid
                    this.unspawnedDroids.push(new MultishotDroid(this.game, this.game.assetManager.getAsset("../img/droid-j-row.png"), j * this.tileWidth, i * this.game.camera.height / rows));
                } 
                else if (this.levelLayout[i][j] === 'H') { //health powerup
                    this.unspawnedPowerups.push(new HealthPowerUp(this.game, this.game.assetManager.getAsset("../img/powerup_health.png"), j * this.tileWidth, i * this.game.camera.height / rows));
                }
                else if (this.levelLayout[i][j] === 'F') {//force powerup
                    this.unspawnedPowerups.push(new ForcePowerUp(this.game, this.game.assetManager.getAsset("../img/powerup_force.png"), j * this.tileWidth, i * this.game.camera.height / rows));
                }
                
            }
        }
    }

    update() {
        // adds droids to game engine when in view of camera
        for (let i = this.unspawnedDroids.length - 1; i >= 0; i--) {
            let droid = this.unspawnedDroids[i];
            let dimension = droid.boundCircle.radius * 2;
            if (this.game.camera.isInView(droid, dimension, dimension)) {
                this.game.addDroid(droid);
                this.unspawnedDroids.splice(i, 1);
            }
        }
        for (let i = this.unspawnedPowerups.length -1; i >= 0; i--) {
            let powerup = this.unspawnedPowerups[i];
            let dimension = powerup.boundCircle.radius * 2;
            if (this.game.camera.isInView(powerup, dimension, dimension)) {
                this.game.addPowerup(powerup);
                this.unspawnedPowerups.splice(i, 1);
            }
        }
    }

    draw() {
        var that = this;
        this.tiles.forEach(function(tile) {
            if (that.game.camera.isInView(tile, tile.width, tile.height)) {
                tile.draw();
            }
        });
    }

}


//Draw a tile of given size.
class Tile extends Entity {
    constructor(game, image, startX, startY) {
        super(game, startX, startY, 0, 0);
        this.tileImage = image;
        this.width = image.width;
        this.height = image.height;
        this.ctx = game.ctx;
        this.drawBox = true;


        // add + 2 to y to increase precision on bounding box to actual platform image
        this.boundingBox = new BoundingBox(this.x, this.y + 2, this.width, this.height);
        this.surface = {p1: {x: this.x, y: this.y}, p2: {x: this.width + this.x, y: this.y}};
    }
    update() {

    }
    draw() {
        this.ctx.drawImage(this.tileImage, this.x - this.game.camera.x, this.y);

        if (lc.DRAW_BOXES) {
            this.ctx.strokeStyle = "black";
            this.ctx.strokeRect(this.boundingBox.x - this.game.camera.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
        }
    }
}
