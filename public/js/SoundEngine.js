
console.log('in music');

//todo not linked up yet
// document.getElementById("playPause").onclick( () => {
//   console.log('clicked');
//   if(sound.playing()) {
//     sound.pause();
//   } else {
//     sound.play();
//   }
// });

class SoundEngine {
	constructor() {
		this.backgroundMusic = new Howl({
			src: ['sound/kashyyyk.mp3'],
    		loop: true,
			volume: 2,
			autoplay: true,
			preload: true
		});
		this.laserShoot = new Howl({
            src: ['sound/retro-shot-blaster.wav'],
			loop: false,
			volume: .2,
		});
		this.droidExplode = new Howl({
            src: ['sound/BoomBoom.mp3'],
			loop: false,
			volume: .4,
		});
	}

	unPause() {
		this.backgroundMusic.play();
	}
	pause() {
		this.backgroundMusic.pause();
	}

}


// /*
//  * Allows entities to not manage their own sounds
//  */
// class SoundEngine {

// 	constructor(game) {
// 		this.game = game;
// 		this.soundCache = {};
// 		this.prepareSounds();

// 	}

// 	loopTrack(track) {

// 	}

// 	prepareSounds() {

// 	}

// 	playLaserShoot() {

// 	}

// 	playLaserDeflected() {

// 	}

// 	playLightsaberOn() {

// 	}

// 	playLightsaberOff() {
		
// 	}

// 	playDiedSound() {

// 	}

// 	playExplosion1() {

// 	}

// 	playSaberSwish() {

// 	}
// }