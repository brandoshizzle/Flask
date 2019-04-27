/* EVENTS.JS
 * These functions handle all events - mouse clicks, key presses, etc
 * Functions:
 *		setKeyEvents
 */

let settingsInfoObj; // Either keyInfo or playlistInfo, whichever has the sound being changed in settings
const specialKeys = [
    'MINUS',
    'EQUALS',
    'OPEN_BRACKET',
    'CLOSE_BRACKET',
    'SEMICOLON',
    'QUOTE',
    'BACK_SLASH',
    'BESIDE_Z',
    'COMMA',
    'PERIOD',
    'SLASH'
];
const playlistPlayingSound = {
    id: '',
    playing: false
};
let curVol;
let ctrl = false;

/**
 *	@desc:	Sets all the events related to the keyboard keys
 *	@param:	keys: An array of all the key objects
 */
function setKeyEvents() {
    // Handles when a file is dropped on a key
    keys.on('drop', function(e) {
        e.originalEvent.preventDefault(); // Prevent default action
        try {
            // grab the id of the target key
            let siblingCount = -1;
            let newSoundInfo;
            let first = true;
            for (const f of e.originalEvent.dataTransfer.files) {
                let targetKey = $(e.target);
                if (first) {
                    first = targetKey.attr('id');
                }
                if (siblingCount > -1) {
                    if (siblingCount < targetKey.nextAll().length) {
                        targetKey = $(e.target)
                            .nextAll()
                            .eq(siblingCount);
                    }
                }
                const id = targetKey.attr('id');

                // Create a new sound info object
                newSoundInfo = new sounds.SoundInfo(f.path, id);
                sounds.createNewHowl(newSoundInfo);

                // Store the new sound info object in the keyInfo object
                keyInfo[id] = newSoundInfo;
                targetKey.find('.audioName').text(newSoundInfo.name);
                $(`#${id}`).removeClass('played');
                siblingCount++;
            }
            pages.ensurePageExists(currentPage);
            pagesInfo[`page${currentPage}`].keyInfo = keyInfo;
            //storage.storeObj('pagesInfo', pagesInfo);
            console.log('saving show');
            storage.saveShow();
            waveforms.load(keyInfo[first]);
        } catch (err) {}
        return false;
    });

    keys.on('dragover', function(e) {
        // $('#' + e.target.id).css("box-shadow", "0px 0px 4px 4px rgba(255,247,99,1)");
        return false;
    });
    keys.on('dragleave', function(e) {
        // $('#' + e.target.id).css("box-shadow", "0px 0px");
        return false;
    });

    // File is dropped onto playlist box - register and add info
    $('.playlistBox').on('drop', function(e) {
        e.originalEvent.preventDefault(); // Prevent default action
        let first = true;
        for (const f of e.originalEvent.dataTransfer.files) {
            // Create new soundInfo object
            newSoundInfo = new sounds.SoundInfo(f.path);
            console.log(newSoundInfo);
            sounds.createNewHowl(newSoundInfo);
            playlistInfo[newSoundInfo.id] = newSoundInfo;
            view.createPlaylistItem(newSoundInfo); // Create a new li in the playlist
            if (first) {
                waveforms.load(newSoundInfo);
                first = false;
            }
        }
        if (e.originalEvent.dataTransfer.files.length > 0) {
            //storage.storeObj('playlistInfo', playlistInfo);
            storage.saveShow();
        }
        updatePlaylistClickFunctions(); // Ensure new songs react properly to clicking
        return false;
    });

    // Click on keyboard key
    $('.btn-key').on('click', function(e) {
        clickSound(e, keyInfo);
    });

    // apply clicked-key class and show waveform
    function clickSound(e, infoObj) {
        const id = e.target.id;
        if (!infoObj.hasOwnProperty(id)) {
            infoObj[id] = {};
            infoObj[id].id = id;
            storage.checkAgainstDefault(infoObj[id], 'soundInfo');
        }
        waveforms.track(infoObj[id]);
    }

    // Right click to bring up settings and populate them
    keys.on('contextmenu', function(e) {
        // Check if the clicked key is in the current selection
        const selectedKeys = dragSelect.getSelection();
        if (selectedKeys.includes(e.target)) {
            // It's part of the current selection. pass the sound settings the selection
            settings.openSoundSettings(selectedKeys);
        } else {
            // It's not part of the selected keys. Send just this one
            settings.openSoundSettings([e.target]);
        }
        settingsInfoObj = keyInfo;
    });

    // Set functions when clicking on playlist sounds
    function updatePlaylistClickFunctions() {
        // Click on playlist sound -> load waveform
        $('.playlistSound').on('click', function(e) {
            clickSound(e, playlistInfo);
        });

        // Right-click on playlist sound -> open sound settings
        $('#playlist-songs li').on('contextmenu', function(e) {
            const id = e.target.id;
            settingsInfoObj = playlistInfo;
            settings.openSoundSettings(playlistInfo[id]);

            // waveforms.load(playlistInfo[id]);
        });
    }
    updatePlaylistClickFunctions();

    // Handles pressing a real key anywhere on the page
    $(document).keydown(function(e) {
        let key = keyboardMap[e.which];
        const code = e.which;

        if (key === 'CONTROL') {
            ctrl = true;
            $('#waveform').css('pointer-events', 'none');
        }

        // only handle keys if they are not being used in an input box, and control is not pressed;
        if (!$(e.target).is('input') && !ctrl) {
            // If keys A-Z or 0-9 have been pressed, or a special key
            if ((code > 64 && code < 91) || (code > 47 && code < 58) || $.inArray(key, specialKeys) > -1) {
                // Check if the sound was loaded or not, and if it even exists
                key = `page${currentPage}_${key}`;
                if (keyInfo.hasOwnProperty(key)) {
                    if (
                        !$(`#${key}`)
                            .parent()
                            .hasClass('soundNotLoaded')
                    ) {
                        sounds.playSound(keyInfo[key]);
                    } else {
                        // User tries to play a not-loaded sound
                        M.toast({
                            html: `${keyInfo[key].name} was not loaded.`,
                            displayLength: 1500
                        });
                    }
                }

                // User presses the delete key
            } else if (key === 'DELETE' || key === 'BACK_SPACE') {
                id = $('.waveformed-key').attr('id');
                if (id === undefined) {
                    return;
                }

                // If the deleted sound was in the keys
                if (keyInfo.hasOwnProperty(id)) {
                    // keyInfo[id].howl.unload();
                    delete keyInfo[id];
                    pagesInfo[`page${currentPage}`].keyInfo = keyInfo;
                    //storage.storeObj('pagesInfo', pagesInfo);
                    storage.saveShow();
                    $(`#${id}`)
                        .find('.audioName')
                        .text('');
                    $(`#${id}`)
                        .removeClass('waveformed-key')
                        .removeClass('played');
                    $(`#${id}`)
                        .removeClass('waveformed-key')
                        .removeClass('playing-sound');
                    $(`#${id}`)
                        .removeClass('waveformed-key')
                        .removeClass('soundNotLoaded');
                    $(`#${id}`).css('background-color', 'var(--pM)');
                    $(`#${id}`).css('box-shadow', '0px 4px 0px 0px var(--pD)');
                } else {
                    // The deleted sound was in the playlist
                    // playlistInfo[id].howl.unload();
                    delete playlistInfo[id];
                    $(`#${id}`).remove();
                    //storage.storeObj('playlistInfo', playlistInfo);
                    storage.saveShow();
                }

                // Howler.removeSound(id);
                // waveformedInfo = undefined;
                waveforms.reset();
            } else if (key === 'SPACE') {
                // Play from the playlist
                let soundId;
                if (playlist.getFirstPlaylistItem() === 'no sounds!') {
                    return;
                }

                // If a sound is playing, make sure to stop it, not play the first one
                if (playlistPlayingSoundInfo) {
                    soundId = playlistPlayingSoundInfo.id;
                    $('#playlist-autoplay').prop('checked', false);
                } else {
                    // Get first playlist sound
                    soundId = playlist.getFirstPlaylistItem();
                }
                sounds.playSound(playlistInfo[soundId]);
            }

            if (key === 'ESCAPE') {
                // Stop all playing sounds immediately
                for (key in keyInfo) {
                    if (keyInfo[key].howl.playing()) {
                        keyInfo[key].howl.stop();
                    }
                }
                for (key in playlistInfo) {
                    if (playlistInfo[key].howl.playing()) {
                        playlistInfo[key].howl.stop();
                    }
                }

                $('.btn-key, .playlistSound').removeClass('playing-sound');
                // Remove drag selection
                dragSelect.clearSelection();
            }
        }

        Mousetrap.bind(['command+x', 'ctrl+x'], function() {
            if (!$(e.target).is('input')) {
                util.cutKey(waveformedInfo);
                return false;
            }
        });
        Mousetrap.bind(['command+c', 'ctrl+c'], function() {
            if (!$(e.target).is('input')) {
                util.copyKey(waveformedInfo);
                return false;
            }
        });
        Mousetrap.bind(['command+v', 'ctrl+v'], function() {
            if (!$(e.target).is('input')) {
                util.pasteKey(waveformedInfo);
                return false;
            }
        });
        Mousetrap.bind(['command+p', 'ctrl+p'], function() {
            if (!$(e.target).is('input')) {
                settings.openSettings();
                return false;
            }
        });
        Mousetrap.bind(['command+s', 'ctrl+s'], function() {
            if (!$(e.target).is('input')) {
                M.toast({ html: 'No need to save! Flask is always saving your show.' });
                return false;
            }
        });

        return false;
    });

    $(document).keyup(function(e) {
        const key = keyboardMap[e.which];
        const code = e.which;

        if (key === 'CONTROL') {
            ctrl = false;
            $('#waveform').css('pointer-events', 'inherit');
        }
    });

    // Close/save sound settings when save key is pressed.
    $('#sound-settings-save').click(function(e) {
        settings.saveSoundSettings();
        // const itIsKeyInfo = settingsInfoObj === keyInfo;
        // settingsInfoObj[tempSoundInfo.id] = tempSoundInfo;
        // if (itIsKeyInfo) {
        //     $(`#${tempSoundInfo.id}`)
        //         .find('.audioName')
        //         .text(tempSoundInfo.name);
        //     pagesInfo[`page${currentPage}`].keyInfo = keyInfo;
        //     //storage.storeObj('pagesInfo', pagesInfo);
        // } else {
        //     $(`#${tempSoundInfo.id}`).text(tempSoundInfo.name);
        //     //storage.storeObj('playlistInfo', settingsInfoObj);
        // }
        // storage.saveShow();
    });

    $('#sound-settings-fadeInReset').click(function(e) {
        settings.resetFade('sound', 'in');
    });

    $('#sound-settings-fadeOutReset').click(function(e) {
        settings.resetFade('sound', 'out');
    });

    $('#volume-row').dblclick(function(e) {
        volSlider.noUiSlider.set(100);
    });

    $('#page-settings-fadeInReset').click(function(e) {
        settings.resetFade('page', 'in');
    });

    $('#page-settings-fadeOutReset').click(function(e) {
        settings.resetFade('page', 'out');
    });

    // Prevent firing sounds when editing input fields
    $('#sound-settings-modal, .input-field').keydown(function(e) {
        e.stopPropagation();
    });

    // Open dialog box when browse button is pressed.
    $('#browse-button').click(function(e) {
        util.openBrowse();
    });

    $('#sound-settings-color-container').click(function(e) {
        view.openColorPicker();
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

    $('.search').on('keyup', function() {
        let first = true;
        $('#playlist-songs li').each(function() {
            if ($(this).is(':visible') === true) {
                if (first === true) {
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
    setKeyEvents
};
