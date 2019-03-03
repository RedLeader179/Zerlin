
/* One bad ass mother */
// implement a poison shot
class LeggyDroidBoss extends BasicDroid {
  constructor(game, spritesheet, startX, startY, frames, frameSpeed) {
    super(game, spritesheet, startX, startY, frames, frameSpeed, 315, 620, .5, 200);
    // constructor(game, spritesheet, startX, startY, frames, frameSpeed, frameWidth, frameHeight, scale, radius)
    //Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, scale)
    this.shootInterval = Constants.DroidBossConstants.DROID_BOSS_SHOOT_INTERVAL;

    this.maxHealth = Constants.DroidBossConstants.DROID_BOSS_MAX_HEATH;
		this.currentHealth = this.maxHealth;

    this.spawned = false;
    this.healthStatusBar = null;
  }


  hitWithLaser() {
    this.currentHealth -= Constants.DroidBossConstants.HIT_WITH_LASER_DAMAGE;
    // console.log('leggy hit with laser', this.currentHealth);
    //todo: play soundFx
    // this.game.audio.playSoundFx(this.game.audio.saberDeflectLaser);
  }

  hitWithSaber() {
    this.currentHealth -= Constants.DroidBossConstants.HIT_WITH_SABER_DAMAGE;
    //todo: play soundFx
    // console.log('leggy hit with saber', this.currentHealth);
  }

  update() {
    if(!this.spawned) { //create the boss health bar when spawned
      this.healthStatusBar = new DroidBossHealthStatusBar(this.game,
          this.game.surfaceWidth * 0.25,
          680,  this);
      console.log('spawned bar');
      this.game.sceneManager.bossHealthBar = this.healthStatusBar;
      this.spawned = true;
      this.game.audio.playSoundFx(this.game.audio.droidBossMechanical);
    } else { //droid spawned update health bar
      this.healthStatusBar.update();
    }

    // check if boss alive otherwise kill him
    if (this.currentHealth <= 0) {
      this.explode();
      // this.game.sceneManager.bossHealthBar.removeFromWorld = true;
    }


    //update coordinates so the droid will orbit the center of the canvas
    if (!this.sceneManager) {
      this.sceneManager = this.game.sceneManager;
    }
    this.calcMovement();

    /* droid shooting */
    this.secondsBeforeFire -= this.game.clockTick;
    //will shoot at every interval
    if (this.secondsBeforeFire <= 0 && (!this.fire)) {
      this.secondsBeforeFire = this.shootInterval;
      this.fire = true;
      // or for random choice of shoot pattern instead of cycling through all of them
      this.shootPattern = Math.floor(Math.random() * Math.floor(5) + 1);

      if (this.shootPattern === 1) {
        this.shootScatterShot();
      } else if (this.shootPattern === 2) {
        this.shootSlowBurst();
      } else if (this.shootPattern === 3) {
        this.shootFastBurst();
      } else if (this.shootPattern === 4) {
        this.shootPoisonLaser();
      } else if (this.shootPattern === 5) { //last for now
        this.shootMultiShot();
      }
      // this.shootPoisonLaser(); //shoot poison laser every fire ?
    }
    super.update();
  }

