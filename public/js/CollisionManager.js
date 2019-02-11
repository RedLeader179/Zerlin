/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/



var EDGE_OF_MAP_BUFFER = 50;
/*
 * Detects and handles collisions for game entities.
 */
class CollisionManager {

	constructor(game) {
		this.game = game;
	}

	handleCollisions() {
		// this.droidOnDroid();
		this.droidOnSaber();
		this.laserOnDroid();
		this.laserOnSaber();
		this.laserOnZerlin();
		this.ZerlinOnPlatform();
		this.ZerlinOnEdgeOfMap();
		this.beamOnSaber();
		this.beamOnDroid();
		this.beamOnZerlin();
		this.beamOnPlatform();

		// TODO: loop through only visible tiles instead of entire level
	}

	/* On droids colliding, swap deltaX and deltaY */
	droidOnDroid() {
		//check collision with other droids.
		//can optimize by not checking every single droid with each other twice.
        
		// for (var i = this.game.droids.length - 1; i >= 0; i--) {
		// 	var droid1 = this.game.droids[i];
		// 	for (var j = this.game.droids.length - 1; j >= 0; j--) {
		// 		var droid2 = this.game.droids[j];
		// 		if(droid1 != null && droid2 != null && droid1 != droid2 
		// 			&& collideCircleWithCircle(droid1.boundCircle.x, droid1.boundCircle.y, droid1.boundCircle.radius,
		// 				droid2.boundCircle.x, droid2.boundCircle.y, droid2.boundCircle.radius)) {

		// 			//handle collision of droids with droids. 
		// 			//swap velocities, bounce effect.
		// 			/*
		// 			* BUG ALERT:
		// 			* kinda strange, has the characteristics that we want as in that
		// 			* it only bounces some times, but it is a bug/feature in this code that 
		// 			* only makes them bounce some times instead of having the 
		// 			* chance they can bounce being bound to a constant
		// 			*/
		// 			var tempX = droid1.deltaX;
		// 			var tempY = droid1.deltaY;
		// 			droid1.deltaX = droid2.deltaX;
		// 			droid1.deltaY = droid2.deltaY;
		// 			droid2.deltaX = tempX;
		// 			droid2.deltaY = tempY;

					//tag code modified for droids, doesn't work
					// var temp = {deltaX: droid1.deltaX, deltaY: droid1.deltaY};
					// var dist = distance(droid1, droid2);
					// var delta = droid1.boundCircle.radius + droid2.boundCircle.radius - dist;
					// var difX = (droid1.boundCircle.x - droid2.boundCircle.x)/dist;
					// var difY = (droid1.boundCircle.y - droid2.boundCircle.y)/dist;

					// droid1.x += difX * delta / 2;
					// droid1.y += difY * delta / 2;
					// droid2.x -= difX * delta / 2;
					// droid2.y -= difY * delta / 2;

					// droid1.deltaX = droid2.deltaX;
					// droid1.deltaY = droid2.deltaY;
					// droid2.deltaX = temp.deltaX;
					// droid2.deltaY = temp.deltaY;
					// droid1.x += droid1.deltaX * this.game.clockTick;
					// droid1.y += droid1.deltaY * this.game.clockTick;
					// droid2.x += droid2.deltaX * this.game.clockTick;
					// droid2.y += droid2.deltaY * this.game.clockTick;

		// 		}
		// 	}
			
		// }
		
	}

	droidOnSaber() {
		var zerlin = this.game.Zerlin;
		if (zerlin.slashing && zerlin.slashZone.active) {
			for (var i = this.game.droids.length - 1; i >= 0; i--) {
				var droid = this.game.droids[i];
				// check if droid in circular path of saber and not below zerlin
				if (collidePointWithCircle(droid.boundCircle.x, 
										   droid.boundCircle.y, 
										   zerlin.slashZone.outerCircle.x, 
										   zerlin.slashZone.outerCircle.y, 
										   zerlin.slashZone.outerCircle.radius)
					&& !collidePointWithCircle(droid.boundCircle.x, 
										   droid.boundCircle.y, 
										   zerlin.slashZone.innerCircle.x, 
										   zerlin.slashZone.innerCircle.y, 
										   zerlin.slashZone.innerCircle.radius)
					&& droid.boundCircle.y < zerlin.y) {
					droid.explode();
				}
			}	
		}
	}

