/**
 *	Event functions
 * These functions handle all events - mouse clicks, key presses, etc
 * Functions:
 *		setKeyEvents
 */
/*jshint esversion: 6 */

// Required js scripts
const waveforms = require("./waveforms");
const soundInfoManager = require("./soundInfoManager");

var settingsInfoObj;

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
			var newSoundInfo = soundInfoManager.createSoundInfoFromPath(f.path, key);
			blog(keyInfo);
			keyInfo[key] = newSoundInfo;
			blog(keyInfo);
			$(e.target).find('.audioName').text(newSoundInfo.name);
			storage.storeObj("keyInfo", keyInfo);
			waveforms.load(newSoundInfo);

		}
		return false;
	});

	keys.on('dragover', function(e) {
		//$('#' + e.target.id).css("box-shadow", "0px 0px 4px 4px rgba(255,247,99,1)");
		return false;
	});
	keys.on('dragleave', function(e) {
		//$('#' + e.target.id).css("box-shadow", "0px 0px");
		return false;
	});

	// File is dropped onto playlist box - register and add info
	$('.playlistBox').on('drop', function(e) {
		e.originalEvent.preventDefault(); // Prevent default action
		for (let f of e.originalEvent.dataTransfer.files) {
			// Create new soundInfo object
			var newSoundInfo = soundInfoManager.createSoundInfoFromPath(f.path);
			playlistInfo[newSoundInfo.id] = newSoundInfo;
			view.createPlaylistItem(newSoundInfo);
			//blog(newSoundInfo);
			storage.storeObj("playlistInfo", playlistInfo);
			waveforms.load(newSoundInfo);
		}
		updatePlaylistClickFunctions();
		return false;
	});

	// Click on keyboard key
	$('.btn-key').on('click', function(e) {
		clickSound(e, keyInfo);
	});

	// apply clicked-key class and show waveform
	function clickSound(e, infoObj) {
		var id = e.target.id;
		if (infoObj.hasOwnProperty(id)) {
			waveforms.track(infoObj[id]);
		}
	}

	// Right click to bring up settings and populate them
	keys.on('contextmenu', function(e) {
		var key = e.target.id;
		settingsInfoObj = keyInfo;
		view.openSoundSettings(keyInfo[key]);
		waveforms.load(keyInfo[key]);
	});

	// Set functions when clicking on playlist sounds
	function updatePlaylistClickFunctions() {
		// Click on playlist sound
		$('.playlistSound').on('click', function(e) {
			clickSound(e, playlistInfo);
		});
		$('#playlist-songs li').on('contextmenu', function(e) {
			var id = e.target.id;
			settingsInfoObj = playlistInfo;
			view.openSoundSettings(playlistInfo[id]);
			waveforms.load(playlistInfo[id]);
		});
	}
	updatePlaylistClickFunctions();

	// Handles pressing a real key anywhere on the page
	$(document).keydown(function(e) {
		var key = keyboardMap[e.which];
		if (e.target == document.body) {
			// If keys A-Z have been pressed
			if (e.which > 64 && e.which < 91) {
				// Check if the sound was loaded or not
				if (!$("#" + key).parent().hasClass('soundNotLoaded')) {
					sounds.playSound(keyInfo[key]);
				} else { // User tries to play a not-loaded sound
					Materialize.toast(keyInfo[key].name + " is not loaded.", 1500);
				}
				// User presses the delete key
			} else if (key == 'DELETE') {
				id = $('.waveformed-key').attr('id');
				delete keyInfo[id];
				blog(id);
				$("#" + id).find('.audioName').text("");
				$("#" + id).css('background-color', 'var(--pM)');
				storage.storeObj("keyInfo", keyInfo);
			} else if (key == 'SPACE') {
				var firstPlaylistSound = $('#playlist-songs li:first-child').attr('id');
				sounds.playSound(playlistInfo[firstPlaylistSound]);
			}
			return false;
		}
	});

	// Close/save sound settings when save key is pressed.
	$('#sound-settings-save').click(function(e) {
		var tempSoundInfo = view.saveSoundSettings();
		var itIsKeyInfo = (settingsInfoObj === keyInfo);
		settingsInfoObj[tempSoundInfo.id] = tempSoundInfo;
		if (itIsKeyInfo) {
			$('#' + tempSoundInfo.id).find('.audioName').text(tempSoundInfo.name);
			storage.storeObj("keyInfo", settingsInfoObj);
		} else {
			$('#' + tempSoundInfo.id).text(tempSoundInfo.name);
			storage.storeObj("playlistInfo", settingsInfoObj);
		}

	});

	// Close/save sound settings when save key is pressed.
	$('#start-time-reset').click(function(e) {
		view.resetStartTime();
	});

	// Close/save sound settings when save key is pressed.
	$('#end-time-reset').click(function(e) {
		view.resetEndTime();
	});

	// Prevent firing sounds when editing input fields
	$('#sound-settings, .input-field').keydown(function(e) {
		e.stopPropagation();
	});

	// Open dialog box when browse button is pressed.
	$('#browse-button').click(function(e) {
		util.openBrowse();
	});

	$("#sound-settings-color-container").click(function(e) {
		var position = $("#sound-settings-color-container").position();
		$("#color-picker").css('top', position.top);
		$("#color-picker").css('left', position.left);
		$("#color-picker").fadeIn();
	});

	$(".color-picker-color").click(function(e) {
		colors.setPickedColor(e.target.id);
		$("#color-picker").fadeOut();
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

	wavesurfer.on('ready', function() {
		$('#waveform-progress').hide();
		var timeline = Object.create(WaveSurfer.Timeline);
		timeline.init({
			wavesurfer: wavesurfer,
			container: '#waveform-timeline'
		});
	});
}

module.exports = {
	setKeyEvents: setKeyEvents
};
