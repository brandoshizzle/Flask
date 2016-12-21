/* VIEW.JS
*  Handles generation of elements that are dynamically loaded.
*  Functions:
			buildKeyboard
			buildTransList
			buildWaveform
*/
// Create keyboard buttons
function buildKeyboard() {
	var rows = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', "["],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"],
		['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', ]
	];
	for (var i = 0; i < rows.length; i++) {
		var rowNum = i + 1;
		for (var j = 0; j < rows[i].length; j++) {
			$('#row' + rowNum).append("<div class='btn btn-key z-depth-4 waves-effect waves-light'><div class='keyLetter'>" + rows[i][j] + "</div><div id='" + rows[i][j] + "' class='audioName'></div></div>");
		}
	}
	keys = $('.audioName'); // set keys to be an array of the audioName divs
};

function buildTransList() {
	var el = document.getElementById('transition-songs');
	var sortable = Sortable.create(el, {
		animation: 150
	});
}

function buildWaveform() {
	// Create wavesurfer instance
	wavesurfer = WaveSurfer.create({
		container: '#waveform',
		waveColor: '#ffeb3b',
		progressColor: '#ffd600',
	});
	wavesurfer.empty();
}

function openSoundSettings(key) {
	var idStart = "#sound-settings-";
	var soundProps = keyInfo[key];
	$(idStart + "name").text(soundProps.name);
	$(idStart + "path").val(soundProps.path);
	if (soundProps.loop == true) {
		$(idStart + "loop").attr("checked", "checked");
	} else {
		$(idStart + "loop").removeAttr("checked");
	}
	$('#sound-settings').modal('open');
}

module.exports = {
	buildKeyboard: buildKeyboard,
	buildTransitionsList: buildTransList,
	buildWaveform: buildWaveform,
	openSoundSettings: openSoundSettings
};