	laserOnDroid() {
		for (var i = this.game.lasers.length - 1; i >= 0; i--) {
			if (this.game.lasers[i].isDeflected) {
				for (var j = this.game.droids.length - 1; j >= 0; j--) {
					if (this.isLaserCollidedWithDroid(this.game.lasers[i], this.game.droids[j])) {
						this.game.droids[j].explode();
						this.game.lasers[i].removeFromWorld = true;
					}
				}
			}
		}
	}

	laserOnSaber() {
		if (!this.game.Zerlin.lightsaber.hidden) {
			for (var i = this.game.lasers.length - 1; i >= 0; i--) {
				var laser = this.game.lasers[i];
				if (!laser.isDeflected) {
					var collision = this.isCollidedWithSaber(laser);
					if (collision.collided) {
						this.deflectLaser(laser, collision.intersection);
        				this.game.audio.enemy.volume(.07, this.game.audio.enemy.play('retroBlasterShot'));
					}
				}
			}
		}
	}

	laserOnZerlin() {
		var zerlin = this.game.Zerlin;
		if (!zerlin.boundingbox.hidden) {
			for (var i = 0; i < this.game.lasers.length; i++) {
				var laser = this.game.lasers[i];
				if ( !laser.isDeflected &&
					laser.x > zerlin.boundingbox.left &&
					laser.x < zerlin.boundingbox.right &&
					laser.y > zerlin.boundingbox.top &&
					laser.y < zerlin.boundingbox.bottom) {
					this.game.audio.wound.play();
					laser.removeFromWorld = true;
					zerlin.hits++;
					// console.log(zerlin.hits);
				}
			}
		}
	}

	ZerlinOnPlatform() {
		var zerlin = this.game.Zerlin;
		if (zerlin.falling) { // check if landed
			for (let i = 0; i < this.game.level.tiles.length; i++) {
				let tile = this.game.level.tiles[i];
				if (zerlin.boundingbox.collide(tile.boundingBox) && zerlin.lastBottom < tile.boundingBox.top) {
					zerlin.falling = false;
					zerlin.deltaY = 0;
					zerlin.setXY(zerlin.x, tile.boundingBox.top + Z_FEET_ABOVE_FRAME * Z_SCALE);
					return;
				}
			}
		} else { // check if falls off current platform
			for (let i = 0; i < this.game.level.tiles.length; i++) {
				if (zerlin.isTileBelow(this.game.level.tiles[i])) {
					return;
				}
			}
			zerlin.falling = true;
		}
	}

	ZerlinOnEdgeOfMap() { // TODO: currently, keeps zerlin from falling off edge of map, but do we want to allow that for daring players?
		var zerlin = this.game.Zerlin;
		if (zerlin.y > 2 * this.game.camera.height) {
			// game over
			console.log("Game over");
			this.game.gameOver = true;
		}
		else if (zerlin.x < EDGE_OF_MAP_BUFFER) {
			zerlin.setXY(EDGE_OF_MAP_BUFFER, zerlin.y);
		} else if (zerlin.x > this.game.level.length - EDGE_OF_MAP_BUFFER) {
			zerlin.setXY(this.game.level.length - EDGE_OF_MAP_BUFFER, zerlin.y);
		}

	}

