/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/



var bc = Constants.BossConstants;

class Boss extends Entity {

	constructor(game, startX, startY) {
		// NOTE: this.(x, y) is his arm socket.
		super(game, startX, startY, 0, 0);

		this.assetManager = game.assetManager;
		this.ctx = game.ctx;
		this.falling = false;
		this.hits = 0;
		this.beamCannon = new BeamCannon(game, this);
		this.shooting = false;
		this.secondsBeforeFire = bc.B_SHOOT_INTERVAL;
		this.jetPackSoundOn = false;
		this.beamDamageTimer = 0;

		/* Boss Health Stats */
		this.maxHealth = bc.B_MAX_HEALTH;
		this.currentHealth = this.maxHealth;

		this.faceLeft();
		this.createAnimations();
	}

	update() {
		if (this.currentHealth <= 0) {
			//kill the boss
		}
		
		if (!this.falling) {
			if (this.y > (this.game.camera.height - bc.B_HOVERING_HEIGHT)) {
				this.deltaY -= bc.B_ACCELERATION * this.game.clockTick;
			} else {
				this.deltaY += bc.B_ACCELERATION * this.game.clockTick;	
			}
			if (Math.abs(this.deltaY) > 200) {
				this.deltaY *= .99;
			}
			if (!this.jetPackSoundOn) {
				this.game.audio.jetPack.play();
				this.jetPackSoundOn = true;
			}

			this.deltaX = Math.cos(this.game.timer.gameTime) * bc.B_ACCELERATION;
		}
		else {
			this.lastBottom = this.boundingbox.bottom;
			this.deltaY += zc.GRAVITATIONAL_ACCELERATION * .7 * this.game.clockTick;
			this.reactionTime -= this.game.clockTick;
			if (this.reactionTime < 0) {
				this.falling = false;
				this.game.audio.jetPack.play();
				this.jetPackSoundOn = true;
			}
		}

		if (this.game.Zerlin.x < this.x && this.facingRight) {
			this.faceLeft();
		} else if (this.game.Zerlin.x > this.x && !this.facingRight) {
			this.faceRight();
		}

		if (this.boundingbox.hidden) {
			this.imuneToDamageTimer -= this.game.clockTick;
			if (this.imuneToDamageTimer < 0) {
				this.boundingbox.hidden = false;
			}
		}

		this.secondsBeforeFire -= this.game.clockTick;
		if (this.secondsBeforeFire <= 0 && !this.shooting) {
			this.shoot();
		}
		if (this.shooting) {
			this.shootingTime -= this.game.clockTick;
			if (this.shootingTime <= 0) {
				this.shooting = false;
				if (this.beamCannon.on) {
					this.beamCannon.turnOff();
					// reset damage timer for every shoot
					this.secondsBeforeFire = bc.B_SHOOT_INTERVAL;
				}
			}
		}

		this.x += this.game.clockTick * this.deltaX;
		this.y += this.game.clockTick * this.deltaY;

		this.boundingbox.translateCoordinates(this.game.clockTick * this.deltaX, this.game.clockTick * this.deltaY);
		
		this.beamCannon.update();
		super.update();
	}

