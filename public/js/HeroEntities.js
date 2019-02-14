/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/

const zc = Constants.ZerlinConstants;
var camConst = Constants.CameraConstants;

class Zerlin extends Entity {

	constructor(game) {
		// NOTE: this.x is CENTER of Zerlin, not left side of image. this.y is feet.
		super(game, game.camera.width * camConst.ZERLIN_POSITION_ON_SCREEN, 0, 0, 0);

		this.assetManager = game.assetManager;
		this.ctx = game.ctx;
		this.direction = 0; // -1 = left, 0 = still, 1 = right
		this.somersaulting = false;
		this.crouching = false;
		this.falling = true;
		this.hits = 0;
		this.armSocketY = zc.Z_ARM_SOCKET_Y;
		this.faceRight();
		this.lightsaber = new Lightsaber(game, this);
		this.createAnimations();

		/* Fields tracked by the status bar */
		this.maxHealth = zc.Z_MAX_HEALTH;
		this.currentHealth = this.maxHealth;
		this.maxForce = zc.Z_MAX_FORCE;
		this.currentForce = this.maxForce;
	}

	update() {
		// check basic movement
		if (this.game.mouse.x + this.game.camera.x < this.x && this.facingRight) {
			this.faceLeft();
		} 
		else if (this.game.mouse.x + this.game.camera.x > this.x && !this.facingRight) {
			this.faceRight();
		}
		else if (!this.game.keys['KeyD'] && !this.game.keys['KeyA']) {
			this.direction = 0;
			if (!this.isInManeuver()) {
				this.deltaX = 0;
			}
		}
		else if (this.game.keys['KeyD'] && this.game.keys['KeyA']) {
			this.direction = 0;
			if (!this.isInManeuver()) {
				this.deltaX = 0;
			}
		}
		else if (this.game.keys['KeyD'] && !this.game.keys['KeyA']) { // TODO: change keys to constants
			this.direction = 1;
			if (!this.isInManeuver()) {
				this.deltaX = zc.Z_WALKING_SPEED;
			}
		}
		else if (!this.game.keys['KeyD'] && this.game.keys['KeyA']) {
			this.direction = -1;
			if (!this.isInManeuver()) {
				this.deltaX = -zc.Z_WALKING_SPEED;
			}
		}

		// check adding new maneuver
		if (!this.isInManeuver()) {
			if (this.game.keys['KeyS'] && this.direction !== 0 && !this.falling) {
				this.startSomersault();
			}
			else if (this.game.keys['KeyE'] && !this.falling) {
				/** for testing sound */
				this.game.audio.hero.play('forceJump');
				this.falling = true;
				this.deltaY = zc.FORCE_zc.JUMP_DELTA_Y;
			}
			else if (this.game.keys['KeyW'] && !this.falling) {
				this.falling = true;
				this.deltaY = zc.JUMP_DELTA_Y;
			}
			else if (this.game.keys['Space']) {
				this.startSlash(); 
			}
			else if (this.game.keys['KeyX'] && !this.falling) {
				this.crouch();
			}
		}

		if (this.falling) {
			this.lastBottom = this.boundingbox.bottom;
			this.deltaY += zc.GRAVITATIONAL_ACCELERATION * this.game.clockTick;
		}

		if (this.somersaulting) {
			if (this.isAnimationDone()) {
				this.finishSomersault();
			} else if (this.animation.elapsedTime < zc.Z_SOMERSAULT_FRAMES * zc.Z_SOMERSAULT_FRAME_SPEED / 2) {
				// don't fall for first half of roll
				this.deltaY = 0;
			}
		}
		else if (this.slashing) {
			if (this.isAnimationDone()) {
				this.finishSlash();
			} else { // still in slash
				var animation = this.slashingDirection === 1 ? this.slashingAnimation : this.slashingLeftAnimation;
				if (animation.elapsedTime >= zc.Z_SLASH_FRAME_SPEED * zc.Z_SLASH_START_FRAME &&
					animation.elapsedTime < zc.Z_SLASH_FRAME_SPEED * (zc.Z_SLASH_END_FRAME + 1)) {
					if (this.slashingDirection === 1) {
						this.slashZone = {active: true, 
										  outerCircle: new BoundingCircle(this.x + zc.Z_SLASH_CENTER_X * zc.Z_SCALE, this.y - zc.Z_SLASH_CENTER_Y * zc.Z_SCALE, zc.Z_SLASH_RADIUS * zc.Z_SCALE), 
										  innerCircle: new BoundingCircle(this.x + zc.Z_SLASH_INNER_CENTER_X * zc.Z_SCALE, this.y - zc.Z_SLASH_INNER_CENTER_Y * zc.Z_SCALE, zc.Z_SLASH_INNER_RADIUS * zc.Z_SCALE)}; 
					} else {
						this.slashZone = {active: true,  
										  outerCircle: new BoundingCircle(this.x - zc.Z_SLASH_CENTER_X * zc.Z_SCALE, this.y - zc.Z_SLASH_CENTER_Y * zc.Z_SCALE, zc.Z_SLASH_RADIUS * zc.Z_SCALE), 
										  innerCircle: new BoundingCircle(this.x - zc.Z_SLASH_INNER_CENTER_X * zc.Z_SCALE, this.y - zc.Z_SLASH_INNER_CENTER_Y * zc.Z_SCALE, zc.Z_SLASH_INNER_RADIUS * zc.Z_SCALE)}; 
					}
				} else {
					this.slashZone.active = false;
				}
			}
		}
		else if (this.crouching) {
			if (!this.game.keys['KeyX']) {
				this.stopCrouch();
			}
		}

		this.x += this.game.clockTick * this.deltaX;
		this.y += this.game.clockTick * this.deltaY;

		this.boundingbox.translateCoordinates(this.game.clockTick * this.deltaX, this.game.clockTick * this.deltaY);
		
		this.lightsaber.update();
		super.update();
	}