	beamOnSaber() {
		var zerlin = this.game.Zerlin;
		var lightsaber = zerlin.lightsaber;

		var maxLength = Math.sqrt(this.game.camera.width ** 2, this.game.camera.height ** 2) * 3; // screen diagonal length * 3
		for (let i = 0; i < this.game.beams.length; i++) {
			var beamSegments = this.game.beams[i].segments;
			beamSegments.splice(1); // recreate all deflected segments;
			for (let j = 0; j < beamSegments.length; j++) {
				// set beam to reasonable length
				beamSegments[j].endX = Math.cos(beamSegments[j].angle) * maxLength + beamSegments[j].x;
				beamSegments[j].endY = Math.sin(beamSegments[j].angle) * maxLength + beamSegments[j].y;

				if (!lightsaber.hidden) {
					var collisionWithSaber = this.isCollidedLineWithLine({p1: {x: beamSegments[j].x, y: beamSegments[j].y}, p2: {x: beamSegments[j].endX, y: beamSegments[j].endY}}, 
													{p1: lightsaber.bladeCollar, p2: lightsaber.bladeTip});
					// TODO: check for collision with ANY deflective agent (i. e. a mirror or laser shield or something)
					if (collisionWithSaber.collided) {
						beamSegments[j].endX = collisionWithSaber.intersection.x;
						beamSegments[j].endY = collisionWithSaber.intersection.y;
						beamSegments.push({x: collisionWithSaber.intersection.x, 
										   y: collisionWithSaber.intersection.y, 
										   angle: 2 * lightsaber.getSaberAngle() - beamSegments[j].angle,
										   deflected: true});
						beamSegments[j+1].endX = Math.cos(beamSegments[j+1].angle) * maxLength + beamSegments[j+1].x;
						beamSegments[j+1].endY = Math.sin(beamSegments[j+1].angle) * maxLength + beamSegments[j+1].y;
						break;
					}
				}
			}
		}
	}

	beamOnDroid() {
		for (let i = 0; i < this.game.beams.length; i++) {
			var beamSegments = this.game.beams[i].segments;
			// only check second segment for collision on droids
			if (beamSegments.length > 1 && beamSegments[1].deflected) {
				var beamSeg = beamSegments[1];
				for (var j = this.game.droids.length - 1; j >= 0; j--) {
					var droidCircle = this.game.droids[j].boundCircle;
					if (collideLineWithCircle(beamSeg.x, beamSeg.y, beamSeg.endX, beamSeg.endY, droidCircle.x, droidCircle.y, droidCircle.radius)) {
						this.game.droids[j].explode();
					}
				}
			}
		}
	}

	beamOnZerlin() {
		var zerlinBox = this.game.Zerlin.boundingbox;
		if (!zerlinBox.hidden) {
			for (let i = 0; i < this.game.beams.length; i++) {
				this.game.beams[i].isSizzling = false;
				var beamSegments = this.game.beams[i].segments;
				for (let j = 0; j < beamSegments.length; j++) {
					var beamSeg = beamSegments[j];
					var zerlinCollision = collideLineWithRectangle(beamSeg.x, beamSeg.y, beamSeg.endX, beamSeg.endY,
												 zerlinBox.x, zerlinBox.y, zerlinBox.width, zerlinBox.height);
					if (zerlinCollision.collides) {
						this.game.beams[i].isSizzling = true;
						this.game.Zerlin.hits += this.game.clockTick * BEAM_HP_PER_SECOND;
						console.log(this.game.Zerlin.hits);

						// find intersection with box with shortest beam length, end beam there
						var closestIntersection = findClosestIntersectionOnBox(zerlinCollision, beamSeg);
						beamSeg.endX = closestIntersection.x;
						beamSeg.endY = closestIntersection.y;
						beamSegments.splice(j+1);
					}
				}
			}
		}
	}

	beamOnPlatform() {
		// only detects collision with top of platforms

		for (let i = 0; i < this.game.beams.length; i++) {
			var beamSegments = this.game.beams[i].segments;
			for (let j = 0; j < beamSegments.length; j++) {
				var beamSeg = beamSegments[j];
				if (beamSeg.angle < Math.PI && beamSeg.angle > 0) {
					for (let k = 0; k < this.game.level.tiles.length; k++) {
						let tile = this.game.level.tiles[k];
						let collisionWithPlatform = this.isCollidedLineWithLine(tile.surface, {p1: {x: beamSeg.x, y: beamSeg.y}, p2: {x: beamSeg.endX, y: beamSeg.endY}});
						if (collisionWithPlatform.collided) {
							beamSeg.endX = collisionWithPlatform.intersection.x;
							beamSeg.endY = collisionWithPlatform.intersection.y;
							beamSegments.splice(j+1);
						}
					}	
				}
			}
		}
	}

	isLaserCollidedWithDroid(laser, droid) {
		return collideLineWithCircle(laser.x, laser.y, laser.tailX, laser.tailY, droid.boundCircle.x,
									droid.boundCircle.y, droid.boundCircle.radius);
	}

