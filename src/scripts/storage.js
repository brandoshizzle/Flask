/*	STORAGE.JS
 *	Handles all stroring and retreiving of information from localStorage
 */

/*jshint esversion: 6 */
const jetpack = require('fs-jetpack');
//const playlist = require('./scripts/playlist');
const app = require('electron').remote.app;
const dialog = require('electron').remote.dialog;

var appDir = app.getPath('userData');
$(function() {
    jetpack.dir(appDir).dir('data');
});
var dataDir = appDir + '\\data\\';

var defaults = {
    soundInfo: new sounds.SoundInfo(''),
    settings: {
        general: {
            prereleaseUpdates: false,
            stopSounds: false,
            markPlayed: true
        },
        playlist: {
            soundToBottomAfterPlay: true,
            soundDeleteAfterPlay: false,
            order: '',
            fadeInTime: 1500,
            fadeOutTime: 1500
        },
        pages: {
            soloSound: 'off',
            fadeInTime: 1500,
            fadeOutTime: 1500
        },
        utility: {
            pVersion: '0.1.0',
            legacy: false
        }
    },
    pageInfo: {
        name: '',
        fadeInTime: undefined,
        fadeOutTime: undefined,
        keyInfo: {}
    }
};

/**
 *	@desc: 	Loads an info object from JSON data and registers each sound
 *					Also prints the name of the song on the key in the view or creates
 *					a playlist item. Uses localStorage if it can't find JSON, returns an
 *					empty array if nothing is found
 *	@param: objName: Either 'keyInfo' or 'playlistInfo' (string)
 						obj: The actual object of objName
 */
function getInfoObj(objName) {
    var tempObj = {};
    var objPath = dataDir + objName + '.json';
    // Use JSON storage if it exists, otherwise pull from (legacy) localStorage
    if (jetpack.exists(objPath)) {
        tempObj = JSON.parse(jetpack.read(objPath));
    } else {
        console.log(objName + '.json does not exist. Using localStorage instead.');
        // Pull keyInfo string from localStorage
        var infoString = localStorage.getItem(objName);
        // Only parse it if it exists!
        if (infoString !== null) {
            tempObj = JSON.parse(infoString);
        }
    }
    //checkInfoObj(tempObj, objName);
    return tempObj; // Return the sucker
}

/**
 *	@desc: Save changed object to file
 *	@param: objName: The name of the object to be stored
 *					obj : The object being stringified and stored
 */
function storeObj(objName, obj) {
    // Clean soundInstances from storage
    var clonedObj = util.cloneObj(obj);
    if (objName === 'playlistInfo') {
        stripPlayState(clonedObj);
    } else if (objName === 'pagesInfo') {
        Object.keys(clonedObj).map(function(prop, index) {
            stripPlayState(clonedObj[prop].keyInfo);
        });
    }
    jetpack.writeAsync(dataDir + objName + '.json', clonedObj, {
        atomic: true
    });
    console.log('Storing new ' + objName + ' to json.');
}

function newShow(importingFromReaction) {
    // Show save dialog to send to file
    $('#startup-modal').modal('close');
    const saveOptions = {
        title: 'New Show',
        defaultPath: 'Show',
        buttonLabel: 'Create',
        filters: [{ name: 'Flask Shows', extensions: ['flask'] }]
    };
    return new Promise((resolve, reject) => {
        dialog.showSaveDialog(saveOptions, (filename, bookmark) => {
            if (filename === undefined) {
                reject('No file name entered');
                return;
            } else {
                userFilePath = filename;
                console.log(filename);
                // Initialize everything
                if (!importingFromReaction) {
                    clearShow();
                }
                saveShow();
                resolve(userFilePath);
            }
        });
    });
}

function clearShow() {
    showInfo = { pagesInfo: {}, playlistInfo: {}, settingsInfo: defaults.settings };
    pagesInfo = showInfo.pagesInfo;
    playlistInfo = showInfo.playlistInfo;
    settingsInfo = defaults.settings;
    keyInfo = {};

    // Clear playlist
    $('#playlist-songs').empty();

    // Clear waveform
    waveforms.reset();
    $('#resize-handle-left').hide();
    $('#resize-handle-right').hide();

    // Clear keyboards
    const keyboards = document.getElementById('keyboard-container').children;
    for (let i = 0; i < keyboards.length; i++) {
        const rows = keyboards[i].children;
        for (let j = 0; j < rows.length; j++) {
            const keys = rows[j].children;
            for (let k = 0; k < keys.length; k++) {
                const keyEl = keys[k];
                keyEl.children[1].innerHTML = '';
                keyEl.style.backgroundColor = 'var(--pM)';
                keyEl.style.boxShadow = '0px 4px 0px 0px var(--pD)';
                keyEl.classList.remove('played');
                keyEl.classList.remove('waveformed-key');
            }
        }
    }
    const tabs = document.getElementById('tabs').children;
    for (let i = 0; i < tabs.length - 1; i++) {
        tabs[i].children[0].children[0].innerHTML = 'Page ' + (i + 1);
    }
    dragSelect.clearSelection();
    M.Sidenav.getInstance($('.sidenav')).close();
}