	draw() {
		this.drawY = this.y - bc.B_ARM_SOCKET_Y * bc.B_SCALE;
		if (this.facingRight) {
			this.drawX = this.x - bc.B_ARM_SOCKET_X * bc.B_SCALE;
			if (this.falling) {
				this.animation = this.fallRightAnimation;
			} else {
				this.animation = this.flyRightAnimation;
			}
		} 
		else { // facing left
			this.drawX = this.x - (bc.B_WIDTH - bc.B_ARM_SOCKET_X) * bc.B_SCALE;
			if (this.falling) {
				this.animation = this.fallLeftAnimation;
			} else {
				this.animation = this.flyLeftAnimation;
			}
		}

		this.animation.drawFrame(this.game.clockTick, this.ctx, this.drawX - this.game.camera.x, this.drawY);
		this.beamCannon.draw();

		if (bc.B_DRAW_COLLISION_BOUNDRIES) {
			this.ctx.strokeStyle = "black";
			if (!this.boundingbox.hidden) {
				this.ctx.strokeRect(this.boundingbox.x - this.game.camera.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
			}
		}
	}

	fall() {
		this.game.audio.jetPack.stop();
		this.jetPackSoundOn = false;
		this.reactionTime = bc.B_FALLING_REACTION_TIME;
		this.falling = true;
	}

	hideBox() {
		this.boundingbox.hidden = true;
		this.imuneToDamageTimer = bc.B_RECOVERY_PERIOD;
	}

	shoot() {
		this.shooting = true;
		this.secondsBeforeFire = bc.B_SHOOT_INTERVAL;
		this.shootingTime = bc.B_SHOOT_DURATION;
		this.beamCannon.turnOn();
	}

	setXY(x, y) {
		this.x = x;
		this.y = y;
		// update boundingBox
		if (this.facingRight) {
			this.faceRight(); 
		} else {
			this.faceLeft();
		}
	}

	isTileBelow(tile) {
		return (this.boundingbox.left < tile.boundingBox.right)
				&& (this.boundingbox.right > tile.boundingBox.left)
				&& (this.boundingbox.bottom + 10 > tile.boundingBox.top) 
				&& (this.boundingbox.bottom - 10 < tile.boundingBox.top);
	}

	/*
	 * check if animation is done (can't call animation.isDone() because it does not have latest clockTick yet in update())
	 */
	isAnimationDone() {
		return (this.animation.elapsedTime + this.game.clockTick) >= this.animation.totalTime;
	}

	faceRight() {
		this.facingRight = true;
		this.boundingbox = new BoundingBox(this.x - 5 * bc.B_SCALE, this.y - 80 * bc.B_SCALE, 60 * bc.B_SCALE, 160 * bc.B_SCALE);
		this.beamCannon.faceRight();
	}

	faceLeft() {
		this.facingRight = false;
		this.boundingbox = new BoundingBox(this.x - 55 * bc.B_SCALE, this.y - 80 * bc.B_SCALE, 60 * bc.B_SCALE, 160 * bc.B_SCALE);
		this.beamCannon.faceLeft();
	}


	createAnimations() {
		this.flyRightAnimation = new Animation(this.assetManager.getAsset("../img/boss flying.png"),
													0, 0, 
												   bc.B_WIDTH, 
												   bc.B_HEIGHT, 
												   bc.B_FLYING_FRAME_SPEED, 
												   bc.B_FLYING_FRAMES, 
												   true, false,
												   bc.B_SCALE);
		this.flyLeftAnimation = new Animation(this.assetManager.getAsset("../img/boss flying left.png"),
													0, 0, 
												   bc.B_WIDTH, 
												   bc.B_HEIGHT, 
												   bc.B_FLYING_FRAME_SPEED, 
												   bc.B_FLYING_FRAMES, 
												   true, false,
												   bc.B_SCALE);
		this.fallRightAnimation = new Animation(this.assetManager.getAsset("../img/boss falling.png"),
													0, 0, 
												   bc.B_WIDTH, 
												   bc.B_HEIGHT, 
												   bc.B_FALLING_FRAME_SPEED, 
												   bc.B_FALLING_FRAMES, 
												   true, false,
												   bc.B_SCALE);
		this.fallLeftAnimation = new Animation(this.assetManager.getAsset("../img/boss falling left.png"),
													0, 0, 
												   bc.B_WIDTH, 
												   bc.B_HEIGHT, 
												   bc.B_FALLING_FRAME_SPEED, 
												   bc.B_FALLING_FRAMES, 
												   true, false,
												   bc.B_SCALE);
		// this.dieAnimation = 
	}
}



class BeamCannon extends Entity {

	constructor(game, body) {
		super(game, body.x, body.y, 0, 0);
		this.assetManager = game.assetManager;
		this.ctx = game.ctx;
		this.angle = 0;
		this.body = body;
		this.hidden = false;
		this.width = bc.BC_WIDTH * bc.B_SCALE;
		this.height = bc.BC_HEIGHT * bc.B_SCALE;
		this.beamAngleDelta = 0;
		this.beamAngle = 0;
		this.beam = null;
		this.setUpCannonImages();
		this.faceRight();
		this.lengthSocketToMuzzle = Math.sqrt(Math.pow(this.muzzleY, 2) + Math.pow(this.muzzleX, 2));
	}

	update() {
		this.x = this.body.x;
		this.y = this.body.y;

		this.setBeamAngle();
		if (this.beam) {
			this.beam.update();
		}
		super.update();
	}

	draw() {
		if (!this.hidden) {
			if (this.beam) {
				this.beam.draw();
			}
			this.ctx.save();
			this.ctx.translate(this.x - this.game.camera.x, this.y);
			this.ctx.rotate(this.beamAngle);
			this.ctx.drawImage(this.image,
							   0,
							   0,
							   bc.BC_WIDTH,
							   bc.BC_HEIGHT,
							   -(this.armSocketX),
							   -(this.armSocketY),
							   this.width,
							   this.height);
			this.ctx.restore();
		}
		super.draw();
	}

	turnOn() {
		this.on = true;
		this.beam = new Beam(this);
		this.game.beams.push(this.beam);
		this.game.audio.beam.play();
	}

	turnOff() {
		this.on = false;
		this.beam.removeFromWorld = true;
		this.game.audio.sizzle.stop();
		this.game.audio.beam.stop();
		this.beam = null;
	}

	faceRight() {
		this.image = this.faceRightCannonImage;
		this.armSocketX = bc.BC_X_AXIS * bc.B_SCALE;
		this.armSocketY = bc.BC_RIGHT_Y_AXIS * bc.B_SCALE;
		this.muzzleX = (bc.BC_MUZZLE_X - bc.BC_X_AXIS) * bc.B_SCALE;
		this.muzzleY = (bc.BC_MUZZLE_RIGHT_Y - bc.BC_RIGHT_Y_AXIS) * bc.B_SCALE;
		this.angleSocketToMuzzle = Math.atan2(this.muzzleY, this.muzzleX);
		this.facingRight = true;
		console.log("right");
		console.log(this.muzzleX);
		console.log(this.muzzleY);
	}

