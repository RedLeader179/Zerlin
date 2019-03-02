/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/


/*
Assets:
//powerups are capital

-  =  tile
=  =  moving tile
~  =  falling tile
d  =  basic droid
s  =  scatter shot droid
b  =  slow burst droid
f  =  fast burst droid
m  =  multi-shot droid
n  =  sniper droid
H  =  health powerup
F  =  force powerup
I  =  invincibility powerup
*  = leggy droid boss
X  =  Boss
*/

const lc = Constants.LevelConstants;

class Level {
  constructor(game, sceneManager, levelLayout, backgrounds, tileImages) {
    this.game = game;
    this.sceneManager = sceneManager;
    this.camera = sceneManager.camera;

    this.levelLayout = levelLayout;
    this.tileImages = {};
    this.parralaxBackgroundLayers = [];
    this.instantiateLayers(backgrounds, tileImages);
    console.assert(tileImages.centerTile.width === tileImages.leftTile.width);
    console.assert(tileImages.leftTile.width === tileImages.rightTile.width);
    this.tileWidth = this.tileImages.centerTile.width;
    this.tileHeight = this.tileImages.centerTile.height;
    this.ctx = game.ctx;

    this.length = this.levelLayout[0].length * this.tileWidth;
  }

  set() {
    this.tiles = [];
    this.unspawnedDroids = []; // when spawned, pass to game engine
    this.unspawnedPowerups = [];
    this.unspawnedBoss = null; //when boss is spawned create and display the boss' health bar.
    this._parseTiles();
  }

  instantiateLayers(backgrounds, tileImages) {
    for (let i = 0; i < backgrounds.length; i++) {
      this.parralaxBackgroundLayers.push(backgrounds[i]);
    }
    this.tileImages = {
      centerTile: this.game.assetManager.getAsset(tileImages.centerTile),
      leftTile: this.game.assetManager.getAsset(tileImages.leftTile),
      rightTile: this.game.assetManager.getAsset(tileImages.rightTile),
      leftRightTile: this.game.assetManager.getAsset(tileImages.leftRightTile)
    };


  }

