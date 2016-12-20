/**
 *	Sound functions
 *	These functions deal with anything related to the audio engine
 *	Functions:
 *		registerSound, fildLoaded
 */

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
	fileLoaded: fileLoaded
}
