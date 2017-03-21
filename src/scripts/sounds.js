/*	SOUNDS.JS
 *	These functions deal with anything related to the audio engine
 */
/*jshint esversion: 6 */

var playlistPlayingSoundInfo;
var firstPlaylistSound;
var loadedCount = 0;

/**
 *	@desc:	Checks whether the sound path is valid and registers it with soundJS
 *					Sounds that fail the path check get the soundNotLoaded class
 *	@param:	soundInfo: Object containing info related to the sound object
 */
function registerSound(soundInfo) {
	// Check if path to sound file exists
	if (fs.existsSync(soundInfo.path)) {
		// Register sound with Howler
		soundInfo.howl = new Howl({
		  src: [soundInfo.path],
		  loop: soundInfo.loop,
			html5: true,
		  onend: function() {
		    console.log('Finished!');
				stop(soundInfo);
		  },
			onload: function(){
				console.log('Loaded ' + soundInfo.name);
				soundInfo.endTime = soundInfo.howl.duration();
			},
			onplay: function(){
				soundInfo.howl.fade(0, 1, 2000);
				soundInfo.paused = false;
			},
			onpause: function(){
				soundInfo.paused = true;
			},
			onstop: function(){
				soundInfo.paused = false;
			}
		});
	} else {
		// Let the user know with a toast
		Materialize.toast(soundInfo.name + " was not found.", 3000);
		$("#" + soundInfo.id).addClass("soundNotLoaded");
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
	if(settingsInfo.general.stopSounds === true){
		//soundInfo.soundInstance.paused = false;
	}
	// Check currentInstances to see if the key is playing or not
	// REMOVED IN V0.3.0
	/*if (soundInfo.soundInstance === undefined) { // in case it doesn't exist
		blog('Creating and playing new instance.');
		play();
		// Song is currently playing - stop it.
	} else */ if (soundInfo.howl.playing() /*&& !soundInfo.paused === false*/) {
		stop(soundInfo);
		// Song is not playing, so play it.
	} else {
		blog('Song started');
		//var ppc = setPPC(soundInfo); // Set play properties
		play();
	}

	function play() {
		if(soundInfo.infoObj === 'playlist'){
			if(playlistPlayingSoundInfo !== undefined){
				stop(playlistPlayingSoundInfo);
				return;
			}
			playlistPlayingSoundInfo = soundInfo;
		}
		// Sound is not paused, play it
		soundInfo.howl.play();
		//reloadSound = false;
		waveforms.track(soundInfo);
		//console.log(soundInfo.howl);
		$('#' + soundInfo.id).removeClass('played');
		$('#' + soundInfo.id).addClass('playing-sound');
	}

	function stop(soundInfoToStop){
		if(settingsInfo.general.stopSounds === false){
			soundInfoToStop.howl.pause();
		} else {
			soundInfoToStop.howl.stop();
		}
		waveforms.track(soundInfo);
		$('#' + soundInfoToStop.id).removeClass('playing-sound');
		$('#' + soundInfoToStop.id).addClass('played');
		// If the song is stopped in the playlist
		if (soundInfoToStop.infoObj === "playlist") {
			playlistPlayingSoundInfo = undefined;
			if(settingsInfo.playlist.soundDeleteAfterPlay){
				delete playlistInfo[soundInfoToStop.id];
				$("#" + soundInfoToStop.id).remove();
				storage.storeObj("playlistInfo", playlistInfo);
			}	else if(settingsInfo.playlist.soundToBottomAfterPlay){
				$('#' + soundInfoToStop.id).appendTo('#playlist-songs');
				$('#' + soundInfoToStop.id).css('background-color', 'var(--bgL)');
				firstPlaylistSound = playlist.getFirstPlaylistItem();
				$('#' + firstPlaylistSound).css('background-color', 'var(--aM)');
			}
			$('#' + firstPlaylistSound).click();
		}
	}
}

/**
 *	@desc:	Sets the play properties (PPC) for a song aboult to play
 *	@param:	soundInfo: Object containing all sound information
 */
function setPPC(soundInfo) {
	var loopIt = 0;
	var durationTime = (soundInfo.endTime - soundInfo.startTime) * 1000;
	if (soundInfo.loop) {
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
	return (soundInfo.howl.duration() / 1000).toFixed(2);
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
	} else{
		for (var page in pagesInfo){
			if(pagesInfo[page].keyInfo.hasOwnProperty(sound.id)) {
	 			infoArray = pagesInfo[page].keyInfo;
			}
		}
	}
	//infoArray[sound.id].soundInstance = createjs.Sound.createInstance(sound.id);
	//infoArray[sound.id].soundInstance.playState = null; // Reset to nothing (solved some problems)
	if (infoArray[sound.id].endTime === 0 || infoArray[sound.id].endTime === null) {
		infoArray[sound.id].endTime = getDuration(infoArray[sound.id]);
	}
	loadedCount++;
	var loadedPercent = (loadedCount/totalNumSounds)*100 + "%";
	//console.log(loadedPercent);
	$('#loadedCount').width(loadedPercent);
	if(loadedCount === totalNumSounds){
		$('#loadedContainer').css('display', 'none');
	}
}

module.exports = {
	register: registerSound,
	fileLoaded: fileLoaded,
	playSound: playSound,
	getDuration: getDuration
};
