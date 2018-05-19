var settingsSoundInfo;

// Open settings modal
function openSettings() {
	// Set general settings
	$('#settings-stopSounds').prop('checked', settingsInfo.general.stopSounds);
	$('#settings-markPlayed').prop('checked', settingsInfo.general.markPlayed);
	$('#settings-fadeInTime').val(settingsInfo.general.fadeInTime/1000);
	$('#settings-fadeOutTime').val(settingsInfo.general.fadeOutTime/1000);
	$('#settings-prereleaseUpdates').prop('checked', settingsInfo.general.prereleaseUpdates);
	// Set playlist settings
	$('#settings-playlistSoundToBottom').prop('checked', settingsInfo.playlist.soundToBottomAfterPlay);
	$('#settings-playlistSoundToDelete').prop('checked', settingsInfo.playlist.soundDeleteAfterPlay);
	// Set pages settingsInfo
	console.log(settingsInfo.pages.soloSound);
	$('#settings-soloSound').val(settingsInfo.pages.soloSound).change();
	$("select").material_select();

	$('.global-settings-table').hide();
	$('#general-table').show();
	$('#settings-modal').modal('open');
}

function saveSettings(){
	settingsInfo.playlist.soundToBottomAfterPlay = $('#settings-playlistSoundToBottom').prop('checked');
	settingsInfo.playlist.soundDeleteAfterPlay = $('#settings-playlistSoundToDelete').prop('checked');
	settingsInfo.general.stopSounds = $('#settings-stopSounds').prop('checked');
	settingsInfo.general.markPlayed = $('#settings-markPlayed').prop('checked');
	settingsInfo.general.fadeInTime = $('#settings-fadeInTime').val()*1000;
	settingsInfo.general.fadeOutTime = $('#settings-fadeOutTime').val()*1000;
	settingsInfo.general.prereleaseUpdates = $('#settings-prereleaseUpdates');
	settingsInfo.pages.soloSound = $('#settings-soloSound').val();
	console.log(settingsInfo);
	storage.storeObj('settings', settingsInfo);
}

/**
 *	@desc: Opens the sound settings and populates it with the proper info
 *	@param: soundInfo: The sound info object that is being changed
 */
function openSoundSettings(soundInfo) {
	var idStart = "#sound-settings-";
	var infoObj;
	if (soundInfo.name === "") {
		soundInfo.name = "Enter a name";
	}
	$(idStart + "name").text(soundInfo.name);
	$(idStart + "path").val(soundInfo.path);
	if(soundInfo.infoObj !== "playlist"){
		$('#color-row').show();
		colors.setPickedColor(soundInfo.color);
		colors.setColorPickerColors();
		infoObj = keyInfo;
	} else {
		$('#color-row').hide();
		infoObj = playlistInfo;
	}
	var fadeInTime = sounds.getFadeTime(soundInfo, 'in');
	var fadeOutTime = sounds.getFadeTime(soundInfo, 'out');
	//$(idStart + "loop").prop("checked", soundInfo.loop);
	$(idStart + "fadeInTime").val(fadeInTime/1000);
	$(idStart + "fadeOutTime").val(fadeOutTime/1000);
	$(idStart + "played").prop('checked', $('#' + soundInfo.id).hasClass('played'));
	volSlider.noUiSlider.set(soundInfo.volume * 125);
	$(idStart + "volume").val(soundInfo.volume*125);
	settingsSoundInfo = soundInfo;
	$('#sound-settings').modal('open');

	
	// Set up volume event handler
	volSlider.noUiSlider.on('update',function(){
		var vol = volSlider.noUiSlider.get().replace('%','')/125;
		soundInfo.howl.volume(vol);
	});
}

/**
 *	@desc: Gets the settings from the sound settings box and save them
 *	@param: settingsKey (global): the key to apply changes to
 */
