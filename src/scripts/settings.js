
// Open settings modal
function openSettings() {
	// Set general settings
	$('#settings-stopSounds').prop('checked', settingsInfo.general.stopSounds);
	$('#settings-prereleaseUpdates').prop('checked', settingsInfo.general.prereleaseUpdates);
	// Set playlist settings
	$('#settings-playlistSoundToBottom').prop('checked', settingsInfo.playlist.soundToBottomAfterPlay);
	$('#settings-playlistSoundToDelete').prop('checked', settingsInfo.playlist.soundDeleteAfterPlay);


	$('#settings-modal').modal('open');
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
	saveSettings: saveSettings
};
