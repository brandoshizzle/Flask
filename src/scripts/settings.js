var soundSettingsElArray;

// Open settings modal
function openSettings() {
    // Set general settings
    M.Sidenav.getInstance($('.sidenav')).close();
    $('#settings-tabs').tabs('select', 'general');
    $('#settings-tabs').tabs('updateTabIndicator');
    $('#settings-stopSounds').prop('checked', settingsInfo.general.stopSounds);
    $('#settings-markPlayed').prop('checked', settingsInfo.general.markPlayed);
    $('#settings-fadeInTime').val(settingsInfo.general.fadeInTime / 1000);
    $('#settings-fadeOutTime').val(settingsInfo.general.fadeOutTime / 1000);
    $('#settings-prereleaseUpdates').prop('checked', settingsInfo.general.prereleaseUpdates);
    // Set playlist settings
    $('#settings-playlistSoundToBottom').prop('checked', settingsInfo.playlist.soundToBottomAfterPlay);
    $('#settings-playlistSoundToDelete').prop('checked', settingsInfo.playlist.soundDeleteAfterPlay);

    // Set pages settingsInfo
    $('#settings-soloSound').val(settingsInfo.pages.soloSound);
    $('#settings-soloSound').formSelect();

    // Make sure first in list is selected, then open up the modal
    const settingsSections = document.querySelectorAll('.settings-section');
    settingsSections.forEach(el => {
        $(el).hide();
    });
    $('#settings-menu td:first').addClass('settings-menu-active');
    $('#settings-general').show();
    $('#settings-modal').modal('open');
}

/**
 *	@desc: Saves the main settings and saves it to the json file
 *	@param: none
 */
function saveSettings() {
    settingsInfo.playlist.soundToBottomAfterPlay = $('#settings-playlistSoundToBottom').prop('checked');
    settingsInfo.playlist.soundDeleteAfterPlay = $('#settings-playlistSoundToDelete').prop('checked');
    settingsInfo.general.stopSounds = $('#settings-stopSounds').prop('checked');
    settingsInfo.general.markPlayed = $('#settings-markPlayed').prop('checked');
    settingsInfo.general.fadeInTime = $('#settings-fadeInTime').val() * 1000;
    settingsInfo.general.fadeOutTime = $('#settings-fadeOutTime').val() * 1000;
    settingsInfo.general.prereleaseUpdates = $('#settings-prereleaseUpdates');
    settingsInfo.pages.soloSound = $('#settings-soloSound').val();
    //storage.storeObj("settings", settingsInfo);
    const settingsSections = document.querySelectorAll('#settings-menu td');
    settingsSections.forEach(el => {
        el.classList.remove('settings-menu-active');
    });
    storage.saveShow();
}

/**
 *	@desc: Opens the sound settings and populates it with the proper info
 *	@param: soundInfo: The sound info object that is being changed
 */