	faceLeft() {
		this.image = this.faceLeftCannonImage;
		this.armSocketX = bc.BC_X_AXIS * bc.B_SCALE;
		this.armSocketY = bc.BC_LEFT_Y_AXIS * bc.B_SCALE;
		this.muzzleX = (bc.BC_MUZZLE_X - bc.BC_X_AXIS) * bc.B_SCALE;
		this.muzzleY = (bc.BC_MUZZLE_LEFT_Y - bc.BC_LEFT_Y_AXIS) * bc.B_SCALE;
		this.angleSocketToMuzzle = Math.atan2(this.muzzleY, this.muzzleX);
		this.facingRight = false;
		console.log("left");
		console.log(this.muzzleX);
		console.log(this.muzzleY);
	}

	setBeamAngle() {
		/*
			    Axis  A	|\
						| \	
						|  \
			   elbow  B |___\ C   Target
		*/
		var zerlinBox = this.game.Zerlin.boundingbox;
		var angleAxisToTarget = Math.atan2(zerlinBox.y + zerlinBox.height / 2 - this.y, zerlinBox.x + zerlinBox.width / 2 - this.x);
		var distanceAxisToTarget = distance(this, this.game.Zerlin.boundingbox);
		var distanceAxisToElbow = this.muzzleY;
		var angleBCA = Math.asin(distanceAxisToElbow / distanceAxisToTarget);
		var angleToZerlin = angleAxisToTarget - angleBCA;

		var angleDiff = this.shaveRadians(angleToZerlin - this.beamAngle);
		if (angleDiff > Math.PI) {
			// rotate beam clockwise
			this.beamAngleDelta -= bc.BEAM_ANGLE_ACCELERATION_RADIANS * this.game.clockTick;
		} else {
			// rotate beam counterclockwise
			this.beamAngleDelta += bc.BEAM_ANGLE_ACCELERATION_RADIANS * this.game.clockTick; 
		}
		this.beamAngleDelta *= .97; // zero in on target by reducing speed of beam rotation
		this.beamAngle += this.beamAngleDelta * this.game.clockTick;
	}

	setUpCannonImages() {
		this.faceRightCannonImage = this.assetManager.getAsset("../img/beam cannon.png");
		this.faceLeftCannonImage = this.assetManager.getAsset("../img/beam cannon left.png");
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
}




class Beam {
	constructor(cannon) {
		this.game = cannon.game;
		this.cannon = cannon;
		this.segments = [];
		this.segments.push({x: cannon.x, y: cannon.y, angle: cannon.beamAngle});
		this.isSizzling = false;
		this.sizzlingSoundOn = false;
	}

	update() {
		var xOffset = this.cannon.lengthSocketToMuzzle * Math.cos(this.cannon.beamAngle + this.cannon.angleSocketToMuzzle); 
		var yOffset = this.cannon.lengthSocketToMuzzle * Math.sin(this.cannon.beamAngle + this.cannon.angleSocketToMuzzle); 
		// console.log(this.cannon.lengthSocketToMuzzle);
		this.segments[0].x = this.cannon.x + xOffset;
		this.segments[0].y = this.cannon.y + yOffset;
		this.segments[0].angle = this.cannon.beamAngle;
		// collision manager detects end of beam segements and adds new ones if deflected.

		if (this.isSizzling && !this.sizzlingSoundOn) {
			this.game.audio.sizzle.play();
			this.sizzlingSoundOn = true;
		} else if (!this.isSizzling && this.sizzlingSoundOn) {
			this.game.audio.sizzle.stop();
			this.sizzlingSoundOn = false;
		}
	}

	draw() {
		var cameraX = this.game.camera.x; // just draw beams without checking if in view of camera?
		var ctx = this.game.ctx;
		ctx.save();
		for (let i = 0; i < this.segments.length; i++) {
			var segment = this.segments[i];

			//Outer Layer of beam
			ctx.lineWidth = bc.BEAM_DROID_LASER_WIDTH * bc.B_SCALE;
			ctx.strokeStyle = "red";
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.moveTo(segment.x - cameraX, segment.y);
			ctx.lineTo(segment.endX - cameraX, segment.endY);
			ctx.stroke();
		}

		for (let i = 0; i < this.segments.length; i++) {
			var segment = this.segments[i];

			//Outer Layer of beam
			ctx.lineWidth = bc.BEAM_DROID_LASER_WIDTH * bc.B_SCALE * .75;
			ctx.strokeStyle = "orange";
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.moveTo(segment.x - cameraX, segment.y);
			ctx.lineTo(segment.endX - cameraX, segment.endY);
			ctx.stroke();
		}

		// two loops so all inner beams are always on top of all outer beam 'glows'
		for (let i = 0; i < this.segments.length; i++) {
			var segment = this.segments[i];

			//inner layer of beam.
			ctx.lineWidth = bc.BEAM_DROID_LASER_WIDTH * bc.B_SCALE * .5;
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

