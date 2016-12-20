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
	try { // test whether the key exists in the info array
		var test = keyInfo[key].name;
	} catch (err) { // if it doesn't, create it with empty variables
		keyInfo[key] = {
			"key": key,
			"name": "",
			"path": ""
		}
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
	cleanName: cleanName
}
