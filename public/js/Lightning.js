/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/



const ltng = Constants.LightningConstants;


class Lightning extends Entity {

	constructor(game, startX, startY, target, power) {
		super(game, startX, startY);
		this.sceneManager = game.sceneManager;
		this.camera = this.sceneManager.camera;
		this.power = power;
		this.angle = Math.atan2(target.y - startY, target.x + this.camera.x - startX);
		this.target = this.findEnemyInPath();
		if (this.target) {
			this.hadTarget = true;
			this.target.lightning = this;
		}

		this.segments = [];
		this.segmentGenerationTimer = ltng.SEGMENT_GENERATION_TIME;
		this.opacity = 1;
		this.reachedEnd = false;
        this.game.audio.playSoundFx(this.game.audio.lightning);
	}

	update() {
		this.segmentGenerationTimer += this.game.clockTick;
		while (!this.reachedEnd && this.segmentGenerationTimer >= ltng.SEGMENT_GENERATION_TIME) {
			this.segmentGenerationTimer -= ltng.SEGMENT_GENERATION_TIME;
			this.addSegment();
			this.checkLightningCollision();
		}
		if (this.reachedEnd) {
			this.opacity -= this.game.clockTick / ltng.FADE_TIME;
		}
		if (this.opacity < 0) {
			this.removeFromWorld = true;
			if (this.target) this.target.lightning = null;
		}
	}

	draw() {
		var originalAlpha = this.game.ctx.globalAlpha;
      	this.game.ctx.globalAlpha = 1;
		var width = this.reachedEnd? ltng.WIDTH * 2 * this.opacity : ltng.WIDTH;
		// width *= this.power;
		var cameraX = this.camera.x;
		var ctx = this.game.ctx;
		ctx.save();

		for (let i = 0; i < this.segments.length; i++) {
			let segment = this.segments[i];

			//Outer Layer of beam
			ctx.lineWidth = width * 2;
			ctx.strokeStyle = "blue";
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.moveTo(segment.p1.x - cameraX, segment.p1.y);
			ctx.lineTo(segment.p2.x - cameraX, segment.p2.y);
			ctx.stroke();
		}

		for (let i = 0; i < this.segments.length; i++) {
			let segment = this.segments[i];

			//inner layer of beam.
			ctx.lineWidth = width;
			ctx.strokeStyle = "white";
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.moveTo(segment.p1.x - cameraX, segment.p1.y);
			ctx.lineTo(segment.p2.x - cameraX, segment.p2.y);
			ctx.stroke();
			ctx.closePath();
		}

		ctx.restore();
      	this.game.ctx.globalAlpha = originalAlpha;
	}
	
	findEnemyInPath() {
		var droids = this.sceneManager.droids;
		// var targets = [];
		if ((this.sceneManager.boss && this.isInRange({x: this.sceneManager.boss.boundingbox.width / 2 + this.sceneManager.boss.boundingbox.x, 
		                                               y: this.sceneManager.boss.boundingbox.height / 2 + this.sceneManager.boss.boundingbox.y}))) {
			target = this.sceneManager.boss;
		} else {
			var minDistance = 99999999;
			var target;
			for (let i = 0; i < droids.length; i++) {
				let d = distance(this, droids[i].boundCircle);
				if (!droids[i].lightning && d < minDistance && this.isInRange(droids[i].boundCircle)) {
					minDistance = d;
					target = droids[i];
				}
			}
		}
		return target;

	}	

	XYofTarget() {
		if (this.target && this.target instanceof AbstractDroid) {
			return this.target.boundCircle;
		} else if (this.target && this.target instanceof Boss) {
			return {x: this.sceneManager.boss.boundingbox.width / 2 + this.sceneManager.boss.boundingbox.x, 
		            y: this.sceneManager.boss.boundingbox.height / 2 + this.sceneManager.boss.boundingbox.y};
		}
	}

	isInRange(droid) {
		var angleToDroid = Math.atan2(droid.y - this.y, droid.x - this.x);
		return (angleToDroid > this.angle - ltng.ARC_CAPTURE_RANGE / 2) && (angleToDroid < this.angle + ltng.ARC_CAPTURE_RANGE / 2);
	}

	addSegment() {
		let startX = this.segments.length > 0? this.segments[this.segments.length - 1].p2.x : this.x;
		let startY = this.segments.length > 0? this.segments[this.segments.length - 1].p2.y : this.y;

		if (this.target) {
			var target = this.XYofTarget(this.target);
			let distanceToTarget = distance({x: startX, y: startY}, target);
			var length = distanceToTarget > ltng.MAX_SEGMENT_LENGTH? Math.random() * ltng.MAX_SEGMENT_LENGTH : distanceToTarget;
			let arcRangeOfNextSegment = this.getArcRangeForSegment(distanceToTarget);

			var angle = Math.atan2(target.y - startY, target.x - startX) + (Math.random() - .5) * arcRangeOfNextSegment;


		} else {
			var length = Math.random() * ltng.MAX_SEGMENT_LENGTH;
			var angle = this.angle + (Math.random() - .5) * ltng.MAX_SEGMENT_ARC_RANGE;
		}

		this.segments.push({p1: {x: startX, y: startY}, p2: {x: startX + Math.cos(angle) * length, y: startY + Math.sin(angle) * length}});
	}

	getArcRangeForSegment(distanceToTarget) {
		var exponentFactor = .01;
		if (distanceToTarget > ltng.MAX_SEGMENT_LENGTH) {
			/*             
			                 -.01(x - (.01*segLen + ln(pi)) / .01) 
			    arcRange = -e                                      + pi
			*/

			return -Math.pow(Math.E, -exponentFactor * (distanceToTarget - (exponentFactor * ltng.MAX_SEGMENT_LENGTH + Math.log(ltng.MAX_SEGMENT_ARC_RANGE)) / exponentFactor)) + ltng.MAX_SEGMENT_ARC_RANGE;
		} else { // close enough, now make bolt go directly to target
			return 0;
		}
	}

	checkLightningCollision() {
		if (this.target) {
			if (this.target instanceof AbstractDroid) {
				if (collideLineWithCircle2(this.segments[this.segments.length - 1], this.XYofTarget(this.target))) {
					this.reachedEnd = true;
					this.target.explode();
				}
			} else if (this.target instanceof Boss) {
				if (collideLineWithRectangle2(this.segments[this.segments.length - 1], this.target.boundingbox)) {
					this.reachedEnd = true;
					let xy = this.XYofTarget(this.target);
              		this.sceneManager.addEntity(new DroidExplosion(this.game, xy.x, xy.y, .7, .2));
					this.target.currentHealth -= ltng.BOSS_DAMAGE;
				}
			}
		} else { // check if off camera 
			if (this.segments.length > 0 && distance(this.segments[this.segments.length - 1].p2, this) > 1300) {
				this.reachedEnd = true;
			}
		}
	}

}