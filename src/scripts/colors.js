/*	COLOURS.JS
 *	Manages all things related to changing or setting colors
 */

var pickedColor; // The colour chosen in the sound settings menu

/**
 *	@desc:	Sets the color of the key that was changed in the sound settings
 *	@param:	soundInfo: The information object of the affected key
 */
function setKeyColor(soundInfo) {
	var openColor = makeColor(pickedColor);
	$('#' + soundInfo.id).css("background-color", openColor);
	soundInfo.color = pickedColor;
}

/**
 *	@desc:	Sets the color of the keys on startup
 *	@param:	N/A
 */
function initializeKeyColors() {
	Object.keys(pagesInfo).map(function(id, index){
		var tempKeyInfo = pagesInfo[id].keyInfo;
		Object.keys(tempKeyInfo).map(function(id, index) {
			var soundInfo = tempKeyInfo[id];
			var openColor = makeColor(soundInfo.color);
			$('#' + soundInfo.id).css("background-color", openColor);
		});
	});
}

/**
 *	@desc:	Sets the color of the color-picker in the sound settings menu
 *	@param:	color: The color to change to, taken from the id of the clicked element
 *									ex. 'color-blue', 'color-pink'
 */
function setColorPickerColors() {
	$("#color-picker div").each(function() {
		var color = makeColor(this.id.replace("color-", ""));
		$(this).css("background-color", color);
	});
}

/**
 *	@desc:	Sets the color of the color-picker in the sound settings menu
 *	@param:	color: The color to change to, taken from the id of the clicked element
 *									ex. 'color-blue', 'color-pink'
 */
function setPickedColor(color) {
	pickedColor = color.replace("color-", "");
	$('#sound-settings-color').css("background-color", makeColor(pickedColor));
}

/**
 *	@desc:	Takes a color name and turns it into an Open Color format
 *	@param:	colorStr: The color string (ex. 'blue', 'pink')
 */
function makeColor(colorStr) {
	if (colorStr === "default") {
		return "var(--pM)";
	}
	return "var(--oc-" + colorStr + "-7)";
}

module.exports = {
	setKeyColor: setKeyColor,
	initializeKeyColors: initializeKeyColors,
	setColorPickerColors: setColorPickerColors,
	makeColor: makeColor,
	setPickedColor: setPickedColor
};
