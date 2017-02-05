var defaultSettings = {
	'general':{
		'prereleaseUpdates': false,
		'stopSounds': true
	},
	'playlist':{
		"soundToBottomAfterPlay": true,
		"soundDeleteAfterPlay": false
	},
	'keyboard':{

	}
};

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
	storage.storeObj('settings', settings);
}

// Check and update settings on import
function checkSettings(settingsObj) {
	Object.keys(defaultSettings).map(function(prop, index) {
		if (!settingsObj.hasOwnProperty(prop)) {
			settingsObj[prop] = defaultSettings[prop];
		}
	});
	// Check that the key does not have depreciated properties (and delete them)
	Object.keys(settingsObj).map(function(prop, index) {
		if (!defaultSettings.hasOwnProperty(prop)) {
			delete settingsObj[prop];
		}
	});
	console.log(settingsObj);
}

module.exports = {
	openSettings: openSettings,
	saveSettings: saveSettings,
	checkSettings: checkSettings
};