	draw() {
		if (this.somersaulting) {
			this.drawX = this.x - zc.Z_SCALE * (zc.Z_SOMERSAULT_WIDTH / 2);
			if (this.somersaultingDirection === -1) {
				this.animation = this.somersaultingLeftAnimation;
			} else if (this.somersaultingDirection === 1) {
				this.animation = this.somersaultingAnimation;
			}
		}
		else if (this.slashing) {
			if (this.slashingDirection === 1) {
				this.drawX = this.x - zc.Z_ARM_SOCKET_X_SLASH_FRAME * zc.Z_SCALE;
				this.animation = this.slashingAnimation;
			} else if (this.slashingDirection === -1) {
				this.drawX = this.x - (zc.Z_SLASH_WIDTH - zc.Z_ARM_SOCKET_X_SLASH_FRAME) * zc.Z_SCALE;
				this.animation = this.slashingLeftAnimation;
			}
		}
		else if (this.falling) {
			if (this.facingRight) { 
				this.animation = this.deltaY < 0 ? this.fallingUpAnimation : this.fallingDownAnimation;
				this.drawX = this.x - zc.Z_ARM_SOCKET_X * zc.Z_SCALE;
			} else { // facing left
				this.animation = this.deltaY < 0 ? this.fallingUpLeftAnimation : this.fallingDownLeftAnimation;
				this.drawX = this.x - (zc.Z_WIDTH - zc.Z_ARM_SOCKET_X) * zc.Z_SCALE;
			}
		}
		else if (this.crouching) {
			if (this.facingRight) { 
				this.animation = this.crouchAnimation;
				this.drawX = this.x - zc.Z_ARM_SOCKET_X * zc.Z_SCALE;
			} else { // facing left
				this.animation = this.crouchLeftAnimation;
				this.drawX = this.x - (zc.Z_WIDTH - zc.Z_ARM_SOCKET_X) * zc.Z_SCALE;
			}
		}
		else if (this.facingRight) {
			this.drawX = this.x - zc.Z_ARM_SOCKET_X * zc.Z_SCALE;
			if (this.direction === -1) {
				this.animation = this.moveLeftFaceRightAnimation;
			} else if (this.direction === 0) {
				this.animation = this.standFaceRightAnimation;
			} else if (this.direction === 1) {
				this.animation = this.moveRightFaceRightAnimation;
			}
		} 
		else { // facing left
			this.drawX = this.x - (zc.Z_WIDTH - zc.Z_ARM_SOCKET_X) * zc.Z_SCALE;
			if (this.direction === -1) {
				this.animation = this.moveLeftFaceLeftAnimation;
			} else if (this.direction === 0) {
				this.animation = this.standFaceLeftAnimation;
			} else if (this.direction === 1) {
				this.animation = this.moveRightFaceLeftAnimation;
			}
		}

		this.animation.drawFrame(this.game.clockTick, this.ctx, this.drawX - this.game.camera.x, this.y - this.animation.frameHeight * zc.Z_SCALE);
		this.lightsaber.draw();

		if (zc.DRAW_COLLISION_BOUNDRIES) {
			this.ctx.strokeStyle = "black";
			if (!this.boundingbox.hidden) {
				this.ctx.strokeRect(this.boundingbox.x - this.game.camera.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
			}
			if (this.slashing && this.slashZone.active) {
				this.ctx.beginPath();
				this.ctx.arc(this.slashZone.outerCircle.x - this.game.camera.x, this.slashZone.outerCircle.y, this.slashZone.outerCircle.radius, 0, Math.PI * 2);
				this.ctx.stroke();
				this.ctx.arc(this.slashZone.innerCircle.x - this.game.camera.x, this.slashZone.innerCircle.y, this.slashZone.innerCircle.radius, 0, Math.PI * 2);
				this.ctx.stroke();
			}
		}
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

	isInManeuver() {
		return this.somersaulting || this.slashing;
	}

	/*
	 * check if animation is done (can't call animation.isDone() because it does not have latest clockTick yet in update())
	 */
	isAnimationDone() {
		return (this.animation.elapsedTime + this.game.clockTick) >= this.animation.totalTime;
	}

	startSomersault() {
		this.game.audio.lightsaber.play('lightsaberOff');
		this.game.audio.saberHum.stop();
		this.somersaulting = true;
		this.deltaX = zc.Z_SOMERSAULT_SPEED * this.direction;
		this.somersaultingDirection = this.direction;
		this.lightsaber.hidden = true;

		// TODO: new bounding box for somersault, left and right
		this.boundingbox.hidden = true;
	}

	finishSomersault() {
		this.game.audio.lightsaber.play('lightsaberOn');
		this.game.audio.saberHum.play();
		this.animation.elapsedTime = 0;
		this.deltaX = 0;
		this.somersaulting = false;
		this.lightsaber.hidden = false;		
		this.boundingbox.hidden = false;
	}

	crouch() {
		this.crouching = true;
		this.deltaX = 0;
		this.armSocketY = zc.Z_CROUCH_ARM_SOCKET_Y;
		if (this.facingRight) {
			this.faceRight(); 
		} else {
			this.faceLeft();
		}
	}

	stopCrouch() {
		this.crouching = false;
		this.armSocketY = zc.Z_ARM_SOCKET_Y;
		if (this.facingRight) {
			this.faceRight(); 
		} else {
			this.faceLeft();
		}
	}

	startSlash() {
		this.game.audio.lightsaber.volume(.25, this.game.audio.lightsaber.play('lightsaberSwing'));
		this.slashing = true;
		this.deltaX = 0;
		this.lightsaber.hidden = true;
		this.slashingDirection = this.facingRight ? 1 : -1;
		this.slashZone = {};
		// TODO: new bounding box for slash, left and right
		this.boundingbox = new BoundingBox(this.boundingbox.x , this.y - (zc.Z_HEIGHT - 73) * zc.Z_SCALE, this.boundingbox.width, this.boundingbox.height);
	}

	finishSlash() {
		this.animation.elapsedTime = 0;
		this.slashing = false;
		this.lightsaber.hidden = false;
	}


	faceRight() {
		this.facingRight = true;
		if (this.crouching) {
			this.boundingbox = new BoundingBox(this.x - (15 * zc.Z_SCALE), this.y - (zc.Z_HEIGHT - 120) * zc.Z_SCALE, (zc.Z_WIDTH - 39) * zc.Z_SCALE, (zc.Z_HEIGHT - 132) * zc.Z_SCALE);
		} else {
			this.boundingbox = new BoundingBox(this.x - (15 * zc.Z_SCALE), this.y - (zc.Z_HEIGHT - 73) * zc.Z_SCALE, (zc.Z_WIDTH - 39) * zc.Z_SCALE, (zc.Z_HEIGHT - 85) * zc.Z_SCALE);	
		}
	}

	faceLeft() {
		this.facingRight = false;
		if (this.crouching) {
			this.boundingbox = new BoundingBox(this.x - (zc.Z_WIDTH - 55) * zc.Z_SCALE, this.y - (zc.Z_HEIGHT - 120) * zc.Z_SCALE, (zc.Z_WIDTH - 39) * zc.Z_SCALE, (zc.Z_HEIGHT - 132) * zc.Z_SCALE);
		} else {
			this.boundingbox = new BoundingBox(this.x - (zc.Z_WIDTH - 55) * zc.Z_SCALE, this.y - (zc.Z_HEIGHT - 73) * zc.Z_SCALE, (zc.Z_WIDTH - 39) * zc.Z_SCALE, (zc.Z_HEIGHT - 85) * zc.Z_SCALE);	
		}
	}


	createAnimations() {
		this.standFaceRightAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin standing.png"),
													0, 0, 
												   zc.Z_WIDTH, 
												   zc.Z_HEIGHT, 
												   zc.Z_STANDING_FRAME_SPEED, 
												   zc.Z_STANDING_FRAMES, 
												   true, false,
												   zc.Z_SCALE);
		this.standFaceLeftAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin standing left.png"),
													0, 0, 
												   zc.Z_WIDTH, 
												   zc.Z_HEIGHT, 
												   zc.Z_STANDING_FRAME_SPEED, 
												   zc.Z_STANDING_FRAMES, 
												   true, false,
												   zc.Z_SCALE);
		this.moveRightFaceRightAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin bobbing walking.png"), 
													0, 0,
												   zc.Z_WIDTH, 
												   zc.Z_HEIGHT, 
												   zc.Z_WALKING_FRAME_SPEED, 
												   zc.Z_WALKING_FRAMES, 
												   true, false,
												   zc.Z_SCALE);
		this.moveRightFaceLeftAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin left backwards bobbing walking.png"),
													0, 0,
												   zc.Z_WIDTH, 
												   zc.Z_HEIGHT, 
												   zc.Z_WALKING_FRAME_SPEED, 
												   zc.Z_WALKING_FRAMES, 
												   true, false,
												   zc.Z_SCALE);
		this.moveLeftFaceRightAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin backwards bobbing walking.png"),
													0, 0,
												   zc.Z_WIDTH, 
												   zc.Z_HEIGHT, 
												   zc.Z_WALKING_FRAME_SPEED, 
												   zc.Z_WALKING_FRAMES, 
												   true, false,
												   zc.Z_SCALE);
		this.moveLeftFaceLeftAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin left bobbing walking.png"), 
													0, 0,
												   zc.Z_WIDTH, 
												   zc.Z_HEIGHT, 
												   zc.Z_WALKING_FRAME_SPEED, 
												   zc.Z_WALKING_FRAMES, 
												   true, false,
												   zc.Z_SCALE);
		this.fallingUpAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin falling up.png"), 
													0, 0,
												   zc.Z_WIDTH, 
												   zc.Z_HEIGHT, 
												   zc.Z_FALLING_FRAME_SPEED, 
												   zc.Z_FALLING_UP_FRAMES, 
												   true, false,
												   zc.Z_SCALE);
		this.fallingDownAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin falling down.png"), 
													0, 0,
												   zc.Z_WIDTH, 
												   zc.Z_HEIGHT, 
												   zc.Z_FALLING_FRAME_SPEED, 
												   zc.Z_FALLING_DOWN_FRAMES, 
												   true, false,
												   zc.Z_SCALE);
		this.fallingUpLeftAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin falling up left.png"), 
													0, 0,
												   zc.Z_WIDTH, 
												   zc.Z_HEIGHT, 
												   zc.Z_FALLING_FRAME_SPEED, 
												   zc.Z_FALLING_UP_FRAMES, 
												   true, false,
												   zc.Z_SCALE);
		this.fallingDownLeftAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin falling down left.png"), 
													0, 0,
												   zc.Z_WIDTH, 
												   zc.Z_HEIGHT, 
												   zc.Z_FALLING_FRAME_SPEED, 
												   zc.Z_FALLING_DOWN_FRAMES, 
												   true, false,
												   zc.Z_SCALE);
		this.somersaultingAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin somersault.png"), 
													0, 0,
												   zc.Z_SOMERSAULT_WIDTH, 
												   zc.Z_SOMERSAULT_HEIGHT, 
												   zc.Z_SOMERSAULT_FRAME_SPEED, 
												   zc.Z_SOMERSAULT_FRAMES, 
												   false, false,
												   zc.Z_SCALE);
		this.somersaultingLeftAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin left somersault.png"), 
													0, 0,
												   zc.Z_SOMERSAULT_WIDTH, 
												   zc.Z_SOMERSAULT_HEIGHT, 
												   zc.Z_SOMERSAULT_FRAME_SPEED, 
												   zc.Z_SOMERSAULT_FRAMES, 
												   false, false,
												   zc.Z_SCALE);
		this.slashingAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin slash.png"), 
													0, 0,
												   zc.Z_SLASH_WIDTH, 
												   zc.Z_SLASH_HEIGHT, 
												   zc.Z_SLASH_FRAME_SPEED, 
												   zc.Z_SLASH_FRAMES, 
												   false, false,
												   zc.Z_SCALE);
		this.slashingLeftAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin slash left.png"), 
													0, 0,
												   zc.Z_SLASH_WIDTH, 
												   zc.Z_SLASH_HEIGHT, 
												   zc.Z_SLASH_FRAME_SPEED, 
												   zc.Z_SLASH_FRAMES, 
												   false, false,
												   zc.Z_SCALE);
		this.crouchAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin crouch.png"), 
													0, 0,
												   zc.Z_WIDTH, 
												   zc.Z_HEIGHT, 
												   1, 
												   1, 
												   true, false,
												   zc.Z_SCALE);
		this.crouchLeftAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin crouch left.png"), 
													0, 0,
												   zc.Z_WIDTH, 
												   zc.Z_HEIGHT, 
												   1, 
												   1, 
												   true, false,
												   zc.Z_SCALE);
	}
}



