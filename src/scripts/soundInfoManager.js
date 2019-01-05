/*jshint esversion: 6 */
const sounds = require("./sounds");
var defaultSoundInfo = sounds.defaultSoundInfo();

/**
 *	@desc:	Takes a path and (optional) id and returns a default soundInfo object
 *	@param:	path: the complete path to the sound file
 			id: (optional) The id for the sound. Defaults to default name
 */
function createNewSoundInfo(path, id) {
	// Get template
	var newSoundInfo = util.cloneObj(defaultSoundInfo);
	//storage.checkAgainstDefault(tempObj, 'soundInfo');
	// Write new specific info
	newSoundInfo.name = util.cleanName(path);
	newSoundInfo.id = id || util.prepareForId(tempObj.name);
	newSoundInfo.path = path;

	// Define which section it is part of - id will be undefined if it's in the playlist
	if(id === undefined){
		// New sound is in the playlist
		newSoundInfo.infoObj = "playlist";
		// Create a unique id for the playlist item (to allow multiple of same!)
		var count = 0;
		var duplicate, tempId;
		do {
			duplicate = false;
			tempId = (count > 0) ? newSoundInfo.id + count : newSoundInfo.id;
			for (var item in playlistInfo) {
				if(playlistInfo[item].id == tempId){
					duplicate = true;
					count++;
					break;
				}
			}
		} while (duplicate);
		newSoundInfo.id = (count > 0) ? tempId : newSoundInfo.id;

	} else {
		// New sound is in the pages
		newSoundInfo.infoObj = "key";
	}
	// Create howl instance
	sounds.createNewHowl(newSoundInfo);
	return newSoundInfo;
}

module.exports = {
	createNewSoundInfo: createNewSoundInfo,
};
