/* EVENTS.JS
 * These functions handle all events - mouse clicks, key presses, etc
 * Functions:
 *		setKeyEvents
 */
/*jshint esversion: 6 */

// Required js scripts
const soundInfoManager = require("./soundInfoManager");

var settingsInfoObj; // Either keyInfo or playlistInfo, whichever has the sound being changed in settings
var specialKeys = ['MINUS', 'EQUALS', 'OPEN_BRACKET', 'CLOSE_BRACKET', 'SEMICOLON', 'QUOTE', 'BACK_SLASH', 'BESIDE_Z', 'COMMA', 'PERIOD', 'SLASH'];
var playlistPlayingSound = {
	id: "",
	playing: false
};
var curVol;

/**
 *	@desc:	Sets all the events related to the keyboard keys
 *	@param:	keys: An array of all the key objects
 */
function setKeyEvents() {

	// Handles when a file is dropped on a key
	keys.on('drop', function(e) {
		e.originalEvent.preventDefault(); // Prevent default action
		try{
			// grab the id of the target key
			var siblingCount = -1;
			var newSoundInfo;
			for (let f of e.originalEvent.dataTransfer.files) {
				var targetKey = $(e.target);
				if(siblingCount > -1){
					if(siblingCount < targetKey.nextAll().length)
					targetKey = $(e.target).nextAll().eq(siblingCount);
				}
				var id = targetKey.attr('id');
				// Create a new sound info object
				newSoundInfo = soundInfoManager.createSoundInfoFromPath(f.path, id);
				// Store the new sound info object in the keyInfo object
				keyInfo[id] = newSoundInfo;
				targetKey.find('.audioName').text(newSoundInfo.name);
				$('#' + id).removeClass('played');
				siblingCount++;
			}
			pages.ensurePageExists(currentPage);
			pagesInfo['page' + currentPage].keyInfo = keyInfo;
			storage.storeObj("pagesInfo", pagesInfo);
			waveforms.load(newSoundInfo);
		}
		catch(err){}

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
			view.createPlaylistItem(newSoundInfo); // Create a new li in the playlist
			waveforms.load(newSoundInfo);
		}
		storage.storeObj("playlistInfo", playlistInfo);
		updatePlaylistClickFunctions(); // Ensure new songs react properly to clicking
		return false;
	});

	// Click on keyboard key
	$('.btn-key').on('click', function(e) {
		clickSound(e, keyInfo);
	});

	// apply clicked-key class and show waveform
	function clickSound(e, infoObj) {
		var id = e.target.id;
		if (!infoObj.hasOwnProperty(id)) {
			infoObj[id] = {}; infoObj[id].id = id;
			storage.checkAgainstDefault(infoObj[id], 'soundInfo');
		}
		waveforms.track(infoObj[id]);
	}

	// Right click to bring up settings and populate them
	keys.on('contextmenu', function(e) {
		var key = e.target.id;
		settingsInfoObj = keyInfo;
		if(keyInfo.hasOwnProperty(key)){
			settings.openSoundSettings(keyInfo[key]);
			waveforms.load(keyInfo[key]);
		}
	});

	// Set functions when clicking on playlist sounds
	function updatePlaylistClickFunctions() {
		// Click on playlist sound -> load waveform
		$('.playlistSound').on('click', function(e) {
			clickSound(e, playlistInfo);
		});
		// Right-click on playlist sound -> open sound settings
		$('#playlist-songs li').on('contextmenu', function(e) {
			var id = e.target.id;
			settingsInfoObj = playlistInfo;
			settings.openSoundSettings(playlistInfo[id]);
			waveforms.load(playlistInfo[id]);
		});
	}
	updatePlaylistClickFunctions();

	// Handles pressing a real key anywhere on the page
	$(document).keydown(function(e) {
		var key = keyboardMap[e.which];
		var code = e.which;

		if(key === 'CONTROL'){
			ctrl = true;
			$('#waveform').css('pointer-events', 'none');
		}

		// only handle keys if they are not being used in an input box, and control is not pressed;
		if (!$(e.target).is('input') && !ctrl) {
			// If keys A-Z or 0-9 have been pressed, or a special key
			if ((code > 64 && code < 91) || (code > 47 && code < 58) || ($.inArray(key, specialKeys) > -1)) {
				// Check if the sound was loaded or not, and if it even exists
				key = 'page' + currentPage + '_' + key;
				if(keyInfo.hasOwnProperty(key)){
					if (!$("#" + key).parent().hasClass('soundNotLoaded')) {
						sounds.playSound(keyInfo[key]);
					} else { // User tries to play a not-loaded sound
						Materialize.toast(keyInfo[key].name + " was not loaded.", 1500);
					}
				}
				// User presses the delete key
			} else if (key === 'DELETE') {
				id = $('.waveformed-key').attr('id');
				// If the deleted sound was in the keys
				if (keyInfo.hasOwnProperty(id)) {
					delete keyInfo[id];
					pagesInfo['page' + currentPage].keyInfo = keyInfo;
					storage.storeObj("pagesInfo", pagesInfo);
					$("#" + id).find('.audioName').text("");
					$("#" + id).removeClass('waveformed-key').removeClass('played');
					$("#" + id).css('background-color', 'var(--pM)');
					$("#" + id).css('box-shadow', '0px 4px 0px 0px var(--pD)');
				} else {
					// The deleted sound was in the playlist
					delete playlistInfo[id];
					$("#" + id).remove();
					storage.storeObj("playlistInfo", playlistInfo);
				}
				//Howler.removeSound(id);
				waveforms.reset();
			} else if (key === 'SPACE') {
				// Play from the playlist
					var soundId;
					// If a sound is playing, make sure to stop it, not play the first one
					if(playlistPlayingSound.playing === true){
						soundId = playlistPlayingSound.id;
						playlistPlayingSound.playing = false;
					} else {	// Get first playlist sound
						soundId = playlist.getFirstPlaylistItem();
						playlistPlayingSound.id = soundId;
						playlistPlayingSound.playing = true;
					}
					sounds.playSound(playlistInfo[soundId]);
			} /*else if(key === 'DOWN'){
				curVol = Howler.volume();
				if(curVol > 0){
					Howler.volume(curVol - 0.05);
					$('#volume').text(Howler.volume());
				}
			} else if(key === 'UP'){
				curVol = Howler.volume();
				if(curVol < 1){
					Howler.volume(curVol - 0.05);
					$('#volume').text(Howler.volume());
				}
			} else if(key === 'LEFT'){
				curVol = Howler.volume();
					if(curVol > 0){
						var sI = setInterval(function(){
							curVol = Howler.volume();
							Howler.volume(curVol -= 0.01);
							$('#volume').text(Howler.volume());
							if(Howler.volume() === 0){
								clearInterval(sI);
							}
						}, 25);
				}
			} else if(key === 'RIGHT'){
					curVol = Howler.volume();
					if(Howler.volume() < 1){
						var sI = setInterval(function(){
							curVol = Howler.volume();
							Howler.volume(curVol + 0.01);
							$('#volume').text(Howler.volume());
							if(Howler.volume() === 1){
								clearInterval(sI);
							}
						}, 25);
				}
			}*/

		}

		// CONTROL FUNCTIONS NOT IN INPUTS
		/*
		if (!$(e.target).is('input') && ctrl) {
			if(key === 'C'){
				util.copyKey(waveformedInfo);
			} else if (key === 'X') {
				util.cutKey(waveformedInfo);
			} else if (key === 'V') {
				util.pasteKey(waveformedInfo);
			}
		} */

		Mousetrap.bind(['command+x', 'ctrl+x'], function() {
			if(!$(e.target).is('input')){
				util.cutKey(waveformedInfo);
				return false;
			}
		});
		Mousetrap.bind(['command+c', 'ctrl+c'], function() {
			if(!$(e.target).is('input')){
				util.copyKey(waveformedInfo);
				return false;
			}
		});
		Mousetrap.bind(['command+v', 'ctrl+v'], function() {
			if(!$(e.target).is('input')){
				util.pasteKey(waveformedInfo);
				return false;
			}
		});

		//
		if(key === 'ESCAPE'){
			Howler.stop();
			// TODO: Remove all played formatting.
			$('.btn-key, .playlistSound').removeClass('playing-sound');
		}

		return false;
	});

	$(document).keyup(function(e) {
		var key = keyboardMap[e.which];
		var code = e.which;

		if(key === 'CONTROL'){
			ctrl = false;
			$('#waveform').css('pointer-events', 'inherit');
		}
	});

	// Close/save sound settings when save key is pressed.
	$('#sound-settings-save').click(function(e) {
		var tempSoundInfo = settings.saveSoundSettings();
		var itIsKeyInfo = (settingsInfoObj === keyInfo);
		settingsInfoObj[tempSoundInfo.id] = tempSoundInfo;
		if (itIsKeyInfo) {
			$('#' + tempSoundInfo.id).find('.audioName').text(tempSoundInfo.name);
			pagesInfo['page' + currentPage].keyInfo = keyInfo;
			storage.storeObj("pagesInfo", pagesInfo);
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
		view.openColorPicker();
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

	$('.search').on('keyup',function(){
		var first = true;
		$('#playlist-songs li').each(function(){
			if($(this).is(":visible") === true){
				if(first === true){
					$(this).css('background-color', 'var(--aM)');
					first = false;
				} else {
					$(this).css('background-color', 'var(--bgL)');
				}
			}
		});
	});
}

module.exports = {
	setKeyEvents: setKeyEvents
};
