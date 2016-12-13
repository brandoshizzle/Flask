var wavesurfer;
var keys = $('.audioName');
var keyInfo = {};
var lastLoadedPath
var currentInstances = {};

/**
 * Set up program
 **/
$(document).ready(function() {

	createInterface();
	loadSavedSounds();
	createjs.Sound.on("fileload", handleFileLoad);

	/********************************
	 * Drag and Drop Audio onto keys
	 *******************************/
	keys.on('drop', function(e) {
		e.originalEvent.preventDefault(); // Prevent default action

		for (let f of e.originalEvent.dataTransfer.files) {
			// grab the id of the target key
			var key = e.target.id;
			checkKeyInfo(key);
			// write file info to array for later
			keyInfo[key].name = nameCleaner(f.name);
			keyInfo[key].path = f.path;
			$("#" + key).text(keyInfo[key].name);
			registerSound(key);
			keyInfoChange();
			loadWavesurfer(key);
		};
		return false;
	});

	keys.on('dragover', function(e) {
		//$('#' + e.target.id).css("box-shadow", "0px 0px 26px 9px rgba(255,247,99,1)");
		return false;
	});
	keys.on('dragleave', function() {
		//$('#' + e.target.id).css("box-shadow", "0px 0px");
		return false;
	});

	/*
	 * Click to show audio waveform
	 */
	keys.on('click', function(e) {
		var key = e.target.id;
		checkKeyInfo(key);
		loadWavesurfer(key);
		//wavesurfer.playPause();
	});

});

function createInterface() {
	// Create keyboard buttons
	var rows = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '['],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"],
		['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', ]
	];
	for (var i = 0; i < rows.length; i++) {
		var rowNum = i + 1;
		for (var j = 0; j < rows[i].length; j++) {
			$('#row' + rowNum).append("<div class='btn btn-key z-depth-4 waves-effect waves-light'><div class='keyLetter'>" + rows[i][j] + "</div><div id='" + rows[i][j] + "' class='audioName'></div></div>");
		}
	}
	keys = $('.audioName'); // set keys to be an array of the audioName divs

	// Create wavesurfer instance
	wavesurfer = WaveSurfer.create({
		container: '#waveform',
		waveColor: '#ffeb3b',
		progressColor: '#ffd600',
	});
	wavesurfer.empty();
}

/**
 * Handle keyboard presses to trigger sounds
 **/
$(document).keydown(function(e) {
	if (e.which > 64 && e.which < 91) {
		var key = keyboardMap[e.which];

		if (currentInstances[key] == null) {
			currentInstances[key] = createjs.Sound.play(keyInfo[key].name);
		} else if (currentInstances[key].playState == 'playSucceeded') {
			currentInstances[key].stop();
		} else {
			currentInstances[key].play();
		}

		loadWavesurfer(key);
	}
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

/********************************
 * Check Key Info Object
 *******************************/
function checkKeyInfo(key) {
	try { // test whether the key exists in the info array
		var test = keyInfo[key].name;
	} catch (err) { // if it doesn't, create it with empty variables
		keyInfo[key] = {
			"key": key,
			"name": "",
			"path": ""
		}
	}
}

/********************************
 * Loading Audio waveform
 *******************************/
function loadWavesurfer(key) {
	var path = keyInfo[key].path;
	if (path != lastLoadedPath) {
		wavesurfer.load(path);
		lastLoadedPath = path;
	}
}


/********************************
 * Save changes to local storage
 *******************************/
function keyInfoChange() {
	var keyInfoString = JSON.stringify(keyInfo);
	localStorage.setItem("keyInfo", keyInfoString);
	console.log("Stored new settings!");

}

function loadSavedSounds() {
	// Pull keyInfo string from localStorage
	var keyInfoString = localStorage.getItem("keyInfo");
	// Only parse it if it exists!
	if (keyInfoString != null) {
		keyInfo = JSON.parse(keyInfoString);
		console.log(keyInfo);

		Object.keys(keyInfo).map(function(key, index) {
			// Print the name of each sound on it's corresponding key
			$("#" + key).text(keyInfo[key].name);
			// Register sound with SoundJS
			registerSound(key);
		});
	}
}

function handleFileLoad(event) {
	// A sound has been preloaded.
	console.log("Preloaded:", event.id);
}

function nameCleaner(name) {
	var pos = name.lastIndexOf(".");
	return name.substring(0, pos);
}

function registerSound(key) {
	// Register sound with SoundJS
	createjs.Sound.registerSound({
		id: keyInfo[key].name,
		src: keyInfo[key].path
	});
}
