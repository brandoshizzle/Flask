/**
 *	Sound functions
 *	These functions deal with anything related to the audio engine
 *	Functions:
 *		registerSound, fildLoaded
 */
const waveforms = require("./waveforms");

/**
 *	@desc:	Checks whether the sound path is valid and registers it with soundJS
 *					Sounds that fail the path check get the soundNotLoaded class
 *	@param:	key: The key that the sound is being registered on (string)
 */
function registerSound(key) {
	// Check if path to sound file exists
	if (fs.existsSync(keyInfo[key].path)) {
		// Register sound with SoundJS
		createjs.Sound.registerSound({
			id: keyInfo[key].name,
			src: keyInfo[key].path
		});
	} else {
		// Let the user know with a toast
		Materialize.toast(keyInfo[key].name + " was NOT loaded.", 4000);
		$("#" + key).parent().addClass("soundNotLoaded");
	}
}

/**
 *	@desc:	Plays a sound, creating a sound instance for it if necessary
 *	@param:	key: The key of the sound to play
 */
function playSound(key) {
	// Check currentInstances to see if the key is playing or not
	if (currentInstances[key] == null) { // if it doesn't exist, it's not playing
		currentInstances[key] = createjs.Sound.play(keyInfo[key].name);
		waveforms.track(key);
	} else if (currentInstances[key].playState == 'playSucceeded') {
		// It is playing, so stop it
		currentInstances[key].stop();
	} else {
		// It is not playing and does exist. Play it.
		currentInstances[key].play();
		waveforms.track(key);
	}
}

/**
 *	@desc:	Plays a sound, creating a sound instance for it if necessary
 *	@param:	key: The key of the sound to play
 */
function getDuration(key) {
	// Check currentInstances to see if an instance has been created
	if (currentInstances[key] == null) {
		currentInstances[key] = createjs.Sound.createInstance(keyInfo[key].name);
	}
	return Math.floor(currentInstances[key].duration / 1000);
}

/**
 *	@desc:	Fired when a song has been preloaded by soundJS
 *	@param:	song: The registered soundJS object (!!not keyInfo!!)
 *								aka, song.id = song name, not key letter
 */
function fileLoaded(song) {
	// A sound has been preloaded.
	//console.log("Preloaded:", song.id);
}

module.exports = {
	register: registerSound,
	fileLoaded: fileLoaded,
	playSound: playSound,
	getDuration: getDuration
}