function openSoundSettings(elArray) {
    let hasNotEmptyKeys = false;
    let soundInfo;
    if (Array.isArray(elArray)) {
        for (var el of elArray) {
            if (keyInfo.hasOwnProperty(el.id)) {
                hasNotEmptyKeys = true;
                soundInfo = keyInfo[el.id];
                break;
            }
        }
    } else {
        soundInfo = elArray;
        hasNotEmptyKeys = true;
    }

    if (!hasNotEmptyKeys) {
        return;
    }

    var idStart = '#sound-settings-';
    if (soundInfo.name === '') {
        soundInfo.name = 'Enter a name';
    }
    if (elArray.length > 1) {
        $(idStart + 'name').text('Multiple Edit Mode');
        $(idStart + 'path').text('');
    } else {
        $(idStart + 'name').text(soundInfo.name);
        $(idStart + 'path').text(soundInfo.path);
    }

    if (soundInfo.infoObj !== 'playlist') {
        $('#color-row').show();
        colors.loadColorIntoSoundSettings(soundInfo.color);
    } else {
        $('#color-row').hide();
    }
    var fadeInTime = sounds.getFadeTime(soundInfo, 'in');
    var fadeOutTime = sounds.getFadeTime(soundInfo, 'out');
    //$(idStart + "loop").prop("checked", soundInfo.loop);
    $(idStart + 'fadeInTime').val(fadeInTime / 1000);
    $(idStart + 'fadeOutTime').val(fadeOutTime / 1000);
    if (soundInfo.infoObj === 'playlist') {
        $('#sound-settings-fadeOutType option[value="page"]').attr('disabled', 'disabled');
        $('#sound-settings-fadeInType option[value="page"]').attr('disabled', 'disabled');
    } else {
        $('#sound-settings-fadeOutType option[value="page"]').removeAttr('disabled');
        $('#sound-settings-fadeInType option[value="page"]').removeAttr('disabled');
    }
    $('#sound-settings-fadeOutType').val(soundInfo.fadeOutType);
    $('#sound-settings-fadeOutType').formSelect();
    $('#sound-settings-fadeInType').val(soundInfo.fadeInType);
    $('#sound-settings-fadeInType').formSelect();

    $(idStart + 'played').prop('checked', $('#' + soundInfo.id).hasClass('played'));
    volSlider.noUiSlider.set(soundInfo.volume * 125);
    $(idStart + 'volume').val(soundInfo.volume * 125);
    $('#sound-settings-modal').modal('open');

    soundSettingsElArray = elArray;

    // Set up volume event handler
    volSlider.noUiSlider.on('update', function() {
        var vol = volSlider.noUiSlider.get().replace('%', '') / 125;
        soundInfo.howl.volume(vol);
    });
    // Set up select change handler
    $('#sound-settings-fadeInType').change(() => {
        soundInfo.fadeInType = document.querySelector('#sound-settings-fadeInType').value;
        $('#sound-settings-fadeInTime').val(sounds.getFadeTime(soundInfo, 'in') / 1000);
    });
    $('#sound-settings-fadeOutType').change(() => {
        soundInfo.fadeOutType = document.querySelector('#sound-settings-fadeOutType').value;
        $('#sound-settings-fadeOutTime').val(sounds.getFadeTime(soundInfo, 'out') / 1000);
    });
    let prevFadeTime;
    $('#sound-settings-fadeInTime').focusin(() => {
        prevFadeTime = $('#sound-settings-fadeInTime').val();
    });
    $('#sound-settings-fadeInTime').focusout(() => {
        if ($('#sound-settings-fadeInTime').val() !== prevFadeTime) {
            $('#sound-settings-fadeInType').val('custom');
            $('#sound-settings-fadeInType').formSelect();
        }
    });
    $('#sound-settings-fadeOutTime').focusin(() => {
        prevFadeTime = $('#sound-settings-fadeOutTime').val();
    });
    $('#sound-settings-fadeOutTime').focusout(() => {
        if ($('#sound-settings-fadeOutTime').val() !== prevFadeTime) {
            $('#sound-settings-fadeOutType').val('custom');
            $('#sound-settings-fadeOutType').formSelect();
        }
    });
}

/**
 *	@desc: Gets the settings from the sound settings box and save them
 *	@param: settingsKey (global): the key to apply changes to
 */
function saveSoundSettings() {
    // Iterate through selected keys and add sound settings
    if (!Array.isArray(soundSettingsElArray)) {
        soundSettingsElArray = [soundSettingsElArray];
    }
    for (var el of soundSettingsElArray) {
        let keyOrPlaylistInfo;
        let settingsSoundInfo;
        // ensure the key is not a blank key
        if (keyInfo.hasOwnProperty(el.id)) {
            keyOrPlaylistInfo = 'keyInfo';
            settingsSoundInfo = keyInfo[el.id];
        } else if (playlistInfo.hasOwnProperty(el.id)) {
            keyOrPlaylistInfo = 'playlistInfo';
            settingsSoundInfo = playlistInfo[el.id];
        } else {
            continue;
        }

        let tempSoundInfo = settingsSoundInfo;
        if (tempSoundInfo.path != $('#sound-settings-path').text() && soundSettingsElArray.length === 1) {
            tempSoundInfo.path = $('#sound-settings-path').val();
            sounds.createNewHowl(tempSoundInfo);
            waveforms.load(tempSoundInfo);
        }
        if ($('#sound-settings-name').text() !== '' && soundSettingsElArray.length === 1) {
            if (waveformedInfo === settingsSoundInfo && waveformedInfo != undefined) {
                if (waveformedInfo.name === tempSoundInfo.name) {
                    $('#waveform-song-name').text($('#sound-settings-name').text());
                }
            }
            tempSoundInfo.name = $('#sound-settings-name').text();
        }

        // If on the keyboard, set the color
        if (settingsSoundInfo.infoObj !== 'playlist') {
            colors.setKeyColor(tempSoundInfo);
        }

        // Set whether it is marked as played or not
        if ($('#sound-settings-played').is(':checked')) {
            $('#' + el.id).addClass('played');
        } else {
            $('#' + el.id).removeClass('played');
        }

        // Set volume percentage
        tempSoundInfo.volume = volSlider.noUiSlider.get().replace('%', '') / 125;

        //tempSoundInfo.loop = $('#sound-settings-loop').is(':checked');

        tempSoundInfo.fadeInType = document.querySelector('#sound-settings-fadeInType').value;
        tempSoundInfo.fadeOutType = document.querySelector('#sound-settings-fadeOutType').value;

        // Set fade parameters
        tempSoundInfo.fadeInTime = $('#sound-settings-fadeInTime').val() * 1000;
        tempSoundInfo.fadeOutTime = $('#sound-settings-fadeOutTime').val() * 1000;

        // Add tempSoundInfo to keyInfo or playlistInfo and update
        if (keyOrPlaylistInfo === 'keyInfo') {
            keyInfo[el.id] = tempSoundInfo;
            pagesInfo[`page${currentPage}`].keyInfo = keyInfo;
            $(`#${tempSoundInfo.id}`)
                .find('.audioName')
                .text(tempSoundInfo.name);
        } else {
            playlistInfo[el.id] = tempSoundInfo;
            $(`#${tempSoundInfo.id}`).text(tempSoundInfo.name);
        }
    }
    storage.saveShow();
}

