/********************************
 * Save changes to local storage
 *******************************/
function storeObj(keyName, obj) {
	var objString = JSON.stringify(obj);
	localStorage.setItem(keyName, objString);
	console.log("Stored new " + keyName + " settings!");
}

/***
 * Check Key Info Object
 **/
function checkKeyInfo(key) {
	var chosenKey = keyInfo[key];
	var defaultArray = {
		"key": key,
		"name": "",
		"path": "",
		"autoplay": false
	};
	// Check that the key has all properties - set default if it doesn't have it.
	Object.keys(
		defaultArray).map(function(prop, index) {
		if (!keyInfo[key].hasOwnProperty(prop)) {
			keyInfo[key][prop] = defaultArray[prop];
		}
	});

	// Check that the key does not have depreciated properties (and delete them)
	Object.keys(chosenKey).map(function(prop, index) {
		if (!defaultArray.hasOwnProperty(prop)) {
			delete keyInfo[key][prop];
		}
	});

}

function loadKeyInfo() {
	// Pull keyInfo string from localStorage
	var keyInfoString = localStorage.getItem("keyInfo");
	// Only parse it if it exists!
	if (keyInfoString != null) {
		keyInfo = JSON.parse(keyInfoString);
		console.log(keyInfo);
		Object.keys(keyInfo).map(function(key, index) {
			// Ensure all parameters are up to date
			checkKeyInfo(key);
			// Print the name of each sound on it's corresponding key
			$("#" + key).text(keyInfo[key].name);
			// Register sound with SoundJS
			sounds.register(key);
		});
	}
}

// Name Cleaner
function cleanName(name) {
	var pos = name.lastIndexOf(".");
	return name.substring(0, pos);
}


module.exports = {
	storeObj: storeObj,
	checkKeyInfo: checkKeyInfo,
	loadKeyInfo: loadKeyInfo,
	cleanName: cleanName
}
