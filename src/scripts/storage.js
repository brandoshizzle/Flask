/*	STORAGE.JS
 *	Handles all stroring and retreiving of information from localStorage
 */

/*jshint esversion: 6 */
const soundInfoManager = require("./soundInfoManager");
const jetpack = require('fs-jetpack');
const app = require('electron').remote.app;

var appDir = app.getPath('userData');
$(function(){
	jetpack.dir(appDir).dir('data');
});
var dataDir = appDir + '\\data\\';

var defaults = {
	'soundInfo': sounds.defaultSoundInfo(),
	'settings' : {
		'general':{
			'prereleaseUpdates': false,
			'stopSounds': false
		},
		'playlist':{
			"soundToBottomAfterPlay": true,
			"soundDeleteAfterPlay": false
		},
		'keyboard':{
		}
	},
	'pageInfo' : {
		'name': '',
		'keyInfo': {}
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
	//checkInfoObj(tempObj, objName);
	return tempObj; // Return the sucker
}

/**
 *	@desc: Save changed object to local storage
 *	@param: keyName: The name of the localStorage object
 *					obj : The object being stringified and stored
 */
function storeObj(objName, obj) {
	// Clean soundInstances from storage
	var clonedObj = util.cloneObj(obj);
	console.log(clonedObj);
	if(objName === 'playlistInfo'){
		stripPlayState(clonedObj);
	} else if(objName === 'pagesInfo'){
		Object.keys(clonedObj).map(function(prop, index) {
			stripPlayState(clonedObj[prop].keyInfo);
		});
	}
	console.log(dataDir + objName);
	jetpack.writeAsync(dataDir + objName + '.json', clonedObj, {
		atomic: true
	});
	console.log('Storing new ' + objName + ' to json.');
}

function deleteObj(objName){
	jetpack.remove(dataDir + objName + '.json');
}

function emptyObj(objName, obj){
	obj = {};
	storeObj(objName, obj);
}

function checkAgainstDefault(obj, defaultName) {
	var changed = false;
	// Update the object with any new properties
	Object.keys(defaults[defaultName]).map(function(prop, index) {
		if (!obj.hasOwnProperty(prop)) {
			obj[prop] = defaults[defaultName][prop];
		}
	});

	// Check that the object does not have depreciated properties (and delete them)
	Object.keys(obj).map(function(prop, index) {
		if (!defaults[defaultName].hasOwnProperty(prop)) {
			delete obj[prop];
		}
	});
}

function stripPlayState(infoObj){
	Object.keys(infoObj).map(function(prop, index) {
		delete infoObj[prop].howl;
	});
}

module.exports = {
	getInfoObj: getInfoObj,
	storeObj: storeObj,
	deleteObj: deleteObj,
	checkAgainstDefault: checkAgainstDefault,
	emptyObj: emptyObj
};
