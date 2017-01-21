/*jshint esversion: 6 */
const fs = require("fs");
const jsPath = "./scripts/";
const clock = require(jsPath + "clock");
const colors = require(jsPath + 'colors');
const events = require(jsPath + 'events');
const sounds = require(jsPath + 'sounds');
const storage = require(jsPath + 'storage');
const util = require(jsPath + 'util');
const waveforms = require(jsPath + "waveforms");
const view = require(jsPath + 'view');

var pjson = require('../package.json');
const dialog = require('electron').remote.dialog;
const app = require('electron').remote.app;

var wavesurfer;
var keys;
var keyInfo = {};
var playlistInfo = {};
var sI;
var debug = 1;

/**
 * Set up program
 **/
$(document).ready(function() {

	view.buildKeyboard();		// Create all the keys
	view.buildPlaylist();		// Set up the playlist (no sounds)
	waveforms.buildWaveform();		// Set up the waveform
	$('.version').text(pjson.version);	// Add the version number to the "version" spans
	$('title').text('REACTion v' + pjson.version);	// Add the version number to the title
	createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin]);	// Default to HTML audio, not WebAudio (sigh)
	keyInfo = storage.getInfoObj("keyInfo", keyInfo);	// Load all of the key sounds
	playlistInfo = storage.getInfoObj("playlistInfo", playlistInfo);	// Load all of the playlist sounds
	events.setKeyEvents();	// Set up all the key presses/clicks/interaction
	clock.start();	// Start the clock
	colors.initializeKeyColors();	// Load all the key colors!

	$('.modal').modal();
	$('select').material_select();
	$(".menu-icon").sideNav({
		closeOnClick: true
	});
	// Set editable text properties
	$('.editable').editable(function(value, settings) {
		if (value === "") {
			return "Hit enter after typing!";
		} else {
			return value;
		}
	}, {
		type: 'text'
	});

	$('.global-settings-table').hide();
	$('.selectable').selectable({
		stop: function(){
				var selected = $('#settings-categories > .ui-selected').text().toLowerCase();
				console.log(selected);
				$('.global-settings-table').hide();
				$('#'+selected+"-table").show();
		}
	});

	// Set ability to move waveform region handles
	interact('#waveform-region')
		.resizable({
			preserveAspectRatio: false,
			edges: {
				left: true,
				right: true,
				bottom: false,
				top: false
			},
			restrict: {
				restriction: 'parent'
			}
		})
		.on('resizemove', function(event) {
			var target = event.target,
				x = (parseFloat(target.getAttribute('data-x')) || 0);
			// update the element's style
			target.style.width = event.rect.width + 'px';
			x += event.deltaRect.left;
			target.style.webkitTransform = target.style.transform =
				'translate(' + x + 'px, 0px)';
			target.setAttribute('data-x', x);
			$(event.target).css('transition', '0s');
		})
		.on('resizeend', function(event) {
			waveforms.getRegion();
			$(event.target).css('transition', '0.5s');
		});

	// Trigger file loaded event after each preloading
	createjs.Sound.on("fileload", sounds.fileLoaded);

});

function restart(){
	app.relaunch();
	app.quit();
}

window.onerror = function(msg, url, line, col, error) {
	var extra = !col ? '' : '\ncolumn: ' + col;
	extra += !error ? '' : '\nerror: ' + error;

	// You can view the information in an alert to see things working like this:
	dialog.showErrorBox('You broke REACTion :(', 'Please send this to the developer:\n' + msg + "\nurl: " + url + "\nline: " + line);
	//alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);

	var suppressErrorAlert = true;
	// If you return true, then error alerts (like in older versions of
	// Internet Explorer) will be suppressed.
	return suppressErrorAlert;
};

function blog(message) {
	if (debug === 1) {
		console.log(message);
	}
}
