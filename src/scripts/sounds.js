/**
 *	Sound functions
 *	These functions deal with anything related to the audio engine
 *	Functions:
 *		registerSound, fildLoaded
 */
/*jshint esversion: 6 */
const waveforms = require("./waveforms");

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
	if (soundInfo.soundInstance === undefined) { // if it doesn't exist, it's not playing
		blog('Creating and playing new instance.');
		play();
	} else if (soundInfo.soundInstance.playState == 'playSucceeded') {
		// It is playing, so stop it
		blog('Song stopped');
		soundInfo.soundInstance.stop();
		$('#' + soundInfo.id).removeClass('playing-sound');
	} else {
		// It is not playing and does exist. Play it.
		play();
	}

	function play() {
		soundInfo.soundInstance = createjs.Sound.play(soundInfo.id, ppc);
		waveforms.track(soundInfo);
		$('#' + soundInfo.id).addClass('playing-sound');
	}
}

function setPPC(soundInfo) {
	var loopIt = 0;
	if (soundInfo.endTime === null) {
		soundInfo.endTime = getDuration(soundInfo);
	}
	var durationTime = (soundInfo.endTime - soundInfo.startTime) * 1000;
	if (soundInfo.loop === true) {
		loopIt = -1;
	}
	return new createjs.PlayPropsConfig().set({
		loop: loopIt,
		startTime: soundInfo.startTime * 1000,
		duration: durationTime,
		volume: 1
	});
}

/**
 *	@desc:	Plays a sound, creating a sound instance for it if necessary
 *	@param:	soundInfo: The soundInfo object
 */
function getDuration(soundInfo) {
	// Assumes a sound instance exists - should be true (fingers crossed)
	return (soundInfo.soundInstance.duration / 1000).toFixed(2);
}

/**
 *	@desc:	Fired when a song has been preloaded by soundJS
 *	@param:	song: The registered soundJS object (!!not keyInfo!!)
 *								aka, song.id = song name, not key letter
 */
function fileLoaded(song) {
	// A sound has been preloaded.
	//console.log("Preloaded:", song.id);
	var infoArray;
	if (playlistInfo.hasOwnProperty(song.id)) {
		infoArray = playlistInfo;
	} else if (keyInfo.hasOwnProperty(song.id)) {
		infoArray = keyInfo;
	}
	if (infoArray[song.id].endTime == 0 || infoArray[song.id].endTime === null) {
		infoArray[song.id].soundInstance = createjs.Sound.createInstance(song.id);
		infoArray[song.id].endTime = getDuration(infoArray[song.id]);
	}
}

module.exports = {
	register: registerSound,
	fileLoaded: fileLoaded,
	playSound: playSound,
	getDuration: getDuration
};