  _parseTiles() {
    var rows = this.levelLayout.length;
    var rowHeight = this.camera.height / rows;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < this.levelLayout[i].length; j++) {
        if (this.levelLayout[i][j] === ' ') {
          continue;
        } else if (this.levelLayout[i][j] === '-') { // tile
          var image = this.tileImages.centerTile;
          if (this.levelLayout[i][j - 1] !== '-' && this.levelLayout[i][j + 1] !== '-') {
            image = this.tileImages.leftRightTile;
          } else if (this.levelLayout[i][j - 1] !== '-') {
            image = this.tileImages.leftTile;
          } else if (this.levelLayout[i][j + 1] !== '-') {
            image = this.tileImages.rightTile;
          }
          var tile = new Tile(this, image, j * this.tileWidth, i * this.camera.height / rows);
          this.tiles.push(tile);
        } else if (this.levelLayout[i][j] === '~') { // falling tile
            let roundedTile = this.tileImages.leftRightTile;
            let fallingTile = new FallingTile(this, roundedTile, j * this.tileWidth, i * this.camera.height / rows);
            this.tiles.push(fallingTile);
        } else if (this.levelLayout[i][j] === '=') { // moving tile
          var image2 = this.tileImages.centerTile;
          if (this.levelLayout[i][j - 1] !== '=' && this.levelLayout[i][j + 1] !== '=') {
            image2 = this.tileImages.leftRightTile;
          } else if (this.levelLayout[i][j - 1] !== '=') {
            image2 = this.tileImages.leftTile;
          } else if (this.levelLayout[i][j + 1] !== '=') {
            image2 = this.tileImages.rightTile;
          }
          var movingTile = new MovingTile(this, image2, j * this.tileWidth, i * this.camera.height / rows, lc.TILE_INITIAL_VELOCITY, 0, lc.TILE_ACCELERATION);
          this.tiles.push(movingTile);
        } else if (this.levelLayout[i][j] === 'd') { // basic droid
          this.unspawnedDroids.push(new BasicDroid(this.game, this.game.assetManager.getAsset("../img/droid-j-row.png"), j * this.tileWidth, i * rowHeight, 14, .2, 100, 100, Constants.DroidBasicConstants.BASIC_DROID_SCALE, 45));
        } else if (this.levelLayout[i][j] === 's') { // scatter shot droid
          this.unspawnedDroids.push(new ScatterShotDroid(this.game, this.game.assetManager.getAsset("../img/Droid 3.png"), j * this.tileWidth, i * rowHeight, 10, .2));
        } else if (this.levelLayout[i][j] === 'b') { // slow burst droid
          this.unspawnedDroids.push(new SlowBurstDroid(this.game, this.game.assetManager.getAsset("../img/Droid 1.png"), j * this.tileWidth, i * rowHeight, 2, .8));
        } else if (this.levelLayout[i][j] === 'f') { // fast burst droid
          this.unspawnedDroids.push(new FastBurstDroid(this.game, this.game.assetManager.getAsset("../img/Droid 2.png"), j * this.tileWidth, i * rowHeight, 10, .12));
        } else if (this.levelLayout[i][j] === 'n') { // sniper droid
          this.unspawnedDroids.push(new SniperDroid(this.game, this.game.assetManager.getAsset("../img/Droid 4.png"), j * this.tileWidth, i * rowHeight, 6, .2));
        } else if (this.levelLayout[i][j] === 'm') { // multishot droid
          this.unspawnedDroids.push(new MultishotDroid(this.game, this.game.assetManager.getAsset("../img/Droid 5.png"), j * this.tileWidth, i * rowHeight, 21, .12));
        } else if (this.levelLayout[i][j] === 'X') { // Boss
          this.unspawnedBoss = new Boss(this.game, j * this.tileWidth, i * this.game.surfaceHeight / rows);
        } else if (this.levelLayout[i][j] === '*') { // leggy boss droid
          this.unspawnedDroids.push(new LeggyDroidBoss(this.game, this.game.assetManager.getAsset("../img/leggy_droid.png"), j * this.tileWidth, i * rowHeight, 4, .51));
          // this.unspawnedDroidBoss = new LeggyDroidBoss(this.game, this.game.assetManager.getAsset("../img/leggy_droid.png"), j * this.tileWidth, i * rowHeight, 4, .51);
        } else if (this.levelLayout[i][j] === 'H') { //health powerup
          this.unspawnedPowerups.push(new HealthPowerUp(this.game, this.game.assetManager.getAsset("../img/powerup_health.png"), j * this.tileWidth, i * rowHeight));
        } else if (this.levelLayout[i][j] === 'F') { //force powerup
          this.unspawnedPowerups.push(new ForcePowerUp(this.game, this.game.assetManager.getAsset("../img/powerup_force.png"), j * this.tileWidth, i * rowHeight));
        } else if (this.levelLayout[i][j] === 'I') { //invincibility powerup
          this.unspawnedPowerups.push(new InvincibilityPowerUp(this.game, this.game.assetManager.getAsset('../img/powerup_invincibility.png'), j * this.tileWidth, i * this.game.surfaceHeight / rows));
        }

      }
    }
  }

  update() {
    this.parralaxBackgroundLayers.forEach(layer => {
      layer.update();
    });
    // adds droids to game engine when in view of camera
    for (let i = this.unspawnedDroids.length - 1; i >= 0; i--) {
      let droid = this.unspawnedDroids[i];
      let dimension = droid.boundCircle.radius * 2;
      if (this.camera.isInView(droid, dimension, dimension)) {
        this.sceneManager.addDroid(droid);
        this.unspawnedDroids.splice(i, 1);
      }
    }
    for (let i = this.unspawnedPowerups.length - 1; i >= 0; i--) {
      let powerup = this.unspawnedPowerups[i];
      let dimension = powerup.boundCircle.radius * 2;
      if (this.camera.isInView(powerup, dimension, dimension)) {
        this.sceneManager.addPowerup(powerup);
        this.unspawnedPowerups.splice(i, 1);
      }
    }

    //spawn the boss into the level
    if (this.unspawnedBoss) {
      if (this.sceneManager.camera.isInView(this.unspawnedBoss, 0, 0)) {
        this.sceneManager.boss = this.unspawnedBoss;
        this.unspawnedBoss = null;
      }
    }


    this.tiles.forEach(function(tile) {
      if (tile instanceof MovingTile || tile instanceof FallingTile) {
        tile.update();
      }
    });
  }

  draw() {
    var that = this;
    this.parralaxBackgroundLayers.forEach(layer => {
      layer.draw();
    });
    this.tiles.forEach(function(tile) {
      if (that.camera.isInView(tile, tile.width, tile.height)) {
        tile.draw();
      }
    });
  }

}





