var nodeUtil = require('util');
const jetpack = require('fs-jetpack');
const app = require('electron').remote.app;
var appDir = app.getPath('userData');
$(function(){
	jetpack.dir(appDir).dir('data');
});
var dataDir = appDir + '\\data\\';

var lastLoadedId;
var prevTarget = "Q"; // Key clicked previous to the current one - for removing active-key class
var peaks = {};

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
	peaks = JSON.parse(jetpack.read(dataDir + 'peaks.json'));
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
		lastLoadedId = "";
		return;
	}
	var id = soundInfo.id;
	if (id != lastLoadedId) {
		// Remove and re-initialize the waveform region (prevents weird resizing errors)
		$('#waveform-song-name').text(soundInfo.name);
		$('#waveform-region').remove();
		$('#waveform').after('<div id="waveform-region"></div>');
		// Remove and re-initialize waveform (used to)
		soundInfo.fileName = soundInfo.fileName || util.cleanName(soundInfo.path);
		if(peaks.hasOwnProperty(soundInfo.fileName)){
			wavesurfer.empty();
			//Set peaks
			wavesurfer.backend.peaks = peaks[soundInfo.fileName];
			//Draw peaks
			wavesurfer.drawBuffer();
			wavesurfer.fireEvent('ready');
			//wavesurfer.load(soundInfo.path, peaks[soundInfo.fileName]);
		} else {
			wavesurfer.destroy();
			buildWaveform();
			wavesurfer.load(soundInfo.path);
		}

		lastLoadedId = soundInfo.id; // Set the id so we know what was loaded
		$('#waveform-progress').show();
	}

	// When the wavesurfer is loaded
	wavesurfer.on('ready', function() {
		if(!peaks.hasOwnProperty(soundInfo.fileName)){
			console.log('getting the waveform data');
			saveWaveformData(soundInfo);
		}
		//setRegion(soundInfo);
		setRegion(soundInfo); // Resize region to reflect proper size
		var percentComplete = (soundInfo.startTime / waveformedInfo.howl.duration());
		wavesurfer.seekTo(percentComplete); // Move playhead to start time
		// If waveform is clicked, set time to wherever the click occured
		wavesurfer.drawer.on('click', function (e) {
			wavesurfer.on('seek', function (position) {
	    	var currentTime = position * rWSDur();
				var howl = waveformedInfo.howl;
				howl.seek(currentTime);
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
function setWaveformTracking(soundInfo, doNotLoad) {
	var doNotLoad = doNotLoad || false;
	try {
		var playing = soundInfo.howl.playing();
	} catch (e) {
		var playing = false;
	}

	//blog(waveformedInfo.name + ", " + playState);
	if (playing) {
			blog('Tracking on waveform');
			sI = setInterval(trackOnWaveform, 50);
	} else {
			clearInterval(sI);
	}
	if(doNotLoad){
		return;
	}
	loadWavesurfer(soundInfo);
	waveformedInfo = soundInfo;
	if(soundInfo.howl === undefined){
		return;
	}
}

/**
 *	@desc: Moves the playhead to the current time on the waveform
 *	@param: N/A
 */
function trackOnWaveform() {
	if(waveformedInfo.howl !== undefined){
		var percentComplete = Number(waveformedInfo.howl.seek()) / Number(waveformedInfo.howl.duration());
		console.log(percentComplete);
		wavesurfer.seekTo(percentComplete);
	}
}

/**
 *	@desc: 	Takes the left/width of the waveform region and turns them into
 *					start and end times, then stores those times in the proper objects
 *	@param: soundInfo: The sound info object being waveformed
 */
function getRegion() {
	console.log('getting region');
	var start = $('#waveform-region').position().left;
	if (start < 0) {
		start = 0;
	}
	var startTime = (start / $('#waveform').width()) * rWSDur();
	var end = start + $('#waveform-region').width() + 4;	// 4 is magical empirical offset number
	if (end > $('#waveform').width()) {
		end = $('#waveform').width();
	}
	var endTime = (end / $('#waveform').width()) * rWSDur();
	console.log(endTime);
	waveformedInfo.startTime = startTime;
	waveformedInfo.endTime = endTime;
	if (waveformedInfo.infoObj === "key") {
		keyInfo[waveformedInfo.id] = waveformedInfo;
		pagesInfo['page' + currentPage].keyInfo = keyInfo;
		console.log('saving pagesInfo');
		try{
			storage.storeObj('pagesInfo', pagesInfo);
		} catch(err){
			console.log(err);
		}

	} else if (waveformedInfo.infoObj === "playlist") {
		playlistInfo[waveformedInfo.id] = waveformedInfo;
		console.log('saving playlistInfo');
		storage.storeObj('playlistInfo', playlistInfo);
	}
	if(!waveformedInfo.howl.playing()){
		//reloadSound = true;
		waveformedInfo.paused = false;
		waveformedInfo.howl.seek(waveformedInfo.startTime);
	}
	trackOnWaveform();
}

/**
 *	@desc: 	Takes start and end times from the sound info object and turns them
 *					into a physical region
 *	@param: soundInfo: The sound info object being waveformed
 */
function setRegion(soundInfo) {
	console.log('setting region');
	var start = (soundInfo.startTime / waveformedInfo.howl.duration()) * $('#waveform').width();
	var end = (soundInfo.endTime / waveformedInfo.howl.duration()) * $('#waveform').width() - 4;	// 4 is an empirical offset
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

function saveWaveformData(soundInfo){
	// If file name hasn't been assigned, assign it
	if(soundInfo.fileName === ""){
		soundInfo.fileName = util.cleanName(soundInfo.path);
	}

	peaks[soundInfo.fileName] = wavesurfer.backend.getPeaks(200, 0, 199);
	jetpack.writeAsync(dataDir + 'peaks.json', peaks, {
		atomic: true
	});

}

module.exports = {
	load: loadWavesurfer,
	track: setWaveformTracking,
	buildWaveform: buildWaveform,
	getRegion: getRegion,
	reset: reset
};
