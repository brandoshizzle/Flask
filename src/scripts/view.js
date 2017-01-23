/* VIEW.JS
 *  Handles generation of elements that are dynamically loaded.
 */

var settingsSoundInfo;
var specialKeys = {
	'-': 'MINUS',
	'+': 'EQUALS',
	'[': 'OPEN_BRACKET',
	']': 'CLOSE_BRACKET',
	';': 'SEMICOLON',
	"'": 'QUOTE',
	"\\": 'BACK_SLASH',
	"|": "BESIDE_Z",
	',': 'COMMA',
	'.': 'PERIOD',
	'/': 'SLASH'
};

// Create keyboard buttons
function buildKeyboard() {
	var rows = [
		['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '+'],
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", "\\"],
		['|', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', ]
	];
	var id;
	for(var kbNum = 1; kbNum < 9; kbNum++){
		for (var i = 0; i < rows.length; i++) {
			var rowNum = i + 1;
			for (var j = 0; j < rows[i].length; j++) {
				id = rows[i][j];
				// Check whether it's a special key, and if so, replace it with the written version
				if (specialKeys.hasOwnProperty(rows[i][j])) {
					id = specialKeys[rows[i][j]];
				}
				// Create the key
				$('#keyboard'+ kbNum + ' > #row' + rowNum).append("<div class='btn btn-key z-depth-4 waves-effect waves-light' id='" + id + "'><div class='keyLetter'>" + rows[i][j] + "</div><div class='audioName'></div></div>");
			}
		}
	}
	keys = $('.btn-key'); // set keys to be an array of the audioName divs
}

/**
 *	@desc:	Creates a new element on the playlist
 *	@param:	soundInfo: The soundInfo object
 */
function createPlaylistItem(soundInfo) {
	$('#playlist-songs').append("<li class='z-depth-4 playlistSound' id='" + soundInfo.id + "'>" + soundInfo.name + "</li>");
}

/**
 *	@desc:	Makes the playlist sortable - should probably make this also populate it
 *	@param:	soundInfo: The soundInfo object
 */
function buildPlaylist() {
	var el = document.getElementById('playlist-songs');
	var sortable = Sortable.create(el, {
		animation: 250,
		onUpdate: function (evt) {
			console.log(evt.newIndex);
			var first = true;
			var sounds = $('.playlistSound');
			for(i = 0; i < evt.newIndex; i++){
				var style = window.getComputedStyle(sounds[i]);
				if(style.display !== 'none'){
					 first = false;
				}
			}
        if(first === true){
					$('.playlistSound').css('background-color', 'var(--bgL)');
					$('#' + evt.item.id).css('background-color', 'var(--aM)');
					console.log('hello');
				}
    }
	});
}

/**
 *	@desc: Opens the sound settings and populates it with the proper info
 *	@param: soundInfo: The sound info object that is being changed
 */
function openSoundSettings(soundInfo) {
	var idStart = "#sound-settings-";
	if (soundInfo.name === "") {
		soundInfo.name = "Enter a name";
	}
	$(idStart + "name").text(soundInfo.name);
	$(idStart + "path").val(soundInfo.path);
	if(soundInfo.infoObj !== "playlist"){
		$('#color-row').show();
		colors.setPickedColor(soundInfo.color);
		colors.setColorPickerColors();
	} else {
		$('#color-row').hide();
	}

	$(idStart + "loop").prop("checked", soundInfo.loop);
	$(idStart + "start-time").val(soundInfo.startTime);
	$(idStart + "end-time").val(soundInfo.endTime);
	settingsSoundInfo = soundInfo;
	$('#sound-settings').modal('open');
}

/**
 *	@desc: Gets the settings from the sound settings box and save them
 *	@param: settingsKey (global): the key to apply changes to
 */
function saveSoundSettings() {
	var tempSoundInfo = settingsSoundInfo;
	if (tempSoundInfo.path != $('#sound-settings-path').val()) {
		sounds.loadFile(settingsKey, $('#sound-settings-path').val());
		view.resetEndTime();
		view.resetStartTime();
	}
	if ($('#sound-settings-name').text() !== "") {
		tempSoundInfo.name = $('#sound-settings-name').text();
	}
	if(settingsSoundInfo.infoObj !== "playlist"){
		colors.setKeyColor(tempSoundInfo);
	}
	tempSoundInfo.loop = $('#sound-settings-loop').is(':checked');
	tempSoundInfo.startTime = $('#sound-settings-start-time').val();
	tempSoundInfo.endTime = $('#sound-settings-end-time').val();
	return tempSoundInfo;
}

// Set start time to 0
function resetStartTime() {
	$('#sound-settings-start-time').val(0);
}

// Set end time to total duration
function resetEndTime() {
	$('#sound-settings-end-time').val(sounds.getDuration(settingsSoundInfo));
}

// Open about modal
function openAbout() {
	$('#about-modal').modal('open');
}

// Open color picker sub menu
function openColorPicker() {
	var position = $("#sound-settings-color-container").position();
	$("#color-picker").css('top', position.top);
	$("#color-picker").css('left', position.left);
	$("#color-picker").fadeIn();
}

module.exports = {
	buildKeyboard: buildKeyboard,
	createPlaylistItem: createPlaylistItem,
	buildPlaylist: buildPlaylist,
	openSoundSettings: openSoundSettings,
	saveSoundSettings: saveSoundSettings,
	resetStartTime: resetStartTime,
	resetEndTime: resetEndTime,
	openAbout: openAbout,
	openColorPicker: openColorPicker
};