	// helper functions

	isCollidedWithSaber(laser) {
		var lightsaber = this.game.Zerlin.lightsaber;
		var laserP1 = {x: laser.x, y: laser.y};
		var laserP2 = {x: laser.prevX, y: laser.prevY};

		// decrease miss percentage by also checking previous blade
		var collidedWithCurrentBlade = this.isCollidedLineWithLine({p1: laserP1, p2: laserP2}, 
																	{p1: lightsaber.bladeCollar, p2: lightsaber.bladeTip});
		var collidedWithPreviousBlade = this.isCollidedLineWithLine({p1: laserP1, p2: laserP2}, 
																	{p1: lightsaber.prevBladeCollar, p2: lightsaber.prevBladeTip});

		return {collided: collidedWithCurrentBlade.collided || collidedWithPreviousBlade.collided, 
				intersection: collidedWithCurrentBlade.intersection};
	}

	isCollidedLineWithLine(line1, line2) {
		// TODO: possibly change segment intersection using clockwise check (more elegant)
		var m1 = this.calcSlope(line1.p1, line1.p2);
		var b1 = line1.p1.y - m1 * line1.p1.x;
		var m2 = this.calcSlope(line2.p1, line2.p2);
		var b2 = line2.p2.y - m2 * line2.p2.x;

		var parallel = m1 === m2;
		if (!parallel) {
			var intersection = {};
			intersection.x = (b2 - b1) / (m1 - m2);
			intersection.y = m1 * intersection.x + b1;
			var isCollided = this.isPointOnSegment(intersection, line1) 
							&& this.isPointOnSegment(intersection, line2);
			return {collided: isCollided, intersection: intersection};
		} else { // can't collide if parallel.
			return false;
		}
	}
	calcSlope(p1, p2) {
		return (p1.y - p2.y) / (p1.x - p2.x);
	}
	isPointOnSegment(pt, segment) {
		return (pt.x >= Math.min(segment.p1.x, segment.p2.x))
			&& (pt.x <= Math.max(segment.p1.x, segment.p2.x))
			&& (pt.y >= Math.min(segment.p1.y, segment.p2.y))
			&& (pt.y <= Math.max(segment.p1.y, segment.p2.y));
	}
	deflectLaser(laser, collisionPt) {
		laser.isDeflected = true;

		var zerlin = this.game.Zerlin;
		laser.angle = 2 * zerlin.lightsaber.getSaberAngle() - laser.angle;
		laser.deltaX = Math.cos(laser.angle) * laser.speed + zerlin.deltaX;
		laser.deltaY = Math.sin(laser.angle) * laser.speed + zerlin.deltaY;
		// TODO: prevent rare ultra slow lasers
		laser.slope = laser.deltaY / laser.deltaX;

		// move laser so tail is touching the deflection point, instead of the head
		var deltaMagnitude = Math.sqrt(Math.pow(laser.deltaX, 2) + Math.pow(laser.deltaY, 2));
		laser.tailX = collisionPt.x;
		laser.tailY = collisionPt.y;
		laser.x = laser.tailX + laser.deltaX / deltaMagnitude * laser.length;
		laser.y = laser.tailY + laser.deltaY / deltaMagnitude * laser.length;
		// laser.angle = this.findAngle(this.x, this.y, this.tailX, this.tailY);
	}

}

class BoundingBox {

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.left = x;
        this.top = y;
        this.right = x + width;
        this.bottom = y + height;
    }

    collide(oth) {
        if ((this.right > oth.left)
         && (this.left < oth.right) 
         && (this.top < oth.bottom) 
         && (this.bottom > oth.top)) {
            return true;
        }
        return false;
    }

    updateCoordinates(x, y) {
        this.x = x;
        this.y = y;

        this.left = x;
        this.top = y;
        this.right = x + this.width;
        this.bottom = y + this.height;
    }

    translateCoordinates(deltaX, deltaY) {
        this.x += deltaX;
        this.y += deltaY;
        this.left += deltaX;
        this.top += deltaY;
        this.right += deltaX;
        this.bottom += deltaY;
    }

}

class BoundingCircle {

    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}

/**
 * function that will calculate the distance between point a and point b.
 * both arguments need to have x and y prototype or field
 */
