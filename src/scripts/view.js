/* VIEW.JS
 *  Handles generation of elements that are dynamically loaded.
 */

var specialKeys = {
	'-': 'MINUS',
	'+': 'EQUALS',
	'[': 'OPEN_BRACKET',
	']': 'CLOSE_BRACKET',
	';': 'SEMICOLON',
	"'": 'QUOTE',
	"\\": 'BACK_SLASH',
	"|": "BESIDE_Z",
	',': 'COMMA',
	'.': 'PERIOD',
	'/': 'SLASH'
};

// Create keyboard buttons
function buildKeyboard() {
	var rows = [
		['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '+'],
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", "\\"],
		['|', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', ]
	];
	var id;
	for(var kbNum = 1; kbNum < 9; kbNum++){
		for (var i = 0; i < rows.length; i++) {
			var rowNum = i + 1;
			for (var j = 0; j < rows[i].length; j++) {
				id = "page" + kbNum + "_" + rows[i][j];
				// Check whether it's a special key, and if so, replace it with the written version
				if (specialKeys.hasOwnProperty(rows[i][j])) {
					id = "page" + kbNum + "_" + specialKeys[rows[i][j]];
				}
				// Create the key
				$('#keyboard'+ kbNum + ' > #row' + rowNum).append("<div class='btn btn-key z-depth-4 waves-effect waves-light draggable droppable' id='" + id + "'><div class='keyLetter'>" + rows[i][j] + "</div><div class='audioName'></div></div>");
			}
		}
	}
	keys = $('.btn-key'); // set keys to be an array of the audioName divs
}

/**
 *	@desc:	Creates a new element on the playlist
 *	@param:	soundInfo: The soundInfo object
 */
function createPlaylistItem(soundInfo) {
	var afterThisSound = false;
	$('#playlist-songs li').each(function(){
		if($(this).hasClass('played')){
			afterThisSound = this;
			return false;
		}
	});
	var liString = "<li class='z-depth-4 playlistSound' id='" + soundInfo.id + "'>" + soundInfo.name + "</li>";
	if(!afterThisSound){
		$('#playlist-songs').append(liString);
		return;
	}
	$(afterThisSound).before(liString);
}

// Open about modal
function openAbout() {
	$('#about-modal').modal('open');
}

// Open color picker sub menu
function openColorPicker() {
	var position = $("#sound-settings-color-container").position();
	$("#color-picker").css('top', position.top);
	$("#color-picker").css('left', position.left);
	$("#color-picker").fadeIn();
}

function updateKey(soundInfo){
	if(soundInfo.hasOwnProperty('name')){
		$('#' + soundInfo.id).find('.audioName').text(soundInfo.name);
	}
	var openColor = colors.makeColor(soundInfo.color);
	var darkOpenColor = colors.makeColor(soundInfo.color, true);
	$('#' + soundInfo.id).css("background-color", openColor).css("box-shadow", "0px 4px 0px 0px " + darkOpenColor);
}

module.exports = {
	buildKeyboard: buildKeyboard,
	createPlaylistItem: createPlaylistItem,
	openAbout: openAbout,
	openColorPicker: openColorPicker,
	updateKey: updateKey
};