function openShow() {
    $('#startup-modal').modal('close');
    const openOptions = {
        title: 'Open Show',
        filters: [{ name: 'Flask Shows', extensions: ['flask'] }],
        properties: ['openFile']
    };
    dialog.showOpenDialog(openOptions, filepaths => {
        userFilePath = filepaths[0];
        clearShow();
        loadShow(userFilePath);
    });
}

function saveShow() {
    let clonedPlaylistInfo = util.cloneObj(playlistInfo);
    let clonedPagesInfo = util.cloneObj(pagesInfo);
    let clonedSettingInfo = util.cloneObj(settingsInfo);
    stripPlayState(clonedPlaylistInfo);
    Object.keys(clonedPagesInfo).map(function(prop, index) {
        stripPlayState(clonedPagesInfo[prop].keyInfo);
    });
    const showInfo = {
        pagesInfo: clonedPagesInfo,
        playlistInfo: clonedPlaylistInfo,
        settingsInfo: clonedSettingInfo
    };
    if (userFilePath === undefined) {
        userFilePath = 'C:\\Users\\Brandon\\Documents\\Show.flask';
        console.log('set custom userpath');
    }
    jetpack.writeAsync(userFilePath, showInfo, {
        atomic: true
    });
    console.log('Saving show.');
    localStorage.setItem('lastOpenShow', userFilePath);
}

function importLegacy(version) {
    if (version == undefined) {
        $('#startup-modal').modal('close');
        view.showSettingsSection(document.getElementById('utility-menu-option'), 'settings-utilities');
        $('#settings-modal').modal('open');
        return;
    }
    let userData = app.getPath('userData');
    console.log(userData);
    if (version === 'REACTion') {
        userData = userData.split('\\');
        userData.pop();
        userData = userData.join('\\') + '\\REACTion\\data\\';
    } else {
        userData = userData + '\\data\\';
    }

    const pagesInfoPath = userData + 'pagesInfo.json';
    const playlistInfoPath = userData + 'playlistInfo.json';
    const settingsPath = userData + 'settings.json';
    if (jetpack.exists(pagesInfoPath) && jetpack.exists(playlistInfoPath) && jetpack.exists(settingsPath)) {
        pagesInfo = jetpack.read(pagesInfoPath, 'json');
        playlistInfo = jetpack.read(playlistInfoPath, 'json');
        settingsInfo = jetpack.read(settingsPath, 'json');
        settingsInfo.utility.legacy = true;
    } else {
        M.toast({
            html: 'At least one essential Legacy file is missing. Contact developer for help!',
            displayLength: 5000
        });
        return;
    }

    $('#import-success-modal').modal('open');
}

function importSuccess() {
    const newShowPromise = new Promise((res, rej) => {
        res(newShow(true));
    }).then(showPath => {
        M.Sidenav.getInstance($('.sidenav')).close();
        $('#import-legacy-modal').modal('close');
        M.toast({
            html: 'Import Successful! Restart Flask to load show.',
            displayLength: 5000
        });
    });
}

function deleteObj(objName) {
    jetpack.remove(dataDir + objName + '.json');
}

function emptyObj(objName, obj) {
    obj = {};
    //storeObj(objName, obj);
    saveShow();
}

/**
 *	@desc: Ensures that all loaded settings and soundInfos have the properties they need
 *				Called when loading stored keyInfo and settings
 *	@param: key: The letter (or character) of the key to check (string)
 */
function checkAgainstDefault(obj, defaultName) {
    var changed = false;
    // Update the object with any new properties
    Object.keys(defaults[defaultName]).map(function(prop, index) {
        if (!obj.hasOwnProperty(prop)) {
            obj[prop] = defaults[defaultName][prop];
        }
        if (
            typeof defaults[defaultName][prop] == 'object' &&
			defaults[defaultName][prop] !== null &&
			defaultName === 'settings'
        ) {
            Object.keys(defaults[defaultName][prop]).map(function(prop2, index) {
                if (!obj[prop].hasOwnProperty(prop2)) {
                    obj[prop][prop2] = defaults[defaultName][prop][prop2];
                }
            });
        }
    });

    // Check that the object does not have depreciated properties (and delete them)
    Object.keys(obj).map(function(prop, index) {
        if (!defaults[defaultName].hasOwnProperty(prop)) {
            delete obj[prop];
        }
        if (typeof obj[prop] == 'object' && obj[prop] !== null && defaultName === 'settings') {
            Object.keys(obj[prop]).map(function(prop2, index) {
                if (!defaults[defaultName][prop].hasOwnProperty(prop2)) {
                    delete obj[prop][prop2];
                }
            });
        }
    });
}

function stripPlayState(infoObj) {
    Object.keys(infoObj).map(function(prop, index) {
        delete infoObj[prop].howl;
    });
}

module.exports = {
    checkAgainstDefault: checkAgainstDefault,
    deleteObj: deleteObj,
    emptyObj: emptyObj,
    getInfoObj: getInfoObj,
    importLegacy: importLegacy,
    importSuccess: importSuccess,
    newShow: newShow,
    openShow: openShow,
    saveShow: saveShow,
    storeObj: storeObj
};