// Set fade in/out to global
function resetFade(soundOrPage, inOrOut) {
    var fadeTime;
    if (soundOrPage === 'sound') {
        if (inOrOut === 'in') {
            if (pagesInfo['page' + currentPage].fadeInTime !== undefined) {
                fadeTime = pagesInfo['page' + currentPage].fadeInTime;
            } else {
                fadeTime = settingsInfo.general.fadeInTime;
            }
        } else {
            if (pagesInfo['page' + currentPage].fadeOutTime !== undefined) {
                fadeTime = pagesInfo['page' + currentPage].fadeOutTime;
            } else {
                fadeTime = settingsInfo.general.fadeOutTime;
            }
        }
    }
    if (soundOrPage === 'page') {
        if (inOrOut === 'in') {
            fadeTime = settingsInfo.general.fadeInTime;
        } else {
            fadeTime = settingsInfo.general.fadeOutTime;
        }
    }

    if (inOrOut === 'in') {
        $('#' + soundOrPage + '-settings-fadeInTime').val(fadeTime / 1000);
    } else if (inOrOut === 'out') {
        $('#' + soundOrPage + '-settings-fadeOutTime').val(fadeTime / 1000);
    }
}

function resetVolumes() {
    for (var page in pagesInfo) {
        for (var key in pagesInfo[page].keyInfo) {
            pagesInfo[page].keyInfo[key].volume = 0.8;
        }
    }
    for (var sound in playlistInfo) {
        playlistInfo[sound].volume = 0.8;
    }
    keyInfo = pagesInfo.page1.keyInfo;
    //storage.storeObj("pagesInfo", pagesInfo);
    //storage.storeObj("playlistInfo", playlistInfo);
    storage.saveShow();
}

function openPageSettings(pageNum) {
    var pageInfo = pagesInfo['page' + pageNum];
    if (pageInfo.name) {
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

    if ($('#page-settings-name').text() !== '') {
        pageInfo.name = $('#page-settings-name').text();
        $('#page' + pageNum + ' span').text(pageInfo.name);
    }

    var fadeInDiff = $('#page-settings-fadeInTime').val() * 1000 != settingsInfo.general.fadeInTime;
    var fadeOutDiff = $('#page-settings-fadeOutTime').val() * 1000 != settingsInfo.general.fadeOutTime;
    pageInfo.fadeInTime = fadeInDiff ? $('#page-settings-fadeInTime').val() * 1000 : undefined;
    pageInfo.fadeOutTime = fadeOutDiff ? $('#page-settings-fadeOutTime').val() * 1000 : undefined;

    //storage.storeObj("pagesInfo", pagesInfo);
    storage.saveShow();
}

module.exports = {
    openSettings: openSettings,
    saveSettings: saveSettings,
    openSoundSettings: openSoundSettings,
    saveSoundSettings: saveSoundSettings,
    resetFade: resetFade,
    openPageSettings: openPageSettings,
    savePageSettings: savePageSettings,
    resetVolumes: resetVolumes
};
