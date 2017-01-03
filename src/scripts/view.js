/* VIEW.JS
*  Handles generation of elements that are dynamically loaded.
*  Functions:
			buildKeyboard
			buildTransList
			buildWaveform
*/

var settingsSoundInfo;

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

function openSoundSettings(soundInfo) {
	var idStart = "#sound-settings-";
	if (soundInfo.name === "") {
		soundInfo.name = "Enter a name";
	}
	$(idStart + "name").text(soundInfo.name);
	$(idStart + "path").val(soundInfo.path);
	$(idStart + "loop").prop("checked", soundInfo.loop);
	$(idStart + "start-time").val(soundInfo.startTime);
	if (soundInfo.endTime !== null) {
		$(idStart + "end-time").val(soundInfo.endTime);
	} else {
		$(idStart + "end-time").val(sounds.getDuration(key));
	}
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
	tempSoundInfo.name = $('#sound-settings-name').text();
	tempSoundInfo.color = $('#sound-settings-color').val();
	tempSoundInfo.loop = $('#sound-settings-loop').is(':checked');
	tempSoundInfo.startTime = $('#sound-settings-start-time').val();
	tempSoundInfo.endTime = $('#sound-settings-end-time').val();
	return tempSoundInfo;
}

function resetStartTime() {
	settingsSoundInfo.startTime = 0;
	$('#sound-settings-start-time').val(settingsSoundInfo.startTime);
}

function resetEndTime() {
	settingsSoundInfo.endTime = sounds.getDuration(settingsSoundInfo);
	$('#sound-settings-end-time').val(settingsSoundInfo.endTime);
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
