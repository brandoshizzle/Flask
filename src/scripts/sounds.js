/*	SOUNDS.JS
 *	These functions deal with anything related to the audio engine
 */
/*jshint esversion: 6 */

/**
 *	@desc:	Checks whether the sound path is valid and registers it with soundJS
 *					Sounds that fail the path check get the soundNotLoaded class
 *	@param:	soundInfo: Object containing info related to the sound object
 */
function registerSound(soundInfo) {
	// Check if path to sound file exists
	if (fs.existsSync(soundInfo.path)) {
		// Register sound with SoundJS
		createjs.Sound.registerSound({
			id: soundInfo.id,
			src: soundInfo.path
		});
	} else {
		// Let the user know with a toast
		Materialize.toast(soundInfo.name + " was NOT loaded.", 4000);
		$("#" + soundInfo.id).parent().addClass("soundNotLoaded");
	}
}

/**
 *	@desc:	Plays a sound, creating a sound instance for it if necessary
 *	@param:	soundInfo: Object containing all sound information
 */
function playSound(soundInfo) {
	if (soundInfo.endTime == "0.00") {
		soundInfo.endTime = sounds.getDuration(soundInfo);
	}
	var ppc = setPPC(soundInfo); // Set play properties
	// Check currentInstances to see if the key is playing or not
	if (soundInfo.soundInstance === undefined) { // in case it doesn't exist
		blog('Creating and playing new instance.');
		$('#' + soundInfo.id).removeClass('played');
		play();
		// Song is currently playing - stop it.
	} else if (soundInfo.soundInstance.playState == 'playSucceeded') {
		blog('Song stopped');
		soundInfo.soundInstance.stop();
		$('#' + soundInfo.id).removeClass('playing-sound');
		$('#' + soundInfo.id).addClass('played');
		if (playlistInfo.hasOwnProperty(soundInfo.id)) {
			$('#playlist-songs li:first-child').appendTo('#playlist-songs');
		}
		// Song is not playing, so play it.
	} else {
		blog('Song started');
		$('#' + soundInfo.id).removeClass('played');
		play();
	}

	function play() {
		soundInfo.soundInstance = createjs.Sound.play(soundInfo.id, ppc);
		blog('sounds.play');
		waveforms.track(soundInfo);
		$('#' + soundInfo.id).addClass('playing-sound');
	}
}

/**
 *	@desc:	Sets the play properties (PPC) for a song aboult to play
 *	@param:	soundInfo: Object containing all sound information
 */
function setPPC(soundInfo) {
	var loopIt = 0;
	var durationTime = (soundInfo.endTime - soundInfo.startTime) * 1000;
	if (soundInfo.loop === true) {
		loopIt = -1;
	}
	return new createjs.PlayPropsConfig().set({
		loop: loopIt,
		startTime: (soundInfo.startTime) * 1000,
		duration: durationTime,
		volume: 1
	});
}

/**
 *	@desc:	Finds the duration of the sound instance in the sound info object
 *	@param:	soundInfo: The soundInfo object
 */
function getDuration(soundInfo) {
	// Assumes a sound instance exists - should be true (fingers crossed)
	return (soundInfo.soundInstance.duration / 1000).toFixed(2);
}

/**
 *	@desc:	Fired when a sound has been preloaded by soundJS.
 *					Figures out which section the sound belongs to, creates an instance,
 						and the duration is found if it has not been already
 *	@param:	sound: The registered soundJS object (!!not keyInfo!!)
 */
function fileLoaded(sound) {
	// A sound has been preloaded.
	//console.log("Preloaded:", sound.id);
	var infoArray;
	if (playlistInfo.hasOwnProperty(sound.id)) {
		infoArray = playlistInfo;
	} else if (keyInfo.hasOwnProperty(sound.id)) {
		infoArray = keyInfo;
	}
	infoArray[sound.id].soundInstance = createjs.Sound.createInstance(sound.id);
	infoArray[sound.id].soundInstance.playState = null; // Reset to nothing (solved some problems)
	if (infoArray[sound.id].endTime === 0 || infoArray[sound.id].endTime === null) {
		infoArray[sound.id].endTime = getDuration(infoArray[sound.id]);
	}
}

module.exports = {
	register: registerSound,
	fileLoaded: fileLoaded,
	playSound: playSound,
	getDuration: getDuration
};
