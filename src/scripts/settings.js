var settingsSoundInfo;

// Open settings modal
function openSettings() {
	// Set general settings
	$('#settings-stopSounds').prop('checked', settingsInfo.general.stopSounds);
	$('#settings-fadeInTime').val(settingsInfo.general.fadeInTime/1000);
	$('#settings-fadeOutTime').val(settingsInfo.general.fadeOutTime/1000);
	$('#settings-prereleaseUpdates').prop('checked', settingsInfo.general.prereleaseUpdates);
	// Set playlist settings
	$('#settings-playlistSoundToBottom').prop('checked', settingsInfo.playlist.soundToBottomAfterPlay);
	$('#settings-playlistSoundToDelete').prop('checked', settingsInfo.playlist.soundDeleteAfterPlay);

	$('.global-settings-table').hide();
	$('#general-table').show();
	$('#settings-modal').modal('open');
}

function saveSettings(){
	settingsInfo.playlist.soundToBottomAfterPlay = $('#settings-playlistSoundToBottom').prop('checked');
	settingsInfo.playlist.soundDeleteAfterPlay = $('#settings-playlistSoundToDelete').prop('checked');
	settingsInfo.general.stopSounds = $('#settings-stopSounds').prop('checked');
	settingsInfo.general.fadeInTime = $('#settings-fadeInTime').val()*1000;
	settingsInfo.general.fadeOutTime = $('#settings-fadeOutTime').val()*1000;
	settingsInfo.general.prereleaseUpdates = $('#settings-prereleaseUpdates');
	storage.storeObj('settings', settingsInfo);
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
	$(idStart + "fadeInTime").val((soundInfo.fadeInTime || settingsInfo.general.fadeInTime)/1000);
	$(idStart + "fadeOutTime").val((soundInfo.fadeOutTime || settingsInfo.general.fadeOutTime)/1000);
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
		//view.resetEndTime();
		//view.resetStartTime();
	}
	if ($('#sound-settings-name').text() !== "") {
		if(waveformedInfo.name === tempSoundInfo.name){
			$('#waveform-song-name').text($('#sound-settings-name').text());
		}
		tempSoundInfo.name = $('#sound-settings-name').text();
	}
	if(settingsSoundInfo.infoObj !== "playlist"){
		colors.setKeyColor(tempSoundInfo);
	}
	tempSoundInfo.loop = $('#sound-settings-loop').is(':checked');
	var fadeInDiff = ($('#sound-settings-fadeInTime').val()*1000 != settingsInfo.general.fadeInTime);
	var fadeOutDiff = ($('#sound-settings-fadeOutTime').val() != settingsInfo.general.fadeOutTime);
	console.log(fadeInDiff);
	tempSoundInfo.fadeInTime = fadeInDiff ? $('#sound-settings-fadeInTime').val()*1000 : undefined;
	tempSoundInfo.fadeOutTime = fadeOutDiff ? $('#sound-settings-fadeOutTime').val()*1000 : undefined;

	return tempSoundInfo;
}

// Set fade in/out to global
function resetFade(inOrOut) {
	if(inOrOut === 'in'){
		$('#sound-settings-fadeInTime').val(settingsInfo.general.fadeInTime/1000);
	} else if(inOrOut === 'out'){
		$('#sound-settings-fadeOutTime').val(settingsInfo.general.fadeOutTime/1000);
	}
}

function openPageSettings(pageNum){
	var pageInfo = pagesInfo['page' + pageNum];
	if(pageInfo.name){
		$('#page-settings-name').text(pageInfo.name);
	} else {
		$('#page-settings-name').text('Page ' + pageNum);
	}
	$('#page-modal').modal('open');
}

module.exports = {
	openSettings: openSettings,
	saveSettings: saveSettings,
	openSoundSettings: openSoundSettings,
	saveSoundSettings: saveSoundSettings,
	resetFade: resetFade,
	openPageSettings: openPageSettings
};
