var defaultSoundInfo = {
	"id": "",
	"name": "",
	"path": "",
	"color": "default",
	"loop": false,
	"startTime": 0,
	"endTime": null,
	"soundInstance": undefined
};

/**
 *	@desc:	Takes a path and (optional) id and returns a default soundInfo object
 *	@param:	path: the complete path to the sound file
 						id: (optional) The id for the sound. Defaults to default name
 */
function createSoundInfoFromPath(path, id) {
	var tempObj = util.cloneObj(defaultSoundInfo);
	// Write known info
	tempObj.name = util.cleanName(path);
	tempObj.id = id || tempObj.name;
	tempObj.path = path;
	sounds.register(tempObj);
	tempObj.endTime = sounds.getDuration(tempObj);
	return tempObj;
}

module.exports = {
	createSoundInfoFromPath: createSoundInfoFromPath
};
