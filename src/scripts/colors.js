var pickedColor;

function setKeyColor(soundInfo) {
	var color;
	if (pickedColor !== "default") {
		color = makeColor(pickedColor);
	} else {
		color = "var(--pM)";
	}
	$('#' + soundInfo.id).css("background-color", color);
	soundInfo.color = pickedColor;
}

function initializeKeyColors() {
	Object.keys(keyInfo).map(function(id, index) {
		var color;
		var soundInfo = keyInfo[id];
		if (soundInfo.color !== "default") {
			color = makeColor(soundInfo.color);
			$('#' + soundInfo.id).css("background-color", color);
		}
	});
}

function setColorPickerColors() {
	$("#color-picker div").each(function() {
		var color = makeColor(this.id.replace("color-", ""));
		$(this).css("background-color", color);
	});
}

function setPickedColor(id) {
	pickedColor = id.replace("color-", "");
	$('#sound-settings-color').css("background-color", makeColor(pickedColor));
}

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
