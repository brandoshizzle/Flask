var waveformedInfo;
var lastLoadedPath;
var prevTarget = "Q"; // Key clicked previous to the current one - for removing active-key class

// Wavesurfer measures in seconds
// soundInstance measures in milliseconds

function buildWaveform() {
	// Create wavesurfer instance
	wavesurfer = WaveSurfer.create({
		container: '#waveform',
		waveColor: '#ffeb3b',
		progressColor: '#ffd600',
		hideScrollbar: true,
		interact: false
	});
	wavesurfer.empty();

	wavesurfer.on('ready', function() {
		$('#waveform-progress').hide();
		var timeline = Object.create(WaveSurfer.Timeline);
		timeline.init({
			wavesurfer: wavesurfer,
			container: '#waveform-timeline'
		});
	});


}

function loadWavesurfer(soundInfo) {
	var path = soundInfo.path;
	$('#waveform-song-name').text(soundInfo.name);
	if (path != lastLoadedPath) {
		//wavesurfer.destroy();
		//buildWaveform();
		wavesurfer.load(path);
		lastLoadedPath = path;
		$('#waveform-progress').show();
	}
	wavesurfer.on('ready', function() {
		setRegion(soundInfo);
		var percentComplete = (soundInfo.startTime / wavesurfer.getDuration());
		wavesurfer.seekTo(percentComplete);
	});
	$('#' + prevTarget).removeClass('waveformed-key');
	$('#' + soundInfo.id).addClass('waveformed-key');
	prevTarget = soundInfo.id;
}

function setWaveformTracking(soundInfo) {
	loadWavesurfer(soundInfo);
	wavesurfer.on('ready', function() {
		waveformedInfo = soundInfo;
		var playState = waveformedInfo.soundInstance.playState;
		blog(waveformedInfo.name + ", " + playState);
		if (playState === null) {
			clearInterval(sI);
			blog("Track is not playing. Waveform will not be tracked.");
		} else if (playState === 'playSucceeded') {
			blog('Tracking on waveform');
			sI = setInterval(trackOnWaveform, 50);
		} else if (playState === 'playFinished') {
			waveformedInfo.soundInstance.playState = null;
		}
	});

}

function trackOnWaveform() {
	var sound = waveformedInfo.soundInstance;
	var percentComplete = ((Number(sound.position) / 1000) + Number(waveformedInfo.startTime)) / Number(wavesurfer.getDuration());
	//blog(percentComplete);
	wavesurfer.seekTo(percentComplete);
}

function getRegion() {
	var start = $('#waveform-region').position().left;
	var startTime = (start / $('#waveform').width()) * wavesurfer.getDuration();
	var end = start + $('#waveform-region').width();
	var endTime = (end / $('#waveform').width()) * wavesurfer.getDuration();
	waveformedInfo.startTime = startTime;
	waveformedInfo.endTime = endTime;
	if (keyInfo.hasOwnProperty(waveformedInfo.id)) {
		keyInfo[waveformedInfo.id] = waveformedInfo;
		storage.storeObj('keyInfo', keyInfo);
	} else if (playlistInfo.hasOwnProperty(waveformedInfo.id)) {
		playlistInfo[waveformedInfo.id] = waveformedInfo;
		storage.storeObj('playlistInfo', playlistInfo);
	}
	trackOnWaveform();
}

function setRegion(soundInfo) {
	var start = (soundInfo.startTime / wavesurfer.getDuration()) * $('#waveform').width();
	var end = (soundInfo.endTime / wavesurfer.getDuration()) * $('#waveform').width();
	$('#waveform-region').css('left', start);
	$('#waveform-region').width(end - start);
	//soundInfo.soundInstance.position = 0;
}

module.exports = {
	load: loadWavesurfer,
	track: setWaveformTracking,
	buildWaveform: buildWaveform,
	getRegion: getRegion
};