var distance = function(a, b) {
	return Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2));
}

/* START OF COLLISION FUNCTIONS */

/**
 * This method will return a boolean if the the circles collide.
 * @param {number} cx1 circle 1 x cord
 * @param {number} cy1 ''
 * @param {number} cr1 circle 1 radius
 * @param {number} cx2 circle 2 x cord
 * @param {number} cy2 ''
 * @param {number} cr2 circle 2 radius
 */
var collideCircleWithCircle = function(cx1, cy1, cr1, cx2, cy2, cr2) {
	result = false;
	//get distance between circles
	var dist = distance({x: cx1, y: cy1}, {x: cx2, y: cy2});

	//compare distance with the sum of the radii
	if (dist <= cr1 + cr2) {
		result = true;
	}
	return result;
}

/**
 * Function that will check the if the line segment has any point along
 * the line segment inside the radius of the circle.
 * @param {number} x1 is the x cord of end point of line
 * @param {number} y1 ''
 * @param {number} x2 is the x cord of another end point of line
 * @param {number} y2 ''
 * @param {number} cx circle x locations
 * @param {number} cy ''
 * @param {number} r  radius of circle
 */
var collideLineWithCircle = function(x1, y1, x2, y2, cx, cy, r) {
	//Check if either end point is in the circle, if so, return right away
	inside1 = collidePointWithCircle(x1, y1, cx, cy, r);
	inside2 = collidePointWithCircle(x2, y2, cx, cy, r);
	if (inside1 || inside2) return true;

	//get length of the line
	var length = distance({x: x1, y: y1}, {x: x2, y: y2});

	//get dot product of line and circle
	var dot = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / Math.pow(length, 2);

	//find closest point on line to the circle
	var closestX = x1 + (dot * (x2 - x1));
	var closestY = y1 + (dot * (y2 - y1));

	//check if the point is on the line segment
	var onSegment = collidePointWithLine(x1, y1, x2, y2, closestX, closestY);
	if (!onSegment) return false;

	//get distance to the closest point from circle
	var dist = distance({x: closestX, y: closestY}, {x: cx, y: cy});

	if (dist <= r) {
		return true;
	}
	return false;

}

/**
 * This function will check to see if a point is on a line segment
 * @param {number} x1 is the start x cord of the line segment
 * @param {number} y1 ''
 * @param {number} x2 is the end x cord of the line segment
 * @param {number} y2 ''
 * @param {number} px is the point x cord to compare with the line segment
 * @param {number} py ''
 */
var collidePointWithLine = function(x1, y1, x2, y2, px, py) {
	//get distance between endpoints and point
	var distance1 = distance({x: x1, y: y1}, {x: px, y: py});
	var distance2 = distance({x: x2, y: y2}, {x: px, y: py});
	//get distance of line
	var lineDist = distance({x: x1, y: y1}, {x: x2, y: y2});

	//because of accuracy of floats, define a buffer of collision
	var buffer = 0.1 //higher # = less accurate

	//if the 2 distances are equal to the line length, then the point is on the line
	//use buffer to give a range of collision
	if (distance1 + distance2 >= lineDist - buffer && distance1 + distance2 <= lineDist + buffer) {
		return true;
	}
	return false;
}

/**
 * This function will check if the point is inside the radius of the circle
 * @param {number} px is the x value of a point
 * @param {number} py is the y value of a point
 * @param {number} cx is the x value of the circle origin
 * @param {number} cy ''
 * @param {number} r is the radius of the circle
 */
var collidePointWithCircle = function(px, py, cx, cy, r) {
	var result = false;
	//get distance between point and circle with pythagorean theroem
	var dist = distance({x: px, y: py}, {x: cx, y: cy});
	//if distance is less than r, than there is a collision
	if (dist <= r) {
		result = true;
	}
	return result;

}

/**
 * This function will calculate if there is a collision on the line segment
 * and will also give the point of intersection.
 * @param {number} x1 Line 1 Endpoint 1 x cord
 * @param {number} y1 ''
 * @param {number} x2 Line 1 Endpoint 2 x cord
 * @param {number} y2 ''
 * @param {number} x3 Line 2 Endpoint 1 x cord
 * @param {number} y3 ''
 * @param {number} x4 Line 2 Endpoint 2 x cord
 * @param {number} y4 ''
 * @return object {collides: boolean, x: intersectionX, y: intersectionY}
 */