var LS_UP_IMAGE_WIDTH = 126;
var LS_UP_IMAGE_HEIGHT = 228;
var LS_DOWN_IMAGE_WIDTH = 126;
var LS_DOWN_IMAGE_HEIGHT = 222;

var LS_UP_COLLAR_X = 114; // 114 for outer edge of blade, 111 for center of blade
var LS_UP_COLLAR_Y = 186;
var LS_DOWN_COLLAR_X = 114;
var LS_DOWN_COLLAR_Y = 35;
var LS_UP_TIP_X = 114;
var LS_UP_TIP_Y = 5;
var LS_DOWN_TIP_X = 114;
var LS_DOWN_TIP_Y = 216;

var LS_RIGHT_X_AXIS = 10;
var LS_LEFT_X_AXIS = 10;
var LS_UP_Y_AXIS = 159;
var LS_DOWN_Y_AXIS = 63;


class Lightsaber extends Entity {

	constructor(game, Zerlin) {
		super(game, 
				0, 0, // will be set in faceRightUpSaber()
				0, 0);
		this.assetManager = game.assetManager;
		this.ctx = game.ctx;
		this.angle = 0;
		this.Zerlin = Zerlin;
		this.hidden = false;
		this.inClickPosition = false;
		this.setUpSaberImages();
		this.faceRightUpSaber();
		this.updateCollisionLine();
	}

