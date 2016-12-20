function loadSavedSounds() {
	// Pull keyInfo string from localStorage
	var keyInfoString = localStorage.getItem("keyInfo");
	// Only parse it if it exists!
	if (keyInfoString != null) {
		keyInfo = JSON.parse(keyInfoString);
		console.log(keyInfo);

		Object.keys(keyInfo).map(function(key, index) {
			// Print the name of each sound on it's corresponding key
			$("#" + key).text(keyInfo[key].name);
			// Register sound with SoundJS
			registerSound(key);
		});
	}
}

function registerSound(key) {
	// Check if path to sound file exists
	if (fs.existsSync(keyInfo[key].path)) {
		// Register sound with SoundJS
		createjs.Sound.registerSound({
			id: keyInfo[key].name,
			src: keyInfo[key].path
		});
	} else {
		// Let the user know with a toast
		Materialize.toast(keyInfo[key].name + " was NOT loaded.", 4000);
		$("#" + key).parent().addClass("soundNotLoaded");
	}
}

function fileLoaded(song) {
	// A sound has been preloaded.
	console.log("Preloaded:", song.id);
}

module.exports = {
	loadSavedSounds: loadSavedSounds,
	register: registerSound,
	fileLoaded: fileLoaded
}
