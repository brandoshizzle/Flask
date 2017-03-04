var settingsSoundInfo;

// Open settings modal
function openSettings() {
	// Set general settings
	$('#settings-stopSounds').prop('checked', settingsInfo.general.stopSounds);
	$('#settings-prereleaseUpdates').prop('checked', settingsInfo.general.prereleaseUpdates);
	// Set playlist settings
	$('#settings-playlistSoundToBottom').prop('checked', settingsInfo.playlist.soundToBottomAfterPlay);
	$('#settings-playlistSoundToDelete').prop('checked', settingsInfo.playlist.soundDeleteAfterPlay);

	$('.global-settings-table').hide();
	$('#general-table').show();
	$('#settings-modal').modal('open');
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

function saveSettings(){
	settingsInfo.playlist.soundToBottomAfterPlay = $('#settings-playlistSoundToBottom').prop('checked');
	settingsInfo.playlist.soundDeleteAfterPlay = $('#settings-playlistSoundToDelete').prop('checked');
	settingsInfo.general.stopSounds = $('#settings-stopSounds').prop('checked');
	settingsInfo.general.prereleaseUpdates = $('#settings-prereleaseUpdates');
	storage.storeObj('settings', settingsInfo);
}

module.exports = {
	openSettings: openSettings,
	saveSettings: saveSettings,
	openSoundSettings: openSoundSettings,
	saveSoundSettings: saveSoundSettings,
	resetStartTime: resetStartTime,
	resetEndTime: resetEndTime
};