	update() {
		this.x = this.Zerlin.x;
		this.y = this.Zerlin.y - (zc.Z_HEIGHT - this.Zerlin.armSocketY) * zc.Z_SCALE;
		// rotate 
		if (this.game.mouse) {
			 // TODO: rotateAndCache if mouse not moved
			this.angle = Math.atan2(this.game.mouse.y - this.y, this.game.mouse.x + this.game.camera.x - this.x);

			// change sprite on any of these conditions 
			// TODO: consolidate logic here
			if (this.game.mouse.x + this.game.camera.x < this.Zerlin.x && this.facingRight) {
				this.saberUp = !this.saberUp;
				if (this.inClickPosition) {
					this.faceLeftUpSaber();
				} else {
					this.faceLeftDownSaber();
				}        
			} 
			else if (this.game.mouse.x + this.game.camera.x > this.Zerlin.x && !this.facingRight) {
				this.saberUp = !this.saberUp;
				if (this.inClickPosition) {
					this.faceRightDownSaber();
				} else {
					this.faceRightUpSaber();
				}
			} 
			else if (this.game.rightClickDown && !this.inClickPosition) {
				this.inClickPosition = true;
				if (this.game.mouse.x + this.game.camera.x < this.Zerlin.x) {
					this.faceLeftUpSaber();
				} else {
					this.faceRightDownSaber();
				}        
			} else if (!this.game.rightClickDown && this.inClickPosition) {
				this.inClickPosition = false;
				if (this.game.mouse.x + this.game.camera.x < this.Zerlin.x) {
					this.faceLeftDownSaber();
				} else {
					this.faceRightUpSaber();
				}
			}

		}

		this.updateCollisionLine();

		super.update();
	}