  explode() {
		this.removeFromWorld = true;

    this.game.audio.playSoundFx(this.game.audio.enemy, 'rubbleExplosion');
    // this.game.audio.playSoundFx(this.game.audio.enemy, 'largeExplosion');

    // class DroidExplosion extends Entity {
    // 	constructor(game, x, y,
              //    scale, explosionVolume, speed) {
    //second explosions
    setTimeout( () => {
      this.sceneManager.addEntity(
        new DroidExplosion(
          this.game,
          this.x + (this.animation.scale * this.animation.frameWidth / 2) + 50,
          this.y + (this.animation.scale * this.animation.frameHeight / 2) + 50,
          1, .2, .2));
      this.sceneManager.addEntity(
        new DroidExplosion(
          this.game,
          this.x + (this.animation.scale * this.animation.frameWidth / 2) - 50,
          this.y + (this.animation.scale * this.animation.frameHeight / 2) - 50,
          1, .2, .2));
      this.sceneManager.addEntity(
        new DroidExplosion(
          this.game,
          this.x + (this.animation.scale * this.animation.frameWidth / 2) + 50,
          this.y + (this.animation.scale * this.animation.frameHeight / 2) - 50,
          1, .2, .2));
      this.sceneManager.addEntity(
        new DroidExplosion(
          this.game,
          this.x + (this.animation.scale * this.animation.frameWidth / 2) - 50,
          this.y + (this.animation.scale * this.animation.frameHeight / 2) + 50,
          1, .2, .2));
    }, 1000);
    //third explosions
    setTimeout(() => {
      this.sceneManager.addEntity(
        new DroidExplosion(
          this.game,
          this.x + (this.animation.scale * this.animation.frameWidth / 2) + 80,
          this.y + (this.animation.scale * this.animation.frameHeight / 2) + 100,
          .4, .2, .2));
      this.sceneManager.addEntity(
        new DroidExplosion(
          this.game,
          this.x + (this.animation.scale * this.animation.frameWidth / 2) - 80,
          this.y + (this.animation.scale * this.animation.frameHeight / 2) - 100,
          .4, .2, .2));
      this.sceneManager.addEntity(
        new DroidExplosion(
          this.game,
          this.x + (this.animation.scale * this.animation.frameWidth / 2) - 80,
          this.y + (this.animation.scale * this.animation.frameHeight / 2) + 100,
          .4, .2, .2));
      this.sceneManager.addEntity(
        new DroidExplosion(
          this.game,
          this.x + (this.animation.scale * this.animation.frameWidth / 2) + 80,
          this.y + (this.animation.scale * this.animation.frameHeight / 2) - 100,
          .4, .2, .2));
    }, 1500);
    //main explosion
    this.sceneManager.addEntity(
      new DroidExplosion(
        this.game,
        this.x + (this.animation.scale * this.animation.frameWidth / 2),
        this.y + (this.animation.scale * this.animation.frameHeight / 2),
        2, .2, .2));
  }

  shootPoisonLaser() {
    // console.log('shoot poision');
    let laser = new DroidLaser(this.game, this.boundCircle.x, this.boundCircle.y,
      Constants.DroidBossConstants.POISON_LASER_SPEED,
      this.sceneManager.Zerlin.x,
      this.sceneManager.Zerlin.boundingbox.y + this.sceneManager.Zerlin.boundingbox.height / 2,
      Constants.DroidBossConstants.POISON_LASER_LENGTH, Constants.DroidBossConstants.POISON_LASER_WIDTH, "#33cc33", "#ffff00");
    laser.poisoned = true;
    this.sceneManager.addLaser(laser);
    this.game.audio.playSoundFx(this.game.audio.poisonShot);
    this.fire = false;
  }

  shootScatterShot() {
    var targetAngle = Math.atan2(this.sceneManager.Zerlin.boundingbox.y + this.sceneManager.Zerlin.boundingbox.height / 2 - this.boundCircle.y,
      this.sceneManager.Zerlin.x - this.boundCircle.x);
    var distanceToTarget = 100; // arbitrary number to set laser's path, value not important

    var laserAngleOffset = dbc.SPRAY_LASER_WIDTH_RADIANS / 2;
    for (let i = 0; i < dbc.SPRAY_LASER_COUNT; i++) {
      let laser = new DroidLaser(this.game, this.boundCircle.x, this.boundCircle.y,
        dbc.LEGGY_DROID_LASER_SPEED,
        Math.cos(targetAngle + laserAngleOffset) * distanceToTarget + this.boundCircle.x,
        Math.sin(targetAngle + laserAngleOffset) * distanceToTarget + this.boundCircle.y,
        dbc.LEGGY_DROID_LASER_LENGTH, dbc.LEGGY_DROID_LASER_WIDTH, "red", "orange");
      this.sceneManager.addLaser(laser);
      laserAngleOffset -= dbc.SPRAY_LASER_WIDTH_RADIANS / (dbc.SPRAY_LASER_COUNT - 1);
    }
    this.game.audio.playSoundFx(this.game.audio.enemy, 'bowcasterShoot');
    this.fire = false;
  }

  shootSlowBurst() {
    this.shootIntervalCount++;
    if (this.shootIntervalCount <= dbc.SLOWBURST_DROID_BURSTS) {
      let laser = new DroidLaser(this.game, this.boundCircle.x, this.boundCircle.y,
        dbc.SLOWBURST_DROID_LASER_SPEED,
        this.sceneManager.Zerlin.x,
        this.sceneManager.Zerlin.boundingbox.y + this.sceneManager.Zerlin.boundingbox.height / 2,
        dbc.BASIC_DROID_LASER_LENGTH, dbc.BASIC_DROID_LASER_WIDTH, "#339933", "#00ff00");
      this.sceneManager.addLaser(laser);
      this.game.audio.playSoundFx(this.game.audio.enemy, 'retroBlasterShot');
    } else if (this.shootIntervalCount > dbc.SLOWBURST_DROID_SHOOTS_PER_CYCLE) {
      this.shootIntervalCount = 0;
    }
    this.fire = false;
  }

