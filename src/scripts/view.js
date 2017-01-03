/* VIEW.JS
*  Handles generation of elements that are dynamically loaded.
*  Functions:
			buildKeyboard
			buildTransList
			buildWaveform
*/

var settingsKey;

// Create keyboard buttons
function buildKeyboard() {
	var rows = [
		['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', "["],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"],
		["\\", 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', ]
	];
	for (var i = 0; i < rows.length; i++) {
		var rowNum = i + 1;
		for (var j = 0; j < rows[i].length; j++) {
			$('#row' + rowNum).append("<div class='btn btn-key z-depth-4 waves-effect waves-light' id='" + rows[i][j] + "'><div class='keyLetter'>" + rows[i][j] + "</div><div class='audioName'></div></div>");
		}
	}
	keys = $('.btn-key'); // set keys to be an array of the audioName divs
}

function createPlaylistItem(soundInfo) {
	$('#playlist-songs').append("<li class='z-depth-4 playlistSound' id='" + soundInfo.id + "'>" + soundInfo.name + "</li>");
}

function buildPlaylist() {
	var el = document.getElementById('playlist-songs');
	var sortable = Sortable.create(el, {
		animation: 150
	});
}

function buildWaveform() {
	// Create wavesurfer instance
	wavesurfer = WaveSurfer.create({
		container: '#waveform',
		waveColor: '#ffeb3b',
		progressColor: '#ffd600',
	});
	wavesurfer.empty();
}

function openSoundSettings(key) {
	var idStart = "#sound-settings-";
	var soundProps = keyInfo[key];
	if (soundProps.name === "") {
		soundProps.name = "Enter a name";
	}
	$(idStart + "name").text(soundProps.name);
	$(idStart + "path").val(soundProps.path);
	$(idStart + "loop").prop("checked", soundProps.loop);
	$(idStart + "start-time").val(soundProps.startTime);
	if (soundProps.endTime !== null) {
		$(idStart + "end-time").val(soundProps.endTime);
	} else {
		$(idStart + "end-time").val(sounds.getDuration(key));
	}
	settingsKey = key;
	$('#sound-settings').modal('open');
}

/**
 *	@desc: Gets the settings from the sound settings box and save them
 *	@param: settingsKey (global): the key to apply changes to
 */
function saveSoundSettings() {
	var keyArray = keyInfo[settingsKey];
	if (keyArray.path != $('#sound-settings-path').val()) {
		sounds.loadFile(settingsKey, $('#sound-settings-path').val());
		view.resetEndTime();
		view.resetStartTime();
	}
	keyArray.name = $('#sound-settings-name').text();
	$('#' + settingsKey).find('.audioName').text(keyArray.name);
	keyArray.color = $('#sound-settings-color').val();
	keyArray.loop = $('#sound-settings-loop').is(':checked');
	keyArray.startTime = $('#sound-settings-start-time').val();
	keyArray.endTime = $('#sound-settings-end-time').val();
	keyInfo[settingsKey] = keyArray;
	storage.storeObj("keyInfo", keyInfo);
}

function resetStartTime() {
	keyInfo[settingsKey].startTime = 0;
	$('#sound-settings-start-time').val(keyInfo[settingsKey].startTime);
}

function resetEndTime() {
	keyInfo[settingsKey].endTime = sounds.getDuration(keyInfo[settingsKey]);
	$('#sound-settings-end-time').val(keyInfo[settingsKey].endTime);
}

module.exports = {
	buildKeyboard: buildKeyboard,
	createPlaylistItem: createPlaylistItem,
	buildPlaylist: buildPlaylist,
	buildWaveform: buildWaveform,
	openSoundSettings: openSoundSettings,
	saveSoundSettings: saveSoundSettings,
	resetStartTime: resetStartTime,
	resetEndTime: resetEndTime
};