//Draw a tile of given size.
class Tile extends Entity {
  constructor(level, image, startX, startY) {
    super(level.game, startX, startY, 0, 0);
    this.camera = level.camera;
    this.tileImage = image;
    this.width = image.width;
    this.height = image.height;
    this.ctx = this.game.ctx;
    this.drawBox = true;


    // add + 2 to y to increase precision on bounding box to actual platform image
    this.boundingBox = new BoundingBox(this.x, this.y + 2, this.width, this.height);
    this.surface = {
      p1: {
        x: this.x,
        y: this.y
      },
      p2: {
        x: this.width + this.x,
        y: this.y
      }
    };
  }
  update() {

  }
  draw() {
    this.ctx.drawImage(this.tileImage, this.x - this.camera.x, this.y);

    if (lc.DRAW_BOXES) {
      this.ctx.strokeStyle = "black";
      this.ctx.strokeRect(this.boundingBox.x - this.camera.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
    }
  }
}

/**
 Tiles that have a lifeSpan and steadily move down the screen once that
 lifeSpan has expired. Lifespan count down starts when a player sees the tile.
*/
class FallingTile extends Tile {
  constructor(game, image, startX, startY) {
    super(game, image, startX, startY);
    this.lifeSpan = 4;
    this.playerHasSeenTile = false;
    this.deltaYForZerlin = 0;
  }

  update() {
    if (this.camera.isInView(this, this.width, this.height))
      this.playerHasSeenTile = true;

    if (this.playerHasSeenTile)
      this.lifeSpan += -1 * this.game.clockTick;
    if (this.lifeSpan < 0) { //falling tile
      this.falling = true;
      this.y += 10 * this.game.clockTick;
      this.boundingBox.updateCoordinates(this.x, this.y);
    }
    if (this.y > 700) {
      this.removeFromWorld = true;
      // console.log("removed from world");
    }
  }
}


class MovingTile extends Tile {
  constructor(game, image, startX, startY, initialDeltaX, initialDeltaY, acceleration) {
    super(game, image, startX, startY);
    this.deltaX = initialDeltaX;
    this.deltaY = initialDeltaY;
    this.startX = startX;
    this.startY = startY;
    this.acceleration = acceleration;
  }

  update() {
    if (this.x < this.startX) {
      this.deltaX += this.acceleration * this.game.clockTick;
    } else {
      this.deltaX -= this.acceleration * this.game.clockTick;
    }

    this.x += this.deltaX * this.game.clockTick;
    this.surface = {
      p1: {
        x: this.x,
        y: this.y
      },
      p2: {
        x: this.width + this.x,
        y: this.y
      }
    };
    // this.y += this.deltaY * this.game.clockTick;
    this.boundingBox.translateCoordinates(this.deltaX * this.game.clockTick, this.deltaY * this.game.clockTick);
  }

}




/*
 * An individual image to be drawn with its follower.
 */
class ParallaxScrollBackground extends Entity {

  constructor(game, sceneManager, backgroundImage, scale, distanceFromCamera, x, y) {
    super(game, 0, 0, 0, 0);
    this.startX = x ? x : 0;
    this.startY = y ? y : 0;
    this.x = this.startX;
    this.y = this.startY;

    this.camera = sceneManager.camera;
    this.scale = scale; // TODO: integrate scale of image
    this.backgroundImage = game.assetManager.getAsset(backgroundImage);
    this.imageWidth = this.backgroundImage.width;
    // this.game.camera = camera;

    console.assert(this.imageWidth >= this.camera.width, "Image width must be larger than camera width!");
    console.assert(this.backgroundImage.height >= this.camera.height, "Image height must be larger than camera height!");
    this.distanceFromCamera = distanceFromCamera;

    this.ctx = game.ctx;
    this.imageDistanceFromX = 0;
  }