  shootFastBurst() {
    this.shootIntervalCount++;
    if (this.shootIntervalCount <= dbc.FASTBURST_DROID_BURSTS) {
      let laser = new DroidLaser(this.game, this.boundCircle.x, this.boundCircle.y,
        dbc.FASTBURST_DROID_LASER_SPEED,
        this.sceneManager.Zerlin.x,
        this.sceneManager.Zerlin.boundingbox.y + this.sceneManager.Zerlin.boundingbox.height / 2,
        dbc.LEGGY_DROID_LASER_LENGTH, dbc.LEGGY_DROID_LASER_WIDTH, "#006699", "#00ccff");
      this.sceneManager.addLaser(laser);
      this.game.audio.playSoundFx(this.game.audio.enemy, 'retroBlasterShot');
    } else if (this.shootIntervalCount > dbc.FASTBURST_DROID_SHOOTS_PER_CYCLE) {
      this.shootIntervalCount = 0;
    }
    this.fire = false;
  }

  // shootSniper() {
  //   let laser = new DroidLaser(this.game, this.boundCircle.x, this.boundCircle.y,
  //     dbc.SNIPER_DROID_LASER_SPEED,
  //     this.sceneManager.Zerlin.x,
  //     this.sceneManager.Zerlin.boundingbox.y + this.sceneManager.Zerlin.boundingbox.height / 2,
  //     dbc.SNIPER_DROID_LASER_LENGTH, dbc.SNIPER_DROID_LASER_WIDTH, "#cccc00", "#ffff00");
  //   this.sceneManager.addLaser(laser);
  //   this.game.audio.playSoundFx(this.game.audio.enemy, 'bowcasterShoot');
  //   this.fire = false;
  // }

  shootMultiShot() {
    var angleToZerlin = Math.atan2(this.sceneManager.Zerlin.y - 150 - this.boundCircle.y, this.sceneManager.Zerlin.x - this.boundCircle.x);
    var xTarget = this.sceneManager.Zerlin.x;
    var yTarget = this.sceneManager.Zerlin.boundingbox.y + this.sceneManager.Zerlin.boundingbox.height / 2;
    var xOffset = Math.cos(angleToZerlin + Math.PI / 2) * dbc.MULTISHOT_WIDTH / 2;
    var yOffset = Math.sin(angleToZerlin + Math.PI / 2) * dbc.MULTISHOT_WIDTH / 2;

    let laser1 = new DroidLaser(this.game, this.boundCircle.x + xOffset, this.boundCircle.y + yOffset,
      dbc.BASIC_DROID_LASER_SPEED,
      xTarget + xOffset,
      yTarget + yOffset,
      dbc.BASIC_DROID_LASER_LENGTH, dbc.BASIC_DROID_LASER_WIDTH, "#333399", "#4966ff");

    let laser2 = new DroidLaser(this.game, this.boundCircle.x + xOffset * .55, this.boundCircle.y + yOffset * .55,
      dbc.BASIC_DROID_LASER_SPEED,
      xTarget + xOffset * .55,
      yTarget + yOffset * .55,
      dbc.BASIC_DROID_LASER_LENGTH, dbc.BASIC_DROID_LASER_WIDTH, "#333399", "#4966ff");

    let laser3 = new DroidLaser(this.game, this.boundCircle.x - xOffset * .55, this.boundCircle.y - yOffset * .55,
      dbc.BASIC_DROID_LASER_SPEED,
      xTarget - xOffset * .55,
      yTarget - yOffset * .55,
      dbc.BASIC_DROID_LASER_LENGTH, dbc.BASIC_DROID_LASER_WIDTH, "#333399", "#4966ff");

    let laser4 = new DroidLaser(this.game, this.boundCircle.x - xOffset, this.boundCircle.y - yOffset,
      dbc.BASIC_DROID_LASER_SPEED,
      xTarget - xOffset,
      yTarget - yOffset,
      dbc.BASIC_DROID_LASER_LENGTH, dbc.BASIC_DROID_LASER_WIDTH, "#333399", "#4966ff");

    this.sceneManager.addLaser(laser1);
    this.sceneManager.addLaser(laser2);
    this.sceneManager.addLaser(laser3);
    this.sceneManager.addLaser(laser4);
    this.game.audio.playSoundFx(this.game.audio.enemy, 'retroBlasterShot');
    this.fire = false;
  }
}
