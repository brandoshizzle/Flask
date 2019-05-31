/*	COLOURS.JS
 *	Manages all things related to changing or setting colors
 */

var pickedColor; // The colour chosen in the sound settings menu
const colorList = {
    '#339af0': 'blue',
    '#f03e3e': 'red',
    '#d6336c': 'pink',
    '#ae3ec9': 'grape',
    '#7048e8': 'violet',
    '#1098ad': 'cyan',
    '#0ca678': 'teal',
    '#74b816': 'lime',
    '#f59f00': 'yellow',
    '#f76707': 'orange',
    '#495057': 'gray'
};

/**
 *	@desc:	Sets the color of the key that was changed in the sound settings
 *	@param:	soundInfo: The information object of the affected key
 */
function setKeyColor(soundInfo) {
    var openColor = makeColor(pickedColor);
    var darkOpenColor = makeColor(pickedColor, true);
    $('#' + soundInfo.id)
        .css('background-color', openColor)
        .css('box-shadow', '0px 4px 0px 0px ' + darkOpenColor);
    soundInfo.color = pickedColor;
}

/**
 *	@desc:	Sets the color of the keys on startup
 *	@param:	N/A
 */
function initializeKeyColors() {
    Object.keys(pagesInfo).map(function(id, index) {
        var tempKeyInfo = pagesInfo[id].keyInfo;
        Object.keys(tempKeyInfo).map(function(id, index) {
            var soundInfo = tempKeyInfo[id];
            var openColor = makeColor(soundInfo.color);
            var darkOpenColor = makeColor(soundInfo.color, true);
            $('#' + soundInfo.id)
                .css('background-color', openColor)
                .css('box-shadow', '0px 4px 0px 0px ' + darkOpenColor);
        });
    });
}

/**
 *	@desc:	Sets the color of the color-picker in the sound settings menu
 *	@param:	color: The color to change to, taken from the id of the clicked element
 *									ex. 'color-blue', 'color-pink'
 */
function setColorPickerColors() {
    $('#color-picker option').each(function() {
        var color = makeColor(this.innerHTML.toLowerCase);
        $(this).css('background-color', color);
    });
}

/**
 *	@desc:	Sets the color of the color-picker in the sound settings menu
 *	@param:	color: The color to change to, taken from the id of the clicked element
 *									ex. 'color-blue', 'color-pink'
 */
function setPickedColor() {
    var pickedHex = $('select[name="colorpicker"]').val();
    pickedColor = colorList[pickedHex];
}

/**
 *	@desc:	Takes a color name and turns it into an Open Color format
 *	@param:	colorStr: The color string (ex. 'blue', 'pink')
 */
function makeColor(colorStr, darkBool) {
    var dark = darkBool || false;
    if (colorStr === 'blue' || colorStr === 'default') {
        if (dark) {
            return 'var(--pD)';
        }
        return 'var(--pM)';
    }
    if (dark) {
        var num = colorStr === 'gray' ? 8 : 9;
        return 'var(--oc-' + colorStr + '-' + num + ')';
    }
    return 'var(--oc-' + colorStr + '-7)';
}

function loadColorIntoSoundSettings(colorName) {
    let colorHEX = '';
    if (colorName === 'default') {
        colorHEX = '#339af0';
    } else {
        colorHEX = Object.entries(colorList).find(arr => {
            return arr[1] === colorName;
        })[0];
    }
    pickedColor = colorName;
    $('select[name="colorpicker"]').simplecolorpicker('selectColor', colorHEX);
}

module.exports = {
    setKeyColor: setKeyColor,
    initializeKeyColors: initializeKeyColors,
    setColorPickerColors: setColorPickerColors,
    makeColor: makeColor,
    setPickedColor: setPickedColor,
    loadColorIntoSoundSettings: loadColorIntoSoundSettings
};