	draw() {
		if (!this.hidden) {
			this.ctx.save();
			this.ctx.translate(this.x - this.game.camera.x, this.y);
			this.ctx.rotate(this.angle);
			this.ctx.drawImage(this.image,
							   0,
							   0,
							   this.width,
							   this.height,
							   -(this.armSocketX * zc.Z_SCALE), // is this correct?
							   -(this.armSocketY * zc.Z_SCALE),
							   zc.Z_SCALE * this.width,
							   zc.Z_SCALE * this.height);
			this.ctx.restore();
		}
		if (zc.DRAW_COLLISION_BOUNDRIES) {
			this.ctx.save();
			this.ctx.strokeStyle = "black";
			this.ctx.beginPath();
			this.ctx.moveTo(this.bladeCollar.x - this.game.camera.x, this.bladeCollar.y);
			this.ctx.lineTo(this.bladeTip.x - this.game.camera.x, this.bladeTip.y);
			this.ctx.stroke();
			this.ctx.closePath();
			this.ctx.restore();
		}
		super.draw();
	}

	saberSlope() {
		return (this.bladeCollar.y - this.bladeTip.y) / (this.bladeCollar.x - this.bladeTip.x);
	}

	getSaberAngle() {
		// return this.angle + Math.PI / 2;
		return Math.atan2(this.bladeCollar.y - this.bladeTip.y, this.bladeCollar.x - this.bladeTip.x);
	}

