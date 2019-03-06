/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/






class Lightning extends Entity {

	constructor(game, startX, startY, target) {
		super(game, startX, startY);
		this.angle = Math.atan2(target.y - startY, target.x - startX);
		this.target = this.findEnemyInPath();
	}

	update() {


	}

	draw() {


	}
	
	findEnemyInPath() {

	}	
}