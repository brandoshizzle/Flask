var lastLoadedPath;
var prevTarget = "Q"; // Key clicked previous to the current one - for removing active-key class

// Wavesurfer measures in seconds
// soundInstance measures in milliseconds

/**
 *	@desc: Sets initial waveform properties
 *	@param: N/A
 */
function buildWaveform() {
	// Create wavesurfer instance
	wavesurfer = WaveSurfer.create({
		container: '#waveform',
		waveColor: '#ffeb3b',
		progressColor: '#ffd600',
		hideScrollbar: true
	});
	//wavesurfer.empty();
	// When ready, hide loader and add the timeline
	wavesurfer.on('ready', function() {
		$('#waveform-progress').hide();
		var timeline = Object.create(WaveSurfer.Timeline);
		timeline.init({
			wavesurfer: wavesurfer,
			container: '#waveform-timeline'
		});
	});

}

/**
 *	@desc: Loads a sound instance into the waveform
 *	@param: soundInfo: The sound info object being waveformed
 */
function loadWavesurfer(soundInfo) {
	// Change the target key of the waveform
	$('#' + prevTarget).removeClass('waveformed-key');
	$('#' + soundInfo.id).addClass('waveformed-key');
	prevTarget = soundInfo.id;

	if(soundInfo.path === ""){
		wavesurfer.empty();
		$('#waveform-song-name').text("");
		$('#waveform-region').css('left', 0);
		$('#waveform-region').width($('#waveform').width());
		lastLoadedPath = "";
		return;
	}
	var path = soundInfo.path;
	if (path != lastLoadedPath) {
		// Remove and re-initialize the waveform region (prevents weird resizing errors)
		$('#waveform-song-name').text(soundInfo.name);
		$('#waveform-region').remove();
		$('#waveform').after('<div id="waveform-region"></div>');
		// Remove and re-initialize waveform
		// TODO: figure out DOM error caused by destroying waveform
		// REMOVED IN V0.3.0
		//wavesurfer.destroy();
		//buildWaveform();
		wavesurfer.load(path);
		lastLoadedPath = path; // Set the path so we know what was loaded
		$('#waveform-progress').show();
	}

	// When the wavesurfer is loaded
	wavesurfer.on('ready', function() {
		setRegion(soundInfo);
		// Create an instance if necessary (for region/duration)
		/*if (soundInfo.soundInstance === undefined) {
			soundInfo.soundInstance = createjs.Sound.createInstance(soundInfo.id);
			soundInfo.endTime = sounds.getDuration(soundInfo);
		}*/
		setRegion(soundInfo); // Resize region to reflect proper size
		var percentComplete = (soundInfo.startTime / wavesurfer.getDuration());
		wavesurfer.seekTo(percentComplete); // Move playhead to start time

		// If waveform is clicked, set time to wherever the click occured
		wavesurfer.drawer.on('click', function (e) {
			wavesurfer.on('seek', function (position) {
	    	var currentTime = position * wavesurfer.getDuration() * 1000;
				var howl = waveformedInfo.howl;
				//var currentTime = wavesurfer.getCurrentTime()*1000;
				howl.seek((currentTime - waveformedInfo.startTime)/100);
				console.log(howl.seek());
				wavesurfer.un('seek');
			});

		});
	});
}

/**
 *	@desc: 	Sets up the tracking of the sound instance on the waveform
 *					Loads the waveform, determines whether it should be tracking, then does it
 *	@param: soundInfo: The sound info object being waveformed
 */
function setWaveformTracking(soundInfo) {
	loadWavesurfer(soundInfo);
	waveformedInfo = soundInfo;
	if(soundInfo.howl === undefined){
		return;
	}
	//wavesurfer.on('ready', function() { REMOVED IN V0.2.0
		var playing = waveformedInfo.howl.playing();
		//blog(waveformedInfo.name + ", " + playState);
		if (playing) {
				blog('Tracking on waveform');
				sI = setInterval(trackOnWaveform, 50);
		} else {
				clearInterval(sI);
		}
	//});

}

/**
 *	@desc: Moves the playhead to the current time on the waveform
 *	@param: N/A
 */
function trackOnWaveform() {
	var howl = waveformedInfo.howl;
	var percentComplete = (Number(howl.seek()) + Number(waveformedInfo.startTime)) / Number(wavesurfer.getDuration());
	//blog(percentComplete);
	wavesurfer.seekTo(percentComplete);
}

/**
 *	@desc: 	Takes the left/width of the waveform region and turns them into
 *					start and end times, then stores those times in the proper objects
 *	@param: soundInfo: The sound info object being waveformed
 */
function getRegion() {
	var start = $('#waveform-region').position().left;
	if (start < 0) {
		start = 0;
	}
	var startTime = (start / $('#waveform').width()) * wavesurfer.getDuration();
	var end = start + $('#waveform-region').width();
	if (end > $('#waveform').width()) {
		end = $('#waveform').width();
	}
	var endTime = (end / $('#waveform').width()) * wavesurfer.getDuration();
	waveformedInfo.startTime = startTime;
	waveformedInfo.endTime = endTime;
	if (waveformedInfo.infoObj === "key") {
		keyInfo[waveformedInfo.id] = waveformedInfo;
		pagesInfo['page' + currentPage].keyInfo = keyInfo;
		storage.storeObj('pagesInfo', pagesInfo);
	} else if (waveformedInfo.infoObj === "playlist") {
		playlistInfo[waveformedInfo.id] = waveformedInfo;
		storage.storeObj('playlistInfo', playlistInfo);
	}
	if(!(waveformedInfo.soundInstance.playState === 'playSucceeded' && waveformedInfo.soundInstance.paused === false)){
		reloadSound = true;
		waveformedInfo.soundInstance.position = 0;
	}
	trackOnWaveform();
}

/**
 *	@desc: 	Takes start and end times from the sound info object and turns them
 *					into a physical region
 *	@param: soundInfo: The sound info object being waveformed
 */
function setRegion(soundInfo) {
	var start = (soundInfo.startTime / wavesurfer.getDuration()) * $('#waveform').width();
	var end = (soundInfo.endTime / wavesurfer.getDuration()) * $('#waveform').width();
	$('#waveform-region').css('left', start);
	$('#waveform-region').width(end - start);
}

/**
 *	@desc: 	Resets the waveform region and waveform name
 *	@param: N/A
 */
function reset() {
	wavesurfer.empty();
	$('#waveform-region').remove();
	$('#waveform').after('<div id="waveform-region"></div>');
	$('#waveform-song-name').text("");
}

module.exports = {
	load: loadWavesurfer,
	track: setWaveformTracking,
	buildWaveform: buildWaveform,
	getRegion: getRegion,
	reset: reset
};
