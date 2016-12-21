/**
 *	Event functions
 * These functions handle all events - mouse clicks, key presses, etc
 * Functions:
 *		setKeyEvents
 */
// Required js scripts
const waveforms = require("./waveforms");

var prevClickedKey = "Q"; // Key clicked previous to the current one - for removing active-key class

/**
 *	@desc:	Sets all the events related to the keyboard keys
 *	@param:	keys: An array of all the key objects
 */
function setKeyEvents() {
	// Handles when a file is dropped on a key
	keys.on('drop', function(e) {
		e.originalEvent.preventDefault(); // Prevent default action
		for (let f of e.originalEvent.dataTransfer.files) {
			// grab the id of the target key
			var key = e.target.id;
			util.checkKeyInfo(key);
			// write file info to array for later
			keyInfo[key].name = util.cleanName(f.name);
			keyInfo[key].path = f.path;
			$("#" + key).text(keyInfo[key].name);
			sounds.register(key);
			util.storeObj("keyInfo", keyInfo);
			waveforms.load(key);
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

	// Click to show audio waveform and set .clicked-key class
	keys.on('click', function(e) {
		var key = e.target.id;
		$('#' + prevClickedKey).removeClass('clicked-key');
		$('#' + key).addClass('clicked-key');
		prevClickedKey = key;
		if (keyInfo.hasOwnProperty(key)) {
			waveforms.track(key);
		}
	});

	// Right click to bring up settings and populate them
	keys.on('contextmenu', function(e) {
		var key = e.target.id;
		view.openSoundSettings(key);
		waveforms.load(key);
	});

	// Handles pressing a real key anywhere on the page
	$(document).keydown(function(e) {
		// If keys A-Z have been pressed
		if (e.which > 64 && e.which < 91) {
			var key = keyboardMap[e.which];
			// Check if the sound was loaded or not
			if (!$("#" + key).parent().hasClass('soundNotLoaded')) {
				// Check currentInstances to see if the key is playing or not
				if (currentInstances[key] == null) { // if it doesn't exist, it's not playing
					currentInstances[key] = createjs.Sound.play(keyInfo[key].name);
					waveforms.track(key);
				} else if (currentInstances[key].playState == 'playSucceeded') {
					// It is playing, so stop it
					currentInstances[key].stop();
				} else {
					// It is not playing and does exist. Play it.
					currentInstances[key].play();
					waveforms.track(key);
				}

			} else { // User tries to play a not-loaded sound
				Materialize.toast(keyInfo[key].name + " is not loaded.", 1500)
			}
			// User presses the delete key
		} else if (e.which == 46) {
			var key = $('.clicked-key')[0].id;
			delete keyInfo[key];
			$("#" + key).text("");
			util.storeObj("keyInfo", keyInfo);
		}
	});

	// Prevent Dragging files onto main window
	$(document).on('drop', function(e) {
		e.preventDefault();
		return false;
	});
	$(document).on('dragover', function(e) {
		e.preventDefault();
		return false;
	});
}

module.exports = {
	setKeyEvents: setKeyEvents
}
