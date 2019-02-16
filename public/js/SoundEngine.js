// Constant array to hold the different background music
const backgroundMusicArray = [];
backgroundMusicArray['kashyyyk'] = new Howl({
	src: [
		"sound/kashyyykTheme.ogg",
		"sound/kashyyykTheme.m4a",
		"sound/kashyyykTheme.mp3",
		"sound/kashyyykTheme.ac3"
	  ],
	loop: true,
	volume: 2,
	// autoplay: true,
	// preload: true
});
backgroundMusicArray['yodaForceTheme'] = new Howl({
	src: [
		"sound/yodaForceTheme.ogg",
		"sound/yodaForceTheme.m4a",
		"sound/yodaForceTheme.mp3",
		"sound/yodaForceTheme.ac3"
	  ],
	loop: true,
	volume: 2,
	// autoplay: true,
	// preload: true
});
backgroundMusicArray['yodaTheme'] = new Howl({
	src: [
		"sound/yodaTheme.ogg",
		"sound/yodaTheme.m4a",
		"sound/yodaTheme.mp3",
		"sound/yodaTheme.ac3"
	  ],
	loop: true,
	autoplay: true,
	preload: true
});
backgroundMusicArray['clashOfLightsabersTheme'] = new Howl({
	src: [
		"sound/clashOfLightsabersTheme.ogg",
		"sound/clashOfLightsabersTheme.m4a",
		"sound/clashOfLightsabersTheme.mp3",
		"sound/clashOfLightsabersTheme.ac3"
	  ],
	loop: true,
	volume: 2,
	// autoplay: true,
	// preload: true
});

/**
 *
 */
class SoundEngine {
	constructor(game) {
		this.gameEngine = game;
		//set to yodaTheme by default
		this.backgroundMusic = backgroundMusicArray['yodaTheme'];
		this.backgroundMusic.volume = 1;

		this.lightsaber = new Howl({
			src: [
			  "sound/lightSaber.ogg",
			  "sound/lightSaber.m4a",
			  "sound/lightSaber.mp3",
			  "sound/lightSaber.ac3"
			],
			"sprite": {
			  "lightsaberHit": [
				0,
				1280
			  ],
			  "lightsaberSwing": [
				3000,
				705.3061224489796
			  ],
			  "lightsaberOn": [
				5000,
				1081.9047619047622
			  ],
			  "lightsaberOff": [
				8000,
				626.0317460317459
			  ]
			},
			loop: false,
			volume: .07
		  });

		  this.item = new Howl({
			src: [
			  "sound/item.ogg",
			  "sound/item.m4a",
			  "sound/item.mp3",
			  "sound/item.ac3"
			],
			"sprite": {
			  "pickupHeartItem": [
				0,
				224.7619047619048
			  ],
			  "itemPowerdown": [
				2000,
				712.3809523809523
			  ],
			  "itemPowerup": [
				4000,
				567.6190476190479
			  ]
			},
			loop: false,
			volume: .1
		  });

		  this.hero = new Howl({
			src: [
			  "sound/hero.ogg",
			  "sound/hero.m4a",
			  "sound/hero.mp3",
			  "sound/hero.ac3"
			],
			"sprite": {
			  "heroHurt": [
				0,
				318.73015873015873
			  ],
			  "forceJump": [
				2000,
				1141.5873015873012
			  ],
			  "heroDeath": [
				5000,
				769.5238095238093
			  ],
			  "heroWalk": [
				7000,
				133.33333333333374
			  ]
			},
			volume: .3
		  });

		  this.enemy = new Howl({
			src: [
			  "sound/enemy.ogg",
			  "sound/enemy.m4a",
			  "sound/enemy.mp3",
			  "sound/enemy.ac3"
			],
			"sprite": {
			  "bowcasterShoot": [
				0,
				759.3650793650794
			  ],
			  "powerfulBlaster": [
				2000,
				772.0634920634924
			  ],
			  "retroBlasterShot": [
				4000,
				2041.8367346938774
			  ],
			  "rubbleExplosion": [
				8000,
				2483.809523809523
			  ],
			  "explosionBoomBoom": [
				12000,
				1717.1201814058961
			  ],
			  "largeExplosion": [
				15000,
				2605.714285714285
			  ]
			},
			loop: false,
			volume: .1
		  });
		  this.beam = new Howl({
			src: [
			  "sound/beam2.wav"
			],
			loop: true,
			volume: .1
		  });
		  this.saberHum = new Howl({
			src: [
			  "sound/saber humming.wav"
			],
			loop: true,
			volume: .12
		  });
		  this.wound = new Howl({
			src: [
			  "sound/tissue-wound.wav"
			],
			loop: false,
			volume: .15
		  });
		  this.sizzle = new Howl({
			src: [
			  "sound/butter sizzling.wav"
			],
			loop: true,
			volume: .5
		  });

	}

	//pauseBackgroundMusic, unpauseBackgroundMusic
	unpauseBackgroundMusic() {
		this.backgroundMusic.play();
	}
	pauseBackgroundMusic() {
		this.backgroundMusic.pause();
	}

	//add methods to mute and unmute sound effects
	muteSoundFX() {
		//mute these not pause them
		// this.lightsaber.pause();
		// this.item.pause();
		// this.hero.pause();
		// this.enemy.pause();
	}
	unMuteSoundFX() {

	}

	//method to changeout background music
	switchBackgroundMusic(keyOfBackgroundMusicArray) {
		this.backgroundMusic = backgroundMusicArray[keyOfBackgroundMusicArray];
	}
}