	updateCollisionLine() {
		var cosine = Math.cos(this.angle);
		var sine = Math.sin(this.angle);

		var collarXrotated = this.collarXfromSocket * cosine - this.collarYfromSocket * sine;
		var collarYrotated = this.collarYfromSocket * cosine + this.collarXfromSocket * sine;

		var tipXrotated = this.tipXfromSocket * cosine - this.tipYfromSocket * sine;
		var tipYrotated = this.tipYfromSocket * cosine + this.tipXfromSocket * sine;

		this.prevBladeCollar = this.bladeCollar;
		this.prevBladeTip = this.bladeTip;
		this.bladeCollar = { x: collarXrotated * zc.Z_SCALE + this.x, y: collarYrotated * zc.Z_SCALE + this.y };
		this.bladeTip = { x: tipXrotated * zc.Z_SCALE + this.x, y: tipYrotated * zc.Z_SCALE + this.y };
	}

	faceRightUpSaber() {
		this.image = this.faceRightUpSaberImage;
		this.width = LS_UP_IMAGE_WIDTH;
		this.height = LS_UP_IMAGE_HEIGHT;
		this.armSocketX = LS_RIGHT_X_AXIS;
		this.armSocketY = LS_UP_Y_AXIS;

		this.collarXfromSocket = LS_UP_COLLAR_X - LS_RIGHT_X_AXIS;
		this.collarYfromSocket = LS_UP_COLLAR_Y - LS_UP_Y_AXIS;
		this.tipXfromSocket = LS_UP_TIP_X - LS_RIGHT_X_AXIS;
		this.tipYfromSocket = LS_UP_TIP_Y - LS_UP_Y_AXIS;

		this.facingRight = true;
		this.saberUp = true;
	}

