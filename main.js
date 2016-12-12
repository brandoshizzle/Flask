var wavesurfer;
var keys = $('.btn-key');
var keyInfo = {};

function init() {
	// Create wavesurfer instance
	wavesurfer = WaveSurfer.create({
		container: '#waveform',
		waveColor: 'blue',
		progressColor: 'purple',
	});
	wavesurfer.empty();
}
/**
 * Click on button to play/pause audio
 **/
keys.on('click', function(e) {
	var key = e.target.id;
	checkKeyInfo(key);
	wavesurfer.load(keyInfo[key].path);
	//wavesurfer.playPause();
});

keys.keydown(function(e) {
	var key = e.target.id;
	wavesurfer.load(keyInfo[key].path);
	wavesurfer.play();
});

/********************************
 * Drag and Drop Audio onto keys
 *******************************/
keys.on('dragover', function(e) {
	//$('#' + e.target.id).css("box-shadow", "0px 0px 26px 9px rgba(255,247,99,1)");
	return false;
});
keys.on('dragleave', function() {
	//$('#' + e.target.id).css("box-shadow", "0px 0px");
	return false;
});
keys.on('drop', function(e) {
	e.originalEvent.preventDefault(); // Prevent default action
	for (let f of e.originalEvent.dataTransfer.files) {
		// grab the id of the target key
		var key = e.target.id;
		checkKeyInfo(key);
		// write file info to array for later
		keyInfo[key].name = f.name;
		keyInfo[key].path = f.path;
		document.getElementById(key).textContent = keyInfo[key].name;
		wavesurfer.load(keyInfo[key].path);
	};
	return false;
});

/**
 * Prevent dragging files onto page
 **/
$(document).on('drop', function(e) {
	e.preventDefault();
	return false;
});
$(document).on('dragover', function(e) {
	e.preventDefault();
	return false;
});

function checkKeyInfo(key) {
	try { // test whether the key exists in the info array
		var test = keyInfo[key].name;
	} catch (err) { // if it doesn't, create it with empty variables
		keyInfo[key] = {
			"name": "",
			"path": ""
		}
	}
}