function saveSoundSettings() {
	var tempSoundInfo = settingsSoundInfo;
	if (tempSoundInfo.path != $('#sound-settings-path').val()) {
		tempSoundInfo.path = $('#sound-settings-path').val();
		sounds.register(tempSoundInfo);
		waveforms.load(tempSoundInfo);
		//view.resetEndTime();
		//view.resetStartTime();
	}
	if ($('#sound-settings-name').text() !== "") {
		if(waveformedInfo === settingsSoundInfo && waveformedInfo != undefined){
			if(waveformedInfo.name === tempSoundInfo.name){
				$('#waveform-song-name').text($('#sound-settings-name').text());
			}
		}
		tempSoundInfo.name = $('#sound-settings-name').text();
	}
	if(settingsSoundInfo.infoObj !== "playlist"){
		colors.setKeyColor(tempSoundInfo);
	}
	if($("#sound-settings-played").is(':checked')){
		$('#' + settingsSoundInfo.id).addClass('played');
	} else {
		$('#' + settingsSoundInfo.id).removeClass('played');
	}

	tempSoundInfo.volume = volSlider.noUiSlider.get().replace('%','')/125;

	//tempSoundInfo.loop = $('#sound-settings-loop').is(':checked');
	var fadeInDiff, fadeOutDiff;
	if(pagesInfo['page' + currentPage].fadeInTime){
		fadeInDiff = ($('#sound-settings-fadeInTime').val()*1000 != pagesInfo['page' + currentPage].fadeInTime);
	} else {
		fadeInDiff = ($('#sound-settings-fadeInTime').val()*1000 != settingsInfo.general.fadeInTime);
	}
	if(pagesInfo['page' + currentPage].fadeOutTime){
		fadeOutDiff = ($('#sound-settings-fadeOutTime').val()*1000 != pagesInfo['page' + currentPage].fadeOutTime);
	} else {
		fadeOutDiff = ($('#sound-settings-fadeOutTime').val()*1000 != settingsInfo.general.fadeOutTime);
	}
	if($('#sound-settings-fadeInTime').val() == 0){
		fadeInDiff = 1;
	}
	if($('#sound-settings-fadeOutTime').val() == 0){
		fadeOutDiff = 1;
	}
	//console.log(fadeInDiff);
	tempSoundInfo.fadeInTime = fadeInDiff ? $('#sound-settings-fadeInTime').val()*1000 : undefined;
	tempSoundInfo.fadeOutTime = fadeOutDiff ? $('#sound-settings-fadeOutTime').val()*1000 : undefined;

	return tempSoundInfo;
}

// Set fade in/out to global
function resetFade(soundOrPage, inOrOut) {
	var fadeTime;
	if(soundOrPage === 'sound'){
		if(inOrOut === 'in'){
			if(pagesInfo['page' + currentPage].fadeInTime !== undefined){
				fadeTime = pagesInfo['page' + currentPage].fadeInTime;
			} else {
				fadeTime = settingsInfo.general.fadeInTime;
			}
		} else {
			if(pagesInfo['page' + currentPage].fadeOutTime !== undefined){
				fadeTime = pagesInfo['page' + currentPage].fadeOutTime;
			} else {
				fadeTime = settingsInfo.general.fadeOutTime;
			}
		}
	}
	if(soundOrPage === 'page'){
		if(inOrOut === 'in'){
			fadeTime = settingsInfo.general.fadeInTime;
		} else {
			fadeTime = settingsInfo.general.fadeOutTime;
		}
	}

	if(inOrOut === 'in'){
		$('#' + soundOrPage + '-settings-fadeInTime').val(fadeTime/1000);
	} else if(inOrOut === 'out'){
		$('#' + soundOrPage + '-settings-fadeOutTime').val(fadeTime/1000);
	}
}

function openPageSettings(pageNum){
	var pageInfo = pagesInfo['page' + pageNum];
	if(pageInfo.name){
		$('#page-settings-name').text(pageInfo.name);
	} else {
		$('#page-settings-name').text('Page ' + pageNum);
	}
	$('#page-settings-fadeInTime').val(pages.getFadeTime(pageInfo, 'in'));
	$('#page-settings-fadeOutTime').val(pages.getFadeTime(pageInfo, 'out'));

	$('#page-modal').modal('open');
}

function savePageSettings(pageNum) {
	var pageInfo = pagesInfo['page' + pageNum];

	if ($('#page-settings-name').text() !== "") {
		pageInfo.name = $('#page-settings-name').text();
		$('#page' + pageNum + ' span').text(pageInfo.name);
	}

	var fadeInDiff = ($('#page-settings-fadeInTime').val()*1000 != settingsInfo.general.fadeInTime);
	var fadeOutDiff = ($('#page-settings-fadeOutTime').val()*1000 != settingsInfo.general.fadeOutTime);
	console.log(fadeInDiff);
	pageInfo.fadeInTime = fadeInDiff ? $('#page-settings-fadeInTime').val()*1000 : undefined;
	pageInfo.fadeOutTime = fadeOutDiff ? $('#page-settings-fadeOutTime').val()*1000 : undefined;

	storage.storeObj('pagesInfo', pagesInfo);
}

module.exports = {
	openSettings: openSettings,
	saveSettings: saveSettings,
	openSoundSettings: openSoundSettings,
	saveSoundSettings: saveSoundSettings,
	resetFade: resetFade,
	openPageSettings: openPageSettings,
	savePageSettings: savePageSettings
};
