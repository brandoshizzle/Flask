const waveforms = require("./waveforms");
const util = require("./util");

function setKeyEvents() {

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

	// Click to show audio waveform
	keys.on('click', function(e) {
		var key = e.target.id;
		util.checkKeyInfo(key);
		waveforms.track(key);
	});
};

/**
 * Handle keyboard presses to trigger sounds
 **/
$(document).keydown(function(e) {
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

module.exports = {
	setKeyEvents: setKeyEvents
}