var collideLineWithLine = function(x1, y1, x2, y2, x3, y3, x4, y4) {
	var result = {collides: false, x: 0, y: 0};
	//calculate the distance to the intersection point
	var uA = ((x4  -x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
	var uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

	// if uA and uB is between 0-1, then the lines collide.
	if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
		//intersection points
		var intX = x1 + (uA * (x2 - x1));
		var intY = y1 + (uA * (y2 - y1));
		result.collides = true;
		result.x = intX;
		result.y = intY;
	}
	return result;

}
var collideLineWithLineHelper = function(line1, line2) {
	return collideLineWithLine(line1.p1.x, line1.p1.y, line1.p2.x, line1.p2.y, line2.p1.x, line2.p1.y, line2.p2.x, line2.p2.y).collides;
}

/**
 * This function will return a boolean if the line segment collides with 
 * the rectangle
 * @param {number} x1 is an endpoint 1x cord
 * @param {number} y1 ''
 * @param {number} x2 is endpoint 2 line segment x cord
 * @param {number} y2 ''
 * @param {number} rx rectangle x cordinate (top left)
 * @param {number} ry rectangle y cordinate (top left)
 * @param {number} rw rectangle width
 * @param {number} rh rectangle height
 */
var collideLineWithRectangle = function(x1, y1, x2, y2, rx, ry, rw, rh) {
	//check collision of line segment with each side of the rectangle
	var left = collideLineWithLine(x1, y1, x2, y2, rx, ry, rx, ry + rh);
	var right = collideLineWithLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
	var top = collideLineWithLine(x1, y1, x2, y2, rx, ry, rx + rw, ry);
	var bottom = collideLineWithLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);

	return {collides: left.collides || right.collides || top.collides || bottom.collides,
				  left: left,
				  right: right,
				  top: top,
				  bottom: bottom};
}


var findClosestIntersectionOnBox = function(intersections, startOfLine) {
	var minimumLengthBeam = Number.MAX_VALUE;
	var closestIntersection = {};

	if (intersections.left.collides) {
		let length1 = distance(startOfLine, intersections.left);
		if (length1 < minimumLengthBeam) {
			closestIntersection = intersections.left;
			minimumLengthBeam = length1;
		}
	}
	if (intersections.right.collides) {
		let length2 = distance(startOfLine, intersections.right);
		if (length2 < minimumLengthBeam) {
			closestIntersection = intersections.right;
			minimumLengthBeam = length2;
		}
	}
	if (intersections.top.collides) {
		let length3 = distance(startOfLine, intersections.top);
		if (length3 < minimumLengthBeam) {
			closestIntersection = intersections.top;
			minimumLengthBeam = length3;
		}
	}
	if (intersections.bottom.collides) {
		let length4 = distance(startOfLine, intersections.bottom);
		if (length4 < minimumLengthBeam) {
			closestIntersection = intersections.bottom;
			minimumLengthBeam = length4;
		}
	}
	return closestIntersection;
}

/**
 * 
 * @param {number} cx is the center of circle x cord
 * @param {number} cy ''
 * @param {number} cr is the circle radius
 * @param {number} rx is the rectangle x cord
 * @param {number} ry is the top left rectangle y cord
 * @param {number} rw is the width of the rectangle
 * @param {number} rh is the height of the rectangle
 */
var collideCircleWithRectangle = function(cx, cy, cr, rx, ry, rw, rh) {
	var result = false;
	//temp variables to set edges for testing
	var testX = cx;
	var testY = cy;

	//calculate which edge is the closest.
	if (cx < rx) testX = rx; //test left edge
	else if (cx > rx + rw) testX = rx + rw; //test right edge
	if (cy < ry) testY = ry; // test top edge
	else if (cy > ry + rh) testY = ry + rh; //test bottom edge

	//get distance from closest edge
	var dist = distance({x: cx, y: cy}, {x: testX, y: testY});

	//if distance is less than circle radius then there is a collision.
	if (dist <= cr) {
		result = true;
	}
	return result;
}
