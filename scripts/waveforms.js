var waveformedInstance;

function loadWavesurfer(key) {
	var path = keyInfo[key].path;
	if (path != lastLoadedPath) {
		wavesurfer.load(path);
		lastLoadedPath = path;
	}
}

function setWaveformTracking(key) {
	loadWavesurfer(key);
	try {
		waveformedInstance = currentInstances[key];
		var playState = waveformedInstance.playState;
		clearInterval(sI);
		if (playState == 'playSucceeded') {
			sI = setInterval(trackOnWaveform, 50);
		}
	} catch (err) {
		console.log("Track is not playing. Waveform will not be tracked.");
	}
}

function trackOnWaveform() {
	var sound = waveformedInstance;
	var percentComplete = sound.position / wavesurfer.getDuration() / 1000;
	wavesurfer.seekTo(percentComplete);
}



module.exports = {
	load: loadWavesurfer,
	track: setWaveformTracking
}
