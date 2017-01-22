/*	STORAGE.JS
 *	Handles all stroring and retreiving of information from localStorage
 */

/*jshint esversion: 6 */
const soundInfoManager = require("./soundInfoManager");
const jetpack = require('fs-jetpack');

/**
 *	@desc: 	Loads an info object from JSON data and registers each sound
 *					Also prints the name of the song on the key in the view or creates
 *					a playlist item. Uses localStorage if it can't find JSON
 *	@param: objName: Either 'keyInfo' or 'playlistInfo' (string)
 						obj: The actual object of objName
 */
function getInfoObj(objName, obj) {
	var tempObj = {};
	var appDir = app.getPath('userData');
	jetpack.dir(appDir).dir('data');
	var objPath = appDir + '\\data\\' + objName + '.json';
	// Use JSON storage if it exists, otherwise pull from (legacy) localStorage
	if(jetpack.exists(objPath)){
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

	if(objName === 'settings'){
		settingsjs.checkSettings(tempObj);
	}

	// Do the registering and checking and junk
	if(objName === 'playlistInfo' || objName === 'keyInfo'){
		Object.keys(tempObj).map(function(id, index) {
			// Ensure all parameters are up to date
			soundInfoManager.checkSoundInfo(tempObj[id].id, obj);
			if (objName === 'keyInfo') {
				// Print the name of each sound on it's corresponding key
				$("#" + tempObj[id].id).find('.audioName').text(tempObj[id].name);
			} else if (objName === 'playlistInfo') {
				view.createPlaylistItem(tempObj[id]);
			}
			// Register sound with SoundJS
			sounds.register(tempObj[id]);
		});
	}

	return tempObj; // Return the sucker
}

/**
 *	@desc: Save changed object to local storage
 *	@param: keyName: The name of the localStorage object
 *					obj : The object being stringified and stored
 */
function storeObj(objName, obj) {
	var appDir = app.getPath('userData');
	jetpack.dir(appDir).dir('data');
	var dataDir = appDir + '\\data\\';
	console.log(dataDir + objName);
	jetpack.writeAsync(dataDir + objName + '.json', obj, {
		atomic: true
	});
	console.log('Storing new ' + objName + ' to json.');
	/* Old localStorage
		var objString = JSON.stringify(obj);
		localStorage.setItem(keyName, objString);
		blog("Stored new " + keyName + " settings!");
	} */
}

module.exports = {
	getInfoObj: getInfoObj,
	storeObj: storeObj
};