	faceLeftUpSaber() {
		this.image = this.faceLeftUpSaberImage;
		this.width = LS_UP_IMAGE_WIDTH;
		this.height = LS_UP_IMAGE_HEIGHT;
		this.armSocketX = LS_LEFT_X_AXIS;
		this.armSocketY = this.height - LS_UP_Y_AXIS;

		this.collarXfromSocket = LS_UP_COLLAR_X - LS_LEFT_X_AXIS;
		this.collarYfromSocket = LS_UP_Y_AXIS - LS_UP_COLLAR_Y;
		this.tipXfromSocket = LS_UP_TIP_X - LS_RIGHT_X_AXIS;
		this.tipYfromSocket = LS_UP_Y_AXIS - LS_UP_TIP_Y;

		this.facingRight = false;
		this.saberUp = true;
	}

	faceRightDownSaber() {
		this.image = this.faceRightDownSaberImage;
		this.width = LS_DOWN_IMAGE_WIDTH;
		this.height = LS_DOWN_IMAGE_HEIGHT;
		this.armSocketX = LS_RIGHT_X_AXIS;
		this.armSocketY = LS_DOWN_Y_AXIS;

		this.collarXfromSocket = LS_DOWN_COLLAR_X - LS_RIGHT_X_AXIS;
		this.collarYfromSocket = LS_DOWN_COLLAR_Y - LS_DOWN_Y_AXIS;
		this.tipXfromSocket = LS_DOWN_TIP_X - LS_RIGHT_X_AXIS;
		this.tipYfromSocket = LS_DOWN_TIP_Y - LS_DOWN_Y_AXIS;

		this.facingRight = true;
		this.saberUp = false;
	}

	faceLeftDownSaber() {
		this.image = this.faceLeftDownSaberImage;
		this.width = LS_DOWN_IMAGE_WIDTH;
		this.height = LS_DOWN_IMAGE_HEIGHT;
		this.armSocketX = LS_LEFT_X_AXIS;
		this.armSocketY = this.height - LS_DOWN_Y_AXIS;

		this.collarXfromSocket = LS_DOWN_COLLAR_X - LS_LEFT_X_AXIS;
		this.collarYfromSocket = LS_DOWN_Y_AXIS - LS_DOWN_COLLAR_Y;
		this.tipXfromSocket = LS_DOWN_TIP_X - LS_LEFT_X_AXIS;
		this.tipYfromSocket = LS_DOWN_Y_AXIS - LS_DOWN_TIP_Y;

		this.facingRight = false;
		this.saberUp = false;
	}

	setUpSaberImages() {
		this.faceRightUpSaberImage = this.assetManager.getAsset("../img/saber up.png");
		this.faceLeftUpSaberImage = this.assetManager.getAsset("../img/saber up left.png");
		this.faceRightDownSaberImage = this.assetManager.getAsset("../img/saber down.png");
		this.faceLeftDownSaberImage = this.assetManager.getAsset("../img/saber down left.png");
	}
}


