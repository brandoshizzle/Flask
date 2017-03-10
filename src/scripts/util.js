/* UTIL.JS
 * These functions deal with minor tasks that help others, mostly
 * Functions:
 *		storeObj, checkKeyInfo, loadKeyInfo, cleanName
 */
/*jshint esversion: 6 */
const dialog = require('electron').remote.dialog;
var clipboard;

/**
 *	@desc: Creates the default name for a new song dragged in
 *	@param: name: The uncleaned file name
 *	@return: The initial name without the file type ending
 */
function cleanName(name) {
	name = name.toString();
	var pos = name.lastIndexOf("\\");
	if (pos > -1) {
		name = name.substring(pos + 1);
	}
	pos = name.lastIndexOf(".");
	return name.substring(0, pos);
}

/**
 *	@desc: Replaces all forbidden characters in id names
 *	@param: str: The uncleaned name
 *	@return: The prepared name
 */
function prepareForId(str) {
	var replaced = str.replace(/ /g, '_').replace(/[{()}',.]/g, '').replace(/[&]/g, 'and');
	return replaced;
}

/**
 *	@desc: Opens a browser window for the sound settings menu
 *	@param: none
 */
function openBrowse() {
	var currentPath = $('#sound-settings-path').val();
	var options = {
		title: 'Replace Sound File',
		defaultPath: currentPath,
		filters: [{
			name: '*.wav, *.mp3, *.m4a, *.wma, *ogg',
			extensions: ['wav', 'mp3', 'm4a', 'mp4', 'wma', 'ogg']
		}],
		properties: ['openFile']
	};
	var newPath = dialog.showOpenDialog(options);
	if (newPath !== undefined) {
		$('#sound-settings-path').val(newPath);
		$('#sound-settings-name').text(cleanName(newPath));
	}
}

/**
 *	@desc: Creates a copy of an object through sneaky JSON tricks
 *	@param: obj: The object to clone
 *	@return: A duplicate of that object
 */
function cloneObj(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function copyKey(copiedSoundInfo){
	clipboard = cloneObj(copiedSoundInfo);
	console.log('copied ' + copiedSoundInfo);
}

function cutKey(cutSoundInfo){
	clipboard = cloneObj(cutSoundInfo);
	var id = cutSoundInfo.id;
	$('#' + id).removeClass('played');
	var openColor = colors.makeColor('default');
	$('#' + id).css("background-color", openColor);
	$('#' + id).find('.audioName').text('');
	delete keyInfo[cutSoundInfo.id];
	//pagesInfo[currentPage].keyInfo = keyInfo;
}

function pasteKey(destinationSoundInfo){
	var id = destinationSoundInfo.id;
	destinationSoundInfo = clipboard;
	destinationSoundInfo.id = id;
	keyInfo[destinationSoundInfo.id] = destinationSoundInfo;
	view.updateKey(keyInfo[destinationSoundInfo.id]);
	sounds.register(keyInfo[destinationSoundInfo.id]);
	console.log(keyInfo);
}

module.exports = {
	cleanName: cleanName,
	prepareForId: prepareForId,
	openBrowse: openBrowse,
	cloneObj: cloneObj,
	isEmpty: isEmpty,
	copyKey: copyKey,
	cutKey: cutKey,
	pasteKey: pasteKey
};
