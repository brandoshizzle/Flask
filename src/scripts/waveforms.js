var waveformedInstance;
var waveformedInfo;
var waveformTracking = false;
var lastLoadedPath;
var startTime;
var duration;
var prevTarget = "Q"; // Key clicked previous to the current one - for removing active-key class
var region;

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
		wavesurfer.load(path);
		lastLoadedPath = path;
		$('#waveform-progress').show();
	}
	wavesurfer.on('ready', function() {
		/* Create the playable region
		wavesurfer.clearRegions();
		region = wavesurfer.addRegion({
			start: soundInfo.startTime, // time in seconds
			end: soundInfo.endTime, // time in seconds
			loop: soundInfo.loop,
			drag: false,
			color: 'rgba(255,255,255,0.1)'
		});

		region.on('update-end', function() {
			soundInfo.startTime = region.start;
			soundInfo.endTime = region.end;
			wavesurfer.clearRegions();
			region = wavesurfer.addRegion({
				start: soundInfo.startTime, // time in seconds
				end: soundInfo.endTime, // time in seconds
				loop: soundInfo.loop,
				drag: false,
				color: 'rgba(255,255,255,0.1)'
			});
			blog(soundInfo.startTime);
			trackOnWaveform();
		});*/
		var percentComplete = (soundInfo.startTime / wavesurfer.getDuration());
		wavesurfer.seekTo(percentComplete);
	});
	$('#' + prevTarget).removeClass('waveformed-key');
	$('#' + soundInfo.id).addClass('waveformed-key');
	prevTarget = soundInfo.id;
}

function setWaveformTracking(soundInfo) {
	loadWavesurfer(soundInfo);
	try {
		waveformedInfo = soundInfo;
		waveformedInstance = waveformedInfo.soundInstance;
		var playState = waveformedInstance.playState;
		clearInterval(sI);
		if (playState == 'playSucceeded') {
			sI = setInterval(trackOnWaveform, 50);
		}
	} catch (err) {
		blog("Track is not playing. Waveform will not be tracked.");
	}
}

function trackOnWaveform() {
	var sound = waveformedInstance;
	var percentComplete = (sound.position / 1000 + waveformedInfo.startTime) / wavesurfer.getDuration();
	blog(waveformedInstance.endTime);
	wavesurfer.seekTo(percentComplete);
}

function getRegion() {
	var start = $('#waveform-region').position().left;
	var startTime = (start / $('#waveform').width()) * wavesurfer.getDuration();
	var end = start + $('#waveform-region').width();
	var endTime = (end / $('#waveform').width()) * wavesurfer.getDuration();
	blog(startTime);
	waveformedInfo.startTime = startTime;
	waveformedInfo.endTime = endTime;
	trackOnWaveform();
}

module.exports = {
	load: loadWavesurfer,
	track: setWaveformTracking,
	buildWaveform: buildWaveform,
	getRegion: getRegion
};