  update() {
    // simulates slower movement for further distances
    this.x = this.startX + this.camera.x - (this.camera.x * 100 / this.distanceFromCamera);
    this.y = this.startY + this.camera.y - (this.camera.y * 100 / this.distanceFromCamera);

    // x moves slower than camera, so update how far image is drawn from x to "keep up" with camera.
    if (this.imageDistanceFromX + (2 * this.imageWidth) + this.x < this.camera.x + this.camera.width) {
      this.imageDistanceFromX = this.imageDistanceFromX + this.imageWidth;
    } else if (this.imageDistanceFromX + this.x > this.camera.x) {
      this.imageDistanceFromX = this.imageDistanceFromX - this.imageWidth;
    }
  }

  draw() {
    this.ctx.drawImage(this.backgroundImage, this.imageDistanceFromX + this.x - this.camera.x, this.y - this.camera.y);
    this.ctx.drawImage(this.backgroundImage, this.imageDistanceFromX + this.x + this.imageWidth - this.camera.x, this.y - this.camera.y);
  }
}


class ParallaxRotatingBackground extends ParallaxScrollBackground {


  constructor(game, sceneManager, backgroundImage, scale, distanceFromCamera) {
    super(game, sceneManager, backgroundImage, scale, distanceFromCamera);
    this.camera = sceneManager.camera;
    this.scale = scale; // TODO: integrate scale of image
    this.backgroundImage = game.assetManager.getAsset(backgroundImage);
    this.imageWidth = this.backgroundImage.width;
    this.imageHeight = this.backgroundImage.height;
    this.angle = 0;

    console.assert(this.imageWidth >= this.camera.width, "Image width must be larger than camera width!");
    console.assert(this.backgroundImage.height >= this.camera.height, "Image height must be larger than camera height!");

    this.ctx = game.ctx;
    this.imageDistanceFromX = 0;
  }

  instantiate(game, camera) {
    this.game = game;
    this.camera = camera;
  }

  update() {
    this.angle += this.game.clockTick * 2 * Math.PI / 500;
  }

  draw() {

    this.ctx.save();
    this.ctx.translate(this.camera.width / 2, this.camera.height / 2);
    this.ctx.rotate(this.angle);

    this.ctx.drawImage(this.backgroundImage,
      0,
      0,
      this.imageWidth,
      this.imageHeight,
      -this.imageWidth / 2,
      -this.imageHeight / 2,
      this.imageWidth,
      this.imageHeight);
    this.ctx.restore();
  }
}



class ParallaxAnimatedBackground extends Entity {

  constructor(game, sceneManager, animation, scale, distanceFromCamera, x, y) {
    super(game, 0, 0, 0, 0);
    this.startX = x ? x : 0;
    this.startY = y ? y : 0;
    this.x = this.startX;
    this.y = this.startY;

    this.camera = sceneManager.camera;
    this.scale = scale; // TODO: integrate scale of image
    this.animation = animation;
    // this.imageWidth = this.backgroundImage.width;
    // this.game.camera = camera;

    this.distanceFromCamera = distanceFromCamera;

    this.ctx = game.ctx;
    // this.imageDistanceFromX = 0;
  }

  update() {
    // simulates slower movement for further distances
    this.x = this.startX + this.camera.x - (this.camera.x * 100 / this.distanceFromCamera);
    this.y = this.startY + this.camera.y - (this.camera.y * 100 / this.distanceFromCamera);
  }

  draw() {
    this.animation.drawFrame(this.game.clockTick, this.game.ctx, this.x - this.camera.x, this.y - this.camera.y);
  }

}



class ParallaxFloatingBackground extends ParallaxScrollBackground {

  constructor(game, sceneManager, backgroundImage, scale, distanceFromCamera) {
    super(game, sceneManager, backgroundImage, scale, distanceFromCamera);
    this.camera = sceneManager.camera;
    this.functionX = 0;
  }

  instantiate(game, camera) {
    this.game = game;
    this.camera = camera;
  }

  update() {
    super.update();
    this.functionX += this.game.clockTick;
    this.y = Math.sin(this.functionX) * 10;
  }

  draw() {
    super.draw();
  }
}
